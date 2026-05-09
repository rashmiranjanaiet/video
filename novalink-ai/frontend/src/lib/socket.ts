import io, { Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

let socket: Socket | null = null

export const initializeSocket = (token?: string | null, guestName?: string): Socket => {
  if (socket) return socket

  socket = io(SOCKET_URL, {
    auth: {
      token: token || undefined,
      guestName,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id)
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export const getSocket = (): Socket | null => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export default socket
