'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/index'
import { Users, MessageSquare, Video, Settings, LogOut, Trophy, Zap } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuthStore()
  const [profile, setProfile] = useState(user)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <nav className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
            NovaLink AI
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Profile Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8 mb-12"
        >
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 bg-gradient-neon rounded-full flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-white">{profile?.username?.[0]?.toUpperCase()}</span>
            </motion.div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{profile?.username}</h1>
              <p className="text-gray-400 mb-4">{profile?.bio || 'No bio added yet'}</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-neon-blue" />
                  <span className="text-white">Level {profile?.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-neon-blue" />
                  <span className="text-white">{profile?.xp} XP</span>
                </div>
              </div>
            </div>
            <Link href="/settings" className="block">
              <Button variant="primary">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: Video, label: 'Total Chats', value: profile?.stats?.totalChats || 0 },
            { icon: MessageSquare, label: 'Total Minutes', value: profile?.stats?.totalMinutes || 0 },
            { icon: Trophy, label: 'Avg Rating', value: profile?.stats?.avgRating?.toFixed(1) || '5.0' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6"
            >
              <stat.icon className="w-8 h-8 text-neon-blue mb-4" />
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(profile?.badges || ['verified', 'early_adopter']).map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-lg p-4 text-center"
              >
                <Trophy className="w-8 h-8 text-neon-blue mx-auto mb-2" />
                <p className="font-semibold text-white capitalize">{badge}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Link href="/dashboard" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full glass rounded-xl p-6 text-center hover:glow-blue transition"
            >
              <Users className="w-8 h-8 text-neon-blue mx-auto mb-2" />
              <p className="font-semibold text-white">Back to Dashboard</p>
            </motion.button>
          </Link>
          <Link href="/settings" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full glass rounded-xl p-6 text-center hover:glow-blue transition"
            >
              <Settings className="w-8 h-8 text-neon-blue mx-auto mb-2" />
              <p className="font-semibold text-white">Settings</p>
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
