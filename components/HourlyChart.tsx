'use client'

import { HourlyForecast } from '@/lib/types'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface HourlyChartProps {
  hourly: HourlyForecast[]
  lang: 'en' | 'sw'
}

const labels = {
  en: { title: 'Hourly Temperature', temp: 'Temp (°C)', rain: 'Rain %' },
  sw: { title: 'Joto la Kila Saa', temp: 'Joto (°C)', rain: 'Mvua %' },
}

function formatHour(timeStr: string): string {
  try {
    const d = new Date(timeStr)
    return d.toLocaleTimeString('en-KE', { hour: '2-digit', hour12: true })
  } catch {
    return timeStr.slice(11, 16)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-xs shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}>
        <div style={{ color: 'var(--text-muted)' }}>{label}</div>
        <div style={{ color: '#c4883a' }}>{payload[0]?.value}°C</div>
        {payload[1] && <div style={{ color: '#5b8db8' }}>{payload[1].value}% rain</div>}
      </div>
    )
  }
  return null
}

export default function HourlyChart({ hourly, lang }: HourlyChartProps) {
  const t = labels[lang]
  const data = hourly.slice(0, 24).map(h => ({
    time: formatHour(h.time),
    temp: Math.round(h.temp),
    rain: h.precipitation ? Math.round(h.precipitation) : 0,
  }))

  return (
    <div className="card p-5">
      <h3 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
        {t.title}
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c4883a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#c4883a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5b8db8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#5b8db8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,191,145,0.06)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#c4883a"
            strokeWidth={2}
            fill="url(#tempGrad)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="rain"
            stroke="#5b8db8"
            strokeWidth={1.5}
            fill="url(#rainGrad)"
            dot={false}
            strokeDasharray="4 2"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
