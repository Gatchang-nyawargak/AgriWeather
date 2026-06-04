import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://api.weather-ai.co'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const days = searchParams.get('days') || '7'
  const lang = searchParams.get('lang') || 'en'
  const ip = searchParams.get('ip')

  const apiKey = process.env.WEATHER_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    let url: string

    if (ip) {
      // Auto-detect location from IP
      url = `${BASE_URL}/v1/weather-geo?ip=auto&days=${days}&lang=${lang}`
    } else if (lat && lon) {
      url = `${BASE_URL}/v1/weather?lat=${lat}&lon=${lon}&days=${days}&lang=${lang}`
    } else {
      return NextResponse.json({ error: 'Provide lat/lon or ip=auto' }, { status: 400 })
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 1800 }, // cache 30 mins
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const message = res.status === 500
        ? 'WeatherAI service is temporarily unavailable. Please try again later.'
        : err.message || err.error || 'WeatherAI API error'
      return NextResponse.json({ error: message, upstream: res.status }, { status: res.status })
    }

    const data = await res.json()

    // Forward geo headers if present
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const city = res.headers.get('X-City')
    const region = res.headers.get('X-Region')
    const country = res.headers.get('X-Country')
    if (city) headers['X-City'] = city
    if (region) headers['X-Region'] = region
    if (country) headers['X-Country'] = country

    return NextResponse.json(data, { headers })
  } catch (err) {
    console.error('Weather API error:', err)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}
