import mongoose, { Schema, Document } from 'mongoose'

export interface IReward extends Document {
  userId: string
  type: 'xp' | 'badge' | 'token' | 'gift'
  amount: number
  description: string
  expiresAt?: Date
}

const rewardSchema = new Schema<IReward>(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ['xp', 'badge', 'token', 'gift'],
      required: true,
    },
    amount: { type: Number, required: true },
    description: String,
    expiresAt: Date,
  },
  { timestamps: true }
)

export default mongoose.model<IReward>('Reward', rewardSchema)
