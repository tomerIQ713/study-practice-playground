let db = null
let SQL = null
let execTimeout = null

function getTableInfo() {
  try {
    const tables = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    if (!tables.length) return []
    return tables[0].values.map(([name, sql]) => {
      const cols = db.exec(`PRAGMA table_info(${JSON.stringify(name)})`)
      const columns = cols.length
        ? cols[0].values.map(([, colName, colType]) => ({ name: colName, type: colType }))
        : []
      return { name, sql, columns }
    })
  } catch {
    return []
  }
}

self.onmessage = async (e) => {
  const { type, id, code } = e.data

  if (type === 'init') {
    const initSqlJs = (await import('sql.js')).default
    SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
    db = new SQL.Database()
    self.postMessage({ type: 'init', id })
    return
  }

  if (type === 'exec') {
    if (!db) {
      self.postMessage({ type: 'error', id, data: { message: 'Database not initialized' } })
      return
    }

    if (execTimeout) clearTimeout(execTimeout)
    execTimeout = setTimeout(() => {
      self.postMessage({ type: 'error', id, data: { message: 'Query timed out after 10 seconds' } })
    }, 10000)

    try {
      const results = db.exec(code)
      clearTimeout(execTimeout)
      execTimeout = null
      const tables = getTableInfo()
      if (results.length > 0) {
        const { columns, values } = results[0]
        self.postMessage({ type: 'result', id, data: { columns, values, tables } })
      } else {
        self.postMessage({ type: 'result', id, data: { columns: ['\u2713 Success'], values: [['Query executed.']], tables } })
      }
    } catch (e) {
      clearTimeout(execTimeout)
      execTimeout = null
      self.postMessage({ type: 'error', id, data: { message: e.message } })
    }
    return
  }

  if (type === 'reset') {
    db = new SQL.Database()
    const tables = getTableInfo()
    self.postMessage({ type: 'reset', id, data: { tables } })
    return
  }

}
