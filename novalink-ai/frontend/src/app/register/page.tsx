'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { validateEmail, validatePassword } from '@utils/helpers'
import apiClient from '@lib/api-client'
import { useAuthStore } from '@store/index'

export default function Register() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setSubmitError('')

    try {
      const response = await apiClient.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      login(response.data.user, response.data.token)
      router.push('/dashboard')
    } catch (registrationError: any) {
      setSubmitError(registrationError.response?.data?.error || 'Registration failed')
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
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join millions connecting worldwide</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass rounded-xl p-8 space-y-5"
        >
          <Input
            label="Username"
            icon={<User className="w-5 h-5" />}
            placeholder="Choose your username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            error={errors.username}
          />

          <Input
            label="Email"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            icon={<Lock className="w-5 h-5" />}
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={<Lock className="w-5 h-5" />}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />

          {submitError && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-500/30 rounded-lg px-4 py-3">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-6"
            isLoading={isLoading}
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-neon-blue hover:text-neon-cyan transition">
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-400">
            Terms of Service
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
