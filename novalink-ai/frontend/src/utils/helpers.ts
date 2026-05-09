import CryptoJS from 'crypto-js'

export const encryptData = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString()
}

export const decryptData = (encrypted: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encrypted, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const generateHash = (data: string): string => {
  return CryptoJS.SHA256(data).toString()
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

export const formatTimeAgo = (date: Date | number): string => {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export const generateRandomId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@')
  return `${name[0]}***@${domain}`
}

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
