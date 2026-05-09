'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/index'
import { Users, MessageSquare, Zap, TrendingUp, Settings, LogOut, User, Award } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const displayName = user?.username || 'Guest'
  const [stats, setStats] = useState({
    totalChats: 0,
    onlineFriends: 0,
    xpEarned: 0,
    level: 0,
  })

  useEffect(() => {
    // Fetch user stats from API
    if (user) {
      setStats({
        totalChats: user.stats?.totalChats || 0,
        onlineFriends: 0,
        xpEarned: user.xp || 0,
        level: user.level || 1,
      })
    }
  }, [user])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
            NovaLink AI
          </h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <Link href="/settings" className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login Optional</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome, {displayName}
          </h2>
          <p className="text-gray-400">Ready to meet amazing people today? No account required.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: Users, label: 'Total Chats', value: stats.totalChats },
            { icon: User, label: 'Online Friends', value: stats.onlineFriends },
            { icon: Award, label: 'Level', value: stats.level },
            { icon: Zap, label: 'XP', value: stats.xpEarned },
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

        {/* Main Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Start Random Chat */}
          <Link href="/match" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl p-8 text-center cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-neon rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Start Random Chat</h3>
              <p className="text-gray-400 mb-4">Connect with someone new instantly</p>
              <Button variant="primary" className="w-full">
                Find a Match
              </Button>
            </motion.div>
          </Link>

          {/* Recommendations */}
          <Link href="/recommendations" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl p-8 text-center cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-neon rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Recommendations</h3>
              <p className="text-gray-400 mb-4">AI-matched suggestions based on interests</p>
              <Button variant="primary" className="w-full">
                View Recommendations
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Recent Chats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Recent Connections</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 rounded-lg bg-dark-tertiary/50 hover:bg-dark-tertiary transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-neon rounded-full" />
                  <div>
                    <p className="font-semibold text-white">User {i}</p>
                    <p className="text-sm text-gray-400">{Math.random() * 60 | 0} minutes ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Chat Again
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
