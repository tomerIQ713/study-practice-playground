importScripts('./runtime.js', './ide-resources.js', './wabt.js');

let compiler = null
let appRuntime = null
let wabtPromise = null
let ready = false

function setStatus(msg) {
  self.postMessage({ type: 'status', data: msg })
}

function timeout(ms, msg) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(msg)), ms))
}

function loadWabt() {
  if (!wabtPromise) {
    wabtPromise = new Promise((resolve, reject) => {
      if (globalThis.WabtModule) {
        globalThis.WabtModule().then(resolve, reject)
        return
      }
      reject(new Error('WABT not available'))
    })
  }
  return wabtPromise
}

async function assembleWat(wat) {
  const wabt = await loadWabt()
  const features = {
    exceptions: true,
    mutable_globals: true,
    sat_float_to_int: true,
    sign_extension: true,
    multi_value: true,
    bulk_memory: true,
    reference_types: true,
  }
  const module = wabt.parseWat('input.wat', wat, features)
  try {
    module.resolveNames()
    module.validate()
    return module.toBinary({ write_debug_names: true }).buffer
  } finally {
    module.destroy()
  }
}

self.onmessage = async (e) => {
  const { type, id, code, stdin } = e.data

  if (type === 'init') {
    try {
      setStatus('Loading compiler')
      compiler = await TccWasmRuntime.CompilerHost.create({
        wasm: './tcc.wasm',
        libc: './libc.wasm',
        resources: TccWasmIdeResources,
      })
      setStatus('Loading runtime')
      appRuntime = await TccWasmRuntime.AppRuntime.create({ libc: './libc.wasm' })
      ready = true
      self.postMessage({ type: 'init', id })
    } catch (err) {
      self.postMessage({ type: 'error', id, data: { message: err.message } })
    }
    return
  }

  if (type === 'compileAndRun') {
    if (!ready) {
      self.postMessage({ type: 'error', id, data: { message: 'C engine not ready' } })
      return
    }
    try {
      setStatus('Compiling')
      let compiledBinary
      let diagnostics

      try {
        const result = await Promise.race([
          Promise.resolve().then(() => {
            const r = compiler.compileAppResult(code)
            return r
          }),
          timeout(15000, 'Compilation timed out after 15 seconds'),
        ])
        diagnostics = (result.diagnostics || '').trim()
        setStatus('Assembling')
        compiledBinary = await Promise.race([
          assembleWat(result.wat),
          timeout(15000, 'Assembly timed out after 15 seconds'),
        ])
      } catch (err) {
        const msg = (err.diagnostics || err.message || String(err)).trim()
        self.postMessage({
          type: 'result',
          id,
          data: { stdout: '', stderr: msg, rc: -1, compileError: true },
        })
        return
      }

      setStatus('Running')
      const compiledModule = await WebAssembly.compile(compiledBinary)
      const result = await Promise.race([
        appRuntime.run(compiledModule, { stdin: stdin || '' }),
        timeout(15000, 'Execution timed out after 15 seconds'),
      ])

      let stdout = result.stdout || ''
      let stderr = result.stderr || ''
      if (diagnostics) {
        stderr = stderr ? diagnostics + '\n' + stderr : diagnostics
      }

      self.postMessage({
        type: 'result',
        id,
        data: { stdout, stderr, rc: result.rc, compileError: false },
      })
    } catch (err) {
      self.postMessage({
        type: 'result',
        id,
        data: { stdout: '', stderr: err.message || String(err), rc: -1, compileError: true },
      })
    }
    return
  }
}
