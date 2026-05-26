'use client'
import { useEffect, useRef } from 'react'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import { getToken } from '@/lib/auth'

export function useWebSocket(onMessage: (data: unknown) => void) {
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    const token = getToken()
    if (!token) return

    connectSocket(token, (data) => onMessageRef.current(data))

    return () => {
      disconnectSocket()
    }
  }, [])
}
