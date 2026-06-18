export function parseStarterFiles(val) {
  if (!val) return []
  try { return JSON.parse(val) } catch { return [] }
}

export function parseEmptyFiles(val) {
  if (!val) return []
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : [] } catch { return [] }
}

export function parseQuestionData(val) {
  if (!val) return null
  try { return JSON.parse(val) } catch { return null }
}

export function normalizeQuestions(qData, qType) {
  if (!qData) return []
  if (Array.isArray(qData)) return qData
  if (qType === 'coding') return [{ type: 'coding', prompt: qData.prompt || '' }]
  if (qType === 'multiple-choice') return [{ type: 'multiple-choice', prompt: qData.prompt || '', options: qData.options || ['', '', '', ''], correctIndex: qData.correctIndex ?? 0 }]
  if (qType === 'free-text') return [{ type: 'free-text', prompt: qData.prompt || '', minLength: qData.minLength || 0 }]
  return []
}

export function buildQuestionsData(qs) {
  return JSON.stringify(qs.filter(Boolean).map(q => {
    const base = q.type === 'coding' ? { type: 'coding', prompt: q.prompt, codeLanguage: q.codeLanguage }
      : q.type === 'multiple-choice' ? { type: 'multiple-choice', prompt: q.prompt, options: q.options, correctIndex: q.correctIndex }
      : q.type === 'free-text' ? { type: 'free-text', prompt: q.prompt, minLength: q.minLength ? parseInt(q.minLength) : 0 }
      : null
    if (!base) return null
    if (q.image) base.image = q.image
    if (q.answerFile) base.answerFile = q.answerFile
    return base
  }).filter(Boolean))
}

export function fixMojibake(str) {
  try {
    const bytes = new Uint8Array([...str].map(c => c.charCodeAt(0) & 0xFF))
    return new TextDecoder('utf-8').decode(bytes)
  } catch { return str }
}

export function defaultCodeLang(assignmentLang) {
  const m = { sql: 'sql', c: 'c_cpp', cs: 'csharp', java: 'java', text: 'text' }
  return m[assignmentLang] || 'python'
}

export const LANG_LABELS = { sql: 'SQL', c: 'C', cs: 'C#', java: 'Java', text: 'Text' }

export const QTYPE_LABELS = { coding: 'Coding', 'multiple-choice': '4-Answer', 'free-text': 'Free Text' }

export const CODE_LANG_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'sql', label: 'SQL' },
  { value: 'c_cpp', label: 'C/C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'text', label: 'Plain Text' },
]

export const CODE_LANG_LABELS = {
  python: 'Python', javascript: 'JavaScript', sql: 'SQL', c_cpp: 'C/C++', csharp: 'C#', java: 'Java', text: 'Plain Text',
}

export const ANSWER_FILE_EXT = {
  python: 'py', javascript: 'js', sql: 'sql', c_cpp: 'c', csharp: 'cs', java: 'java', text: 'txt',
}
