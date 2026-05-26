export interface Message {
  id: number
  user_id: number
  sender_type: 'user' | 'admin'
  message: string | null
  message_type: 'text' | 'voice'
  voice_url: string | null
  voice_duration: number | null
  is_read: boolean
  created_at: string
}
