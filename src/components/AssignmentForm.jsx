import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import QuestionImage from './QuestionImage'
import { buildQuestionsData, defaultCodeLang, CODE_LANG_OPTIONS, ANSWER_FILE_EXT } from '../utils/parsers'
import './AssignmentForm.css'

const ACCEPT_EXTENSIONS = '.txt,.sql,.py,.cs,.c,.java,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg,.pdf'

export default function AssignmentForm({ classroomId, onCreated, onCancel }) {
  const { authFetch } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [language, setLanguage] = useState('sql')
  const [file, setFile] = useState(null)
  const [provideStarter, setProvideStarter] = useState(false)
  const [starterFiles, setStarterFiles] = useState([])
  const [questions, setQuestions] = useState([])
  const [emptyFiles, setEmptyFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

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
      }
      fd.append('empty_files', JSON.stringify(emptyFiles.filter(f => f.trim())))
      if (file) fd.append('file', file)
      if (provideStarter) {
        for (const sf of starterFiles) {
          fd.append('starter_files', sf)
        }
      }

      await authFetch(`/classrooms/${classroomId}/assignments`, {
        method: 'POST',
        body: fd,
      })

      setTitle('')
      setDescription('')
      setDueDate('')
      setLanguage('sql')
      setFile(null)
      setProvideStarter(false)
      setStarterFiles([])
      setQuestions([])
      setEmptyFiles([])
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      <h4 className="assignment-form__title">New Assignment</h4>

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
        <span className="assignment-form__label">Attachment ({ACCEPT_EXTENSIONS})</span>
        <span className="assignment-form__file-btn">Choose File<input className="assignment-form__file-input" type="file" accept={ACCEPT_EXTENSIONS} onChange={e => setFile(e.target.files[0] || null)} /></span>
        {file && <p className="assignment-form__file-name">{file.name}</p>}
      </label>

      <div className="assignment-form__toggle-row">
        <label className="assignment-form__toggle">
          <input type="checkbox" checked={provideStarter} onChange={e => setProvideStarter(e.target.checked)} />
          <span className="assignment-form__toggle-track">
            <span className="assignment-form__toggle-knob" />
          </span>
          <span className="assignment-form__toggle-label">Provide starter files</span>
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
                  <input type="radio" name={`mc-${i}`} value={oi} checked={q.correctIndex === oi} onChange={() => setQuestions(p => p.map((x, j) => j === i ? { ...x, correctIndex: oi } : x))} className="assignment-form__mc-radio" />
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
          {busy ? 'Creating…' : 'Create'}
        </button>
        <button className="assignment-form__cancel" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
