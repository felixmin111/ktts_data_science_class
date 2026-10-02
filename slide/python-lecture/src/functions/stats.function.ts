/**
 * Small descriptive-statistics helpers used to build lesson tables and charts from raw data, so a
 * table and the graph drawn next to it always agree.
 */

/** Rounds to `digits` decimal places and drops trailing zeros: 0.2829, 28.29. */
export function round(value: number, digits = 4): number {
  const f = 10 ** digits
  return Math.round(value * f) / f
}

/** Formats a number with a fixed number of decimals: fixed(0.28286, 4) → "0.2829". */
export function fixed(value: number, digits: number): string {
  return value.toFixed(digits)
}

export interface FrequencyRow {
  category: string
  frequency: number
  relative: number
  percent: number
}

/** Frequency, relative frequency and percent frequency of each category, in `order`. */
export function frequencyTable(values: string[], order: string[]): FrequencyRow[] {
  const n = values.length
  return order.map((category) => {
    const frequency = values.filter((v) => v === category).length
    return { category, frequency, relative: frequency / n, percent: (frequency / n) * 100 }
  })
}

/** The 2^K rule: the smallest whole number K such that 2^K is greater than n. */
export function classCount(n: number): number {
  let k = 1
  while (2 ** k <= n) k += 1
  return k
}

/** (largest − smallest) / K, rounded up to the precision of the data (1 = whole numbers). */
export function classLength(data: number[], k: number, precision = 1): number {
  const raw = (Math.max(...data) - Math.min(...data)) / k
  return round(Math.ceil(round(raw / precision, 6)) * precision, 6)
}

/** Class boundaries starting at `start`: [start, start + L, …], with `k` classes. */
export function boundaries(start: number, length: number, k: number): number[] {
  return Array.from({ length: k + 1 }, (_, i) => round(start + i * length, 6))
}

/** How many values fall in each class [lower, upper). */
export function classCounts(data: number[], bounds: number[]): number[] {
  return bounds.slice(0, -1).map((lower, i) => {
    const upper = bounds[i + 1]!
    return data.filter((v) => v >= lower && v < upper).length
  })
}

/** Index of the class [lower, upper) that holds `value`, or -1. */
export function classIndex(value: number, bounds: number[]): number {
  for (let i = 0; i < bounds.length - 1; i++) {
    if (value >= bounds[i]! && value < bounds[i + 1]!) return i
  }
  return -1
}

export function cumulative(counts: number[]): number[] {
  let total = 0
  return counts.map((c) => (total += c))
}

export function midpoints(bounds: number[]): number[] {
  return bounds.slice(0, -1).map((lower, i) => round((lower + bounds[i + 1]!) / 2, 6))
}

/** Class label "10 < 13" meaning "10 and less than 13". */
export function classLabel(lower: number, upper: number): string {
  return `${lower} < ${upper}`
}

export interface StemRow {
  stem: number
  /** For split stems: 0 for leaves 0–4, 1 for leaves 5–9. */
  half?: 0 | 1
  leaves: number[]
}

/**
 * Stem-and-leaf rows. With leafUnit 0.1, 31.7 has stem 31 and leaf 7; with leafUnit 1, 47 has
 * stem 4 and leaf 7. Values are rounded to the leaf unit first.
 */
export function stemLeaf(data: number[], leafUnit: number, split = false): StemRow[] {
  const units = data.map((v) => Math.round(v / leafUnit))
  const stems = units.map((u) => Math.floor(u / 10))
  const minStem = Math.min(...stems)
  const maxStem = Math.max(...stems)
  const rows: StemRow[] = []
  for (let stem = minStem; stem <= maxStem; stem++) {
    const leaves = units
      .filter((u) => Math.floor(u / 10) === stem)
      .map((u) => u - stem * 10)
      .sort((a, b) => a - b)
    if (!split) rows.push({ stem, leaves })
    else {
      rows.push({ stem, half: 0, leaves: leaves.filter((l) => l < 5) })
      rows.push({ stem, half: 1, leaves: leaves.filter((l) => l >= 5) })
    }
  }
  return rows
}

export interface CrossTab {
  rows: string[]
  columns: string[]
  /** counts[r][c] */
  counts: number[][]
  rowTotals: number[]
  columnTotals: number[]
  total: number
}

export function crossTab(
  rowValues: string[],
  columnValues: string[],
  rows: string[],
  columns: string[]
): CrossTab {
  const counts = rows.map((r) =>
    columns.map((c) => rowValues.filter((v, i) => v === r && columnValues[i] === c).length)
  )
  const rowTotals = counts.map((row) => row.reduce((a, b) => a + b, 0))
  const columnTotals = columns.map((_, c) => counts.reduce((a, row) => a + row[c]!, 0))
  return { rows, columns, counts, rowTotals, columnTotals, total: rowValues.length }
}

/** Each cell as a percentage of its row total. */
export function rowPercents(table: CrossTab): number[][] {
  return table.counts.map((row, r) => row.map((c) => (c / table.rowTotals[r]!) * 100))
}

/** Least-squares straight line through the points (used only to draw a trend line). */
export function linearFit(points: [number, number][]): { slope: number; intercept: number } {
  const n = points.length
  const mx = points.reduce((a, p) => a + p[0], 0) / n
  const my = points.reduce((a, p) => a + p[1], 0) / n
  const sxy = points.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0)
  const sxx = points.reduce((a, p) => a + (p[0] - mx) ** 2, 0)
  const slope = sxy / sxx
  return { slope, intercept: my - slope * mx }
}

/** "Nice" axis ticks from at or below `min` to at or above `max`. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) return [min]
  const span = max - min
  const rough = span / count
  const mag = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? 10 * mag
  const start = Math.floor(min / step) * step
  const ticks: number[] = []
  for (let t = start; ; t += step) {
    ticks.push(round(t, 6))
    if (t >= max - step * 1e-9) break
  }
  return ticks
}

// ---- Chapter 3: numerical descriptive statistics -----------------------------------------------

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0)
}

export function mean(values: number[]): number {
  return sum(values) / values.length
}

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2
}

/** All values that occur most often (a data set can have more than one mode). */
export function modes(values: number[]): number[] {
  const counts = new Map<number, number>()
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1))
  const top = Math.max(...counts.values())
  return [...counts.entries()]
    .filter(([, c]) => c === top)
    .map(([v]) => v)
    .sort((a, b) => a - b)
}

/** Sample variance (divide by n − 1) or population variance (divide by N). */
export function variance(values: number[], population = false): number {
  const m = mean(values)
  const ss = sum(values.map((v) => (v - m) ** 2))
  return ss / (population ? values.length : values.length - 1)
}

export function stdev(values: number[], population = false): number {
  return Math.sqrt(variance(values, population))
}

/**
 * The book's percentile method: i = (p / 100)·n. If i is not a whole number, round up and take
 * that position; if it is, average the values in positions i and i + 1 (positions start at 1).
 */
export function percentile(values: number[], p: number): number {
  const s = [...values].sort((a, b) => a - b)
  const i = (p / 100) * s.length
  if (Math.abs(i - Math.round(i)) > 1e-9) return s[Math.ceil(i) - 1]!
  const k = Math.round(i)
  if (k <= 0) return s[0]!
  if (k >= s.length) return s.at(-1)!
  return (s[k - 1]! + s[k]!) / 2
}

export interface BoxSummary {
  min: number
  q1: number
  median: number
  q3: number
  max: number
  iqr: number
  innerFences: [number, number]
  outerFences: [number, number]
  /** Whiskers reach the most extreme values inside the inner fences. */
  whiskers: [number, number]
  mildOutliers: number[]
  extremeOutliers: number[]
}

export function boxSummary(values: number[]): BoxSummary {
  const s = [...values].sort((a, b) => a - b)
  const q1 = percentile(s, 25)
  const q3 = percentile(s, 75)
  const iqr = q3 - q1
  const inner: [number, number] = [q1 - 1.5 * iqr, q3 + 1.5 * iqr]
  const outer: [number, number] = [q1 - 3 * iqr, q3 + 3 * iqr]
  const inside = s.filter((v) => v >= inner[0] && v <= inner[1])
  return {
    min: s[0]!,
    q1,
    median: median(s),
    q3,
    max: s.at(-1)!,
    iqr,
    innerFences: inner,
    outerFences: outer,
    whiskers: [inside[0]!, inside.at(-1)!],
    mildOutliers: s.filter(
      (v) => (v < inner[0] && v >= outer[0]) || (v > inner[1] && v <= outer[1])
    ),
    extremeOutliers: s.filter((v) => v < outer[0] || v > outer[1])
  }
}

export function zScore(value: number, m: number, sd: number): number {
  return (value - m) / sd
}

/** Sample covariance of paired values. */
export function covariance(xs: number[], ys: number[]): number {
  const mx = mean(xs)
  const my = mean(ys)
  return sum(xs.map((x, i) => (x - mx) * (ys[i]! - my))) / (xs.length - 1)
}

/** Sample correlation coefficient r. */
export function correlation(xs: number[], ys: number[]): number {
  return covariance(xs, ys) / (stdev(xs) * stdev(ys))
}

export function weightedMean(values: number[], weights: number[]): number {
  return sum(values.map((v, i) => v * weights[i]!)) / sum(weights)
}

export function geometricMean(values: number[]): number {
  return Math.exp(mean(values.map((v) => Math.log(v))))
}

// ---- Chapters 4 and 5: counting and probability distributions ----------------------------------

export function factorial(n: number): number {
  let f = 1
  for (let i = 2; i <= n; i++) f *= i
  return f
}

/** Number of combinations: n choose k. */
export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  let c = 1
  for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i
  return Math.round(c)
}

/** Number of permutations: ordered arrangements of k out of n. */
export function permutations(n: number, k: number): number {
  return factorial(n) / factorial(n - k)
}

export function binomialPmf(x: number, n: number, p: number): number {
  return choose(n, x) * p ** x * (1 - p) ** (n - x)
}

export function poissonPmf(x: number, mu: number): number {
  return (Math.exp(-mu) * mu ** x) / factorial(x)
}

/** P(X = x) drawing n items without replacement from N items of which r are "successes". */
export function hypergeometricPmf(x: number, N: number, r: number, n: number): number {
  return (choose(r, x) * choose(N - r, n - x)) / choose(N, n)
}

/** Mean of a discrete distribution: Σ x·p(x). */
export function distributionMean(xs: number[], ps: number[]): number {
  return sum(xs.map((x, i) => x * ps[i]!))
}

/** Variance of a discrete distribution: Σ (x − μ)²·p(x). */
export function distributionVariance(xs: number[], ps: number[]): number {
  const mu = distributionMean(xs, ps)
  return sum(xs.map((x, i) => (x - mu) ** 2 * ps[i]!))
}
