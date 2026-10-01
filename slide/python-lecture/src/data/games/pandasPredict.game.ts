import type { GameDefinition } from '@/models/game.model'

const pandasPredict: GameDefinition = {
  id: 'pandas-predict',
  title: 'pandas Predictor',
  tagline: 'Collections, NumPy and pandas: predict the result.',
  icon: 'table',
  color: '#7B5EA7',
  track: 'data-science',
  day: 7,
  secondsPerQuestion: 25,
  questionsPerRound: 8,
  bank: [
    {
      prompt: 'What is printed?',
      code: 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)',
      options: ['[1, 2, 3]', '[1, 2]', '[3]', 'Error'],
      answer: 0,
      explanation: 'a and b are two names for one list — the append changes both.'
    },
    {
      prompt: 'What is printed?',
      code: 'menu = {"Latte": 75}\nprint(menu.get("Mocha", 0))',
      options: ['0', 'None', 'KeyError', '75'],
      answer: 0,
      explanation: '.get returns the default when the key is missing.'
    },
    {
      prompt: 'What is the result?',
      code: '[p for p in [75, 35, 60] if p > 50]',
      options: ['[75, 60]', '[35]', '[True, False, True]', '[75, 35, 60]'],
      answer: 0,
      explanation: 'The if keeps only prices greater than 50.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(len(set(["a", "b", "a", "c", "b"])))',
      options: ['3', '5', '2', '6'],
      answer: 0,
      explanation: 'A set keeps unique values: a, b, c.'
    },
    {
      prompt: 'What is printed?',
      code: 'import numpy as np\nprint(np.array([1, 2, 3]) * 2)',
      options: ['[2 4 6]', '[1, 2, 3, 1, 2, 3]', '[1 2 3 1 2 3]', '12'],
      answer: 0,
      explanation: 'Arrays do element-wise maths; lists would repeat.'
    },
    {
      prompt: 'What is printed?',
      code: 'import numpy as np\na = np.array([4, 9, 2, 7])\nprint(a[a > 5])',
      options: ['[9 7]', '[False True False True]', '[4 2]', '2'],
      answer: 0,
      explanation: 'The boolean mask keeps the values where the condition is True.'
    },
    {
      prompt: 'What is printed?',
      code: 'import numpy as np\nm = np.ones((3, 4))\nprint(m.sum(axis=0).shape)',
      options: ['(4,)', '(3,)', '(3, 4)', '()'],
      answer: 0,
      explanation: 'axis=0 (the rows) collapses, leaving one value per column.'
    },
    {
      prompt: 'What is printed?',
      code: 'import numpy as np\nprint(np.array([1, 2.5, 3]).dtype)',
      options: ['float64', 'int64', 'object', 'mixed'],
      answer: 0,
      explanation: 'One float upgrades the whole array to float64.'
    },
    {
      prompt: 'df has 240 rows and 8 columns. What is df.shape?',
      options: ['(240, 8)', '(8, 240)', '1920', '[240, 8]'],
      answer: 0,
      explanation: 'shape is a (rows, columns) tuple.'
    },
    {
      prompt: 'What type does this return?',
      code: 'df["price"]',
      options: ['Series', 'DataFrame', 'list', 'ndarray'],
      answer: 0,
      explanation: 'One column name in single brackets returns a Series.'
    },
    {
      prompt: 'What type does this return?',
      code: 'df[["item", "price"]]',
      options: ['DataFrame', 'Series', 'list', 'tuple'],
      answer: 0,
      explanation: 'A LIST of column names returns a DataFrame.'
    },
    {
      prompt: 'With the default index, how many rows?',
      code: 'df.loc[0:4]',
      options: ['5', '4', '3', '0'],
      answer: 0,
      explanation: 'loc slices by label and includes the end: labels 0–4.'
    },
    {
      prompt: 'With the default index, how many rows?',
      code: 'df.iloc[0:4]',
      options: ['4', '5', '3', '0'],
      answer: 0,
      explanation: 'iloc slices by position and excludes the end, like Python lists.'
    },
    {
      prompt: 'Which line keeps Campus orders with quantity ≥ 3?',
      options: [
        'df[(df["branch"] == "Campus") & (df["quantity"] >= 3)]',
        'df[df["branch"] == "Campus" and df["quantity"] >= 3]',
        'df[(df["branch"] = "Campus") & (df["quantity"] >= 3)]',
        'df.filter("Campus", 3)'
      ],
      answer: 0,
      explanation: 'Use & with brackets around each comparison, and == for equality.'
    },
    {
      prompt: 'What does this produce?',
      code: 'df.groupby("branch")["revenue"].sum()',
      options: [
        'Total revenue per branch',
        'Total revenue of all branches',
        'Number of branches',
        'Average revenue per order'
      ],
      answer: 0,
      explanation: 'Split by branch, sum revenue within each group, combine into one Series.'
    },
    {
      prompt: 'A column of ints has one missing value. Its dtype becomes…',
      options: ['float64', 'int64', 'object', 'bool'],
      answer: 0,
      explanation: 'NaN is a float, so pandas stores the column as float64.'
    }
  ]
}

export default pandasPredict
