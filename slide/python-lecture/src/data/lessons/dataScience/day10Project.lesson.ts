import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day10: Lesson = {
  id: 'ds-10',
  track: 'data-science',
  day: 10,
  title: 'Project: the café sales report',
  summary:
    'A complete analysis from raw file to recommendations: clean, explore, chart and write the findings.',
  durationMinutes: 90,
  topics: ['Exploratory analysis', 'Cleaning pipeline', 'Charts', 'Writing findings'],
  available: true,
  sections: [
    {
      id: 'brief',
      eyebrow: 'The brief',
      title: 'The owner’s four questions',
      minutes: 5,
      blocks: [
        {
          type: 'text',
          body: [
            'The café owner sends you the raw till export and asks for a short report before Monday’s meeting:'
          ]
        },
        {
          type: 'table',
          columns: ['#', 'Question', 'Tool'],
          rows: [
            ['Q1', 'Which branch earns the most, and how big is the gap?', 'groupby + bar chart'],
            ['Q2', 'What are the best sellers — by units AND by revenue?', 'groupby + sort'],
            ['Q3', 'Are sales growing from month to month?', 'dates + line chart'],
            ['Q4', 'How do customers pay at each branch?', 'crosstab + stacked bar']
          ]
        },
        {
          type: 'callout',
          tone: 'success',
          title: 'How to work',
          body: 'For each step, write your own code in the first box before opening the solution. The data is the full, clean cafe_sales.csv; step 1 shows the cleaning function you would run on the raw export.'
        }
      ],
      notes:
        'Treat this as a real client project. Let her lead; you play the café owner and push back on vague answers (“how much more?”, “compared to what?”).'
    },
    {
      id: 'pipeline',
      eyebrow: 'Step 1',
      title: 'A reusable cleaning function',
      minutes: 15,
      blocks: [
        {
          type: 'text',
          body: [
            'Professional analysts put cleaning in a **function** (Day 5) so the same steps run on every new export. Here it turns the raw file into an analysis-ready table.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

MENU_PRICE = {"Latte": 75, "Americano": 60, "Cappuccino": 75, "Mocha": 85, "Thai Tea": 55,
              "Green Tea": 50, "Croissant": 65, "Banana Cake": 70, "Cookie": 35}

def clean_sales(raw):
    df = raw.copy().drop_duplicates()
    for column in ["item", "branch", "category", "payment"]:
        df[column] = df[column].str.strip()
    df["item"] = df["item"].str.title()          # " latte", "LATTE" -> "Latte"
    df["branch"] = df["branch"].str.title()      # but keep "QR" as "QR"
    df["unit_price"] = df["unit_price"].fillna(df["item"].map(MENU_PRICE))
    df["payment"] = df["payment"].fillna("Unknown")
    df = df.dropna(subset=["quantity"])
    df = df[df["quantity"] > 0].copy()
    df["quantity"] = df["quantity"].astype(int)
    df["date"] = pd.to_datetime(df["date"])
    df["revenue"] = df["quantity"] * df["unit_price"]
    return df

raw = pd.read_csv("cafe_sales_raw.csv")
clean = clean_sales(raw)
print(f"raw rows: {len(raw)} -> clean rows: {len(clean)}")
print(clean.isna().sum().sum(), "missing values left")
print(clean.head())
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Report note',
          body: 'Record what the function removed (duplicates, rows without quantity, negative quantities). The owner should know the numbers rest on cleaned data.'
        }
      ]
    },
    {
      id: 'q1-branches',
      eyebrow: 'Step 2 · Q1',
      title: 'Which branch earns the most?',
      minutes: 15,
      blocks: [
        {
          type: 'code',
          runnable: true,
          title: 'Your attempt',
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv", parse_dates=["date"])
df["revenue"] = df["quantity"] * df["unit_price"]
# revenue, orders and average order value per branch
`
        },
        {
          type: 'code',
          runnable: true,
          title: 'Solution',
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("cafe_sales.csv", parse_dates=["date"])
df["revenue"] = df["quantity"] * df["unit_price"]

branches = df.groupby("branch").agg(
    revenue=("revenue", "sum"),
    orders=("order_id", "count"),
    avg_order=("revenue", "mean"),
).sort_values("revenue", ascending=False)
branches["share_%"] = (branches["revenue"] / branches["revenue"].sum() * 100).round(1)
print(branches.round(1))

top, second = branches.index[0], branches.index[1]
gap = branches.loc[top, "revenue"] / branches.loc[second, "revenue"]
print(f"{top} earns {gap:.1f}x what {second} earns.")

fig, ax = plt.subplots(figsize=(7, 3))
ax.barh(branches.index[::-1], branches["revenue"][::-1])
ax.set_title(f"{top} brings in {branches.loc[top, 'share_%']}% of revenue")
ax.set_xlabel("Revenue (THB)")
plt.show()
`
        },
        {
          type: 'analogy',
          title: 'Total vs average',
          body: 'A branch can earn the most because it has MORE orders, or because each order is BIGGER. Always look at both — they lead to different decisions (more staff vs. upselling).'
        }
      ]
    },
    {
      id: 'q2-items',
      eyebrow: 'Step 3 · Q2',
      title: 'Best sellers: units vs revenue',
      minutes: 15,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")
df["revenue"] = df["quantity"] * df["unit_price"]

items = df.groupby("item").agg(units=("quantity", "sum"), revenue=("revenue", "sum"))
items["units_rank"] = items["units"].rank(ascending=False, method="min").astype(int)
items["revenue_rank"] = items["revenue"].rank(ascending=False, method="min").astype(int)
print(items.sort_values("revenue", ascending=False))

print("Top 3 by units:  ", items.nlargest(3, "units").index.tolist())
print("Top 3 by revenue:", items.nlargest(3, "revenue").index.tolist())
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Think like an analyst',
          body: 'A cheap item can sell many units yet bring little revenue; an expensive one can be the opposite. Which ranking matters depends on the decision: shelf space (units) or profit (revenue — or better, profit from Day 8’s merge).'
        }
      ]
    },
    {
      id: 'q3-trend',
      eyebrow: 'Step 4 · Q3',
      title: 'Is the business growing?',
      minutes: 15,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("cafe_sales.csv", parse_dates=["date"])
df["revenue"] = df["quantity"] * df["unit_price"]
df["month"] = df["date"].dt.to_period("M")

monthly = df.pivot_table(index="month", columns="branch", values="revenue", aggfunc="sum")
monthly["Total"] = monthly.sum(axis=1)
print(monthly)
print((monthly["Total"].pct_change() * 100).round(1).rename("growth_%"))

fig, ax = plt.subplots()
monthly.drop(columns="Total").plot(ax=ax, marker="o")
ax.set_title("Monthly revenue by branch")
ax.set_xlabel("")
ax.set_ylabel("THB")
ax.set_ylim(bottom=0)
plt.show()
`
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Three months is a short story',
          body: 'With only Jan–Mar you cannot separate a real trend from seasonality or chance. Say so in the report: “Revenue changed by X% — we need more months to confirm a trend.”'
        }
      ]
    },
    {
      id: 'q4-payments',
      eyebrow: 'Step 5 · Q4',
      title: 'How do customers pay?',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("cafe_sales.csv")
share = (pd.crosstab(df["branch"], df["payment"], normalize="index") * 100).round(1)
print(share)

ax = share.plot(kind="barh", stacked=True, figsize=(8, 3))
ax.set_title("Payment mix by branch (% of orders)")
ax.set_xlabel("% of orders")
ax.legend(title="Payment", bbox_to_anchor=(1, 1))
plt.show()
`
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'Theory + real world',
      title: 'From analysis to decision: telling the story',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            '**Theory — the pyramid principle.** Busy decision-makers read the first line and maybe the second. So put the **answer first**, then the 2–3 reasons, then the details. A common structure is **Situation → Complication → Resolution**: where we are, what changed or is at risk, what we recommend.'
          ]
        },
        {
          type: 'table',
          columns: ['Weak finding', 'Strong finding'],
          rows: [
            [
              '“Sales vary by branch.”',
              '“Downtown earns 51% of revenue with 47% of orders — its orders are bigger.”'
            ],
            [
              '“QR is popular.”',
              '“61% of Campus orders are QR vs 33% Downtown: add a second QR stand at Campus.”'
            ],
            [
              '“Revenue went up.”',
              '“Revenue rose 29% from January to February, then stayed flat in March.”'
            ]
          ]
        },
        {
          type: 'case',
          domain: 'Retail chains',
          title: 'Which stores should be renovated first?',
          problem: 'Budget for only 3 renovations out of 20 stores this year.',
          data: 'Sales, customer counts, customer ratings and store age for every store.',
          method: 'Rank stores by expected gain; present a one-page recommendation with 3 charts.',
          outcome:
            'Managers decide in one meeting — because the page leads with the answer, not the method.'
        },
        {
          type: 'analogy',
          title: 'A news article',
          body: 'Journalists write the most important fact in the headline and first sentence, then add detail (the inverted pyramid). Write your report the same way: if the reader stops after one line, they should still know what to do.'
        }
      ]
    },
    {
      id: 'report',
      eyebrow: 'Step 6',
      title: 'Write the findings',
      minutes: 15,
      blocks: [
        {
          type: 'text',
          body: [
            'A report is not a pile of charts. Each finding is **one sentence with a number**, followed by **what to do about it**. Let the code fill in the numbers so the report updates itself next month.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv", parse_dates=["date"])
df["revenue"] = df["quantity"] * df["unit_price"]

by_branch = df.groupby("branch")["revenue"].sum().sort_values(ascending=False)
top_item = df.groupby("item")["revenue"].sum().idxmax()
qr_campus = (df.loc[df["branch"] == "Campus", "payment"] == "QR").mean() * 100
monthly = df.groupby(df["date"].dt.to_period("M"))["revenue"].sum()
change = (monthly.iloc[-1] / monthly.iloc[0] - 1) * 100

print("CAFÉ SALES REPORT · Q1 2026")
print("=" * 40)
print(f"1. {by_branch.index[0]} earned {by_branch.iloc[0]:,} THB "
      f"({by_branch.iloc[0] / by_branch.sum():.0%} of the total).")
print(f"2. {top_item} is the top item by revenue.")
print(f"3. {qr_campus:.0f}% of Campus orders are paid by QR.")
print(f"4. Revenue changed {change:+.1f}% from {monthly.index[0]} to {monthly.index[-1]}.")
print()
print("Recommendation: [write your own, based on the numbers above]")
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Final homework: your own analysis',
          body: 'Analyse students.csv as if for a school director: Which factor relates most strongly to the score? How many students failed, and what do they have in common? Produce 2 charts and 3 findings, each with a number and a recommendation.'
        }
      ],
      notes:
        'Ask her to present the report to you out loud in 3 minutes. Communicating is the skill that makes a data scientist valuable.'
    }
  ]
}

export default day10
