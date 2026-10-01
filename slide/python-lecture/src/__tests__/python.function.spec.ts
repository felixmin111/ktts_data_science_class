import { describe, expect, it } from 'vitest'
import {
  buildProgram,
  detectPackages,
  formatPythonError,
  PROGRAM_PREFIX_LINES
} from '@/functions/python.function'

describe('buildProgram', () => {
  it('puts the learner code after the prefix', () => {
    const program = buildProgram('print(1)', [])
    expect(program.split('\n')).toHaveLength(PROGRAM_PREFIX_LINES + 1)
    expect(program.split('\n').at(-1)).toBe('print(1)')
  })

  it('embeds stdin lines safely', () => {
    const program = buildProgram('x = input()', ['He said "hi"', "it's"])
    const encoded = program.split('\n')[1]!.replace('__lines = __json.loads(', '').slice(0, -1)
    expect(JSON.parse(JSON.parse(encoded))).toEqual(['He said "hi"', "it's"])
  })
})

describe('formatPythonError', () => {
  it('maps line numbers back to learner code and drops Pyodide internals', () => {
    const raw = [
      'Traceback (most recent call last):',
      '  File "/lib/python312.zip/_pyodide/_base.py", line 597, in eval_code_async',
      `  File "<exec>", line ${PROGRAM_PREFIX_LINES + 2}, in <module>`,
      "NameError: name 'nmae' is not defined"
    ].join('\n')
    expect(formatPythonError(raw)).toBe(
      "  line 2, in <module>\nNameError: name 'nmae' is not defined"
    )
  })
})

describe('detectPackages', () => {
  it('finds imported data-science packages', () => {
    expect(detectPackages('import numpy as np')).toEqual(['numpy'])
    expect(detectPackages('import pandas as pd\nimport matplotlib.pyplot as plt')).toEqual([
      'pandas',
      'matplotlib'
    ])
  })

  it('loads matplotlib for pandas plotting without an explicit import', () => {
    expect(detectPackages('import pandas as pd\ndf.plot(kind="bar")')).toContain('matplotlib')
  })

  it('needs nothing for plain Python', () => {
    expect(detectPackages('print("hi")')).toEqual([])
  })
})
