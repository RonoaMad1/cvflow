import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://cvflow-api.onemad.uk/api'

const GRADES: Record<string, string> = { A: '#10b981', B: '#06b6d4', C: '#f59e0b', D: '#f97316', F: '#ef4444' }
const STATUSES = ['new', 'evaluated', 'applied', 'interview', 'offer', 'rejected']
const STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau', evaluated: 'Évalué', applied: 'Postulé',
  interview: 'Entretien', offer: 'Offre', rejected: 'Refusé'
}

interface Job {
  id: number
  source: string
  url: string
  title: string
  company: string
  location: string
  salary: string
  category: string
  score: number
  grade: string
  status: string
  ai_analysis: any
  scraped_at: string
  description_preview: string
}

interface Stats {
  total: number
  new_count: number
  applied: number
  top_jobs: number
  sources: number
  avg_score: number
}

export default function PipelinePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [selected, setSelected] = useState<Job | null>(null)
  const [filters, setFilters] = useState({ status: '', category: '', minScore: '0' })
  const token = localStorage.getItem('token')

  useEffect(() => { fetchJobs() }, [filters])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      if (filters.category) params.set('category', filters.category)
      if (filters.minScore) params.set('minScore', filters.minScore)
      const r = await fetch(`${API}/scraper?${params}`)
      const text = await r.text()
      const d = JSON.parse(text)
      setJobs(d.jobs || [])
      setStats(d.stats)
    } catch (e) { console.error('Fetch error:', e) }
    setLoading(false)
  }

  const triggerScraper = async () => {
    setScraping(true)
    await fetch(`${API}/scraper/trigger`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    setTimeout(() => { setScraping(false); fetchJobs() }, 5000)
  }

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/scraper/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const gradeColor = (g: string) => GRADES[g] || '#94a3b8'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#e2e8f0', fontFamily: "JetBrains Mono, monospace", display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#10b981', fontSize: 13, letterSpacing: 2 }}>CAREER PIPELINE</span>
          {stats && <span style={{ color: '#475569', fontSize: 12 }}>{stats.total} offres · Avg {stats.avg_score}/5</span>}
        </div>
        <button onClick={triggerScraper} disabled={scraping} style={{
          padding: '6px 14px', borderRadius: 8, border: '1px solid #10b981', cursor: 'pointer',
          background: scraping ? '#1e3a2f' : 'transparent', color: '#10b981', fontSize: 12,
          animation: scraping ? 'pulse 1s infinite' : 'none'
        }}>
          {scraping ? '⟳ Scraping...' : '⟳ Scraper maintenant'}
        </button>
      </div>

      {/* Stats bar */}
      {stats && (
        <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '8px 20px', display: 'flex', gap: 24, fontSize: 12 }}>
          {[
            { label: 'TOTAL', value: stats.total, color: '#e2e8f0' },
            { label: 'NOUVEAU', value: stats.new_count, color: '#10b981' },
            { label: 'POSTULÉ', value: stats.applied, color: '#6366f1' },
            { label: 'TOP A/B', value: stats.top_jobs, color: '#f59e0b' },
          ].map(s => (
            <span key={s.label} style={{ color: s.color }}>
              {s.label} <strong>({s.value})</strong>
            </span>
          ))}
        </div>
      )}

      {/* Filtres */}
      <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '8px 20px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          style={{ background: '#1e2d4a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}>
          <option value="">Tous statuts</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          style={{ background: '#1e2d4a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}>
          <option value="">Toutes catégories</option>
          {['Admin Sys/DevOps', 'Dev Full Stack', 'Support IT', 'RH'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.minScore} onChange={e => setFilters(f => ({ ...f, minScore: e.target.value }))}
          style={{ background: '#1e2d4a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', fontSize: 12 }}>
          <option value="0">Score ≥ 0</option>
          <option value="3">Score ≥ 3</option>
          <option value="3.5">Score ≥ 3.5 (TOP)</option>
          <option value="4">Score ≥ 4 (A)</option>
        </select>
        <button onClick={fetchJobs} style={{ background: '#1e2d4a', color: '#10b981', border: '1px solid #10b981', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}>
          Actualiser
        </button>
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Liste */}
        <div style={{ width: selected ? '50%' : '100%', overflowY: 'auto', borderRight: selected ? '1px solid #1e2d4a' : 'none' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#475569' }}>Chargement...</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#475569' }}>
              Aucune offre — Lance le scraper !
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a' }}>
                  {['Score', 'Titre', 'Entreprise', 'Catégorie', 'Source', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#475569', fontWeight: 400, letterSpacing: 1, textTransform: 'uppercase', fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} onClick={() => setSelected(selected?.id === job.id ? null : job)}
                    style={{ borderBottom: '1px solid #1e2d4a', cursor: 'pointer', background: selected?.id === job.id ? '#1e2d4a' : 'transparent', transition: 'background 0.1s' }}>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ color: gradeColor(job.grade), fontWeight: 700 }}>{job.score}</span>
                      <span style={{ marginLeft: 4, background: gradeColor(job.grade), color: '#000', borderRadius: 3, padding: '1px 5px', fontSize: 10 }}>{job.grade}</span>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#e2e8f0', maxWidth: 200 }}>{job.title}</td>
                    <td style={{ padding: '8px 12px', color: '#94a3b8' }}>{job.company}</td>
                    <td style={{ padding: '8px 12px', color: '#6366f1', fontSize: 10 }}>{job.category}</td>
                    <td style={{ padding: '8px 12px', color: '#475569', fontSize: 10 }}>{job.source}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <select value={job.status} onChange={e => { e.stopPropagation(); updateStatus(job.id, e.target.value) }}
                        onClick={e => e.stopPropagation()}
                        style={{ background: '#1e2d4a', color: '#10b981', border: '1px solid #334155', borderRadius: 4, padding: '2px 4px', fontSize: 10, cursor: 'pointer' }}>
                        {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Détail */}
        {selected && (
          <div style={{ width: '50%', overflowY: 'auto', padding: 20, background: '#0d1525' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18 }}>✕</button>
              <a href={selected.url} target="_blank" rel="noreferrer"
                style={{ color: '#10b981', fontSize: 12, textDecoration: 'none', border: '1px solid #10b981', padding: '4px 12px', borderRadius: 6 }}>
                Voir l'offre →
              </a>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: gradeColor(selected.grade) }}>{selected.score}</span>
              <span style={{ marginLeft: 8, background: gradeColor(selected.grade), color: '#000', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>{selected.grade}</span>
            </div>
            <h2 style={{ fontSize: 16, color: '#e2e8f0', marginBottom: 4 }}>{selected.title}</h2>
            <p style={{ color: '#10b981', fontSize: 13, marginBottom: 2 }}>{selected.company}</p>
            <p style={{ color: '#475569', fontSize: 12, marginBottom: 16 }}>{selected.location} · {selected.category} · {selected.source}</p>
            {selected.salary && <p style={{ color: '#f59e0b', fontSize: 12, marginBottom: 12 }}>💰 {selected.salary}</p>}
            {selected.ai_analysis?.summary && (
              <div style={{ background: '#1e2d4a', border: '1px solid #334155', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <div style={{ color: '#475569', fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>ANALYSE IA</div>
                <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>{selected.ai_analysis.summary}</p>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#475569', fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>DESCRIPTION</div>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>{selected.description_preview}...</p>
            </div>
            <div>
              <div style={{ color: '#475569', fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>CHANGER STATUT</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #334155', cursor: 'pointer', fontSize: 11,
                      background: selected.status === s ? '#10b981' : '#1e2d4a',
                      color: selected.status === s ? '#000' : '#94a3b8' }}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
