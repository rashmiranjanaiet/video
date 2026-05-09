import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@utils/jwt'

export interface AuthRequest extends Request {
  userId?: string
  user?: any
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyToken(token)
    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (token) {
      const decoded = verifyToken(token)
      req.userId = decoded.userId
    }
    next()
  } catch (error) {
    next()
  }
}
