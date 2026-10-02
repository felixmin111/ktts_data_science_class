import type { Lesson } from '@/models/lesson.model'
import { choose, crossTab, fixed, permutations, round } from '@/functions/stats.function'
import { py } from '../py'
import { branch, satisfaction } from './stats/statsData'

// ---- Example data (invented for teaching) -------------------------------------------------------

const die = [1, 2, 3, 4, 5, 6]
/** Two-dice sample space: cell text and whether the cell is in an event. */
export function diceGrid(event: (a: number, b: number) => boolean) {
  return {
    rows: die.map(String),
    columns: die.map(String),
    cells: die.map((a) => die.map((b) => `${a},${b}`)),
    highlight: die.map((a) => die.map((b) => event(a, b)))
  }
}
export const sum7 = (a: number, b: number) => a + b === 7
export const doubles = (a: number, b: number) => a === b

/** Social media survey of 200 students. */
export const social = { total: 200, tiktok: 120, facebook: 90, both: 50 }
export const socialEither = social.tiktok + social.facebook - social.both

/** The café branch survey from Chapter 2, used as a contingency table. */
export const branches = ['Downtown', 'Campus', 'Station']
export const levels = ['High', 'Medium', 'Low']
export const tab = crossTab(branch, satisfaction, branches, levels)

/** Medical test (Bayes): prevalence, sensitivity, false-positive rate. */
export const prevalence = 0.01
export const sensitivity = 0.95
export const falsePositive = 0.05
export const pPositive = prevalence * sensitivity + (1 - prevalence) * falsePositive
export const pDiseaseGivenPositive = (prevalence * sensitivity) / pPositive

/** Defect rate for the multiplication rule. */
export const defectRate = 0.04

const f3 = (v: number) => fixed(v, 3)
const f4 = (v: number) => fixed(v, 4)

// ---- The lesson -------------------------------------------------------------------------------

const stats4: Lesson = {
  id: 'ds-stats-4',
  track: 'data-science',
  day: 5,
  title: 'Statistics 4: probability',
  summary:
    'What probability means, sample spaces and events, the complement, addition and multiplication rules, conditional probability and independence, Bayes’ theorem and counting rules — with dice simulations, Venn diagrams and probability trees.',
  durationMinutes: 100,
  topics: [
    'Probability',
    'Sample spaces',
    'Addition rule',
    'Conditional probability',
    'Independence',
    'Bayes’ theorem',
    'Counting rules'
  ],
  available: true,
  sections: [
    {
      id: 'probability',
      eyebrow: 'Chapter 4 · 4.1 The concept of probability',
      title: 'What is a probability?',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'An **experiment** is any process whose result is uncertain: tossing a coin, rolling a die, asking a customer a question. The **probability** of an outcome is a number from **0** (impossible) to **1** (certain) that measures how likely it is. The probabilities of all the outcomes add up to 1.',
            'There are three ways to find a probability:',
            '**① Classical method** — when all outcomes are **equally likely**, use logic: P = (number of outcomes in the event) ÷ (total number of outcomes). A fair die: P(6) = 1/6.',
            '**② Relative frequency method** — repeat the experiment many times and use the share of times the outcome happened. If 140 of 1,000 surveyed customers prefer iced tea, P ≈ 140/1,000 = 0.14.',
            '**③ Subjective method** — use experience or expert judgement when the experiment cannot be repeated: “I think this new branch has a 70% chance of success.”'
          ]
        },
        {
          type: 'table',
          columns: ['Method', 'When to use', 'Example'],
          rows: [
            ['Classical', 'All outcomes equally likely', 'P(head) = 1/2; P(6 on a die) = 1/6'],
            [
              'Relative frequency',
              'We can repeat or observe many times',
              '140 of 1,000 customers → 0.14'
            ],
            ['Subjective', 'A one-off situation', 'A manager’s judgement of 0.7']
          ]
        },
        {
          type: 'chart',
          title: 'Try it: relative frequency settles down to the probability',
          chart: { kind: 'simulation', experiment: 'die', eventLabel: 'Number of 6s' },
          caption:
            'Roll a few times: the share of 6s jumps around. Roll thousands of times: it settles close to 1/6 ≈ 0.167. This is the **long-run relative frequency** idea of probability, and it is the meaning used for statistical inference in later chapters.'
        }
      ]
    },
    {
      id: 'sample-space',
      eyebrow: 'Chapter 4 · 4.2 Sample spaces and events',
      title: 'Sample spaces and events',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'The **sample space** is the list of **all** possible outcomes of an experiment. An **event** is a set of outcomes.',
            'Rolling two dice has 6 × 6 = **36** equally likely outcomes, shown below as (first die, second die). The event “the total is 7” contains the 6 highlighted outcomes, so by the classical method P(total = 7) = 6/36 = **1/6 ≈ 0.167**.'
          ]
        },
        {
          type: 'chart',
          title: 'Sample space of two dice — event: total = 7',
          chart: {
            kind: 'grid',
            ...diceGrid(sum7),
            rowLabel: 'Die 1 \\ Die 2',
            columnLabel: 'Second die'
          },
          caption:
            'Every cell is one outcome. Counting the highlighted cells and dividing by 36 gives the probability.'
        },
        {
          type: 'table',
          columns: ['Total', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          rows: [
            ['Outcomes', '1', '2', '3', '4', '5', '6', '5', '4', '3', '2', '1'],
            ['Probability', ...[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((k) => f3(k / 36))]
          ]
        },
        {
          type: 'chart',
          title: 'Probability of each total',
          chart: {
            kind: 'pmf',
            x: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            p: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((k) => k / 36),
            highlight: [7],
            xLabel: 'Total of two dice',
            yLabel: 'Probability'
          },
          caption:
            '7 is the most likely total because the most cells add up to 7. The 11 probabilities add up to 36/36 = 1.'
        },
        {
          type: 'chart',
          title: 'Check it by simulation: total = 7',
          chart: { kind: 'simulation', experiment: 'twoDice', eventLabel: 'Totals of 7' }
        }
      ]
    },
    {
      id: 'complement-addition',
      eyebrow: 'Chapter 4 · 4.3 Probability rules',
      title: 'The complement and addition rules',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            '**Complement:** “not A” is everything outside A, written Ā. Because something must happen, **P(Ā) = 1 − P(A)**. With two dice, P(a double) = 6/36, so P(not a double) = 1 − 6/36 = **30/36 ≈ 0.833**.',
            '**Union and intersection:** “A **or** B” (A ∪ B) means A, B or both happen. “A **and** B” (A ∩ B) means both happen.',
            '**Addition rule:** P(A or B) = P(A) + P(B) − P(A and B). We subtract the overlap because adding P(A) and P(B) counts it twice.'
          ]
        },
        {
          type: 'table',
          columns: ['Survey of 200 students', 'Count', 'Probability'],
          rows: [
            [
              'Use TikTok (A)',
              String(social.tiktok),
              `${social.tiktok}/200 = ${fixed(social.tiktok / 200, 2)}`
            ],
            [
              'Use Facebook (B)',
              String(social.facebook),
              `${social.facebook}/200 = ${fixed(social.facebook / 200, 2)}`
            ],
            [
              'Use both (A and B)',
              String(social.both),
              `${social.both}/200 = ${fixed(social.both / 200, 2)}`
            ],
            [
              'Use TikTok or Facebook (A or B)',
              `${social.tiktok} + ${social.facebook} − ${social.both} = ${socialEither}`,
              `${fixed(socialEither / 200, 2)}`
            ],
            ['Use neither', String(200 - socialEither), fixed((200 - socialEither) / 200, 2)]
          ]
        },
        {
          type: 'chart',
          title: 'Venn diagram: A or B (shaded)',
          chart: {
            kind: 'venn',
            a: 'TikTok (A)',
            b: 'Facebook (B)',
            shade: 'AorB',
            counts: {
              aOnly: social.tiktok - social.both,
              both: social.both,
              bOnly: social.facebook - social.both,
              neither: 200 - socialEither
            }
          },
          caption: `The numbers are students in each region: 70 TikTok only, 50 both, 40 Facebook only, 40 neither. The shaded area (A or B) holds 70 + 50 + 40 = ${socialEither} students, so P(A or B) = ${socialEither}/200 = **${fixed(socialEither / 200, 2)}**. Adding 120 + 90 would count the 50 in the middle twice.`
        },
        {
          type: 'chart',
          title: 'Other events on the same diagram',
          chart: {
            kind: 'gallery',
            charts: [
              { title: 'A and B', chart: { kind: 'venn', a: 'A', b: 'B', shade: 'AandB' } },
              { title: 'A but not B', chart: { kind: 'venn', a: 'A', b: 'B', shade: 'AnotB' } },
              {
                title: 'Not A (complement)',
                chart: { kind: 'venn', a: 'A', b: 'B', shade: 'notA' }
              }
            ]
          }
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Mutually exclusive events',
          body: 'If A and B **cannot happen together** (no overlap), they are **mutually exclusive**, P(A and B) = 0, and the rule becomes simply P(A or B) = P(A) + P(B). Example: one die showing 1 or showing 6: 1/6 + 1/6 = 2/6.'
        }
      ]
    },
    {
      id: 'contingency',
      eyebrow: 'Chapter 4 · 4.3 Probability rules',
      title: 'Probabilities from a contingency table',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            'The cross-tab of 90 café customers from Chapter 2 is also a **contingency table**. Choose one customer at random: each cell ÷ 90 is the probability of that **combination**, and each row or column total ÷ 90 is the probability of that **single** event.'
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
          type: 'table',
          columns: ['Event', 'Calculation', 'Probability'],
          rows: [
            ['High satisfaction', `${tab.columnTotals[0]} / 90`, f3(tab.columnTotals[0]! / 90)],
            ['Station', `${tab.rowTotals[2]} / 90`, f3(tab.rowTotals[2]! / 90)],
            ['Station and Low', `${tab.counts[2]![2]} / 90`, f3(tab.counts[2]![2]! / 90)],
            [
              'Station or Low',
              `(${tab.rowTotals[2]} + ${tab.columnTotals[2]} − ${tab.counts[2]![2]}) / 90`,
              f3((tab.rowTotals[2]! + tab.columnTotals[2]! - tab.counts[2]![2]!) / 90)
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Station or Low on a Venn diagram',
          chart: {
            kind: 'venn',
            a: 'Station',
            b: 'Low',
            shade: 'AorB',
            counts: {
              aOnly: tab.rowTotals[2]! - tab.counts[2]![2]!,
              both: tab.counts[2]![2]!,
              bOnly: tab.columnTotals[2]! - tab.counts[2]![2]!,
              neither: 90 - (tab.rowTotals[2]! + tab.columnTotals[2]! - tab.counts[2]![2]!)
            }
          },
          caption:
            'The addition rule again: the 12 customers who are both at Station and Low are counted only once.'
        }
      ]
    },
    {
      id: 'conditional',
      eyebrow: 'Chapter 4 · 4.4 Conditional probability',
      title: 'Conditional probability and independence',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            'A **conditional probability** P(A | B) — “A **given** B” — is the probability of A when we already know B happened. Knowing B shrinks the sample space to B only: **P(A | B) = P(A and B) ÷ P(B)**.',
            `**Example:** we pick a customer and are told they are from Campus. P(High | Campus) = P(High and Campus) ÷ P(Campus) = (${tab.counts[1]![0]}/90) ÷ (${tab.rowTotals[1]}/90) = ${tab.counts[1]![0]}/${tab.rowTotals[1]} = **${f3(tab.counts[1]![0]! / tab.rowTotals[1]!)}**. In the table, we simply look only at the Campus row.`,
            '**Independence:** A and B are **independent** if knowing B does not change the chance of A: **P(A | B) = P(A)**. Otherwise they are **dependent**.'
          ]
        },
        {
          type: 'table',
          columns: ['Probability', 'Value', 'Meaning'],
          rows: [
            ['P(High)', f3(tab.columnTotals[0]! / 90), 'Any customer'],
            [
              'P(High | Downtown)',
              f3(tab.counts[0]![0]! / tab.rowTotals[0]!),
              'Only Downtown customers'
            ],
            [
              'P(High | Campus)',
              f3(tab.counts[1]![0]! / tab.rowTotals[1]!),
              'Only Campus customers'
            ],
            [
              'P(High | Station)',
              f3(tab.counts[2]![0]! / tab.rowTotals[2]!),
              'Only Station customers'
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Does knowing the branch change P(High)?',
          chart: {
            kind: 'bar',
            categories: ['P(High)', 'given Downtown', 'given Campus', 'given Station'],
            values: [
              round(tab.columnTotals[0]! / 90, 3),
              round(tab.counts[0]![0]! / tab.rowTotals[0]!, 3),
              round(tab.counts[1]![0]! / tab.rowTotals[1]!, 3),
              round(tab.counts[2]![0]! / tab.rowTotals[2]!, 3)
            ],
            yLabel: 'Probability of high satisfaction',
            highlight: [0]
          },
          caption: `Overall P(High) = ${f3(tab.columnTotals[0]! / 90)}, but it is ${f3(tab.counts[1]![0]! / tab.rowTotals[1]!)} at Campus and only ${f3(tab.counts[2]![0]! / tab.rowTotals[2]!)} at Station. Knowing the branch **changes** the probability, so satisfaction and branch are **dependent**.`
        },
        {
          type: 'callout',
          tone: 'success',
          title: 'An independent example',
          body: 'Roll two dice. P(second die is 6) = 1/6, and P(second die is 6 | first die is 6) is still 1/6 — the dice do not affect each other. These events are independent.'
        }
      ]
    },
    {
      id: 'multiplication',
      eyebrow: 'Chapter 4 · 4.4 Multiplication rule',
      title: 'The multiplication rule and probability trees',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            '**Multiplication rule:** P(A and B) = P(A) × P(B | A). If A and B are **independent**, this is simply **P(A) × P(B)**.',
            `A machine makes **${defectRate * 100}%** defective items, independently of each other. Check two items. A **probability tree** lists every path: multiply along a path to get its probability, then add the paths that make up your event.`
          ]
        },
        {
          type: 'chart',
          title: 'Two items checked — paths with exactly one defective highlighted',
          chart: {
            kind: 'tree',
            branches: [
              {
                label: 'Defective',
                p: defectRate,
                children: [
                  { label: 'Defective', p: defectRate },
                  { label: 'OK', p: 1 - defectRate }
                ]
              },
              {
                label: 'OK',
                p: 1 - defectRate,
                children: [
                  { label: 'Defective', p: defectRate },
                  { label: 'OK', p: 1 - defectRate }
                ]
              }
            ],
            highlight: ['0-1', '1-0'],
            decimals: 2
          }
        },
        {
          type: 'table',
          columns: ['Event', 'Calculation', 'Probability'],
          rows: [
            ['Both defective', `${defectRate} × ${defectRate}`, f4(defectRate ** 2)],
            [
              'Exactly one defective',
              `${defectRate} × ${1 - defectRate} + ${1 - defectRate} × ${defectRate}`,
              f4(2 * defectRate * (1 - defectRate))
            ],
            ['Both OK', `${1 - defectRate} × ${1 - defectRate}`, f4((1 - defectRate) ** 2)],
            ['Total', '', '1.0000']
          ]
        }
      ]
    },
    {
      id: 'bayes',
      eyebrow: 'Chapter 4 · 4.5 Bayes’ theorem',
      title: 'Bayes’ theorem: updating a probability with new information',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            '**Bayes’ theorem** turns a **prior** probability (before new information) into a **posterior** probability (after it): **P(A | B) = P(A) · P(B | A) ÷ P(B)**, where P(B) comes from adding the tree paths that lead to B.',
            `**A medical test.** ${prevalence * 100}% of people have a disease (prior). The test is positive for ${sensitivity * 100}% of people who have it, but also for ${falsePositive * 100}% of healthy people. If your test is positive, how likely is it that you have the disease?`
          ]
        },
        {
          type: 'chart',
          title: 'Probability tree: disease, then test result',
          chart: {
            kind: 'tree',
            branches: [
              {
                label: 'Disease',
                p: prevalence,
                children: [
                  { label: 'Positive', p: sensitivity },
                  { label: 'Negative', p: 1 - sensitivity }
                ]
              },
              {
                label: 'Healthy',
                p: 1 - prevalence,
                children: [
                  { label: 'Positive', p: falsePositive },
                  { label: 'Negative', p: 1 - falsePositive }
                ]
              }
            ],
            highlight: ['0-0', '1-0'],
            decimals: 2
          }
        },
        {
          type: 'table',
          columns: ['Step', 'Calculation', 'Result'],
          rows: [
            [
              'P(positive and disease)',
              `${prevalence} × ${sensitivity}`,
              f4(prevalence * sensitivity)
            ],
            [
              'P(positive and healthy)',
              `${1 - prevalence} × ${falsePositive}`,
              f4((1 - prevalence) * falsePositive)
            ],
            ['P(positive)', 'add the two highlighted paths', f4(pPositive)],
            [
              'P(disease | positive)',
              `${f4(prevalence * sensitivity)} ÷ ${f4(pPositive)}`,
              f3(pDiseaseGivenPositive)
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Out of 10,000 people tested',
          chart: {
            kind: 'bar',
            categories: ['Positive and ill', 'Positive and healthy'],
            values: [
              Math.round(10000 * prevalence * sensitivity),
              Math.round(10000 * (1 - prevalence) * falsePositive)
            ],
            yLabel: 'People with a positive test',
            highlight: [0]
          },
          caption: `Only **${fixed(pDiseaseGivenPositive * 100, 1)}%** of positive results are real! Because the disease is rare, the 5% false positives among 9,900 healthy people (${Math.round(10000 * (1 - prevalence) * falsePositive)}) outnumber the true positives (${Math.round(10000 * prevalence * sensitivity)}). This is why doctors repeat a positive screening test.`
        }
      ]
    },
    {
      id: 'counting',
      eyebrow: 'Chapter 4 · 4.6 Counting rules',
      title: 'Counting rules',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'The classical method needs the **number** of outcomes. When there are too many to list, we count them with rules.',
            '**Multiplication principle:** if one choice can be made in m ways and a second in n ways, together there are **m × n** ways. A café offers 3 sizes and 4 drinks: 3 × 4 = **12** different orders.',
            `**Permutations** (order matters): arrange k of n items in order: **n! ÷ (n − k)!**. Choose a 1st, 2nd and 3rd prize from 10 students: 10 × 9 × 8 = **${permutations(10, 3)}**.`,
            `**Combinations** (order does not matter): choose k of n items: **n! ÷ (k!(n − k)!)**, written C(n, k). Choose any 3 students from 10 for a team: ${permutations(10, 3)} ÷ 3! = **${choose(10, 3)}**.`
          ]
        },
        {
          type: 'chart',
          title: 'Multiplication principle: 3 sizes × 4 drinks = 12 orders',
          chart: {
            kind: 'grid',
            rows: ['Small', 'Medium', 'Large'],
            columns: ['Tea', 'Coffee', 'Juice', 'Smoothie'],
            cells: ['S', 'M', 'L'].map((s) =>
              ['Tea', 'Coffee', 'Juice', 'Smoothie'].map((d) => `${s}-${d}`)
            ),
            highlight: [0, 1, 2].map(() => [true, true, true, true]),
            rowLabel: 'Size \\ Drink'
          }
        },
        {
          type: 'table',
          columns: ['Question', 'Rule', 'Calculation', 'Answer'],
          rows: [
            ['Sizes × drinks', 'Multiplication principle', '3 × 4', '12'],
            [
              '1st, 2nd, 3rd prize from 10',
              'Permutations',
              '10 × 9 × 8',
              String(permutations(10, 3))
            ],
            ['A team of 3 from 10', 'Combinations', '720 ÷ 6', String(choose(10, 3))],
            [
              'Lottery: 6 numbers from 45',
              'Combinations',
              'C(45, 6)',
              choose(45, 6).toLocaleString('en-US')
            ]
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Counting in Python',
          code: py`
import math

print("Orders:", 3 * 4)
print("Prize orders:", math.perm(10, 3))
print("Teams of 3:", math.comb(10, 3))
print("Lottery tickets:", math.comb(45, 6))
print("Chance one ticket wins:", f"{1 / math.comb(45, 6):.10f}")
`,
          output: `Orders: 12\nPrize orders: ${permutations(10, 3)}\nTeams of 3: ${choose(10, 3)}\nLottery tickets: ${choose(45, 6)}\nChance one ticket wins: ${fixed(1 / choose(45, 6), 10)}`
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
          question: 'P(rain tomorrow) = 0.3. What is P(no rain)?',
          options: ['0.3', '0.7', '1.3', 'Cannot tell'],
          answer: 1,
          explanation: 'Complement rule: 1 − 0.3 = 0.7.'
        },
        {
          type: 'quiz',
          question: 'P(A) = 0.5, P(B) = 0.4, P(A and B) = 0.2. What is P(A or B)?',
          options: ['0.9', '0.7', '0.2', '0.1'],
          answer: 1,
          explanation: 'Addition rule: 0.5 + 0.4 − 0.2 = 0.7.'
        },
        {
          type: 'quiz',
          question: 'Two events are independent. P(A) = 0.5 and P(B) = 0.2. What is P(A and B)?',
          options: ['0.7', '0.1', '0.3', '0.25'],
          answer: 1,
          explanation: 'For independent events, multiply: 0.5 × 0.2 = 0.1.'
        },
        {
          type: 'quiz',
          question:
            'How many ways can you choose 2 of 5 books to take on a trip (order does not matter)?',
          options: ['10', '20', '25', '120'],
          answer: 0,
          explanation: 'Combinations: C(5, 2) = 5 × 4 ÷ 2 = 10.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework: test Bayes',
          body: 'Change the medical test numbers: what happens to P(disease | positive) if 10% of people have the disease? If the false-positive rate drops to 1%? Draw the tree for each case, then check your answers with a few lines of Python.'
        }
      ]
    }
  ]
}

export default stats4
