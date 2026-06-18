import { WasmSharpModule } from '@wasmsharp/core'

let wasmSharpModule = null

function timeout(ms, msg) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(msg)), ms))
}

self.onmessage = async function (e) {
  const { type, id, code } = e.data

  if (type === 'init') {
    try {
      wasmSharpModule = await WasmSharpModule.initializeAsync()
      self.postMessage({ type: 'init' })
    } catch (err) {
      self.postMessage({ type: 'error', id: id || 'init', data: { message: err.message } })
    }
    return
  }

  if (type === 'compileAndRun') {
    try {
      self.postMessage({ type: 'status', id, data: { message: 'Compiling...' } })

      const compilation = await Promise.race([
        wasmSharpModule.createCompilationAsync(code),
        timeout(30000, 'Compilation timed out after 30 seconds'),
      ])

      self.postMessage({ type: 'status', id, data: { message: 'Running...' } })

      const result = await Promise.race([
        compilation.run(),
        timeout(15000, 'Execution timed out after 15 seconds'),
      ])

      if (!result.success) {
        const errMsg = result.diagnostics
          ? result.diagnostics.filter(d => d.severity === 'Error').map(d => d.message).join('\n')
          : 'Compilation failed'
        self.postMessage({ type: 'error', id, data: { message: errMsg } })
        return
      }

      self.postMessage({
        type: 'result',
        id,
        data: {
          stdout: result.stdOut || '',
          stderr: result.stdErr || '',
          exitCode: result.exitCode ?? 0,
          success: true,
        },
      })
    } catch (err) {
      self.postMessage({
        type: 'error',
        id,
        data: { message: err.message },
      })
    }
    return
  }
}
