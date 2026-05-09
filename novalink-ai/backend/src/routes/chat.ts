import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '@middleware/auth'
import Message from '@models/Message'
import { logger } from '@utils/logger'

const router = Router()

// Send message
router.post('/send', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, roomId, content, type = 'text' } = req.body

    const message = new Message({
      senderId: req.userId,
      receiverId,
      roomId,
      content,
      type,
      isEncrypted: true,
    })

    await message.save()

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    })
  } catch (error) {
    logger.error('Error sending message:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// Get chat history
router.get('/history/:roomId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ createdAt: -1 })
      .limit(100)

    res.json({ messages: messages.reverse() })
  } catch (error) {
    logger.error('Error fetching chat history:', error)
    res.status(500).json({ error: 'Failed to fetch chat history' })
  }
})

// Mark message as read
router.put('/:messageId/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { read: true },
      { new: true }
    )

    res.json({ message })
  } catch (error) {
    logger.error('Error marking message as read:', error)
    res.status(500).json({ error: 'Failed to mark message as read' })
  }
})

export default router
