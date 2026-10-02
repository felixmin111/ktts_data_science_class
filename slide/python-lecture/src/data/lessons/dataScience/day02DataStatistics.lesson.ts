import type { Lesson } from '@/models/lesson.model'
import { action, decision } from '@/functions/flow.function'
import { round } from '@/functions/stats.function'
import { py } from '../py'
import { dataUsage, fills, ratings } from './stats/statsData'

// ---- Example data (invented for teaching) -------------------------------------------------------

/** A used-phone shop's last six sales. */
export const phones = [
  { model: 'Lumo 8', battery: 96, asking: 9500, selling: 9500, screen: 'Like new' },
  { model: 'Kite 5', battery: 81, asking: 7200, selling: 6300, screen: 'Scratched' },
  { model: 'Lumo 8', battery: 84, asking: 9500, selling: 8700, screen: 'Scratched' },
  { model: 'Lumo 8', battery: 88, asking: 9500, selling: 9000, screen: 'Scratched' },
  { model: 'Kite 5', battery: 97, asking: 7200, selling: 7200, screen: 'Like new' },
  { model: 'Lumo 8', battery: 99, asking: 9500, selling: 9500, screen: 'Like new' }
]
export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
/** Cups of iced coffee sold per month at one café (time series). */
export const icedCoffee = [410, 455, 520, 610, 640, 600, 560, 545, 530, 580, 620, 690]
/** Cups sold by six branches in March (cross-sectional). */
export const branches = ['Downtown', 'Campus', 'Station', 'Market', 'Riverside', 'Airport']
export const marchCups = [520, 610, 380, 450, 300, 270]
/** A one-week price experiment for a new drink at three similar branches. */
export const testPrices = [40, 50, 60]
export const testCups = [182, 150, 96]

const usageOver5 = dataUsage.filter((v) => v > 5).length
const ratingsOk = ratings.filter((v) => v >= 25).length
const fillsOk = fills.filter((v) => v >= 499 && v <= 501).length
const thb = (v: number) => v.toLocaleString('en-US')

/** Splits a list into rows of `size` for a compact table. */
export function grid(values: (number | string)[], size: number): string[][] {
  const rows: string[][] = []
  for (let i = 0; i < values.length; i += size) {
    rows.push(values.slice(i, i + size).map(String))
  }
  return rows
}

// ---- The lesson -------------------------------------------------------------------------------

const day2: Lesson = {
  id: 'ds-2',
  track: 'data-science',
  day: 2,
  title: 'Statistics 1: data, populations and samples',
  summary:
    'What data are, the kinds of variables, where data come from, and how a small random sample lets us learn about a whole population — with three worked case studies.',
  durationMinutes: 75,
  topics: [
    'Data sets and variables',
    'Quantitative vs qualitative',
    'Time series',
    'Data sources',
    'Population vs sample',
    'Random sampling',
    'Scales of measurement'
  ],
  available: true,
  sections: [
    {
      id: 'what-is-statistics',
      eyebrow: 'Chapter 1 · Start here',
      title: 'What is statistics?',
      minutes: 5,
      blocks: [
        {
          type: 'text',
          body: [
            '**Statistics** is the science of **collecting**, **analysing** and **interpreting** data so that we can make better decisions.',
            '**Data** are facts and figures from which we can draw conclusions. A single number tells us little; many numbers, organised and summarised, can answer a question.',
            'Statistics always follows the same path: ① ask a question ② collect data ③ organise and summarise the data with tables, graphs and numbers ④ draw a conclusion and decide what to do.'
          ]
        },
        {
          type: 'table',
          columns: ['Who', 'Data they look at', 'Decision the data helps with'],
          rows: [
            ['Café owner', 'Cups sold each day', 'How much milk and coffee to order'],
            ['Bank', 'Customers’ past repayments', 'Whether to approve a loan'],
            ['Doctor', 'Results of a drug trial', 'Which treatment to give'],
            [
              'Factory supervisor',
              'Weights of products leaving the line',
              'Whether the machine needs fixing'
            ],
            ['Government', 'Prices of food each month', 'Whether prices are rising too fast']
          ]
        },
        {
          type: 'chart',
          title: 'From data to a decision',
          chart: {
            kind: 'bar',
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [42, 38, 40, 45, 51, 88, 93],
            yLabel: 'Cups of a new drink sold',
            highlight: [5, 6]
          },
          caption:
            'The raw facts are seven numbers. The graph makes the pattern obvious: weekend sales are about **twice** weekday sales. **Conclusion:** prepare twice as much on Saturday and Sunday. That is statistics in one picture.'
        },
        {
          type: 'analogy',
          title: 'A detective',
          body: 'A detective collects clues (data), arranges them (tables and graphs), looks for a pattern (analysis) and names the most likely answer (conclusion). Statistics is detective work with numbers.'
        }
      ]
    },
    {
      id: 'data-set',
      eyebrow: 'Chapter 1 · 1.1 Data',
      title: 'Data sets, elements and variables',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            'A **data set** is all the data collected for one study. It describes a group of **elements**: the people, objects or events we are studying.',
            'A **variable** is any characteristic of an element, such as a price, an age or a colour. When we record the value of a variable for an element, we make a **measurement**.',
            'In a table, **each row is one element** and **each column is one variable**. The example below is a used-phone shop’s last six sales: 6 elements and 5 variables.'
          ]
        },
        {
          type: 'table',
          columns: [
            'Phone',
            'Model',
            'Battery health (%)',
            'Asking price (THB)',
            'Selling price (THB)',
            'Screen'
          ],
          rows: phones.map((p, i) => [
            String(i + 1),
            p.model,
            String(p.battery),
            thb(p.asking),
            thb(p.selling),
            p.screen
          ])
        },
        {
          type: 'chart',
          title: 'Selling price of each phone',
          chart: {
            kind: 'bar',
            categories: phones.map((p, i) => `${i + 1}·${p.model}`),
            values: phones.map((p) => p.selling),
            yLabel: 'Selling price (THB)',
            yMin: 6000,
            highlight: [2, 3]
          },
          caption:
            'You want a **Lumo 8 with a scratched screen**, and the shop asks 9,500 THB. The data show that “like new” phones sold at the asking price, but the two scratched Lumo 8s (orange) sold for **8,700** and **9,000**. So a fair offer is about 8,700 THB, not 9,500. Collecting six facts saved you 800 THB.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Remember',
          body: 'Element = one row (one phone). Variable = one column (model, battery, price, screen). Measurement = one cell (phone 3’s battery is 84%).'
        }
      ]
    },
    {
      id: 'quant-qual',
      eyebrow: 'Chapter 1 · 1.1 Data',
      title: 'Quantitative and qualitative variables',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'A variable is **quantitative** when its values are numbers that measure **how much** or **how many**: price, weight, minutes, number of children.',
            'A variable is **qualitative** (also called **categorical**) when we only record **which group** an element belongs to: model, colour, “yes / no”, satisfied / not satisfied.',
            '**Test:** does it make sense to add two values or take their average? Average price makes sense, so price is quantitative. The “average screen condition” does not, so screen is qualitative.'
          ]
        },
        {
          type: 'table',
          columns: ['Variable', 'Example values', 'Type', 'Why'],
          rows: [
            ['Model', 'Lumo 8, Kite 5', 'Qualitative', 'Names of groups'],
            ['Battery health', '96, 81, 84', 'Quantitative', 'How much battery is left'],
            ['Selling price', '9,500, 6,300', 'Quantitative', 'How much money'],
            ['Screen', 'Like new, Scratched', 'Qualitative', 'Which condition group'],
            ['Number of owners', '1, 2, 3', 'Quantitative', 'How many'],
            [
              'Postcode',
              '10110, 10330',
              'Qualitative',
              'A label, even though it is written with digits'
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Each type is drawn differently',
          chart: {
            kind: 'gallery',
            charts: [
              {
                title: 'Qualitative: count each group',
                chart: {
                  kind: 'bar',
                  categories: ['Like new', 'Scratched'],
                  values: [3, 3],
                  yLabel: 'Number of phones'
                }
              },
              {
                title: 'Quantitative: place on a number line',
                chart: {
                  kind: 'dot',
                  data: phones.map((p) => p.battery),
                  xLabel: 'Battery health (%)'
                }
              }
            ]
          },
          caption:
            'For a qualitative variable we can only **count** how many elements fall in each group, so we draw a **bar chart**. For a quantitative variable the values sit on a **number line**, so we can see how big they are and how far apart.'
        },
        {
          type: 'quiz',
          question:
            'A survey asks “How many cups of coffee do you drink a day?” and “Which coffee shop do you prefer?”. Which is which?',
          options: [
            'Both quantitative',
            'Cups: quantitative; shop: qualitative',
            'Cups: qualitative; shop: quantitative',
            'Both qualitative'
          ],
          answer: 1,
          explanation:
            'Cups answers “how many”, so it is quantitative. The shop is just a name of a group, so it is qualitative.'
        }
      ]
    },
    {
      id: 'time-series',
      eyebrow: 'Chapter 1 · 1.1 Data',
      title: 'Cross-sectional data and time series data',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            '**Cross-sectional data** are collected at (about) the **same point in time** from different elements — for example, the cups sold by six branches in March.',
            '**Time series data** are collected from the **same thing at different times** — for example, the cups sold by one café every month for a year.',
            'We draw time series data with a **time series plot** (also called a **runs plot**): put time on the horizontal axis and the value on the vertical axis, plot one point per period, and join the points in time order. The slope of the line shows the trend.'
          ]
        },
        {
          type: 'table',
          columns: ['Month', ...months],
          rows: [['Cups', ...icedCoffee.map(String)]]
        },
        {
          type: 'chart',
          title: 'Time series plot: iced coffee sales by month',
          chart: {
            kind: 'line',
            x: months,
            series: [{ name: 'Cups', values: icedCoffee }],
            xLabel: 'Month',
            yLabel: 'Cups sold',
            yMin: 300
          },
          caption:
            'Reading the plot from left to right: sales **rise** from January to May (hot season), **dip** in the rainy months, then rise again to the highest month, December (690). A table of 12 numbers hides this story; the plot shows it at once.'
        },
        {
          type: 'chart',
          title: 'Cross-sectional data: six branches in March',
          chart: {
            kind: 'bar',
            categories: branches,
            values: marchCups,
            yLabel: 'Cups sold in March'
          },
          caption:
            'These six numbers were collected at the same time, so there is no time order to follow. We compare the branches with each other instead: Campus sold the most, Airport the least.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Draw the time series plot in Python',
          code: py`
import matplotlib.pyplot as plt

months = ${JSON.stringify(months)}
cups = ${JSON.stringify(icedCoffee)}

plt.plot(months, cups, marker="o")
plt.xlabel("Month")
plt.ylabel("Cups sold")
plt.title("Iced coffee sales")
plt.show()
`
        },
        {
          type: 'quiz',
          question:
            'A teacher records the height of 30 students on 1 June. What kind of data is this?',
          options: ['Time series', 'Cross-sectional', 'Both', 'Neither'],
          answer: 1,
          explanation:
            'Many different students, measured at the same time: cross-sectional. If she measured one student every month, that would be a time series.'
        }
      ]
    },
    {
      id: 'data-sources',
      eyebrow: 'Chapter 1 · 1.2 Data sources',
      title: 'Where data come from: existing sources, experiments and observation',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            '**Existing sources:** data someone has already collected — government statistics websites, company records, published reports, or data bought from a research company. Fast and cheap, but it may not answer exactly your question, and not every website is reliable.',
            'When the data do not exist yet, we collect them ourselves with a **study**. First we choose the **response variable**: the result we want to understand. Other variables that may affect it are called **factors**.',
            'In an **experimental study** we **set the values of the factors ourselves** and watch the response. In an **observational study** we **cannot control** the factors; we only observe or ask (a **survey** is a common example).'
          ]
        },
        {
          type: 'table',
          columns: ['Source', 'How we get the data', 'Strength', 'Weakness'],
          rows: [
            [
              'Existing (public / private)',
              'Download or request records',
              'Fast and cheap',
              'May not fit our question'
            ],
            [
              'Experiment',
              'We set the factor, then measure the response',
              'Can show cause and effect',
              'Slower and costs more'
            ],
            [
              'Observational study / survey',
              'Watch or ask, without controlling anything',
              'Works when control is impossible',
              'Shows links, not causes'
            ]
          ]
        },
        {
          type: 'text',
          body: [
            '**An experiment.** A café wants to price a new drink. For one week it sets the price to **40, 50 and 60 THB** at three branches that normally sell the same amount. The **factor** is price (the café controls it). The **response** is cups sold.'
          ]
        },
        {
          type: 'table',
          columns: [
            'Price set by the café (factor)',
            'Cups sold in the week (response)',
            'Revenue (THB)'
          ],
          rows: testPrices.map((p, i) => [`${p} THB`, String(testCups[i]), thb(p * testCups[i]!)])
        },
        {
          type: 'chart',
          title: 'Response at each level of the factor',
          chart: {
            kind: 'bar',
            categories: testPrices.map((p) => `${p} THB`),
            values: testCups,
            yLabel: 'Cups sold in one week',
            highlight: [1]
          },
          caption:
            'Higher price → fewer cups. But revenue (price × cups) is 7,280 at 40 THB, **7,500 at 50 THB** and 5,760 at 60 THB. Because the café controlled the price, it can say the price **caused** the change, and choose 50 THB.'
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'An observational study cannot prove a cause',
          body: 'A survey finds that people who drink more coffee sleep less. We did not decide how much coffee each person drinks, so other things (exams, night shifts) may cause both. Observational data show a **link**; an experiment is needed to show a **cause**.'
        },
        {
          type: 'quiz',
          question:
            'A farmer gives 0, 20 and 40 kg of fertiliser to three equal fields and weighs the rice harvested. What are the response, the factor and the study type?',
          options: [
            'Response: fertiliser; factor: rice; observational',
            'Response: rice harvested; factor: fertiliser; experimental',
            'Response: rice harvested; factor: fertiliser; observational',
            'Response: field size; factor: rice; experimental'
          ],
          answer: 1,
          explanation:
            'The farmer chooses the fertiliser amounts (factor) and measures the harvest (response). Setting the factor yourself makes it an experiment.'
        }
      ]
    },
    {
      id: 'population-sample',
      eyebrow: 'Chapter 1 · 1.3 Populations and samples',
      title: 'Population, sample and statistical inference',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'The **population** is the set of **all** elements we want to draw conclusions about. If we measure every element of the population, we are taking a **census**.',
            'Populations are usually too big, too slow or too expensive to measure completely. So we measure a **sample**: a **subset** of the population.',
            '**Descriptive statistics** describes the data we have (with tables, graphs and numbers). **Statistical inference** uses a **sample** to make a general statement about the whole **population** — with some uncertainty, because a different sample would give slightly different numbers.'
          ]
        },
        {
          type: 'table',
          columns: ['Term', 'Meaning', 'Campus example'],
          rows: [
            ['Population', 'All elements we care about', 'All 400 students in a faculty'],
            ['Census', 'Measuring every element', 'Asking all 400 students'],
            ['Sample', 'A subset of the population', '40 students chosen at random'],
            [
              'Descriptive statistics',
              'Describing the data we have',
              '“23 of our 40 students use over 5 GB”'
            ],
            [
              'Statistical inference',
              'Sample → conclusion about the population',
              '“About 58% of all 400 students use over 5 GB”'
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Try it: take random samples from a population',
          chart: {
            kind: 'sampling',
            populationSize: 400,
            withTrait: 232,
            sampleSize: 40,
            traitLabel: 'uses over 5 GB',
            otherLabel: 'uses 5 GB or less'
          },
          caption:
            'Each dot is one of 400 students; 232 of them (58%) use more than 5 GB a month. Press the button to pick 40 students **at random**. The sample % is rarely exactly 58%, but it lands **close** to it — and the more samples you draw, the more you see them cluster around the true value. That is why a sample can tell us about a population.'
        },
        {
          type: 'quiz',
          question:
            'A company checks 200 of the 10,000 phones it made today and finds 3 faulty. What is the population and what is the sample?',
          options: [
            'Population: 200 phones; sample: 3 phones',
            'Population: 10,000 phones; sample: 200 phones',
            'Population: 3 faulty phones; sample: 200 phones',
            'Population: all phones in the world; sample: 10,000'
          ],
          answer: 1,
          explanation:
            'The conclusion is about today’s 10,000 phones (population). Only 200 of them were checked (sample).'
        }
      ]
    },
    {
      id: 'random-sampling',
      eyebrow: 'Chapter 1 · 1.4 Random sampling',
      title: 'Why the sample must be random',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'A sample is only useful if it looks like the population. The best protection is a **random sample**: **every element has the same chance** of being chosen.',
            '**How:** ① make a list of the population ② give each element a number ③ pick numbers at random (slips of paper from a box, or a computer) ④ measure only the chosen elements.',
            'A sample chosen for convenience is often **biased**: it leans one way. Asking the first 40 students who walk into the **computer lab** about their data use will find far more heavy users than the faculty really has.'
          ]
        },
        {
          type: 'table',
          columns: ['How the 40 students were chosen', '% using over 5 GB', 'Fair?'],
          rows: [
            ['Whole population (all 400 — the truth)', '58%', '—'],
            ['Random sample from the numbered list', '55%', 'Yes: close to the truth'],
            ['First 40 people in the computer lab', '85%', 'No: lab users are heavy users'],
            ['Friends of the person doing the survey', '70%', 'No: friends are alike']
          ]
        },
        {
          type: 'chart',
          title: 'A biased sample misses the truth',
          chart: {
            kind: 'bar',
            categories: ['Truth (all 400)', 'Random sample', 'Computer lab', 'Friends'],
            values: [58, 55, 85, 70],
            yLabel: '% using over 5 GB',
            percent: true,
            highlight: [2, 3]
          },
          caption:
            'The random sample is 3 points away from the truth; the convenient samples are 12 and 27 points away. Collecting **more** biased data does not fix this — only choosing **randomly** does.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Choose a random sample with Python',
          code: py`
import random

# 1-2. Every student on the list gets a number from 1 to 400
students = list(range(1, 401))

# 3. Pick 10 different numbers; each student has the same chance
chosen = random.sample(students, 10)
print(sorted(chosen))
`
        }
      ]
    },
    {
      id: 'case-data-usage',
      eyebrow: 'Chapter 1 · Case study 1',
      title: 'Case: how much mobile data do students use?',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            '**Question.** A university pays for a student data plan. If **more than 30%** of its 3,200 students use over 5 GB a month, it should buy the bigger plan.',
            '**Sample.** Checking 3,200 bills is slow, so the IT office numbers all students and picks **40 at random**. It records each student’s data use last month (GB).'
          ]
        },
        {
          type: 'table',
          columns: ['GB', 'GB', 'GB', 'GB', 'GB', 'GB', 'GB', 'GB'],
          rows: grid(dataUsage, 8)
        },
        {
          type: 'chart',
          title: 'Dot plot of the 40 students (over 5 GB in orange)',
          chart: {
            kind: 'dot',
            data: dataUsage,
            step: 0.5,
            xLabel: 'Data used last month (GB)',
            highlight: dataUsage.filter((v) => v > 5).map((v) => Math.round(v / 0.5) * 0.5)
          },
          caption: `**Descriptive:** the 40 values run from ${Math.min(...dataUsage)} to ${Math.max(...dataUsage)} GB, and ${usageOver5} of the 40 are over 5 GB. **Inference:** ${usageOver5} ÷ 40 = ${round(usageOver5 / 40, 3)}, so we estimate that about **${round((usageOver5 / 40) * 100, 1)}%** of all 3,200 students use over 5 GB. That is above the 30% limit, so the bigger plan looks like the better buy. (Chapter 8 shows how sure we can be about a sample estimate like this.)`
        },
        {
          type: 'code',
          runnable: true,
          title: 'The same calculation in Python',
          code: py`
usage = ${JSON.stringify(dataUsage)}

over_5 = [gb for gb in usage if gb > 5]
print("Smallest:", min(usage), "Largest:", max(usage))
print("Over 5 GB:", len(over_5), "of", len(usage))
print("Estimated share:", round(len(over_5) / len(usage) * 100, 1), "%")
`,
          output: `Smallest: ${Math.min(...dataUsage)} Largest: ${Math.max(...dataUsage)}\nOver 5 GB: ${usageOver5} of 40\nEstimated share: ${round((usageOver5 / 40) * 100, 1)} %`
        }
      ]
    },
    {
      id: 'case-ratings',
      eyebrow: 'Chapter 1 · Case study 2',
      title: 'Case: rating a new café menu (a survey)',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            '**Question.** A café chain tests a new menu design. Experience says a design is successful when customers give it a **composite score of at least 25**.',
            '**Survey.** Each customer rates 5 statements on a 1–7 scale (1 = strongly disagree, 7 = strongly agree). This kind of scale is called a **Likert scale**. Adding the 5 answers gives a **composite score** from 5 × 1 = **5** to 5 × 7 = **35**.'
          ]
        },
        {
          type: 'table',
          columns: ['#', 'Statement (rate 1–7)'],
          rows: [
            ['1', 'The menu is easy to read.'],
            ['2', 'The pictures make the food look good.'],
            ['3', 'I can find what I want quickly.'],
            ['4', 'The prices are easy to see.'],
            ['5', 'Overall, I like this menu design.']
          ]
        },
        {
          type: 'table',
          columns: ['Score', 'Score', 'Score', 'Score', 'Score', 'Score'],
          rows: grid(ratings, 6)
        },
        {
          type: 'chart',
          title: 'Composite scores of 30 customers (below 25 in orange)',
          chart: {
            kind: 'dot',
            data: ratings,
            xLabel: 'Composite score (5 to 35)',
            highlight: ratings.filter((v) => v < 25)
          },
          caption: `**Descriptive:** scores run from ${Math.min(...ratings)} to ${Math.max(...ratings)}; ${ratingsOk} of the 30 are at least 25. **Inference:** ${ratingsOk} ÷ 30 = ${round(ratingsOk / 30, 2)}, so about **${round((ratingsOk / 30) * 100, 0)}%** of all customers would rate the design 25 or more. The design looks successful. The 3 low scores are worth a follow-up: what did those customers dislike?`
        }
      ]
    },
    {
      id: 'case-process',
      eyebrow: 'Chapter 1 · Case study 3',
      title: 'Case: sampling a process over time',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'A **process** turns inputs (materials, machines, people) into outputs over time — for example, a machine filling 500 ml water bottles all day.',
            'The bottles filled **today** form a **finite population** (there is a fixed number). All bottles the machine **could ever** fill form an **infinite population**: in theory it can always fill one more.',
            'To study a process we sample it **regularly over time**: here, one bottle chosen at a random moment in each of 24 hours. We plot the results **in time order** to check that the process is **stable** (no upward or downward drift). Only then do the measurements tell us about the process as a whole.'
          ]
        },
        {
          type: 'table',
          columns: ['Hours', 'ml', 'ml', 'ml', 'ml', 'ml', 'ml'],
          rows: grid(fills, 6).map((row, i) => [`${i * 6 + 1}–${i * 6 + 6}`, ...row])
        },
        {
          type: 'chart',
          title: 'Runs plot of the 24 fills',
          chart: {
            kind: 'line',
            x: fills.map((_, i) => i + 1),
            series: [{ name: 'ml', values: fills }],
            xLabel: 'Hour',
            yLabel: 'Fill volume (ml)',
            yMin: 498,
            yMax: 502,
            reference: { value: 500, label: 'Target 500 ml' }
          },
          caption: `The points jump up and down around 500 ml but do **not** drift upward or downward, so the machine looks stable. ${fillsOk} of the 24 fills (${round((fillsOk / 24) * 100, 0)}%) are between 499 and 501 ml, so we estimate that most bottles the machine fills fall in that range.`
        }
      ]
    },
    {
      id: 'scales',
      eyebrow: 'Chapter 1 · 1.5 Scales of measurement',
      title: 'Four scales: ratio, interval, ordinal and nominal',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'Quantitative variables come in two scales. **Ratio:** zero means “none”, so ratios make sense — 20 km is twice as far as 10 km (price, weight, time, distance). **Interval:** equal steps but **no true zero**, so ratios do not make sense — 0 °C is not “no heat”, and 30 °C is not “twice as hot” as 15 °C (temperature is the classic example).',
            'Qualitative variables also come in two scales. **Ordinal:** the categories have a **natural order** (small < medium < large; 1 to 5 stars). **Nominal:** the categories have **no order** (blood type, colour, city).',
            'The scale decides which calculations are allowed. You can average prices, but averaging blood types is meaningless.'
          ]
        },
        {
          type: 'table',
          columns: ['Scale', 'Type', 'Order?', 'Equal steps?', 'True zero?', 'Examples'],
          rows: [
            ['Ratio', 'Quantitative', 'Yes', 'Yes', 'Yes', 'Price, weight, minutes'],
            ['Interval', 'Quantitative', 'Yes', 'Yes', 'No', 'Temperature °C, calendar year'],
            ['Ordinal', 'Qualitative', 'Yes', 'No', 'No', 'Shirt size, star rating, grade A–F'],
            ['Nominal', 'Qualitative', 'No', 'No', 'No', 'Blood type, city, phone model']
          ]
        },
        {
          type: 'flow',
          demo: true,
          hideCode: true,
          title: 'Which scale? Follow the questions',
          setup: 'variable = temperature in °C',
          tree: decision(
            'measures an amount?',
            true,
            decision('zero means none?', false, action('Ratio scale'), action('Interval scale')),
            decision('categories ordered?', null, action('Ordinal scale'), action('Nominal scale'))
          ),
          explanation:
            'Temperature is a number that measures an amount, so it is quantitative. But 0 °C does not mean “no temperature”, so it is the interval scale.'
        },
        {
          type: 'flow',
          hideCode: true,
          setup: 'variable = T-shirt size (S, M, L, XL)',
          tree: decision(
            'measures an amount?',
            false,
            decision('zero means none?', null, action('Ratio scale'), action('Interval scale')),
            decision('categories ordered?', true, action('Ordinal scale'), action('Nominal scale'))
          ),
          explanation:
            'Sizes are groups, not amounts, but S < M < L < XL have a natural order: ordinal.'
        },
        {
          type: 'flow',
          hideCode: true,
          setup: 'variable = delivery time in minutes',
          tree: decision(
            'measures an amount?',
            true,
            decision('zero means none?', true, action('Ratio scale'), action('Interval scale')),
            decision('categories ordered?', null, action('Ordinal scale'), action('Nominal scale'))
          ),
          explanation:
            'Minutes measure an amount of time, and 0 minutes means no time at all, so 20 minutes really is twice 10: ratio.'
        },
        {
          type: 'flow',
          hideCode: true,
          setup: 'variable = blood type (A, B, AB, O)',
          tree: decision(
            'measures an amount?',
            false,
            decision('zero means none?', null, action('Ratio scale'), action('Interval scale')),
            decision('categories ordered?', false, action('Ordinal scale'), action('Nominal scale'))
          ),
          explanation:
            'Blood types are groups with no natural order (A is not “more” than O): nominal.'
        }
      ]
    },
    {
      id: 'python-data-set',
      eyebrow: 'Chapter 1 · In Python',
      title: 'A data set in Python',
      minutes: 4,
      blocks: [
        {
          type: 'text',
          body: [
            'In Python, a data set is usually a pandas **DataFrame**: one row per element, one column per variable. pandas also guesses each column’s type — **numbers** (`int64`, `float64`) for quantitative variables and **text** (`object`, or `str` in newer pandas) for qualitative ones.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'The phone data set',
          code: py`
import pandas as pd

phones = pd.DataFrame({
    "model": ${JSON.stringify(phones.map((p) => p.model))},
    "battery": ${JSON.stringify(phones.map((p) => p.battery))},
    "selling_price": ${JSON.stringify(phones.map((p) => p.selling))},
    "screen": ${JSON.stringify(phones.map((p) => p.screen))},
})

print(phones)
print()
print(phones.dtypes)
print()
# Qualitative: count each group. Quantitative: describe the numbers.
print(phones["screen"].value_counts())
`
        }
      ]
    },
    {
      id: 'review',
      eyebrow: 'Review',
      title: 'Can you answer these?',
      minutes: 4,
      blocks: [
        {
          type: 'quiz',
          question:
            'In a table of 50 customers with columns Age, City and Spend, how many elements and variables are there?',
          options: [
            '3 elements, 50 variables',
            '50 elements, 3 variables',
            '150 elements',
            '50 variables'
          ],
          answer: 1,
          explanation: 'Each customer (row) is an element; each column is a variable.'
        },
        {
          type: 'quiz',
          question: 'Which variable is on the interval scale?',
          options: ['Weight in kg', 'Temperature in °C', 'Shirt size', 'Bus number'],
          answer: 1,
          explanation:
            'Temperature in °C has equal steps but no true zero. Weight is ratio, shirt size ordinal, bus number nominal.'
        },
        {
          type: 'quiz',
          question: 'Why do we choose a sample at random?',
          options: [
            'Because it is faster',
            'So that every element has the same chance and the sample looks like the population',
            'So that the sample is larger',
            'Because a census is always wrong'
          ],
          answer: 1,
          explanation:
            'Random choice avoids bias, so conclusions about the population can be trusted.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework: your own data set',
          body: 'Collect a small data set of at least 10 elements from your life (for example, your last 10 meals: price, place, time eaten, how full you felt 1–5). For each variable write: quantitative or qualitative, and its scale. Then draw one graph by hand: a bar chart for a qualitative variable or a dot plot for a quantitative one.'
        }
      ]
    }
  ]
}

export default day2
