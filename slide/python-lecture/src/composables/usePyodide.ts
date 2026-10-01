import { datasets } from '@/data/datasets'
import {
  buildProgram,
  detectPackages,
  formatPythonError,
  MATPLOTLIB_COLLECT,
  MATPLOTLIB_SETUP,
  PANDAS_SETUP,
  type PythonPackage
} from '@/functions/python.function'
import type { PyodideApi, RunResult } from '@/models/python.model'

type Status = 'idle' | 'loading' | 'ready' | 'error'

const status = ref<Status>('idle')
/** Packages currently being downloaded (shown to the learner). */
const loadingPackages = ref<PythonPackage[]>([])
const loadedPackages = new Set<PythonPackage>()
let pyodidePromise: Promise<PyodideApi> | null = null
/** Pyodide runs one program at a time; queue runs so outputs never mix. */
let queue: Promise<unknown> = Promise.resolve()

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Could not load ${src}`))
    document.head.appendChild(script)
  })
}

async function loadPyodideOnce(): Promise<PyodideApi> {
  if (!pyodidePromise) {
    status.value = 'loading'
    const indexURL = import.meta.env.VITE_PYODIDE_URL
    pyodidePromise = (async () => {
      if (!window.loadPyodide) await loadScript(`${indexURL}pyodide.js`)
      if (!window.loadPyodide) throw new Error('Pyodide failed to initialise')
      const pyodide = await window.loadPyodide({ indexURL })
      for (const dataset of datasets) pyodide.FS.writeFile(dataset.filename, dataset.content)
      return pyodide
    })()
    pyodidePromise.then(
      () => (status.value = 'ready'),
      () => {
        status.value = 'error'
        pyodidePromise = null
      }
    )
  }
  return pyodidePromise
}

async function ensurePackages(pyodide: PyodideApi, packages: PythonPackage[]) {
  const missing = packages.filter((name) => !loadedPackages.has(name))
  if (!missing.length) return
  loadingPackages.value = missing
  try {
    await pyodide.loadPackage(missing)
    missing.forEach((name) => loadedPackages.add(name))
    // Warm-up imports print one-time notices (e.g. matplotlib's font cache) — keep them silent.
    pyodide.setStdout({ batched: () => undefined })
    pyodide.setStderr({ batched: () => undefined })
    if (missing.includes('pandas')) await pyodide.runPythonAsync(PANDAS_SETUP)
    if (missing.includes('matplotlib')) await pyodide.runPythonAsync('import matplotlib.pyplot')
  } finally {
    loadingPackages.value = []
  }
}

/** Shared, lazily loaded in-browser Python (Pyodide). The first run downloads ~10 MB. */
export function usePyodide() {
  async function execute(code: string, stdin: string[]): Promise<RunResult> {
    const pyodide = await loadPyodideOnce()
    const packages = detectPackages(code)
    await ensurePackages(pyodide, packages)
    const usesPlots = packages.includes('matplotlib')

    const chunks: string[] = []
    pyodide.setStdout({ batched: (text) => chunks.push(text) })
    pyodide.setStderr({ batched: (text) => chunks.push(text) })
    const namespace = pyodide.globals.get('dict')()
    const started = performance.now()
    let error: string | null = null
    let images: string[] = []
    try {
      if (usesPlots) await pyodide.runPythonAsync(MATPLOTLIB_SETUP, { globals: namespace })
      await pyodide.runPythonAsync(buildProgram(code, stdin), { globals: namespace })
    } catch (caught) {
      error = formatPythonError(caught instanceof Error ? caught.message : String(caught))
    }
    try {
      if (usesPlots) {
        images = JSON.parse(
          String(await pyodide.runPythonAsync(MATPLOTLIB_COLLECT, { globals: namespace }))
        )
      }
    } finally {
      namespace.destroy()
    }
    return { output: chunks.join('\n'), error, images, durationMs: performance.now() - started }
  }

  function run(code: string, stdin: string[] = []): Promise<RunResult> {
    const next = queue.then(() => execute(code, stdin))
    queue = next.catch(() => undefined)
    return next
  }

  return {
    status: readonly(status),
    loadingPackages: readonly(loadingPackages),
    run,
    preload: loadPyodideOnce
  }
}
