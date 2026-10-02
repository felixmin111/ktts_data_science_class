import type { Lesson } from '@/models/lesson.model'
import {
  boundaries,
  classCount,
  classCounts,
  classLabel,
  classLength,
  crossTab,
  cumulative,
  fixed,
  frequencyTable,
  midpoints,
  round,
  rowPercents
} from '@/functions/stats.function'
import { py } from '../py'
import { grid } from './day02DataStatistics.lesson'
import {
  branch,
  deliveryTimes,
  drinks,
  hours,
  quiz1,
  quiz2,
  satisfaction,
  score
} from './stats/statsData'

// ---- Derived tables (computed, so tables and charts always agree) -------------------------------

export const drinkOrder = ['Tea', 'Coffee', 'Juice', 'Smoothie', 'Water']
export const drinkTable = frequencyTable(drinks, drinkOrder)

export const complaints = [
  ['Late delivery', 78],
  ['Wrong item', 42],
  ['Cold food', 31],
  ['Missing item', 22],
  ['Rude rider', 11],
  ['Damaged package', 9],
  ['Other', 7]
] as const
export const complaintTotal = complaints.reduce((a, [, n]) => a + n, 0)
export const complaintCum = cumulative(complaints.map(([, n]) => (n / complaintTotal) * 100))

export const n = deliveryTimes.length
export const k = classCount(n)
export const minTime = Math.min(...deliveryTimes)
export const maxTime = Math.max(...deliveryTimes)
export const length = classLength(deliveryTimes, k)
export const bounds = boundaries(minTime, length, k)
export const counts = classCounts(deliveryTimes, bounds)
export const cumCounts = cumulative(counts)
export const mids = midpoints(bounds)

export const examBounds = [20, 30, 40, 50, 60, 70, 80, 90, 100]
export const quiz1Pct = classCounts(quiz1, examBounds).map((c) =>
  round((c / quiz1.length) * 100, 1)
)
export const quiz2Pct = classCounts(quiz2, examBounds).map((c) =>
  round((c / quiz2.length) * 100, 1)
)

export const branches = ['Downtown', 'Campus', 'Station']
export const levels = ['High', 'Medium', 'Low']
export const tab = crossTab(branch, satisfaction, branches, levels)
export const tabRow = rowPercents(tab)

export const revenueMonths = ['Jan', 'Feb', 'Mar', 'Apr']
export const revenue = [152, 155, 158, 161]

const pct = (v: number, d = 2) => `${fixed(v, d)}%`
const tens = (v: number) => (Number.isInteger(v) ? String(v) : fixed(v, 1))

// ---- The lesson -------------------------------------------------------------------------------

const day3: Lesson = {
  id: 'ds-3',
  track: 'data-science',
  day: 3,
  title: 'Statistics 2: describing data with tables and graphs',
  summary:
    'Frequency tables, bar, pie and Pareto charts, histograms built step by step, distribution shapes, polygons, ogives, dot plots, stem-and-leaf displays, cross-tabulation, scatter plots — and how graphs can mislead.',
  durationMinutes: 90,
  topics: [
    'Frequency tables',
    'Bar, pie and Pareto charts',
    'Histograms',
    'Shapes of distributions',
    'Polygons and ogives',
    'Dot plots and stem-and-leaf',
    'Cross-tabulation',
    'Scatter plots',
    'Misleading graphs'
  ],
  available: true,
  sections: [
    {
      id: 'describe',
      eyebrow: 'Chapter 2 · Start here',
      title: 'Describing data: from a pile of numbers to a picture',
      minutes: 4,
      blocks: [
        {
          type: 'text',
          body: [
            '**Descriptive statistics** describes the important features of a data set. This chapter uses **tables** and **graphs**; the next one adds numbers such as the mean.',
            'The right table and graph depend on the **type of variable** (Chapter 1): qualitative data are **counted by category**; quantitative data are **grouped into number ranges** (classes) or shown point by point. Two variables together are shown with a **cross-tab** or a **scatter plot**.'
          ]
        },
        {
          type: 'table',
          columns: ['Data', 'Table', 'Graph'],
          rows: [
            [
              'One qualitative variable',
              'Frequency distribution',
              'Bar chart, pie chart, Pareto chart'
            ],
            [
              'One quantitative variable',
              'Frequency distribution with classes',
              'Histogram, polygon, ogive, dot plot, stem-and-leaf'
            ],
            [
              'Two qualitative variables',
              'Cross-tabulation table',
              'Grouped bar chart of row percentages'
            ],
            ['Two quantitative variables', 'Table of pairs (x, y)', 'Scatter plot']
          ]
        },
        {
          type: 'chart',
          title: 'The main graphs of this chapter',
          chart: {
            kind: 'gallery',
            charts: [
              {
                title: 'Bar chart',
                chart: {
                  kind: 'bar',
                  categories: drinkOrder,
                  values: drinkTable.map((r) => r.frequency)
                }
              },
              { title: 'Histogram', chart: { kind: 'histogram', bounds, counts } },
              {
                title: 'Scatter plot',
                chart: { kind: 'scatter', points: hours.map((h, i) => [h, score[i]!]) }
              }
            ]
          }
        }
      ]
    },
    {
      id: 'frequency',
      eyebrow: 'Chapter 2 · 2.1 Qualitative data',
      title: 'Frequency distributions and bar charts',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'A café wrote down the drink ordered by each of its last **40 customers**. As a raw list (below) it is hard to see anything.',
            'A **frequency distribution** is a table that counts how many items fall in each **class** (category). The classes must not overlap, and every item belongs to exactly one class.'
          ]
        },
        {
          type: 'table',
          columns: ['Order', 'Order', 'Order', 'Order', 'Order', 'Order', 'Order', 'Order'],
          rows: grid(drinks, 8)
        },
        {
          type: 'text',
          body: [
            'Count each drink, then compute two more columns for each class. With **n** = the total number of items:',
            '**Relative frequency** = frequency ÷ n (the fraction of all items). **Percent frequency** = relative frequency × 100. The relative frequencies always add up to **1**, and the percent frequencies to **100%**.'
          ]
        },
        {
          type: 'table',
          columns: ['Drink', 'Frequency', 'Relative frequency', 'Percent frequency'],
          rows: [
            ...drinkTable.map((r) => [
              r.category,
              String(r.frequency),
              `${r.frequency}/${drinks.length} = ${fixed(r.relative, 3)}`,
              pct(r.percent, 1)
            ]),
            ['Total', String(drinks.length), '1.000', '100%']
          ]
        },
        {
          type: 'chart',
          title: 'Bar charts of the drink orders',
          chart: {
            kind: 'gallery',
            charts: [
              {
                title: 'Frequency bar chart',
                chart: {
                  kind: 'bar',
                  categories: drinkOrder,
                  values: drinkTable.map((r) => r.frequency),
                  yLabel: 'Number of orders'
                }
              },
              {
                title: 'Percent bar chart',
                chart: {
                  kind: 'bar',
                  categories: drinkOrder,
                  values: drinkTable.map((r) => round(r.percent, 1)),
                  yLabel: 'Percent of orders',
                  percent: true
                }
              }
            ]
          },
          caption:
            'A **bar chart** draws one bar per class; its height is the frequency (or the percent). The two charts have the same shape — only the axis changes. The bars have **gaps** between them because the classes are separate groups. **Reading:** tea is the most popular drink (35%), water the least (7.5%).'
        },
        {
          type: 'code',
          runnable: true,
          title: 'The frequency distribution in Python',
          code: py`
import pandas as pd

orders = pd.Series(${JSON.stringify(drinks)})

table = pd.DataFrame({
    "frequency": orders.value_counts(),
    "relative": orders.value_counts(normalize=True).round(3),
})
table["percent"] = table["relative"] * 100
print(table)
print("Total:", table["frequency"].sum())
`
        }
      ]
    },
    {
      id: 'pie',
      eyebrow: 'Chapter 2 · 2.1 Qualitative data',
      title: 'Pie charts',
      minutes: 5,
      blocks: [
        {
          type: 'text',
          body: [
            'A **pie chart** shows each class as a slice of a circle. The whole circle (360°) is the whole data set, so each slice gets **relative frequency × 360°**.',
            'For tea: 0.350 × 360° = **126°**. For water: 0.075 × 360° = **27°**.'
          ]
        },
        {
          type: 'table',
          columns: ['Drink', 'Relative frequency', 'Slice angle'],
          rows: [
            ...drinkTable.map((r) => [
              r.category,
              fixed(r.relative, 3),
              `${fixed(r.relative, 3)} × 360° = ${round(r.relative * 360, 0)}°`
            ]),
            ['Total', '1.000', '360°']
          ]
        },
        {
          type: 'chart',
          title: 'Pie chart of the drink orders',
          chart: {
            kind: 'pie',
            categories: drinkOrder,
            values: drinkTable.map((r) => r.frequency)
          },
          caption:
            'A pie chart is best for showing **parts of one whole** with only a few classes. To compare classes with each other, a bar chart is easier to read, because eyes judge lengths better than angles.'
        }
      ]
    },
    {
      id: 'pareto',
      eyebrow: 'Chapter 2 · 2.1 Qualitative data',
      title: 'Pareto charts: find the few big problems',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'The **Pareto principle**: a **few** types of problem usually cause **most** of the trouble. A **Pareto chart** helps a business decide which problem to fix first.',
            '**How to build one:** ① count each problem type ② sort the rows from the **largest** count to the smallest, with “Other” always last ③ compute each percent ④ compute the **cumulative percent**: each row’s percent plus all the rows above it ⑤ draw the bars in that order and draw the cumulative percent as a line.',
            '“Other” should be small (less than the biggest class). Classes of about 5% or less are often merged into “Other”.'
          ]
        },
        {
          type: 'table',
          columns: ['Complaint (200 in one month)', 'Frequency', 'Percent', 'Cumulative percent'],
          rows: [
            ...complaints.map(([name, count], i) => [
              name,
              String(count),
              pct((count / complaintTotal) * 100, 1),
              pct(complaintCum[i]!, 1)
            ]),
            ['Total', String(complaintTotal), '100%', '']
          ]
        },
        {
          type: 'chart',
          title: 'Pareto chart of delivery complaints',
          chart: {
            kind: 'pareto',
            categories: complaints.map(([name]) => name),
            values: complaints.map(([, count]) => count)
          },
          caption: `The line shows that the first three problems — late delivery, wrong item and cold food — make up **${fixed(complaintCum[2]!, 1)}%** of all complaints. Fixing these three first gives the biggest improvement for the effort.`
        }
      ]
    },
    {
      id: 'histogram',
      eyebrow: 'Chapter 2 · 2.2 Quantitative data',
      title: 'Building a histogram in five steps',
      minutes: 14,
      blocks: [
        {
          type: 'text',
          body: [
            'A food-delivery company timed **50 deliveries** (minutes from order to door). Its promise is “under 40 minutes”. We will summarise the times with a frequency distribution of **classes** (number ranges) and draw a **histogram**.'
          ]
        },
        {
          type: 'table',
          columns: ['min', 'min', 'min', 'min', 'min', 'min', 'min', 'min', 'min', 'min'],
          rows: grid(deliveryTimes, 10)
        },
        {
          type: 'text',
          body: [
            `**Step 1 — number of classes K.** Use the **2^K rule**: K is the smallest whole number with 2^K **greater than** n. Here n = ${n}: 2^5 = 32 is not more than ${n}, but 2^6 = 64 is, so **K = ${k}**.`,
            `**Step 2 — class length.** (largest − smallest) ÷ K = (${maxTime} − ${minTime}) ÷ ${k} = ${round((maxTime - minTime) / k, 4)}. Round **up** to the precision of the data (whole minutes): **length = ${length}**.`,
            `**Step 3 — class boundaries.** Start at the smallest value and keep adding the length: ${bounds.join(', ')}. This gives ${k} classes that do not overlap. “12 < 17” means **12 or more, but less than 17**.`,
            '**Step 4 — tally and count** how many values fall in each class (press the button below to watch it happen).',
            '**Step 5 — draw the histogram:** one rectangle per class, as wide as the class and as tall as its frequency. The bars **touch**, because the classes cover one continuous number line.'
          ]
        },
        {
          type: 'table',
          columns: ['Size of data set n', 'Number of classes K'],
          rows: [
            ['16 to 31', '5'],
            ['32 to 63', '6'],
            ['64 to 127', '7'],
            ['128 to 255', '8'],
            ['256 to 511', '9']
          ]
        },
        {
          type: 'chart',
          title: 'Step 4 and 5: watch the histogram build itself',
          chart: {
            kind: 'histogram',
            data: deliveryTimes,
            bounds,
            animate: true,
            xLabel: 'Delivery time (minutes)',
            yLabel: 'Frequency'
          },
          caption:
            'Each value lights up in orange, gets a tally mark in its class, and its bar grows by one. When all 50 are placed, the counts add up to 50.'
        },
        {
          type: 'table',
          columns: [
            'Class (minutes)',
            'Midpoint',
            'Frequency',
            'Relative frequency',
            'Percent frequency'
          ],
          rows: [
            ...counts.map((c, i) => [
              classLabel(bounds[i]!, bounds[i + 1]!),
              tens(mids[i]!),
              String(c),
              `${c}/${n} = ${fixed(c / n, 2)}`,
              pct((c / n) * 100, 0)
            ]),
            ['Total', '', String(n), '1.00', '100%']
          ]
        },
        {
          type: 'chart',
          title: 'Percent frequency histogram',
          chart: {
            kind: 'histogram',
            bounds,
            counts,
            percent: true,
            xLabel: 'Delivery time (minutes)',
            yLabel: 'Percent of deliveries'
          },
          caption: `**What the table and histogram tell us:** most deliveries take 17 to 27 minutes (${counts[1]! + counts[2]!} of ${n}, ${round(((counts[1]! + counts[2]!) / n) * 100, 0)}%); the class 17 < 22 is the most common; and only ${counts.at(-1)} deliveries took 37 minutes or more. Every delivery was under 42 minutes — but one (${maxTime} minutes) broke the 40-minute promise. The raw list could not tell us any of this at a glance.`
        },
        {
          type: 'code',
          runnable: true,
          title: 'Classes, counts and the histogram in Python',
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

times = ${JSON.stringify(deliveryTimes)}
bounds = ${JSON.stringify(bounds)}

classes = pd.cut(times, bins=bounds, right=False)   # right=False: "12 < 17"
table = pd.Series(classes).value_counts(sort=False)
print(table)

plt.hist(times, bins=bounds, edgecolor="white")
plt.xlabel("Delivery time (minutes)")
plt.ylabel("Frequency")
plt.show()
`
        }
      ]
    },
    {
      id: 'shapes',
      eyebrow: 'Chapter 2 · 2.2 Quantitative data',
      title: 'The shape of a distribution',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          body: [
            'The outline of a histogram is the **shape of the distribution**. Four shapes appear again and again:',
            '**Symmetric (mound shaped):** the left and right sides are mirror images. **Skewed to the right:** a long tail on the right — a few values are much bigger than the rest. **Skewed to the left:** a long tail on the left — a few values are much smaller. **Two peaks:** often two different groups mixed together.'
          ]
        },
        {
          type: 'chart',
          title: 'Four common shapes',
          chart: {
            kind: 'gallery',
            charts: [
              {
                title: 'Symmetric',
                chart: {
                  kind: 'histogram',
                  bounds: [0, 1, 2, 3, 4, 5, 6, 7],
                  counts: [2, 5, 10, 14, 10, 5, 2]
                }
              },
              {
                title: 'Skewed to the right',
                chart: {
                  kind: 'histogram',
                  bounds: [0, 1, 2, 3, 4, 5, 6, 7],
                  counts: [5, 14, 11, 7, 4, 2, 1]
                }
              },
              {
                title: 'Skewed to the left',
                chart: {
                  kind: 'histogram',
                  bounds: [0, 1, 2, 3, 4, 5, 6, 7],
                  counts: [1, 2, 4, 7, 11, 14, 5]
                }
              },
              {
                title: 'Two peaks',
                chart: {
                  kind: 'histogram',
                  bounds: [0, 1, 2, 3, 4, 5, 6, 7],
                  counts: [3, 11, 6, 3, 7, 12, 4]
                }
              }
            ]
          }
        },
        {
          type: 'table',
          columns: ['Shape', 'What it looks like', 'Typical real example'],
          rows: [
            [
              'Symmetric',
              'Mirror image, highest in the middle',
              'Heights of adults; fill volumes of a machine'
            ],
            ['Skewed right', 'Long tail to the right', 'Incomes; delivery times (a few very late)'],
            [
              'Skewed left',
              'Long tail to the left',
              'An easy exam: most score high, a few very low'
            ],
            ['Two peaks', 'Two humps', 'Two groups mixed: students who practise and who do not']
          ]
        },
        {
          type: 'quiz',
          question:
            'Our delivery-time histogram has most values on the left and a long tail to the right. What is its shape?',
          options: ['Symmetric', 'Skewed to the right', 'Skewed to the left', 'Two peaks'],
          answer: 1,
          explanation:
            'The tail points to the right: a few deliveries took much longer than most. That is skewed to the right.'
        }
      ]
    },
    {
      id: 'polygon',
      eyebrow: 'Chapter 2 · 2.2 Quantitative data',
      title: 'Frequency polygons: comparing two distributions',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'A **frequency polygon** plots one point above each **class midpoint**, at the height of the class frequency (or percent), and joins the points with lines. Because it is just a line, we can draw **two distributions on one graph** and compare them.',
            'A teacher grouped the scores of the same 40 students on Quiz 1 and on Quiz 2 into 10-point classes. Between the quizzes the class started **weekly practice sessions**. Percents are used so that groups of different sizes could also be compared.'
          ]
        },
        {
          type: 'table',
          columns: ['Class', 'Midpoint', 'Quiz 1 (%)', 'Quiz 2 (%)'],
          rows: examBounds
            .slice(0, -1)
            .map((b, i) => [
              classLabel(b, examBounds[i + 1]!),
              String(b + 5),
              pct(quiz1Pct[i]!, 1),
              pct(quiz2Pct[i]!, 1)
            ])
        },
        {
          type: 'chart',
          title: 'Percent frequency polygons for Quiz 1 and Quiz 2',
          chart: {
            kind: 'line',
            x: examBounds.slice(0, -1).map((b) => b + 5),
            series: [
              { name: 'Quiz 1', values: quiz1Pct },
              { name: 'Quiz 2', values: quiz2Pct }
            ],
            xLabel: 'Score (class midpoint)',
            yLabel: 'Percent of students',
            percent: true
          },
          caption:
            'Quiz 1 has **two peaks** (the 60s and the 90s): two groups of students. Quiz 2 has **one peak** in the 80s — the low group moved up after practice. One graph shows the whole story.'
        }
      ]
    },
    {
      id: 'ogive',
      eyebrow: 'Chapter 2 · 2.2 Quantitative data',
      title: 'Cumulative distributions and ogives',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'A **cumulative frequency** counts the values **less than the upper boundary** of each class: add the class frequency to all the frequencies above it. Divide by n for the **cumulative relative frequency**, and multiply by 100 for the **cumulative percent**.',
            'An **ogive** (say “oh-jive”) plots each cumulative value above the **upper boundary** of its class, starting from 0 at the lowest boundary, and joins the points. It answers questions like “what share took less than 27 minutes?”.'
          ]
        },
        {
          type: 'table',
          columns: ['Class', 'Frequency', 'Cumulative frequency', 'Cumulative percent'],
          rows: counts.map((c, i) => [
            classLabel(bounds[i]!, bounds[i + 1]!),
            String(c),
            i === 0 ? String(cumCounts[0]) : `${cumCounts[i - 1]} + ${c} = ${cumCounts[i]}`,
            pct((cumCounts[i]! / n) * 100, 0)
          ])
        },
        {
          type: 'chart',
          title: 'Percent ogive of the delivery times',
          chart: {
            kind: 'line',
            x: bounds,
            series: [
              {
                name: 'Cumulative %',
                values: [0, ...cumCounts.map((c) => round((c / n) * 100, 1))]
              }
            ],
            xLabel: 'Delivery time (upper class boundary, minutes)',
            yLabel: 'Cumulative percent',
            yMin: 0,
            yMax: 100,
            percent: true
          },
          caption: `**Reading the ogive:** go up from 27 minutes to the line, then across: **${round((cumCounts[2]! / n) * 100, 0)}%** of deliveries took less than 27 minutes. The line always ends at 100%, because every value is below the last boundary.`
        }
      ]
    },
    {
      id: 'dot-plot',
      eyebrow: 'Chapter 2 · 2.3 Dot plots',
      title: 'Dot plots and outliers',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          body: [
            'A **dot plot** draws a number line covering the data and places **one dot per value** above it; equal values stack up. It suits small data sets because you can see **every** value.',
            'An **outlier** is a value that is unusually large or small and stands apart from the rest. First ask **why**: if it is a mistake in measuring or typing, correct it (or remove it if it cannot be corrected). If it is real, it may be the most important point in the data.'
          ]
        },
        {
          type: 'table',
          columns: [
            'Score',
            'Score',
            'Score',
            'Score',
            'Score',
            'Score',
            'Score',
            'Score',
            'Score',
            'Score'
          ],
          rows: grid(quiz1, 10)
        },
        {
          type: 'chart',
          title: 'Dot plot of Quiz 1 (outlier in orange)',
          chart: {
            kind: 'dot',
            data: quiz1,
            xLabel: 'Quiz 1 score',
            highlight: [Math.min(...quiz1)]
          },
          caption: `The dots form two clusters (60s and 80s–90s), as the polygon showed. The score **${Math.min(...quiz1)}** sits far from everyone else: an outlier. It was not a typing error — that student had missed most classes, so the teacher arranged extra help.`
        }
      ]
    },
    {
      id: 'stem-leaf',
      eyebrow: 'Chapter 2 · 2.4 Stem-and-leaf displays',
      title: 'Stem-and-leaf displays',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'A **stem-and-leaf display** sorts the data **and** shows its shape, while keeping every value. Split each value into a **stem** (the leading digits) and a **leaf** (the last digit): 24 minutes → stem **2**, leaf **4**.',
            '**How to build one:** ① choose the stems (usually 5 to 20 rows) and write them in a column, smallest at the top ② draw a vertical line ③ write each value’s leaf on its stem’s row ④ sort the leaves in each row from smallest to largest.',
            'Turned on its side, the display looks like a histogram. If it is too squashed, **split the stems**: use each stem twice — leaves 0–4 on the first row, 5–9 on the second.'
          ]
        },
        {
          type: 'table',
          columns: ['Value', 'Stem', 'Leaf', 'Written as'],
          rows: [
            ['12', '1', '2', '1 | 2'],
            ['24', '2', '4', '2 | 4'],
            ['37', '3', '7', '3 | 7'],
            ['41', '4', '1', '4 | 1']
          ]
        },
        {
          type: 'chart',
          title: 'Stem-and-leaf display of the 50 delivery times',
          chart: { kind: 'stemLeaf', data: deliveryTimes, leafUnit: 1 },
          caption:
            'Row “2” holds every time from 20 to 29: it is the longest row, so most deliveries took 20-something minutes. The longer rows at the top and the short rows at the bottom show the same right skew as the histogram.'
        },
        {
          type: 'chart',
          title: 'The same data with split stems',
          chart: { kind: 'stemLeaf', data: deliveryTimes, leafUnit: 1, split: true },
          caption:
            'Splitting each stem into two rows (0–4 and 5–9) stretches the display and shows the shape in more detail.'
        },
        {
          type: 'chart',
          title: 'Back-to-back display: Quiz 1 (left) and Quiz 2 (right)',
          chart: {
            kind: 'stemLeaf',
            data: quiz2,
            compare: quiz1,
            leafUnit: 1,
            labels: ['Quiz 2', 'Quiz 1']
          },
          caption:
            'Both quizzes share one column of stems. Quiz 1’s leaves (left) bunch in the 60s and the 90s; Quiz 2’s leaves (right) bunch in the 70s to 90s. The outlier 28 has no partner on the right.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'A stem-and-leaf display in Python',
          code: py`
times = ${JSON.stringify(deliveryTimes)}

stems = {}
for t in sorted(times):
    stems.setdefault(t // 10, []).append(t % 10)

for stem, leaves in stems.items():
    print(stem, "|", "".join(str(leaf) for leaf in leaves))
`
        }
      ]
    },
    {
      id: 'cross-tab',
      eyebrow: 'Chapter 2 · 2.5 Cross-tabulation',
      title: 'Cross-tabulation: two qualitative variables',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'A café chain asked **90 customers** at three branches how satisfied they were (High, Medium, Low). Does satisfaction **depend on the branch**?',
            'A **cross-tabulation table** classifies the data on two dimensions: rows for one variable (branch), columns for the other (satisfaction). Each customer goes into exactly one **cell**. Adding across a row gives the **row total**; adding down a column gives the **column total**.'
          ]
        },
        {
          type: 'table',
          columns: ['Branch', ...levels, 'Total'],
          rows: [
            ...tab.rows.map((r, i) => [r, ...tab.counts[i]!.map(String), String(tab.rowTotals[i])]),
            ['Total', ...tab.columnTotals.map(String), String(tab.total)]
          ]
        },
        {
          type: 'text',
          body: [
            'Counts are hard to compare when groups have different sizes, so we compute **row percentages**: each cell ÷ its row total × 100. Each row then becomes a percent frequency distribution of satisfaction **for that branch**.',
            `For example, Downtown–High = ${tab.counts[0]![0]} ÷ ${tab.rowTotals[0]} × 100 = **${fixed(tabRow[0]![0]!, 1)}%**.`
          ]
        },
        {
          type: 'table',
          columns: ['Branch', 'High', 'Medium', 'Low', 'Total'],
          rows: tab.rows.map((r, i) => [r, ...tabRow[i]!.map((v) => pct(v, 1)), '100%'])
        },
        {
          type: 'chart',
          title: 'Row percentages for each branch',
          chart: {
            kind: 'groupedBar',
            categories: branches,
            series: levels.map((level, li) => ({
              name: level,
              values: tabRow.map((row) => round(row[li]!, 1))
            })),
            yLabel: 'Percent of the branch’s customers',
            percent: true
          },
          caption:
            '**Campus** and **Downtown** customers are mostly highly satisfied, but at **Station** only a small share are — most say medium or low. So satisfaction does depend on the branch, and the chain should find out what is different at Station.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'pd.crosstab does the counting',
          code: py`
import pandas as pd

branch = ${JSON.stringify(branch)}
satisfaction = ${JSON.stringify(satisfaction)}

order = ["High", "Medium", "Low"]
names = dict(rownames=["Branch"], colnames=["Satisfaction"])

counts = pd.crosstab(branch, satisfaction, margins=True, **names)
print(counts[order + ["All"]])
print()
row_pct = pd.crosstab(branch, satisfaction, normalize="index", **names) * 100
print(row_pct[order].round(1))
`
        }
      ]
    },
    {
      id: 'scatter',
      eyebrow: 'Chapter 2 · 2.6 Scatter plots',
      title: 'Scatter plots: two quantitative variables',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'A **scatter plot** shows the relationship between two quantitative variables. Put one variable (**x**) on the horizontal axis and the other (**y**) on the vertical axis, and plot one point per element at (x, y).',
            'If the points rise from left to right, the relationship is **positive**; if they fall, it is **negative**; if they make a shapeless cloud, there is **little or no** straight-line relationship. When the points lie roughly along a line, we draw that line to summarise the trend.'
          ]
        },
        {
          type: 'table',
          columns: ['Student', 'Hours studied (x)', 'Exam score (y)'],
          rows: hours.map((h, i) => [String(i + 1), String(h), String(score[i])])
        },
        {
          type: 'chart',
          title: 'Exam score against hours studied',
          chart: {
            kind: 'scatter',
            points: hours.map((h, i) => [h, score[i]!]),
            xLabel: 'Hours studied (x)',
            yLabel: 'Exam score (y)',
            trend: true
          },
          caption:
            'For student 1, plot the point at x = 1 and y = 52, and so on. The points rise from left to right: students who studied more tended to score higher — a **positive, roughly straight-line** relationship. The dashed line summarises it; Chapter 3 shows how to calculate it.'
        },
        {
          type: 'chart',
          title: 'Three kinds of relationship',
          chart: {
            kind: 'gallery',
            charts: [
              {
                title: 'Positive',
                chart: {
                  kind: 'scatter',
                  points: [
                    [1, 2],
                    [2, 3],
                    [3, 3.5],
                    [4, 5],
                    [5, 5.4],
                    [6, 7],
                    [7, 7.2],
                    [8, 9]
                  ],
                  trend: true
                }
              },
              {
                title: 'Little or none',
                chart: {
                  kind: 'scatter',
                  points: [
                    [1, 5],
                    [2, 2],
                    [3, 8],
                    [4, 4],
                    [5, 7],
                    [6, 3],
                    [7, 6],
                    [8, 4.5]
                  ]
                }
              },
              {
                title: 'Negative',
                chart: {
                  kind: 'scatter',
                  points: [
                    [1, 9],
                    [2, 8],
                    [3, 7.5],
                    [4, 6],
                    [5, 5.5],
                    [6, 4],
                    [7, 3.2],
                    [8, 2]
                  ],
                  trend: true
                }
              }
            ]
          }
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'A relationship is not proof of a cause',
          body: 'The scatter plot shows that hours and scores move together. It does not prove that studying caused the higher scores — keen students might both study more and sleep better. Remember experiments from Chapter 1.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'A scatter plot in Python',
          code: py`
import matplotlib.pyplot as plt

hours = ${JSON.stringify(hours)}
score = ${JSON.stringify(score)}

plt.scatter(hours, score)
plt.xlabel("Hours studied")
plt.ylabel("Exam score")
plt.show()
`
        }
      ]
    },
    {
      id: 'misleading',
      eyebrow: 'Chapter 2 · 2.7 Misleading graphs',
      title: 'How graphs can mislead',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'A graph should show the truth. But the same data can be drawn to look dramatic or dull. Learn the tricks so they do not fool you.',
            'A café’s monthly revenue grew from 152 to 161 thousand THB over four months — about **6%** in total. Look at what the starting point of the vertical axis does:'
          ]
        },
        {
          type: 'table',
          columns: ['Month', ...revenueMonths],
          rows: [['Revenue (thousand THB)', ...revenue.map(String)]]
        },
        {
          type: 'chart',
          title: 'Same data, two impressions',
          chart: {
            kind: 'gallery',
            charts: [
              {
                title: 'Axis starts at 150: “Huge growth!”',
                chart: { kind: 'bar', categories: revenueMonths, values: revenue, yMin: 150 }
              },
              {
                title: 'Axis starts at 0: steady, small growth',
                chart: { kind: 'bar', categories: revenueMonths, values: revenue }
              }
            ]
          },
          caption:
            'On the left, April’s bar looks about **four times** as tall as January’s, because the axis starts at 150. On the right, with the axis starting at 0, the bars look almost equal — which is the truth: 161 is only 6% more than 152.'
        },
        {
          type: 'table',
          columns: ['Trick', 'Effect', 'What to check'],
          rows: [
            [
              'Vertical axis does not start at 0',
              'Small changes look huge',
              'Read the numbers on the axis'
            ],
            [
              'Stretched or squashed axis',
              'Trends look steep or flat',
              'Compare the actual values'
            ],
            [
              'Bars of different widths',
              'Eyes compare areas, not heights',
              'Bars should have equal width'
            ],
            [
              'A one-sided caption',
              '“Highest ever!” vs “Still under target”',
              'Make your own conclusion from the data'
            ]
          ]
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
            'A class of 40 has 10 students in the class 70 < 80. What is its relative frequency?',
          options: ['10', '0.25', '25', '0.10'],
          answer: 1,
          explanation:
            'Relative frequency = frequency ÷ n = 10 ÷ 40 = 0.25 (or 25% as a percent frequency).'
        },
        {
          type: 'quiz',
          question: 'Using the 2^K rule, how many classes should a histogram of 100 values have?',
          options: ['6', '7', '10', '100'],
          answer: 1,
          explanation: '2^6 = 64 is not more than 100, but 2^7 = 128 is. So K = 7.'
        },
        {
          type: 'quiz',
          question:
            'Which graph should you use to compare satisfaction (High / Medium / Low) between three shops?',
          options: [
            'A scatter plot',
            'An ogive',
            'A cross-tab with a bar chart of row percentages',
            'A stem-and-leaf display'
          ],
          answer: 2,
          explanation:
            'Shop and satisfaction are both qualitative, so cross-tabulate them and compare row percentages.'
        },
        {
          type: 'quiz',
          question: 'Why do histogram bars touch, but bar chart bars have gaps?',
          options: [
            'Just style; it makes no difference',
            'Histogram classes cover one continuous number line; bar chart classes are separate groups',
            'Histograms always have more data',
            'Bar charts are only for percentages'
          ],
          answer: 1,
          explanation:
            'A quantitative variable can take any value between the classes, so the bars meet. Categories are separate, so they are drawn apart.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework: describe your own data',
          body: 'Time yourself every day for two weeks on something you repeat (getting to school, a phone game, cooking). ① Build a frequency distribution with the 2^K rule ② draw a histogram and describe its shape ③ draw a stem-and-leaf display ④ write two sentences that a friend could understand without seeing your graph.'
        }
      ]
    }
  ]
}

export default day3
