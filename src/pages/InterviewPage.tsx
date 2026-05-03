import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const TYPE_COLORS: any = { technique: 'bg-blue-500/20 text-blue-300 border-blue-500/30', comportementale: 'bg-purple-500/20 text-purple-300 border-purple-500/30', motivation: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', faiblesse: 'bg-orange-500/20 text-orange-300 border-orange-500/30' }

export default function InterviewPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId') || undefined
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState(jobId || '')
  const [questions, setQuestions] = useState<any[]>([])
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeQ, setActiveQ] = useState<number | null>(null)
  const [answers, setAnswers] = useState<any>({})
  const [evaluations, setEvaluations] = useState<any>({})
  const [evaluating, setEvaluating] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    loadJobs()
  }, [user])

  const token = () => localStorage.getItem('token')

  const loadJobs = async () => {
    try {
      const res = await axios.get(API + '/jobs', { headers: { Authorization: 'Bearer ' + token() } })
      setJobs(res.data.filter((j: any) => j.grade && j.grade !== 'F'))
    } catch {}
  }

  const generateQuestions = async () => {
    setLoading(true)
    setQuestions([])
    setEvaluations({})
    setAnswers({})
    setActiveQ(null)
    try {
      const res = await axios.post(API + '/interview/questions',
        { jobId: selectedJob || undefined },
        { headers: { Authorization: 'Bearer ' + token() } }
      )
      setQuestions(res.data.questions || [])
      setJobTitle(res.data.jobTitle || '')
      if (res.data.questions?.length > 0) setActiveQ(0)
    } catch { alert('Erreur generation questions') }
    setLoading(false)
  }

  const evaluate = async (q: any, idx: number) => {
    const answer = answers[idx]
    if (!answer?.trim()) return
    setEvaluating(idx.toString())
    try {
      const res = await axios.post(API + '/interview/evaluate',
        { question: q.question, answer, type: q.type },
        { headers: { Authorization: 'Bearer ' + token() } }
      )
      setEvaluations((prev: any) => ({ ...prev, [idx]: res.data }))
    } catch { alert('Erreur evaluation') }
    setEvaluating(null)
  }

  const scoreColor = (s: number) => s >= 8 ? 'text-green-400' : s >= 6 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <Link to="/" className="text-xl font-bold text-emerald-400">CVFlow</Link>
        <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm">Dashboard</Link>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🎯</span>
          <h1 className="text-2xl font-bold">Preparation entretien</h1>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-emerald-400 font-semibold mb-4">Choisir une offre (optionnel)</h2>
          <div className="flex gap-3">
            <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
              className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Questions generales basees sur mon CV</option>
              {jobs.map((j: any) => <option key={j.id} value={j.id}>{j.grade} - {j.title} chez {j.company}</option>)}
            </select>
            <button onClick={generateQuestions} disabled={loading}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-lg font-semibold transition flex items-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Generation...</> : 'Generer les questions'}
            </button>
          </div>
          {jobTitle && <p className="text-slate-400 text-sm mt-2">Questions pour : {jobTitle}</p>}
        </div>
        {questions.length > 0 && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-2">
              <h3 className="text-slate-400 text-sm font-medium mb-3">{questions.length} questions</h3>
              {questions.map((q: any, i: number) => (
                <button key={i} onClick={() => setActiveQ(i)}
                  className={'w-full text-left p-3 rounded-xl border transition ' + (activeQ===i ? 'bg-slate-700 border-emerald-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500') + (evaluations[i] ? ' opacity-90' : '')}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={'text-xs px-2 py-0.5 rounded-full border ' + (TYPE_COLORS[q.type]||'bg-slate-700 text-slate-400 border-slate-600')}>{q.type}</span>
                    {evaluations[i] && <span className={'text-sm font-bold ' + scoreColor(evaluations[i].score)}>{evaluations[i].score}/10</span>}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">{q.question}</p>
                </button>
              ))}
            </div>
            <div className="col-span-2">
              {activeQ !== null && questions[activeQ] && (
                <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={'text-xs px-2 py-1 rounded-full border ' + (TYPE_COLORS[questions[activeQ].type]||'')}>{questions[activeQ].type}</span>
                    <span className="text-slate-500 text-xs">Question {activeQ+1}/{questions.length}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white leading-relaxed">{questions[activeQ].question}</h2>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                    <p className="text-blue-300 text-xs">Conseil : {questions[activeQ].tip}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm block mb-2">Ta reponse</label>
                    <textarea value={answers[activeQ]||''} onChange={e => setAnswers((prev:any) => ({...prev, [activeQ]: e.target.value}))}
                      className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32 resize-none placeholder-slate-500"
                      placeholder="Ecrivez votre reponse ici... (methode STAR recommandee: Situation, Tache, Action, Resultat)" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => evaluate(questions[activeQ], activeQ)} disabled={evaluating!==null || !answers[activeQ]?.trim()}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                      {evaluating===activeQ.toString() ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>Evaluation...</> : 'Evaluer ma reponse'}
                    </button>
                    <button onClick={() => setActiveQ(Math.min(activeQ+1, questions.length-1))} disabled={activeQ===questions.length-1}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm disabled:opacity-30 transition">
                      Suivant
                    </button>
                  </div>
                  {evaluations[activeQ] && (
                    <div className="space-y-3 border-t border-slate-700 pt-4">
                      <div className="flex items-center gap-3">
                        <div className={'text-3xl font-bold ' + scoreColor(evaluations[activeQ].score)}>{evaluations[activeQ].score}<span className="text-lg text-slate-500">/10</span></div>
                        <p className="text-slate-300 text-sm">{evaluations[activeQ].feedback}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h4 className="text-green-400 text-xs font-semibold mb-1">Points forts</h4>
                          <ul className="space-y-1">{(evaluations[activeQ].strengths||[]).map((s:string,i:number)=><li key={i} className="text-slate-300 text-xs flex gap-1"><span className="text-green-400">+</span>{s}</li>)}</ul>
                        </div>
                        <div>
                          <h4 className="text-orange-400 text-xs font-semibold mb-1">A ameliorer</h4>
                          <ul className="space-y-1">{(evaluations[activeQ].improvements||[]).map((s:string,i:number)=><li key={i} className="text-slate-300 text-xs flex gap-1"><span className="text-orange-400">!</span>{s}</li>)}</ul>
                        </div>
                      </div>
                      {evaluations[activeQ].ideal_answer && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                          <h4 className="text-emerald-400 text-xs font-semibold mb-1">Reponse ideale</h4>
                          <p className="text-slate-300 text-xs leading-relaxed">{evaluations[activeQ].ideal_answer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}