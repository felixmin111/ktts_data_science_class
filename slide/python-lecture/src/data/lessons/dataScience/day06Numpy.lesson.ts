import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day6: Lesson = {
  id: 'ds-6',
  track: 'data-science',
  day: 6,
  title: 'NumPy: thinking in whole arrays',
  summary:
    'Vectorized maths, boolean masks, 2-D arrays, axes and broadcasting — the engine underneath pandas.',
  durationMinutes: 60,
  topics: ['ndarray', 'Vectorization', 'Boolean masks', 'axis', 'Broadcasting'],
  available: true,
  sections: [
    {
      id: 'why-numpy',
      eyebrow: 'Why NumPy?',
      title: 'Lists are flexible. Arrays are fast.',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import numpy as np

prices_list = [75, 60, 55]
prices = np.array([75, 60, 55])

print(prices_list * 2)      # a list repeats itself
print(prices * 2)           # an array does maths on every element
print(prices * 1.07)
print(prices + np.array([5, 5, 5]))
`
        },
        {
          type: 'analogy',
          title: 'Hand-washing vs a dishwasher',
          body: 'A Python for loop washes each dish by hand, checking what kind of dish it is every time. NumPy loads the whole rack into a dishwasher built for one kind of dish and runs it in one go (in fast C code). That is called vectorization.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'See the speed difference yourself',
          code: py`
import time
import numpy as np

numbers = list(range(1_000_000))
array = np.arange(1_000_000)

start = time.perf_counter()
total = 0
for n in numbers:
    total += n * 2
loop_ms = (time.perf_counter() - start) * 1000

start = time.perf_counter()
total_np = (array * 2).sum()
numpy_ms = (time.perf_counter() - start) * 1000

print(total == total_np)
print(f"loop: {loop_ms:.1f} ms | numpy: {numpy_ms:.1f} ms | {loop_ms / numpy_ms:.0f}x faster")
`
        }
      ],
      notes:
        'Exact speed-ups vary by machine (and are smaller in the browser), but NumPy is typically tens of times faster. The deeper reason: an array stores raw numbers of ONE type side by side in memory, so no per-element type checks.'
    },
    {
      id: 'arrays',
      eyebrow: 'ndarray',
      title: 'Anatomy of an array: dtype, shape, ndim',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import numpy as np

temps = np.array([31.5, 33.0, 29.8, 35.2, 30.1])
print(temps.dtype, temps.shape, temps.ndim, temps.size)

print(np.arange(0, 10, 2))         # like range, but an array
print(np.linspace(0, 1, 5))        # 5 evenly spaced points from 0 to 1
print(np.zeros(3), np.ones(3))

mixed = np.array([1, 2.5, 3])
print(mixed, mixed.dtype)          # everything became float
`
        },
        {
          type: 'analogy',
          title: 'An egg tray',
          body: 'Every slot in an egg tray is the same size and holds the same kind of thing. An array is the same: one dtype for every element. Try to put a 2.5 among integers and NumPy upgrades the whole tray to floats.'
        },
        {
          type: 'table',
          columns: ['Attribute', 'Meaning', 'For temps'],
          codeColumns: [0, 2],
          rows: [
            ['dtype', 'type of every element', 'float64'],
            ['shape', 'size along each dimension', '(5,)'],
            ['ndim', 'number of dimensions', '1'],
            ['size', 'total number of elements', '5']
          ]
        }
      ]
    },
    {
      id: 'aggregations',
      eyebrow: 'Statistics',
      title: 'Vectorized maths and summary statistics',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import numpy as np

quantity = np.array([2, 1, 3, 1, 4, 2])
unit_price = np.array([75, 60, 35, 85, 55, 75])

revenue = quantity * unit_price       # element by element, no loop
print(revenue)
print("total:", revenue.sum())
print("mean:", revenue.mean(), "| median:", np.median(revenue))
print("std:", round(revenue.std(), 1))
print("biggest order is at position", revenue.argmax())
print(np.round(revenue / revenue.sum() * 100, 1))   # % share of each order
`
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Mean vs median',
          body: 'The mean is pulled by extreme values; the median is the middle value. If one customer orders 50 lattes, the mean jumps but the median barely moves. Report the median for skewed data like incomes or order sizes.'
        }
      ]
    },
    {
      id: 'masks',
      eyebrow: 'Boolean masks',
      title: 'Filtering with True/False masks',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import numpy as np

temps = np.array([31.5, 33.0, 29.8, 35.2, 30.1, 36.4])

hot = temps > 33              # compare every element at once
print(hot)
print(temps[hot])             # keep only the True positions
print(hot.sum(), "hot days")  # True counts as 1
print(temps[(temps > 30) & (temps < 35)])   # and -> &, or -> |, use brackets!
`
        },
        {
          type: 'analogy',
          title: 'A stencil',
          body: 'A mask is a stencil with holes in some positions. Lay it over the array and only the values under the holes show through. This exact idea becomes df[df["price"] > 60] in pandas.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Common mistake: and instead of &',
          code: py`
import numpy as np

temps = np.array([31.5, 33.0, 29.8])
print(temps[(temps > 30) and (temps < 33)])
`
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: py`
a = np.array([4, 9, 2, 7])
print(a[a > 5].sum())
`,
          options: ['16', '22', '2', '[9 7]'],
          answer: 0,
          explanation: 'The mask keeps 9 and 7; their sum is 16.'
        }
      ]
    },
    {
      id: 'two-d',
      eyebrow: '2-D arrays',
      title: 'Rows, columns and the axis argument',
      minutes: 10,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import numpy as np

# rows = branches, columns = weeks 1-4 (cups sold)
sales = np.array([
    [120, 135, 150, 160],   # Downtown
    [ 80,  85,  90,  70],   # Riverside
    [ 60,  95,  40, 110],   # Campus
])
print(sales.shape)
print(sales[0])           # Downtown, all weeks
print(sales[:, 3])        # all branches, week 4
print(sales[2, 1])        # Campus, week 2

print(sales.sum(axis=1))  # total per branch (collapse the columns)
print(sales.sum(axis=0))  # total per week (collapse the rows)
`
        },
        {
          type: 'analogy',
          title: 'Spreadsheet totals',
          body: 'axis=0 squashes DOWN the rows and gives one total per column — the totals row at the bottom. axis=1 squashes ACROSS the columns and gives one total per row — the totals column on the right. The axis you name is the one that disappears.'
        },
        {
          type: 'quiz',
          question: 'sales has shape (3, 4). What is the shape of sales.mean(axis=0)?',
          options: ['(3,)', '(4,)', '(3, 4)', '()'],
          answer: 1,
          explanation: 'axis 0 (the 3 rows) disappears, leaving one value per column: (4,).'
        }
      ]
    },
    {
      id: 'broadcasting',
      eyebrow: 'Broadcasting',
      title: 'Broadcasting: stretch the smaller array',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import numpy as np

cups = np.array([
    [10, 4, 6],    # Monday:  Latte, Cookie, Thai Tea
    [12, 2, 8],    # Tuesday
])
prices = np.array([75, 35, 55])     # one price per column

revenue = cups * prices             # (2, 3) * (3,) -> (2, 3)
print(revenue)
print(revenue.sum(axis=1))          # revenue per day
print(cups * 1.07)                  # a single number broadcasts too
`
        },
        {
          type: 'analogy',
          title: 'Price stickers',
          body: 'You have one row of price stickers and a whole table of quantities. NumPy “photocopies” the sticker row for every day (without really copying memory) and multiplies cell by cell.'
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'The rule',
          body: 'Compare shapes from the right: each pair of sizes must be equal, or one of them must be 1. (2, 3) with (3,) works; (2, 3) with (2,) raises a ValueError.'
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'Theory + real world',
      title: 'Vectors, matrices — and images are arrays',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            '**Theory.** In maths a 1-D array is a **vector** and a 2-D array is a **matrix**. Linear algebra — adding, scaling and multiplying vectors and matrices — is the language of machine learning: a model is largely a set of matrices of numbers that the data is multiplied through.',
            'A greyscale photo is just a matrix of brightness values (0 = black, 255 = white). A colour photo is a 3-D array: height × width × 3 colour channels (red, green, blue).'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Edit an “image” with array maths',
          code: py`
import numpy as np
import matplotlib.pyplot as plt

face = np.full((9, 9), 40)                   # dark background
face[2, 2] = face[2, 6] = 255                # eyes
face[5, 2:7] = 200                           # mouth
face[4, 1] = face[4, 7] = 200                # mouth corners
print(face.shape, face.dtype, face.min(), face.max())

brighter = np.clip(face + 100, 0, 255)       # one line, every pixel
inverted = 255 - face

fig, axes = plt.subplots(1, 3, figsize=(9, 3))
for ax, image, title in zip(axes, [face, brighter, inverted], ["original", "+100 brightness", "inverted"]):
    ax.imshow(image, cmap="gray", vmin=0, vmax=255)
    ax.set_title(title)
    ax.axis("off")
plt.show()
`
        },
        {
          type: 'case',
          domain: 'Phones & hospitals',
          title: 'Photo filters and medical scans',
          problem: 'Brighten a photo instantly, or highlight a tumour on a scan.',
          data: 'Images stored as arrays of millions of numbers.',
          method:
            'Vectorized array maths (add, multiply, clip) on every pixel at once; ML models read the same arrays.',
          outcome:
            'Filters apply in real time; models can flag scans for a radiologist to review first.'
        },
        {
          type: 'analogy',
          title: 'Paint by numbers',
          body: 'A digital image is a paint-by-numbers grid where each number is a shade. “Brighten” means adding to every number; “invert” means 255 minus every number. NumPy does the whole grid in one stroke.'
        }
      ]
    },
    {
      id: 'random',
      eyebrow: 'Simulation',
      title: 'Random numbers and the law of large numbers',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: py`
import numpy as np

rng = np.random.default_rng(seed=42)   # a seed makes results repeatable

for n in [10, 100, 10_000, 1_000_000]:
    rolls = rng.integers(1, 7, size=n)  # dice: 1..6
    print(f"{n:>9,} rolls -> average {rolls.mean():.3f}")
`
        },
        {
          type: 'text',
          body: [
            'The true average of a fair die is 3.5. With few rolls the average wanders; with many rolls it settles. This is why a survey of 10 people is noisy and a survey of 10,000 is reliable.'
          ]
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework',
          body: 'Simulate 7 days of temperatures with rng.normal(32, 2, size=7). Print the hottest day number (argmax + 1), how many days were above 33 °C, and the temperatures converted to Fahrenheit (C * 9 / 5 + 32) — without a loop.'
        }
      ]
    }
  ]
}

export default day6
