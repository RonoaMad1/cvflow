export interface User {
  id: string
  email: string
  username: string
}

export interface CV {
  id: string
  userId: string
  firstName: string
  lastName: string
  title: string
  summary?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  aiProvider: string
  aiModel: string
  systemPrompt?: string
  isPublic: boolean
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate?: string
}

export interface Skill {
  name: string
  level: number
}

export interface Language {
  name: string
  level: string
}

export interface Message {
  role: "user" | "assistant"
  content: string
}
