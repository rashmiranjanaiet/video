import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '@middleware/auth'
import User from '@models/User'
import Match from '@models/Match'
import { logger } from '@utils/logger'

const router = Router()

// Calculate match score
const calculateMatchScore = (user1: any, user2: any): number => {
  let score = 0

  // Common interests
  const user1Interests = new Set(user1.preferences?.interests || [])
  const user2Interests = new Set(user2.preferences?.interests || [])

  let commonInterests = 0
  user1Interests.forEach((interest) => {
    if (user2Interests.has(interest)) {
      commonInterests++
    }
  })

  score += commonInterests * 15

  // Language match
  if (user1.preferences?.language === user2.preferences?.language) {
    score += 10
  }

  // Location proximity (simplified)
  if (user1.preferences?.countryCode === user2.preferences?.countryCode) {
    score += 5
  }

  return Math.min(score, 100)
}

// Find random match
router.post('/random', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.userId)
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get random user excluding self
    const randomUser = await User.aggregate([
      { $match: { _id: { $ne: currentUser._id } } },
      { $sample: { size: 1 } },
    ])

    if (!randomUser.length) {
      return res.status(404).json({ error: 'No users available' })
    }

    const matchedUser = randomUser[0]
    const score = calculateMatchScore(currentUser, matchedUser)

    const match = new Match({
      user1Id: currentUser._id,
      user2Id: matchedUser._id,
      matchScore: score,
    })

    await match.save()

    res.json({
      match: {
        matchId: match._id,
        userId: matchedUser._id,
        username: matchedUser.username,
        avatar: matchedUser.avatar,
        level: matchedUser.level,
        matchScore: score,
      },
    })
  } catch (error) {
    logger.error('Error finding match:', error)
    res.status(500).json({ error: 'Failed to find match' })
  }
})

// Get recommended matches
router.get('/recommendations', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.userId)
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    const potentialMatches = await User.find({ _id: { $ne: currentUser._id } }).limit(10)

    const scoredMatches = potentialMatches
      .map((user) => ({
        userId: user._id,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        bio: user.bio,
        matchScore: calculateMatchScore(currentUser, user),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)

    res.json({ matches: scoredMatches })
  } catch (error) {
    logger.error('Error getting recommendations:', error)
    res.status(500).json({ error: 'Failed to get recommendations' })
  }
})

// Rate match
router.post('/:matchId/rate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { rating } = req.body
    const match = await Match.findById(req.params.matchId)

    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }

    if (match.user1Id.toString() === req.userId) {
      match.rating1 = rating
    } else if (match.user2Id.toString() === req.userId) {
      match.rating2 = rating
    }

    await match.save()

    res.json({ message: 'Rating submitted successfully' })
  } catch (error) {
    logger.error('Error rating match:', error)
    res.status(500).json({ error: 'Failed to submit rating' })
  }
})

export default router
