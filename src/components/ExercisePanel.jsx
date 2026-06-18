import { useState, useRef, useEffect } from 'react'
import './ExercisePanel.css'
import ConceptPopup from './ConceptPopup'

export default function ExercisePanel({
  exercises,
  topics,
  activeExerciseId,
  completedExerciseIds,
  isLocked,
  onSelectExercise,
  onResetProgress,
}) {
  const [revealed, setRevealed] = useState({})
  const [conceptExerciseId, setConceptExerciseId] = useState(null)
  const [hintCount, setHintCount] = useState({})
  const [expandedTopicIds, setExpandedTopicIds] = useState(new Set())
  const [pinnedClosedTopics, setPinnedClosedTopics] = useState(new Set())
  
  const listRef = useRef(null)

  useEffect(() => {
    if (!activeExerciseId) return
    const el = listRef.current?.querySelector(`[data-exercise-id="${activeExerciseId}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeExerciseId])

  const completedCount = completedExerciseIds.length
  const nextExerciseId = completedCount < exercises.length ? completedCount + 1 : null

  function status(ex) {
    if (isLocked(ex)) return 'locked'
    if (completedExerciseIds.includes(ex.id)) return 'done'
    if (ex.id === nextExerciseId) return 'current'
    return 'available'
  }

  function toggleAnswer(exId) {
    setRevealed((prev) => ({ ...prev, [exId]: !prev[exId] }))
  }

  function handleConceptClick(e, ex) {
    e.stopPropagation()
    setConceptExerciseId(ex.id)
  }

  function handleHintClick(e, exId, total) {
    e.stopPropagation()
    setHintCount((prev) => ({
      ...prev,
      [exId]: Math.min((prev[exId] || 0) + 1, total),
    }))
  }

  function toggleTopic(topicId) {
    setExpandedTopicIds((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) next.delete(topicId)
      else next.add(topicId)
      return next
    })
  }

  function handleTopicClick(t, ts, isExpanded) {
    if (ts === 'locked') { onSelectExercise(t.exercises[0]); return }
    toggleTopic(t.id)
    if (isExpanded) {
      setPinnedClosedTopics(prev => new Set([...prev, t.id]))
    } else {
      setPinnedClosedTopics(prev => { const next = new Set(prev); next.delete(t.id); return next })
    }
  }

  function topicStatus(t) {
    const allIds = t.exercises.map(e => e.id)
    const doneCount = allIds.filter(id => completedExerciseIds.includes(id)).length
    if (doneCount === 0 && isLocked(t.exercises[0])) return 'locked'
    if (doneCount === t.exercises.length) return 'done'
    return 'active'
  }

  const conceptExercise = topics
    ? topics.flatMap(t => t.exercises).find((ex) => ex.id === conceptExerciseId)
    : exercises.find((ex) => ex.id === conceptExerciseId)

  function renderExercise(ex) {
    const st = status(ex)
    const isActive = activeExerciseId === ex.id
    const showAnswer = revealed[ex.id]
    const hintsTotal = ex.hints ? ex.hints.length : 0
    const hintsShown = Math.min(hintCount[ex.id] || 0, hintsTotal)
    const allHintsShown = hintsShown >= hintsTotal

    return (
      <li key={ex.id} className="exercise-panel__item" data-exercise-id={ex.id}>
        <button
          className={
            'exercise-panel__card' +
            (isActive ? ' exercise-panel__card--active' : '') +
            (st === 'locked' ? ' exercise-panel__card--locked' : '') +
            (st === 'done' ? ' exercise-panel__card--done' : '')
          }
          onClick={() => onSelectExercise(ex)}
        >
          <span className={
            'exercise-panel__num' +
            (st === 'done' ? ' exercise-panel__num--done' : '') +
            (isActive ? ' exercise-panel__num--active' : '')
          }>
            {st === 'locked' ? '\uD83D\uDD12' : st === 'done' ? '\u2713' : ex.topicExerciseNum}
          </span>
          <div className="exercise-panel__body">
            <span className="exercise-panel__name">{ex.title}</span>
            {st === 'locked' && (
              <span className="exercise-panel__hint">Complete exercise {ex.id - 1} first</span>
            )}
            {isActive && st !== 'locked' && (
              <p className="exercise-panel__desc">{ex.description}</p>
            )}
          </div>

          {ex.concept && (
            <button
              className="exercise-panel__concept"
              onClick={(e) => handleConceptClick(e, ex)}
              title="Learn the concept"
              aria-label={`Learn about ${ex.title}`}
            >
              ?
            </button>
          )}
        </button>

        {isActive && st !== 'locked' && (
          <div className="exercise-panel__actions">
            <div className="exercise-panel__action-row">
              <button
                className="exercise-panel__reveal"
                onClick={(e) => { e.stopPropagation(); toggleAnswer(ex.id) }}
              >
                {showAnswer ? 'Hide answer' : 'Reveal answer'}
              </button>

              {hintsTotal > 0 && (
                <button
                  className="exercise-panel__hint-btn"
                  onClick={(e) => handleHintClick(e, ex.id, hintsTotal)}
                  disabled={allHintsShown}
                >
                  {'\uD83D\uDCA1'} {hintsShown}/{hintsTotal}
                </button>
              )}
            </div>

            {hintsShown > 0 && (
              <div className="exercise-panel__hints">
                {ex.hints.slice(0, hintsShown).map((h, i) => (
                  <p key={i} className="exercise-panel__hint-text">{i + 1}. {h}</p>
                ))}
                {allHintsShown && (
                  <p className="exercise-panel__hint-done">All hints shown</p>
                )}
              </div>
            )}

            {showAnswer && (
              <pre className="exercise-panel__answer">{ex.answer}</pre>
            )}
          </div>
        )}
      </li>
    )
  }

  return (
    <div className="exercise-panel">
      <div className="exercise-panel__header">
        <h2 className="exercise-panel__title">Exercises</h2>
        <span className="exercise-panel__progress">{completedCount}/{exercises.length}</span>
        {completedCount > 0 && onResetProgress && (
          <button
            className="exercise-panel__reset-progress"
            onClick={() => { if (window.confirm('Reset all exercise progress?')) onResetProgress() }}
            title="Reset progress"
          >
            ↺
          </button>
        )}
      </div>

      {exercises.length === 0 && (
        <p className="exercise-panel__empty">No exercises loaded.</p>
      )}

      {topics ? (
        <ul className="exercise-panel__list" ref={listRef}>
          {topics.map((t) => {
            const ts = topicStatus(t)
            const doneCount = t.exercises.filter(e => completedExerciseIds.includes(e.id)).length
            const isExpanded = expandedTopicIds.has(t.id) || (
              activeExerciseId
                && t.exercises.some(e => e.id === activeExerciseId)
                && !pinnedClosedTopics.has(t.id)
            )

            return (
              <li key={t.id} className="exercise-panel__topic">
                <button
                  className={
                    'exercise-panel__topic-header' +
                    (ts === 'locked' ? ' exercise-panel__topic-header--locked' : '') +
                    (ts === 'done' ? ' exercise-panel__topic-header--done' : '') +
                    (isExpanded ? ' exercise-panel__topic-header--expanded' : '')
                  }
                  onClick={() => handleTopicClick(t, ts, isExpanded)}
                >
                  <span className="exercise-panel__topic-arrow">{isExpanded ? '\u25BC' : '\u25B6'}</span>
                  <span className="exercise-panel__topic-title">{t.title}</span>
                  <span className={
                    'exercise-panel__topic-progress' +
                    (ts === 'done' ? ' exercise-panel__topic-progress--done' : '') +
                    (ts === 'locked' ? ' exercise-panel__topic-progress--locked' : '')
                  }>
                    {ts === 'locked' ? '\uD83D\uDD12' : `${doneCount}/${t.exercises.length}`}
                  </span>
                </button>
                {isExpanded && (
                  <ul className="exercise-panel__topic-exercises">
                    {t.exercises.map(renderExercise)}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <ul className="exercise-panel__list" ref={listRef}>
          {exercises.map(renderExercise)}
        </ul>
      )}

      {conceptExercise && (
        <ConceptPopup
          exercise={conceptExercise}
          onClose={() => setConceptExerciseId(null)}
        />
      )}
    </div>
  )
}
