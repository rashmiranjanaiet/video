import mongoose, { Schema, Document } from 'mongoose'

export interface IRoom extends Document {
  name: string
  type: 'private' | 'public' | 'group'
  participants: string[]
  creatorId: string
  description?: string
  isActive: boolean
  maxParticipants?: number
}

const roomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['private', 'public', 'group'],
      default: 'private',
    },
    participants: [String],
    creatorId: { type: String, required: true },
    description: String,
    isActive: { type: Boolean, default: true },
    maxParticipants: Number,
  },
  { timestamps: true }
)

export default mongoose.model<IRoom>('Room', roomSchema)
