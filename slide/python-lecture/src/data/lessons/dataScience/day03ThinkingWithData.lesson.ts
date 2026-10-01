import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day3: Lesson = {
  id: 'ds-3',
  track: 'data-science',
  day: 3,
  title: 'Thinking with data: chance, bias and cause',
  summary:
    'Probability, expected value, sampling and survivorship bias, correlation vs causation, experiments, Simpson’s paradox and a first look at machine learning.',
  durationMinutes: 75,
  topics: [
    'Probability',
    'Bias',
    'Correlation vs causation',
    'A/B tests',
    'Simpson’s paradox',
    'Machine learning'
  ],
  available: true,
  sections: [
    {
      id: 'probability',
      eyebrow: 'Theory',
      title: 'Probability: measuring uncertainty',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'A **probability** is a number from 0 (impossible) to 1 (certain). For equally likely outcomes: P(event) = favourable outcomes ÷ all outcomes. When you can’t count outcomes, you can **simulate** them — run the random process thousands of times and count.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Two dice: why 7 is the most common total',
          code: py`
import numpy as np

rng = np.random.default_rng(3)
rolls = rng.integers(1, 7, size=(100_000, 2)).sum(axis=1)

for total in range(2, 13):
    simulated = np.mean(rolls == total)
    ways = 6 - abs(total - 7)                     # ways to make this total
    print(f"{total:>2}: simulated {simulated:.3f} | exact {ways}/36 = {ways / 36:.3f}")
`
        },
        {
          type: 'analogy',
          title: '“70% chance of rain”',
          body: 'It doesn’t mean it will rain for 70% of the day. It means: on days with conditions like today’s, it rained on about 7 out of 10 of them. Probability describes the long run, not one single day.'
        }
      ]
    },
    {
      id: 'expected-value',
      eyebrow: 'Theory',
      title: 'Expected value: the long-run average',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            '**Expected value** = Σ (outcome × its probability). It is what you would average per try if you repeated the situation many times. Businesses use it to price insurance, promotions and risky projects.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Should the café run a “scratch card” promotion?',
          code: py`
import numpy as np

# Each card costs the customer 20 THB. Prizes and their probabilities:
prizes = np.array([0, 20, 100, 1000])
probs = np.array([0.80, 0.15, 0.04, 0.01])

expected_prize = (prizes * probs).sum()
print(f"expected prize per card: {expected_prize} THB")
print(f"expected profit per card for the café: {20 - expected_prize} THB")

rng = np.random.default_rng(0)
simulated = rng.choice(prizes, size=10_000, p=probs)
print(f"average prize over 10,000 simulated cards: {simulated.mean():.2f} THB")
`
        },
        {
          type: 'case',
          domain: 'Insurance',
          title: 'How premiums are priced',
          problem: 'Charge enough to pay claims, but stay cheaper than competitors.',
          data: 'Millions of past policies: who claimed, how often, how much.',
          method:
            'Expected claim cost per customer = P(claim) × average claim size, plus costs and margin.',
          outcome: 'A young driver with a high claim probability pays more than an experienced one.'
        }
      ]
    },
    {
      id: 'bias',
      eyebrow: 'Theory',
      title: 'When samples lie: sampling and survivorship bias',
      minutes: 10,
      blocks: [
        {
          type: 'case',
          domain: 'History · 1936 US election',
          title: 'The biggest poll that got it wrong',
          problem: 'The Literary Digest magazine wanted to predict Roosevelt vs Landon.',
          data: 'Over two million replies — from its readers, telephone directories and car owners.',
          method:
            'Huge sample, but in the Great Depression phones and cars were for the better-off.',
          outcome:
            'It predicted a Landon win; Roosevelt won by a landslide. A biased big sample beats nothing — but loses to a small fair one.'
        },
        {
          type: 'case',
          domain: 'History · World War II',
          title: 'Armour the planes where the holes AREN’T',
          problem:
            'Where should bombers get extra armour? Returning planes were full of bullet holes on the wings and body.',
          data: 'Only planes that came BACK could be inspected.',
          method:
            'Statistician Abraham Wald pointed out the missing data: planes hit in other places (like engines) never returned.',
          outcome:
            'Armour the areas with NO holes on survivors. This trap is called survivorship bias.'
        },
        {
          type: 'table',
          columns: ['Bias', 'What goes wrong', 'Everyday example'],
          rows: [
            [
              'Sampling bias',
              'The sample isn’t like the population',
              'An online poll only reaches people online'
            ],
            [
              'Survivorship bias',
              'You only see the successes',
              '“Dropouts become billionaires” — ignoring the millions who didn’t'
            ],
            [
              'Self-selection',
              'People choose whether to respond',
              'Reviews come mostly from the very happy and the very angry'
            ],
            [
              'Confirmation bias',
              'You look for data that agrees with you',
              'Only checking the months when the promotion worked'
            ]
          ]
        },
        {
          type: 'analogy',
          title: 'The soup again',
          body: 'A huge spoonful from only the top of an unstirred pot still tastes like oil. Size doesn’t fix bias — stirring (random sampling) does.'
        }
      ]
    },
    {
      id: 'causation',
      eyebrow: 'Theory',
      title: 'Correlation is not causation',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'When A and B move together there are four possible stories: **A causes B**, **B causes A** (reverse causation), **C causes both** (a confounder), or **coincidence**. Data alone often can’t tell them apart.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'A hidden confounder: hot weather',
          code: py`
import numpy as np
import pandas as pd

rng = np.random.default_rng(5)
temperature = rng.uniform(22, 38, 365)                          # daily max °C
ice_cream = 20 + 6 * temperature + rng.normal(0, 15, 365)       # driven by heat
swimming_accidents = 0.3 * temperature + rng.normal(0, 1.5, 365)  # also driven by heat

df = pd.DataFrame({"temperature": temperature, "ice_cream": ice_cream,
                   "accidents": swimming_accidents})
print("overall correlation:", round(df["ice_cream"].corr(df["accidents"]), 2))

df["temp_band"] = pd.cut(df["temperature"], bins=[22, 26, 30, 34, 38])
within = df.groupby("temp_band", observed=True)[["ice_cream", "accidents"]].apply(
    lambda days: days["ice_cream"].corr(days["accidents"])
)
print("correlation inside each temperature band (°C):")
print(within.round(2).to_string())
`
        },
        {
          type: 'text',
          body: [
            'Across the whole year, ice cream and accidents look strongly linked. Compare only days with similar temperatures and the link almost disappears — temperature was driving both.'
          ]
        },
        {
          type: 'analogy',
          title: 'Firefighters and damage',
          body: 'The more firefighters at a fire, the more damage is done. Firefighters don’t cause damage — big fires cause both more damage AND more firefighters.'
        }
      ],
      notes: 'Play the “Correlation or causation?” game right after this section.'
    },
    {
      id: 'experiments',
      eyebrow: 'Theory',
      title: 'Experiments: how to prove a cause',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'To show that A causes B, **randomly** split people into groups, change A for one group only, and compare B. Randomisation spreads every hidden factor (age, wealth, mood…) evenly across the groups, so the only systematic difference left is A.'
          ]
        },
        {
          type: 'case',
          domain: 'Websites & apps',
          title: 'A/B testing a “Buy” button',
          problem: 'Will a new checkout button sell more?',
          data: 'Visitors randomly shown version A (old) or B (new); who bought.',
          method: 'Compare conversion rates and check the difference is bigger than chance.',
          outcome: 'Companies run many such tests and keep only the changes that clearly win.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Is 12% really better than 10%? Simulate the noise',
          code: py`
import numpy as np

rng = np.random.default_rng(11)
visitors = 1000
true_a, true_b = 0.10, 0.12

for experiment in range(1, 6):
    a = rng.binomial(visitors, true_a) / visitors
    b = rng.binomial(visitors, true_b) / visitors
    winner = "B" if b > a else "A"
    print(f"run {experiment}: A {a:.1%} | B {b:.1%} -> {winner} looks better")

# How often does the truly better version lose by chance?
a = rng.binomial(visitors, true_a, 10_000)
b = rng.binomial(visitors, true_b, 10_000)
print(f"B loses or ties in {np.mean(b <= a):.0%} of 10,000 repeated experiments")
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lesson',
          body: 'Even when B is truly better, a 1,000-visitor test picks the wrong winner a noticeable share of the time. Bigger samples (and significance tests) reduce that risk. Medicine’s version is the randomised controlled trial.'
        }
      ]
    },
    {
      id: 'simpson',
      eyebrow: 'Theory',
      title: 'Simpson’s paradox: when the total lies',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            'A well-known 1986 study compared two kidney-stone treatments. Treatment A won for small stones AND for large stones — yet B looked better overall. How?'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

stones = pd.DataFrame({
    "treatment": ["A", "A", "B", "B"],
    "stone": ["small", "large", "small", "large"],
    "patients": [87, 263, 270, 80],
    "successes": [81, 192, 234, 55],
})
stones["success_%"] = (stones["successes"] / stones["patients"] * 100).round(1)
print(stones)

overall = stones.groupby("treatment")[["successes", "patients"]].sum()
overall["success_%"] = (overall["successes"] / overall["patients"] * 100).round(1)
print(overall)
`
        },
        {
          type: 'text',
          body: [
            'Doctors gave treatment A mostly to the **hard** cases (large stones), which fail more often whichever treatment is used. Pooling everything mixes treatment quality with case difficulty. **Always ask: what groups are hiding inside this total?**'
          ]
        }
      ]
    },
    {
      id: 'machine-learning',
      eyebrow: 'Theory + first model',
      title: 'A first look at machine learning',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            '**Machine learning (ML)** means letting the computer find the rule from examples, instead of writing the rule yourself. You give it inputs with known answers (**training data**), it learns a pattern, and you check it on examples it has never seen (**test data**).'
          ]
        },
        {
          type: 'table',
          columns: ['Technique', 'Learns from', 'Answers', 'Real-world example'],
          rows: [
            [
              'Classification',
              'Labelled examples',
              'Which category? (yes/no, spam/not)',
              'Spam filter; will this patient be readmitted?'
            ],
            [
              'Regression',
              'Labelled examples',
              'How much? (a number)',
              'House price; delivery time in minutes'
            ],
            [
              'Clustering',
              'Unlabelled data',
              'Which items are similar?',
              'Customer segments for marketing'
            ],
            [
              'Recommendation',
              'Behaviour of many users',
              'What will this person like?',
              '“Customers also bought…”'
            ],
            [
              'Time-series forecasting',
              'Values over time',
              'What comes next?',
              'Electricity demand next week'
            ],
            [
              'Anomaly detection',
              'Mostly normal data',
              'Is this unusual?',
              'Card fraud; machine failure'
            ]
          ]
        },
        {
          type: 'analogy',
          title: 'Studying for an exam',
          body: 'A student who memorises last year’s answers scores 100% on last year’s paper and fails the new one — that is overfitting. A student who learns the method does well on both. That is why we always test a model on data it did not train on.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Your first model: predict a score from study hours',
          code: py`
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

students = pd.read_csv("students.csv")
train, test = students.iloc[:30], students.iloc[30:]          # learn on 30, test on 10

slope, intercept = np.polyfit(train["hours_studied"], train["score"], deg=1)
print(f"learned rule: score = {slope:.1f} x hours + {intercept:.1f}")

predicted = slope * test["hours_studied"] + intercept
error = (predicted - test["score"]).abs().mean()
print(f"average error on 10 unseen students: {error:.1f} points")
print(f"prediction for 6 hours of study: {slope * 6 + intercept:.0f} points")

fig, ax = plt.subplots()
ax.scatter(train["hours_studied"], train["score"], label="training data")
ax.scatter(test["hours_studied"], test["score"], marker="s", label="test data")
xs = np.linspace(0, 10, 50)
ax.plot(xs, slope * xs + intercept, color="#B03A1E", label="learned line")
ax.set_xlabel("Hours studied per week")
ax.set_ylabel("Score")
ax.set_title("A straight-line model of study hours vs score")
ax.legend()
plt.show()
`
        }
      ],
      notes:
        'This is linear regression in its simplest form. Later, scikit-learn does the same with many inputs. The key ideas to land: train/test split, and error measured on unseen data.'
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
            'Students who use a tutoring service have LOWER grades. Most likely explanation?',
          options: [
            'Tutoring makes grades worse',
            'Reverse causation: struggling students seek tutoring',
            'Pure coincidence',
            'The grades were recorded wrongly'
          ],
          answer: 1,
          explanation: 'Low grades lead students to tutoring, not the other way round.'
        },
        {
          type: 'quiz',
          question:
            'A bank wants to group customers into types without any labels. Which technique?',
          options: ['Classification', 'Regression', 'Clustering', 'Time-series forecasting'],
          answer: 2,
          explanation: 'Finding natural groups in unlabelled data is clustering.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework',
          body: 'Find one news headline that claims “X linked to Y”. Write the four possible explanations (A→B, B→A, a confounder, chance) and describe an experiment that could tell them apart.'
        }
      ]
    }
  ]
}

export default day3
