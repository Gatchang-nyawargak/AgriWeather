'use client'

import { useState, useRef } from 'react'
import { Search, MapPin, Loader2, LocateFixed } from 'lucide-react'

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void
  onAutoDetect: () => void
  isLoading?: boolean
  lang: 'en' | 'sw'
}

// Simple geocoding via Open-Meteo geocoding API (free, no key)
async function geocodeCity(query: string): Promise<Array<{ name: string; lat: number; lon: number; country: string; region?: string }>> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  const res = await fetch(url)
  const data = await res.json()
  return (data.results || []).map((r: { name: string; latitude: number; longitude: number; country: string; admin1?: string }) => ({
    name: r.name,
    lat: r.latitude,
    lon: r.longitude,
    country: r.country,
    region: r.admin1,
  }))
}

const labels = {
  en: { placeholder: 'Search city or farm location…', detect: 'Auto-detect', searching: 'Searching…' },
  sw: { placeholder: 'Tafuta mji au eneo la shamba…', detect: 'Gundua Moja kwa Moja', searching: 'Inatafuta…' },
}

export default function LocationSearch({ onLocationSelect, onAutoDetect, isLoading, lang }: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Array<{ name: string; lat: number; lon: number; country: string; region?: string }>>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const t = labels[lang]

  const handleInput = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 2) { setResults([]); setShowResults(false); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const res = await geocodeCity(value)
      setResults(res)
      setShowResults(true)
      setSearching(false)
    }, 400)
  }

  const handleSelect = (r: { name: string; lat: number; lon: number; country: string; region?: string }) => {
    const name = [r.name, r.region, r.country].filter(Boolean).join(', ')
    setQuery(name)
    setShowResults(false)
    onLocationSelect(r.lat, r.lon, name)
  }

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={query}
            onChange={e => handleInput(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            placeholder={t.placeholder}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          {searching && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
        <button
          onClick={onAutoDetect}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
          title={t.detect}
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
          <span className="hidden sm:inline">{t.detect}</span>
        </button>
      </div>

      {showResults && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 shadow-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)' }}
        >
          {results.map((r, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelect(r)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-all hover:bg-white/5"
            >
              <MapPin size={12} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
              <div>
                <span style={{ color: 'var(--text-primary)' }}>{r.name}</span>
                {(r.region || r.country) && (
                  <span style={{ color: 'var(--text-muted)' }}> · {[r.region, r.country].filter(Boolean).join(', ')}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
