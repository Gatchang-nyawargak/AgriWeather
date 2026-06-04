export function getWeatherEmoji(condition: string = '', description: string = ''): string {
  const text = (condition + ' ' + description).toLowerCase()
  if (text.includes('thunder') || text.includes('storm')) return '⛈️'
  if (text.includes('heavy rain') || text.includes('downpour')) return '🌧️'
  if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) return '🌦️'
  if (text.includes('snow') || text.includes('hail')) return '🌨️'
  if (text.includes('fog') || text.includes('mist') || text.includes('haze')) return '🌫️'
  if (text.includes('cloud') && text.includes('sun')) return '⛅'
  if (text.includes('overcast') || text.includes('cloud')) return '☁️'
  if (text.includes('clear') || text.includes('sunny')) return '☀️'
  if (text.includes('wind')) return '💨'
  return '🌤️'
}

export function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: '#67a060' }
  if (uv <= 5) return { label: 'Moderate', color: '#c4883a' }
  if (uv <= 7) return { label: 'High', color: '#d4693a' }
  if (uv <= 10) return { label: 'Very High', color: '#c0392b' }
  return { label: 'Extreme', color: '#8e44ad' }
}

export function getWindDirection(degrees?: number): string {
  if (degrees === undefined) return '—'
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}

export function formatDate(dateStr: string): { day: string; date: string } {
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString('en-KE', { weekday: 'short' }),
    date: d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }),
  }
}

export function formatTemp(temp: number, unit: 'C' | 'F' = 'C'): string {
  return `${Math.round(temp)}°${unit}`
}

export function getRainRisk(precipitation?: number): string {
  if (!precipitation || precipitation < 10) return 'Low'
  if (precipitation < 40) return 'Moderate'
  if (precipitation < 70) return 'High'
  return 'Very High'
}

// For Recharts tooltip formatting
export function formatHour(timeStr: string): string {
  const d = new Date(timeStr)
  return d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', hour12: true })
}
