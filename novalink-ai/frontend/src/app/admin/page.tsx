'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@components/common/Button'
import { Users, TrendingUp, Ban, AlertTriangle, LogOut } from 'lucide-react'
import Link from 'next/link'

interface AdminStats {
  totalUsers: number
  activeChats: number
  bannedUsers: number
  pendingReports: number
  revenue: number
}

interface ReportItem {
  id: string
  reporter: string
  reported: string
  reason: string
  status: 'pending' | 'reviewed' | 'resolved'
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export default function AdminPanel() {
  const [stats] = useState<AdminStats>({
    totalUsers: 5234,
    activeChats: 342,
    bannedUsers: 12,
    pendingReports: 8,
    revenue: 12534.50,
  })

  const [reports] = useState<ReportItem[]>([
    {
      id: '1',
      reporter: 'user123',
      reported: 'user456',
      reason: 'Harassment',
      status: 'pending',
      severity: 'high',
    },
    {
      id: '2',
      reporter: 'user789',
      reported: 'user012',
      reason: 'Inappropriate content',
      status: 'reviewed',
      severity: 'critical',
    },
  ])

  const severityColors = {
    low: 'text-blue-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    critical: 'text-red-500',
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
            NovaLink Admin Panel
          </h1>
          <Button variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-5 gap-6 mb-12"
        >
          {[
            { icon: Users, label: 'Total Users', value: stats.totalUsers },
            { icon: TrendingUp, label: 'Active Chats', value: stats.activeChats },
            { icon: Ban, label: 'Banned Users', value: stats.bannedUsers },
            { icon: AlertTriangle, label: 'Pending Reports', value: stats.pendingReports },
            { icon: TrendingUp, label: 'Revenue', value: `$${stats.revenue}` },
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
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pending Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-8 mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Pending Reports</h2>
            <Button variant="primary" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 rounded-lg bg-dark-tertiary/50 hover:bg-dark-tertiary transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="font-semibold text-white">
                      {report.reporter} reported {report.reported}
                    </p>
                    <span className={`text-sm font-semibold ${severityColors[report.severity]}`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{report.reason}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    Review
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-500">
                    Ban User
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Management Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Link href="/admin/users" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl p-6 text-center cursor-pointer"
            >
              <Users className="w-12 h-12 text-neon-blue mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">User Management</h3>
              <p className="text-gray-400 text-sm">Manage users, verification, and access</p>
            </motion.div>
          </Link>

          <Link href="/admin/moderation" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl p-6 text-center cursor-pointer"
            >
              <AlertTriangle className="w-12 h-12 text-neon-blue mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Moderation Tools</h3>
              <p className="text-gray-400 text-sm">AI moderation controls and settings</p>
            </motion.div>
          </Link>

          <Link href="/admin/analytics" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl p-6 text-center cursor-pointer"
            >
              <TrendingUp className="w-12 h-12 text-neon-blue mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Analytics</h3>
              <p className="text-gray-400 text-sm">Platform statistics and insights</p>
            </motion.div>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
