import { useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePracticeEngine } from './hooks/usePracticeEngine'
import SchemaPanel from './components/SchemaPanel'
import SqlEditorPanel from './components/SqlEditorPanel'
import ResultTable from './components/ResultTable'
import TableCreator from './components/TableCreator'
import ExercisePanel from './components/ExercisePanel'
import LanguageMenu from './components/LanguageMenu'
import './App.css'

function Playground({ language }) {
  const navigate = useNavigate()
  const { exId } = useParams()

  const {
    state,
    activeEditor,
    runQuery,
    setEditorSql,
    setEditorStdin,
    loadExercise: loadExerciseBase,
    closeEditor,
    selectEditor,
    resetDb,
    resetProgress,
    runRawSql,
    exercises,
    topics,
    completedExerciseIds,
    isLocked,
  } = usePracticeEngine(language)

  useEffect(() => {
    if (!exId) return
    const exercise = exercises.find(e => e.id === Number(exId))
    if (exercise) loadExerciseBase(exercise)
  }, [exId]) // eslint-disable-line

  const loadExercise = useCallback((exercise) => {
    loadExerciseBase(exercise)
    navigate(`/${language}/ex/${exercise.id}`, { replace: true })
  }, [loadExerciseBase, language, navigate])

  if (state.loading) {
    return (
      <div className="app-loading">
        <p>Loading {language === 'sql' ? 'SQL' : language === 'cs' ? 'C#' : language === 'java' ? 'Java' : language === 'text' ? 'Text' : 'practice'} engine…</p>
      </div>
    )
  }

  const editorEntries = Object.values(state.editors)

  function formatDefault(col) {
    if (!col.defaultValue) return ''
    if (col.type === 'TEXT' || col.type === 'BLOB') {
      return ` DEFAULT ${JSON.stringify(col.defaultValue)}`
    }
    return ` DEFAULT ${col.defaultValue}`
  }

  function formatColDef(c) {
    const parts = [JSON.stringify(c.name.trim()), c.type]
    if (c.constraints?.includes('pk')) parts.push('PRIMARY KEY')
    if (c.constraints?.includes('nn')) parts.push('NOT NULL')
    if (c.constraints?.includes('uq')) parts.push('UNIQUE')
    const def = formatDefault(c)
    if (def) parts.push(def.trim())
    return parts.join(' ')
  }

  function handleCreateTable(tableName, columns) {
    const cols = columns.map(formatColDef).join(', ')
    const sql = `CREATE TABLE ${JSON.stringify(tableName.trim())} (${cols});`
    runRawSql(sql)
  }

  function handleRun(sql) {
    runQuery(state.activeEditorId, sql)
  }

  function handleResetSkeleton() {
    if (activeEditor?.exercise?.skeleton != null) {
      setEditorSql(state.activeEditorId, activeEditor.exercise.skeleton)
    }
  }

  return (
    <div className="app">
      <aside className="app__schema">
        <Link className="app__back" to="/">← Back</Link>
        {language === 'sql' && <SchemaPanel tables={state.tables} onReset={resetDb} />}
      </aside>

      <main className="app__main">
        <div className="app__tabs">
          {editorEntries.map((ed) => {
            const isActive = ed.id === state.activeEditorId
            const label = ed.exercise
              ? 'Ex: ' + ed.exercise.title
              : 'Free'
            return (
              <button
                key={ed.id}
                className={'app__tab' + (isActive ? ' app__tab--active' : '')}
                onClick={() => selectEditor(ed.id)}
              >
                <span className="app__tab-label">{label}</span>
                {ed.id !== 'free' && (
                  <span
                    className="app__tab-close"
                    onClick={(e) => { e.stopPropagation(); closeEditor(ed.id) }}
                  >
                    ✕
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {activeEditor && (
          <>
            <SqlEditorPanel
              language={language}
              sql={activeEditor.sql}
              onSqlChange={setEditorSql.bind(null, state.activeEditorId)}
              onRun={handleRun}
              error={activeEditor.error}
              title={activeEditor.exercise ? activeEditor.exercise.title : ''}
              inputHint={activeEditor.exercise?.inputHint || ''}
              onClose={activeEditor.id !== 'free' ? () => closeEditor(activeEditor.id) : undefined}
              onResetSkeleton={activeEditor?.exercise?.skeleton != null ? handleResetSkeleton : undefined}
              stdin={activeEditor.stdin}
              onStdinChange={(v) => setEditorStdin(state.activeEditorId, v)}
              isRunning={activeEditor.running}
              statusText={activeEditor.statusText}
            />
            <ResultTable results={activeEditor.results} error={activeEditor.error} />
          </>
        )}

        {language === 'sql' && <TableCreator onCreateTable={handleCreateTable} />}
      </main>

      <aside className="app__exercises">
        <ExercisePanel
          exercises={exercises}
          topics={topics}
          activeExerciseId={
            activeEditor && activeEditor.exercise
              ? activeEditor.exercise.id
              : null
          }
          completedExerciseIds={completedExerciseIds}
          isLocked={isLocked}
          onSelectExercise={loadExercise}
          onResetProgress={resetProgress}
        />
      </aside>
    </div>
  )
}

export default function App() {
  const { lang } = useParams()

  if (!lang) return <LanguageMenu />

  return <Playground language={lang} />
}
