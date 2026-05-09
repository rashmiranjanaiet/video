import mongoose, { Schema, Document } from 'mongoose'

export interface IFriendRequest extends Document {
  fromUserId: string
  toUserId: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: String,
  },
  { timestamps: true }
)

export default mongoose.model<IFriendRequest>('FriendRequest', friendRequestSchema)
