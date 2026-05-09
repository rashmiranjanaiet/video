import mongoose, { Schema, Document } from 'mongoose'

export interface ISubscription extends Document {
  userId: string
  plan: 'free' | 'premium' | 'pro' | 'enterprise'
  status: 'active' | 'inactive' | 'expired'
  startDate: Date
  endDate?: Date
  autoRenewal: boolean
  features: string[]
  price: number
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true, unique: true },
    plan: {
      type: String,
      enum: ['free', 'premium', 'pro', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    autoRenewal: { type: Boolean, default: true },
    features: [String],
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema)
