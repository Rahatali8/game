const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'

let socket: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

export function connectSocket(
  token: string,
  onMessage: (data: unknown) => void,
  onOpen?: () => void,
  onClose?: () => void
): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) return socket

  socket = new WebSocket(`${WS_URL}/chat/${token}`)

  socket.onopen = () => {
    if (reconnectTimer) clearTimeout(reconnectTimer)
    onOpen?.()
  }

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data as string)
      onMessage(data)
    } catch {
      // ignore parse errors
    }
  }

  socket.onclose = () => {
    onClose?.()
    reconnectTimer = setTimeout(() => {
      connectSocket(token, onMessage, onOpen, onClose)
    }, 3000)
  }

  socket.onerror = () => {
    socket?.close()
  }

  return socket
}

export function disconnectSocket(): void {
  if (reconnectTimer) clearTimeout(reconnectTimer)
  if (socket) {
    socket.onclose = null
    socket.close()
    socket = null
  }
}

export function sendSocketMessage(data: unknown): void {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data))
  }
}
