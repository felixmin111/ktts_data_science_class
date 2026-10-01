import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day2: Lesson = {
  id: 'ds-2',
  track: 'data-science',
  day: 2,
  title: 'Data and statistics: the theory',
  summary:
    'Kinds of data, samples vs populations, centre, spread, percentiles and distributions — each with a real-world example and a live demo.',
  durationMinutes: 60,
  topics: [
    'Data types',
    'Sampling',
    'Mean / median / mode',
    'Standard deviation',
    'Percentiles',
    'Distributions'
  ],
  available: true,
  sections: [
    {
      id: 'structured',
      eyebrow: 'Theory',
      title: 'Structured vs unstructured data',
      minutes: 5,
      blocks: [
        {
          type: 'table',
          columns: ['', 'Structured', 'Unstructured'],
          rows: [
            ['Shape', 'Rows and columns, a fixed schema', 'No fixed shape'],
            [
              'Examples',
              'Bank transactions, sales tills, exam marks',
              'Customer reviews, photos, X-rays, voice calls'
            ],
            ['Tools', 'SQL, Excel, pandas', 'Text analytics, computer vision, speech models'],
            ['Share of the world’s data', 'The smaller part', 'Most of it']
          ]
        },
        {
          type: 'analogy',
          title: 'A filing cabinet vs a shoebox',
          body: 'Structured data is a filing cabinet: every folder labelled, every form the same. Unstructured data is a shoebox of letters and photos — full of information, but you must read each one to get it out.'
        }
      ]
    },
    {
      id: 'variable-types',
      eyebrow: 'Theory',
      title: 'Four kinds of variables',
      minutes: 8,
      blocks: [
        {
          type: 'table',
          columns: ['Kind', 'Meaning', 'Café example', 'You can…'],
          rows: [
            [
              'Categorical · nominal',
              'Names, no order',
              'branch, payment method',
              'count, find the mode'
            ],
            [
              'Categorical · ordinal',
              'Categories with an order',
              'cup size S/M/L, rating 1–5',
              'sort, find the median'
            ],
            [
              'Numerical · discrete',
              'Counts, whole numbers',
              'quantity, number of visits',
              'add, average'
            ],
            [
              'Numerical · continuous',
              'Measurements, any value',
              'temperature, waiting time',
              'add, average, measure spread'
            ]
          ]
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Why it matters',
          body: 'The kind of variable decides which statistics and charts make sense. “The average branch” is nonsense; “the average rating” of 1–5 stars is common but debatable, because the gap between 1★ and 2★ may not equal the gap between 4★ and 5★.'
        },
        {
          type: 'quiz',
          question:
            'A survey asks “How satisfied are you? (Very unhappy … Very happy)”. Which kind?',
          options: ['Nominal', 'Ordinal', 'Discrete', 'Continuous'],
          answer: 1,
          explanation: 'Categories with a natural order — ordinal.'
        }
      ]
    },
    {
      id: 'sampling',
      eyebrow: 'Theory',
      title: 'Population vs sample',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'The **population** is everyone you care about (all customers, all voters). Usually you can only measure a **sample** — a subset — and use it to estimate the population. Statistics is largely the science of how far you can trust that estimate.'
          ]
        },
        {
          type: 'analogy',
          title: 'Tasting soup',
          body: 'You don’t drink the whole pot to check the salt — one spoonful is enough, IF you stir first. Stirring is random sampling: every part of the pot has the same chance of reaching the spoon. Skim only the top and you taste only the oil.'
        },
        {
          type: 'case',
          domain: 'Elections',
          title: 'Opinion polls',
          problem: 'Predict how millions of people will vote, before the election.',
          data: 'Answers from roughly 1,000–2,000 carefully selected people.',
          method: 'Random (or weighted) sampling so the sample looks like the population.',
          outcome:
            'An estimate with a margin of error, e.g. “52% ± 3%”. Bad sampling breaks it — see Day 3.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Estimate the population average from samples',
          code: py`
import numpy as np

rng = np.random.default_rng(1)
population = rng.normal(loc=165, scale=8, size=100_000)   # heights of 100,000 people (cm)
print(f"true population mean: {population.mean():.2f} cm")

for n in [10, 100, 1000]:
    sample = rng.choice(population, size=n, replace=False)
    print(f"sample of {n:>4}: mean {sample.mean():.2f} cm")
`
        }
      ]
    },
    {
      id: 'centre',
      eyebrow: 'Statistics',
      title: 'The centre: mean, median and mode',
      minutes: 9,
      blocks: [
        {
          type: 'table',
          columns: ['Measure', 'How', 'Strength', 'Weakness'],
          rows: [
            [
              'Mean',
              'Add everything, divide by the count',
              'Uses every value',
              'Pulled by extreme values'
            ],
            [
              'Median',
              'Sort, take the middle value',
              'Ignores extremes',
              'Ignores how big the extremes are'
            ],
            [
              'Mode',
              'The most common value',
              'Works for categories',
              'There may be several, or none'
            ]
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'One manager changes the “average salary”',
          code: py`
import numpy as np
from statistics import mode

staff = np.array([9000, 9500, 10000, 10000, 10500, 11000, 11000, 11000, 12000])   # THB / month
print("staff only  -> mean", staff.mean(), "| median", np.median(staff), "| mode", mode(staff))

everyone = np.append(staff, 150_000)        # add the owner
print("with owner  -> mean", everyone.mean(), "| median", np.median(everyone))
`
        },
        {
          type: 'case',
          domain: 'Government statistics',
          title: 'Why income is reported as a median',
          problem:
            'A few very rich people make the mean income look much higher than what a typical family earns.',
          data: 'Household income surveys.',
          method:
            'Statistics offices usually publish median household income alongside (or instead of) the mean.',
          outcome:
            'The headline number describes a typical household, not one inflated by billionaires.'
        },
        {
          type: 'analogy',
          title: 'A see-saw',
          body: 'The mean is the balance point of a see-saw: one heavy person far out on one side tips it a long way. The median is the person standing in the middle of the queue — it doesn’t care how heavy the people at the ends are.'
        }
      ]
    },
    {
      id: 'spread',
      eyebrow: 'Statistics',
      title: 'The spread: range, variance, standard deviation',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'Two datasets can share the same mean and still be completely different. **Spread** measures how far values typically are from the centre.',
            '**Variance** = the average of the squared distances from the mean. **Standard deviation (std)** = its square root, back in the original units — “the typical distance from the mean”.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Two coffee machines, both average 250 ml',
          code: py`
import numpy as np

machine_a = np.array([249, 251, 250, 248, 252, 250, 251, 249])
machine_b = np.array([235, 265, 250, 240, 262, 238, 260, 250])

for name, cups in [("A", machine_a), ("B", machine_b)]:
    print(f"Machine {name}: mean {cups.mean():.1f} ml | range {cups.min()}-{cups.max()} "
          f"| std {cups.std():.1f} ml")

distances = machine_b - machine_b.mean()
print("B: average squared distance =", (distances ** 2).mean(), "-> variance", machine_b.var())
`
        },
        {
          type: 'analogy',
          title: 'Archery',
          body: 'Two archers both average the centre of the target. One puts every arrow close together; the other scatters them all over the board. Same mean, very different standard deviation — and you would only hire the first one.'
        },
        {
          type: 'case',
          domain: 'Manufacturing',
          title: 'Quality control',
          problem:
            'Every bottle must contain at least the labelled volume, without wasting product.',
          data: 'Fill volume of a sample of bottles every hour.',
          method: 'Track the mean AND standard deviation; alarm when either drifts.',
          outcome:
            'A machine with a small std can be set closer to the label — saving product on millions of bottles.'
        }
      ]
    },
    {
      id: 'percentiles',
      eyebrow: 'Statistics',
      title: 'Percentiles, quartiles and outliers',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            'The **p-th percentile** is the value below which p% of the data falls. The quartiles Q1, Q2 (the median) and Q3 are the 25th, 50th and 75th percentiles. **IQR = Q3 − Q1** is the spread of the middle half. A common rule flags values more than 1.5 × IQR outside the box as **outliers**.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

orders = pd.Series([1, 2, 1, 3, 2, 1, 2, 4, 1, 2, 3, 1, 2, 18])   # cups per order
q1, q3 = orders.quantile(0.25), orders.quantile(0.75)
iqr = q3 - q1
upper = q3 + 1.5 * iqr
print(f"Q1={q1}, median={orders.median()}, Q3={q3}, IQR={iqr}, outlier above {upper}")
print("outliers:", orders[orders > upper].tolist())

fig, ax = plt.subplots(figsize=(7, 2))
ax.boxplot(orders, vert=False)
ax.set_title("One order of 18 cups stands out")
ax.set_xlabel("Cups per order")
ax.set_yticks([])
plt.show()
`
        },
        {
          type: 'case',
          domain: 'Healthcare',
          title: 'Children’s growth charts',
          problem: 'Is this baby growing normally?',
          data: 'Weights and heights of many healthy children at each age.',
          method:
            'Percentile curves: a baby on the 75th percentile is heavier than 75% of babies that age.',
          outcome:
            'Doctors watch whether a child stays near its own curve; a sudden drop across percentiles is a warning sign.'
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'An outlier is a question, not an error',
          body: 'The 18-cup order might be a typo — or an office ordering for a meeting, which is valuable business. Investigate before deleting.'
        }
      ]
    },
    {
      id: 'distributions',
      eyebrow: 'Statistics',
      title: 'Distributions: the shape of data',
      minutes: 9,
      blocks: [
        {
          type: 'table',
          columns: ['Shape', 'Looks like', 'Real-world examples', 'Mean vs median'],
          rows: [
            [
              'Normal (bell)',
              'Symmetric hill around the centre',
              'Heights, measurement errors, exam scores',
              'About equal'
            ],
            [
              'Right-skewed',
              'Long tail to the right',
              'Incomes, house prices, order sizes, waiting times',
              'Mean > median'
            ],
            [
              'Uniform',
              'Flat — every value equally likely',
              'A fair die, random lottery numbers',
              'About equal'
            ]
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(7)
heights = rng.normal(165, 8, 5000)                     # symmetric
incomes = rng.lognormal(mean=10, sigma=0.6, size=5000)  # right-skewed

within_1sd = np.mean(np.abs(heights - heights.mean()) < heights.std()) * 100
print(f"heights within 1 std of the mean: {within_1sd:.0f}%  (the 68-95-99.7 rule says ~68%)")
print(f"incomes: mean {incomes.mean():,.0f} vs median {np.median(incomes):,.0f}")

fig, (left, right) = plt.subplots(1, 2, figsize=(11, 3.5))
left.hist(heights, bins=40)
left.set_title("Heights: normal")
right.hist(incomes, bins=60)
right.axvline(np.median(incomes), color="#2E7550", label="median")
right.axvline(incomes.mean(), color="#B03A1E", linestyle="--", label="mean")
right.set_title("Incomes: right-skewed")
right.legend()
plt.show()
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'The 68–95–99.7 rule',
          body: 'For normal data, about 68% of values lie within 1 std of the mean, 95% within 2, and 99.7% within 3. If heights average 165 cm with std 8 cm, about 95% of people are between 149 and 181 cm.'
        }
      ]
    },
    {
      id: 'review',
      eyebrow: 'Review',
      title: 'Check your understanding',
      minutes: 5,
      blocks: [
        {
          type: 'quiz',
          question:
            'House prices in a city: mean 8 million, median 4 million. What does that tell you?',
          options: [
            'The data is right-skewed: a few very expensive houses',
            'The data is symmetric',
            'Half the houses cost 8 million or more',
            'There is a calculation error'
          ],
          answer: 0,
          explanation: 'A mean far above the median means a long right tail pulling the mean up.'
        },
        {
          type: 'quiz',
          question:
            'Exam scores: mean 60, std 10, roughly normal. About what % scored between 40 and 80?',
          options: ['68%', '95%', '99.7%', '50%'],
          answer: 1,
          explanation: '40–80 is mean ± 2 std, which holds about 95% of normal data.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework',
          body: 'Write down the minutes you spend on your phone each day for a week. Compute mean, median and std by hand (then check with NumPy). Which day is an outlier — and why?'
        }
      ]
    }
  ]
}

export default day2
