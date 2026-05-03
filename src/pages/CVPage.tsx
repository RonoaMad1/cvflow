import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { cvAPI, chatAPI } from '../services/api'
import type { CV, Message } from '../types'

export default function CVPage() {
  const { username } = useParams<{ username: string }>()
  const [cv, setCV] = useState<CV | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('experience')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (username) cvAPI.getPublic(username).then(r => setCV(r.data)).catch(() => {})
  }, [username])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const msg = text || input
    if (!msg.trim() || !username) return
    const userMsg: Message = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await chatAPI.send(username, [...messages, userMsg])
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion.' }])
    }
    setLoading(false)
  }

  if (!cv) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Chargement...</p>
      </div>
    </div>
  )

  const yearsExp = (cv.experiences as any[])?.length > 0
    ? new Date().getFullYear() - Math.min(...(cv.experiences as any[]).map((e: any) => parseInt(e.startDate) || 2020))
    : 0

  const suggested = [
    'Quelles sont vos competences cles ?',
    'Parlez-moi de votre experience chez ' + ((cv.experiences as any[])?.[0]?.company || 'votre employeur'),
    'Etes-vous disponible immediatement ?',
    'Quels sont vos objectifs professionnels ?'
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-1" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition border border-slate-700">
            Telecharger PDF
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-1 space-y-5">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-center border border-slate-700">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg shadow-emerald-500/20 overflow-hidden">
                {(cv as any).photo ? <img src={(cv as any).photo} alt="photo" className="w-full h-full object-cover" /> : <span>{cv.firstName?.[0]}{cv.lastName?.[0]}</span>}
              </div>
              <h1 className="text-2xl font-bold">{cv.firstName} {cv.lastName}</h1>
              <p className="text-emerald-400 font-medium mt-1 text-sm">{cv.title}</p>
            </div>

            {yearsExp > 0 && (
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: yearsExp+'+', label: "Ans exp.", color: "emerald" },
                    { val: (cv.experiences as any[])?.length||0, label: "Postes", color: "teal" },
                    { val: (cv.skills as any[])?.length||0, label: "Competences", color: "blue" },
                    { val: (cv.education as any[])?.length||0, label: "Diplomes", color: "purple" }
                  ].map((s,i) => (
                    <div key={i} className={"text-center p-3 rounded-xl border bg-"+s.color+"-500/10 border-"+s.color+"-500/20"}>
                      <div className={"text-2xl font-bold text-"+s.color+"-400"}>{s.val}</div>
                      <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
              <h3 className="text-emerald-400 font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h3>
              <div className="space-y-2">
                {cv.email && <div className="flex items-center gap-2 text-sm"><span>✉</span><a href={"mailto:"+cv.email} className="text-slate-300 hover:text-white truncate">{cv.email}</a></div>}
                {cv.phone && <div className="flex items-center gap-2 text-sm"><span>☎</span><span className="text-slate-300">{cv.phone}</span></div>}
                {cv.location && <div className="flex items-center gap-2 text-sm"><span>📍</span><span className="text-slate-300">{cv.location}</span></div>}
                {cv.linkedin && <div className="flex items-center gap-2 text-sm"><span className="text-blue-400">in</span><a href={cv.linkedin} target="_blank" className="text-slate-300 hover:text-white">LinkedIn</a></div>}
                {cv.github && <div className="flex items-center gap-2 text-sm"><span>⌥</span><a href={cv.github} target="_blank" className="text-slate-300 hover:text-white">GitHub</a></div>}
              </div>
            </div>

            {(cv.skills as any[])?.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-emerald-400 font-semibold mb-4 text-sm uppercase tracking-wider">Competences</h3>
                <div className="space-y-3">
                  {(cv.skills as any[]).map((s: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{s.name}</span>
                        <span className="text-emerald-400">{s.level*20}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{width: s.level*20+"%"}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(cv.languages as any[])?.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-emerald-400 font-semibold mb-3 text-sm uppercase tracking-wider">Langues</h3>
                <div className="space-y-2">
                  {(cv.languages as any[]).map((l: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">{l.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-5">
            {cv.summary && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><span className="text-emerald-400">▸</span> Profil</h2>
                <p className="text-slate-300 leading-relaxed">{cv.summary}</p>
              </div>
            )}

            <div className="flex gap-2">
              {['experience','education','certifications'].map(s => (
                <button key={s} onClick={() => setActiveSection(s)}
                  className={"px-4 py-2 rounded-lg text-sm font-medium transition " + (activeSection===s ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700")}>
                  {s==='experience' ? 'Experiences' : s==='education' ? 'Formation' : 'Certifications'}
                </button>
              ))}
            </div>

            {activeSection === 'experience' && (cv.experiences as any[])?.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-transparent" />
                  <div className="space-y-6">
                    {(cv.experiences as any[]).map((exp: any, i: number) => (
                      <div key={i} className="pl-10 relative">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-emerald-500/30">{i+1}</div>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className="font-semibold text-white">{exp.role}</h3>
                            <p className="text-emerald-400 text-sm font-medium">{exp.company}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-slate-700 text-slate-400 rounded-full">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(cv as any).certifications?.length > 0 && activeSection === 'experience' && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mt-4">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="text-emerald-400">▸</span> Certifications</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(cv as any).certifications.map((cert: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-700/50 rounded-xl border border-slate-600">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm text-white">{cert.name}</h3>
                          <p className="text-emerald-400 text-xs">{cert.issuer}</p>
                          <p className="text-slate-500 text-xs mt-1">{cert.date}{cert.expiry ? ' → ' + cert.expiry : ''}</p>
                        </div>
                        <span className="text-lg">🏆</span>
                      </div>
                      {cert.url && <a href={cert.url} target="_blank" className="text-blue-400 text-xs hover:underline mt-1 block">Voir le badge</a>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'education' && (cv.education as any[])?.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="space-y-4">
                  {(cv.education as any[]).map((edu: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h3 className="font-semibold text-white">{edu.degree}</h3>
                          <p className="text-emerald-400 text-sm">{edu.school}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{edu.field}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-slate-600 text-slate-400 rounded-full">{edu.startDate} — {edu.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-full flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30 transition z-50">
        {chatOpen ? 'x' : 'chat'}
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-50" style={{height:'520px'}}>
          <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold">{cv.firstName?.[0]}</div>
              <div>
                <h3 className="font-semibold text-sm">Assistant IA de {cv.firstName}</h3>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/><p className="text-xs text-slate-400">En ligne</p></div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-2 mt-2">
                <p className="text-slate-500 text-xs text-center mb-3">Questions suggerees :</p>
                {suggested.map((q,i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="w-full text-left text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 rounded-lg text-slate-400 hover:text-white transition">{q}</button>
                ))}
              </div>
            )}
            {messages.map((m,i) => (
              <div key={i} className={"flex "+(m.role==='user'?'justify-end':'justify-start')}>
                <div className={"max-w-xs px-3 py-2 rounded-2xl text-sm "+(m.role==='user'?'bg-emerald-500 text-white rounded-br-sm':'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700')}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl flex gap-1">
                  {[0,150,300].map(d => <div key={d} className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:d+'ms'}}/>)}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-slate-700 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && sendMessage()}
              className="flex-1 bg-slate-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-700"
              placeholder="Posez une question..." />
            <button onClick={() => sendMessage()} disabled={loading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-sm font-medium transition disabled:opacity-50">➤</button>
          </div>
        </div>
      )}
    </div>
  )
}
