import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { cvAPI } from '../services/api'

export default function CVEditorPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [cv, setCV] = useState({
    firstName: '', lastName: '', title: '', summary: '',
    email: '', phone: '', location: '', linkedin: '', github: '', website: ''
  })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    cvAPI.get().then(r => { if (r.data) setCV(r.data) }).catch(() => {})
  }, [user])

  const save = async () => {
    setSaving(true)
    try { await cvAPI.update(cv); alert('CV sauvegarde !') }
    catch { alert('Erreur sauvegarde') }
    setSaving(false)
  }

  const field = (label: string, key: string, placeholder = '') => (
    <div>
      <label className="block text-slate-400 text-sm mb-1">{label}</label>
      <input value={(cv as any)[key] || ''} onChange={e => setCV({...cv, [key]: e.target.value})}
        className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        placeholder={placeholder} />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
        <Link to="/" className="text-2xl font-bold text-emerald-400">CVFlow</Link>
        <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition">Retour au dashboard</Link>
      </nav>
      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Mon CV</h1>
        <div className="space-y-6">
          <div className="p-6 bg-slate-800 rounded-2xl space-y-4">
            <h2 className="text-lg font-semibold text-emerald-400">Informations personnelles</h2>
            <div className="grid grid-cols-2 gap-4">
              {field('Prenom', 'firstName', 'Jean')}
              {field('Nom', 'lastName', 'Dupont')}
            </div>
            {field('Titre professionnel', 'title', 'Developpeur Full Stack')}
            <div>
              <label className="block text-slate-400 text-sm mb-1">Resume</label>
              <textarea value={cv.summary || ''} onChange={e => setCV({...cv, summary: e.target.value})}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24"
                placeholder="Decrivez votre profil en quelques phrases..." />
            </div>
          </div>
          <div className="p-6 bg-slate-800 rounded-2xl space-y-4">
            <h2 className="text-lg font-semibold text-emerald-400">Contact</h2>
            <div className="grid grid-cols-2 gap-4">
              {field('Email', 'email', 'jean@exemple.com')}
              {field('Telephone', 'phone', '+33 6 00 00 00 00')}
              {field('Localisation', 'location', 'Paris, France')}
              {field('LinkedIn', 'linkedin', 'https://linkedin.com/in/...')}
              {field('GitHub', 'github', 'https://github.com/...')}
              {field('Site web', 'website', 'https://monsite.com')}
            </div>
          </div>
          <button onClick={save} disabled={saving}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
            {saving ? 'Sauvegarde...' : 'Sauvegarder mon CV'}
          </button>
          {user && (
            <a href={"/" + user.username} target="_blank"
              className="block text-center text-emerald-400 hover:underline text-sm">
              Voir mon CV public
            </a>
          )}
        </div>
      </main>
    </div>
  )
}