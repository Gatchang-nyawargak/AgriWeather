'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Loader2, TreePine, AlertTriangle, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react'
import { TreeAnalysis } from '@/lib/types'
import Image from 'next/image'

interface FarmAdvisorProps {
  lang: 'en' | 'sw'
}

const labels = {
  en: {
    title: 'Farm Advisor',
    subtitle: 'Upload a drone or aerial image of your farm to get AI-powered tree count, canopy health assessment, and agronomic recommendations.',
    dropzone: 'Drop your farm image here',
    dropzoneSub: 'JPEG · PNG · WEBP · max 20 MB',
    browse: 'Browse files',
    farmerId: 'Farmer / Plot ID',
    county: 'County',
    landAcres: 'Land size (acres)',
    location: 'Farm location / name',
    notes: 'Notes for AI (crop type, recent activity…)',
    analyze: 'Analyze Farm',
    analyzing: 'Analyzing…',
    results: 'Analysis Results',
    treeCount: 'Total Trees',
    density: 'Trees/Acre',
    canopy: 'Canopy Cover',
    confidence: 'Confidence',
    healthy: 'Healthy',
    needsCare: 'Needs Care',
    needsReplacement: 'Needs Replacement',
    species: 'Species',
    observations: 'Observations',
    recommendations: 'Recommendations',
    original: 'Original',
    overlay: 'Annotated Overlay',
    removeImage: 'Remove',
    countyPlaceholder: 'e.g. Bomet, Kiambu…',
    locationPlaceholder: 'e.g. Kapkimolwa Farm Block C',
    notesPlaceholder: 'e.g. Tea plantation, recently pruned',
  },
  sw: {
    title: 'Mshauri wa Shamba',
    subtitle: 'Pakia picha ya ndege au angani ya shamba lako kupata idadi ya miti, tathmini ya afya ya msitu, na mapendekezo ya kilimo.',
    dropzone: 'Weka picha yako ya shamba hapa',
    dropzoneSub: 'JPEG · PNG · WEBP · hadi MB 20',
    browse: 'Vinjari faili',
    farmerId: 'Nambari ya Mkulima / Shamba',
    county: 'Kaunti',
    landAcres: 'Ukubwa wa ardhi (ekari)',
    location: 'Mahali / Jina la Shamba',
    notes: 'Maelezo ya ziada kwa AI',
    analyze: 'Changanua Shamba',
    analyzing: 'Inachambua…',
    results: 'Matokeo ya Uchambuzi',
    treeCount: 'Jumla ya Miti',
    density: 'Miti/Ekari',
    canopy: 'Mfumo wa Msitu',
    confidence: 'Uhakika',
    healthy: 'Yenye Afya',
    needsCare: 'Inahitaji Utunzaji',
    needsReplacement: 'Inahitaji Kubadilishwa',
    species: 'Aina ya Mti',
    observations: 'Uchunguzi',
    recommendations: 'Mapendekezo',
    original: 'Asili',
    overlay: 'Picha Iliyowekwa Alama',
    removeImage: 'Ondoa',
    countyPlaceholder: 'mfano Bomet, Kiambu…',
    locationPlaceholder: 'mfano Shamba la Kapkimolwa',
    notesPlaceholder: 'mfano Bustani ya chai, ilipunguzwa hivi karibuni',
  },
}

export default function FarmAdvisor({ lang }: FarmAdvisorProps) {
  const t = labels[lang]
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TreeAnalysis | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showCvDebug, setShowCvDebug] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<{ farmerId: string; county: string; landAcres: string; location: string; notes: string }>({
    farmerId: '', county: '', landAcres: '', location: '', notes: '',
  })

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      setError('Please upload a JPEG, PNG, or WEBP image.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Image must be under 20 MB.')
      return
    }
    setError(null)
    setImage(file)
    setResult(null)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleSubmit = async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    setResult(null)

    const fd = new FormData()
    fd.append('image', image)
    if (formRef.current.farmerId) fd.append('farmerId', formRef.current.farmerId)
    if (formRef.current.county) fd.append('county', formRef.current.county)
    if (formRef.current.landAcres) fd.append('landAcres', formRef.current.landAcres)
    if (formRef.current.location) fd.append('location', formRef.current.location)
    if (formRef.current.notes) fd.append('notes', formRef.current.notes)

    try {
      const res = await fetch('/api/trees', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
      // scroll to results
      setTimeout(() => document.getElementById('tree-results')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t.title}</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Upload + form */}
        <div className="space-y-4">
          {/* Dropzone */}
          {!image ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
              style={{
                border: `2px dashed ${dragging ? 'var(--accent-green)' : 'var(--border-strong)'}`,
                background: dragging ? 'rgba(103,160,96,0.06)' : 'var(--bg-card)',
                minHeight: 200,
                padding: '2rem',
              }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(103,160,96,0.15)' }}>
                <Upload size={22} style={{ color: 'var(--accent-green)' }} />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>{t.dropzone}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.dropzoneSub}</div>
              </div>
              <button className="px-4 py-1.5 rounded-lg text-sm font-medium" style={{ background: 'var(--accent-green)', color: 'white' }}>
                {t.browse}
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {preview && (
                <img src={preview} alt="Farm preview" className="w-full object-cover" style={{ maxHeight: 280 }} />
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => { setImage(null); setPreview(null); setResult(null) }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}
                >
                  <X size={12} /> {t.removeImage}
                </button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}>
                {image.name} · {(image.size / (1024 * 1024)).toFixed(1)} MB
              </div>
            </div>
          )}

          {/* Metadata form */}
          <div className="card p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'farmerId', label: t.farmerId, placeholder: 'F-001' },
                { key: 'county', label: t.county, placeholder: t.countyPlaceholder },
                { key: 'landAcres', label: t.landAcres, placeholder: '2.5', type: 'number' },
                { key: 'location', label: t.location, placeholder: t.locationPlaceholder },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>{label}</label>
                  <input
                    type={type || 'text'}
                    placeholder={placeholder}
                    onChange={e => { (formRef.current as Record<string, string>)[key] = e.target.value }}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>{t.notes}</label>
              <textarea
                placeholder={t.notesPlaceholder}
                rows={2}
                onChange={e => { formRef.current.notes = e.target.value }}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(180,60,60,0.1)', border: '1px solid rgba(180,60,60,0.3)', color: '#e07070' }}>
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!image || loading}
            className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: image && !loading ? 'var(--accent-gold)' : 'var(--bg-card)',
              color: image && !loading ? 'white' : 'var(--text-muted)',
              cursor: image && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> {t.analyzing}</>
            ) : (
              <><TreePine size={16} /> {t.analyze}</>
            )}
          </button>
        </div>

        {/* Right: Results */}
        <div id="tree-results">
          {loading && (
            <div className="card p-8 flex flex-col items-center justify-center gap-4 h-64">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'var(--accent-green)', borderRightColor: 'var(--accent-gold)' }} />
                <TreePine size={20} className="absolute inset-0 m-auto" style={{ color: 'var(--accent-green)' }} />
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Running CV analysis + AI…</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-fade-up">
              {/* Images */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t.original, url: result.original_image_url },
                  { label: t.overlay, url: result.overlay_image_url },
                ].map(({ label, url }) => url ? (
                  <div key={label} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <div className="text-xs px-2 py-1" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>{label}</div>
                    <img src={url} alt={label} className="w-full object-cover" style={{ maxHeight: 160 }} />
                  </div>
                ) : null)}
              </div>

              {/* Low confidence / AI warning */}
              {(result.low_confidence || result.gemini_error) && (
                <div className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: 'rgba(196,136,58,0.1)', border: '1px solid rgba(196,136,58,0.3)', color: '#c4883a' }}>
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    {result.low_confidence && <div>Low confidence — image may not be a clear aerial/drone view.</div>}
                    {result.gemini_error && <div className="text-xs opacity-75">AI summary unavailable: {result.gemini_error}</div>}
                  </div>
                </div>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t.treeCount, value: result.total_tree_count.toLocaleString(), color: 'var(--accent-green)' },
                  { label: t.canopy, value: result.canopy_coverage_pct != null ? `${result.canopy_coverage_pct.toFixed(1)}%` : '—', color: '#5b8db8' },
                  ...(result.tree_density_per_acre != null ? [{ label: t.density, value: result.tree_density_per_acre.toFixed(1), color: 'var(--accent-gold)' }] : []),
                  { label: t.confidence, value: `${(result.confidence_score * 100).toFixed(0)}%`, color: result.confidence_score > 0.7 ? 'var(--accent-green)' : '#c4883a' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card p-3">
                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
                    <div className="text-xl font-display font-semibold" style={{ color }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Health breakdown */}
              <div className="card p-4">
                <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>TREE HEALTH BREAKDOWN</div>
                {[
                  { label: t.healthy, value: result.tree_health.healthy, color: '#67a060', icon: CheckCircle },
                  { label: t.needsCare, value: result.tree_health.needs_care, color: '#c4883a', icon: AlertTriangle },
                  { label: t.needsReplacement, value: result.tree_health.needs_replacement, color: '#c05050', icon: X },
                ].map(({ label, value, color, icon: Icon }) => {
                  const pct = result.total_tree_count ? (value / result.total_tree_count) * 100 : 0
                  return (
                    <div key={label} className="flex items-center gap-3 mb-2 last:mb-0">
                      <Icon size={12} style={{ color, flexShrink: 0 }} />
                      <span className="text-xs w-32 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className="text-xs w-8 text-right" style={{ color: 'var(--text-primary)' }}>{value}</span>
                    </div>
                  )
                })}
              </div>

              {/* Species */}
              {result.tree_species_guess && (
                <div className="rounded-lg px-4 py-2.5 flex items-center gap-2" style={{ background: 'rgba(103,160,96,0.08)', border: '1px solid rgba(103,160,96,0.2)' }}>
                  <TreePine size={14} style={{ color: 'var(--accent-green)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.species}:</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{result.tree_species_guess}</span>
                </div>
              )}

              {/* Observations */}
              {result.observations?.length > 0 && (
                <div className="card p-4">
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>{t.observations.toUpperCase()}</div>
                  <ul className="space-y-1.5">
                    {result.observations.map((obs, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: '#5b8db8', flexShrink: 0 }}>·</span>{obs}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations?.length > 0 && (
                <div className="card p-4" style={{ borderColor: 'rgba(196,136,58,0.3)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--accent-gold)' }}>{t.recommendations.toUpperCase()}</div>
                  <ul className="space-y-1.5">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-gold)', flexShrink: 0 }}>→</span>{rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CV Debug toggle */}
              {result.cv_debug && (
                <button
                  onClick={() => setShowCvDebug(!showCvDebug)}
                  className="flex items-center gap-2 text-xs w-full"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showCvDebug ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  CV Debug Info
                </button>
              )}
              {showCvDebug && result.cv_debug && (
                <div className="rounded-lg p-3 font-mono text-xs space-y-1" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  {Object.entries(result.cv_debug).map(([k, v]) => (
                    <div key={k}><span style={{ color: 'var(--accent-green)' }}>{k}:</span> {String(v)}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center gap-3 h-64" style={{ borderStyle: 'dashed' }}>
              <TreePine size={36} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p className="text-sm text-center" style={{ color: 'var(--text-muted)', maxWidth: '20ch' }}>
                Upload a farm image to see the analysis here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
