'use client'
import { useState, useEffect } from 'react'

export function useCountdown(targetSeconds: number) {
  const [seconds, setSeconds] = useState(targetSeconds)

  useEffect(() => {
    setSeconds(targetSeconds)
  }, [targetSeconds])

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [seconds])

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return {
    seconds,
    formatted: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    done: seconds <= 0,
  }
}
