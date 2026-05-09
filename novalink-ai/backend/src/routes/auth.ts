import { Router, Request, Response } from 'express'
import bcryptjs from 'bcryptjs'
import User from '@models/User'
import { generateToken } from '@utils/jwt'
import { logger } from '@utils/logger'

const router = Router()

interface RegisterBody {
  username: string
  email: string
  password: string
}

interface LoginBody {
  email: string
  password: string
}

// Register
router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id.toString())

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        preferences: user.preferences,
        stats: user.stats,
      },
    })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    // Find user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user._id.toString())

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
        xp: user.xp,
        level: user.level,
      },
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
