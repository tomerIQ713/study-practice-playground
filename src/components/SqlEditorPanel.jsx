import { useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { autocompletion } from '@codemirror/autocomplete'
import './SqlEditorPanel.css'

const LANG_EXTENSIONS = {
  sql: sql(),
  c: cpp(),
  cs: java(),
  java: java(),
  text: [],
}

const PLACEHOLDERS = {
  sql: 'Write your SQL here\u2026',
  c: 'Write your C code here\u2026',
  cs: 'Write your C# code here\u2026',
  java: 'Write your Java code here\u2026',
  text: 'Write your text here\u2026',
}

export default function SqlEditorPanel({ language = 'sql', sql: code, onSqlChange, onRun, error, title, onClose, onResetSkeleton, inputHint, stdin, onStdinChange, isRunning, statusText }) {
  const placeholder = PLACEHOLDERS[language] || PLACEHOLDERS.sql
  const langLabel = language === 'cs' ? 'C#' : language === 'sql' ? 'SQL' : language === 'c' ? 'C' : language === 'java' ? 'Java' : 'Text'

  const handleRun = useCallback(() => {
    const trimmed = (code || '').trim()
    if (trimmed) onRun(trimmed)
  }, [code, onRun])

  const runKeymap = keymap.of([
    { key: 'Mod-Enter', run: () => { handleRun(); return true } },
    ...defaultKeymap,
  ])

  return (
    <div className="sql-editor-panel">
      <div className="sql-editor-panel__toolbar">
        <span className="sql-editor-panel__label">
          {title || langLabel}
        </span>
        <button
          className="sql-editor-panel__run"
          onClick={handleRun}
          disabled={!code?.trim() || isRunning}
        >
          {isRunning ? '◌ Running' : '▶ Run'}
        </button>
        {statusText && (
          <span className="sql-editor-panel__status">{statusText}</span>
        )}
        {onResetSkeleton && (
          <button className="sql-editor-panel__reset" onClick={onResetSkeleton} title="Reset to skeleton">
            ↺ Reset
          </button>
        )}
        <span className="sql-editor-panel__shortcut">Ctrl+Enter</span>
        {onClose && (
          <button className="sql-editor-panel__close" onClick={onClose} title="Close">
            ✕
          </button>
        )}
      </div>

      <div className="sql-editor-panel__code">
        <CodeMirror
          value={code || ''}
          onChange={onSqlChange}
          extensions={[autocompletion(), LANG_EXTENSIONS[language], runKeymap]}
          theme={oneDark}
          placeholder={placeholder}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            bracketMatching: true,
            closeBrackets: true,
            tabSize: 4,
          }}
        />
      </div>

      {(language === 'c' || language === 'cs') && (
        <div className="sql-editor-panel__stdin">
          <label className="sql-editor-panel__stdin-label">Stdin:</label>
          <textarea
            className="sql-editor-panel__stdin-input"
            value={stdin || ''}
            onChange={(e) => onStdinChange(e.target.value)}
            placeholder={inputHint || "Type input for scanf here..."}
            spellCheck={false}
            rows={2}
          />
        </div>
      )}

      {error && <div className="sql-editor-panel__error">{error}</div>}
    </div>
  )
}
