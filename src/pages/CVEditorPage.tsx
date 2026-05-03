import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { cvAPI } from '../services/api'

const emptyExp = () => ({ id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', current: false, description: '' })
const emptyEdu = () => ({ id: Date.now().toString(), school: '', degree: '', field: '', startDate: '', endDate: '' })
const emptySkill = () => ({ name: '', level: 3 })
const emptyLang = () => ({ name: '', level: 'Courant' })

export default function CVEditorPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [cv, setCV] = useState({ firstName: '', lastName: '', title: '', summary: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' })
  const [experiences, setExperiences] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [languages, setLanguages] = useState<any[]>([])
  const [certifications, setCertifications] = useState<any[]>([])
  const [photo, setPhoto] = useState<string>('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    cvAPI.get().then(r => {
      if (r.data) {
        const d = r.data
        setCV({ firstName: d.firstName||'', lastName: d.lastName||'', title: d.title||'', summary: d.summary||'', email: d.email||'', phone: d.phone||'', location: d.location||'', linkedin: d.linkedin||'', github: d.github||'', website: d.website||'' })
        setExperiences(Array.isArray(d.experiences) ? d.experiences : [])
        setEducation(Array.isArray(d.education) ? d.education : [])
        setSkills(Array.isArray(d.skills) ? d.skills : [])
        setLanguages(Array.isArray(d.languages) ? d.languages : [])
        setCertifications(Array.isArray(d.certifications) ? d.certifications : [])
        setPhoto(d.photo || '')
      }
    }).catch(() => {})
  }, [user])

  const save = async () => {
    setSaving(true)
    try {
      await cvAPI.update({ ...cv, experiences, education, skills, languages, certifications, photo })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { alert('Erreur sauvegarde') }
    setSaving(false)
  }

  const ic = "w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
  const tabs = [{ id: 'info', label: 'Infos' }, { id: 'exp', label: 'Experiences' }, { id: 'edu', label: 'Formation' }, { id: 'skills', label: 'Competences' }, { id: 'langs', label: 'Langues' }, { id: 'certs', label: 'Certifications' }, { id: 'photo', label: 'Photo' }]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <Link to="/" className="text-xl font-bold text-emerald-400">CVFlow</Link>
        <div className="flex items-center gap-4">
          {user && <a href={"/" + user.username} target="_blank" className="text-slate-400 hover:text-emerald-400 text-sm">Voir mon CV</a>}
          <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm">Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mon CV</h1>
          <button onClick={save} disabled={saving} className={"px-6 py-2 rounded-lg font-semibold transition " + (saved ? "bg-green-500 text-white" : "bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-50")}>
            {saved ? "Sauvegarde !" : saving ? "..." : "Sauvegarder"}
          </button>
        </div>
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} className={"px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition " + (activeTab === t.id ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white")}>{t.label}</button>)}
        </div>

        {activeTab === "info" && (
          <div className="space-y-4 bg-slate-800 rounded-2xl p-6">
            <h2 className="text-emerald-400 font-semibold">Informations personnelles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-slate-400 text-sm block mb-1">Prenom</label><input value={cv.firstName} onChange={e => setCV({...cv, firstName: e.target.value})} className={ic} placeholder="Jean" /></div>
              <div><label className="text-slate-400 text-sm block mb-1">Nom</label><input value={cv.lastName} onChange={e => setCV({...cv, lastName: e.target.value})} className={ic} placeholder="Dupont" /></div>
            </div>
            <div><label className="text-slate-400 text-sm block mb-1">Titre professionnel</label><input value={cv.title} onChange={e => setCV({...cv, title: e.target.value})} className={ic} placeholder="Developpeur Full Stack" /></div>
            <div><label className="text-slate-400 text-sm block mb-1">Resume</label><textarea value={cv.summary} onChange={e => setCV({...cv, summary: e.target.value})} className={ic + " h-28"} placeholder="Decrivez votre profil..." /></div>
            <h2 className="text-emerald-400 font-semibold pt-2">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-slate-400 text-sm block mb-1">Email</label><input value={cv.email} onChange={e => setCV({...cv, email: e.target.value})} className={ic} /></div>
              <div><label className="text-slate-400 text-sm block mb-1">Telephone</label><input value={cv.phone} onChange={e => setCV({...cv, phone: e.target.value})} className={ic} /></div>
              <div><label className="text-slate-400 text-sm block mb-1">Localisation</label><input value={cv.location} onChange={e => setCV({...cv, location: e.target.value})} className={ic} /></div>
              <div><label className="text-slate-400 text-sm block mb-1">LinkedIn</label><input value={cv.linkedin} onChange={e => setCV({...cv, linkedin: e.target.value})} className={ic} placeholder="https://linkedin.com/in/..." /></div>
              <div><label className="text-slate-400 text-sm block mb-1">GitHub</label><input value={cv.github} onChange={e => setCV({...cv, github: e.target.value})} className={ic} placeholder="https://github.com/..." /></div>
              <div><label className="text-slate-400 text-sm block mb-1">Site web</label><input value={cv.website} onChange={e => setCV({...cv, website: e.target.value})} className={ic} placeholder="https://monsite.com" /></div>
            </div>
          </div>
        )}

        {activeTab === "exp" && (
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={exp.id} className="bg-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between"><h3 className="text-emerald-400 font-semibold">Experience {i+1}</h3><button onClick={() => setExperiences(experiences.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-300 text-sm">Supprimer</button></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-slate-400 text-sm block mb-1">Entreprise</label><input value={exp.company} onChange={e=>{const a=[...experiences];a[i]={...a[i],company:e.target.value};setExperiences(a)}} className={ic} placeholder="BNP Paribas" /></div>
                  <div><label className="text-slate-400 text-sm block mb-1">Poste</label><input value={exp.role} onChange={e=>{const a=[...experiences];a[i]={...a[i],role:e.target.value};setExperiences(a)}} className={ic} placeholder="Administrateur Systeme" /></div>
                  <div><label className="text-slate-400 text-sm block mb-1">Date debut</label><input value={exp.startDate} onChange={e=>{const a=[...experiences];a[i]={...a[i],startDate:e.target.value};setExperiences(a)}} className={ic} placeholder="2019" /></div>
                  <div>
                    <label className="text-slate-400 text-sm block mb-1">Date fin</label>
                    <input value={exp.endDate} disabled={exp.current} onChange={e=>{const a=[...experiences];a[i]={...a[i],endDate:e.target.value};setExperiences(a)}} className={ic+(exp.current?" opacity-40":"")} placeholder="2022" />
                    <label className="flex items-center gap-2 mt-1 text-sm text-slate-400 cursor-pointer"><input type="checkbox" checked={exp.current} onChange={e=>{const a=[...experiences];a[i]={...a[i],current:e.target.checked,endDate:""};setExperiences(a)}} /> Poste actuel</label>
                  </div>
                </div>
                <div><label className="text-slate-400 text-sm block mb-1">Description</label><textarea value={exp.description} onChange={e=>{const a=[...experiences];a[i]={...a[i],description:e.target.value};setExperiences(a)}} className={ic+" h-24"} placeholder="Decrivez vos missions..." /></div>
              </div>
            ))}
            <button onClick={() => setExperiences([...experiences, emptyExp()])} className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-xl text-slate-400 hover:text-emerald-400 transition">+ Ajouter une experience</button>
          </div>
        )}

        {activeTab === "edu" && (
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={edu.id} className="bg-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between"><h3 className="text-emerald-400 font-semibold">Formation {i+1}</h3><button onClick={() => setEducation(education.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-300 text-sm">Supprimer</button></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-slate-400 text-sm block mb-1">Ecole</label><input value={edu.school} onChange={e=>{const a=[...education];a[i]={...a[i],school:e.target.value};setEducation(a)}} className={ic} placeholder="ESGI" /></div>
                  <div><label className="text-slate-400 text-sm block mb-1">Diplome</label><input value={edu.degree} onChange={e=>{const a=[...education];a[i]={...a[i],degree:e.target.value};setEducation(a)}} className={ic} placeholder="Master" /></div>
                  <div><label className="text-slate-400 text-sm block mb-1">Domaine</label><input value={edu.field} onChange={e=>{const a=[...education];a[i]={...a[i],field:e.target.value};setEducation(a)}} className={ic} placeholder="Informatique" /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-slate-400 text-sm block mb-1">Debut</label><input value={edu.startDate} onChange={e=>{const a=[...education];a[i]={...a[i],startDate:e.target.value};setEducation(a)}} className={ic} placeholder="2019" /></div>
                    <div><label className="text-slate-400 text-sm block mb-1">Fin</label><input value={edu.endDate} onChange={e=>{const a=[...education];a[i]={...a[i],endDate:e.target.value};setEducation(a)}} className={ic} placeholder="2021" /></div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setEducation([...education, emptyEdu()])} className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-xl text-slate-400 hover:text-emerald-400 transition">+ Ajouter une formation</button>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="bg-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-emerald-400 font-semibold mb-4">Competences</h2>
            {skills.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={s.name} onChange={e=>{const a=[...skills];a[i]={...a[i],name:e.target.value};setSkills(a)}} className={ic+" flex-1"} placeholder="Windows Server" />
                <div className="flex gap-1">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>{const a=[...skills];a[i]={...a[i],level:n};setSkills(a)}} className={"w-7 h-7 rounded-full transition "+(n<=s.level?"bg-emerald-500":"bg-slate-600 hover:bg-slate-500")} />)}</div>
                <button onClick={() => setSkills(skills.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-300">x</button>
              </div>
            ))}
            <button onClick={() => setSkills([...skills, emptySkill()])} className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-xl text-slate-400 hover:text-emerald-400 transition mt-2">+ Ajouter une competence</button>
          </div>
        )}

        {activeTab === "photo" && (
          <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-emerald-400 font-semibold">Photo de profil</h2>
            <p className="text-slate-400 text-sm">Collez l'URL d'une photo (ex: LinkedIn, GitHub)</p>
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl font-bold flex-shrink-0 overflow-hidden">
                {photo ? <img src={photo} alt="photo" className="w-full h-full object-cover" onError={() => setPhoto('')} /> : <span>{cv.firstName?.[0]}{cv.lastName?.[0]}</span>}
              </div>
              <div className="flex-1">
                <label className="text-slate-400 text-sm block mb-1">URL de la photo</label>
                <input value={photo} onChange={e => setPhoto(e.target.value)} className={ic} placeholder="https://..." />
              </div>
            </div>
          </div>
        )}

        {activeTab === "certs" && (
          <div className="space-y-4">
            {certifications.map((cert: any, i: number) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between">
                  <h3 className="text-emerald-400 font-semibold">Certification {i+1}</h3>
                  <button onClick={() => setCertifications(certifications.filter((_:any,j:number)=>j!==i))} className="text-red-400 hover:text-red-300 text-sm">Supprimer</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-slate-400 text-sm block mb-1">Nom</label><input value={cert.name} onChange={e=>{const a=[...certifications];a[i]={...a[i],name:e.target.value};setCertifications(a)}} className={ic} placeholder="AWS Solutions Architect" /></div>
                  <div><label className="text-slate-400 text-sm block mb-1">Organisme</label><input value={cert.issuer} onChange={e=>{const a=[...certifications];a[i]={...a[i],issuer:e.target.value};setCertifications(a)}} className={ic} placeholder="Amazon Web Services" /></div>
                  <div><label className="text-slate-400 text-sm block mb-1">Date obtention</label><input value={cert.date} onChange={e=>{const a=[...certifications];a[i]={...a[i],date:e.target.value};setCertifications(a)}} className={ic} placeholder="2023" /></div>
                  <div><label className="text-slate-400 text-sm block mb-1">Date expiration</label><input value={cert.expiry} onChange={e=>{const a=[...certifications];a[i]={...a[i],expiry:e.target.value};setCertifications(a)}} className={ic} placeholder="2026 (optionnel)" /></div>
                </div>
                <div><label className="text-slate-400 text-sm block mb-1">URL du badge (optionnel)</label><input value={cert.url} onChange={e=>{const a=[...certifications];a[i]={...a[i],url:e.target.value};setCertifications(a)}} className={ic} placeholder="https://..." /></div>
              </div>
            ))}
            <button onClick={() => setCertifications([...certifications, {name:'',issuer:'',date:'',expiry:'',url:''}])} className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-xl text-slate-400 hover:text-emerald-400 transition">
              + Ajouter une certification
            </button>
          </div>
        )}

        {activeTab === "langs" && (
          <div className="bg-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-emerald-400 font-semibold mb-4">Langues</h2>
            {languages.map((l, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={l.name} onChange={e=>{const a=[...languages];a[i]={...a[i],name:e.target.value};setLanguages(a)}} className={ic+" flex-1"} placeholder="Francais" />
                <select value={l.level} onChange={e=>{const a=[...languages];a[i]={...a[i],level:e.target.value};setLanguages(a)}} className="bg-slate-700 text-white rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {["Natif","Courant","Avance","Intermediaire","Notions"].map(v=><option key={v}>{v}</option>)}
                </select>
                <button onClick={() => setLanguages(languages.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-300">x</button>
              </div>
            ))}
            <button onClick={() => setLanguages([...languages, emptyLang()])} className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-xl text-slate-400 hover:text-emerald-400 transition mt-2">+ Ajouter une langue</button>
          </div>
        )}

        <div className="mt-6">
          <button onClick={save} disabled={saving} className={"w-full py-3 rounded-xl font-semibold transition " + (saved ? "bg-green-500 text-white" : "bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-50")}>
            {saved ? "Sauvegarde !" : saving ? "Sauvegarde..." : "Sauvegarder mon CV"}
          </button>
        </div>
      </div>
    </div>
  )
}