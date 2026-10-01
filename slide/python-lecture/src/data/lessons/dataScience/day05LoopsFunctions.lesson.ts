import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day5: Lesson = {
  id: 'ds-5',
  track: 'data-science',
  day: 5,
  title: 'Decisions, loops and functions for data',
  summary:
    'if/else, for loops, comprehensions and functions — the logic that pandas later does for you, so you know what it is doing.',
  durationMinutes: 60,
  topics: ['if / elif / else', 'for loops', 'Accumulators', 'Comprehensions', 'Functions'],
  available: true,
  sections: [
    {
      id: 'conditions',
      eyebrow: 'Decisions',
      title: 'if / elif / else: let the data decide',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            'A comparison (`>`, `<`, `>=`, `==`, `!=`) produces a **bool**: `True` or `False`. `if` runs a block only when its condition is True. The **indentation** (4 spaces) marks which lines belong to the block.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
revenue = 420

if revenue >= 500:
    label = "Great day"
elif revenue >= 300:
    label = "Normal day"
else:
    label = "Slow day"

print(revenue >= 500, revenue >= 300)
print(label)
`
        },
        {
          type: 'analogy',
          title: 'Airport security lanes',
          body: 'Each passenger is checked against the lanes in order — “diplomat?”, “crew?”, otherwise “everyone else”. The first lane that matches wins, and the rest are skipped. That is exactly how elif works.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Combine conditions with and / or / not',
          code: py`
branch = "Campus"
quantity = 3

if branch == "Campus" and quantity >= 3:
    print("Student bulk discount!")
if not branch == "Downtown":
    print("Outside the city centre")
`
        },
        {
          type: 'quiz',
          question: 'score = 50. Which label is printed?',
          code: py`
if score > 80:
    print("A")
elif score > 50:
    print("B")
else:
    print("C")
`,
          options: ['A', 'B', 'C', 'Nothing'],
          answer: 2,
          explanation: '50 > 50 is False (it is equal, not greater), so we fall through to else.'
        }
      ]
    },
    {
      id: 'for-loops',
      eyebrow: 'Loops',
      title: 'for loops: do it for every row',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'A `for` loop takes each value from a collection, one at a time, gives it a name, and runs the indented block. The **accumulator pattern** — start at 0, add inside the loop — is the ancestor of every `sum()`.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
daily_sales = [120, 95, 140, 88, 160]

total = 0                        # 1. start the accumulator
for sale in daily_sales:         # 2. visit every value
    total = total + sale         # 3. update the accumulator
    print("added", sale, "-> running total", total)

print("Total:", total)
`
        },
        {
          type: 'analogy',
          title: 'The cashier',
          body: 'A cashier scans each item in the basket one by one and the screen keeps a running total. The basket is the list, the scanner is the for loop, and the screen is the accumulator.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'range, enumerate and zip',
          code: py`
for week in range(1, 4):                 # 1, 2, 3 (stop excluded)
    print("Week", week)

items = ["Latte", "Cookie", "Mocha"]
prices = [75, 35, 85]

for position, item in enumerate(items, start=1):
    print(position, item)

for item, price in zip(items, prices):   # walk two lists side by side
    print(f"{item}: {price} THB")
`
        }
      ]
    },
    {
      id: 'loop-records',
      eyebrow: 'Loops + data',
      title: 'Filter and group by hand',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'Put a loop and an `if` together and you can answer real questions about a table. Notice the second program: counting into a dict is a **manual groupby** — pandas will do this in one line in Day 8.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
orders = [
    {"item": "Latte",    "branch": "Downtown", "quantity": 2, "unit_price": 75},
    {"item": "Cookie",   "branch": "Campus",   "quantity": 3, "unit_price": 35},
    {"item": "Thai Tea", "branch": "Campus",   "quantity": 1, "unit_price": 55},
    {"item": "Mocha",    "branch": "Downtown", "quantity": 1, "unit_price": 85},
]

big_orders = []
for order in orders:
    revenue = order["quantity"] * order["unit_price"]
    if revenue >= 100:
        big_orders.append(order["item"])
print("Orders worth 100+ THB:", big_orders)

revenue_by_branch = {}
for order in orders:
    branch = order["branch"]
    revenue = order["quantity"] * order["unit_price"]
    revenue_by_branch[branch] = revenue_by_branch.get(branch, 0) + revenue
print(revenue_by_branch)
`
        },
        {
          type: 'analogy',
          title: 'Sorting coins into jars',
          body: 'For each coin, read its label and drop it into the matching jar — creating the jar the first time you see that label. At the end you count each jar. dict.get(key, 0) is “the jar, or an empty one if it doesn’t exist yet”.'
        }
      ],
      notes:
        'Let her try to write revenue_by_branch herself first. This is the hardest program so far; the payoff is understanding groupby deeply in Day 8.'
    },
    {
      id: 'comprehensions',
      eyebrow: 'Pythonic style',
      title: 'Comprehensions: a loop in one line',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
prices = [75, 60, 55, 85, 35]

# The long way
with_vat = []
for p in prices:
    with_vat.append(round(p * 1.07, 2))
print(with_vat)

# The comprehension: [expression for item in collection if condition]
print([round(p * 1.07, 2) for p in prices])
print([p for p in prices if p >= 60])
print({p: p >= 60 for p in prices})          # a dict comprehension
`
        },
        {
          type: 'analogy',
          title: 'A factory conveyor belt',
          body: 'Items roll in (for p in prices), a quality-check gate throws some out (if p >= 60), a machine transforms each survivor (p * 1.07), and a box at the end collects the results ([ ]).'
        },
        {
          type: 'quiz',
          question: 'What is the result?',
          code: '[x * 2 for x in range(4) if x % 2 == 0]',
          options: ['[0, 4]', '[0, 2, 4, 6]', '[2, 6]', '[0, 1, 2, 3]'],
          answer: 0,
          explanation:
            'range(4) gives 0,1,2,3; the even ones are 0 and 2; doubled they become 0 and 4.'
        }
      ]
    },
    {
      id: 'functions',
      eyebrow: 'Functions',
      title: 'Functions: name a recipe, reuse it forever',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
def add_vat(price, rate=0.07):
    """Return the price including VAT."""
    return round(price * (1 + rate), 2)

print(add_vat(100))            # uses the default rate
print(add_vat(100, rate=0.10))
result = add_vat(75)
print(result * 2)              # a returned value can be reused
`
        },
        {
          type: 'analogy',
          title: 'A blender',
          body: 'Parameters are what you put in (fruit, milk), the body is the blending, and return is the smoothie that comes out — something you can pour into another glass. print() only shows the smoothie through a window; you can’t drink that.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'return vs print — remember Day 1?',
          code: py`
def shout_total(prices):
    print(sum(prices))         # shows it, returns None

def get_total(prices):
    return sum(prices)         # gives it back

a = shout_total([1, 2, 3])
b = get_total([1, 2, 3])
print("a =", a, "| b =", b)
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Why data scientists love functions',
          body: 'You will run the same cleaning step on January, February and March data. Write it once as a function, test it once, and call it three times. Later, pandas lets you apply your own functions to whole columns.'
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'Theory + real world',
      title: 'Rules written by hand: the first “models”',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            '**Theory.** An **algorithm** is a precise, finite list of steps — a recipe a computer can follow. Before machine learning, “intelligent” systems were mostly hand-written if/else rules, called **rule-based systems** (or expert systems). They are still everywhere because they are simple to explain and audit.',
            'Machine learning (Day 3) flips this: instead of writing the rules, you give examples and the computer **learns** them. Knowing how to write rules yourself is how you understand what a model is doing.'
          ]
        },
        {
          type: 'case',
          domain: 'Banks',
          title: 'Fraud rules',
          problem: 'Flag suspicious card payments for a human to check.',
          data: 'Each transaction: amount, country, time, merchant type.',
          method:
            'Rules such as “large amount AND abroad AND at night” — often combined with a learned model.',
          outcome: 'Most payments pass instantly; a small number are held for an SMS check.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Write a rule-based fraud checker',
          code: py`
transactions = [
    {"id": 1, "amount": 450,   "country": "MM", "hour": 14},
    {"id": 2, "amount": 98000, "country": "MM", "hour": 13},
    {"id": 3, "amount": 52000, "country": "SG", "hour": 3},
    {"id": 4, "amount": 1200,  "country": "TH", "hour": 2},
]

def risk_score(tx, home="MM"):
    score = 0
    if tx["amount"] > 50_000:
        score += 2
    if tx["country"] != home:
        score += 1
    if tx["hour"] < 6:
        score += 1
    return score

for tx in transactions:
    score = risk_score(tx)
    action = "HOLD for SMS check" if score >= 3 else "approve"
    print(f"transaction {tx['id']}: risk {score} -> {action}")
`
        },
        {
          type: 'analogy',
          title: 'A recipe card vs a chef who tastes',
          body: 'A rule-based system is a recipe card: exact steps, the same result every time, and easy to check. Machine learning is a chef who has tasted thousands of dishes and adjusts by experience — more flexible, but harder to explain.'
        }
      ]
    },
    {
      id: 'challenge',
      eyebrow: 'Challenge',
      title: 'Write summarize(orders)',
      minutes: 10,
      blocks: [
        {
          type: 'callout',
          tone: 'success',
          title: 'Requirements',
          body: 'Write a function summarize(orders) that RETURNS a dict with: the number of orders, total revenue, average revenue per order (2 decimals), and the best-selling item by quantity.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Your solution',
          code: py`
orders = [
    {"item": "Latte",  "quantity": 2, "unit_price": 75},
    {"item": "Cookie", "quantity": 3, "unit_price": 35},
    {"item": "Latte",  "quantity": 1, "unit_price": 75},
    {"item": "Mocha",  "quantity": 1, "unit_price": 85},
]

def summarize(orders):
    # your code here
    return {}

print(summarize(orders))
`
        },
        {
          type: 'code',
          runnable: true,
          title: 'One possible solution',
          code: py`
orders = [
    {"item": "Latte",  "quantity": 2, "unit_price": 75},
    {"item": "Cookie", "quantity": 3, "unit_price": 35},
    {"item": "Latte",  "quantity": 1, "unit_price": 75},
    {"item": "Mocha",  "quantity": 1, "unit_price": 85},
]

def summarize(orders):
    revenues = [o["quantity"] * o["unit_price"] for o in orders]
    units = {}
    for o in orders:
        units[o["item"]] = units.get(o["item"], 0) + o["quantity"]
    best = max(units, key=units.get)       # the key with the largest value
    return {
        "orders": len(orders),
        "revenue": sum(revenues),
        "avg_order": round(sum(revenues) / len(orders), 2),
        "best_seller": best,
    }

print(summarize(orders))
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Coming next',
          body: 'That was ~15 lines for 4 orders. In Day 7, pandas answers the same questions about 240 orders in about 4 lines — and now you know what it does underneath.'
        }
      ],
      notes:
        'max(units, key=units.get) is new — explain that key= tells max HOW to compare: by each key’s value instead of alphabetically.'
    }
  ]
}

export default day5
