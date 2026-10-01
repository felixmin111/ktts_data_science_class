const KEYWORDS = new Set([
  'and',
  'as',
  'assert',
  'break',
  'class',
  'continue',
  'def',
  'del',
  'elif',
  'else',
  'except',
  'False',
  'finally',
  'for',
  'from',
  'if',
  'import',
  'in',
  'is',
  'lambda',
  'None',
  'not',
  'or',
  'pass',
  'raise',
  'return',
  'True',
  'try',
  'while',
  'with',
  'yield'
])

const TOKEN =
  /(#[^\n]*)|([rRbBfF]{0,2}"(?:\\.|[^"\\\n])*"|[rRbBfF]{0,2}'(?:\\.|[^'\\\n])*')|(\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)/g

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const wrap = (cls: string, text: string) => `<span class="tok-${cls}">${escapeHtml(text)}</span>`

/** Turns Python source into HTML with `tok-*` classes. Output is always HTML-escaped. */
export function highlightPython(source: string): string {
  let html = ''
  let last = 0
  for (const match of source.matchAll(TOKEN)) {
    const [text, comment, str, num, call, name] = match
    const index = match.index ?? 0
    html += escapeHtml(source.slice(last, index))
    if (comment) html += wrap('com', text)
    else if (str) html += wrap('str', text)
    else if (num) html += wrap('num', text)
    else if (call) html += KEYWORDS.has(call) ? wrap('kw', text) : wrap('fn', text)
    else if (name && KEYWORDS.has(name)) html += wrap('kw', text)
    else html += escapeHtml(text)
    last = index + text.length
  }
  return html + escapeHtml(source.slice(last))
}

/** Renders a tiny inline markup: `code` and **bold**. Escapes everything else. */
export function renderInline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}
