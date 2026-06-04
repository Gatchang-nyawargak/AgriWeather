# AgriWeather — Farm Intelligence for Kenya

> A weather intelligence dashboard and farm advisory app built for Kenyan smallholders, powered by the [WeatherAI API](https://weather-ai.co).

![AgriWeather Preview](https://via.placeholder.com/1200x600/0f1a0e/67a060?text=AgriWeather+Dashboard)

## ✨ Features

- **Real-time weather dashboard** — current conditions, 7-day forecast, hourly temperature chart
- **Auto-detect location** via IP geolocation (`/v1/weather-geo`)
- **City search** with geocoding (search any location worldwide)
- **AI-powered summaries** — Gemini-generated insights alongside every forecast
- **Farm Advisor** — upload drone/aerial images → tree count + canopy health + agronomic recommendations via `/v1/trees/analyze`
- **Swahili / English toggle** — full bilingual support (`?lang=sw`)
- **Mobile-first, dark UI** — designed for phone-primary Kenyan users

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS variables |
| Charts | Recharts |
| Animations | Framer Motion |
| API | WeatherAI REST API |
| Geocoding | Open-Meteo (free, no key needed) |
| Deployment | Netlify / Vercel / Render |

## APIs Consumed

| Endpoint | Usage |
|---|---|
| `GET /v1/weather` | Current conditions + 7-day forecast with AI summary |
| `GET /v1/weather-geo?ip=auto` | Auto-detect location from visitor IP |
| `POST /v1/trees/analyze` | Farm image analysis — tree count, health, AI recommendations |

## 🚀 Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/agriweather.git
cd agriweather
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your WeatherAI API key:

```env
WEATHER_AI_API_KEY=wai_your_key_here
```

Get your free API key at [weather-ai.co/dashboard](https://weather-ai.co/dashboard).

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

## 📦 Deployment

### Netlify (recommended)

1. Push to GitHub
2. Connect repo in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add environment variable `WEATHER_AI_API_KEY` in Netlify → Site settings → Environment variables
6. Deploy!

### Vercel

```bash
npx vercel
```

Add `WEATHER_AI_API_KEY` in Vercel project settings → Environment Variables.

### Render

1. New Web Service → Connect repo
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Add env var `WEATHER_AI_API_KEY`

## 🗂 Project Structure

```
agriweather/
├── app/
│   ├── api/
│   │   ├── weather/route.ts     # Proxy → WeatherAI /v1/weather + /v1/weather-geo
│   │   └── trees/route.ts       # Proxy → WeatherAI /v1/trees/analyze
│   ├── globals.css              # Design tokens, animations
│   ├── layout.tsx
│   └── page.tsx                 # Main page, tab routing
├── components/
│   ├── Header.tsx               # Nav + language toggle
│   ├── LocationSearch.tsx       # City search with geocoding
│   ├── CurrentWeatherCard.tsx   # Hero weather card + AI summary
│   ├── ForecastStrip.tsx        # 7-day forecast with temp bars
│   ├── HourlyChart.tsx          # Recharts area chart
│   ├── FarmAdvisor.tsx          # Image upload + tree analysis UI
│   └── WeatherSkeleton.tsx      # Loading skeleton
└── lib/
    ├── types.ts                 # TypeScript interfaces
    └── utils.ts                 # Weather helpers (emoji, formatting)
```

## 🔑 Why API Keys Are Server-Side

The WeatherAI API key lives in `.env.local` and is only accessed in `app/api/` route handlers — never exposed to the browser. The Next.js API routes act as a secure proxy.

## 🌍 Design Decisions

- **Dark earth-tone palette** — warm greens and golds reflecting Kenyan farmland
- **Playfair Display** for headings — editorial feel that's distinctive without being aggressive
- **Auto-detect first** — most farmers won't type; default to their location
- **Swahili support** — respects the primary language of many Kenyan smallholders
- **Mobile-first layout** — collapsible columns, touch-friendly tap targets

---