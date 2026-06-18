import { useReducer, useEffect, useRef } from 'react'
import { EXERCISES as SQL_EXERCISES, TOPICS as SQL_TOPICS, checkCompletion as sqlCheck } from '../exercises/sql.js'
import { EXERCISES as C_EXERCISES, TOPICS as C_TOPICS, checkCompletion as cCheck } from '../exercises/c.js'
import { EXERCISES as CS_EXERCISES, TOPICS as CS_TOPICS, checkCompletion as csCheck } from '../exercises/cs.js'
import { saveState } from './persistence.js'
import { reducer, buildInitialState, isExerciseLocked } from './reducer.js'
import { createWorker } from './workerFactory.js'

function deepEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((v, i) => deepEqual(v, b[i]))
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b)
    if (ka.length !== kb.length) return false
    return ka.every(k => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]))
  }
  return false
}

const LANG_CONFIG = {
  sql: {
    exercises: SQL_EXERCISES,
    checkCompletion: sqlCheck,
    workerType: 'sql',
    label: 'SQL',
  },
  c: {
    exercises: C_EXERCISES,
    checkCompletion: cCheck,
    workerType: 'c',
    label: 'C',
  },
  cs: {
    exercises: CS_EXERCISES,
    checkCompletion: csCheck,
    workerType: 'cs',
    label: 'C#',
  },
}

export function usePracticeEngine(language) {
  const config = LANG_CONFIG[language] || LANG_CONFIG.sql
  const exercises = config.exercises
  const checkCompletion = config.checkCompletion
  const [state, dispatch] = useReducer(reducer, language, buildInitialState)
  const workerRef = useRef(null)
  const pendingRef = useRef({})
  const nextMsgIdRef = useRef(1)
  const isInitialMount = useRef(true)

  useEffect(() => {
    isInitialMount.current = false
  }, [])

  useEffect(() => {
    if (isInitialMount.current) return
    const handler = setTimeout(() => {
      saveState(state, language)
    }, 1500)
    return () => clearTimeout(handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.completedExerciseIds, state.activeEditorId, state.editors, language])

  useEffect(() => {
    const wt = config.workerType
    const { worker, cleanup } = createWorker(wt, dispatch, pendingRef)
    workerRef.current = worker
    return () => { cleanup(); workerRef.current = null }
  }, [language, config.workerType])

  function runQuery(editorId, code) {
    if (language === 'c') {
      const ed = state.editors[editorId]
      const exercise = ed?.exercise

      if (exercise && [41, 42, 43, 44, 45].includes(exercise.id)) {
        dispatch({
          type: 'SET_EDITOR_RESULTS',
          id: editorId,
          results: { columns: ['\u2713 Pattern matched'], values: [['Code saved (file I/O not available in browser C runtime).']] },
        })
        if (checkCompletion(exercise, code, false, null)) {
          dispatch({ type: 'MARK_COMPLETED', id: exercise.id })
        }
        return
      }

      if (!workerRef.current) {
        dispatch({ type: 'SET_EDITOR_ERROR', id: editorId, error: 'C engine not ready' })
        return
      }

      const msgId = String(nextMsgIdRef.current++)

      const stdin = state.editors[editorId]?.stdin || ''
      dispatch({ type: 'SET_EDITOR_RUNNING', id: editorId, running: true })
      workerRef.current.postMessage({ type: 'compileAndRun', id: msgId, code, stdin })

      pendingRef.current[msgId] = (data) => {
        if (data.compileError) {
          dispatch({
            type: 'SET_EDITOR_RESULTS',
            id: editorId,
            results: { columns: ['Error'], values: [[data.stderr]] },
          })
        } else {
          const output = data.stderr ? data.stdout + '\n' + data.stderr : data.stdout
          const results = { columns: ['Output'], values: [[output || '(no output)']] }
          if (exercise?.expectedOutput != null) {
            if (output.trim() === exercise.expectedOutput.trim()) {
              dispatch({ type: 'MARK_COMPLETED', id: exercise.id })
            } else {
              results._feedback = { expected: exercise.expectedOutput, actual: output, passed: false }
            }
          } else if (exercise && checkCompletion(exercise, code, false, null)) {
            dispatch({ type: 'MARK_COMPLETED', id: exercise.id })
          }
          dispatch({ type: 'SET_EDITOR_RESULTS', id: editorId, results })
        }
      }
      return
    }

    if (language === 'cs') {
      const ed = state.editors[editorId]
      const exercise = ed?.exercise

      if (exercise && [23, 26].includes(exercise.id)) {
        dispatch({
          type: 'SET_EDITOR_RESULTS',
          id: editorId,
          results: { columns: ['\u2713 Pattern matched'], values: [['Console.ReadLine() is not supported in the browser C# runtime. Your pattern was recognized.']] },
        })
        if (checkCompletion(exercise, code, false, null)) {
          dispatch({ type: 'MARK_COMPLETED', id: exercise.id })
        }
        return
      }

      if (!workerRef.current) {
        dispatch({ type: 'SET_EDITOR_ERROR', id: editorId, error: 'C# engine not ready' })
        return
      }

      const msgId = String(nextMsgIdRef.current++)
      dispatch({ type: 'SET_EDITOR_RUNNING', id: editorId, running: true })
      workerRef.current.postMessage({ type: 'compileAndRun', id: msgId, code })

      pendingRef.current[msgId] = (data) => {
        if (data.message) {
          dispatch({ type: 'SET_EDITOR_ERROR', id: editorId, error: data.message })
        } else {
          const output = data.stderr ? data.stdout + '\n' + data.stderr : data.stdout
          const results = { columns: ['Output'], values: [[output || '(no output)']] }
          if (exercise?.expectedOutput != null) {
            if (output.trim() === exercise.expectedOutput.trim()) {
              dispatch({ type: 'MARK_COMPLETED', id: exercise.id })
            } else {
              results._feedback = { expected: exercise.expectedOutput, actual: output, passed: false }
            }
          } else if (exercise && checkCompletion(exercise, code, false, null)) {
            dispatch({ type: 'MARK_COMPLETED', id: exercise.id })
          }
          dispatch({ type: 'SET_EDITOR_RESULTS', id: editorId, results })
        }
      }
      return
    }

    if (!workerRef.current) {
      dispatch({ type: 'SET_EDITOR_ERROR', id: editorId, error: 'Database engine not ready' })
      return
    }

    const msgId = String(nextMsgIdRef.current++)
    const ed = state.editors[editorId]
    const exercise = ed?.exercise

    dispatch({ type: 'SET_EDITOR_RUNNING', id: editorId, running: true })
    workerRef.current.postMessage({ type: 'exec', id: msgId, code })

    pendingRef.current[msgId] = (data) => {
      if (data.message) {
        dispatch({ type: 'SET_EDITOR_ERROR', id: editorId, error: data.message })
        return
      }
      const results = { columns: data.columns, values: data.values }
      if (exercise?.expectedResults != null) {
        if (deepEqual(data.columns, exercise.expectedResults.columns) && deepEqual(data.values, exercise.expectedResults.values)) {
          dispatch({ type: 'MARK_COMPLETED', id: exercise.id })
        } else {
          results._feedback = { expected: exercise.expectedResults, actual: { columns: data.columns, values: data.values }, passed: false }
        }
      } else if (exercise && checkCompletion(exercise, code, false, data.tables)) {
        dispatch({ type: 'MARK_COMPLETED', id: exercise.id })
      }
      dispatch({ type: 'SET_EDITOR_RESULTS', id: editorId, results })
      if (data.tables !== undefined) {
        dispatch({ type: 'SET_TABLES', tables: data.tables })
      }
    }
  }

  function setEditorSql(editorId, sql) {
    dispatch({ type: 'SET_EDITOR_SQL', id: editorId, sql })
  }

  function setEditorStdin(editorId, stdin) {
    dispatch({ type: 'SET_EDITOR_STDIN', id: editorId, stdin })
  }

  function loadExercise(exercise) {
    if (isExerciseLocked(exercise, state.completedExerciseIds, exercises)) {
      const ok = window.confirm(
        `Exercise ${exercise.id} is locked. Skip to it?\n\nThe necessary code setup will be created for you, and all previous exercises will be marked as complete.`
      )
      if (!ok) return
      if (language === 'sql' && exercise.seedSql && workerRef.current) {
        workerRef.current.postMessage({ type: 'exec', id: 'seed-' + exercise.id, code: exercise.seedSql })
      }
      dispatch({ type: 'MARK_ALL_COMPLETED_UP_TO', id: exercise.id, exercises })
    }
    const id = 'ex-' + exercise.id
    const existing = state.editors[id]
    if (existing) {
      dispatch({ type: 'SET_ACTIVE_EDITOR', id })
      return
    }
    dispatch({ type: 'OPEN_EDITOR', id, exercise })
  }

  function closeEditor(id) {
    dispatch({ type: 'CLOSE_EDITOR', id })
  }

  function selectEditor(id) {
    dispatch({ type: 'SET_ACTIVE_EDITOR', id })
  }

  function resetDb() {
    if (language !== 'sql' || !workerRef.current) return
    workerRef.current.postMessage({ type: 'reset', id: 'reset-' + Date.now() })
  }

  function runRawSql(sql) {
    if (language !== 'sql' || !workerRef.current) return false
    const msgId = 'raw-' + Date.now()
    pendingRef.current[msgId] = (data) => {
      if (data.tables) {
        dispatch({ type: 'SET_TABLES', tables: data.tables })
      }
    }
    workerRef.current.postMessage({ type: 'exec', id: msgId, code: sql })
    return true
  }

  function resetProgress() {
    dispatch({ type: 'RESET_PROGRESS' })
  }

  const activeEditor = state.editors[state.activeEditorId] || null

  return {
    state,
    activeEditor,
    runQuery,
    setEditorSql,
    setEditorStdin,
    loadExercise,
    closeEditor,
    selectEditor,
    resetDb,
    resetProgress,
    runRawSql,
    exercises,
    topics: language === 'cs' ? CS_TOPICS : language === 'c' ? C_TOPICS : SQL_TOPICS,
    completedExerciseIds: state.completedExerciseIds,
    isLocked: (ex) => isExerciseLocked(ex, state.completedExerciseIds, exercises),
  }
}
