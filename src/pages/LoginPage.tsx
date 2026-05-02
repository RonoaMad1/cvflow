import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur de connexion')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-emerald-400">CVFlow</Link>
          <h1 className="text-2xl font-bold text-white mt-4">Connexion</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-8 space-y-4">
          {error && <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
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
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p className="text-center text-slate-400 text-sm">
            Pas encore de compte ? <Link to="/register" className="text-emerald-400 hover:underline">Creer mon CV</Link>
          </p>
        </form>
      </div>
    </div>
  )
}