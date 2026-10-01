/**
 * Wraps learner code so input() reads from pre-supplied lines and echoes them,
 * the way a real terminal shows what the user typed.
 */
export function buildProgram(code: string, stdin: string[]): string {
  const lines = JSON.stringify(JSON.stringify(stdin))
  return [
    'import builtins as __b, json as __json',
    `__lines = __json.loads(${lines})`,
    'def __input(prompt=""):',
    '    print(prompt, end="")',
    '    if not __lines:',
    '        raise EOFError("input() needs a value: add one in the Input box")',
    '    value = __lines.pop(0)',
    '    print(value)',
    '    return value',
    '__b.input = __input',
    'del __b, __json',
    code
  ].join('\n')
}

/** Number of lines buildProgram puts before the learner's code. */
export const PROGRAM_PREFIX_LINES = 11

/** Keeps the useful tail of a Pyodide traceback and maps line numbers back to the learner's code. */
export function formatPythonError(raw: string): string {
  const lines = raw.trim().split('\n')
  const start = lines.findIndex((line) => line.includes('File "<exec>"'))
  const relevant = start >= 0 ? lines.slice(start) : lines.slice(-3)
  return relevant
    .map((line) =>
      line.replace(/File "<exec>", line (\d+)/, (_, n: string) => {
        return `line ${Math.max(1, Number(n) - PROGRAM_PREFIX_LINES)}`
      })
    )
    .join('\n')
}

export type PythonPackage = 'numpy' | 'pandas' | 'matplotlib'

/** Packages a program needs. pandas plotting (`.plot(`, `.hist(`) needs matplotlib too. */
export function detectPackages(code: string): PythonPackage[] {
  const packages: PythonPackage[] = []
  if (/\bnumpy\b/.test(code)) packages.push('numpy')
  if (/\bpandas\b/.test(code)) packages.push('pandas')
  if (/\bmatplotlib\b|\.plot\(|\.hist\(|\.boxplot\(/.test(code)) packages.push('matplotlib')
  return packages
}

/** Runs before learner code that uses matplotlib: headless backend, house style, no-op show(). */
export const MATPLOTLIB_SETUP = `
import matplotlib
matplotlib.use("AGG")
import matplotlib.pyplot as plt
from cycler import cycler
plt.close("all")
plt.show = lambda *args, **kwargs: None
plt.rcParams.update({
    "figure.figsize": (7, 4),
    "figure.dpi": 100,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.titleweight": "bold",
    "axes.prop_cycle": cycler(color=["#2A62A6", "#F2B531", "#2E7550", "#B03A1E", "#7B5EA7"]),
    "font.size": 11,
})
`

/** Collects every open matplotlib figure as base64 PNG and returns them as a JSON string. */
export const MATPLOTLIB_COLLECT = `
import base64 as __b64, io as __io, json as __json
import matplotlib.pyplot as __plt
__images = []
for __n in __plt.get_fignums():
    __buf = __io.BytesIO()
    __plt.figure(__n).savefig(__buf, format="png", dpi=110, bbox_inches="tight")
    __images.append(__b64.b64encode(__buf.getvalue()).decode())
__plt.close("all")
__json.dumps(__images)
`

/** Wider, friendlier DataFrame printing for the output panel. */
export const PANDAS_SETUP = `
import pandas as __pd
__pd.set_option("display.width", 110)
__pd.set_option("display.max_columns", 12)
__pd.set_option("display.max_rows", 30)
`
