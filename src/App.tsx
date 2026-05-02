import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CVPage from './pages/CVPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CVEditorPage from './pages/CVEditorPage'
import AIConfigPage from './pages/AIConfigPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/cv" element={<CVEditorPage />} />
        <Route path="/dashboard/ai" element={<AIConfigPage />} />
        <Route path="/dashboard/cv" element={<DashboardPage />} />
        <Route path="/dashboard/ai" element={<DashboardPage />} />
        <Route path="/:username" element={<CVPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
