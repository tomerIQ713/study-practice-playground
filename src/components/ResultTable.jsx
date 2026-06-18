import { useState } from 'react'
import './ResultTable.css'

const PAGE_SIZE = 50

export default function ResultTable({ results, error }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (error) return null
  if (!results) {
    return (
      <div className="result-table result-table--empty">
        <p>Run a query to see results.</p>
      </div>
    )
  }

  const { columns, values, _feedback } = results

  if (_feedback && !_feedback.passed) {
    const isString = typeof _feedback.expected === 'string'
    return (
      <div className="result-table">
        <div className="result-table__feedback result-table__feedback--fail">
          <div className="result-table__feedback-row">
            <span className="result-table__feedback-label">✗ Expected:</span>
            <pre className="result-table__feedback-value">{isString ? _feedback.expected : JSON.stringify(_feedback.expected, null, 2)}</pre>
          </div>
          <div className="result-table__feedback-row">
            <span className="result-table__feedback-label">Got:</span>
            <pre className="result-table__feedback-value">{isString ? _feedback.actual : JSON.stringify(_feedback.actual, null, 2)}</pre>
          </div>
        </div>
        {columns && columns.length > 0 && columns[0] === 'Output' && (
          <div className="result-table result-table--output">
            <pre className="result-table__pre">{values[0]?.[0] ?? ''}</pre>
          </div>
        )}
      </div>
    )
  }

  if (!columns || columns.length === 0) {
    return (
      <div className="result-table result-table--empty">
        <p>Query executed.</p>
      </div>
    )
  }

  if (columns.length === 1 && columns[0] === '✓ Success') {
    return (
      <div className="result-table result-table--success">
        <p>{values[0]?.[0] ?? 'Query executed.'}</p>
      </div>
    )
  }

  if (columns.length === 1 && (columns[0] === 'Output' || columns[0] === 'Error')) {
    return (
      <div className="result-table result-table--output">
        <pre className="result-table__pre">{values[0]?.[0] ?? ''}</pre>
      </div>
    )
  }

  const total = values.length
  const sliced = values.slice(0, visibleCount)
  const isPaginated = visibleCount < total

  return (
    <div className="result-table">
      <div className="result-table__header">
        <span className="result-table__count">
          {isPaginated ? `Showing ${sliced.length} of ${total} row${total !== 1 ? 's' : ''}` : `${total} row${total !== 1 ? 's' : ''}`}
        </span>
        {isPaginated && (
          <div className="result-table__pagination">
            <button
              className="result-table__page-btn"
              onClick={() => setVisibleCount((p) => p + PAGE_SIZE)}
            >
              Show {Math.min(PAGE_SIZE, total - visibleCount)} more
            </button>
            <button
              className="result-table__page-btn"
              onClick={() => setVisibleCount(total)}
            >
              Show all {total}
            </button>
          </div>
        )}
      </div>
      <div className="result-table__scroll">
        <table className="result-table__table">
          <thead>
            <tr>
              <th className="result-table__cell result-table__cell--header">#</th>
              {columns.map((col, i) => (
                <th key={i} className="result-table__cell result-table__cell--header">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sliced.map((row, ri) => (
              <tr key={ri}>
                <td className="result-table__cell result-table__cell--row-num">
                  {ri + 1}
                </td>
                {row.map((val, ci) => (
                  <td key={ci} className="result-table__cell">
                    {val === null ? <span className="result-table__null">NULL</span> : String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
