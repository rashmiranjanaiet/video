'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@components/common/Button'
import { Video, Users, Zap, Shield, Globe, Sparkles } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-dark overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(179, 0, 255, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent flex items-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-neon-blue" />
            NovaLink AI
          </motion.div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-white hover:text-neon-blue transition">
              Login
            </Link>
            <Button asChild variant="primary" size="sm">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6 relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main Heading */}
          <motion.h1
            variants={item}
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">Connect. </span>
            <span className="bg-gradient-neon bg-clip-text text-transparent animate-pulse-neon">
              Chat. Share.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Meet amazing people from around the world through AI-powered intelligent matching,
            real-time translation, and advanced safety features.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button asChild size="lg">
              <Link href="/register">Start Chatting Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </motion.div>

          {/* 3D Card Preview */}
          <motion.div
            variants={item}
            className="relative h-96 rounded-2xl glass overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-dark-tertiary to-neon-purple/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Video className="w-24 h-24 text-neon-blue mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">Interactive video preview</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-white">Powered by </span>
              <span className="bg-gradient-neon bg-clip-text text-transparent">
                Advanced AI
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Experience the future of social communication</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 hover:glow-blue transition-all"
              >
                <feature.icon className="w-12 h-12 text-neon-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto glass rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to meet amazing people?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of users connecting through NovaLink AI today.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Get Started Free</Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 NovaLink AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Users,
    title: 'AI Matchmaking',
    description: 'Intelligent algorithms connect you with compatible people based on interests and preferences.',
  },
  {
    icon: Globe,
    title: 'Live Translation',
    description: 'Chat with anyone worldwide. Real-time translation breaks down language barriers.',
  },
  {
    icon: Shield,
    title: 'Advanced Safety',
    description: 'AI-powered moderation, verification, and reporting tools keep everyone safe.',
  },
  {
    icon: Zap,
    title: 'Ultra Fast',
    description: 'Crystal-clear HD video with sub-100ms latency powered by WebRTC.',
  },
  {
    icon: Sparkles,
    title: 'Rich Features',
    description: 'Screen sharing, virtual avatars, gifts, and mini-games enhance your experience.',
  },
  {
    icon: Video,
    title: 'Premium Quality',
    description: 'Professional-grade video and audio streaming with adaptive bitrate.',
  },
]
