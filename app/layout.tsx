import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgriWeather — Farm Intelligence for Kenya',
  description: 'Real-time weather intelligence and farm advisory for Kenyan smallholders. Powered by WeatherAI.',
  keywords: ['weather', 'kenya', 'farming', 'agriculture', 'forecast'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
