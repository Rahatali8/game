'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { Message } from '@/types'

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      const res = await api.get('/messages')
      setMessages(res.data.data as Message[])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg])
  }

  return { messages, loading, refetch: fetch, addMessage }
}
