'use client'

import { DailyForecast } from '@/lib/types'
import { getWeatherEmoji, formatDate } from '@/lib/utils'
import { Droplets } from 'lucide-react'

interface ForecastStripProps {
  forecast: DailyForecast[]
  lang: 'en' | 'sw'
}

const labels = {
  en: { title: '7-Day Forecast', today: 'Today' },
  sw: { title: 'Utabiri wa Siku 7', today: 'Leo' },
}

export default function ForecastStrip({ forecast, lang }: ForecastStripProps) {
  const t = labels[lang]
  const displayed = forecast.slice(0, 7)

  // Find temp range for scaling bars
  const allMax = displayed.map(d => d.temp_max)
  const allMin = displayed.map(d => d.temp_min)
  const absMax = Math.max(...allMax)
  const absMin = Math.min(...allMin)
  const range = absMax - absMin || 1

  return (
    <div className="card p-5">
      <h3 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
        {t.title}
      </h3>
      <div className="space-y-2">
        {displayed.map((day, i) => {
          const { day: dayName, date } = formatDate(day.date)
          const emoji = getWeatherEmoji(day.condition, day.description)
          const barLeft = ((day.temp_min - absMin) / range) * 100
          const barWidth = ((day.temp_max - day.temp_min) / range) * 100

          return (
            <div key={i} className="flex items-center gap-3 py-1.5 rounded-lg px-1 transition-all hover:bg-white/3">
              {/* Day */}
              <div className="w-14 flex-shrink-0">
                <div className="text-sm font-medium" style={{ color: i === 0 ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                  {i === 0 ? t.today : dayName}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{date}</div>
              </div>

              {/* Emoji */}
              <span className="text-xl w-8 text-center flex-shrink-0">{emoji}</span>

              {/* Description */}
              <div className="flex-1 min-w-0 hidden sm:block">
                <span className="text-xs truncate capitalize" style={{ color: 'var(--text-muted)' }}>{day.description}</span>
              </div>

              {/* Rain */}
              {day.precipitation !== undefined && (
                <div className="flex items-center gap-1 w-12 flex-shrink-0">
                  <Droplets size={10} style={{ color: '#5b8db8' }} />
                  <span className="text-xs" style={{ color: '#5b8db8' }}>{Math.round(day.precipitation)}%</span>
                </div>
              )}

              {/* Temp range bar */}
              <div className="flex items-center gap-2 w-32 flex-shrink-0">
                <span className="text-xs w-8 text-right" style={{ color: 'var(--text-muted)' }}>{Math.round(day.temp_min)}°</span>
                <div className="flex-1 h-1.5 rounded-full relative" style={{ background: 'var(--bg-primary)' }}>
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 8)}%`,
                      background: 'linear-gradient(90deg, #5b8db8, #c4883a)',
                    }}
                  />
                </div>
                <span className="text-xs w-8" style={{ color: 'var(--text-primary)' }}>{Math.round(day.temp_max)}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
