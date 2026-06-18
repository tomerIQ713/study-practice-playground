export const STORAGE_PREFIX = 'code-practice'
export const STORAGE_VERSION = 2

export function loadSavedState(language) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}-${language}`)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.version !== STORAGE_VERSION) {
      localStorage.removeItem(`${STORAGE_PREFIX}-${language}`)
      return null
    }
    const editors = {}
    for (const [id, ed] of Object.entries(data.editors || {})) {
      editors[id] = { id: ed.id, exercise: ed.exercise, sql: ed.sql || '', stdin: ed.stdin || '', results: null, error: null }
    }
    return {
      editors,
      activeEditorId: data.activeEditorId || 'free',
      completedExerciseIds: Array.isArray(data.completedExerciseIds) ? data.completedExerciseIds : [],
    }
  } catch {
    try { localStorage.removeItem(`${STORAGE_PREFIX}-${language}`) } catch { /* skip */ }
    return null
  }
}

export function saveState(state, language) {
  try {
    const payload = {
      version: STORAGE_VERSION,
      completedExerciseIds: state.completedExerciseIds,
      activeEditorId: state.activeEditorId,
      editors: {},
    }
    for (const [id, ed] of Object.entries(state.editors)) {
      payload.editors[id] = { id: ed.id, exercise: ed.exercise, sql: ed.sql, stdin: ed.stdin || '' }
    }
    localStorage.setItem(`${STORAGE_PREFIX}-${language}`, JSON.stringify(payload))
  } catch { /* localStorage full or unavailable — silently ignore */ }
}
