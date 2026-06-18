export function createWorker(workerType, dispatch, pendingRef) {
  if (workerType === 'sql') {
    const worker = new Worker(
      new URL('../workers/sqlWorker.js', import.meta.url),
      { type: 'module' }
    )

    worker.onmessage = (e) => {
      const { type, id, data } = e.data

      if (type === 'init') {
        dispatch({ type: 'SET_LOADED' })
        return
      }

      if (type === 'result' || type === 'error') {
        const pending = pendingRef.current[id]
        if (pending) {
          pending(data)
          delete pendingRef.current[id]
        }
        return
      }

      if (type === 'tables') {
        dispatch({ type: 'SET_TABLES', tables: data })
        return
      }

      if (type === 'reset') {
        dispatch({ type: 'RESET_DB' })
        if (data?.tables) {
          dispatch({ type: 'SET_TABLES', tables: data.tables })
        }
        return
      }
    }

    worker.postMessage({ type: 'init' })
    return { worker, cleanup: () => { worker.terminate() } }
  }

  if (workerType === 'c') {
    const worker = new Worker('/cWorker.js')

    worker.onmessage = (e) => {
      const { type, id, data } = e.data

      if (type === 'init') {
        dispatch({ type: 'SET_LOADED' })
        return
      }

      if (type === 'result' || type === 'error') {
        const pending = pendingRef.current[id]
        if (pending) {
          pending(data)
          delete pendingRef.current[id]
        }
        return
      }
    }

    worker.postMessage({ type: 'init' })
    return { worker, cleanup: () => { worker.terminate() } }
  }

  if (workerType === 'cs') {
    const worker = new Worker(
      new URL('../workers/csWorker.js', import.meta.url),
      { type: 'module' }
    )

    worker.onmessage = (e) => {
      const { type, id, data } = e.data

      if (type === 'init') {
        dispatch({ type: 'SET_LOADED' })
        return
      }

      if (type === 'result' || type === 'error') {
        const pending = pendingRef.current[id]
        if (pending) {
          pending(data)
          delete pendingRef.current[id]
        }
        return
      }
    }

    worker.postMessage({ type: 'init' })
    return { worker, cleanup: () => { worker.terminate() } }
  }

  dispatch({ type: 'SET_LOADED' })
  return { worker: null, cleanup: () => {} }
}
