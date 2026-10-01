/**
 * Tag for Python code in lesson files. Keeps backslashes literal (like String.raw) and trims the
 * first/last blank line, so code can be written flush-left in a template literal.
 */
export function py(strings: TemplateStringsArray, ...values: unknown[]): string {
  return String.raw({ raw: strings }, ...values)
    .replace(/^\n/, '')
    .replace(/\n\s*$/, '')
}
