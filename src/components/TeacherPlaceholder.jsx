import { Link } from 'react-router-dom'
import './TeacherPlaceholder.css'

export default function TeacherPlaceholder() {
  return (
    <div className="teacher-placeholder">
      <Link to="/" className="teacher-placeholder__back">← Back</Link>
      <div className="teacher-placeholder__body">
        <div className="teacher-placeholder__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 48 48">
            <rect width="40" height="40" x="4" y="4" rx="6" fill="var(--accent-bg)" stroke="var(--border)" strokeWidth="2"/>
            <text x="24" y="30" textAnchor="middle" fill="var(--text)" fontSize="18" fontFamily="monospace" fontWeight="bold">&#x1F512;</text>
          </svg>
        </div>
        <h2 className="teacher-placeholder__title">Teacher Assignment</h2>
        <p className="teacher-placeholder__desc">
          This feature is coming soon. Teachers will be able to assign exercises and track student progress.
        </p>
      </div>
    </div>
  )
}
