'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import apiClient from '@lib/api-client'
import { useAuthStore } from '@store/index'

export default function Login() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/api/auth/login', formData)
      login(response.data.user, response.data.token)
      router.push('/dashboard')
    } catch (loginError: any) {
      setError(loginError.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold bg-gradient-neon bg-clip-text text-transparent"
            >
              NovaLink AI
            </motion.h1>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass rounded-xl p-8 space-y-5"
        >
          <Input
            label="Email"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            icon={<Lock className="w-5 h-5" />}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-500/30 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-neon-blue hover:text-neon-cyan">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.form>

        {/* Register Link */}
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-neon-blue hover:text-neon-cyan transition">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
