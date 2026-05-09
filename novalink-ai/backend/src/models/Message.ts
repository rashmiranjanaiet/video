import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  senderId: string
  receiverId: string
  roomId: string
  content: string
  type: 'text' | 'system' | 'image' | 'file'
  originalLanguage?: string
  translatedContent?: Record<string, string>
  reactions?: Record<string, number>
  isEncrypted: boolean
  read: boolean
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    roomId: { type: String, required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'system', 'image', 'file'],
      default: 'text',
    },
    originalLanguage: String,
    translatedContent: mongoose.Schema.Types.Mixed,
    reactions: mongoose.Schema.Types.Mixed,
    isEncrypted: { type: Boolean, default: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model<IMessage>('Message', messageSchema)
