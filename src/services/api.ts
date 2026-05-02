import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authAPI = {
  register: (data: { email: string; password: string; username: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
}

export const cvAPI = {
  get: () => api.get("/cv/me"),
  update: (data: any) => api.put("/cv/me", data),
  getPublic: (username: string) => api.get(`/cv/${username}`),
}

export const chatAPI = {
  send: (username: string, messages: any[]) =>
    api.post(`/chat/${username}`, { messages }),
}

export default api
