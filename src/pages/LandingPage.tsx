import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const FEATURES = [
  { icon: '🌐', title: 'CV public interactif', desc: 'Partagez votre CV avec une URL unique. Vos recruteurs peuvent le consulter sur mobile ou desktop.' },
  { icon: '🤖', title: 'Chatbot IA integre', desc: 'Un assistant IA repond aux questions des recruteurs en votre nom, 24h/24.' },
  { icon: '🔍', title: 'Scanner d offres', desc: 'Analysez n importe quelle offre d emploi et obtenez un score A-F de compatibilite avec votre profil.' },
  { icon: '📋', title: 'Kanban candidatures', desc: 'Suivez toutes vos candidatures visuellement. Glissez-deposez pour mettre a jour le statut.' },
  { icon: '📄', title: 'CV PDF adapte', desc: 'Generez un CV PDF personnalise pour chaque offre avec les mots-cles injectes automatiquement.' },
  { icon: '🎯', title: 'Prep entretiens IA', desc: 'Entrainz-vous avec des questions generees par IA et obtenez une evaluation de vos reponses.' },
]

const STEPS = [
  { n: '1', title: 'Creez votre compte', desc: 'Inscription gratuite en 30 secondes' },
  { n: '2', title: 'Remplissez votre CV', desc: 'Infos, experiences, competences, certifications' },
  { n: '3', title: 'Partagez votre URL', desc: 'cvflow.onemad.uk/votre-nom' },
  { n: '4', title: 'Trouvez votre poste', desc: 'Utilisez le scanner et le kanban' },
]

export default function LandingPage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <span className="text-2xl font-bold text-emerald-400">CVFlow</span>
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-medium transition">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white text-sm transition">Se connecter</Link>
              <Link to="/register" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-medium transition">Commencer gratuitement</Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center py-20">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30 mb-6">
            Plateforme de carriere IA
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Votre CV interactif<br/>
            <span className="text-emerald-400">alimenté par l IA</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Un CV interactif qui répond à vos recruteurs. Des outils IA pour trouver, analyser, préparer vos entretiens et décrocher le poste qui vous correspond.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-lg font-semibold transition shadow-lg shadow-emerald-500/20">
              Creer mon CV gratuit
            </Link>
            <a href="/mady" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-lg font-semibold transition">
              Voir un exemple
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {STEPS.map(s => (
            <div key={s.n} className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-lg font-bold mx-auto mb-3">{s.n}</div>
              <h3 className="font-semibold text-white mb-1">{s.title}</h3>
              <p className="text-slate-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Tout ce dont vous avez besoin</h2>
          <p className="text-slate-400">Une plateforme complete pour gerer votre recherche d emploi</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition group">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center py-16 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl border border-emerald-500/20 mb-20">
          <h2 className="text-3xl font-bold text-white mb-4">Pret a booster votre carriere ?</h2>
          <p className="text-slate-400 mb-8">Rejoignez CVFlow et creez votre CV interactif en quelques minutes</p>
          <Link to="/register" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-lg font-semibold transition shadow-lg shadow-emerald-500/20">
            Commencer gratuitement
          </Link>
        </div>
      </div>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>CVFlow — Plateforme de carriere IA</p>
      </footer>
    </div>
  )
}