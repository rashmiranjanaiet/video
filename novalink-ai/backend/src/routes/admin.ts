import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '@middleware/auth'
import User from '@models/User'
import Report from '@models/Report'
import Match from '@models/Match'
import { logger } from '@utils/logger'

const router = Router()

// Verify admin role (middleware)
const verifyAdmin = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  } catch (error) {
    res.status(403).json({ error: 'Unauthorized' })
  }
}

// Get platform stats
router.get('/stats', authMiddleware, verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalMatches = await Match.countDocuments()
    const pendingReports = await Report.countDocuments({ status: 'pending' })
    const bannedUsers = await User.countDocuments({ 'settings.banned': true })

    res.json({
      stats: {
        totalUsers,
        totalMatches,
        pendingReports,
        bannedUsers,
        activeChats: 0,
        revenue: 0,
      },
    })
  } catch (error) {
    logger.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Get all users
router.get('/users', authMiddleware, verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50, offset = 0 } = req.query

    const users = await User.find()
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string))
      .sort({ createdAt: -1 })

    const total = await User.countDocuments()

    res.json({
      users,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    })
  } catch (error) {
    logger.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Ban user
router.post('/users/:userId/ban', authMiddleware, verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body

    await User.findByIdAndUpdate(req.params.userId, {
      'settings.banned': true,
      'settings.banReason': reason,
      'settings.bannedAt': new Date(),
    })

    res.json({ message: 'User banned successfully' })
  } catch (error) {
    logger.error('Error banning user:', error)
    res.status(500).json({ error: 'Failed to ban user' })
  }
})

// Unban user
router.post('/users/:userId/unban', authMiddleware, verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      'settings.banned': false,
    })

    res.json({ message: 'User unbanned successfully' })
  } catch (error) {
    logger.error('Error unbanning user:', error)
    res.status(500).json({ error: 'Failed to unban user' })
  }
})

// Get reports
router.get('/reports', authMiddleware, verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status = 'pending', limit = 50, offset = 0 } = req.query

    const reports = await Report.find({
      ...(status && { status }),
    })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string))
      .sort({ createdAt: -1 })

    const total = await Report.countDocuments(
      status ? { status } : {}
    )

    res.json({
      reports,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    })
  } catch (error) {
    logger.error('Error fetching reports:', error)
    res.status(500).json({ error: 'Failed to fetch reports' })
  }
})

// Update report status
router.put('/reports/:reportId', authMiddleware, verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, actionTaken } = req.body

    const report = await Report.findByIdAndUpdate(
      req.params.reportId,
      {
        status,
        actionTaken,
        resolvingAdminId: req.userId,
      },
      { new: true }
    )

    res.json({ message: 'Report updated successfully', report })
  } catch (error) {
    logger.error('Error updating report:', error)
    res.status(500).json({ error: 'Failed to update report' })
  }
})

// Get analytics
router.get('/analytics', authMiddleware, verifyAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    })

    const newMatches = await Match.countDocuments({
      createdAt: { $gte: today },
    })

    res.json({
      analytics: {
        newUsersToday,
        newMatches,
        avgMatchDuration: 0,
        topInterests: [],
      },
    })
  } catch (error) {
    logger.error('Error fetching analytics:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

export default router
