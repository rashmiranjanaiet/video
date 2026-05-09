'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SimplePeer from 'simple-peer'
import { getSocket } from '@lib/socket'
import { Button } from '@components/common/Button'
import { useVideoCallStore } from '@store/index'
import { Mic, MicOff, Video, VideoOff, Phone, Shuffle } from 'lucide-react'

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

export const VideoRoom: React.FC<VideoRoomProps> = ({ roomId, initiator, remoteUser, onEndCall, onNextCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<SimplePeer.Instance | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const socket = getSocket()

  const { isMuted, isVideoEnabled, toggleMute, toggleVideo } = useVideoCallStore()
  const [callDuration, setCallDuration] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

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
      })

      peer.on('stream', (remoteStream: MediaStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream
        }
      })

      peer.on('error', (error) => {
        console.error('WebRTC error:', error)
      })

      peerRef.current = peer
    }

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        })

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        localStreamRef.current = stream

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        socket?.emit('join-room', roomId)
        socket?.emit('video-ready', roomId)
      } catch (error) {
        console.error('Failed to access media devices:', error)
      }
    }

    const handleSignal = ({ signal }: { signal: SimplePeer.SignalData }) => {
      peerRef.current?.signal(signal)
    }

    const handlePartnerLeft = () => {
      onEndCall()
    }

    const handleStartWebRTC = ({ initiator: serverInitiator }: { initiator: boolean }) => {
      if (localStreamRef.current) {
        createPeer(localStreamRef.current, serverInitiator ?? initiator)
      }
    }

    socket?.on('start-webrtc', handleStartWebRTC)
    socket?.on('webrtc-signal', handleSignal)
    socket?.on('partner-left', handlePartnerLeft)
    initializeMedia()

    return () => {
      isMounted = false
      socket?.off('start-webrtc', handleStartWebRTC)
      socket?.off('webrtc-signal', handleSignal)
      socket?.off('partner-left', handlePartnerLeft)
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

  return (
    <div className="w-full h-screen bg-dark-bg relative overflow-hidden">
      {/* Remote Video (Main) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full relative"
      >
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (PiP) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-6 right-6 w-48 h-32 rounded-lg overflow-hidden glass border-2 border-neon-blue/30"
        >
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Call Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-6 glass rounded-lg px-6 py-3"
        >
          <div className="text-white font-semibold">{remoteUser.username}</div>
          <div className="text-neon-blue text-sm">
            {isConnected ? formatDuration(callDuration) : 'Connecting...'}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4"
        >
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full w-16 h-16 flex items-center justify-center"
            onClick={toggleMute}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-red-500" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full w-16 h-16 flex items-center justify-center"
            onClick={toggleVideo}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-red-500" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full w-16 h-16 flex items-center justify-center"
            onClick={onNextCall || onEndCall}
          >
            <Shuffle className="w-6 h-6 text-white" />
          </Button>

          <Button
            variant="primary"
            size="lg"
            className="rounded-full w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-700"
            onClick={onEndCall}
          >
            <Phone className="w-6 h-6" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
