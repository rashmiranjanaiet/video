import mongoose, { Schema, Document } from 'mongoose'

export interface IMatch extends Document {
  user1Id: string
  user2Id: string
  matchScore: number
  commonInterests: string[]
  startTime: Date
  endTime?: Date
  duration?: number
  rating1?: number
  rating2?: number
  status: 'active' | 'completed' | 'skipped'
}

const matchSchema = new Schema<IMatch>(
  {
    user1Id: { type: String, required: true },
    user2Id: { type: String, required: true },
    matchScore: { type: Number, default: 0 },
    commonInterests: [String],
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    duration: Number,
    rating1: Number,
    rating2: Number,
    status: {
      type: String,
      enum: ['active', 'completed', 'skipped'],
      default: 'active',
    },
  },
  { timestamps: true }
)

export default mongoose.model<IMatch>('Match', matchSchema)
