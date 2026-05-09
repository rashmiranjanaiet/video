import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  avatar?: string
  bio?: string
  verified: boolean
  xp: number
  level: number
  badges: string[]
  preferences: {
    gender?: string
    ageRange?: { min: number; max: number }
    language?: string
    interests?: string[]
    countryCode?: string
  }
  settings: {
    privateMode: boolean
    allowScreenShare: boolean
    autoTranslate: boolean
    notificationsEnabled: boolean
  }
  stats: {
    totalChats: number
    totalMinutes: number
    avgRating: number
  }
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: String,
    bio: String,
    verified: { type: Boolean, default: false },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [String],
    preferences: {
      gender: String,
      ageRange: {
        min: Number,
        max: Number,
      },
      language: String,
      interests: [String],
      countryCode: String,
    },
    settings: {
      privateMode: { type: Boolean, default: false },
      allowScreenShare: { type: Boolean, default: true },
      autoTranslate: { type: Boolean, default: true },
      notificationsEnabled: { type: Boolean, default: true },
    },
    stats: {
      totalChats: { type: Number, default: 0 },
      totalMinutes: { type: Number, default: 0 },
      avgRating: { type: Number, default: 5 },
    },
  },
  { timestamps: true }
)

export default mongoose.model<IUser>('User', userSchema)
