import type { Lesson } from '@/models/lesson.model'
import {
  boxSummary,
  boundaries,
  classCounts,
  correlation,
  covariance,
  fixed,
  geometricMean,
  mean,
  median,
  midpoints,
  modes,
  percentile,
  round,
  stdev,
  sum,
  variance,
  weightedMean
} from '@/functions/stats.function'
import { py } from '../py'
import { deliveryTimes, fills, hours, quiz1, quiz2, score } from './stats/statsData'

// ---- Example data (invented for teaching) -------------------------------------------------------

/** Monthly income of 12 households (thousand THB); one household is very rich. */
export const incomes = [18, 21, 23, 25, 26, 28, 30, 31, 33, 35, 41, 120]
/** Minutes a barista needed for 5 drinks (small set for hand calculation). */
export const drinkTimes = [3, 5, 6, 4, 7]
/** Fill volumes (ml) from two coffee machines with the same mean. */
export const machineA = [248, 250, 252, 249, 251, 250]
export const machineB = [240, 256, 245, 258, 244, 257]
/** Shoe sizes sold in one morning (for the mode). */
export const shoeSizes = [38, 39, 40, 40, 41, 40, 42, 39, 40, 43, 41, 40]
/** Course weights. */
export const gradeParts = [
  { part: 'Homework', score: 92, weight: 20 },
  { part: 'Midterm exam', score: 74, weight: 30 },
  { part: 'Final exam', score: 81, weight: 50 }
]
/** Two yearly investment returns. */
export const returns = [0.5, -0.5]

// ---- Derived numbers ----------------------------------------------------------------------------

const f2 = (v: number) => fixed(v, 2)
export const incomeMean = mean(incomes)
export const incomeMedian = median(incomes)
export const dtMean = mean(drinkTimes)
export const dtDev = drinkTimes.map((v) => v - dtMean)
export const dtSS = sum(dtDev.map((d) => d * d))
export const fillMean = mean(fills)
export const fillSd = stdev(fills)
export const fillWithin = [1, 2, 3].map(
  (k) => fills.filter((v) => Math.abs(v - fillMean) <= k * fillSd).length
)
export const dtimeMean = mean(deliveryTimes)
export const dtimeSd = stdev(deliveryTimes)
export const dtimeWithin2 = deliveryTimes.filter(
  (v) => Math.abs(v - dtimeMean) <= 2 * dtimeSd
).length
export const q1m = mean(quiz1)
export const q1s = stdev(quiz1)
export const q2m = mean(quiz2)
export const q2s = stdev(quiz2)
export const zA = (80 - q1m) / q1s
export const zB = (85 - q2m) / q2s
export const incomeBox = boxSummary(incomes)
export const pcts = [10, 25, 50, 75, 90]
export const cov = covariance(hours, score)
export const r = correlation(hours, score)
export const b1 = cov / variance(hours)
export const b0 = mean(score) - b1 * mean(hours)
export const courseGrade = weightedMean(
  gradeParts.map((g) => g.score),
  gradeParts.map((g) => g.weight)
)
export const gm = geometricMean(returns.map((x) => 1 + x)) - 1
export const dBounds = boundaries(12, 5, 6)
export const dCounts = classCounts(deliveryTimes, dBounds)
export const dMids = midpoints(dBounds)
export const groupedMean = sum(dMids.map((m, i) => m * dCounts[i]!)) / deliveryTimes.length
export const groupedVar =
  sum(dMids.map((m, i) => dCounts[i]! * (m - groupedMean) ** 2)) / (deliveryTimes.length - 1)

/** i = (p/100)·n and the rule applied, for the percentile table. */
export function percentileRow(p: number): string[] {
  const i = (p / 100) * incomes.length
  const whole = Number.isInteger(round(i, 9))
  return [
    `${p}th`,
    `(${p}/100) × ${incomes.length} = ${round(i, 2)}`,
    whole
      ? `whole → average positions ${i} and ${i + 1}`
      : `not whole → round up to position ${Math.ceil(i)}`,
    String(percentile(incomes, p))
  ]
}

// ---- The lesson -------------------------------------------------------------------------------

const stats3: Lesson = {
  id: 'ds-stats-3',
  track: 'data-science',
  day: 4,
  title: 'Statistics 3: describing data with numbers',
  summary:
    'Mean, median and mode; range, variance and standard deviation; the Empirical Rule and Chebyshev; z-scores; percentiles and box plots; correlation and the least squares line; weighted, grouped and geometric means.',
  durationMinutes: 100,
  topics: [
    'Mean, median, mode',
    'Variance and standard deviation',
    'Empirical Rule',
    'z-scores',
    'Percentiles and box plots',
    'Correlation',
    'Weighted and geometric means'
  ],
  available: true,
  sections: [
    {
      id: 'centre',
      eyebrow: 'Chapter 3 · 3.1 Central tendency',
      title: 'The centre of the data: mean, median and mode',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'Chapter 2 described data with tables and graphs. This chapter describes it with **numbers**. The first question is: where is the **centre**?',
            '**Mean** (average): add all the values and divide by how many there are. For a sample of n values, x̄ = Σx ÷ n. For a whole population of N values the mean is written μ (mu). A number calculated from a **sample** (like x̄) is a **statistic**; the same idea for the **population** (like μ) is a **parameter**, and the sample statistic is our **point estimate** of it.',
            '**Median**: sort the values; the median is the one in the middle (for an even count, the average of the two middle values). Half the data is below it, half above.',
            '**Mode**: the value that occurs most often.'
          ]
        },
        {
          type: 'table',
          columns: ['Household', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          rows: [['Income (thousand THB)', ...incomes.map(String)]]
        },
        {
          type: 'text',
          body: [
            `**Mean:** (18 + 21 + … + 41 + 120) ÷ 12 = ${sum(incomes)} ÷ 12 = **${f2(incomeMean)}** thousand THB.`,
            `**Median:** n = 12 is even, so average the 6th and 7th sorted values: (28 + 30) ÷ 2 = **${incomeMedian}** thousand THB.`,
            `Eleven households earn 41 or less, but the mean says ${f2(incomeMean)}: one household earning 120 **pulls the mean up**. The median ignores how far away 120 is, so it describes a typical household better. That is why incomes and house prices are usually reported as a **median**.`
          ]
        },
        {
          type: 'chart',
          title: 'Try it: move the richest household',
          chart: {
            kind: 'meanMedian',
            data: incomes,
            min: 20,
            max: 200,
            xLabel: 'Monthly income (thousand THB)'
          },
          caption:
            'Drag the slider. The **mean** (dashed, orange) chases the moving value, but the **median** (green) does not move at all, because the middle of the sorted list stays the same. The mean uses every value’s size; the median only uses its position.'
        },
        {
          type: 'table',
          columns: ['Shoe sizes sold', 'Most common', 'Mode'],
          rows: [
            [
              shoeSizes.join(', '),
              `40 appears ${shoeSizes.filter((v) => v === 40).length} times`,
              String(modes(shoeSizes)[0])
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Mean, median and mode for three shapes',
          chart: {
            kind: 'gallery',
            charts: [
              {
                title: 'Symmetric: mean ≈ median ≈ mode',
                chart: {
                  kind: 'histogram',
                  bounds: [0, 1, 2, 3, 4, 5, 6, 7],
                  counts: [2, 5, 10, 14, 10, 5, 2]
                }
              },
              {
                title: 'Skewed right: mode < median < mean',
                chart: {
                  kind: 'histogram',
                  bounds: [0, 1, 2, 3, 4, 5, 6, 7],
                  counts: [5, 14, 11, 7, 4, 2, 1]
                }
              },
              {
                title: 'Skewed left: mean < median < mode',
                chart: {
                  kind: 'histogram',
                  bounds: [0, 1, 2, 3, 4, 5, 6, 7],
                  counts: [1, 2, 4, 7, 11, 14, 5]
                }
              }
            ]
          },
          caption:
            'The mean is pulled towards the **long tail**. So when the mean is much bigger than the median, the data is skewed to the right; when it is smaller, skewed to the left. The mode is useful for qualitative data (the most popular shoe size or drink).'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Mean, median and mode in Python',
          code: py`
import statistics as st

incomes = ${JSON.stringify(incomes)}
print("Mean:  ", round(st.mean(incomes), 2))
print("Median:", st.median(incomes))

sizes = ${JSON.stringify(shoeSizes)}
print("Mode:  ", st.mode(sizes))
`,
          output: `Mean:   ${f2(incomeMean)}\nMedian: ${fixed(incomeMedian, 1)}\nMode:   40`
        }
      ]
    },
    {
      id: 'variation',
      eyebrow: 'Chapter 3 · 3.2 Measures of variation',
      title: 'How spread out? Range, variance and standard deviation',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            'Two data sets can have the same centre but very different spread. Two coffee machines both average 250 ml, but one is far more consistent:'
          ]
        },
        {
          type: 'table',
          columns: ['Machine', 'Fills (ml)', 'Mean', 'Range', 'Standard deviation'],
          rows: [
            [
              'A',
              machineA.join(', '),
              String(mean(machineA)),
              String(Math.max(...machineA) - Math.min(...machineA)),
              f2(stdev(machineA))
            ],
            [
              'B',
              machineB.join(', '),
              String(mean(machineB)),
              String(Math.max(...machineB) - Math.min(...machineB)),
              f2(stdev(machineB))
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Same mean, different spread',
          chart: {
            kind: 'gallery',
            charts: [
              { title: 'Machine A', chart: { kind: 'dot', data: machineA, xLabel: 'ml' } },
              { title: 'Machine B', chart: { kind: 'dot', data: machineB, xLabel: 'ml' } }
            ]
          },
          caption:
            'Both centres are 250 ml. Machine B’s cups swing from 240 to 258 ml — a customer would notice.'
        },
        {
          type: 'text',
          body: [
            '**Range** = largest − smallest. Easy, but it uses only two values.',
            '**Variance** uses every value: how far, on average, the values are from the mean, **squared**. For a sample: s² = Σ(x − x̄)² ÷ (n − 1). For a population: σ² = Σ(x − μ)² ÷ N. We divide a sample by **n − 1** (not n) because a sample tends to be a little less spread out than its population; n − 1 corrects for that.',
            '**Standard deviation** = √variance (s for a sample, σ for a population). It is back in the **original units** (ml, minutes, THB), so it is the number we usually report.',
            '**Worked example:** a barista’s times for 5 drinks are 3, 5, 6, 4 and 7 minutes. The mean is 25 ÷ 5 = **5**.'
          ]
        },
        {
          type: 'table',
          columns: ['x (minutes)', 'x − x̄', '(x − x̄)²'],
          rows: [
            ...drinkTimes.map((v, i) => [String(v), String(dtDev[i]), String(dtDev[i]! ** 2)]),
            ['Sum', '0', String(dtSS)]
          ]
        },
        {
          type: 'text',
          body: [
            `s² = ${dtSS} ÷ (5 − 1) = **${f2(dtSS / 4)}**, so s = √${f2(dtSS / 4)} = **${f2(Math.sqrt(dtSS / 4))} minutes**. The deviations always add to 0 (the positives and negatives cancel), which is why we square them.`
          ]
        },
        {
          type: 'chart',
          title: 'Each deviation from the mean',
          chart: {
            kind: 'bar',
            categories: drinkTimes.map((v, i) => `drink ${i + 1} (${v})`),
            values: dtDev.map((d) => d * d),
            yLabel: 'Squared deviation (x − x̄)²'
          },
          caption:
            'Drinks 1 and 5 are 2 minutes from the mean, so each adds 4 to the sum of squares; drink 2 equals the mean and adds 0.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Variance and standard deviation in Python',
          code: py`
import statistics as st

times = ${JSON.stringify(drinkTimes)}
print("Sample variance s²:", st.variance(times))
print("Sample std dev s:  ", round(st.stdev(times), 2))
print("Population σ:      ", round(st.pstdev(times), 2), "(divides by n)")
`,
          output: `Sample variance s²: ${dtSS / 4}\nSample std dev s:   ${f2(Math.sqrt(dtSS / 4))}\nPopulation σ:       ${f2(Math.sqrt(dtSS / 5))} (divides by n)`
        }
      ]
    },
    {
      id: 'empirical-rule',
      eyebrow: 'Chapter 3 · 3.2 Measures of variation',
      title: 'Reading the standard deviation: the Empirical Rule and Chebyshev',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'If a population is **normally distributed** (a symmetric bell shape), the **Empirical Rule** says that about **68.26%** of values lie within μ ± 1σ, **95.44%** within μ ± 2σ, and **99.73%** within μ ± 3σ. Intervals like these, which contain a stated share of individual values, are called **tolerance intervals**.',
            `Our 24 bottle fills (Chapter 1) look mound-shaped. Sample mean x̄ = **${f2(fillMean)} ml**, s = **${f2(fillSd)} ml**.`
          ]
        },
        {
          type: 'chart',
          title: 'The Empirical Rule for the bottle fills',
          chart: {
            kind: 'bell',
            mean: round(fillMean, 2),
            sd: round(fillSd, 2),
            xLabel: 'Fill volume (ml)',
            decimals: 1
          }
        },
        {
          type: 'table',
          columns: ['Interval', 'Limits (ml)', 'Rule predicts', 'Our 24 fills'],
          rows: [1, 2, 3].map((k) => [
            `x̄ ± ${k}s`,
            `${fixed(fillMean - k * fillSd, 1)} to ${fixed(fillMean + k * fillSd, 1)}`,
            ['68.26%', '95.44%', '99.73%'][k - 1]!,
            `${fillWithin[k - 1]} of 24 = ${fixed((fillWithin[k - 1]! / 24) * 100, 0)}%`
          ])
        },
        {
          type: 'text',
          body: [
            '**Chebyshev’s Theorem** works for **any** shape: at least **1 − 1/k²** of the values lie within k standard deviations of the mean. For k = 2 that is at least **75%**; for k = 3 at least **88.89%**. It is weaker than the Empirical Rule, but it never fails.',
            `**Example:** the 50 delivery times (Chapter 2) are skewed, so the Empirical Rule does not apply. Mean = ${f2(dtimeMean)}, s = ${f2(dtimeSd)} minutes. Chebyshev promises at least 75% within ${fixed(dtimeMean - 2 * dtimeSd, 1)} to ${fixed(dtimeMean + 2 * dtimeSd, 1)} minutes; in fact ${dtimeWithin2} of 50 (${round((dtimeWithin2 / 50) * 100, 0)}%) are.`,
            '**Coefficient of variation** = (s ÷ x̄) × 100%. It compares spread **relative to the mean**, so it works even when the units differ.'
          ]
        },
        {
          type: 'table',
          columns: ['Data', 'Mean', 'Standard deviation', 'Coefficient of variation'],
          rows: [
            [
              'Bottle fills (ml)',
              f2(fillMean),
              f2(fillSd),
              `${fixed((fillSd / fillMean) * 100, 2)}%`
            ],
            [
              'Delivery times (min)',
              f2(dtimeMean),
              f2(dtimeSd),
              `${fixed((dtimeSd / dtimeMean) * 100, 2)}%`
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Relative spread: coefficient of variation',
          chart: {
            kind: 'bar',
            categories: ['Bottle fills', 'Delivery times'],
            values: [round((fillSd / fillMean) * 100, 2), round((dtimeSd / dtimeMean) * 100, 2)],
            yLabel: 'Coefficient of variation (%)',
            percent: true
          },
          caption:
            'The bottle fills vary by about a tenth of one percent of their mean — very consistent. Delivery times vary by about a quarter of their mean — much less predictable.'
        }
      ]
    },
    {
      id: 'z-scores',
      eyebrow: 'Chapter 3 · 3.2 Measures of variation',
      title: 'z-scores: how unusual is a value?',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'A **z-score** says how many standard deviations a value is from the mean: **z = (x − mean) ÷ standard deviation**. z = 0 is exactly average; z = 2 is two standard deviations above; z = −1 is one below.',
            'z-scores let us compare values from **different** distributions. A student scored **80 on Quiz 1** and **85 on Quiz 2**. Which was the better result compared with the class?'
          ]
        },
        {
          type: 'table',
          columns: ['Quiz', 'Score', 'Class mean', 'Class s', 'z-score'],
          rows: [
            ['Quiz 1', '80', f2(q1m), f2(q1s), `(80 − ${f2(q1m)}) ÷ ${f2(q1s)} = ${f2(zA)}`],
            ['Quiz 2', '85', f2(q2m), f2(q2s), `(85 − ${f2(q2m)}) ÷ ${f2(q2s)} = ${f2(zB)}`]
          ]
        },
        {
          type: 'chart',
          title: 'Both scores in standard deviations from their mean',
          chart: {
            kind: 'bar',
            categories: ['Quiz 1: 80', 'Quiz 2: 85'],
            values: [round(zA, 2), round(zB, 2)],
            yLabel: 'z-score'
          },
          caption: `Quiz 2’s 85 looks higher, but its z-score is ${f2(zB)} against ${f2(zA)} for Quiz 1. Compared with the class, the two results are ${Math.abs(zA - zB) < 0.1 ? 'almost equally good' : zA > zB ? 'better on Quiz 1' : 'better on Quiz 2'}. A raw score means little without the mean and spread of its group.`
        }
      ]
    },
    {
      id: 'percentiles',
      eyebrow: 'Chapter 3 · 3.3 Percentiles',
      title: 'Percentiles, quartiles and box-and-whiskers displays',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            'The **pth percentile** is a value with p% of the data at or below it. When data are skewed or have outliers, percentiles describe the data better than the mean and standard deviation.',
            '**The book’s three steps:** ① sort the n values ② compute i = (p ÷ 100) × n ③ if i is **not** a whole number, round it **up**: that position is the percentile; if i **is** a whole number, average the values in positions i and i + 1.',
            '**Quartiles** split the data into four parts: **Q1** = 25th percentile, **Q2** = median, **Q3** = 75th percentile. The **interquartile range** IQR = Q3 − Q1 covers the middle half of the data.'
          ]
        },
        {
          type: 'table',
          columns: ['Percentile', 'i = (p/100)·n', 'Rule', 'Value (thousand THB)'],
          rows: pcts.map(percentileRow)
        },
        {
          type: 'text',
          body: [
            `So Q1 = ${incomeBox.q1}, median = ${incomeBox.median}, Q3 = ${incomeBox.q3} and IQR = ${incomeBox.q3} − ${incomeBox.q1} = **${incomeBox.iqr}**.`,
            `**Box-and-whiskers display:** ① draw a box from Q1 to Q3 with a line at the median ② compute the **inner fences** Q1 − 1.5·IQR = ${incomeBox.innerFences[0]} and Q3 + 1.5·IQR = ${incomeBox.innerFences[1]}, and the **outer fences** Q1 − 3·IQR = ${incomeBox.outerFences[0]} and Q3 + 3·IQR = ${incomeBox.outerFences[1]} ③ draw the whiskers out to the smallest and largest values **inside the inner fences** ④ values between the inner and outer fences are **mild outliers** (open circle); values beyond the outer fences are **extreme outliers** (filled circle).`
          ]
        },
        {
          type: 'chart',
          title: 'Box plot of the 12 household incomes',
          chart: {
            kind: 'box',
            groups: [{ name: '', data: incomes }],
            xLabel: 'Monthly income (thousand THB)'
          },
          caption: `The box shows the middle half of the households (${incomeBox.q1} to ${incomeBox.q3}). The income of 120 is beyond the outer fence (${incomeBox.outerFences[1]}): an **extreme outlier**, plotted as a filled dot.`
        },
        {
          type: 'chart',
          title: 'Comparing Quiz 1 and Quiz 2 with box plots',
          chart: {
            kind: 'box',
            groups: [
              { name: 'Quiz 1', data: quiz1 },
              { name: 'Quiz 2', data: quiz2 }
            ],
            xLabel: 'Score'
          },
          caption: `Quiz 2’s box sits further right (median ${median(quiz2)} vs ${median(quiz1)}) and is narrower (IQR ${boxSummary(quiz2).iqr} vs ${boxSummary(quiz1).iqr}): higher and more consistent scores. Notice Quiz 1’s lowest score, 28: it looked far away on the dot plot, but it is inside the inner fence (${boxSummary(quiz1).innerFences[0]}), so by the box-plot rule it is **not** an outlier — the long whisker reaches down to it instead.`
        },
        {
          type: 'code',
          runnable: true,
          title: 'The book’s percentile method in Python',
          code: py`
import math

def percentile(values, p):
    data = sorted(values)
    i = p / 100 * len(data)
    if i != int(i):                      # not whole: round up
        return data[math.ceil(i) - 1]
    i = int(i)                           # whole: average positions i and i + 1
    return (data[i - 1] + data[i]) / 2

incomes = ${JSON.stringify(incomes)}
for p in [10, 25, 50, 75, 90]:
    print(p, "th percentile:", percentile(incomes, p))
`,
          output: pcts
            .map(
              (p) =>
                `${p} th percentile: ${percentile(incomes, p) % 1 === 0 && Number.isInteger((p / 100) * incomes.length) ? fixed(percentile(incomes, p), 1) : percentile(incomes, p)}`
            )
            .join('\n')
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Software may give slightly different quartiles',
          body: 'There are several accepted ways to calculate percentiles. pandas and NumPy interpolate between values by default, so they can differ a little from the book’s method on small data sets. With large data sets the methods agree closely.'
        }
      ]
    },
    {
      id: 'correlation',
      eyebrow: 'Chapter 3 · 3.4 Two variables',
      title: 'Covariance, correlation and the least squares line',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            'Chapter 2’s scatter plot showed that study hours and exam scores rise together. Now we measure **how strongly**.',
            '**Sample covariance** s_xy = Σ(x − x̄)(y − ȳ) ÷ (n − 1). Each pair contributes a positive amount when x and y are both above (or both below) their means, and a negative amount otherwise. Positive s_xy → positive relationship; negative → negative. But its size depends on the units, so it is hard to judge.',
            '**Correlation coefficient** r = s_xy ÷ (s_x · s_y). It is always between **−1 and 1**: near +1 a strong positive straight-line relationship, near −1 a strong negative one, near 0 little or no straight-line relationship.',
            '**Least squares line** ŷ = b₀ + b₁x is the straight line that makes the squared vertical distances from the points to the line as small as possible. Slope b₁ = s_xy ÷ s_x², intercept b₀ = ȳ − b₁x̄.'
          ]
        },
        {
          type: 'table',
          columns: ['Quantity', 'Formula', 'Value'],
          rows: [
            ['x̄ (hours)', 'Σx ÷ n', f2(mean(hours))],
            ['ȳ (score)', 'Σy ÷ n', f2(mean(score))],
            ['s_xy', 'Σ(x − x̄)(y − ȳ) ÷ (n − 1)', f2(cov)],
            ['r', 's_xy ÷ (s_x · s_y)', fixed(r, 3)],
            ['b₁ (slope)', 's_xy ÷ s_x²', fixed(b1, 3)],
            ['b₀ (intercept)', 'ȳ − b₁x̄', f2(b0)]
          ]
        },
        {
          type: 'chart',
          title: `Least squares line: ŷ = ${f2(b0)} + ${f2(b1)}x`,
          chart: {
            kind: 'scatter',
            points: hours.map((h, i) => [h, score[i]!]),
            xLabel: 'Hours studied (x)',
            yLabel: 'Exam score (y)',
            trend: true
          },
          caption: `r = ${fixed(r, 3)} — a strong positive straight-line relationship. The slope ${f2(b1)} means each extra hour of study goes with about ${fixed(b1, 1)} more marks on average. For a student who studies 5 hours the line predicts ${f2(b0)} + ${f2(b1)} × 5 = **${fixed(b0 + b1 * 5, 1)}**. (Remember: a relationship is not proof of a cause.)`
        },
        {
          type: 'code',
          runnable: true,
          title: 'Correlation and the least squares line in Python',
          code: py`
import statistics as st

hours = ${JSON.stringify(hours)}
score = ${JSON.stringify(score)}

print("Covariance:", round(st.covariance(hours, score), 2))
print("Correlation r:", round(st.correlation(hours, score), 3))
line = st.linear_regression(hours, score)
print("Slope b1:", round(line.slope, 3), " Intercept b0:", round(line.intercept, 2))
`,
          output: `Covariance: ${round(cov, 2)}\nCorrelation r: ${fixed(r, 3)}\nSlope b1: ${fixed(b1, 3)}  Intercept b0: ${f2(b0)}`
        }
      ]
    },
    {
      id: 'weighted-grouped',
      eyebrow: 'Chapter 3 · 3.5 Weighted means and grouped data',
      title: 'Weighted means and means from grouped data',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'A **weighted mean** gives some values more importance: **Σ(w·x) ÷ Σw**. A course grade is a typical example — the final exam counts more than homework.'
          ]
        },
        {
          type: 'table',
          columns: ['Part', 'Score (x)', 'Weight (w)', 'w × x'],
          rows: [
            ...gradeParts.map((g) => [
              g.part,
              String(g.score),
              `${g.weight}%`,
              String(g.score * g.weight)
            ]),
            ['Total', '', '100%', String(sum(gradeParts.map((g) => g.score * g.weight)))]
          ]
        },
        {
          type: 'chart',
          title: 'Each part’s contribution to the course grade',
          chart: {
            kind: 'bar',
            categories: gradeParts.map((g) => g.part),
            values: gradeParts.map((g) => round((g.score * g.weight) / 100, 2)),
            yLabel: 'Points contributed (w × x ÷ 100)'
          },
          caption: `Course grade = ${sum(gradeParts.map((g) => g.score * g.weight))} ÷ 100 = **${fixed(courseGrade, 1)}**. The plain average of 92, 74 and 81 would be ${fixed(mean(gradeParts.map((g) => g.score)), 1)} — too high, because it treats homework as equal to the final exam.`
        },
        {
          type: 'text',
          body: [
            'Sometimes we only have a **frequency table** (grouped data), not the raw values. Then we pretend every value in a class sits at the class **midpoint** M: mean ≈ **Σ(f·M) ÷ n** and variance ≈ **Σf(M − x̄)² ÷ (n − 1)**.'
          ]
        },
        {
          type: 'table',
          columns: ['Class (min)', 'Midpoint M', 'Frequency f', 'f × M'],
          rows: [
            ...dCounts.map((c, i) => [
              `${dBounds[i]} < ${dBounds[i + 1]}`,
              fixed(dMids[i]!, 1),
              String(c),
              fixed(c * dMids[i]!, 1)
            ]),
            [
              'Total',
              '',
              String(deliveryTimes.length),
              fixed(sum(dMids.map((m, i) => m * dCounts[i]!)), 1)
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Grouped estimate vs the exact mean',
          chart: {
            kind: 'bar',
            categories: ['Mean from grouped data', 'Exact mean of raw data'],
            values: [round(groupedMean, 2), round(dtimeMean, 2)],
            yLabel: 'Minutes',
            yMin: 15
          },
          caption: `The grouped estimate (${f2(groupedMean)} minutes, s ≈ ${f2(Math.sqrt(groupedVar))}) is close to the exact mean (${f2(dtimeMean)}, s = ${f2(dtimeSd)}). Grouping loses a little detail, but often the frequency table is all a report gives us.`
        }
      ]
    },
    {
      id: 'geometric-mean',
      eyebrow: 'Chapter 3 · 3.6 The geometric mean',
      title: 'The geometric mean: averaging rates of change',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'You invest 10,000 THB. Year 1 it gains **50%** (→ 15,000); year 2 it loses **50%** (→ 7,500). The ordinary mean return is (50% − 50%) ÷ 2 = **0%** — yet you lost 2,500 THB!',
            'For rates that compound, use the **geometric mean**: multiply the growth factors (1 + rate), take the n-th root, and subtract 1: **R_g = ((1 + R₁)(1 + R₂)…(1 + Rₙ))^(1/n) − 1**.',
            `Here: (1.5 × 0.5)^(1/2) − 1 = √0.75 − 1 = **${fixed(gm * 100, 2)}%** per year. Check: 10,000 × (1 ${gm < 0 ? '−' : '+'} ${fixed(Math.abs(gm), 4)})² = ${Math.round(10000 * (1 + gm) ** 2).toLocaleString('en-US')} THB ✓.`
          ]
        },
        {
          type: 'table',
          columns: ['Year', 'Return', 'Growth factor', 'Value (THB)'],
          rows: [
            ['Start', '', '', '10,000'],
            ['1', '+50%', '1.5', '15,000'],
            ['2', '−50%', '0.5', '7,500']
          ]
        },
        {
          type: 'chart',
          title: 'Arithmetic mean vs geometric mean',
          chart: {
            kind: 'line',
            x: ['Start', 'Year 1', 'Year 2'],
            series: [
              { name: 'Actual value', values: [10000, 15000, 7500] },
              { name: '“0% a year” (arithmetic mean)', values: [10000, 10000, 10000] },
              {
                name: `${fixed(gm * 100, 1)}% a year (geometric mean)`,
                values: [10000, Math.round(10000 * (1 + gm)), 7500]
              }
            ],
            yLabel: 'Value (THB)'
          },
          caption:
            'Only the geometric mean ends at the true final value of 7,500. Use it for investment returns, population growth and price changes.'
        }
      ]
    },
    {
      id: 'review',
      eyebrow: 'Review',
      title: 'Can you answer these?',
      minutes: 5,
      blocks: [
        {
          type: 'quiz',
          question:
            'House prices in a town are strongly skewed to the right. Which number best describes a typical house?',
          options: ['The mean', 'The median', 'The range', 'The variance'],
          answer: 1,
          explanation:
            'A few very expensive houses pull the mean up; the median is not affected by how extreme they are.'
        },
        {
          type: 'quiz',
          question:
            'Data are bell-shaped with mean 50 and standard deviation 4. About what percent lie between 42 and 58?',
          options: ['68%', '95%', '99.7%', '50%'],
          answer: 1,
          explanation:
            '42 and 58 are 2 standard deviations from 50, so the Empirical Rule gives about 95.44%.'
        },
        {
          type: 'quiz',
          question: 'A value has z = −1.5. What does that mean?',
          options: [
            'It is 1.5 above the mean',
            'It is 1.5 standard deviations below the mean',
            'It is an error',
            'It is the 15th percentile'
          ],
          answer: 1,
          explanation: 'z counts standard deviations from the mean; the minus sign means below.'
        },
        {
          type: 'quiz',
          question: 'r = −0.92 between price and number sold. What does it say?',
          options: [
            'No relationship',
            'A weak positive relationship',
            'A strong negative straight-line relationship',
            'Price causes sales to fall'
          ],
          answer: 2,
          explanation:
            'Close to −1 means strongly negative and nearly straight-line. Correlation alone does not prove a cause.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework: your own numbers',
          body: 'Use the data you collected for Chapter 2. Calculate by hand the mean, median, mode, range, variance and standard deviation; then Q1, Q3, the IQR and the fences, and draw a box plot. Check every number with Python. Finally, write two sentences: one about the centre, one about the spread.'
        }
      ]
    }
  ]
}

export default stats3
