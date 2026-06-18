import { useState } from 'react'
import './TableCreator.css'

const TYPE_OPTIONS = ['INTEGER', 'TEXT', 'REAL', 'BLOB']

const CONSTRAINT_OPTIONS = [
  { key: 'pk', label: 'PK' },
  { key: 'nn', label: 'NN' },
  { key: 'uq', label: 'UQ' },
]

function emptyColumn() {
  return { name: '', type: 'TEXT', constraints: [], defaultValue: '' }
}

function formatDefault(col) {
  if (!col.defaultValue) return ''
  if (col.type === 'TEXT' || col.type === 'BLOB') {
    return ` DEFAULT ${JSON.stringify(col.defaultValue)}`
  }
  return ` DEFAULT ${col.defaultValue}`
}

function formatColDef(c) {
  const parts = [JSON.stringify(c.name.trim()), c.type]
  if (c.constraints.includes('pk')) parts.push('PRIMARY KEY')
  if (c.constraints.includes('nn')) parts.push('NOT NULL')
  if (c.constraints.includes('uq')) parts.push('UNIQUE')
  const def = formatDefault(c)
  if (def) parts.push(def.trim())
  return parts.join(' ')
}

export default function TableCreator({ onCreateTable }) {
  const [open, setOpen] = useState(false)
  const [tableName, setTableName] = useState('')
  const [columns, setColumns] = useState([emptyColumn()])
  const [previewSql, setPreviewSql] = useState('')

  function addColumn() {
    setColumns([...columns, emptyColumn()])
  }

  function removeColumn(i) {
    setColumns(columns.filter((_, idx) => idx !== i))
  }

  function updateColumn(i, field, value) {
    const next = columns.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c,
    )
    setColumns(next)
  }

  function toggleConstraint(i, key) {
    setColumns(columns.map((c, idx) => {
      if (idx !== i) return c
      const next = c.constraints.includes(key)
        ? c.constraints.filter((k) => k !== key)
        : [...c.constraints, key]
      return { ...c, constraints: next }
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!tableName.trim()) return
    const validCols = columns.filter((c) => c.name.trim())
    if (validCols.length === 0) return

    const cols = validCols.map(formatColDef).join(', ')
    const sql = `CREATE TABLE ${JSON.stringify(tableName.trim())} (${cols});`
    setPreviewSql(sql)
    onCreateTable(tableName.trim(), validCols)
    setTableName('')
    setColumns([emptyColumn()])
  }

  function handleChange() {
    if (previewSql) setPreviewSql('')
  }

  return (
    <div className="table-creator">
      <button
        className="table-creator__toggle"
        onClick={() => setOpen(!open)}
      >
        <span className="table-creator__chevron">{open ? '▾' : '▸'}</span>
        Create Table
      </button>

      {open && (
        <form className="table-creator__form" onSubmit={handleSubmit} onChange={handleChange}>
          <input
            className="table-creator__input"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Table name"
            autoFocus
          />

          <div className="table-creator__columns">
            {columns.map((col, i) => (
              <div key={i} className="table-creator__row">
                <input
                  className="table-creator__col-name"
                  value={col.name}
                  onChange={(e) => updateColumn(i, 'name', e.target.value)}
                  placeholder="column name"
                />
                <select
                  className="table-creator__col-type"
                  value={col.type}
                  onChange={(e) => updateColumn(i, 'type', e.target.value)}
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="table-creator__constraints">
                  {CONSTRAINT_OPTIONS.map((opt) => (
                    <label key={opt.key} className="table-creator__constraint-label" title={opt.key === 'pk' ? 'Primary Key' : opt.key === 'nn' ? 'Not Null' : 'Unique'}>
                      <input
                        type="checkbox"
                        className="table-creator__constraint-cb"
                        checked={col.constraints.includes(opt.key)}
                        onChange={() => toggleConstraint(i, opt.key)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                <input
                  className="table-creator__default"
                  value={col.defaultValue}
                  onChange={(e) => updateColumn(i, 'defaultValue', e.target.value)}
                  placeholder="default"
                  title="Default value"
                />
                <button
                  type="button"
                  className="table-creator__remove"
                  onClick={() => removeColumn(i)}
                  disabled={columns.length === 1}
                  title="Remove column"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="table-creator__actions">
            <button type="button" className="table-creator__add-col" onClick={addColumn}>
              + Add column
            </button>
            <button
              type="submit"
              className="table-creator__create"
              disabled={!tableName.trim() || !columns.some((c) => c.name.trim())}
            >
              Create →
            </button>
          </div>

          {previewSql && (
            <pre className="table-creator__preview">{previewSql}</pre>
          )}
        </form>
      )}
    </div>
  )
}
