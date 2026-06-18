import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ModeSelection from './components/ModeSelection.jsx'
import StudentJoin from './components/StudentJoin.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import StudentClassroom from './components/StudentClassroom.jsx'
import TeacherLogin from './components/TeacherLogin.jsx'
import TeacherDashboard from './components/TeacherDashboard.jsx'
import TeacherClassroom from './components/TeacherClassroom.jsx'
import Register from './components/Register.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ModeSelection />} />
            <Route path="/free" element={<App />} />
            <Route path="/student" element={<StudentJoin />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/dashboard/classroom/:classroomId" element={<StudentClassroom />} />
            <Route path="/teacher" element={<TeacherLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/dashboard/classroom/:classroomId" element={<TeacherClassroom />} />
            <Route path="/:lang" element={<App />} />
            <Route path="/:lang/ex/:exId" element={<App />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
