import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (username) cvAPI.getPublic(username).then(r => setCV(r.data)).catch(() => {})
  }, [username])

  const sendMessage = async () => {
    if (!input.trim() || !username) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await chatAPI.send(username, [...messages, userMsg])
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion' }]) }
    setLoading(false)
  }

  if (!cv) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">CV non trouve</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">{cv.firstName} {cv.lastName}</h1>
          <p className="text-emerald-400 text-xl mb-4">{cv.title}</p>
          {cv.summary && <p className="text-slate-400 max-w-2xl">{cv.summary}</p>}
          <div className="flex gap-4 mt-4 flex-wrap">
            {cv.email && <a href={"mailto:" + cv.email} className="text-slate-400 hover:text-emerald-400 text-sm transition">{cv.email}</a>}
            {cv.location && <span className="text-slate-400 text-sm">{cv.location}</span>}
            {cv.linkedin && <a href={cv.linkedin} target="_blank" className="text-slate-400 hover:text-emerald-400 text-sm transition">LinkedIn</a>}
            {cv.github && <a href={cv.github} target="_blank" className="text-slate-400 hover:text-emerald-400 text-sm transition">GitHub</a>}
          </div>
        </div>

        {cv.experiences?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">Experience</h2>
            {cv.experiences.map((exp: any, i: number) => (
              <div key={i} className="mb-6 pl-4 border-l-2 border-slate-700">
                <h3 className="font-semibold text-lg">{exp.role}</h3>
                <p className="text-emerald-400">{exp.company}</p>
                <p className="text-slate-500 text-sm mb-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                <p className="text-slate-400 text-sm">{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {cv.skills?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">Competences</h2>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((s: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-slate-800 rounded-full text-sm border border-slate-700">{s.name}</span>
              ))}
            </div>
          </section>
        )}

        {cv.education?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">Formation</h2>
            {cv.education.map((edu: any, i: number) => (
              <div key={i} className="mb-4">
                <h3 className="font-semibold">{edu.degree} - {edu.field}</h3>
                <p className="text-slate-400">{edu.school}</p>
                <p className="text-slate-500 text-sm">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      <button onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-full flex items-center justify-center text-2xl shadow-lg transition z-50">
        {chatOpen ? '✕' : '💬'}
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-50" style={{height: '500px'}}>
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold">Assistant IA de {cv.firstName}</h3>
            <p className="text-xs text-slate-500">Pose-moi tes questions sur son profil</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-slate-500 text-sm text-center mt-8">Bonjour ! Pose-moi une question sur le profil de {cv.firstName}.</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={"flex " + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={"max-w-xs px-3 py-2 rounded-xl text-sm " + (m.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200')}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="bg-slate-700 px-3 py-2 rounded-xl text-sm text-slate-400">...</div></div>}
          </div>
          <div className="p-4 border-t border-slate-700 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Votre question..." />
            <button onClick={sendMessage} disabled={loading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-sm font-medium transition disabled:opacity-50">
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
