import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  userId: string
  type: string
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  expiresAt?: Date
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: mongoose.Schema.Types.Mixed,
    read: { type: Boolean, default: false },
    expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
)

export default mongoose.model<INotification>('Notification', notificationSchema)
