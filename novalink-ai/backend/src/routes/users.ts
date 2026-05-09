import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '@middleware/auth'
import User from '@models/User'
import { logger } from '@utils/logger'

const router = Router()

// Get user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        verified: user.verified,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        stats: user.stats,
        preferences: user.preferences,
      },
    })
  } catch (error) {
    logger.error('Error fetching profile:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update user profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { username, bio, avatar, preferences } = req.body

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(username && { username }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
        ...(preferences && { preferences }),
      },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ message: 'Profile updated successfully', user })
  } catch (error) {
    logger.error('Error updating profile:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Get user by ID
router.get('/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        verified: user.verified,
        level: user.level,
        badges: user.badges,
        stats: user.stats,
      },
    })
  } catch (error) {
    logger.error('Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export default router
