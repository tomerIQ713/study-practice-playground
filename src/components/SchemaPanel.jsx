import { useState } from 'react'
import './SchemaPanel.css'

export default function SchemaPanel({ tables, onReset }) {
  const [expanded, setExpanded] = useState({})

  function toggle(name) {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="schema-panel">
      <div className="schema-panel__header">
        <h2 className="schema-panel__title">Schema</h2>
        <button className="schema-panel__reset" onClick={onReset} title="Reset database">
          ↺
        </button>
      </div>

      {tables.length === 0 && (
        <p className="schema-panel__empty">No tables yet.</p>
      )}

      <ul className="schema-panel__list">
        {tables.map((t) => (
          <li key={t.name} className="schema-panel__table">
            <button
              className="schema-panel__table-name"
              onClick={() => toggle(t.name)}
            >
              <span className="schema-panel__chevron">
                {expanded[t.name] ? '▾' : '▸'}
              </span>
              {t.name}
            </button>
            {expanded[t.name] && (
              <ul className="schema-panel__columns">
                {t.columns.length === 0 && (
                  <li className="schema-panel__col schema-panel__col--empty">
                    (no columns)
                  </li>
                )}
                {t.columns.map((c) => (
                  <li key={c.name} className="schema-panel__col">
                    <span className="schema-panel__col-name">{c.name}</span>
                    <span className="schema-panel__col-type">{c.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
