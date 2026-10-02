import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day7: Lesson = {
  id: 'ds-7',
  track: 'data-science',
  day: 10,
  title: 'pandas: spreadsheets with superpowers',
  summary:
    'Series and DataFrames, loading a CSV, selecting with loc/iloc, filtering, new columns, sorting and dates.',
  durationMinutes: 60,
  topics: ['Series', 'DataFrame', 'read_csv', 'loc / iloc', 'Filtering', 'Dates'],
  available: true,
  sections: [
    {
      id: 'series-dataframe',
      eyebrow: 'Core objects',
      title: 'Series and DataFrame',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            'A **Series** is a NumPy array with **labels** (an index). A **DataFrame** is a table: a dict of Series that share the same index — one Series per column.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

prices = pd.Series([75, 60, 55], index=["Latte", "Americano", "Thai Tea"])
print(prices)
print(prices["Latte"], prices.mean())

df = pd.DataFrame({
    "item": ["Latte", "Americano", "Thai Tea"],
    "price": [75, 60, 55],
    "category": ["Coffee", "Coffee", "Tea"],
})
print(df)
print(type(df["price"]))     # each column is a Series
`
        },
        {
          type: 'analogy',
          title: 'Spreadsheet with superpowers',
          body: 'A DataFrame looks like an Excel sheet, but every column is a NumPy array (fast, one type), every row has a label, and every operation is a line of code you can rerun on next month’s file in a second.'
        },
        {
          type: 'table',
          columns: ['Earlier idea', 'pandas version'],
          rows: [
            ['list of numbers (Day 7)', 'Series'],
            ['NumPy array (Day 9)', 'the values inside a Series'],
            ['list of dicts (Day 7)', 'DataFrame'],
            ['dict keys', 'column names'],
            ['list positions', 'the index (row labels)']
          ]
        }
      ]
    },
    {
      id: 'load-inspect',
      eyebrow: 'First look',
      title: 'Load a CSV and inspect it',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'Our dataset `cafe_sales.csv` has 240 orders from three café branches (January–March 2026). It is already available to the Python in this page. **Always inspect before you analyse.**'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")
print(df.shape)           # (rows, columns)
print(df.head())          # first 5 rows
print(df.dtypes)
`
        },
        {
          type: 'code',
          runnable: true,
          title: 'Summary statistics in one line',
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")
print(df.describe())                       # numeric columns
print(df["branch"].value_counts())         # counts per category
print(df["item"].nunique(), "different items")
`
        },
        {
          type: 'table',
          columns: ['Method', 'Answers'],
          codeColumns: [0],
          rows: [
            ['df.shape', 'How big is it?'],
            ['df.head() / df.tail()', 'What does it look like?'],
            ['df.dtypes / df.info()', 'Are the types right? Any missing values?'],
            ['df.describe()', 'Ranges, averages, suspicious min/max?'],
            ['s.value_counts()', 'How often does each category appear?']
          ]
        }
      ],
      notes:
        'Point out the unit_price mean and that quantity min is 1, max is 4 — describe() is how you spot impossible values (we will meet negative quantities in Day 11).'
    },
    {
      id: 'selecting',
      eyebrow: 'Selecting',
      title: 'Columns, rows, loc and iloc',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")

print(df["item"].head(3))                    # one column -> Series
print(df[["item", "quantity"]].head(3))      # list of columns -> DataFrame

print(df.loc[0, "item"])                     # by LABEL: row 0, column "item"
print(df.loc[0:2, ["date", "branch"]])       # label slices INCLUDE the end
print(df.iloc[0:2, 0:3])                     # by POSITION: end excluded
print(df.iloc[-1])                           # the last row
`
        },
        {
          type: 'analogy',
          title: 'Cinema seats',
          body: 'loc uses the name printed on the ticket (“row F, seat Window”); iloc counts seats from the left edge (“6th row, 1st seat”). When the index is 0, 1, 2… they look the same — until you filter or sort and the labels no longer match the positions.'
        },
        {
          type: 'quiz',
          question: 'How many rows does df.loc[0:2] return (default index)?',
          options: ['2', '3', '1', 'Error'],
          answer: 1,
          explanation: 'loc slices by label and includes the end label: rows 0, 1 and 2.'
        }
      ]
    },
    {
      id: 'filtering',
      eyebrow: 'Filtering',
      title: 'Filtering rows with masks',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'Exactly the NumPy stencil from Day 9: a comparison gives a True/False Series, and `df[mask]` keeps the True rows.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")

campus = df[df["branch"] == "Campus"]
print(len(campus), "Campus orders")

big_coffee = df[(df["category"] == "Coffee") & (df["quantity"] >= 3)]
print(big_coffee[["date", "branch", "item", "quantity"]].head())

tea_or_bakery = df[df["category"].isin(["Tea", "Bakery"])]
print(tea_or_bakery["category"].value_counts())

print(df.query("branch == 'Riverside' and payment == 'QR'").shape)
`
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Three rules for conditions',
          body: 'Use & (and), | (or), ~ (not) — never the words. Put brackets around each comparison. Compare with == (two equals signs).'
        }
      ]
    },
    {
      id: 'new-columns',
      eyebrow: 'Transforming',
      title: 'New columns, sorting and ranking',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")

df["revenue"] = df["quantity"] * df["unit_price"]       # vectorized, no loop
df["size"] = df["quantity"].map(lambda q: "group" if q >= 3 else "single")

print(df[["item", "quantity", "unit_price", "revenue", "size"]].head())
print(df.sort_values("revenue", ascending=False).head(3)[["date", "item", "revenue"]])
print(df.nlargest(3, "revenue")["order_id"].tolist())
print("Total revenue:", df["revenue"].sum(), "THB")
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'map and lambda',
          body: 'lambda q: ... is a tiny one-line function without a name. .map() calls it on every value of the column. Prefer vectorized maths when possible; use map/apply for logic that has no vectorized form.'
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'Theory + real world',
      title: 'Tidy data: the shape that makes analysis easy',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            '**Theory — tidy data** (a name popularised by statistician Hadley Wickham): **each variable is a column, each observation is a row, each value is a cell.** Spreadsheets made for humans are often “wide” instead — months spread across columns. Tidy data is what groupby, filters and charts expect.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Wide (human) → tidy (analysis) with melt',
          code: py`
import pandas as pd

wide = pd.DataFrame({
    "branch": ["Downtown", "Riverside", "Campus"],
    "Jan": [4280, 1855, 1870],
    "Feb": [5120, 3365, 1845],
    "Mar": [5410, 2575, 2440],
})
print(wide)

tidy = wide.melt(id_vars="branch", var_name="month", value_name="revenue")
print(tidy)
print(tidy.groupby("month", sort=False)["revenue"].sum())
`
        },
        {
          type: 'case',
          domain: 'Offices everywhere',
          title: 'Automating the monthly Excel report',
          problem:
            'An accountant spends days each month copying numbers from branch spreadsheets into one report.',
          data: 'One Excel/CSV file per branch per month.',
          method:
            'A pandas script: read every file, tidy it, group and summarise, write one output file.',
          outcome:
            'The report takes seconds, has no copy-paste errors, and the accountant spends the time on analysis.'
        },
        {
          type: 'analogy',
          title: 'Mise en place',
          body: 'Chefs prepare and arrange every ingredient before cooking — that is mise en place. Tidying your table is the data version: once it is in shape, every recipe (groupby, chart, model) is quick.'
        }
      ]
    },
    {
      id: 'dates',
      eyebrow: 'Dates',
      title: 'Working with dates',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")
print(df["date"].dtype)                     # object = plain text!

df["date"] = pd.to_datetime(df["date"])     # parse into real dates
df["month"] = df["date"].dt.month_name()
df["weekday"] = df["date"].dt.day_name()

print(df[["date", "month", "weekday"]].head(3))
print(df["weekday"].value_counts())
print(df["date"].min(), "->", df["date"].max())
`
        },
        {
          type: 'analogy',
          title: 'Text that looks like a date',
          body: 'Just like "20" vs 20 on Day 1: "2026-01-05" is only characters until you convert it. After pd.to_datetime, pandas knows it is a Monday in January and can sort, subtract and group by it.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework',
          body: 'Using cafe_sales.csv: (1) How many orders were paid by QR at Campus? (2) What is the most expensive item on the menu? (3) Add a revenue column and find the single best day by total revenue (hint: filter by date is fine; groupby comes next lesson).'
        }
      ]
    }
  ]
}

export default day7
