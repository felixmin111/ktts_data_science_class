import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day4: Lesson = {
  id: 'ds-4',
  track: 'data-science',
  day: 4,
  title: 'Collections: where data lives',
  summary:
    'The four containers every dataset starts in — list, dict, tuple and set — and why choosing the right one matters.',
  durationMinutes: 60,
  topics: ['list', 'dict', 'tuple & set', 'Mutability'],
  available: true,
  sections: [
    {
      id: 'lists',
      eyebrow: 'list',
      title: 'Lists: an ordered row of values',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'A **list** keeps many values in order, inside square brackets. It is the simplest possible “column” of data.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
daily_sales = [120, 95, 140, 88, 160]

print(daily_sales[0])        # first day
print(daily_sales[-1])       # last day
print(daily_sales[1:3])      # days 2 and 3 (stop excluded)
print(len(daily_sales), sum(daily_sales), min(daily_sales), max(daily_sales))
print(sum(daily_sales) / len(daily_sales))   # the average
print(sorted(daily_sales, reverse=True))
`
        },
        {
          type: 'analogy',
          title: 'A train',
          body: 'A list is a train: carriages in a fixed order, numbered from 0. You can look into carriage 2, count the carriages, or couple a new one at the end — and the carriages can carry anything.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Lists can change (they are mutable)',
          code: py`
items = ["Latte", "Cookie"]
items.append("Thai Tea")      # add to the end
items.insert(0, "Mocha")      # add at position 0
items[1] = "Iced Latte"       # replace
items.remove("Cookie")        # remove by value
print(items)
print("Thai Tea" in items)    # membership test
`
        }
      ],
      notes:
        'Link back to Day 1: strings are sequences too, so indexing and slicing work the same way. The new idea is that lists are MUTABLE — strings were not.'
    },
    {
      id: 'mutability',
      eyebrow: 'list · deep dive',
      title: 'Two names, one list: the mutability trap',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            'Remember Day 1: `=` attaches a name tag, it never copies. With numbers that was harmless, because numbers cannot change. Lists **can** change — so two tags on one list share every change.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
monday = ["Latte", "Cookie"]
tuesday = monday              # same list, second name tag
tuesday.append("Mocha")

print(monday)                 # surprise!
print(monday is tuesday)

wednesday = monday.copy()     # a real, separate copy
wednesday.append("Thai Tea")
print(monday)
print(wednesday)
`
        },
        {
          type: 'analogy',
          title: 'A shared Google Doc',
          body: 'b = a shares the link to the same document: anyone editing it changes it for everyone. a.copy() is “Make a copy” — a new document you can edit safely.'
        },
        {
          type: 'quiz',
          question: 'What is printed?',
          code: py`
a = [1, 2]
b = a
b.append(3)
print(len(a))
`,
          options: ['2', '3', 'Error', '1'],
          answer: 1,
          explanation:
            'a and b are two tags on ONE list, so the append is visible through a as well.'
        }
      ],
      notes:
        'This bug bites data scientists constantly — pandas has the same idea (views vs copies, and the SettingWithCopyWarning). Planting it now saves hours later.'
    },
    {
      id: 'dicts',
      eyebrow: 'dict',
      title: 'Dictionaries: look things up by name',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'A **dict** maps **keys** to **values**. Instead of “the 3rd value”, you ask for “the value called price”. Lookup is instant, even with millions of keys.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: py`
menu = {"Latte": 75, "Americano": 60, "Thai Tea": 55}

print(menu["Latte"])                 # look up by key
menu["Croissant"] = 65               # add a new pair
menu["Latte"] = 80                   # update a value
print(menu.get("Mocha", "not sold")) # safe lookup with a default
print(len(menu), list(menu.keys()))
print(menu)
`
        },
        {
          type: 'analogy',
          title: 'A phone book',
          body: 'You never read a phone book from page 1. You jump to the name and read the number. Keys are the names (they must be unique), values are the numbers.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Asking for a key that does not exist',
          code: py`
menu = {"Latte": 75}
print(menu["Mocha"])
`
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'KeyError',
          body: 'menu["Mocha"] crashes if the key is missing. Use menu.get("Mocha") (gives None) or check with "Mocha" in menu first.'
        }
      ]
    },
    {
      id: 'records',
      eyebrow: 'list + dict',
      title: 'A list of dicts is a table',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            'Combine them and you get the shape of almost every dataset: each **dict is a row** (one order), each **key is a column** name. This is exactly what you will load into pandas later.'
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
]

print(len(orders), "orders")
print(orders[0])                          # the first row
print(orders[1]["item"])                  # row 1, column "item"
first = orders[0]
print("Revenue of order 1:", first["quantity"] * first["unit_price"])
`
        },
        {
          type: 'table',
          codeColumns: [1, 2],
          columns: ['Python', 'Spreadsheet word', 'pandas word (Day 7)'],
          rows: [
            ['The whole list', 'orders', 'DataFrame'],
            ['One dict', 'orders[0]', 'a row'],
            ['One key', '"item"', 'a column']
          ]
        },
        {
          type: 'callout',
          tone: 'success',
          title: 'Your turn',
          body: 'Add a fourth order, then print the branch of the last order using a negative index.'
        }
      ],
      notes:
        'To total ALL orders we need a loop — that is exactly the motivation for Day 5. Ask her: how would you add up revenue for 240 orders? (Let her feel the need for loops.)'
    },
    {
      id: 'tuples-sets',
      eyebrow: 'tuple & set',
      title: 'Tuples and sets: the specialists',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
# tuple: a fixed record that must not change
location = (16.7769, 96.1590)        # latitude, longitude
lat, lon = location                  # unpacking (Day 1!)
print(lat, lon)

# set: unique values only, no order
items_sold = ["Latte", "Cookie", "Latte", "Mocha", "Cookie"]
unique_items = set(items_sold)
print(unique_items, len(unique_items))
print({"Latte", "Mocha"} & {"Mocha", "Thai Tea"})   # in both
`
        },
        {
          type: 'table',
          columns: ['Type', 'Syntax', 'Ordered?', 'Changeable?', 'Real-world analogy'],
          codeColumns: [1],
          rows: [
            ['list', '[1, 2, 2]', 'yes', 'yes', 'A train of carriages'],
            ['tuple', '(1, 2, 2)', 'yes', 'no', 'A printed receipt'],
            ['dict', '{"a": 1}', 'yes (insertion)', 'yes', 'A phone book'],
            ['set', '{1, 2}', 'no', 'yes', 'A guest list — each name once']
          ]
        },
        {
          type: 'quiz',
          question: 'You need the number of DIFFERENT customers who visited. Best tool?',
          options: ['list', 'tuple', 'set', 'dict'],
          answer: 2,
          explanation:
            'A set throws away duplicates automatically, so len(set(customers)) counts unique visitors.'
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'Theory + real world',
      title: 'Choosing a structure: speed and real APIs',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            '**Theory — how lookups work.** `x in my_list` checks the items one by one, so a list twice as long takes twice as long (computer scientists write O(n)). A dict or set uses **hashing**: it computes where the key must live and jumps straight there, so the time barely grows with size (O(1)).'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Find one customer among a million',
          code: py`
import time

ids_list = list(range(1_000_000))
ids_set = set(ids_list)

start = time.perf_counter()
found = 999_999 in ids_list
list_ms = (time.perf_counter() - start) * 1000

start = time.perf_counter()
found = 999_999 in ids_set
set_ms = (time.perf_counter() - start) * 1000

print(f"list: {list_ms:.3f} ms | set: {set_ms:.4f} ms")
`
        },
        {
          type: 'analogy',
          title: 'A pile vs a phone book',
          body: 'Finding a name in an unsorted pile of papers means checking every page (a list). A phone book’s alphabetical tabs take you straight to the right page (a dict or set).'
        },
        {
          type: 'case',
          domain: 'Every app you use',
          title: 'APIs speak in lists and dicts',
          problem: 'A weather app must show today’s forecast from a weather service.',
          data: 'The service returns JSON — text that looks exactly like Python lists and dicts.',
          method:
            'json.loads turns that text into dicts and lists; the app reads the keys it needs.',
          outcome:
            'Most data you will ever download — from banks, maps or social media — arrives this way.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Read an API-style JSON response',
          code: py`
import json

response = '{"city": "Yangon", "forecast": [{"day": "Mon", "max_c": 33, "rain_pct": 60}, {"day": "Tue", "max_c": 31, "rain_pct": 85}]}'
data = json.loads(response)

print(data["city"])
for day in data["forecast"]:
    umbrella = "take an umbrella" if day["rain_pct"] >= 70 else "no umbrella"
    print(day["day"], day["max_c"], "°C ->", umbrella)
`
        }
      ]
    },
    {
      id: 'review',
      eyebrow: 'Review',
      title: 'Check your understanding',
      minutes: 6,
      blocks: [
        {
          type: 'quiz',
          question: 'What does this print?',
          code: py`
prices = {"Latte": 75, "Mocha": 85}
print(prices.get("Tea", 0))
`,
          options: ['0', 'None', 'KeyError', '"Tea"'],
          answer: 0,
          explanation: '.get() returns the default (0) when the key is missing.'
        },
        {
          type: 'quiz',
          question: 'Which line makes an independent copy of the list sales?',
          options: [
            'backup = sales',
            'backup = sales.copy()',
            'backup == sales',
            'backup = [sales]'
          ],
          answer: 1,
          explanation: '= only adds a name tag. .copy() builds a new list.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework',
          body: 'Make a list of 5 dicts describing your favourite cafés or foods (name, price, rating). Print the second one, the price of the last one, and the set of unique ratings.'
        }
      ]
    }
  ]
}

export default day4
