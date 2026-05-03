import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function DashboardPage() {
  const { user, logout, loadUser } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadUser().then(() => {
      if (!useAuthStore.getState().user) navigate('/login')
    })
  }, [])

  if (!user) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white">Chargement...</div></div>

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
        <Link to="/" className="text-2xl font-bold text-emerald-400">CVFlow</Link>
        <div className="flex items-center gap-4">
          <a href={`/${user.username}`} target="_blank" className="text-slate-400 hover:text-white text-sm transition">
            Voir mon CV
          </a>
          <button onClick={() => { logout(); navigate('/') }}
            className="px-4 py-2 text-slate-400 hover:text-white text-sm transition">
            Deconnexion
          </button>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Bonjour {user.username} !</h1>
        <p className="text-slate-400 mb-8">Ton CV est disponible sur <a href={`/${user.username}`} className="text-emerald-400 hover:underline">cvflow.onemad.uk/{user.username}</a></p>
        <div className="grid grid-cols-2 gap-6">
          <Link to="/dashboard/cv" className="p-6 bg-slate-800 rounded-2xl border border-slate-700 hover:border-emerald-500 transition group">
            <div className="text-3xl mb-3">📄</div>
            <h2 className="text-xl font-semibold mb-1 group-hover:text-emerald-400 transition">Mon CV</h2>
            <p className="text-slate-400 text-sm">Modifier mes informations, experiences, competences</p>
          </Link>
          <Link to="/dashboard/ai" className="p-6 bg-slate-800 rounded-2xl border border-slate-700 hover:border-emerald-500 transition group">
            <div className="text-3xl mb-3">🤖</div>
            <h2 className="text-xl font-semibold mb-1 group-hover:text-emerald-400 transition">Assistant IA</h2>
            <p className="text-slate-400 text-sm">Configurer le chatbot et le prompt systeme</p>
          </Link>
          <Link to="/dashboard/jobs" className="p-6 bg-slate-800 rounded-2xl border border-slate-700 hover:border-emerald-500 transition group">
            <div className="text-3xl mb-3">🔍</div>
            <h2 className="text-xl font-semibold mb-1 group-hover:text-emerald-400 transition">Scanner d offres</h2>
            <p className="text-slate-400 text-sm">Analyser et scorer les offres avec IA</p>
          </Link>
        </div>
      </main>
    </div>
  )
}