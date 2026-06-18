import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import './TeacherSubmissions.css'

const LANG_LABELS = { sql: 'SQL', c: 'C', cs: 'C#', java: 'Java', text: 'Text' }

export default function TeacherSubmissions({ classroomId, onViewSubmission }) {
  const { authFetch } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [error, setError] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [gradingBusy, setGradingBusy] = useState(false)
  const [gradeScore, setGradeScore] = useState('')
  const [gradeFeedback, setGradeFeedback] = useState('')

  useEffect(() => {
    setLoadingAssignments(true) // eslint-disable-line react-hooks/set-state-in-effect
    authFetch(`/classrooms/${classroomId}/assignments`)
      .then(data => setAssignments(data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoadingAssignments(false))
  }, [classroomId, authFetch])

  function handleSelectAssignment(id) {
    setSelectedAssignmentId(id)
    setSubmissions([])
    setSelectedStudentId(null)
    setLoadingSubmissions(true)
    authFetch(`/assignments/${id}/submissions`)
      .then(data => setSubmissions(data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoadingSubmissions(false))
  }

  function handleSelectStudent(studentId) {
    setSelectedStudentId(prev => prev === studentId ? null : studentId)
    const sub = submissions.find(s => s.student_id === studentId)
    if (sub) {
      setGradeScore(sub.score !== null && sub.score !== undefined ? String(sub.score) : '')
      setGradeFeedback(sub.feedback || '')
    }
  }

  function handleViewFull(studentId) {
    const submission = submissions.find(s => s.student_id === studentId)
    if (!submission) return
    authFetch(`/assignments/${selectedAssignmentId}`)
      .then(assignment => onViewSubmission({ assignment, submission }))
      .catch(err => setError(err.message))
  }

  async function handleSubmitGrade(studentId) {
    if (gradeScore !== '' && (isNaN(gradeScore) || Number(gradeScore) < 0 || !Number.isInteger(Number(gradeScore)))) {
      setError('Score must be a non-negative integer')
      return
    }

    setGradingBusy(true)
    setError('')
    try {
      const body = {}
      if (gradeScore !== '') body.score = Number(gradeScore)
      if (gradeFeedback.trim()) body.feedback = gradeFeedback.trim()

      const updated = await authFetch(`/assignments/${selectedAssignmentId}/submissions/${studentId}/grade`, {
        method: 'PATCH',
        body,
      })
      setSubmissions(prev => prev.map(s => s.student_id === studentId ? { ...s, score: updated.score, feedback: updated.feedback } : s))
    } catch (err) {
      setError(err.message)
    } finally {
      setGradingBusy(false)
    }
  }

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId)

  return (
    <div className="teacher-submissions">
      <aside className="teacher-submissions__sidebar">
        <h3 className="teacher-submissions__sidebar-title">Student Answers</h3>
        {loadingAssignments ? (
          <p className="teacher-submissions__status">Loading assignments…</p>
        ) : assignments.length === 0 ? (
          <p className="teacher-submissions__status">No assignments yet.</p>
        ) : (
          <div className="teacher-submissions__assignment-list">
            {assignments.map(a => (
              <button
                key={a.id}
                className={`teacher-submissions__assignment-item${a.id === selectedAssignmentId ? ' teacher-submissions__assignment-item--active' : ''}`}
                onClick={() => handleSelectAssignment(a.id)}
              >
                <span className="teacher-submissions__assignment-title">{a.title}</span>
                <span className="teacher-submissions__assignment-lang">{LANG_LABELS[a.language] || a.language}</span>
              </button>
            ))}
          </div>
        )}
      </aside>

      <main className="teacher-submissions__main">
        {error && <p className="teacher-submissions__error">{error}</p>}

        {!selectedAssignmentId ? (
          <p className="teacher-submissions__placeholder">Select an assignment from the left</p>
        ) : (
          <>
            <h3 className="teacher-submissions__main-title">{selectedAssignment?.title}</h3>
            {loadingSubmissions ? (
              <p className="teacher-submissions__status">Loading submissions…</p>
            ) : submissions.length === 0 ? (
              <p className="teacher-submissions__status">No submissions yet.</p>
            ) : (
              <div className="teacher-submissions__student-list">
                {submissions.map(s => (
                  <div key={s.id} className="teacher-submissions__student-wrapper">
                    <button
                      className={`teacher-submissions__student-card${selectedStudentId === s.student_id ? ' teacher-submissions__student-card--selected' : ''}`}
                      onClick={() => handleSelectStudent(s.student_id)}
                    >
                      <span className="teacher-submissions__student-name">{s.name}</span>
                      <span className="teacher-submissions__student-email">{s.email}</span>
                      <span className="teacher-submissions__student-date">
                        {s.score !== null && s.score !== undefined ? (
                          <span className="teacher-submissions__score-badge">Score: {s.score}</span>
                        ) : (
                          `Submitted: ${s.submitted_at}`
                        )}
                      </span>
                    </button>

                    {selectedStudentId === s.student_id && (
                      <div className="teacher-submissions__detail">
                        <div className="teacher-submissions__answer-header">
                          <h4 className="teacher-submissions__answer-title">{s.name}'s Answer</h4>
                          <button className="teacher-submissions__back-btn" onClick={() => handleViewFull(s.student_id)}>
                            View Full Assignment
                          </button>
                        </div>
                        <pre className="teacher-submissions__answer">{s.answer}</pre>

                        <div className="teacher-submissions__grade-form">
                          <h4 className="teacher-submissions__grade-title">Grade</h4>
                          <div className="teacher-submissions__grade-row">
                            <label className="teacher-submissions__grade-label">
                              Score
                              <input
                                type="number"
                                min="0"
                                className="teacher-submissions__grade-input"
                                value={gradeScore}
                                onChange={e => setGradeScore(e.target.value)}
                                placeholder="e.g. 85"
                              />
                            </label>
                          </div>
                          <div className="teacher-submissions__grade-row">
                            <label className="teacher-submissions__grade-label">
                              Feedback
                              <textarea
                                className="teacher-submissions__grade-textarea"
                                rows={3}
                                value={gradeFeedback}
                                onChange={e => setGradeFeedback(e.target.value)}
                                placeholder="Optional feedback for the student…"
                              />
                            </label>
                          </div>
                          <button
                            className="teacher-submissions__grade-btn"
                            onClick={() => handleSubmitGrade(s.student_id)}
                            disabled={gradingBusy}
                          >
                            {gradingBusy ? 'Saving…' : 'Save Grade'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
