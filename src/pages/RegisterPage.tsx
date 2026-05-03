import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', username: '', firstName: '', lastName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Mot de passe trop court (6 caracteres min)'); return }
    if (!form.username.match(/^[a-z0-9_-]+$/)) { setError('Username: lettres minuscules, chiffres, - et _ uniquement'); return }
    setLoading(true)
    try {
      await axios.post(API + '/auth/register', form)
      navigate('/login?registered=1')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur inscription')
    }
    setLoading(false)
  }

  const ic = "w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-emerald-400">CVFlow</Link>
          <p className="text-slate-400 mt-2">Creez votre CV interactif gratuit</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h1 className="text-xl font-bold text-white mb-6">Creer un compte</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-slate-400 text-sm block mb-1">Prenom</label>
                <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className={ic} placeholder="Jean" required /></div>
              <div><label className="text-slate-400 text-sm block mb-1">Nom</label>
                <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className={ic} placeholder="Dupont" required /></div>
            </div>
            <div><label className="text-slate-400 text-sm block mb-1">Username (URL de votre CV)</label>
              <div className="flex items-center">
                <span className="bg-slate-600 text-slate-400 px-3 py-3 rounded-l-lg text-sm border-r border-slate-500">cvflow.onemad.uk/</span>
                <input value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase()})} className="flex-1 bg-slate-700 text-white rounded-r-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500" placeholder="jean-dupont" required />
              </div>
            </div>
            <div><label className="text-slate-400 text-sm block mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={ic} placeholder="jean@exemple.com" required /></div>
            <div><label className="text-slate-400 text-sm block mb-1">Mot de passe</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className={ic} placeholder="6 caracteres minimum" required /></div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg font-semibold transition">
              {loading ? 'Creation...' : 'Creer mon compte'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-4">
            Deja un compte ? <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}