import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here'
const JWT_EXPIRE = (process.env.JWT_EXPIRE || '7d') as SignOptions['expiresIn']

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export const decodeToken = (token: string): any => {
  return jwt.decode(token)
}
