import type { Message } from '@/types'
import { formatDate } from '@/lib/utils'

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender_type === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className="max-w-[80%]">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm ${
            isUser
              ? 'text-white rounded-br-sm'
              : 'bg-white text-ink shadow-sm rounded-bl-sm border border-slate-100'
          }`}
          style={isUser ? { background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' } : {}}
        >
          {message.message_type === 'voice' ? (
            <div className="flex items-center gap-2">
              <span className="text-base">🎤</span>
              <span className="text-xs opacity-80">{message.voice_duration}s voice message</span>
            </div>
          ) : (
            <p className="leading-relaxed">{message.message}</p>
          )}
        </div>
        <p className={`text-[10px] mt-1 text-ink-muted ${isUser ? 'text-right' : 'text-left'}`}>
          {formatDate(message.created_at)}
        </p>
      </div>
    </div>
  )
}
