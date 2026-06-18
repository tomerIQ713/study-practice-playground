import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import AssignmentForm from './AssignmentForm'
import MarkdownContent from './MarkdownContent'
import QuestionImage from './QuestionImage'
import { parseStarterFiles, parseEmptyFiles, parseQuestionData, normalizeQuestions, buildQuestionsData, fixMojibake, defaultCodeLang, LANG_LABELS, QTYPE_LABELS, CODE_LANG_LABELS, CODE_LANG_OPTIONS, ANSWER_FILE_EXT } from '../utils/parsers'
import './TeacherAssignments.css'

export default function TeacherAssignments({ classroomId }) {
  const { authFetch } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState(null)

  const fetchAssignments = useCallback(() => {
    authFetch(`/classrooms/${classroomId}/assignments`)
      .then(setAssignments)
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false))
  }, [classroomId, authFetch])

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  async function handleDelete(id) {
    if (!confirm('Delete this assignment?')) return
    try {
      await authFetch(`/assignments/${id}`, { method: 'DELETE' })
      fetchAssignments()
    } catch (err) {
      alert(err.message)
    }
  }

  function handleEdit(assignment) {
    setEditData(assignment)
    setEditingId(assignment.id)
    setShowForm(false)
  }

  async function handleDownload(url, filename) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const objUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objUrl
      a.download = filename
      a.click()
      URL.revokeObjectURL(objUrl)
    } catch {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.target = '_blank'
      a.click()
    }
  }

  function handleCreated() {
    setShowForm(false)
    fetchAssignments()
  }

  function handleUpdated() {
    setEditingId(null)
    setEditData(null)
    fetchAssignments()
  }

  return (
    <div className="teacher-assignments">
      <div className="teacher-assignments__header">
        <h3 className="teacher-assignments__title">Assignments</h3>
        {!showForm && !editingId && (
          <button className="teacher-assignments__create" onClick={() => setShowForm(true)}>
            + New Assignment
          </button>
        )}
      </div>

      {showForm && (
        <AssignmentForm
          classroomId={classroomId}
          onCreated={handleCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingId && editData && (
        <EditAssignmentForm
          assignment={editData}
          onUpdated={handleUpdated}
          onCancel={() => { setEditingId(null); setEditData(null) }}
        />
      )}

      {loading ? (
        <p className="teacher-assignments__status">Loading assignments…</p>
      ) : assignments.length === 0 ? (
        <p className="teacher-assignments__status">No assignments yet. Create one above!</p>
      ) : (
        <div className="teacher-assignments__list">
          {assignments.map(a => {
            const starterFiles = parseStarterFiles(a.starter_files)
            const emptyFiles = parseEmptyFiles(a.empty_files)
            const qData = parseQuestionData(a.question_data)
            const questions = normalizeQuestions(qData, a.question_type)
            return (
              <div key={a.id} className="teacher-assignments__card">
                <div className="teacher-assignments__card-top">
                  <span className="teacher-assignments__card-title">{a.title}</span>
                  <span className="teacher-assignments__card-lang">{LANG_LABELS[a.language] || a.language}</span>
                </div>
                {a.due_date && (
                  <p className="teacher-assignments__card-due">Due: {a.due_date}</p>
                )}
                {a.description && (
                  <p className="teacher-assignments__card-desc">{a.description}</p>
                )}

                {emptyFiles.length > 0 && (
                  <div className="teacher-assignments__card-empty">
                    <span className="teacher-assignments__card-qtype">Empty files</span>
                    <p className="teacher-assignments__card-qlabel">Students must create:</p>
                    <div className="teacher-assignments__card-empty-list">
                      {emptyFiles.map((f, i) => (
                        <span key={i} className="teacher-assignments__card-empty-file">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {questions.length > 0 && (
                  <div className="teacher-assignments__card-question">
                    {questions.map((q, qi) => (
                      <div key={qi} className="teacher-assignments__card-qitem">
                        <div className="teacher-assignments__card-qitem-top">
                          <span className="teacher-assignments__card-qtype">
                            {QTYPE_LABELS[q.type] || q.type}{q.type === 'coding' && q.codeLanguage ? ` · ${CODE_LANG_LABELS[q.codeLanguage] || q.codeLanguage}` : ''}
                          </span>
                          {questions.length > 1 && (
                            <span className="teacher-assignments__card-qnum">Q{qi + 1}</span>
                          )}
                        </div>
                        {q.type === 'coding' && (
                          <>
                            <p className="teacher-assignments__card-qlabel">Prompt:</p>
                            <MarkdownContent className="teacher-assignments__card-qtext">{q.prompt}</MarkdownContent>
                            {q.answerFile && <p className="teacher-assignments__card-qlabel">Answer file: {q.answerFile}</p>}
                          </>
                        )}
                        {q.type === 'multiple-choice' && (
                          <>
                            <p className="teacher-assignments__card-qlabel">Prompt:</p>
                            <MarkdownContent className="teacher-assignments__card-qtext">{q.prompt}</MarkdownContent>
                            <p className="teacher-assignments__card-qlabel">Options:</p>
                            <div className="teacher-assignments__card-mc">
                              {q.options?.map((opt, oi) => (
                                <p key={oi} className={`teacher-assignments__card-mc-opt${oi === q.correctIndex ? ' teacher-assignments__card-mc-correct' : ''}`}>
                                  {String.fromCharCode(65 + oi)}. {opt} {oi === q.correctIndex && '✓'}
                                </p>
                              ))}
                            </div>
                          </>
                        )}
                        {q.type === 'free-text' && (
                          <>
                            <p className="teacher-assignments__card-qlabel">Prompt:</p>
                            <MarkdownContent className="teacher-assignments__card-qtext">{q.prompt}</MarkdownContent>
                            {q.minLength > 0 && <p className="teacher-assignments__card-due">Min characters: {q.minLength}</p>}
                          </>
                        )}
                        {q.image && <QuestionImage filename={q.image} className="teacher-assignments__card-qimage" />}
                      </div>
                    ))}
                  </div>
                )}

                <div className="teacher-assignments__card-actions">
                  {a.file_attachment && (
                    <button
                      className="teacher-assignments__card-file"
                      onClick={() => handleDownload(`/api/assignments/${a.id}/attachment`, fixMojibake(a.file_attachment.replace(/^\d+-/, '')))}
                    >
                      {fixMojibake(a.file_attachment.replace(/^\d+-/, ''))}
                    </button>
                  )}
                  {starterFiles.map((sf, i) => (
                    <button
                      key={i}
                      className="teacher-assignments__card-starter"
                      onClick={() => handleDownload(`/api/assignments/${a.id}/starter-files/${encodeURIComponent(sf)}`, fixMojibake(sf.replace(/^\d+-/, '')))}
                    >
                      {fixMojibake(sf.replace(/^\d+-/, ''))}
                    </button>
                  ))}
                  <button className="teacher-assignments__card-edit" onClick={() => handleEdit(a)}>
                    Edit
                  </button>
                  <button className="teacher-assignments__card-delete" onClick={() => handleDelete(a.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EditAssignmentForm({ assignment, onUpdated, onCancel }) {
  const { authFetch } = useAuth()
  const existingQData = parseQuestionData(assignment.question_data)
  const existingQuestions = normalizeQuestions(existingQData, assignment.question_type)
  const existingEmpty = parseEmptyFiles(assignment.empty_files)

  const [title, setTitle] = useState(assignment.title || '')
  const [description, setDescription] = useState(assignment.description || '')
  const [dueDate, setDueDate] = useState(assignment.due_date || '')
  const [language, setLanguage] = useState(assignment.language || 'sql')
  const [file, setFile] = useState(null)
  const [provideStarter, setProvideStarter] = useState(false)
  const [starterFiles, setStarterFiles] = useState([])
  const [questions, setQuestions] = useState(existingQuestions)
  const [emptyFiles, setEmptyFiles] = useState(existingEmpty)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const existingStarter = parseStarterFiles(assignment.starter_files)
  const hasStarter = existingStarter.length > 0

  function validateQuestions() {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.prompt?.trim()) return `Question ${i + 1} prompt is required`
      if (q.type === 'multiple-choice') {
        if (!q.options?.every(o => o.trim())) return `Question ${i + 1}: all 4 options are required`
      }
    }
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    const qErr = validateQuestions()
    if (qErr) { setError(qErr); return }

    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      fd.append('description', description)
      if (dueDate) fd.append('due_date', dueDate)
      fd.append('language', language)
      if (questions.length > 0) {
        fd.append('question_type', questions[0].type)
        fd.append('question_data', buildQuestionsData(questions))
      } else {
        fd.append('question_type', '')
        fd.append('question_data', '')
      }
      fd.append('empty_files', JSON.stringify(emptyFiles.filter(f => f.trim())))
      if (file) fd.append('file', file)
      if (provideStarter) {
        for (const sf of starterFiles) {
          fd.append('starter_files', sf)
        }
      }

      await authFetch(`/assignments/${assignment.id}`, {
        method: 'PUT',
        body: fd,
      })

      onUpdated()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      <h4 className="assignment-form__title">Edit Assignment</h4>

      <label className="assignment-form__field">
        <span className="assignment-form__label">Title</span>
        <input className="assignment-form__input" type="text" value={title} onChange={e => setTitle(e.target.value)} autoFocus spellCheck={false} />
      </label>

      <label className="assignment-form__field">
        <span className="assignment-form__label">Description</span>
        <textarea className="assignment-form__textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
      </label>

      <div className="assignment-form__row">
        <label className="assignment-form__field">
          <span className="assignment-form__label">Due Date</span>
          <input className="assignment-form__input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </label>

        <label className="assignment-form__field">
          <span className="assignment-form__label">Language</span>
          <select className="assignment-form__input" value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="sql">SQL</option>
            <option value="c">C</option>
            <option value="cs">C#</option>
            <option value="java">Java</option>
            <option value="text">Text Only</option>
          </select>
        </label>
      </div>

      <label className="assignment-form__field">
        <span className="assignment-form__label">
          {'Attachment (.txt,.sql,.py,.cs,.c,.java,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg' + (assignment.file_attachment ? ', current will be replaced' : '') + ')'}
        </span>
        {assignment.file_attachment && (
          <p className="assignment-form__file-name">Current: {fixMojibake(assignment.file_attachment.replace(/^\d+-/, ''))}</p>
        )}
        <span className="assignment-form__file-btn">Choose File<input className="assignment-form__file-input" type="file" accept=".txt,.sql,.py,.cs,.c,.java,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg" onChange={e => setFile(e.target.files[0] || null)} /></span>
        {file && <p className="assignment-form__file-name">{file.name}</p>}
      </label>

      {hasStarter && !provideStarter && (
        <p className="assignment-form__file-name">Existing starter files: {existingStarter.map(s => fixMojibake(s.replace(/^\d+-/, ''))).join(', ')}</p>
      )}

      <div className="assignment-form__toggle-row">
        <label className="assignment-form__toggle">
          <input type="checkbox" checked={provideStarter} onChange={e => setProvideStarter(e.target.checked)} />
          <span className="assignment-form__toggle-track">
            <span className="assignment-form__toggle-knob" />
          </span>
          <span className="assignment-form__toggle-label">
            {hasStarter ? 'Replace starter files' : 'Provide starter files'}
          </span>
        </label>
      </div>

      {provideStarter && (
        <label className="assignment-form__field">
          <span className="assignment-form__label">Starter files (select multiple)</span>
          <span className="assignment-form__file-btn">Choose Files<input className="assignment-form__file-input" type="file" multiple accept=".sql,.py,.cs,.c,.java,.txt" onChange={e => setStarterFiles([...e.target.files])} /></span>
          {starterFiles.length > 0 && (
            <ul className="assignment-form__file-list">
              {[...starterFiles].map((sf, i) => (
                <li key={i} className="assignment-form__file-name">{sf.name}</li>
              ))}
            </ul>
          )}
        </label>
      )}

      <hr className="assignment-form__divider" />

      <div className="assignment-form__toggle-row">
        <label className="assignment-form__toggle">
          <input type="checkbox" checked={emptyFiles.length > 0} onChange={e => setEmptyFiles(e.target.checked ? [''] : [])} />
          <span className="assignment-form__toggle-track">
            <span className="assignment-form__toggle-knob" />
          </span>
          <span className="assignment-form__toggle-label">Ask students to create empty files</span>
        </label>
      </div>

      {emptyFiles.length > 0 && (
        <div className="assignment-form__empty-files">
          <span className="assignment-form__label">Filenames to create</span>
          {emptyFiles.map((f, i) => (
            <div key={i} className="assignment-form__empty-row">
              <input className="assignment-form__input" type="text" value={f} onChange={e => setEmptyFiles(p => p.map((x, j) => j === i ? e.target.value : x))} placeholder="e.g. main.py" spellCheck={false} />
              <button type="button" className="assignment-form__empty-remove" onClick={() => setEmptyFiles(p => p.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <button type="button" className="assignment-form__add-btn" onClick={() => setEmptyFiles(p => [...p, ''])}>+ Add file</button>
        </div>
      )}

      <hr className="assignment-form__divider" />

      <h4 className="assignment-form__section-title">Questions</h4>

      {questions.map((q, i) => (
        <div key={i} className="assignment-form__question-card">
          <div className="assignment-form__question-top">
            <span className="assignment-form__question-num">Question {i + 1}</span>
            <button type="button" className="assignment-form__question-remove" onClick={() => setQuestions(p => p.filter((_, j) => j !== i))}>✕ Remove</button>
          </div>
          <select className="assignment-form__input" value={q.type} onChange={e => { const t = e.target.value; setQuestions(p => p.map((x, j) => j === i ? (t === 'multiple-choice' ? { type: t, prompt: '', options: ['', '', '', ''], correctIndex: 0 } : t === 'free-text' ? { type: t, prompt: '', minLength: '' } : { type: t, prompt: '', codeLanguage: defaultCodeLang(language) }) : x)) }}>
            <option value="coding">Coding Question</option>
            <option value="multiple-choice">4-Answer (Multiple Choice)</option>
            <option value="free-text">Free Text</option>
          </select>
          <label className="assignment-form__field">
            <span className="assignment-form__label">Question</span>
            <textarea className="assignment-form__textarea" rows={3} value={q.prompt} onChange={e => setQuestions(p => p.map((x, j) => j === i ? { ...x, prompt: e.target.value } : x))} />
          </label>
          {q.type === 'coding' && (
            <>
              <label className="assignment-form__field">
                <span className="assignment-form__label">Code language</span>
                <select className="assignment-form__input" value={q.codeLanguage || defaultCodeLang(language)} onChange={e => setQuestions(p => p.map((x, j) => j === i ? { ...x, codeLanguage: e.target.value } : x))}>
                  {CODE_LANG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
              <div className="assignment-form__answer-file">
                <label className="assignment-form__toggle">
                  <input type="checkbox" checked={!!q.answerFile} onChange={e => {
                    const on = e.target.checked
                    setQuestions(p => p.map((x, j) => j === i ? { ...x, answerFile: on ? `solution.${ANSWER_FILE_EXT[x.codeLanguage || defaultCodeLang(language)]}` : undefined } : x))
                  }} />
                  <span className="assignment-form__toggle-track">
                    <span className="assignment-form__toggle-knob" />
                  </span>
                  <span className="assignment-form__toggle-label">Answer in separate file</span>
                </label>
                {q.answerFile && (
                  <label className="assignment-form__field" style={{ marginTop: 8 }}>
                    <span className="assignment-form__label">Filename</span>
                    <input className="assignment-form__input" type="text" value={q.answerFile} onChange={e => setQuestions(p => p.map((x, j) => j === i ? { ...x, answerFile: e.target.value } : x))} placeholder="e.g. solution.py" spellCheck={false} />
                  </label>
                )}
              </div>
            </>
          )}
          {q.type === 'multiple-choice' && (
            <div className="assignment-form__mc-options">
              {q.options?.map((opt, oi) => (
                <div key={oi} className="assignment-form__mc-row">
                  <input type="radio" name={`edit-mc-${i}`} value={oi} checked={q.correctIndex === oi} onChange={() => setQuestions(p => p.map((x, j) => j === i ? { ...x, correctIndex: oi } : x))} className="assignment-form__mc-radio" />
                  <input className="assignment-form__input" type="text" placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={e => setQuestions(p => p.map((x, j) => j === i ? { ...x, options: x.options.map((o, k) => k === oi ? e.target.value : o) } : x))} />
                </div>
              ))}
            </div>
          )}
          {q.type === 'free-text' && (
            <label className="assignment-form__field">
              <span className="assignment-form__label">Minimum characters (optional)</span>
              <input className="assignment-form__input" type="number" min="0" value={q.minLength || ''} onChange={e => setQuestions(p => p.map((x, j) => j === i ? { ...x, minLength: e.target.value } : x))} />
            </label>
          )}

          <div className="assignment-form__question-image-section">
            {q.image ? (
              <div className="assignment-form__question-image-preview">
                <QuestionImage filename={q.image} className="assignment-form__question-image-img" />
                <button type="button" className="assignment-form__question-image-remove" onClick={() => setQuestions(p => p.map((x, j) => j === i ? { ...x, image: undefined } : x))}>Remove image</button>
              </div>
            ) : (
              <label className="assignment-form__field">
                <span className="assignment-form__label">Image (optional)</span>
                <span className="assignment-form__file-btn">Upload Image<input className="assignment-form__file-input" type="file" accept=".png,.jpg,.jpeg,.gif,.webp,.bmp,.svg" onChange={async e => {
                  const file = e.target.files[0]
                  if (!file) return
                  e.target.value = ''
                  const fd = new FormData()
                  fd.append('image', file)
                  try {
                    const { filename } = await authFetch('/question-image', { method: 'POST', body: fd })
                    setQuestions(p => p.map((x, j) => j === i ? { ...x, image: filename } : x))
                  } catch (err) {
                    alert('Failed to upload image: ' + err.message)
                  }
                }} /></span>
              </label>
            )}
          </div>
        </div>
      ))}

      <button type="button" className="assignment-form__add-btn" onClick={() => setQuestions(p => [...p, { type: 'coding', prompt: '', codeLanguage: defaultCodeLang(language) }])}>+ Add Question</button>

      {error && <p className="assignment-form__error">{error}</p>}

      <div className="assignment-form__actions">
        <button className="assignment-form__submit" type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button className="assignment-form__cancel" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
