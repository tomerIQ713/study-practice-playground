import { Link } from 'react-router-dom'
import './ModeSelection.css'

export default function ModeSelection() {
  return (
    <div className="mode-selection">
      <div className="mode-selection__hero">
        <h1 className="mode-selection__title">Code Practice</h1>
        <p className="mode-selection__subtitle">Choose a mode to get started</p>
      </div>

      <div className="mode-selection__cards">
        <Link to="/free" className="mode-selection__card">
          <div className="mode-selection__card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 48 48">
              <rect width="40" height="40" x="4" y="4" rx="6" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2"/>
              <text x="24" y="30" textAnchor="middle" fill="var(--accent)" fontSize="18" fontFamily="monospace" fontWeight="bold">{'</>'}</text>
            </svg>
          </div>
          <div className="mode-selection__card-body">
            <span className="mode-selection__card-name">Free Practice</span>
            <p className="mode-selection__card-desc">Choose a language and work through guided exercises at your own pace. All progress is saved locally.</p>
          </div>
          <span className="mode-selection__card-action">Start →</span>
        </Link>

        <Link to="/student" className="mode-selection__card">
          <div className="mode-selection__card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 48 48">
              <rect width="40" height="40" x="4" y="4" rx="6" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2"/>
              <text x="24" y="30" textAnchor="middle" fill="var(--accent)" fontSize="18" fontFamily="monospace" fontWeight="bold">&#x1F393;</text>
            </svg>
          </div>
          <div className="mode-selection__card-body">
            <span className="mode-selection__card-name">I'm a student</span>
            <p className="mode-selection__card-desc">Join a classroom with a code and complete assignments from your teacher.</p>
          </div>
          <span className="mode-selection__card-action">Join →</span>
        </Link>
      </div>

      <div className="mode-selection__footer">
        <Link to="/teacher" className="mode-selection__teacher-link">I am a teacher →</Link>
        <Link to="/register" className="mode-selection__register-link">Register new account</Link>
      </div>
    </div>
  )
}
