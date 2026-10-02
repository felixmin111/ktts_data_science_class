import type { Lesson } from '@/models/lesson.model'
import {
  binomialPmf,
  distributionMean,
  distributionVariance,
  fixed,
  hypergeometricPmf,
  poissonPmf,
  round,
  sum
} from '@/functions/stats.function'
import { py } from '../py'

// ---- Example data (invented for teaching) -------------------------------------------------------

/** Drinks per order at a café. */
export const drinksX = [1, 2, 3, 4]
export const drinksP = [0.5, 0.3, 0.15, 0.05]
export const drinksMean = distributionMean(drinksX, drinksP)
export const drinksVar = distributionVariance(drinksX, drinksP)

/** Dice game: pay 20 THB, win 100 THB if you roll a 6. Profit x and P(x). */
export const gameX = [-20, 80]
export const gameP = [5 / 6, 1 / 6]
export const gameMean = distributionMean(gameX, gameP)

/** Binomial: 20% of customers use a coupon; next 6 customers. */
export const couponN = 6
export const couponP = 0.2
export const couponXs = Array.from({ length: couponN + 1 }, (_, i) => i)
export const couponPs = couponXs.map((x) => binomialPmf(x, couponN, couponP))

/** Rare-event inference: claim 5% leak; 20 inspected; 4 leak. */
export const leakN = 20
export const leakP = 0.05
export const leakSeen = 4
export const leakXs = Array.from({ length: 9 }, (_, i) => i)
export const leakPs = leakXs.map((x) => binomialPmf(x, leakN, leakP))
export const leakTail =
  1 - sum(Array.from({ length: leakSeen }, (_, x) => binomialPmf(x, leakN, leakP)))

/** Poisson: on average 4 delivery calls per hour. */
export const callsMu = 4
export const callsXs = Array.from({ length: 13 }, (_, i) => i)
export const callsPs = callsXs.map((x) => poissonPmf(x, callsMu))
export const callsAtLeast9 = 1 - sum(Array.from({ length: 9 }, (_, x) => poissonPmf(x, callsMu)))

/** Hypergeometric: a box of 12 phones, 3 faulty; check 4. */
export const boxN = 12
export const boxFaulty = 3
export const boxDraw = 4
export const hyperXs = [0, 1, 2, 3]
export const hyperPs = hyperXs.map((x) => hypergeometricPmf(x, boxN, boxFaulty, boxDraw))
export const binomApprox = hyperXs.map((x) => binomialPmf(x, boxDraw, boxFaulty / boxN))

const f4 = (v: number) => fixed(v, 4)
const f2 = (v: number) => fixed(v, 2)

// ---- The lesson -------------------------------------------------------------------------------

const stats5: Lesson = {
  id: 'ds-stats-5',
  track: 'data-science',
  day: 6,
  title: 'Statistics 5: discrete random variables',
  summary:
    'Random variables, probability distributions, expected value and standard deviation, and three famous distributions — binomial, Poisson and hypergeometric — with sliders to explore them and a first taste of statistical inference.',
  durationMinutes: 100,
  topics: [
    'Random variables',
    'Probability distributions',
    'Expected value',
    'Binomial distribution',
    'Poisson distribution',
    'Hypergeometric distribution'
  ],
  available: true,
  sections: [
    {
      id: 'random-variables',
      eyebrow: 'Chapter 5 · 5.1 Random variables',
      title: 'Two types of random variables',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'A **random variable** is a number whose value depends on chance — the result of an experiment, written with a capital letter such as **X**.',
            'A **discrete** random variable has values we can **list** (count them: 0, 1, 2, …). A **continuous** random variable can take **any** value in an interval (measure it: 4.23 minutes, 500.7 ml). This chapter is about discrete random variables; Chapter 6 covers continuous ones.'
          ]
        },
        {
          type: 'table',
          columns: ['Random variable X', 'Possible values', 'Type'],
          rows: [
            ['Number of drinks in an order', '1, 2, 3, 4', 'Discrete'],
            ['Number of customers who use a coupon (out of 6)', '0, 1, …, 6', 'Discrete'],
            ['Number of phone calls in an hour', '0, 1, 2, … (no fixed maximum)', 'Discrete'],
            ['Delivery time in minutes', 'Any value, e.g. 23.7', 'Continuous'],
            ['Fill volume of a bottle in ml', 'Any value, e.g. 500.3', 'Continuous']
          ]
        },
        {
          type: 'chart',
          title: 'Discrete: separate bars. Continuous: a smooth curve.',
          chart: {
            kind: 'gallery',
            charts: [
              {
                title: 'Discrete (drinks per order)',
                chart: { kind: 'pmf', x: drinksX, p: drinksP }
              },
              {
                title: 'Continuous (fill volume)',
                chart: { kind: 'bell', mean: 500, sd: 0.6, decimals: 1 }
              }
            ]
          }
        }
      ]
    },
    {
      id: 'distribution',
      eyebrow: 'Chapter 5 · 5.2 Discrete probability distributions',
      title: 'A probability distribution and its expected value',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            'The **probability distribution** of a discrete random variable lists each possible value x with its probability p(x). It can be a table, a graph or a formula. Two rules always hold: every **p(x) ≥ 0**, and **Σp(x) = 1**.',
            'A café found that the number of drinks X in an order has this distribution:'
          ]
        },
        {
          type: 'table',
          columns: ['Drinks x', 'p(x)', 'x · p(x)', '(x − μ)² · p(x)'],
          rows: [
            ...drinksX.map((x, i) => [
              String(x),
              fixed(drinksP[i]!, 2),
              fixed(x * drinksP[i]!, 2),
              f4((x - drinksMean) ** 2 * drinksP[i]!)
            ]),
            ['Total', '1.00', `μ = ${f2(drinksMean)}`, `σ² = ${f4(drinksVar)}`]
          ]
        },
        {
          type: 'chart',
          title: 'Distribution of drinks per order (X ≥ 3 highlighted)',
          chart: {
            kind: 'pmf',
            x: drinksX,
            p: drinksP,
            highlight: [3, 4],
            mean: drinksMean,
            meanLabel: `μ = ${f2(drinksMean)}`,
            xLabel: 'Drinks in an order (x)',
            yLabel: 'p(x)'
          },
          caption: `P(X ≥ 3) = 0.15 + 0.05 = **0.20**: one order in five has 3 or more drinks.`
        },
        {
          type: 'text',
          body: [
            `The **mean** or **expected value** is **μ = Σ x·p(x)** = 1(0.5) + 2(0.3) + 3(0.15) + 4(0.05) = **${f2(drinksMean)}** drinks. It is the **long-run average**: over thousands of orders, the café sells about ${f2(drinksMean)} drinks per order, even though no single order has ${f2(drinksMean)} drinks.`,
            `The **variance** is **σ² = Σ(x − μ)²·p(x)** = ${f4(drinksVar)}, so the **standard deviation** is σ = √${f4(drinksVar)} = **${f4(Math.sqrt(drinksVar))}** drinks.`,
            `**Is a game fair?** Pay 20 THB to roll a die; win 100 THB if it shows 6. Your profit X is +80 (probability 1/6) or −20 (probability 5/6). E(X) = 80(1/6) + (−20)(5/6) = **${f2(gameMean)} THB**. On average you lose about ${f2(Math.abs(gameMean))} THB per game — the organiser wins in the long run.`
          ]
        },
        {
          type: 'chart',
          title: 'The dice game: your profit',
          chart: {
            kind: 'pmf',
            x: gameX,
            p: gameP,
            mean: gameMean,
            meanLabel: `E(X) = ${f2(gameMean)}`,
            xLabel: 'Profit in THB',
            yLabel: 'Probability'
          }
        }
      ]
    },
    {
      id: 'binomial',
      eyebrow: 'Chapter 5 · 5.3 The binomial distribution',
      title: 'The binomial distribution',
      minutes: 14,
      blocks: [
        {
          type: 'text',
          body: [
            'A **binomial experiment** has four properties: ① **n** identical trials ② each trial has two outcomes, “success” or “failure” ③ the chance of success **p** is the same on every trial ④ the trials are **independent**.',
            'Then X = the number of successes has the **binomial distribution**: **P(X = x) = C(n, x) · pˣ · (1 − p)ⁿ⁻ˣ**. C(n, x) counts the orders in which the x successes can happen (Chapter 4), and pˣ(1 − p)ⁿ⁻ˣ is the probability of each such order.',
            'Its mean is **μ = np** and standard deviation **σ = √(np(1 − p))**.',
            `**Example:** ${couponP * 100}% of customers use a coupon. Of the next **${couponN}** customers, what is the chance that exactly 2 use one? P(X = 2) = C(6, 2)(0.2)²(0.8)⁴ = 15 × 0.04 × 0.4096 = **${f4(couponPs[2]!)}**.`
          ]
        },
        {
          type: 'table',
          columns: ['x', 'C(6, x)', 'P(X = x)'],
          rows: couponXs.map((x, i) => [
            String(x),
            String([1, 6, 15, 20, 15, 6, 1][i]),
            f4(couponPs[i]!)
          ])
        },
        {
          type: 'chart',
          title: `Binomial distribution, n = ${couponN}, p = ${couponP}`,
          chart: {
            kind: 'pmf',
            x: couponXs,
            p: couponPs,
            highlight: [2],
            mean: couponN * couponP,
            meanLabel: `μ = np = ${f2(couponN * couponP)}`,
            xLabel: 'Customers using a coupon (x)',
            yLabel: 'P(X = x)'
          },
          caption: `The most likely result is 1 coupon user; the mean is np = ${f2(couponN * couponP)} and σ = √(6 × 0.2 × 0.8) = ${f4(Math.sqrt(couponN * couponP * (1 - couponP)))}.`
        },
        {
          type: 'chart',
          title: 'Explore: change n and p',
          chart: { kind: 'explorer', distribution: 'binomial', n: 10, p: 0.3 },
          caption:
            'With p = 0.5 the bars are symmetric. With small p they bunch on the left (skewed right); with large p, on the right. Increasing n moves the mean np to the right and spreads the distribution.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Binomial probabilities in Python',
          code: py`
from math import comb

n, p = ${couponN}, ${couponP}
for x in range(n + 1):
    prob = comb(n, x) * p**x * (1 - p)**(n - x)
    print(x, round(prob, 4))
print("mean =", round(n * p, 2))
`,
          output: [
            ...couponXs.map((x, i) => `${x} ${round(couponPs[i]!, 4)}`),
            `mean = ${round(couponN * couponP, 2)}`
          ].join('\n')
        }
      ]
    },
    {
      id: 'binomial-inference',
      eyebrow: 'Chapter 5 · 5.3 Using the binomial',
      title: 'Using probability to test a claim',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            `A supplier claims that only **${leakP * 100}%** of its bottles leak. We inspect **${leakN}** bottles and find **${leakSeen}** leaking. Is the claim believable?`,
            `**Logic of a rare event:** suppose the claim is true (p = ${leakP}). Then X, the number of leaking bottles out of ${leakN}, is binomial. How likely is a result **as extreme as ours** — 4 or more? P(X ≥ 4) = 1 − [P(0) + P(1) + P(2) + P(3)] = **${f4(leakTail)}**.`,
            `That is about **${fixed(leakTail * 1000, 0)} in 1,000**. If the claim were true, we would almost never see 4 or more leaks. So we have **strong evidence that the true leak rate is higher than 5%**. This way of thinking — “if the claim were true, would our result be very unusual?” — is the basis of hypothesis testing in later chapters.`
          ]
        },
        {
          type: 'table',
          columns: ['x leaking', 'P(X = x) if p = 0.05'],
          rows: leakXs.map((x, i) => [String(x), f4(leakPs[i]!)])
        },
        {
          type: 'chart',
          title: 'If the claim is true: P(X ≥ 4) is the orange tail',
          chart: {
            kind: 'pmf',
            x: leakXs,
            p: leakPs,
            highlight: [4, 5, 6, 7, 8],
            mean: leakN * leakP,
            meanLabel: `μ = ${f2(leakN * leakP)}`,
            xLabel: 'Leaking bottles out of 20',
            yLabel: 'P(X = x)'
          },
          caption:
            'If leaks really were 5%, we would expect about 1 leaking bottle in 20. The orange bars (4 or more) are almost invisible — and that is exactly what we observed.'
        }
      ]
    },
    {
      id: 'poisson',
      eyebrow: 'Chapter 5 · 5.4 The Poisson distribution',
      title: 'The Poisson distribution: counts in an interval',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            'The **Poisson distribution** describes the **number of times an event happens in an interval** of time or space — calls per hour, typing errors per page, customers per minute — when events happen independently and the average rate μ is constant.',
            '**P(X = x) = e^(−μ) · μˣ ÷ x!**, for x = 0, 1, 2, … (e ≈ 2.71828). Its mean is **μ** and its standard deviation is **√μ**.',
            `**Example:** a delivery shop gets on average **μ = ${callsMu} calls per hour**. P(exactly 2 calls) = e⁻⁴ · 4² ÷ 2! = 0.0183 × 16 ÷ 2 = **${f4(callsPs[2]!)}**.`
          ]
        },
        {
          type: 'table',
          columns: ['Calls x', 'P(X = x)'],
          rows: callsXs.slice(0, 11).map((x, i) => [String(x), f4(callsPs[i]!)])
        },
        {
          type: 'chart',
          title: `Poisson distribution, μ = ${callsMu}`,
          chart: {
            kind: 'pmf',
            x: callsXs,
            p: callsPs,
            highlight: [9, 10, 11, 12],
            mean: callsMu,
            meanLabel: `μ = ${callsMu}`,
            xLabel: 'Calls in one hour (x)',
            yLabel: 'P(X = x)'
          },
          caption: `Most hours bring 2 to 6 calls. P(9 or more calls) = **${f4(callsAtLeast9)}** (orange). If the shop suddenly got 9 calls in an hour, that would be very unusual for an average of 4 — a sign that something has changed.`
        },
        {
          type: 'chart',
          title: 'Explore: change the average μ',
          chart: { kind: 'explorer', distribution: 'poisson', mu: 4 },
          caption:
            'Small μ: most hours have 0 or 1 event and the shape is strongly skewed right. As μ grows, the distribution moves right and becomes more symmetric.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Poisson probabilities in Python',
          code: py`
from math import exp, factorial

mu = ${callsMu}
for x in range(9):
    print(x, round(exp(-mu) * mu**x / factorial(x), 4))
`,
          output: callsXs
            .slice(0, 9)
            .map((x, i) => `${x} ${round(callsPs[i]!, 4)}`)
            .join('\n')
        }
      ]
    },
    {
      id: 'hypergeometric',
      eyebrow: 'Chapter 5 · 5.5 The hypergeometric distribution',
      title: 'The hypergeometric distribution: sampling without replacement',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'The binomial needs the chance of success to stay the same. That fails when we take a sample **without putting items back** from a **small** population: every draw changes what is left.',
            '**Hypergeometric:** a population of N items has r “successes”. Draw n without replacement. **P(X = x) = C(r, x) · C(N − r, n − x) ÷ C(N, n)**: ways to choose x successes and n − x failures, divided by all ways to choose n.',
            `**Example:** a box of **${boxN}** phones has **${boxFaulty}** faulty ones. A buyer checks **${boxDraw}** at random. P(no faulty phone found) = C(3, 0)·C(9, 4) ÷ C(12, 4) = 1 × 126 ÷ 495 = **${f4(hyperPs[0]!)}**.`
          ]
        },
        {
          type: 'table',
          columns: [
            'Faulty found x',
            'Hypergeometric P(X = x)',
            'Binomial approximation (p = 3/12)'
          ],
          rows: hyperXs.map((x, i) => [String(x), f4(hyperPs[i]!), f4(binomApprox[i]!)])
        },
        {
          type: 'chart',
          title: 'Faulty phones found when checking 4 of 12',
          chart: {
            kind: 'pmf',
            x: hyperXs,
            p: hyperPs,
            mean: (boxDraw * boxFaulty) / boxN,
            meanLabel: `μ = n·r/N = ${f2((boxDraw * boxFaulty) / boxN)}`,
            xLabel: 'Faulty phones found (x)',
            yLabel: 'P(X = x)'
          },
          caption: `There is a ${fixed(hyperPs[0]! * 100, 1)}% chance the buyer misses all 3 faulty phones. The binomial gives a different answer (${f4(binomApprox[0]!)}) because the population is so small that each draw really changes the odds. When N is large compared with n, the two become almost equal.`
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
          question: 'Which is a discrete random variable?',
          options: [
            'The height of a student',
            'The number of emails received today',
            'The time to run 100 m',
            'The weight of a parcel'
          ],
          answer: 1,
          explanation:
            'Emails can be counted (0, 1, 2, …). The others are measured and can take any value in an interval.'
        },
        {
          type: 'quiz',
          question: 'X takes the values 0 and 10 with probabilities 0.6 and 0.4. What is E(X)?',
          options: ['5', '4', '6', '10'],
          answer: 1,
          explanation: 'E(X) = 0(0.6) + 10(0.4) = 4.'
        },
        {
          type: 'quiz',
          question:
            'A test has 10 multiple-choice questions with 4 options each. A student guesses every answer. Which distribution describes the number of correct answers?',
          options: [
            'Poisson with μ = 10',
            'Binomial with n = 10, p = 0.25',
            'Hypergeometric',
            'Binomial with n = 4, p = 0.10'
          ],
          answer: 1,
          explanation:
            '10 independent trials, each correct with probability 1/4: binomial, n = 10, p = 0.25. Expected score np = 2.5.'
        },
        {
          type: 'quiz',
          question:
            'A website gets on average 3 sign-ups per hour. Which distribution models sign-ups in one hour?',
          options: ['Binomial', 'Poisson with μ = 3', 'Hypergeometric', 'Normal'],
          answer: 1,
          explanation: 'Counting events in an interval with a constant average rate: Poisson.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework: a guessing test',
          body: 'For the 10-question guessing test above, compute P(X = x) for x = 0 to 10 with the binomial formula, draw the distribution, and find P(X ≥ 6). If a student scored 6 or more, would you believe they were only guessing? Explain using the rare-event logic.'
        }
      ]
    }
  ]
}

export default stats5
