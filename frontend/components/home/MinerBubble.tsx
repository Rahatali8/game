'use client'
import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'
import { useCountdown } from '@/hooks/useCountdown'
import type { UserMiner } from '@/types'

interface MinerBubbleProps {
  miner: UserMiner
  onClaim: (id: number) => Promise<void>
}

export function MinerBubble({ miner, onClaim }: MinerBubbleProps) {
  const { formatted, done } = useCountdown(miner.can_claim ? 0 : miner.remaining_cooldown)
  const ready = miner.can_claim || done

  const handleClick = async () => {
    if (!ready) return
    try { await onClaim(miner.id) } catch { /* ignore */ }
  }

  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[72px]">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        onClick={handleClick}
        className="cursor-pointer"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center relative"
          style={{
            background: ready
              ? 'rgba(16,185,129,0.2)'
              : 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            border: ready
              ? '2px solid rgba(16,185,129,0.8)'
              : '2px solid rgba(255,255,255,0.4)',
            boxShadow: ready
              ? '0 0 16px rgba(16,185,129,0.5)'
              : '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <Cpu size={22} className={ready ? 'text-success' : 'text-white'} />
          {ready && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ background: 'rgba(16,185,129,0.2)', borderRadius: '50%' }}
            />
          )}
        </div>
      </motion.div>
      <div className="text-center">
        <p className="text-white text-[9px] font-semibold leading-none mb-1 max-w-[72px] truncate">
          {miner.product_name}
        </p>
        {ready ? (
          <p className="text-success text-[10px] font-bold">READY!</p>
        ) : (
          <p className="text-white/70 text-[9px] font-mono">{formatted}</p>
        )}
      </div>
    </div>
  )
}
