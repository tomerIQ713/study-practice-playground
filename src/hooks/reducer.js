import { loadSavedState } from './persistence.js'

export function isExerciseLocked(exercise, completedIds, exercises) {
  if (!exercise) return true
  const idx = exercises.findIndex(e => e.id === exercise.id)
  if (idx <= 0) return false
  return !completedIds.includes(exercises[idx - 1].id)
}

export function editor(id, exercise) {
  const initialSql = (exercise && exercise.skeleton) || ''
  return { id, exercise: exercise || null, sql: initialSql, stdin: '', results: null, error: null, running: false, statusText: null }
}

export function buildInitialState(language) {
  const saved = loadSavedState(language)
  return {
    tables: [],
    loading: true,
    editors: saved?.editors || {},
    activeEditorId: saved?.activeEditorId || 'free',
    completedExerciseIds: saved?.completedExerciseIds || [],
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADED':
      return {
        ...state,
        loading: false,
        editors: Object.keys(state.editors).length > 0 ? state.editors : { free: editor('free') },
      }
    case 'SET_TABLES':
      return { ...state, tables: action.tables }
    case 'SET_EDITOR_SQL':
      return {
        ...state,
        editors: {
          ...state.editors,
          [action.id]: { ...state.editors[action.id], sql: action.sql },
        },
      }
    case 'SET_EDITOR_STDIN':
      return {
        ...state,
        editors: {
          ...state.editors,
          [action.id]: { ...state.editors[action.id], stdin: action.stdin },
        },
      }
    case 'SET_EDITOR_RUNNING':
      return {
        ...state,
        editors: {
          ...state.editors,
          [action.id]: { ...state.editors[action.id], running: action.running },
        },
      }
    case 'SET_EDITOR_STATUS':
      return {
        ...state,
        editors: {
          ...state.editors,
          [action.id]: { ...state.editors[action.id], statusText: action.statusText },
        },
      }
    case 'SET_EDITOR_RESULTS':
      return {
        ...state,
        editors: {
          ...state.editors,
          [action.id]: { ...state.editors[action.id], results: action.results, error: null, running: false, statusText: null },
        },
      }
    case 'SET_EDITOR_ERROR':
      return {
        ...state,
        editors: {
          ...state.editors,
          [action.id]: { ...state.editors[action.id], error: action.error, results: null, running: false, statusText: null },
        },
      }
    case 'OPEN_EDITOR':
      if (state.editors[action.id]) {
        return { ...state, activeEditorId: action.id }
      }
      return {
        ...state,
        editors: { ...state.editors, [action.id]: editor(action.id, action.exercise) },
        activeEditorId: action.id,
      }
    case 'CLOSE_EDITOR': {
      const rest = { ...state.editors }
      delete rest[action.id]
      const nextId = state.activeEditorId === action.id ? 'free' : state.activeEditorId
      return { ...state, editors: rest, activeEditorId: nextId }
    }
    case 'SET_ACTIVE_EDITOR':
      return { ...state, activeEditorId: action.id }
    case 'MARK_COMPLETED':
      if (state.completedExerciseIds.includes(action.id)) return state
      return {
        ...state,
        completedExerciseIds: [...state.completedExerciseIds, action.id].sort((a, b) => a - b),
      }
    case 'MARK_ALL_COMPLETED_UP_TO': {
      const target = action.exercises.find(e => e.id === action.id)
      const limit = target ? action.exercises.indexOf(target) : 0
      const ids = action.exercises.slice(0, limit).map(e => e.id)
      const merged = [...new Set([...state.completedExerciseIds, ...ids])].sort((a, b) => a - b)
      return { ...state, completedExerciseIds: merged }
    }
    case 'RESET_PROGRESS':
      return { ...state, completedExerciseIds: [] }
    case 'RESET_DB': {
      const cleared = {}
      for (const [key, ed] of Object.entries(state.editors)) {
        cleared[key] = { ...ed, results: null, error: null }
      }
      return { ...state, tables: [], editors: cleared }
    }
    default:
      return state
  }
}
