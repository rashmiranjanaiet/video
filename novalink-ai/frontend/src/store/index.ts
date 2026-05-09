import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  badges?: string[]
  verified: boolean
  xp: number
  level: number
  stats?: {
    totalChats?: number
    totalMinutes?: number
    avgRating?: number
  }
  preferences: {
    gender?: string
    language?: string
    interests?: string[]
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        login: (user, token) => set({ user, token, isAuthenticated: true }),
        logout: () => set({ user: null, token: null, isAuthenticated: false }),
        updateUser: (userData) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          })),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
)

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: number
  type: 'text' | 'system'
}

interface ChatState {
  messages: ChatMessage[]
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      messages: [],
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      clearMessages: () => set({ messages: [] }),
    })
  )
)

interface VideoCallState {
  isCallActive: boolean
  remoteUserStream: MediaStream | null
  localUserStream: MediaStream | null
  isMuted: boolean
  isVideoEnabled: boolean
  startCall: () => void
  endCall: () => void
  setRemoteStream: (stream: MediaStream | null) => void
  setLocalStream: (stream: MediaStream | null) => void
  toggleMute: () => void
  toggleVideo: () => void
}

export const useVideoCallStore = create<VideoCallState>()(
  devtools((set) => ({
    isCallActive: false,
    remoteUserStream: null,
    localUserStream: null,
    isMuted: false,
    isVideoEnabled: true,
    startCall: () => set({ isCallActive: true }),
    endCall: () => set({ isCallActive: false }),
    setRemoteStream: (stream) => set({ remoteUserStream: stream }),
    setLocalStream: (stream) => set({ localUserStream: stream }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    toggleVideo: () => set((state) => ({ isVideoEnabled: !state.isVideoEnabled })),
  }))
)
