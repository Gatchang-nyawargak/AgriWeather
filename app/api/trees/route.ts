import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://api.weather-ai.co'

export async function POST(request: NextRequest) {
  const apiKey = process.env.WEATHER_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    // Forward the multipart form data directly
    const formData = await request.formData()

    const res = await fetch(`${BASE_URL}/v1/trees/analyze`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: err.message || 'Trees API error', status: res.status },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Trees API error:', err)
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }
}
