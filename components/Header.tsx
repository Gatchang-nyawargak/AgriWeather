'use client'

import { useState } from 'react'
import { Leaf, Globe } from 'lucide-react'

interface HeaderProps {
  activeTab: 'dashboard' | 'farm-advisor'
  setActiveTab: (tab: 'dashboard' | 'farm-advisor') => void
  lang: 'en' | 'sw'
  setLang: (lang: 'en' | 'sw') => void
}

const labels = {
  en: { dashboard: 'Weather Dashboard', advisor: 'Farm Advisor', toggle: 'SW' },
  sw: { dashboard: 'Hali ya Hewa', advisor: 'Mshauri wa Shamba', toggle: 'EN' },
}

export default function Header({ activeTab, setActiveTab, lang, setLang }: HeaderProps) {
  const t = labels[lang]

  return (
    <header className="sticky top-0 z-50" style={{ background: 'rgba(15,26,14,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-green)' }}>
            <Leaf size={16} color="white" />
          </div>
          <div>
            <div className="font-display font-semibold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
              AgriWeather
            </div>
            <div className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
              Kenya
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex gap-1 rounded-lg p-1" style={{ background: 'var(--bg-card)' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'dashboard' ? 'text-white' : 'hover:text-white'
            }`}
            style={{
              background: activeTab === 'dashboard' ? 'var(--accent-green)' : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : 'var(--text-secondary)',
            }}
          >
            {t.dashboard}
          </button>
          <button
            onClick={() => setActiveTab('farm-advisor')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all`}
            style={{
              background: activeTab === 'farm-advisor' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'farm-advisor' ? 'white' : 'var(--text-secondary)',
            }}
          >
            {t.advisor}
          </button>
        </nav>

        {/* Lang toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          title="Toggle language / Badilisha lugha"
        >
          <Globe size={14} />
          {t.toggle}
        </button>
      </div>
    </header>
  )
}
