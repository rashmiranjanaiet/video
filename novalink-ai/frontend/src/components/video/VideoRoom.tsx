'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SimplePeer from 'simple-peer'
import { getSocket } from '@lib/socket'
import { Button } from '@components/common/Button'
import { useVideoCallStore } from '@store/index'
import { MessageSquare, Mic, MicOff, Phone, Send, ShieldCheck, Shuffle, Signal, Video, VideoOff, Volume2 } from 'lucide-react'

interface VideoRoomProps {
  roomId: string
  initiator: boolean
  remoteUser: {
    userId: string
    username: string
  }
  onEndCall: () => void
  onNextCall?: () => void
}

interface ChatMessage {
  id: string
  from: 'me' | 'partner' | 'system'
  message: string
  timestamp: number
}

export const VideoRoom: React.FC<VideoRoomProps> = ({ roomId, initiator, remoteUser, onEndCall, onNextCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<SimplePeer.Instance | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const socket = getSocket()

  const { isMuted, isVideoEnabled, toggleMute, toggleVideo } = useVideoCallStore()
  const [callDuration, setCallDuration] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState('Preparing media')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'system-ready',
      from: 'system',
      message: 'You are in a private 1:1 room. Be respectful and keep the conversation safe.',
      timestamp: Date.now(),
    },
  ])
  const [messageText, setMessageText] = useState('')

  const roomLabel = useMemo(() => roomId.replace('room-', '').slice(0, 8).toUpperCase(), [roomId])

  // Initialize WebRTC
  useEffect(() => {
    let isMounted = true

    const createPeer = (stream: MediaStream, shouldInitiate: boolean) => {
      if (peerRef.current) return

      // Create peer connection only after both matched browsers have camera access.
      const peer = new SimplePeer({
        initiator: shouldInitiate,
        trickle: true,
        stream,
        config: {
          iceServers: [
            { urls: ['stun:stun.l.google.com:19302'] },
            { urls: ['stun:stun1.l.google.com:19302'] },
          ],
        },
      })

      peer.on('signal', (data) => {
        socket?.emit('webrtc-signal', {
          signal: data,
          roomId,
        })
      })

      peer.on('connect', () => {
        setIsConnected(true)
        setConnectionState('Connected')
      })

      peer.on('stream', (remoteStream: MediaStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream
        }
      })

      peer.on('error', (error) => {
        console.error('WebRTC error:', error)
        setConnectionState('Connection issue')
      })

      peer.on('close', () => {
        setConnectionState('Call ended')
      })

      peerRef.current = peer
    }

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        localStreamRef.current = stream

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        setConnectionState('Waiting for partner')
        socket?.emit('join-room', roomId)
        socket?.emit('video-ready', roomId)
      } catch (error) {
        console.error('Failed to access media devices:', error)
        setConnectionState('Camera or microphone blocked')
      }
    }

    const handleSignal = ({ signal }: { signal: SimplePeer.SignalData }) => {
      setConnectionState('Connecting')
      peerRef.current?.signal(signal)
    }

    const handlePartnerLeft = () => {
      onEndCall()
    }

    const handleStartWebRTC = ({ initiator: serverInitiator }: { initiator: boolean }) => {
      if (localStreamRef.current) {
        setConnectionState('Connecting')
        createPeer(localStreamRef.current, serverInitiator ?? initiator)
      }
    }

    const handleChatMessage = ({ message, timestamp }: { message: string; timestamp: number }) => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `partner-${timestamp}`,
          from: 'partner',
          message,
          timestamp,
        },
      ])
    }

    socket?.on('start-webrtc', handleStartWebRTC)
    socket?.on('webrtc-signal', handleSignal)
    socket?.on('partner-left', handlePartnerLeft)
    socket?.on('chat-message', handleChatMessage)
    initializeMedia()

    return () => {
      isMounted = false
      socket?.off('start-webrtc', handleStartWebRTC)
      socket?.off('webrtc-signal', handleSignal)
      socket?.off('partner-left', handlePartnerLeft)
      socket?.off('chat-message', handleChatMessage)
      socket?.emit('leave-room', roomId)
      peerRef.current?.destroy()
      localStreamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [initiator, onEndCall, roomId, socket])

  // Handle audio/video toggle
  useEffect(() => {
    if (localVideoRef.current?.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => {
        if (track.kind === 'audio') {
          track.enabled = !isMuted
        }
      })
    }
  }, [isMuted])

  useEffect(() => {
    if (localVideoRef.current?.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => {
        if (track.kind === 'video') {
          track.enabled = isVideoEnabled
        }
      })
    }
  }, [isVideoEnabled])

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmedMessage = messageText.trim()
    if (!trimmedMessage) return

    const timestamp = Date.now()
    socket?.emit('chat-message', {
      roomId,
      message: trimmedMessage,
    })

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `me-${timestamp}`,
        from: 'me',
        message: trimmedMessage,
        timestamp,
      },
    ])
    setMessageText('')
  }

  return (
    <div className="w-full min-h-screen bg-dark-bg text-white overflow-hidden">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_360px]">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-[70vh] bg-black"
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-full min-h-screen w-full object-cover"
          />

          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/70 backdrop-blur-sm">
              <div className="text-center px-6">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-neon-blue/40 bg-neon-blue/10">
                  <Signal className="h-8 w-8 text-neon-blue" />
                </div>
                <h2 className="text-2xl font-semibold">Setting up private call</h2>
                <p className="mt-2 text-sm text-gray-300">{connectionState}</p>
              </div>
            </div>
          )}

          <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-3">
            <div className="glass rounded-lg px-4 py-3">
              <div className="text-sm text-gray-300">Talking with</div>
              <div className="text-lg font-semibold">{remoteUser.username}</div>
            </div>
            <div className="glass flex items-center gap-3 rounded-lg px-4 py-3">
              <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
              <span className="text-sm">{isConnected ? formatDuration(callDuration) : connectionState}</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-28 right-5 h-32 w-48 overflow-hidden rounded-lg border border-white/20 bg-dark-secondary shadow-2xl"
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs">You</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-3 shadow-2xl backdrop-blur-md"
          >
            <Button
              variant={isMuted ? 'primary' : 'ghost'}
              size="lg"
              className={`h-14 w-14 rounded-full p-0 ${isMuted ? 'bg-red-600 hover:bg-red-700' : ''}`}
              onClick={toggleMute}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>

            <Button
              variant={isVideoEnabled ? 'ghost' : 'primary'}
              size="lg"
              className={`h-14 w-14 rounded-full p-0 ${!isVideoEnabled ? 'bg-red-600 hover:bg-red-700' : ''}`}
              onClick={toggleVideo}
              title={isVideoEnabled ? 'Turn camera off' : 'Turn camera on'}
            >
              {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="h-14 w-14 rounded-full p-0"
              onClick={onNextCall || onEndCall}
              title="Next person"
            >
              <Shuffle className="h-6 w-6" />
            </Button>

            <Button
              variant="primary"
              size="lg"
              className="h-14 w-14 rounded-full bg-red-600 p-0 hover:bg-red-700"
              onClick={onEndCall}
              title="End call"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.main>

        <aside className="flex min-h-[30vh] flex-col border-l border-white/10 bg-dark-secondary">
          <div className="border-b border-white/10 p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <MessageSquare className="h-5 w-5 text-neon-blue" />
              Call Panel
            </h2>
            <p className="mt-1 text-sm text-gray-400">Chat, room status, and call quality</p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/10 text-sm">
            <div className="bg-dark-secondary p-4">
              <div className="text-gray-400">Room</div>
              <div className="mt-1 font-semibold">{roomLabel}</div>
            </div>
            <div className="bg-dark-secondary p-4">
              <div className="text-gray-400">Status</div>
              <div className="mt-1 font-semibold">{isConnected ? 'Live' : 'Pairing'}</div>
            </div>
            <div className="bg-dark-secondary p-4">
              <div className="text-gray-400">Audio</div>
              <div className="mt-1 flex items-center gap-1 font-semibold">
                <Volume2 className="h-4 w-4 text-neon-blue" />
                Noise reduced
              </div>
            </div>
            <div className="bg-dark-secondary p-4">
              <div className="text-gray-400">Safety</div>
              <div className="mt-1 flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                1:1 room
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    message.from === 'me'
                      ? 'ml-8 bg-neon-blue text-dark-bg'
                      : message.from === 'partner'
                        ? 'mr-8 bg-dark-tertiary text-white'
                        : 'bg-white/5 text-gray-300'
                  }`}
                >
                  <div className="mb-1 text-xs opacity-70">
                    {message.from === 'me' ? 'You' : message.from === 'partner' ? remoteUser.username : 'System'}
                  </div>
                  {message.message}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder="Send a message"
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-dark-bg px-3 py-2 text-sm text-white outline-none focus:border-neon-blue"
                />
                <Button type="submit" variant="primary" size="md" className="h-10 w-10 p-0" title="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}
