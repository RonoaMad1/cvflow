import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { cvAPI } from '../services/api'

export default function AIConfigPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    aiProvider: 'ollama',
    aiModel: 'gemma3:12b',
    systemPrompt: ''
  })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    cvAPI.get().then(r => { if (r.data) setConfig({
      aiProvider: r.data.aiProvider || 'ollama',
      aiModel: r.data.aiModel || 'gemma3:12b',
      systemPrompt: r.data.systemPrompt || ''
    })}).catch(() => {})
  }, [user])

  const save = async () => {
    setSaving(true)
    try { await cvAPI.update(config); alert('Configuration sauvegardee !') }
    catch { alert('Erreur sauvegarde') }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
        <Link to="/" className="text-2xl font-bold text-emerald-400">CVFlow</Link>
        <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition">Retour au dashboard</Link>
      </nav>
      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Assistant IA</h1>
        <div className="space-y-6">
          <div className="p-6 bg-slate-800 rounded-2xl space-y-4">
            <h2 className="text-lg font-semibold text-emerald-400">Modele IA</h2>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Fournisseur</label>
              <div className="flex gap-4">
                {['ollama', 'claude'].map(p => (
                  <button key={p} onClick={() => setConfig({...config, aiProvider: p})}
                    className={"px-4 py-2 rounded-lg font-medium transition " + (config.aiProvider === p ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white')}>
                    {p === 'ollama' ? 'Ollama (local)' : 'Claude API'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Modele</label>
              <select value={config.aiModel} onChange={e => setConfig({...config, aiModel: e.target.value})}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {config.aiProvider === 'ollama'
                  ? ['gemma3:12b', 'llama3.2', 'mistral', 'qwen2.5'].map(m => <option key={m}>{m}</option>)
                  : ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001'].map(m => <option key={m}>{m}</option>)
                }
              </select>
            </div>
          </div>
          <div className="p-6 bg-slate-800 rounded-2xl space-y-4">
            <h2 className="text-lg font-semibold text-emerald-400">Prompt systeme</h2>
            <p className="text-slate-400 text-sm">Decrivez qui vous etes et comment votre assistant doit repondre aux recruteurs.</p>
            <textarea value={config.systemPrompt} onChange={e => setConfig({...config, systemPrompt: e.target.value})}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-48"
              placeholder="Tu es l assistant IA de [Prenom Nom]. Tu connais son parcours..." />
          </div>
          <button onClick={save} disabled={saving}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
            {saving ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
          </button>
        </div>
      </main>
    </div>
  )
}