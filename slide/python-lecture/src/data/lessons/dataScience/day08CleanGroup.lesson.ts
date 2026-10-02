import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day8: Lesson = {
  id: 'ds-8',
  track: 'data-science',
  day: 11,
  title: 'Cleaning, grouping and joining data',
  summary:
    'Fix messy text, duplicates and missing values; then answer real questions with groupby, pivot tables and merge.',
  durationMinutes: 60,
  topics: ['Missing values', 'Duplicates', 'String cleaning', 'groupby', 'pivot_table', 'merge'],
  available: true,
  sections: [
    {
      id: 'messy-data',
      eyebrow: 'Diagnose',
      title: 'Real data is messy',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            '`cafe_sales_raw.csv` is the same café data as it arrived from the tills: typed by tired staff, merged from three branches. Before any analysis, **diagnose** it.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

raw = pd.read_csv("cafe_sales_raw.csv")
print(raw.shape)
print(raw.isna().sum())                       # missing values per column
print("duplicates:", raw.duplicated().sum())
print(raw["item"].unique())                   # spot the typos
print(raw["branch"].unique())
print(raw["quantity"].describe()[["min", "max"]])
`
        },
        {
          type: 'analogy',
          title: 'Washing vegetables',
          body: 'No chef cooks straight from the market bag. You wash off the dirt, throw away the rotten leaves and cut everything to the same size first. Skip it and every dish is ruined — skip cleaning and every chart is wrong.'
        },
        {
          type: 'table',
          columns: ['Problem found', 'Example', 'Fix (next sections)'],
          codeColumns: [1],
          rows: [
            ['Inconsistent text', '" latte", "LATTE", "downtown"', '.str.strip().str.title()'],
            ['Exact duplicate rows', 'order 1012 twice', '.drop_duplicates()'],
            ['Missing values', 'empty quantity / price', 'dropna() or fillna()'],
            ['Impossible values', 'quantity = -2', 'filter it out']
          ]
        }
      ]
    },
    {
      id: 'clean-text-dupes',
      eyebrow: 'Clean',
      title: 'Fix text and remove duplicates',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

raw = pd.read_csv("cafe_sales_raw.csv")
df = raw.copy()                     # never overwrite the raw data (Day 7: copies!)

df["item"] = df["item"].str.strip().str.title()
df["branch"] = df["branch"].str.strip().str.title()
print(df["item"].unique())
print(df["branch"].unique())

before = len(df)
df = df.drop_duplicates()
print("removed", before - len(df), "duplicate rows")
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'The .str accessor',
          body: 'df["item"].str gives every Python string method (strip, lower, title, replace, contains…) to a whole column at once — vectorized, like NumPy.'
        }
      ]
    },
    {
      id: 'missing',
      eyebrow: 'Clean',
      title: 'Missing and impossible values',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales_raw.csv").drop_duplicates()
print(df["quantity"].dtype)          # float64: NaN forces floats

menu_price = {"Latte": 75, "Americano": 60, "Cappuccino": 75, "Mocha": 85, "Thai Tea": 55,
              "Green Tea": 50, "Croissant": 65, "Banana Cake": 70, "Cookie": 35}
df["item"] = df["item"].str.strip().str.title()

# 1. A missing price can be looked up: we KNOW the menu
df["unit_price"] = df["unit_price"].fillna(df["item"].map(menu_price))

# 2. A missing quantity cannot be guessed reliably -> drop those rows
df = df.dropna(subset=["quantity"])

# 3. A missing payment method is unknown, but the order still happened
df["payment"] = df["payment"].fillna("Unknown")

# 4. Impossible values
df = df[df["quantity"] > 0]
df["quantity"] = df["quantity"].astype(int)

print(df.isna().sum().sum(), "missing values left")
print(df.shape)
`
        },
        {
          type: 'table',
          columns: ['Strategy', 'Use when', 'Risk'],
          rows: [
            [
              'Drop the row',
              'Few rows affected, value is essential',
              'Lose data; bias if not random'
            ],
            ['Fill from a lookup', 'The true value is knowable (menu price)', 'Low'],
            ['Fill with median', 'Numeric, many missing, need a value', 'Hides real variation'],
            ['Fill with a label', 'Category is simply unknown', 'Low — and honest']
          ]
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Cleaning is a decision, not a formula',
          body: 'Every choice above changes the final numbers. Write down what you did and why — a good analysis report always has a “data cleaning” paragraph.'
        }
      ],
      notes:
        'NaN (Not a Number) is a special float, which is why a column of ints with one gap becomes float64. That is Day 1 types showing up in real data.'
    },
    {
      id: 'groupby',
      eyebrow: 'Analyse',
      title: 'groupby: split → apply → combine',
      minutes: 12,
      blocks: [
        {
          type: 'text',
          body: [
            'Remember the hand-written jar-sorting loop in Day 8? `groupby` is that, in one line, for any number of rows.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")
df["revenue"] = df["quantity"] * df["unit_price"]

print(df.groupby("branch")["revenue"].sum())

summary = df.groupby("branch").agg(
    orders=("order_id", "count"),
    revenue=("revenue", "sum"),
    avg_order=("revenue", "mean"),
).round(1).sort_values("revenue", ascending=False)
print(summary)
`
        },
        {
          type: 'analogy',
          title: 'Sorting laundry',
          body: 'SPLIT the pile into whites, colours and darks. APPLY the same action to each pile (count the shirts, weigh them). COMBINE the answers into one small table. groupby("branch") splits, ["revenue"].sum() applies, and pandas combines.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Two keys and a pivot table',
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")
df["revenue"] = df["quantity"] * df["unit_price"]

print(df.groupby(["branch", "category"])["quantity"].sum())

pivot = df.pivot_table(index="branch", columns="category",
                       values="revenue", aggfunc="sum")
print(pivot)
`
        }
      ]
    },
    {
      id: 'merge',
      eyebrow: 'Combine',
      title: 'merge: join two tables on a key',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'The sales file knows prices but not **costs**. The kitchen keeps costs in a separate table. `merge` matches rows from both tables using a shared key column.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

sales = pd.read_csv("cafe_sales.csv")
costs = pd.DataFrame({
    "item": ["Latte", "Americano", "Cappuccino", "Mocha", "Thai Tea",
             "Green Tea", "Croissant", "Banana Cake", "Cookie"],
    "unit_cost": [28, 18, 27, 34, 15, 12, 30, 26, 12],
})

merged = sales.merge(costs, on="item", how="left")
merged["profit"] = merged["quantity"] * (merged["unit_price"] - merged["unit_cost"])

by_item = merged.groupby("item")["profit"].sum().sort_values(ascending=False)
print(by_item)
print("Total profit:", merged["profit"].sum(), "THB")
`
        },
        {
          type: 'analogy',
          title: 'Matching student cards',
          body: 'One teacher has exam scores by student ID; the office has phone numbers by student ID. To call every student who failed, you line the two lists up by ID. how="left" keeps every row of the left table even when no match is found (the cost would be NaN).'
        },
        {
          type: 'table',
          columns: ['how=', 'Keeps'],
          codeColumns: [0],
          rows: [
            ['"inner"', 'only keys found in both tables (default)'],
            ['"left"', 'every row of the left table'],
            ['"right"', 'every row of the right table'],
            ['"outer"', 'every key from either table']
          ]
        }
      ],
      notes:
        'Excel users know this as VLOOKUP / XLOOKUP. Costs here are illustrative numbers for the exercise.'
    },
    {
      id: 'theory-real-world',
      eyebrow: 'Theory + real world',
      title: 'Why data goes missing — and why it matters',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            '**Garbage in, garbage out:** no method can rescue bad data. The *reason* values are missing decides whether dropping them is safe.'
          ]
        },
        {
          type: 'table',
          columns: ['Why it is missing', 'Example', 'Is dropping safe?'],
          rows: [
            [
              'Completely at random',
              'A sensor’s battery died on random days',
              'Usually yes — you just lose some data'
            ],
            [
              'Related to other columns',
              'Older customers skip the online-only question',
              'Risky — fill using those other columns'
            ],
            [
              'Related to the missing value itself',
              'High earners skip the “income” question',
              'No — results become biased'
            ]
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Simulate a survey where rich people skip the income question',
          code: py`
import numpy as np
import pandas as pd

rng = np.random.default_rng(2)
income = pd.Series(rng.lognormal(mean=10.3, sigma=0.5, size=2000).round(-2))

skip_chance = np.where(income > income.quantile(0.8), 0.6, 0.05)   # top 20% often skip
answered = income[rng.random(len(income)) > skip_chance]

print(f"true mean income:      {income.mean():>10,.0f}")
print(f"mean of answers only:  {answered.mean():>10,.0f}")
print(f"response rate: {len(answered) / len(income):.0%}")
`
        },
        {
          type: 'case',
          domain: 'Healthcare',
          title: 'Missing test results',
          problem: 'Estimate how common a condition is from hospital records.',
          data: 'Blood tests — but doctors only order the test when they already suspect a problem.',
          method: 'Recognise that missing ≠ healthy; compare with a random screening sample.',
          outcome:
            'Without that care, the condition looks far more common in records than in the population.'
        }
      ]
    },
    {
      id: 'question-driven',
      eyebrow: 'Put it together',
      title: 'Answer a business question',
      minutes: 8,
      blocks: [
        {
          type: 'callout',
          tone: 'success',
          title: 'The question',
          body: 'The owner asks: “In February, which branch sold the most coffee cups, and what share of its total cups was coffee?” Try it first, then compare with the solution.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Your attempt',
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")
# 1. parse dates  2. keep February  3. group by branch and category  4. compute the share
`
        },
        {
          type: 'code',
          runnable: true,
          title: 'One possible solution',
          hidden: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")
df["date"] = pd.to_datetime(df["date"])
feb = df[df["date"].dt.month == 2]

cups = feb.pivot_table(index="branch", columns="category",
                       values="quantity", aggfunc="sum", fill_value=0)
cups["coffee_share_%"] = (cups["Coffee"] / cups.sum(axis=1) * 100).round(1)
print(cups.sort_values("Coffee", ascending=False))

best = cups["Coffee"].idxmax()
print(f"{best} sold the most coffee in February: {cups.loc[best, 'Coffee']} cups "
      f"({cups.loc[best, 'coffee_share_%']}% of its cups).")
`
        }
      ]
    }
  ]
}

export default day8
