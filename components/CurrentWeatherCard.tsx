'use client'

import { WeatherData } from '@/lib/types'
import { getWeatherEmoji, getUVLabel, formatTemp } from '@/lib/utils'
import { Droplets, Wind, Eye, Gauge, Sun, MapPin } from 'lucide-react'

interface CurrentWeatherCardProps {
  data: WeatherData
  locationName: string
  lang: 'en' | 'sw'
}

const labels = {
  en: {
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    visibility: 'Visibility',
    pressure: 'Pressure',
    uvIndex: 'UV Index',
    aiSummary: 'AI Forecast Summary',
  },
  sw: {
    feelsLike: 'Inahisi kama',
    humidity: 'Unyevu',
    wind: 'Upepo',
    visibility: 'Mwonekano',
    pressure: 'Shinikizo',
    uvIndex: 'Kiwango cha UV',
    aiSummary: 'Muhtasari wa AI',
  },
}

export default function CurrentWeatherCard({ data, locationName, lang }: CurrentWeatherCardProps) {
  const current = data.current
  const t = labels[lang]
  const emoji = getWeatherEmoji(current.condition, current.description)
  const uv = current.uv_index ? getUVLabel(current.uv_index) : null
  const aiSummary = data.ai_summary || data.summary

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1c2b1a 0%, #162115 60%, #1a2518 100%)', border: '1px solid var(--border)' }}>
      {/* Top section */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin size={12} style={{ color: 'var(--accent-green)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{locationName || 'Detecting location…'}</span>
            </div>
            <div className="font-display text-7xl font-semibold leading-none mb-1" style={{ color: 'var(--text-primary)' }}>
              {formatTemp(current.temp)}
            </div>
            <div className="text-base capitalize mb-1" style={{ color: 'var(--text-secondary)' }}>
              {current.description}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {t.feelsLike} {formatTemp(current.feels_like)}
            </div>
          </div>
          <div className="text-7xl animate-float select-none">{emoji}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-6 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Droplets, label: t.humidity, value: `${current.humidity}%`, color: '#5b8db8' },
          { icon: Wind, label: t.wind, value: `${Math.round(current.wind_speed)} km/h`, color: '#67a060' },
          ...(current.visibility ? [{ icon: Eye, label: t.visibility, value: `${current.visibility} km`, color: '#9db89a' }] : []),
          ...(current.pressure ? [{ icon: Gauge, label: t.pressure, value: `${current.pressure} hPa`, color: '#c4883a' }] : []),
          ...(uv ? [{ icon: Sun, label: t.uvIndex, value: `${current.uv_index} · ${uv.label}`, color: uv.color }] : []),
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} style={{ color }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="mx-6 mb-6 rounded-xl p-4" style={{ background: 'rgba(103,160,96,0.1)', border: '1px solid rgba(103,160,96,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--accent-green)' }}>✦</div>
            <span className="text-xs font-medium" style={{ color: 'var(--accent-green)' }}>{t.aiSummary}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{aiSummary}</p>
        </div>
      )}
    </div>
  )
}
