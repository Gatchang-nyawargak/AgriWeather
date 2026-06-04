export interface CurrentWeather {
  temp: number
  feels_like: number
  humidity: number
  wind_speed: number
  wind_dir?: string
  description: string
  icon?: string
  uv_index?: number
  pressure?: number
  visibility?: number
  condition?: string
}

export interface DailyForecast {
  date: string
  day: string
  temp_max: number
  temp_min: number
  description: string
  icon?: string
  precipitation?: number
  humidity?: number
  wind_speed?: number
  condition?: string
}

export interface HourlyForecast {
  time: string
  temp: number
  description: string
  icon?: string
  precipitation?: number
}

export interface WeatherData {
  location?: {
    city?: string
    region?: string
    country?: string
    lat?: number
    lon?: number
  }
  current: CurrentWeather
  daily?: DailyForecast[]
  hourly?: HourlyForecast[]
  ai_summary?: string
  summary?: string
  forecast?: DailyForecast[]
  [key: string]: unknown
}

export interface TreeHealth {
  healthy: number
  needs_care: number
  needs_replacement: number
}

export interface TreeAnalysis {
  analysis_id: string
  timestamp: string
  farmer_id?: string
  county?: string
  location?: string
  land_acres?: number
  total_tree_count: number
  tree_density_per_acre?: number
  confidence_score: number
  canopy_coverage_pct: number | null
  tree_health: TreeHealth
  low_confidence: boolean
  tree_species_guess?: string | null
  image_perspective?: string | null
  coverage_estimate?: string | null
  cv_count_used?: boolean
  gemini_error?: string
  observations: string[]
  recommendations: string[]
  original_image_url: string
  overlay_image_url: string | null
  cv_debug?: {
    orig_resolution: string
    work_resolution: string
    canopy_px: number
    peaks_detected: number
    after_area_filter: number
  }
}
