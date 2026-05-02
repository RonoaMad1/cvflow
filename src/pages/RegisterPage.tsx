import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register(email, password, username)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur inscription')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-emerald-400">CVFlow</Link>
          <h1 className="text-2xl font-bold text-white mt-4">Creer mon CV</h1>
          <p className="text-slate-400 mt-2">Ton CV sera accessible sur cvflow.onemad.uk/tonnom</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8 space-y-4">
          {error && <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-slate-400 text-sm mb-1">Nom d utilisateur</label>
            <div className="flex items-center bg-slate-700 rounded-lg overflow-hidden">
              <span className="px-3 text-slate-500 text-sm">cvflow.onemad.uk/</span>
              <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 bg-transparent text-white px-2 py-3 focus:outline-none"
                placeholder="tonnom" required />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="ton@email.com" required />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••" required minLength={6} />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
            {isLoading ? 'Creation...' : 'Creer mon CV gratuit'}
          </button>
          <p className="text-center text-slate-400 text-sm">
            Deja un compte ? <Link to="/login" className="text-emerald-400 hover:underline">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  )
}