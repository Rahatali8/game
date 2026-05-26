'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Trash2, MoreVertical, Circle } from 'lucide-react'
import { motion } from 'framer-motion'
import { ChatBubble } from '@/components/message/ChatBubble'
import { useMessages } from '@/hooks/useMessages'
import { useWebSocket } from '@/hooks/useWebSocket'
import { api } from '@/lib/api'
import type { Message } from '@/types'

export default function MessagePage() {
  const { messages, loading, addMessage, refetch } = useMessages()
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useWebSocket((data) => {
    const msg = data as Message
    if (msg.id && msg.sender_type) {
      addMessage(msg)
    }
  })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    const prev = text
    setText('')
    try {
      const res = await api.post('/messages/text', { message: trimmed })
      addMessage(res.data.data as Message)
    } catch {
      setText(prev)
    } finally {
      setSending(false)
    }
  }

  const clearChat = async () => {
    setShowMenu(false)
    await api.delete('/messages/clear')
    await refetch()
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="text-white px-4 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-lg">🔥</span>
          </div>
          <div>
            <p className="font-bold text-sm">CloudSky Support</p>
            <div className="flex items-center gap-1">
              <Circle size={6} className="text-success fill-success" />
              <p className="text-white/70 text-xs">Online</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-10">
              <button
                onClick={clearChat}
                className="flex items-center gap-2 px-4 py-3 text-sm text-danger hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <Trash2 size={16} />
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-surface-soft">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">💬</p>
            <p className="text-ink-soft text-sm">No messages yet</p>
            <p className="text-ink-muted text-xs">Start a conversation with support</p>
          </div>
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-100 px-4 py-3 flex items-center gap-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 h-11 bg-slate-100 rounded-full px-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
        >
          <Send size={18} className="text-white" />
        </motion.button>
      </div>
    </div>
  )
}
