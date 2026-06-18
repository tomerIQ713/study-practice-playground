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
import { parseQuestionData, parseEmptyFiles, normalizeQuestions, QTYPE_LABELS } from '../utils/parsers'
import './AssignmentAnswer.css'

const LANG_EXTENSIONS = { sql: sql(), c: cpp(), cs: java(), java: java(), text: [] }
const CODE_LANG_EXTENSIONS = {
  python: python(), javascript: javascript(), sql: sql(), c_cpp: cpp(), csharp: java(), java: java(), text: [],
}

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

function defaultAnswerForQuestion(q) {
  if (q.type === 'multiple-choice') return null
  return ''
}

function parseSubmissionAnswer(answerStr, questions) {
  if (!answerStr) return questions.map(q => defaultAnswerForQuestion(q))
  if (!questions.length) return []
  if (questions.length === 1) {
    const tp = questions[0].type
    if (tp === 'multiple-choice') return [parseInt(answerStr)]
    return [answerStr]
  }
  try {
    const parsed = JSON.parse(answerStr)
    if (Array.isArray(parsed)) {
      return parsed.map((e, i) => {
        const q = questions[i]
        if (!q) return null
        if (q.type === 'multiple-choice') return parseInt(e.answer)
        return e.answer || ''
      })
    }
  } catch {
    // not a JSON array, fall through to default
  }
  return questions.map(q => defaultAnswerForQuestion(q))
}

function buildAnswerPayload(answers, questions) {
  return JSON.stringify(questions.map((q, i) => ({
    type: q.type,
    answer: q.type === 'multiple-choice' ? String(answers[i] ?? '') : (answers[i] ?? ''),
  })))
}

export default function AssignmentAnswer({ assignmentId, onClose }) {
  const { authFetch } = useAuth()
  const [assignment, setAssignment] = useState(null)
  const [qDataRaw, setQDataRaw] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [a, s] = await Promise.all([
          authFetch(`/assignments/${assignmentId}`),
          authFetch(`/assignments/${assignmentId}/my-submission`).catch(() => null),
        ])
        if (cancelled) return
        setAssignment(a)
        const qd = parseQuestionData(a.question_data)
        setQDataRaw(qd)
        const questions = normalizeQuestions(qd, a.question_type)
        if (s) {
          setSubmission(s)
          setAnswers(parseSubmissionAnswer(s.answer, questions))
        } else {
          setAnswers(questions.map(q => defaultAnswerForQuestion(q)))
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [assignmentId, authFetch])

  const updateAnswer = useCallback((idx, val) => {
    setAnswers(p => p.map((v, i) => i === idx ? val : v))
  }, [])

  const handleSubmit = useCallback(async () => {
    setError('')
    const questions = normalizeQuestions(qDataRaw, assignment?.question_type)
    if (!questions.length) {
      setError('No questions to submit')
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
      const payload = buildAnswerPayload(answers, questions)
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
  }, [assignment, qDataRaw, assignmentId, answers, authFetch])

  if (loading) {
    return (
      <div className="answer-overlay" onClick={onClose}>
        <div className="answer-modal" onClick={e => e.stopPropagation()}>
          <p className="answer-modal__loading">Loading…</p>
        </div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="answer-overlay" onClick={onClose}>
        <div className="answer-modal" onClick={e => e.stopPropagation()}>
          <p className="answer-modal__error">Assignment not found</p>
          <button className="answer-modal__close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    )
  }

  const questions = normalizeQuestions(qDataRaw, assignment.question_type)
  const isSubmitted = !!submission
  const emptyFiles = parseEmptyFiles(assignment.empty_files)

  return (
    <div className="answer-overlay" onClick={onClose}>
      <div className="answer-modal" onClick={e => e.stopPropagation()}>
        <div className="answer-modal__header">
          <div>
            <h3 className="answer-modal__title">{assignment.title}</h3>
            {questions.length > 0 && (
              <span className="answer-modal__qcount">{questions.length} question{questions.length > 1 ? 's' : ''}</span>
            )}
          </div>
          <button className="answer-modal__close" onClick={onClose}>✕</button>
        </div>

        {assignment.due_date && (
          <p className="answer-modal__due">Due: {assignment.due_date}</p>
        )}

        {emptyFiles.length > 0 && (
          <div className="answer-modal__empty">
            <span className="answer-modal__empty-label">Create these files:</span>
            <div className="answer-modal__empty-list">
              {emptyFiles.map((f, i) => (
                <span key={i} className="answer-modal__empty-file">{f}</span>
              ))}
            </div>
          </div>
        )}

        {questions.length === 0 ? (
          <p className="answer-modal__no-question">This assignment has no questions.</p>
        ) : (
          <>
            {questions.map((q, i) => (
              <div key={i} className="answer-modal__question-block">
                <div className="answer-modal__question-head">
                  <span className="answer-modal__question-badge">Q{i + 1}</span>
                  <span className="answer-modal__qtype">{QTYPE_LABELS[q.type]}</span>
                </div>
                <MarkdownContent className="answer-modal__prompt">{q.prompt}</MarkdownContent>
                {q.image && <QuestionImage filename={q.image} className="answer-modal__question-image" />}

                {q.type === 'coding' && (
                  q.answerFile ? (
                    <>
                      <p className="answer-modal__file-hint">
                        Write your answer in the file <strong>{q.answerFile}</strong>.
                      </p>
                      <div className="answer-modal__editor">
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
                    </>
                  ) : (
                    <div className="answer-modal__editor">
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
                  <div className="answer-modal__mc">
                    {q.options?.map((opt, oi) => (
                      <label key={oi} className={`answer-modal__mc-opt${answers[i] === oi ? ' answer-modal__mc-opt--selected' : ''}`}>
                        <input
                          type="radio" name={`answer-mc-${i}`}
                          value={oi}
                          checked={answers[i] === oi}
                          onChange={() => updateAnswer(i, oi)}
                          disabled={isSubmitted}
                          className="answer-modal__mc-radio"
                        />
                        <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'free-text' && (
                  <>
                    {q.minLength > 0 && <p className="answer-modal__min-len">Minimum {q.minLength} characters</p>}
                    <textarea
                      className="answer-modal__textarea"
                      rows={6}
                      value={isSubmitted ? String(answers[i] ?? '') : String(answers[i] ?? '')}
                      onChange={e => updateAnswer(i, e.target.value)}
                      disabled={isSubmitted}
                      placeholder="Write your answer here…"
                    />
                    {!isSubmitted && q.minLength > 0 && (
                      <p className="answer-modal__char-count">{String(answers[i] ?? '').length} / {q.minLength} min</p>
                    )}
                  </>
                )}
              </div>
            ))}

            {isSubmitted && (
              <p className="answer-modal__submitted">Submitted at {submission.submitted_at}</p>
            )}
          </>
        )}

        {error && <p className="answer-modal__error">{error}</p>}

        <div className="answer-modal__actions">
          {!isSubmitted && questions.length > 0 && (
            <button className="answer-modal__submit" onClick={handleSubmit} disabled={busy}>
              {busy ? 'Submitting…' : 'Submit Answer'}
            </button>
          )}
          {isSubmitted && (
            <span className="answer-modal__submitted-badge">✓ Submitted</span>
          )}
          <button className="answer-modal__cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
