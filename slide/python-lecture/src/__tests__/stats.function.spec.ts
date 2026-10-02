import { describe, expect, it } from 'vitest'
import {
  binomialPmf,
  boundaries,
  boxSummary,
  choose,
  correlation,
  distributionMean,
  distributionVariance,
  geometricMean,
  hypergeometricPmf,
  mean,
  median,
  modes,
  percentile,
  permutations,
  poissonPmf,
  stdev,
  sum,
  variance,
  weightedMean,
  classCount,
  classCounts,
  classLength,
  crossTab,
  cumulative,
  frequencyTable,
  linearFit,
  midpoints,
  niceTicks,
  rowPercents,
  stemLeaf
} from '@/functions/stats.function'
import * as chapter2 from '@/data/lessons/dataScience/day03ThinkingWithData.lesson'
import { deliveryTimes, drinks } from '@/data/lessons/dataScience/stats/statsData'

describe('frequency distributions', () => {
  it('counts each category and its relative and percent frequency', () => {
    const table = frequencyTable(['a', 'b', 'a', 'a'], ['a', 'b'])
    expect(table).toEqual([
      { category: 'a', frequency: 3, relative: 0.75, percent: 75 },
      { category: 'b', frequency: 1, relative: 0.25, percent: 25 }
    ])
  })

  it('relative frequencies add up to 1 for the lesson data', () => {
    const total = frequencyTable(drinks, chapter2.drinkOrder).reduce((a, r) => a + r.relative, 0)
    expect(total).toBeCloseTo(1, 10)
  })
})

describe('the 2^K rule and classes', () => {
  it('picks the smallest K with 2^K greater than n', () => {
    expect(classCount(50)).toBe(6)
    expect(classCount(64)).toBe(7)
    expect(classCount(65)).toBe(7)
    expect(classCount(100)).toBe(7)
    expect(classCount(128)).toBe(8)
  })

  it('rounds the class length up to the precision of the data', () => {
    expect(classLength([10, 29], 7)).toBe(3)
    expect(classLength([29.8, 33.3], 7, 0.1)).toBe(0.5)
  })

  it('counts values in [lower, upper) classes', () => {
    const bounds = boundaries(10, 3, 3)
    expect(bounds).toEqual([10, 13, 16, 19])
    expect(classCounts([10, 12, 13, 15, 16, 18], bounds)).toEqual([2, 2, 2])
    expect(midpoints(bounds)).toEqual([11.5, 14.5, 17.5])
    expect(cumulative([2, 2, 2])).toEqual([2, 4, 6])
  })

  it('the delivery-time histogram covers every value', () => {
    expect(chapter2.k).toBe(6)
    expect(chapter2.length).toBe(5)
    expect(chapter2.counts.reduce((a, b) => a + b, 0)).toBe(deliveryTimes.length)
    expect(chapter2.cumCounts.at(-1)).toBe(deliveryTimes.length)
  })
})

describe('stem-and-leaf', () => {
  it('splits values into stems and sorted leaves', () => {
    expect(stemLeaf([24, 12, 21, 37], 1)).toEqual([
      { stem: 1, leaves: [2] },
      { stem: 2, leaves: [1, 4] },
      { stem: 3, leaves: [7] }
    ])
    expect(stemLeaf([30.8, 31.7, 30.1], 0.1)).toEqual([
      { stem: 30, leaves: [1, 8] },
      { stem: 31, leaves: [7] }
    ])
  })

  it('split stems put leaves 0-4 and 5-9 on separate rows', () => {
    expect(stemLeaf([21, 27], 1, true)).toEqual([
      { stem: 2, half: 0, leaves: [1] },
      { stem: 2, half: 1, leaves: [7] }
    ])
  })
})

describe('cross-tabulation', () => {
  it('counts cells, totals and row percentages', () => {
    const tab = crossTab(['x', 'x', 'y', 'y'], ['hi', 'lo', 'hi', 'hi'], ['x', 'y'], ['hi', 'lo'])
    expect(tab.counts).toEqual([
      [1, 1],
      [2, 0]
    ])
    expect(tab.rowTotals).toEqual([2, 2])
    expect(tab.columnTotals).toEqual([3, 1])
    expect(rowPercents(tab)).toEqual([
      [50, 50],
      [100, 0]
    ])
  })

  it('the lesson cross-tab adds up to every customer', () => {
    expect(chapter2.tab.total).toBe(90)
    expect(chapter2.tab.rowTotals.reduce((a, b) => a + b, 0)).toBe(90)
    expect(chapter2.complaintCum.at(-1)).toBeCloseTo(100, 10)
  })
})

describe('niceTicks', () => {
  it('always reaches past the largest value', () => {
    expect(niceTicks(0, 91.8)).toEqual([0, 20, 40, 60, 80, 100])
    expect(niceTicks(0, 100)).toEqual([0, 20, 40, 60, 80, 100])
    expect(niceTicks(498, 502).at(-1)).toBeGreaterThanOrEqual(502)
  })
})

describe('linearFit', () => {
  it('fits an exact line', () => {
    const fit = linearFit([
      [0, 1],
      [1, 3],
      [2, 5]
    ])
    expect(fit.slope).toBeCloseTo(2)
    expect(fit.intercept).toBeCloseTo(1)
  })
})

describe('chapter 3 measures', () => {
  const incomes = [18, 21, 23, 25, 26, 28, 30, 31, 33, 35, 41, 120]

  it('computes centre and spread', () => {
    expect(mean([3, 5, 6, 4, 7])).toBe(5)
    expect(variance([3, 5, 6, 4, 7])).toBe(2.5)
    expect(stdev([3, 5, 6, 4, 7], true)).toBeCloseTo(Math.SQRT2)
    expect(median(incomes)).toBe(29)
    expect(modes([1, 2, 2, 3, 3])).toEqual([2, 3])
  })

  it('uses the book percentile rule (round up, or average two positions)', () => {
    expect(percentile(incomes, 10)).toBe(21) // i = 1.2 → position 2
    expect(percentile(incomes, 25)).toBe(24) // i = 3 → average positions 3 and 4
    expect(percentile(incomes, 90)).toBe(41) // i = 10.8 → position 11
  })

  it('finds fences and outliers for a box plot', () => {
    const box = boxSummary(incomes)
    expect([box.q1, box.median, box.q3, box.iqr]).toEqual([24, 29, 34, 10])
    expect(box.innerFences).toEqual([9, 49])
    expect(box.outerFences).toEqual([-6, 64])
    expect(box.whiskers).toEqual([18, 41])
    expect(box.extremeOutliers).toEqual([120])
    expect(box.mildOutliers).toEqual([])
  })

  it('correlation of a perfect line is 1 and the geometric mean compounds', () => {
    expect(correlation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1)
    expect(geometricMean([1.5, 0.5])).toBeCloseTo(Math.sqrt(0.75))
    expect(weightedMean([92, 74, 81], [20, 30, 50])).toBeCloseTo(81.1)
  })
})

describe('chapters 4 and 5', () => {
  it('counts', () => {
    expect(choose(10, 3)).toBe(120)
    expect(choose(45, 6)).toBe(8145060)
    expect(permutations(10, 3)).toBe(720)
  })

  it('distributions add up to 1 and have the right means', () => {
    const xs = Array.from({ length: 21 }, (_, i) => i)
    const binom = xs.map((x) => binomialPmf(x, 20, 0.3))
    expect(sum(binom)).toBeCloseTo(1, 10)
    expect(distributionMean(xs, binom)).toBeCloseTo(6, 10)
    const pois = Array.from({ length: 60 }, (_, x) => poissonPmf(x, 4))
    expect(sum(pois)).toBeCloseTo(1, 10)
    const hyper = [0, 1, 2, 3].map((x) => hypergeometricPmf(x, 12, 3, 4))
    expect(sum(hyper)).toBeCloseTo(1, 10)
    expect(hyper[0]).toBeCloseTo(126 / 495, 10)
    expect(distributionVariance([1, 2, 3, 4], [0.5, 0.3, 0.15, 0.05])).toBeCloseTo(0.7875, 10)
  })
})
