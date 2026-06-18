import { useState, useEffect, useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion } from '@codemirror/autocomplete'
import { useAuth } from '../hooks/useAuth'
import MarkdownContent from './MarkdownContent'
import QuestionImage from './QuestionImage'
import { parseStarterFiles, parseEmptyFiles, parseQuestionData, normalizeQuestions, fixMojibake, QTYPE_LABELS } from '../utils/parsers'
import './AssignmentPlayground.css'

const LANG_EXTENSIONS = { sql: sql(), c: cpp(), cs: java(), java: java(), text: [] }
const CODE_LANG_EXTENSIONS = {
  python: python(), javascript: javascript(), sql: sql(), c_cpp: cpp(), csharp: java(), java: java(), text: [],
}
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg']
const TEXT_EXTENSIONS = ['txt', 'sql', 'py', 'cs', 'c', 'java', 'js', 'json', 'yaml', 'yml', 'xml', 'html', 'css', 'md']

const C_KEYWORDS = ['auto','break','case','char','const','continue','default','do','double','else','enum','extern','float','for','goto','if','int','long','register','return','short','signed','sizeof','static','struct','switch','typedef','union','unsigned','void','volatile','while','include','define','printf','scanf','main','NULL','FILE','malloc','calloc','realloc','free','memcpy','memset','strlen','strcpy','strcat','strcmp']

const JAVA_KEYWORDS = ['abstract','assert','boolean','break','byte','case','catch','char','class','const','continue','default','do','double','else','enum','extends','final','finally','float','for','if','implements','import','instanceof','int','interface','long','native','new','package','private','protected','public','return','short','static','strictfp','super','switch','synchronized','this','throw','throws','transient','try','void','volatile','while','true','false','null','String','System','out','print','println']

const KEYWORD_SOURCES = { c_cpp: C_KEYWORDS, java: JAVA_KEYWORDS, csharp: JAVA_KEYWORDS }

function langCompletions(extLang) {
  const keywords = KEYWORD_SOURCES[extLang]
  if (!keywords) return [autocompletion()]
  return [autocompletion({ override: [ctx => {
    const word = ctx.matchBefore(/\w+/)
    if (!word || (word.from === word.to && !ctx.explicit)) return null
    return { from: word.from, options: keywords.map(k => ({ label: k, type: 'keyword' })) }
  }] })]
}

const FILE_BOILERPLATES = {
  '.c': `#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}`,
  '.cs': `using System;\n\nclass Program {\n    static void Main() {\n        \n    }\n}`,
  '.java': `public class Main {\n    public static void main(String[] args) {\n        \n    }\n}`,
  '.py': '# Write your Python code here\n',
  '.js': '// Write your JavaScript code here\n',
  '.sql': '-- Write your SQL query here\n',
}

function getTemplate(filename) {
  const parts = filename.split('.')
  const ext = parts.length > 1 ? parts.pop().toLowerCase() : ''
  return FILE_BOILERPLATES[`.${ext}`] || ''
}

function defaultAnswerForQuestion(q) {
  if (q.type === 'multiple-choice') return null
  return ''
}

function parseSubmissionAnswer(answerStr, questions, emptyFilenames, answerFilenames) {
  const allFilenames = [...emptyFilenames, ...(answerFilenames || [])]
  const defaultFiles = Object.fromEntries(allFilenames.map(f => [f, getTemplate(f)]))
  const defaultAnswers = questions.map(q => defaultAnswerForQuestion(q))
  if (!answerStr) return { answers: defaultAnswers, fileContents: defaultFiles }

  try {
    const parsed = JSON.parse(answerStr)
    if (typeof parsed === 'object' && parsed.files) {
      const fileContents = {}
      for (const f of allFilenames) fileContents[f] = parsed.files[f] || ''
      const answers = parsed.answers
        ? parsed.answers.map((e, i) => {
            const q = questions[i]
            if (!q) return defaultAnswerForQuestion(q)
            if (q.type === 'multiple-choice') return parseInt(e.answer)
            return e.answer || ''
          })
        : defaultAnswers
      return { answers, fileContents }
    }
    if (Array.isArray(parsed)) {
      const answers = parsed.map((e, i) => {
        const q = questions[i]
        if (!q) return null
        if (q.type === 'multiple-choice') return parseInt(e.answer)
        return e.answer || ''
      })
      return { answers, fileContents: defaultFiles }
    }
  } catch {
    // not JSON, fall through
  }

  if (questions.length === 1) {
    const tp = questions[0].type
    return {
      answers: tp === 'multiple-choice' ? [parseInt(answerStr)] : [String(answerStr)],
      fileContents: defaultFiles,
    }
  }

  return { answers: defaultAnswers, fileContents: defaultFiles }
}

function buildSubmissionPayload(fileContents, answers, questions) {
  const answersPayload = questions.map((q, i) => ({
    type: q.type,
    answer: q.type === 'multiple-choice' ? String(answers[i] ?? '') : (answers[i] ?? ''),
  }))
  const hasFiles = Object.keys(fileContents).length > 0
  if (hasFiles) return JSON.stringify({ files: fileContents, answers: answersPayload })
  return JSON.stringify(answersPayload)
}

export default function AssignmentPlayground({ assignmentId, onClose, preloadData }) {
  const { authFetch } = useAuth()
  const [assignment, setAssignment] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [questions, setQuestions] = useState([])
  const [emptyFiles, setEmptyFiles] = useState([])
  const [starterFiles, setStarterFiles] = useState([])
  const [answerFilenames, setAnswerFilenames] = useState([])

  const [fileContents, setFileContents] = useState({})
  const [openTabs, setOpenTabs] = useState([])
  const [activeTab, setActiveTab] = useState('questions')
  const [answers, setAnswers] = useState([])
  const [readOnlyFiles, setReadOnlyFiles] = useState(new Set())
  const [gradeScore, setGradeScore] = useState('')
  const [gradeFeedback, setGradeFeedback] = useState('')
  const [gradingBusy, setGradingBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (preloadData) {
          setAssignment(preloadData.assignment)
          setSubmission(preloadData.submission)
          const emptyFilenames = parseEmptyFiles(preloadData.assignment.empty_files)
          const starterFilenames = parseStarterFiles(preloadData.assignment.starter_files)
          const qd = parseQuestionData(preloadData.assignment.question_data)
          const qs = normalizeQuestions(qd, preloadData.assignment.question_type)
          setEmptyFiles(emptyFilenames)
          setStarterFiles(starterFilenames)
          setQuestions(qs)
          const af = qs.filter(q => q.answerFile).map(q => q.answerFile)
          setAnswerFilenames(af)
          const parsed = parseSubmissionAnswer(preloadData.submission?.answer, qs, emptyFilenames, af)
          setFileContents(parsed.fileContents)
          setAnswers(parsed.answers)
          setGradeScore(preloadData.submission?.score != null ? String(preloadData.submission.score) : '')
          setGradeFeedback(preloadData.submission?.feedback || '')
          setLoading(false)
          return
        }

        const [a, s] = await Promise.all([
          authFetch(`/assignments/${assignmentId}`),
          authFetch(`/assignments/${assignmentId}/my-submission`).catch(() => null),
        ])
        if (cancelled) return
        setAssignment(a)

        const emptyFilenames = parseEmptyFiles(a.empty_files)
        const starterFilenames = parseStarterFiles(a.starter_files)
        const qd = parseQuestionData(a.question_data)
        const qs = normalizeQuestions(qd, a.question_type)

        setEmptyFiles(emptyFilenames)
        setStarterFiles(starterFilenames)
        setQuestions(qs)

        const af = qs.filter(q => q.answerFile).map(q => q.answerFile)
        setAnswerFilenames(af)

        const parsed = parseSubmissionAnswer(s?.answer, qs, emptyFilenames, af)
        setFileContents(parsed.fileContents)
        setAnswers(parsed.answers)
        setSubmission(s)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [assignmentId, authFetch, preloadData])

  const openFile = useCallback((filename) => {
    setOpenTabs(p => p.includes(filename) ? p : [...p, filename])
    setActiveTab(filename)
  }, [])

  const openStarterFile = useCallback(async (sf) => {
    const label = fixMojibake(sf.replace(/^\d+-/, ''))
    if (openTabs.includes(label)) { setActiveTab(label); return }
    if (fileContents[label] !== undefined) { openFile(label); return }

    const ext = label.split('.').pop()?.toLowerCase()
    const isImage = IMAGE_EXTENSIONS.includes(ext)

    try {
      const res = await fetch(`/api/assignments/${assignmentId}/starter-files/${encodeURIComponent(sf)}`)
      if (!res.ok) throw new Error('Failed to load')

      if (isImage) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 60000)
      } else {
        const text = await res.text()
        setFileContents(p => ({ ...p, [label]: text }))
        setReadOnlyFiles(p => new Set(p).add(label))
        openFile(label)
      }
    } catch {
      try {
        const res = await fetch(`/api/assignments/${assignmentId}/starter-files/${encodeURIComponent(sf)}`)
        if (!res.ok) throw new Error('Failed')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        if (isImage) {
          window.open(url, '_blank')
          setTimeout(() => URL.revokeObjectURL(url), 60000)
        } else {
          const a = document.createElement('a')
          a.href = url
          a.download = label
          a.click()
          URL.revokeObjectURL(url)
        }
      } catch {
        const a = document.createElement('a')
        a.href = `/api/assignments/${assignmentId}/starter-files/${encodeURIComponent(sf)}`
        a.target = '_blank'
        a.click()
      }
    }
  }, [assignmentId, openTabs, fileContents, openFile])

  const openAttachment = useCallback(async () => {
    if (!assignment?.file_attachment) return
    const label = fixMojibake(assignment.file_attachment.replace(/^\d+-/, ''))
    if (openTabs.includes(label)) { setActiveTab(label); return }
    const ext = label.split('.').pop()?.toLowerCase()
    const isImage = IMAGE_EXTENSIONS.includes(ext)
    const isText = TEXT_EXTENSIONS.includes(ext)

    try {
      const res = await fetch(`/api/assignments/${assignmentId}/attachment`)
      if (!res.ok) throw new Error('Failed to load')

      if (isImage || ext === 'pdf') {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 60000)
      } else if (isText) {
        const text = await res.text()
        setFileContents(p => ({ ...p, [label]: text }))
        setReadOnlyFiles(p => new Set(p).add(label))
        openFile(label)
      } else {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = label
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      try {
        const res = await fetch(`/api/assignments/${assignmentId}/attachment`)
        if (!res.ok) throw new Error('Failed')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        if (isImage || ext === 'pdf') {
          window.open(url, '_blank')
          setTimeout(() => URL.revokeObjectURL(url), 60000)
        } else {
          const a = document.createElement('a')
          a.href = url
          a.download = label
          a.click()
          URL.revokeObjectURL(url)
        }
      } catch {
        const a = document.createElement('a')
        a.href = `/api/assignments/${assignmentId}/attachment`
        a.download = label
        a.click()
      }
    }
  }, [assignmentId, assignment, openTabs, openFile])

  const closeFile = useCallback((filename, e) => {
    e.stopPropagation()
    setOpenTabs(p => {
      const next = p.filter(f => f !== filename)
      if (activeTab === filename) {
        setActiveTab(next.length > 0 ? next[next.length - 1] : 'questions')
      }
      return next
    })
  }, [activeTab])

  const updateFileContent = useCallback((filename, val) => {
    setFileContents(p => ({ ...p, [filename]: val }))
  }, [])

  const updateAnswer = useCallback((idx, val) => {
    setAnswers(p => p.map((v, i) => i === idx ? val : v))
  }, [])

  const handleSubmit = useCallback(async () => {
    setError('')
    if (!questions.length && !Object.keys(fileContents).length) {
      setError('Nothing to submit')
      return
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const a = answers[i]
      if (q.type === 'multiple-choice' && (a === null || a === undefined)) {
        setError(`Please select an answer for Question ${i + 1}`)
        return
      }
      if (q.type === 'free-text' && !String(a || '').trim()) {
        setError(`Please write an answer for Question ${i + 1}`)
        return
      }
      if (q.type === 'free-text' && q.minLength > 0 && String(a || '').trim().length < q.minLength) {
        setError(`Answer for Question ${i + 1} must be at least ${q.minLength} characters`)
        return
      }
    }

    setBusy(true)
    try {
      const payload = buildSubmissionPayload(fileContents, answers, questions)
      const s = await authFetch(`/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: { answer: payload },
      })
      setSubmission(s)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }, [assignmentId, questions, answers, fileContents, authFetch])

  const handleGrade = useCallback(async () => {
    if (gradeScore !== '' && (isNaN(gradeScore) || Number(gradeScore) < 0 || !Number.isInteger(Number(gradeScore)))) {
      setError('Score must be a non-negative integer')
      return
    }
    if (!preloadData?.submission) return
    setGradingBusy(true)
    setError('')
    try {
      const body = {}
      if (gradeScore !== '') body.score = Number(gradeScore)
      if (gradeFeedback.trim()) body.feedback = gradeFeedback.trim()
      const updated = await authFetch(`/assignments/${assignmentId}/submissions/${preloadData.submission.student_id}/grade`, {
        method: 'PATCH',
        body,
      })
      setSubmission(prev => ({ ...prev, score: updated.score, feedback: updated.feedback }))
      setGradeScore(updated.score != null ? String(updated.score) : '')
      setGradeFeedback(updated.feedback || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setGradingBusy(false)
    }
  }, [assignmentId, gradeScore, gradeFeedback, preloadData, authFetch])

  if (loading) {
    return (
      <div className="assignment-pg">
        <div className="assignment-pg__loading">Loading assignment…</div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="assignment-pg">
        <div className="assignment-pg__header">
          <button className="assignment-pg__back" onClick={onClose}>← Back</button>
          <h3 className="assignment-pg__header-title">Assignment not found</h3>
        </div>
        <div className="assignment-pg__loading">{error || 'Assignment not found'}</div>
      </div>
    )
  }

  const isSubmitted = !!submission

  return (
    <div className="assignment-pg">
      <div className="assignment-pg__header">
        <button className="assignment-pg__back" onClick={onClose}>{preloadData ? '← Back to students' : '← Back to classroom'}</button>
        <h3 className="assignment-pg__header-title">{assignment.title}</h3>
        {assignment.due_date && (
          <span className="assignment-pg__header-status">Due: {assignment.due_date}</span>
        )}
        {isSubmitted && (
          <span className="assignment-pg__submitted-badge">{preloadData ? 'Student\'s submission' : '✓ Submitted'}</span>
        )}
        {preloadData && (
          <span className="assignment-pg__header-student">{preloadData.submission.name}</span>
        )}
      </div>

      <div className="assignment-pg__body">
        <div className="assignment-pg__sidebar">
          {emptyFiles.length > 0 && (
            <div className="assignment-pg__sidebar-section">
              <p className="assignment-pg__sidebar-heading">Files to Create</p>
              {emptyFiles.map(f => (
                <button
                  key={f}
                  className={'assignment-pg__file' + (activeTab === f ? ' assignment-pg__file--active' : '')}
                  onClick={() => openFile(f)}
                >
                  <span>📄</span>
                  <span className="assignment-pg__file-label">{f}</span>
                </button>
              ))}
            </div>
          )}

          {answerFilenames.length > 0 && (
            <div className="assignment-pg__sidebar-section">
              <p className="assignment-pg__sidebar-heading">Answer Files</p>
              {answerFilenames.map(f => (
                <button
                  key={f}
                  className={'assignment-pg__file' + (activeTab === f ? ' assignment-pg__file--active' : '')}
                  onClick={() => openFile(f)}
                >
                  <span>📄</span>
                  <span className="assignment-pg__file-label">{f}</span>
                </button>
              ))}
            </div>
          )}

          {starterFiles.length > 0 && (
            <div className="assignment-pg__sidebar-section">
              <p className="assignment-pg__sidebar-heading">Starter Files</p>
              {starterFiles.map(sf => {
                const label = fixMojibake(sf.replace(/^\d+-/, ''))
                return (
                  <button
                    key={sf}
                    className={'assignment-pg__file' + (activeTab === label ? ' assignment-pg__file--active' : '')}
                    onClick={() => openStarterFile(sf)}
                  >
                    <span>🔒</span>
                    <span className="assignment-pg__file-label">{label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {assignment.file_attachment && (
            <div className="assignment-pg__sidebar-section">
              <p className="assignment-pg__sidebar-heading">Attachment</p>
              <button
                className="assignment-pg__file-link"
                onClick={openAttachment}
              >
                <span>📎</span>
                <span className="assignment-pg__file-label">{fixMojibake(assignment.file_attachment.replace(/^\d+-/, ''))}</span>
              </button>
            </div>
          )}
        </div>

        <div className="assignment-pg__main">
          <div className="assignment-pg__tabs">
            {questions.length > 0 && (
              <button
                className={'assignment-pg__tab' + (activeTab === 'questions' ? ' assignment-pg__tab--active' : '')}
                onClick={() => setActiveTab('questions')}
              >
                Questions
              </button>
            )}
            {openTabs.map(f => {
              const readOnly = readOnlyFiles.has(f)
              return (
                <button
                  key={f}
                  className={'assignment-pg__tab' + (activeTab === f ? ' assignment-pg__tab--active' : '')}
                  onClick={() => setActiveTab(f)}
                >
                  {readOnly && <span style={{ marginRight: 4, fontSize: 11 }}>🔒</span>}
                  {f}
                  <span className="assignment-pg__tab-close" onClick={e => closeFile(f, e)}>✕</span>
                </button>
              )
            })}
            {!questions.length && openTabs.length === 0 && (
              <span className="assignment-pg__tab" style={{ color: 'var(--text)', cursor: 'default' }}>No content</span>
            )}
          </div>

          <div className="assignment-pg__editor-area">
            {activeTab === 'questions' ? (
              <div className="assignment-pg__questions">
                {questions.length === 0 ? (
                  <p className="assignment-pg__no-questions">This assignment has no questions.</p>
                ) : (
                  questions.map((q, i) => (
                    <div key={i} className="assignment-pg__question-block">
                      <div className="assignment-pg__question-head">
                        <span className="assignment-pg__question-badge">Q{i + 1}</span>
                        <span className="assignment-pg__qtype">{QTYPE_LABELS[q.type]}</span>
                      </div>
                      <MarkdownContent className="assignment-pg__prompt">{q.prompt}</MarkdownContent>
                      {q.image && <QuestionImage filename={q.image} className="assignment-pg__question-image" />}

                      {q.type === 'coding' && (
                        q.answerFile ? (
                          <p className="assignment-pg__file-hint">
                            Write your answer in the file <strong>{q.answerFile}</strong> (open from the sidebar).
                          </p>
                        ) : (
                          <div className="assignment-pg__editor" style={{ maxHeight: 300 }}>
                            <CodeMirror
                              value={isSubmitted ? String(answers[i] ?? '') : String(answers[i] ?? '')}
                              onChange={isSubmitted ? undefined : val => updateAnswer(i, val)}
                              extensions={[...langCompletions(q.codeLanguage || assignment.language), CODE_LANG_EXTENSIONS[q.codeLanguage] || LANG_EXTENSIONS[assignment.language] || sql()]}
                              theme={oneDark}
                              placeholder="Write your code here…"
                              basicSetup={{ lineNumbers: true, highlightActiveLine: true, bracketMatching: true, tabSize: 4 }}
                              editable={!isSubmitted}
                            />
                          </div>
                        )
                      )}

                      {q.type === 'multiple-choice' && (
                        <div className="assignment-pg__mc">
                          {q.options?.map((opt, oi) => {
                            const isSelected = answers[i] === oi
                            const isCorrect = q.correctIndex === oi
                            let optClass = 'assignment-pg__mc-opt'
                            if (isSelected) optClass += ' assignment-pg__mc-opt--selected'
                            if (isSubmitted) {
                              if (isCorrect) optClass += ' assignment-pg__mc-opt--correct'
                              else if (isSelected) optClass += ' assignment-pg__mc-opt--wrong'
                            }
                            return (
                              <label key={oi} className={optClass}>
                                <input
                                  type="radio" name={`pg-mc-${i}`}
                                  value={oi}
                                  checked={isSelected}
                                  onChange={() => updateAnswer(i, oi)}
                                  disabled={isSubmitted}
                                  className="assignment-pg__mc-radio"
                                />
                                <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                                {isSubmitted && isCorrect && <span className="assignment-pg__mc-mark assignment-pg__mc-mark--correct">✓</span>}
                                {isSubmitted && isSelected && !isCorrect && <span className="assignment-pg__mc-mark assignment-pg__mc-mark--wrong">✗</span>}
                              </label>
                            )
                          })}
                        </div>
                      )}

                      {q.type === 'free-text' && (
                        <>
                          {q.minLength > 0 && <p className="assignment-pg__min-len">Minimum {q.minLength} characters</p>}
                          <textarea
                            className="assignment-pg__textarea"
                            rows={5}
                            value={isSubmitted ? String(answers[i] ?? '') : String(answers[i] ?? '')}
                            onChange={e => updateAnswer(i, e.target.value)}
                            disabled={isSubmitted}
                            placeholder="Write your answer here…"
                          />
                          {!isSubmitted && q.minLength > 0 && (
                            <p className="assignment-pg__char-count">{String(answers[i] ?? '').length} / {q.minLength} min</p>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="assignment-pg__editor">
                {(() => {
                  const answerQ = questions.find(q => q.answerFile === activeTab)
                  const fileLang = answerQ?.codeLanguage || assignment.language
                  const fileExt = [...langCompletions(fileLang), CODE_LANG_EXTENSIONS[fileLang] || LANG_EXTENSIONS[assignment.language] || sql()]
                  return (
                    <CodeMirror
                      value={String(fileContents[activeTab] ?? '')}
                      onChange={(!isSubmitted && !readOnlyFiles.has(activeTab)) ? val => updateFileContent(activeTab, val) : undefined}
                      extensions={fileExt}
                      theme={oneDark}
                      placeholder={readOnlyFiles.has(activeTab) ? '' : `Write your ${activeTab} content here…`}
                      basicSetup={{ lineNumbers: true, highlightActiveLine: true, bracketMatching: true, tabSize: 4 }}
                      editable={!isSubmitted && !readOnlyFiles.has(activeTab)}
                    />
                  )
                })()}
              </div>
            )}
          </div>

          <div className="assignment-pg__bottom">
            {!preloadData && !isSubmitted && (
              <button className="assignment-pg__submit" onClick={handleSubmit} disabled={busy}>
                {busy ? 'Submitting…' : 'Submit Answer'}
              </button>
            )}
            {isSubmitted && !preloadData && (
              <>
                <span className="assignment-pg__submitted-badge">✓ Submitted</span>
                {submission?.submitted_at && (
                  <span className="assignment-pg__submitted-at">at {submission.submitted_at}</span>
                )}
                {submission?.score != null && (
                  <span className="assignment-pg__grade-badge">Score: {submission.score}</span>
                )}
                {submission?.feedback && (
                  <div className="assignment-pg__feedback">
                    <strong>Feedback:</strong> {submission.feedback}
                  </div>
                )}
              </>
            )}
            {preloadData && (
              <div className="assignment-pg__grade-form">
                <h4 className="assignment-pg__grade-title">Grade</h4>
                <div className="assignment-pg__grade-row">
                  <label className="assignment-pg__grade-label">
                    Score
                    <input
                      type="number" min="0"
                      className="assignment-pg__grade-input"
                      value={gradeScore}
                      onChange={e => setGradeScore(e.target.value)}
                      placeholder="e.g. 85"
                    />
                  </label>
                </div>
                <div className="assignment-pg__grade-row">
                  <label className="assignment-pg__grade-label">
                    Feedback
                    <textarea
                      className="assignment-pg__grade-textarea"
                      rows={3}
                      value={gradeFeedback}
                      onChange={e => setGradeFeedback(e.target.value)}
                      placeholder="Optional feedback for the student…"
                    />
                  </label>
                </div>
                <button className="assignment-pg__grade-btn" onClick={handleGrade} disabled={gradingBusy}>
                  {gradingBusy ? 'Saving…' : 'Save Grade'}
                </button>
              </div>
            )}
            {error && <p className="assignment-pg__error">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
