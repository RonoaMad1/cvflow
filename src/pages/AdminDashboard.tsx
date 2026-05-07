import { useState, useEffect } from 'react'

interface Stats {
  overview: {
    total_messages: number
    jailbreak_count: number
    avg_latency_ms: number
    unique_users: number
    messages_24h: number
    messages_7d: number
  }
  byProvider: { provider: string; model: string; count: number; avg_latency: number }[]
  byDay: { date: string; total: number; jailbreaks: number }[]
  rag: { total_chunks: number; indexed_cvs: number }
}

interface Conversation {
  id: number
  username: string
  message: string
  response: string
  provider: string
  model: string
  latency_ms: number
  is_jailbreak: boolean
  jailbreak_reason: string | null
  created_at: string
}

interface Security {
  jailbreaks: { id: number; username: string; message: string; jailbreak_reason: string; created_at: string }[]
  patterns: { jailbreak_reason: string; count: number }[]
  byUser: { username: string; attempts: number }[]
}

const API = import.meta.env.VITE_API_URL || 'https://cvflow-api.onemad.uk'

export default function AdminDashboard() {
  const [tab, setTab] = useState<'overview' | 'conversations' | 'security'>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [security, setSecurity] = useState<Security | null>(null)
  const [loading, setLoading] = useState(true)
  const [jailbreakFilter, setJailbreakFilter] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchConversations()
    fetchSecurity()
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [jailbreakFilter])

  const fetchStats = async () => {
    try {
      const r = await fetch(`${API}/api/admin/stats`)
      setStats(await r.json())
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const fetchConversations = async () => {
    try {
      const r = await fetch(`${API}/api/admin/conversations?jailbreak=${jailbreakFilter}`)
      const d = await r.json()
      setConversations(d.conversations || [])
    } catch (e) { console.error(e) }
  }

  const fetchSecurity = async () => {
    try {
      const r = await fetch(`${API}/api/admin/security`)
      setSecurity(await r.json())
    } catch (e) { console.error(e) }
  }

  const formatLatency = (ms: number) => ms > 1000 ? `${(ms/1000).toFixed(1)}s` : `${ms}ms`
  const formatDate = (d: string) => new Date(d).toLocaleString('fr-FR')

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#e2e8f0', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {/* Header */}
      <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
        <span style={{ color: '#10b981', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>CVFlow</span>
        <span style={{ color: '#334155', fontSize: 13 }}>/</span>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>LLMOps Dashboard</span>
      </div>

      {/* Tabs */}
      <div style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a', padding: '0 24px', display: 'flex', gap: 0 }}>
        {(['overview', 'conversations', 'security'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: 12,
            letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.2s',
            background: 'transparent',
            color: tab === t ? '#10b981' : '#475569',
            borderBottom: tab === t ? '2px solid #10b981' : '2px solid transparent'
          }}>
            {t === 'overview' ? '📊 Overview' : t === 'conversations' ? '💬 Conversations' : '🛡️ Sécurité'}
          </button>
        ))}
      </div>

      <div style={{ padding: 24 }}>
        {loading && <div style={{ color: '#475569', textAlign: 'center', padding: 60 }}>Chargement...</div>}

        {/* OVERVIEW */}
        {!loading && tab === 'overview' && stats && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Total messages', value: stats.overview.total_messages, color: '#10b981' },
                { label: 'Jailbreaks', value: stats.overview.jailbreak_count, color: '#ef4444' },
                { label: 'Latence moy.', value: formatLatency(stats.overview.avg_latency_ms), color: '#f59e0b' },
                { label: 'Utilisateurs', value: stats.overview.unique_users, color: '#6366f1' },
                { label: 'Messages 24h', value: stats.overview.messages_24h, color: '#06b6d4' },
                { label: 'Messages 7j', value: stats.overview.messages_7d, color: '#8b5cf6' },
              ].map(kpi => (
                <div key={kpi.label} style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: 12, padding: '20px 16px' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Activité par jour */}
            <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Activité 30 jours</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
                {stats.byDay.map((d, i) => {
                  const max = Math.max(...stats.byDay.map(x => x.total))
                  const h = max > 0 ? (d.total / max) * 70 : 4
                  return (
                    <div key={i} title={`${d.date?.toString().slice(0,10)}: ${d.total} msgs, ${d.jailbreaks} jailbreaks`}
                      style={{ flex: 1, minWidth: 6, height: h, background: d.jailbreaks > 0 ? '#ef4444' : '#10b981',
                        borderRadius: '3px 3px 0 0', opacity: 0.8, cursor: 'pointer' }} />
                  )
                })}
              </div>
            </div>

            {/* Par provider */}
            <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Providers IA</div>
              {stats.byProvider.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e2d4a' }}>
                  <div>
                    <span style={{ color: '#10b981', fontSize: 13 }}>{p.provider}</span>
                    <span style={{ color: '#475569', fontSize: 11, marginLeft: 8 }}>{p.model}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#e2e8f0', fontSize: 13 }}>{p.count} msgs</span>
                    <span style={{ color: '#475569', fontSize: 11, marginLeft: 12 }}>{formatLatency(p.avg_latency)} moy</span>
                  </div>
                </div>
              ))}
            </div>

            {/* RAG */}
            <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>RAG Index</div>
              <div style={{ display: 'flex', gap: 32 }}>
                <div><div style={{ fontSize: 24, color: '#6366f1' }}>{stats.rag.total_chunks}</div><div style={{ fontSize: 11, color: '#475569' }}>CHUNKS INDEXÉS</div></div>
                <div><div style={{ fontSize: 24, color: '#6366f1' }}>{stats.rag.indexed_cvs}</div><div style={{ fontSize: 11, color: '#475569' }}>CVS INDEXÉS</div></div>
              </div>
            </div>
          </div>
        )}

        {/* CONVERSATIONS */}
        {!loading && tab === 'conversations' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button onClick={() => setJailbreakFilter(false)} style={{
                padding: '8px 16px', borderRadius: 8, border: '1px solid #1e2d4a', cursor: 'pointer', fontSize: 12,
                background: !jailbreakFilter ? '#10b981' : 'transparent', color: !jailbreakFilter ? '#000' : '#475569'
              }}>Toutes</button>
              <button onClick={() => setJailbreakFilter(true)} style={{
                padding: '8px 16px', borderRadius: 8, border: '1px solid #1e2d4a', cursor: 'pointer', fontSize: 12,
                background: jailbreakFilter ? '#ef4444' : 'transparent', color: jailbreakFilter ? '#fff' : '#475569'
              }}>🛡️ Jailbreaks</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {conversations.map(c => (
                <div key={c.id} style={{ background: '#0f1629', border: `1px solid ${c.is_jailbreak ? '#ef4444' : '#1e2d4a'}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {c.is_jailbreak && <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 4, letterSpacing: 1 }}>JAILBREAK</span>}
                      <span style={{ color: '#10b981', fontSize: 12 }}>@{c.username}</span>
                      <span style={{ color: '#334155', fontSize: 11 }}>{c.provider} / {c.model}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#475569' }}>
                      <span>{formatLatency(c.latency_ms)}</span>
                      <span>{formatDate(c.created_at)}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, fontStyle: 'italic' }}>"{c.message}"</div>
                  <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{c.response}</div>
                  {c.jailbreak_reason && <div style={{ marginTop: 8, fontSize: 11, color: '#ef4444' }}>Pattern: {c.jailbreak_reason}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECURITY */}
        {!loading && tab === 'security' && security && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 12, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Patterns détectés</div>
                {security.patterns.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2d4a' }}>
                    <span style={{ color: '#ef4444', fontSize: 12 }}>{p.jailbreak_reason}</span>
                    <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>{p.count}x</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 12, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Top attaquants</div>
                {security.byUser.map((u, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2d4a' }}>
                    <span style={{ color: '#10b981', fontSize: 12 }}>@{u.username}</span>
                    <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 700 }}>{u.attempts} tentatives</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Historique jailbreaks</div>
              {security.jailbreaks.map((j, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #1e2d4a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#10b981', fontSize: 12 }}>@{j.username}</span>
                    <span style={{ color: '#475569', fontSize: 11 }}>{formatDate(j.created_at)}</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>"{j.message}"</div>
                  <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>Pattern: {j.jailbreak_reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
