export default function WeatherSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Hero card skeleton */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="skeleton h-4 w-32 mb-4" />
        <div className="skeleton h-16 w-40 mb-2" />
        <div className="skeleton h-4 w-24 mb-1" />
        <div className="skeleton h-4 w-20 mb-6" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="skeleton h-3 w-12 mb-2" />
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className="card p-5">
        <div className="skeleton h-3 w-24 mb-4" />
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="skeleton h-4 w-14" />
            <div className="skeleton h-6 w-8" />
            <div className="flex-1 skeleton h-3" />
            <div className="skeleton h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="card p-5">
        <div className="skeleton h-3 w-32 mb-4" />
        <div className="skeleton h-44 w-full" />
      </div>
    </div>
  )
}
