import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const GRADE_COLORS: any = { A: 'bg-green-500', B: 'bg-emerald-500', C: 'bg-yellow-500', D: 'bg-orange-500', F: 'bg-red-500' }
const STATUS_LABELS: any = { new: 'Nouveau', applied: 'Postule', interview: 'Entretien', offer: 'Offre', rejected: 'Refuse', archived: 'Archive' }

export default function JobScannerPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('scan')
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    loadJobs()
  }, [user])

  const token = () => localStorage.getItem('token')

  const loadJobs = async () => {
    setLoadingJobs(true)
    try {
      const res = await axios.get(API + '/jobs', { headers: { Authorization: 'Bearer ' + token() } })
      setJobs(res.data)
    } catch {}
    setLoadingJobs(false)
  }

  const analyze = async () => {
    if (!description.trim()) return
    setAnalyzing(true)
    setResult(null)
    try {
      const res = await axios.post(API + '/jobs/analyze',
        { url, title, company, description },
        { headers: { Authorization: 'Bearer ' + token(), 'Content-Type': 'application/json' } }
      )
      setResult(res.data)
      loadJobs()
    } catch (e: any) {
      alert(e.response?.data?.error || 'Erreur analyse')
    }
    setAnalyzing(false)
  }

  const downloadPDF = async (jobId?: string) => {
    try {
      const res = await axios.post(API + '/pdf/generate',
        { jobId },
        { headers: { Authorization: 'Bearer ' + token() } }
      )
      const w = window.open('', '_blank')
      if (w) {
        w.document.write(res.data)
        w.document.close()
        setTimeout(() => w.print(), 800)
      }
    } catch {
      alert('Erreur generation PDF')
    }
  }

  const deleteJob = async (id: string) => {
    if (!confirm('Supprimer cette offre ?')) return
    try {
      await axios.delete(API + '/jobs/' + id, { headers: { Authorization: 'Bearer ' + token() } })
      loadJobs()
    } catch {}
  }

  const archiveJob = async (id: string) => {
    await updateStatus(id, 'archived')
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(API + '/jobs/' + id + '/status',
        { status },
        { headers: { Authorization: 'Bearer ' + token() } }
      )
      loadJobs()
    } catch {}
  }

  const ic = "w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <Link to="/" className="text-xl font-bold text-emerald-400">CVFlow</Link>
        <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm">Dashboard</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🔍</span>
          <h1 className="text-2xl font-bold">Scanner d'offres</h1>
        </div>

        <div className="flex gap-2 mb-6">
          {[['scan', 'Analyser une offre'], ['history', 'Mes offres (' + jobs.length + ')']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={"px-4 py-2 rounded-lg text-sm font-medium transition " + (tab === id ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700")}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'scan' && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-emerald-400 font-semibold">Informations de l'offre</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-slate-400 text-sm block mb-1">Titre du poste</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className={ic} placeholder="Administrateur Systeme" /></div>
                <div><label className="text-slate-400 text-sm block mb-1">Entreprise</label>
                  <input value={company} onChange={e => setCompany(e.target.value)} className={ic} placeholder="Societe Generale" /></div>
              </div>
              <div><label className="text-slate-400 text-sm block mb-1">URL de l'offre (optionnel)</label>
                <input value={url} onChange={e => setUrl(e.target.value)} className={ic} placeholder="https://linkedin.com/jobs/..." /></div>
              <div><label className="text-slate-400 text-sm block mb-1">Description du poste *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className={ic + " h-40"} placeholder="Collez ici la description complete du poste..." /></div>
              <button onClick={analyze} disabled={analyzing || !description.trim()}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                {analyzing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Analyse en cours...</> : '⚡ Analyser avec IA'}
              </button>
            </div>

            {result && (
              <div className="bg-slate-800 rounded-2xl p-6 space-y-4 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{result.analysis.title || title}</h2>
                    <p className="text-slate-400">{result.analysis.company || company}</p>
                  </div>
                  <div className="text-center">
                    <div className={"w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white " + (GRADE_COLORS[result.analysis.grade] || 'bg-slate-600')}>
                      {result.analysis.grade}
                    </div>
                    <p className="text-slate-400 text-xs mt-1">{result.analysis.score}/5</p>
                  </div>
                </div>

                <p className="text-slate-300 italic border-l-2 border-emerald-500 pl-3">{result.analysis.summary}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-green-400 font-semibold text-sm mb-2">✓ Points forts</h3>
                    <ul className="space-y-1">
                      {(result.analysis.pros || []).map((p: string, i: number) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2"><span className="text-green-400 mt-0.5">•</span>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-red-400 font-semibold text-sm mb-2">✗ Points faibles</h3>
                    <ul className="space-y-1">
                      {(result.analysis.cons || []).map((c: string, i: number) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2"><span className="text-red-400 mt-0.5">•</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {result.analysis.keywords?.length > 0 && (
                  <div>
                    <h3 className="text-blue-400 font-semibold text-sm mb-2">Mots-cles importants</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis.keywords.map((k: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">{k}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => downloadPDF(result.job?.id)}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                    PDF adapte a cette offre
                  </button>
                  <button onClick={() => downloadPDF()}
                    className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition">
                    CV standard
                  </button>
                </div>

                {result.analysis.recommendation && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                    <h3 className="text-emerald-400 font-semibold text-sm mb-1">Recommandation IA</h3>
                    <p className="text-slate-300 text-sm">{result.analysis.recommendation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-3">
            {loadingJobs && <div className="text-center text-slate-400 py-8">Chargement...</div>}
            {!loadingJobs && jobs.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-slate-400">Aucune offre analysee</p>
                <button onClick={() => setTab('scan')} className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-medium transition">
                  Analyser ma premiere offre
                </button>
              </div>
            )}
            {jobs.map((job: any) => (
              <div key={job.id} className="bg-slate-800 rounded-xl p-4 flex items-center gap-4 border border-slate-700 hover:border-slate-600 transition">
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 " + (GRADE_COLORS[job.grade] || 'bg-slate-600')}>
                  {job.grade}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{job.title}</h3>
                  <p className="text-slate-400 text-sm">{job.company}</p>
                  <p className="text-slate-500 text-xs">{new Date(job.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm font-medium">{job.score}/5</span>
                  <select value={job.status} onChange={e => updateStatus(job.id, e.target.value)}
                    className="bg-slate-700 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
                  </select>
                  <button onClick={() => archiveJob(job.id)} title="Archiver"
                    className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-yellow-400 transition text-xs">
                    ⬇
                  </button>
                  <button onClick={() => deleteJob(job.id)} title="Supprimer"
                    className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition text-xs">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}