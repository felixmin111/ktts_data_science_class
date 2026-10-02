/** Variable values while a loop program runs. */
export type LoopVars = Record<string, number | string | boolean>

/** One line of Python plus the same effect in JavaScript, so the page can animate it. */
export interface LoopStatement {
  kind: 'stmt'
  code: string
  run: (vars: LoopVars, output: string[]) => void
}

/** An if inside the loop body whose True branch is one statement, break or continue. */
export interface LoopIf {
  kind: 'if'
  condition: string
  test: (vars: LoopVars) => boolean
  then: LoopStatement | 'break' | 'continue'
}

export type LoopBodyItem = LoopStatement | LoopIf

export type LoopHeader =
  | { kind: 'while'; condition: string; test: (vars: LoopVars) => boolean }
  /** e.g. code "for i in range(1, 4)", variable "i", items () => [1, 2, 3] */
  | {
      kind: 'for'
      code: string
      variable: string
      items: (vars: LoopVars) => (number | string)[]
    }

export interface LoopProgram {
  setup: LoopStatement[]
  loop: LoopHeader
  body: LoopBodyItem[]
  after: LoopStatement[]
}
