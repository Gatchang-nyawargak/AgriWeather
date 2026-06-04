'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import LocationSearch from '@/components/LocationSearch'
import CurrentWeatherCard from '@/components/CurrentWeatherCard'
import ForecastStrip from '@/components/ForecastStrip'
import HourlyChart from '@/components/HourlyChart'
import FarmAdvisor from '@/components/FarmAdvisor'
import WeatherSkeleton from '@/components/WeatherSkeleton'
import { WeatherData, DailyForecast, HourlyForecast } from '@/lib/types'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'farm-advisor'>('dashboard')
  const [lang, setLang] = useState<'en' | 'sw'>('en')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [locationName, setLocationName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchWeather = useCallback(async (url: string, name?: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch weather')
      setWeatherData(data)
      if (name) {
        setLocationName(name)
      } else {
        // Try to get location from response headers or data
        const city = res.headers.get('X-City') || data.location?.city
        const region = res.headers.get('X-Region') || data.location?.region
        const country = res.headers.get('X-Country') || data.location?.country
        setLocationName([city, region, country].filter(Boolean).join(', ') || 'Your Location')
      }
      setHasLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAutoDetect = useCallback(() => {
    fetchWeather(`/api/weather?ip=auto&days=7&lang=${lang}`)
  }, [fetchWeather, lang])

  const handleLocationSelect = useCallback((lat: number, lon: number, name: string) => {
    fetchWeather(`/api/weather?lat=${lat}&lon=${lon}&days=7&lang=${lang}`, name)
  }, [fetchWeather, lang])

  // Auto-detect on mount
  useEffect(() => {
    if (!hasLoaded) {
      handleAutoDetect()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Extract forecast/hourly from various possible response shapes
  const forecast: DailyForecast[] = weatherData?.daily || weatherData?.forecast || []
  const hourly: HourlyForecast[] = weatherData?.hourly || []

  const labels = {
    en: { poweredBy: 'Powered by WeatherAI · Data updates every 30 min · Made for Kenyan farmers' },
    sw: { poweredBy: 'Inaendeshwa na WeatherAI · Data inasasishwa kila dakika 30 · Imefanywa kwa wakulima wa Kenya' },
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} />

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--accent-green)', top: '-10%', right: '-5%' }} />
        <div className="absolute w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: '#5b8db8', bottom: '10%', left: '-5%' }} />
        <div className="absolute w-64 h-64 rounded-full opacity-6 blur-3xl" style={{ background: 'var(--accent-gold)', top: '40%', left: '40%' }} />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search bar (always visible on dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-up">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              onAutoDetect={handleAutoDetect}
              isLoading={loading}
              lang={lang}
            />
          </div>
        )}

        {/* Dashboard tab */}
        {activeTab === 'dashboard' && (
          <div>
            {loading && !weatherData && <WeatherSkeleton />}

            {error && (
              <div className="rounded-2xl p-6 flex items-start gap-3" style={{ background: 'rgba(180,60,60,0.1)', border: '1px solid rgba(180,60,60,0.3)' }}>
                <AlertTriangle size={20} style={{ color: '#e07070', flexShrink: 0 }} />
                <div>
                  <div className="font-medium mb-1" style={{ color: '#e07070' }}>Failed to load weather</div>
                  <div className="text-sm mb-3" style={{ color: 'rgba(224,112,112,0.8)' }}>{error}</div>
                  <button
                    onClick={handleAutoDetect}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ background: 'rgba(180,60,60,0.2)', color: '#e07070' }}
                  >
                    <RefreshCw size={14} /> Retry
                  </button>
                </div>
              </div>
            )}

            {weatherData && (
              <div className="space-y-4 animate-fade-up">
                {/* Reload indicator */}
                {loading && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <div className="w-3 h-3 rounded-full border border-current animate-spin border-t-transparent" />
                    Refreshing…
                  </div>
                )}

                {/* Hero current weather */}
                <CurrentWeatherCard data={weatherData} locationName={locationName} lang={lang} />

                {/* Forecast + Chart side by side on larger screens */}
                <div className="grid lg:grid-cols-2 gap-4">
                  {forecast.length > 0 && <ForecastStrip forecast={forecast} lang={lang} />}
                  {hourly.length > 0 && <HourlyChart hourly={hourly} lang={lang} />}
                </div>

                {/* If only one of forecast/hourly */}
                {forecast.length > 0 && hourly.length === 0 && (
                  <ForecastStrip forecast={forecast} lang={lang} />
                )}
                {hourly.length > 0 && forecast.length === 0 && (
                  <HourlyChart hourly={hourly} lang={lang} />
                )}
              </div>
            )}
          </div>
        )}

        {/* Farm advisor tab */}
        {activeTab === 'farm-advisor' && (
          <FarmAdvisor lang={lang} />
        )}

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{labels[lang].poweredBy}</p>
        </footer>
      </main>
    </div>
  )
}
