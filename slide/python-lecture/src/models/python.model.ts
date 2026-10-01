/** Minimal subset of the Pyodide API used by the app. */
export interface PyProxyDict {
  destroy: () => void
}

export interface PyodideApi {
  runPythonAsync: (code: string, options?: { globals?: PyProxyDict }) => Promise<unknown>
  loadPackage: (names: string[]) => Promise<unknown>
  setStdout: (options: { batched: (text: string) => void }) => void
  setStderr: (options: { batched: (text: string) => void }) => void
  globals: { get: (name: string) => () => PyProxyDict }
  FS: { writeFile: (path: string, data: string) => void }
}

export interface RunResult {
  output: string
  error: string | null
  /** Base64-encoded PNG charts produced by matplotlib. */
  images: string[]
  durationMs: number
}

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideApi>
  }
}
