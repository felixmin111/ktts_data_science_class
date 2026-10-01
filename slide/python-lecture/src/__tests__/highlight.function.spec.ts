import { describe, expect, it } from 'vitest'
import { escapeHtml, highlightPython, renderInline } from '@/functions/highlight.function'

describe('highlightPython', () => {
  it('marks functions, strings, numbers and comments', () => {
    const html = highlightPython('print("hi", 25)  # say hi')
    expect(html).toContain('<span class="tok-fn">print</span>')
    expect(html).toContain('<span class="tok-str">&quot;hi&quot;</span>'.replace(/&quot;/g, '"'))
    expect(html).toContain('<span class="tok-num">25</span>')
    expect(html).toContain('<span class="tok-com"># say hi</span>')
  })

  it('marks keywords and f-strings', () => {
    const html = highlightPython('x = True\nprint(f"{x}")')
    expect(html).toContain('<span class="tok-kw">True</span>')
    expect(html).toContain('<span class="tok-str">f"{x}"</span>')
  })

  it('escapes HTML in source', () => {
    expect(highlightPython('a < b')).toBe('a &lt; b')
    expect(highlightPython('"<script>"')).not.toContain('<script>')
  })

  it('keeps the original text when tags are stripped', () => {
    const source = 'name = input("Name? ")\nprint(name * 2)  # twice'
    const text = highlightPython(source).replace(/<[^>]+>/g, '')
    expect(text).toBe(escapeHtml(source))
  })
})

describe('renderInline', () => {
  it('renders code and bold, escaping the rest', () => {
    expect(renderInline('Use `print()` **now** <b>')).toBe(
      'Use <code>print()</code> <strong>now</strong> &lt;b&gt;'
    )
  })
})
