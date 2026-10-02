import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day9: Lesson = {
  id: 'ds-9',
  track: 'data-science',
  day: 12,
  title: 'Visualization: making data visible',
  summary:
    'Pick the right chart for the question, then draw line, bar, histogram and scatter charts with matplotlib and pandas.',
  durationMinutes: 60,
  topics: ['Choosing a chart', 'matplotlib', 'Line & bar', 'Histogram', 'Scatter & correlation'],
  available: true,
  sections: [
    {
      id: 'choose-chart',
      eyebrow: 'Think first',
      title: 'The question picks the chart',
      minutes: 8,
      blocks: [
        {
          type: 'table',
          columns: ['Your question sounds like…', 'Chart', 'Example from our data'],
          rows: [
            ['“How does it change over time?”', 'Line chart', 'Revenue per week'],
            ['“Which category is bigger?”', 'Bar chart', 'Revenue per branch'],
            ['“How are values spread out?”', 'Histogram', 'Distribution of exam scores'],
            ['“Do two numbers move together?”', 'Scatter plot', 'Study hours vs score'],
            [
              '“What share of the whole?”',
              'Stacked bar (pie only for 2–3 parts)',
              'Payment methods per branch'
            ]
          ]
        },
        {
          type: 'analogy',
          title: 'The toolbox',
          body: 'You wouldn’t use a hammer to cut wood. A pie chart with 9 slices is a hammer on wood: people cannot compare thin angles. Choose the tool from the question, not from what looks impressive.'
        }
      ],
      notes: 'Play the Chart Picker game from the Games page after this section — 2 minutes.'
    },
    {
      id: 'first-plot',
      eyebrow: 'matplotlib',
      title: 'Your first chart: figure, axes, plot',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import matplotlib.pyplot as plt

weeks = [1, 2, 3, 4, 5, 6]
revenue = [5200, 5650, 5480, 6100, 6420, 6900]

fig, ax = plt.subplots()              # a figure (canvas) with one axes (plot area)
ax.plot(weeks, revenue, marker="o")
ax.set_title("Weekly revenue is growing")
ax.set_xlabel("Week")
ax.set_ylabel("Revenue (THB)")
plt.show()
`
        },
        {
          type: 'analogy',
          title: 'A painting',
          body: 'The figure is the canvas on the easel; an axes is one painted picture on it (a canvas can hold several). Everything you draw — lines, titles, labels — is a method on the axes: ax.plot, ax.set_title…'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Titles that say the finding',
          body: '“Weekly revenue is growing” tells the reader what to see. “Revenue by week” makes them work it out. Put the insight in the title.'
        }
      ]
    },
    {
      id: 'line-bar',
      eyebrow: 'Real data',
      title: 'Line and bar charts from a DataFrame',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          title: 'Trend: revenue per week',
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("cafe_sales.csv", parse_dates=["date"])
df["revenue"] = df["quantity"] * df["unit_price"]

weekly = df.set_index("date")["revenue"].resample("W").sum()

fig, ax = plt.subplots()
ax.plot(weekly.index, weekly.values, marker="o")
ax.set_title("Weekly revenue, Jan–Mar 2026")
ax.set_ylabel("THB")
fig.autofmt_xdate()                    # tilt the date labels
plt.show()
`
        },
        {
          type: 'code',
          runnable: true,
          title: 'Comparison: revenue per branch',
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("cafe_sales.csv")
df["revenue"] = df["quantity"] * df["unit_price"]
by_branch = df.groupby("branch")["revenue"].sum().sort_values()

fig, ax = plt.subplots(figsize=(7, 3))
ax.barh(by_branch.index, by_branch.values)
for y, value in enumerate(by_branch.values):
    ax.text(value, y, f" {value:,}", va="center")
ax.set_title("Downtown earns the most")
ax.set_xlabel("Revenue (THB)")
plt.show()
`
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Bars start at zero',
          body: 'A bar’s length IS the value. If the axis starts at 5,000 instead of 0, a 10% difference can look like a 300% difference. Line charts may zoom in; bar charts must not.'
        }
      ]
    },
    {
      id: 'histogram',
      eyebrow: 'Distribution',
      title: 'Histograms: how values are spread',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

students = pd.read_csv("students.csv")
print(students["score"].describe().round(1))

fig, ax = plt.subplots()
ax.hist(students["score"], bins=8, edgecolor="white")
ax.axvline(students["score"].mean(), color="#B03A1E", linestyle="--", label="mean")
ax.axvline(50, color="#2E7550", label="pass mark")
ax.set_title("Exam scores of 40 students")
ax.set_xlabel("Score")
ax.set_ylabel("Number of students")
ax.legend()
plt.show()
`
        },
        {
          type: 'analogy',
          title: 'Sorting into buckets',
          body: 'A histogram lines up buckets (0–10, 10–20, …), drops each student into the bucket for their score, and shows how full each bucket is. Change bins= and you change the bucket width — try 4 and 20.'
        }
      ]
    },
    {
      id: 'scatter',
      eyebrow: 'Relationships',
      title: 'Scatter plots and correlation',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

students = pd.read_csv("students.csv")
numeric = students[["hours_studied", "sleep_hours", "attendance_pct", "score"]]
print(numeric.corr().round(2)["score"])

colors = students["passed"].map({"yes": "#2A62A6", "no": "#B03A1E"})
fig, ax = plt.subplots()
ax.scatter(students["hours_studied"], students["score"], c=colors)
ax.set_title("More study hours, higher scores (blue = passed)")
ax.set_xlabel("Hours studied per week")
ax.set_ylabel("Exam score")
plt.show()
`
        },
        {
          type: 'text',
          body: [
            'The **correlation coefficient** r runs from −1 (perfect opposite) through 0 (no straight-line relationship) to +1 (perfectly together). Around 0.7 or more is a strong relationship.'
          ]
        },
        {
          type: 'analogy',
          title: 'Ice cream and sunburn',
          body: 'Ice-cream sales and sunburns rise together — but ice cream doesn’t cause sunburn; hot sunny days cause both. Correlation shows that two things move together, never WHY. Here, study hours probably do help, but our data alone cannot prove it.'
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'Theory + real world',
      title: 'How charts mislead — and charts that changed history',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            '**Theory — perception.** People judge **position and length** most accurately, then angle and area, and colour shades least accurately. That is why bars and dots beat pies and bubbles for precise comparison — and why a cut axis can fool everyone.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Same numbers, two stories',
          code: py`
import matplotlib.pyplot as plt

branches = ["Downtown", "Riverside"]
satisfaction = [86, 82]                       # % satisfied customers

fig, (misleading, honest) = plt.subplots(1, 2, figsize=(10, 3.5))
misleading.bar(branches, satisfaction, color=["#2A62A6", "#B03A1E"])
misleading.set_ylim(80, 87)
misleading.set_title("Misleading: axis starts at 80")

honest.bar(branches, satisfaction, color="#2A62A6")
honest.set_ylim(0, 100)
honest.set_title("Honest: axis starts at 0")
for ax in (misleading, honest):
    ax.set_ylabel("% satisfied")
plt.tight_layout()
plt.show()
`
        },
        {
          type: 'case',
          domain: 'History · London, 1854',
          title: 'John Snow’s cholera map',
          problem:
            'A cholera outbreak was killing hundreds; many believed it spread through “bad air”.',
          data: 'The home address of each death, marked on a street map with the water pumps.',
          method: 'Deaths clustered around one pump on Broad Street.',
          outcome:
            'The pump handle was removed; the map became a founding story of epidemiology — disease spread through water.'
        },
        {
          type: 'case',
          domain: 'History · Crimean War',
          title: 'Florence Nightingale’s diagram',
          problem:
            'Convince officials that army hospitals, not battles, were killing most soldiers.',
          data: 'Monthly deaths by cause: wounds, preventable disease, other.',
          method:
            'A “rose” diagram (1858) where the area of each wedge showed the deaths per month.',
          outcome:
            'It made preventable deaths impossible to ignore and helped drive sanitation reform.'
        }
      ]
    },
    {
      id: 'pandas-plot',
      eyebrow: 'Shortcuts',
      title: 'pandas .plot() and side-by-side charts',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("cafe_sales.csv")
payments = pd.crosstab(df["branch"], df["payment"], normalize="index") * 100
units = df.groupby("category")["quantity"].sum()

fig, (left, right) = plt.subplots(1, 2, figsize=(11, 4))
payments.plot(kind="bar", stacked=True, ax=left, rot=0)
left.set_title("Campus customers prefer QR")
left.set_ylabel("% of orders")
left.set_xlabel("")
left.legend(title="Payment", loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=3)

units.sort_values().plot(kind="barh", ax=right)
right.set_title("Units sold by category")
plt.tight_layout()
plt.show()
`
        },
        {
          type: 'table',
          columns: ['Good chart checklist', 'Why'],
          rows: [
            ['Title states the finding', 'Readers remember conclusions, not axes'],
            ['Axes labelled with units', '“Revenue (THB)” not “value”'],
            ['Bars start at zero', 'Lengths must be honest'],
            ['No 3-D, no unnecessary colour', 'Decoration hides the data'],
            ['Colour means something', 'Highlight the one bar that matters']
          ]
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework',
          body: 'With students.csv: draw a histogram of sleep_hours and a scatter of sleep_hours vs score. Write a one-sentence finding as the title of each chart.'
        }
      ]
    }
  ]
}

export default day9
