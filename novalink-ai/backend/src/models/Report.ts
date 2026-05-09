import mongoose, { Schema, Document } from 'mongoose'

export interface IReport extends Document {
  reporterId: string
  reportedUserId: string
  reason: string
  description: string
  evidence?: string[]
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  severity: 'low' | 'medium' | 'high' | 'critical'
  actionTaken?: string
  resolvingAdminId?: string
}

const reportSchema = new Schema<IReport>(
  {
    reporterId: { type: String, required: true },
    reportedUserId: { type: String, required: true },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    evidence: [String],
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    actionTaken: String,
    resolvingAdminId: String,
  },
  { timestamps: true }
)

export default mongoose.model<IReport>('Report', reportSchema)
