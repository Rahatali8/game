'use client'
import { useState, useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const COINS = ['BTC', 'ETH', 'FIL']
const SYMBOLS: Record<string, string> = { BTC: 'BTCUSDT', ETH: 'ETHUSDT', FIL: 'FILUSDT' }

export function CryptoChart() {
  const [active, setActive] = useState('BTC')
  const [prices, setPrices] = useState<Record<string, { price: number; change: number }>>({})
  const [history, setHistory] = useState<number[]>([])
  const historyRef = useRef<Record<string, number[]>>({ BTC: [], ETH: [], FIL: [] })

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const results = await Promise.all(
          COINS.map(async (coin) => {
            const [priceRes, changeRes] = await Promise.all([
              fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${SYMBOLS[coin]}`),
              fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${SYMBOLS[coin]}`),
            ])
            const priceData = await priceRes.json() as { price: string }
            const changeData = await changeRes.json() as { priceChangePercent: string }
            return { coin, price: parseFloat(priceData.price), change: parseFloat(changeData.priceChangePercent) }
          })
        )
        const newPrices: Record<string, { price: number; change: number }> = {}
        results.forEach(({ coin, price, change }) => {
          newPrices[coin] = { price, change }
          const h = historyRef.current[coin]
          h.push(price)
          if (h.length > 20) h.shift()
        })
        setPrices(newPrices)
        setHistory([...historyRef.current[active]])
      } catch {
        // ignore Binance API errors
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 8000)
    return () => clearInterval(interval)
  }, [active])

  useEffect(() => {
    setHistory([...historyRef.current[active]])
  }, [active])

  const current = prices[active]
  const labels = history.map((_, i) => `${i}`)

  const chartData = {
    labels,
    datasets: [{
      data: history,
      borderColor: '#2563eb',
      borderWidth: 2,
      fill: true,
      backgroundColor: (ctx: { chart: ChartJS }) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 120)
        gradient.addColorStop(0, 'rgba(37,99,235,0.3)')
        gradient.addColorStop(1, 'rgba(37,99,235,0)')
        return gradient
      },
      pointRadius: 0,
      tension: 0.4,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-ink text-sm">Crypto Markets</h3>
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
      </div>

      <div className="flex gap-2 mb-4">
        {COINS.map((coin) => (
          <button
            key={coin}
            onClick={() => setActive(coin)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              active === coin
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-ink-soft hover:bg-slate-200'
            }`}
          >
            {coin}
          </button>
        ))}
      </div>

      {current && (
        <div className="mb-3">
          <p className="text-xl font-extrabold text-ink">
            ${current.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-sm font-semibold ${current.change >= 0 ? 'text-success' : 'text-danger'}`}>
            {current.change >= 0 ? '+' : ''}{current.change.toFixed(2)}%
          </p>
        </div>
      )}

      <div className="h-24">
        {history.length > 1 ? (
          <Line data={chartData} options={options as Parameters<typeof Line>[0]['options']} />
        ) : (
          <div className="h-full flex items-center justify-center text-ink-muted text-xs">Loading chart...</div>
        )}
      </div>
    </div>
  )
}
