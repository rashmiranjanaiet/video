import express, { Express, Request, Response, NextFunction } from 'express'
import http from 'http'
import socketIo, { Socket } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { randomUUID } from 'crypto'
import { logger } from '@utils/logger'
import { verifyToken } from '@utils/jwt'
import User from '@models/User'

// Load environment variables
dotenv.config()

// Initialize Express
const app: Express = express()
const server = http.createServer(app)

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`CORS blocked origin: ${origin}`))
  },
  credentials: true,
}

const io = new socketIo.Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
})

// Middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'NovaLink AI Backend',
    status: 'ok',
    health: '/health',
  })
})

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// Database Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/novalink'
    await mongoose.connect(mongoUri)
    logger.info('MongoDB connected successfully')
  } catch (error) {
    logger.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// API Routes
import authRoutes from '@routes/auth'
import userRoutes from '@routes/users'
import chatRoutes from '@routes/chat'
import matchRoutes from '@routes/match'
import adminRoutes from '@routes/admin'

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/match', matchRoutes)
app.use('/api/admin', adminRoutes)

interface WaitingUser {
  socketId: string
  userId: string
  username: string
}

const waitingUsers: WaitingUser[] = []
const activeRooms = new Map<string, Set<string>>()

const removeFromQueue = (socketId: string) => {
  const index = waitingUsers.findIndex((user) => user.socketId === socketId)
  if (index >= 0) {
    waitingUsers.splice(index, 1)
  }
}

const leaveActiveRooms = (socket: Socket) => {
  activeRooms.forEach((members, roomId) => {
    if (!members.has(socket.id)) return

    members.delete(socket.id)
    socket.leave(roomId)
    socket.to(roomId).emit('partner-left')

    if (members.size === 0) {
      activeRooms.delete(roomId)
    }
  })
}

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token
    const guestName = socket.handshake.auth?.guestName

    if (token) {
      const decoded = verifyToken(token)
      const user = await User.findById(decoded.userId).select('username')

      socket.data.user = {
        userId: decoded.userId,
        username: user?.username || 'NovaLink User',
      }
    } else {
      socket.data.user = {
        userId: `guest:${socket.id}`,
        username: guestName || 'Guest',
      }
    }

    next()
  } catch (error) {
    next(new Error('Invalid socket token'))
  }
})

// Socket.io Events
io.on('connection', (socket: Socket) => {
  logger.info(`User connected: ${socket.id}`)

  socket.on('find-random-match', () => {
    removeFromQueue(socket.id)

    const currentUser: WaitingUser = {
      socketId: socket.id,
      userId: socket.data.user.userId,
      username: socket.data.user.username,
    }

    const partner = waitingUsers.shift()
    if (!partner) {
      waitingUsers.push(currentUser)
      socket.emit('waiting-for-match')
      return
    }

    const roomId = `room-${randomUUID()}`
    const partnerSocket = io.sockets.sockets.get(partner.socketId)

    if (!partnerSocket) {
      socket.emit('waiting-for-match')
      waitingUsers.push(currentUser)
      return
    }

    socket.join(roomId)
    partnerSocket.join(roomId)
    activeRooms.set(roomId, new Set([socket.id, partnerSocket.id]))

    partnerSocket.emit('random-match-found', {
      roomId,
      initiator: true,
      remoteUser: {
        userId: currentUser.userId,
        username: currentUser.username,
      },
    })

    socket.emit('random-match-found', {
      roomId,
      initiator: false,
      remoteUser: {
        userId: partner.userId,
        username: partner.username,
      },
    })
  })

  socket.on('cancel-random-match', () => {
    removeFromQueue(socket.id)
  })

  // Join room
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-joined', { userId: socket.id })
  })

  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId)
    socket.to(roomId).emit('partner-left')
    activeRooms.delete(roomId)
  })

  socket.on('webrtc-signal', (data: { roomId: string; signal: any }) => {
    socket.to(data.roomId).emit('webrtc-signal', {
      from: socket.id,
      signal: data.signal,
    })
  })

  // Offer signal
  socket.on('offer', (data: any) => {
    socket.broadcast.to(data.roomId).emit('offer', {
      from: socket.id,
      offer: data.offer,
    })
  })

  // Answer signal
  socket.on('answer', (data: any) => {
    socket.broadcast.to(data.roomId).emit('answer', {
      from: socket.id,
      answer: data.answer,
    })
  })

  // ICE candidate
  socket.on('ice-candidate', (data: any) => {
    socket.broadcast.to(data.roomId).emit('ice-candidate', {
      from: socket.id,
      candidate: data.candidate,
    })
  })

  // Chat message
  socket.on('chat-message', (data: any) => {
    socket.broadcast.to(data.roomId).emit('chat-message', {
      from: socket.id,
      message: data.message,
      timestamp: Date.now(),
    })
  })

  // Disconnect
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`)
    removeFromQueue(socket.id)
    leaveActiveRooms(socket)
  })
})

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// 404 handling
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start Server
const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB()
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`WebSocket server initialized`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()

export { app, server, io }
