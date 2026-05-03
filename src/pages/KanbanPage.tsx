import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const COLUMNS = [
  { id: 'new',       label: 'Nouveau',   color: 'border-slate-500',   bg: 'bg-slate-500/10' },
  { id: 'applied',   label: 'Postule',   color: 'border-blue-500',    bg: 'bg-blue-500/10' },
  { id: 'interview', label: 'Entretien', color: 'border-yellow-500',  bg: 'bg-yellow-500/10' },
  { id: 'offer',     label: 'Offre',     color: 'border-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'rejected',  label: 'Refuse',    color: 'border-red-500',     bg: 'bg-red-500/10' },
]

const GRADE_COLORS: any = {
  A: 'bg-green-500', B: 'bg-emerald-500', C: 'bg-yellow-500', D: 'bg-orange-500', F: 'bg-red-500'
}

export default function KanbanPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    loadJobs()
  }, [user])

  const token = () => localStorage.getItem('token')

  const loadJobs = async () => {
    setLoading(true)
    try {
      const res = await axios.get(API + '/jobs', { headers: { Authorization: 'Bearer ' + token() } })
      setJobs(res.data.filter((j: any) => j.status !== 'archived'))
    } catch {}
    setLoading(false)
  }

  const moveJob = async (id: string, status: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j))
    try {
      await axios.put(API + '/jobs/' + id + '/status',
        { status },
        { headers: { Authorization: 'Bearer ' + token() } }
      )
    } catch {}
  }

  const deleteJob = async (id: string) => {
    if (!confirm('Supprimer ?')) return
    try {
      await axios.delete(API + '/jobs/' + id, { headers: { Authorization: 'Bearer ' + token() } })
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch {}
  }

  const getJobsByStatus = (status: string) => jobs.filter(j => j.status === status)

  const onDragStart = (id: string) => setDragging(id)
  const onDragOver = (e: React.DragEvent) => e.preventDefault()
  const onDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    if (dragging) moveJob(dragging, status)
    setDragging(null)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <Link to="/" className="text-xl font-bold text-emerald-400">CVFlow</Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard/jobs" className="text-slate-400 hover:text-white text-sm transition">Scanner</Link>
          <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition">Dashboard</Link>
        </div>
      </nav>

      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <h1 className="text-2xl font-bold">Mes candidatures</h1>
            <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded-full text-sm">{jobs.length}</span>
          </div>
          <Link to="/dashboard/jobs"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-medium transition">
            + Analyser une offre
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(col => (
              <div key={col.id}
                onDragOver={onDragOver}
                onDrop={e => onDrop(e, col.id)}
                className={"flex flex-col rounded-2xl border-2 border-dashed transition min-h-96 " + col.color + " " + col.bg}>

                <div className="p-3 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{col.label}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-700 rounded-full text-slate-400">
                      {getJobsByStatus(col.id).length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-3 space-y-3">
                  {getJobsByStatus(col.id).map(job => (
                    <div key={job.id}
                      draggable
                      onDragStart={() => onDragStart(job.id)}
                      className="bg-slate-800 rounded-xl p-3 border border-slate-700 hover:border-slate-500 cursor-grab active:cursor-grabbing transition group shadow-sm">

                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={"w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 " + (GRADE_COLORS[job.grade] || 'bg-slate-600')}>
                          {job.grade || 'F'}
                        </div>
                        <button onClick={() => deleteJob(job.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition text-xs">
                          ✕
                        </button>
                      </div>

                      <h3 className="font-semibold text-sm text-white leading-tight mb-1">{job.title}</h3>
                      <p className="text-slate-400 text-xs mb-2">{job.company}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 text-xs font-medium">{job.score}/5</span>
                        <span className="text-slate-500 text-xs">
                          {new Date(job.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>

                      <div className="mt-2 flex gap-1 flex-wrap">
                        {COLUMNS.filter(c => c.id !== col.id).slice(0, 2).map(c => (
                          <button key={c.id} onClick={() => moveJob(job.id, c.id)}
                            className="text-xs px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-400 hover:text-white transition">
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {getJobsByStatus(col.id).length === 0 && (
                    <div className="text-center py-8 text-slate-600 text-xs">
                      Glisser ici
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}