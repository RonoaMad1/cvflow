import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold text-emerald-400">CVFlow</div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-slate-300 hover:text-white transition">Connexion</Link>
          <Link to="/register" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium transition">Creer mon CV</Link>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-8 py-24 text-center">
        <div className="inline-block px-4 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm mb-6">Plateforme de CV interactifs avec IA</div>
        <h1 className="text-6xl font-bold mb-6 leading-tight">Ton CV qui <span className="text-emerald-400">parle</span> pour toi</h1>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Cree un CV interactif avec un assistant IA personnalise. Partage ton lien unique avec les recruteurs.</p>
        <div className="flex gap-4 justify-center mb-20">
          <Link to="/register" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold text-lg transition">Commencer gratuitement</Link>
          <Link to="/mady" className="px-8 py-4 border border-slate-600 hover:border-emerald-500 rounded-xl font-semibold text-lg transition">Voir un exemple</Link>
        </div>
        <div className="grid grid-cols-3 gap-8 text-left">
          {[
            { icon: '🤖', title: 'Assistant IA', desc: 'Un chatbot entraine sur ton parcours repond aux recruteurs' },
            { icon: '🔗', title: 'Lien unique', desc: 'cvflow.onemad.uk/tonnom — partage ton profil en un clic' },
            { icon: '⚡', title: 'Ollama ou Claude', desc: 'Choisis ton modele IA : local avec Ollama ou Claude API' },
          ].map((f, i) => (
            <div key={i} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}