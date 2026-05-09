'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, Shuffle, Video, X } from 'lucide-react'
import { Button } from '@components/common/Button'
import { VideoRoom } from '@components/video/VideoRoom'
import { initializeSocket } from '@lib/socket'
import { useAuthStore } from '@store/index'
import type { Socket } from 'socket.io-client'

interface MatchInfo {
  roomId: string
  initiator: boolean
  remoteUser: {
    userId: string
    username: string
  }
}

export default function MatchPage() {
  const { token, user } = useAuthStore()
  const socketRef = useRef<Socket | null>(null)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'matched'>('idle')
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null)
  const [error, setError] = useState('')

  const guestName = useMemo(() => {
    if (user?.username) return user.username
    return `Guest-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  }, [user?.username])

  useEffect(() => {
    const socket = initializeSocket(token, guestName)
    socketRef.current = socket

    const handleWaiting = () => {
      setStatus('waiting')
      setError('')
    }

    const handleMatched = (payload: MatchInfo) => {
      setMatchInfo(payload)
      setStatus('matched')
      setError('')
    }

    const handleConnectError = (connectError: Error) => {
      setError(connectError.message || 'Could not connect to video server')
      setStatus('idle')
    }

    socket.on('waiting-for-match', handleWaiting)
    socket.on('random-match-found', handleMatched)
    socket.on('connect_error', handleConnectError)

    return () => {
      socket.off('waiting-for-match', handleWaiting)
      socket.off('random-match-found', handleMatched)
      socket.off('connect_error', handleConnectError)
      socket.emit('cancel-random-match')
    }
  }, [guestName, token])

  const startSearch = () => {
    setError('')
    setMatchInfo(null)
    setStatus('waiting')
    socketRef.current?.emit('find-random-match')
  }

  const cancelSearch = () => {
    socketRef.current?.emit('cancel-random-match')
    setStatus('idle')
  }

  const endCall = useCallback(() => {
    if (matchInfo?.roomId) {
      socketRef.current?.emit('leave-room', matchInfo.roomId)
    }

    setMatchInfo(null)
    setStatus('idle')
  }, [matchInfo?.roomId])

  const nextCall = useCallback(() => {
    if (matchInfo?.roomId) {
      socketRef.current?.emit('leave-room', matchInfo.roomId)
    }

    setMatchInfo(null)
    setStatus('waiting')
    window.setTimeout(() => {
      socketRef.current?.emit('find-random-match')
    }, 250)
  }, [matchInfo?.roomId])

  if (status === 'matched' && matchInfo) {
    return (
      <VideoRoom
        roomId={matchInfo.roomId}
        initiator={matchInfo.initiator}
        remoteUser={matchInfo.remoteUser}
        onEndCall={endCall}
        onNextCall={nextCall}
      />
    )
  }

  return (
    <main className="min-h-screen bg-gradient-dark text-white flex items-center justify-center px-6">
      <section className="w-full max-w-xl text-center">
        <Link href="/dashboard" className="inline-block mb-10 text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
          NovaLink AI
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-neon flex items-center justify-center mb-6">
            {status === 'waiting' ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : (
              <Video className="w-10 h-10" />
            )}
          </div>

          <h1 className="text-3xl font-bold mb-3">
            {status === 'waiting' ? 'Finding someone online' : 'Random Video Chat'}
          </h1>

          <p className="text-gray-400 mb-8">
            {status === 'waiting'
              ? 'Keep this page open while NovaLink pairs you with another person.'
              : 'Start a live video call with another person who is searching right now.'}
          </p>

          {error && (
            <p className="mb-6 text-sm text-red-400 bg-red-950/40 border border-red-500/30 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {status === 'waiting' ? (
            <Button variant="outline" size="lg" className="w-full" onClick={cancelSearch}>
              <X className="w-5 h-5" />
              Cancel Search
            </Button>
          ) : (
            <Button variant="primary" size="lg" className="w-full" onClick={startSearch}>
              <Shuffle className="w-5 h-5" />
              Find Random Person
            </Button>
          )}
        </motion.div>
      </section>
    </main>
  )
}
