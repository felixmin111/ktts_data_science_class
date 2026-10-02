import type { Lesson } from '@/models/lesson.model'
import { action, decision, skip } from '@/functions/flow.function'

const day2: Lesson = {
  id: 'day-2',
  track: 'foundations',
  day: 2,
  title: 'Numbers, operators and a calculator',
  summary:
    'Type conversion, operator precedence, comparisons, and/or/not and your first if — then build a working calculator.',
  durationMinutes: 60,
  topics: ['Type conversion', 'Operators', 'Comparisons & bool', 'if / elif / else', 'Calculator'],
  available: true,
  sections: [
    {
      id: 'recap',
      eyebrow: 'Warm-up',
      title: 'Yesterday in one program',
      minutes: 2,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: 'price = input("Price? ")\nqty = input("How many? ")\nprint(price * qty)',
          stdin: ['20', '3']
        },
        {
          type: 'quiz',
          question: 'Why does this program crash?',
          options: [
            'print() cannot show numbers',
            'input() returned two strings, and str * str is not allowed',
            'price is a reserved keyword',
            '20 * 3 is too big'
          ],
          answer: 1,
          explanation:
            'input() always returns a str. "20" * 3 would repeat text, but "20" * "3" is a TypeError. Today we fix this for good.'
        }
      ],
      notes:
        'Let the student predict the error before running. Then ask: how would you fix it with what we learned on Day 1?'
    },
    {
      id: 'implicit-conversion',
      eyebrow: 'Type conversion',
      title: 'Python converts for you — but only upward',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          body: [
            'The number types sit on a ladder: **bool → int → float**. When two different number types meet in an operation, Python quietly moves the lower one **up** to the higher one, so nothing is lost. It never moves a value down.',
            '**bool → int:** `bool` is a subtype of `int`, so `True` behaves like 1 and `False` like 0. `True + 5` is the int 6.',
            '**int → float:** every int fits in a float, but not the other way round (a float would lose its decimals). So int + float always gives a **float**, and `/` always gives a float too, even for `7 / 7`.',
            '**str:** text is **never** converted automatically. `"Age: " + 20` is a TypeError because Python won’t guess whether you meant text or a number. You convert it yourself with `str()`, `int()` or `float()`.'
          ]
        },
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Expression', 'Result', 'What happened'],
          rows: [
            ['True + 5', '6', 'bool + int → int (True becomes 1)'],
            ['True + 2.5', '3.5', 'bool + float → float (True becomes 1.0)'],
            ['5 * False', '0', 'bool + int → int (False becomes 0)'],
            ['3 + 2.0', '5.0', 'int + float → float'],
            ['7 / 7', '1.0', '/ always gives a float, even with two ints'],
            ['1 == 1.0', 'True', 'Comparisons convert too: 1 becomes 1.0'],
            ['"Hi" * 3', '"HiHiHi"', 'Not a conversion: * repeats a string'],
            ['"Age: " + 20', 'TypeError', 'str + int: never converted automatically'],
            [
              '"1.5" + 2.0',
              'TypeError',
              'str + float: same rule, even if the text looks like a number'
            ],
            ['"Age: " + str(20)', '"Age: 20"', 'Fix: convert it yourself']
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: '# bool → int\nprint(True + 5, type(True + 5))\n# bool → float\nprint(True + 2.5)\n# int → float\nprint(3 + 2.0, type(3 + 2.0))\nprint(7 / 7)          # / always gives a float\n# all three on one ladder\nprint(True + 1 + 2.0)\nprint(isinstance(True, int))\n# str is never converted\nprint("Age: " + str(20))\nprint("Age: " + 20)',
          output:
            "6 <class 'int'>\n3.5\n5.0 <class 'float'>\n1.0\n4.0\nTrue\nAge: 20\nTypeError: can only concatenate str (not \"int\") to str"
        },
        {
          type: 'analogy',
          title: 'Pouring water',
          body: 'You can pour a small glass (int) into a big jug (float) without spilling. Pouring the jug into the glass could lose water — so Python never does that on its own.'
        }
      ]
    },
    {
      id: 'explicit-conversion',
      eyebrow: 'Type conversion',
      title: 'int(), float(), str(), round()',
      minutes: 6,
      blocks: [
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Call', 'Result', 'Note'],
          rows: [
            ['int(" 42 ")', '42', 'Spaces around the number are ignored'],
            ['int("1_000")', '1000', 'Underscores between digits are allowed'],
            ['int(3.99)', '3', 'Cuts toward zero — no rounding'],
            ['int(-3.99)', '-3', 'Still toward zero, not down'],
            ['round(3.99)', '4', 'Rounds to the nearest int'],
            ['round(2.5)', '2', 'Ties go to the even number (banker’s rounding)'],
            ['round(3.14159, 2)', '3.14', 'Second argument = digits to keep'],
            ['float("1e3")', '1000.0', 'Scientific notation works'],
            ['str(3.0)', '"3.0"', 'Number → text, exactly as Python shows it']
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Fix the warm-up program',
          code: 'price = float(input("Price? "))\nqty = int(input("How many? "))\ntotal = price * qty\nprint(f"Total: {total:.2f} THB")',
          stdin: ['19.5', '3']
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Pick the right converter',
          body: 'Quantities you count (people, items) → int(). Measurements (price, weight, height) → float(). int("19.5") is a ValueError; use float() for anything that may have a decimal point.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(int(7.9), round(7.9))',
          options: ['7 7', '8 8', '7 8', '8 7'],
          answer: 2,
          explanation:
            'int() chops off the decimal part (7); round() goes to the nearest whole number (8).'
        }
      ]
    },
    {
      id: 'truthiness',
      eyebrow: 'Type conversion · bool',
      title: 'bool(): what counts as True?',
      minutes: 4,
      blocks: [
        {
          type: 'text',
          body: [
            'Every value can be turned into `True` or `False`. The rule is simple: **empty or zero is False, everything else is True.**'
          ]
        },
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Value', 'bool(value)', 'Why'],
          rows: [
            ['0, 0.0', 'False', 'Zero'],
            ['""', 'False', 'Empty string'],
            ['None', 'False', 'Nothing at all'],
            ['42, -1, 0.5', 'True', 'Any non-zero number'],
            ['"0"', 'True', 'A string with one character — not empty!'],
            ['"False"', 'True', 'Still a non-empty string']
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'print(bool(0), bool(7))\nprint(bool(""), bool(" "))\nprint(bool("False"))',
          output: 'False True\nFalse True\nTrue'
        },
        {
          type: 'analogy',
          title: 'An envelope',
          body: 'bool() only asks “is there anything inside?” An envelope holding a note that says “nothing” still has something inside — so "False" is True.'
        }
      ]
    },
    {
      id: 'precedence',
      eyebrow: 'Operators',
      title: 'Who goes first? Operator precedence',
      minutes: 10,
      blocks: [
        {
          type: 'table',
          codeColumns: [1, 3],
          columns: ['Priority', 'Operators', 'Name', 'Example', 'Result'],
          rows: [
            ['1 (first)', '( )', 'Parentheses (brackets)', '(2 + 3) * 4', '20'],
            ['2', '**', 'Exponent (power)', '2 * 3 ** 2', '18'],
            ['3', '-x', 'Unary minus (negative sign)', '-2 ** 2', '-4'],
            [
              '4',
              '* / // %',
              'Multiply, divide, floor divide, modulo (remainder)',
              '10 - 6 / 2',
              '7.0'
            ],
            ['5', '+ -', 'Add, subtract', '1 + 2 * 3', '7'],
            [
              '6',
              '== != < > <= >=',
              'Comparison: equal, not equal, less than, greater than, less or equal, greater or equal',
              '1 + 1 == 2',
              'True'
            ],
            ['7', 'not', 'Logical NOT', 'not 1 == 2', 'True'],
            ['8', 'and', 'Logical AND', '1 < 2 and 2 < 3', 'True'],
            ['9 (last)', 'or', 'Logical OR', 'True or False and False', 'True']
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'print(-2 ** 2)       # ** before the minus sign\nprint((-2) ** 2)\nprint(2 ** 3 ** 2)   # ** is read right-to-left: 2 ** 9\nprint(100 / 10 / 2)  # others are read left-to-right',
          output: '-4\n4\n512\n5.0'
        },
        {
          type: 'analogy',
          title: 'Getting dressed',
          body: 'Socks before shoes, shirt before jacket. Precedence is Python’s dressing order. Brackets are you saying “do this one first, whatever the rule says.”'
        },
        {
          type: 'callout',
          tone: 'success',
          title: 'Rule of thumb',
          body: 'If you have to think about precedence, add brackets. (a + b) / 2 is clearer than relying on memory — and readers will thank you.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(2 + 3 * 2 ** 2)',
          options: ['100', '22', '14', '50'],
          answer: 2,
          explanation: '2 ** 2 = 4 first, then 3 * 4 = 12, then 2 + 12 = 14.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Exercise: add brackets',
          code: '# Add brackets so each line prints the number in its comment.\n# Run it to check yourself.\nprint(2 + 3 * 4)      # make it 20\nprint(10 - 4 - 2)     # make it 8\nprint(2 ** 3 ** 2)    # make it 64\nprint(-3 ** 2)        # make it 9'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(10 - 2 * 3)',
          options: ['24', '4', '-4', '12'],
          answer: 1,
          explanation: 'Multiply (*) before subtract (-): 2 * 3 = 6, then 10 - 6 = 4.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(8 / 2 * 4)',
          options: ['1.0', '16.0', '16', '1'],
          answer: 1,
          explanation:
            '/ and * have the same priority, so Python reads left to right: 8 / 2 = 4.0, then 4.0 * 4 = 16.0. It is a float because of /.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(20 // 3 % 4)',
          options: ['6', '0', '2', '5'],
          answer: 2,
          explanation:
            'Floor divide (//) and modulo (%) share a level, so left to right: 20 // 3 = 6, then 6 % 4 = 2.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print((2 + 3) ** 2 - 1)',
          options: ['24', '10', '8', '25'],
          answer: 0,
          explanation: 'Brackets first: 5. Then the power: 5 ** 2 = 25. Then subtract: 25 - 1 = 24.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(3 + 4 > 6 and 2 * 2 == 5)',
          options: ['True', 'False', '7', 'Error'],
          answer: 1,
          explanation:
            'Maths first (7 and 4), then comparisons (7 > 6 is True, 4 == 5 is False), then and: True and False is False.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(not True or True)',
          options: ['False', 'True', 'None', 'Error'],
          answer: 1,
          explanation: 'not goes before or: not True is False, then False or True is True.'
        }
      ]
    },
    {
      id: 'division-family',
      eyebrow: 'Operators',
      title: '//, % and divmod(): splitting things up',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          body: [
            '`a // b` asks “how many whole times does b fit?” and `a % b` asks “what is left over?”. `divmod(a, b)` gives both at once. Together they always satisfy `(a // b) * b + a % b == a`.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Seconds → minutes and seconds',
          code: 'total = 135\nminutes = total // 60\nseconds = total % 60\nprint(f"{minutes} min {seconds} s")\nprint(divmod(135, 60))',
          output: '2 min 15 s\n(2, 15)'
        },
        {
          type: 'table',
          codeColumns: [1],
          columns: ['Everyday question', 'Code', 'Answer for n = 2026'],
          rows: [
            ['Is n even?', 'n % 2 == 0', 'True'],
            ['Last digit of n', 'n % 10', '6'],
            ['n without its last digit', 'n // 10', '202'],
            ['Is n divisible by 4?', 'n % 4 == 0', 'False']
          ]
        },
        {
          type: 'analogy',
          title: 'Packing eggs',
          body: '50 eggs into boxes of 12: 50 // 12 = 4 full boxes, 50 % 12 = 2 loose eggs. The shop needs both numbers.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Deep dive: negative numbers',
          body: '// always rounds down (toward minus infinity), so -7 // 2 is -4, and % takes the sign of the divisor, so -7 % 2 is 1. That keeps the rule (a // b) * b + a % b == a true for every number.'
        }
      ]
    },
    {
      id: 'augmented',
      eyebrow: 'Operators',
      title: 'Shortcuts: +=, -=, *= …',
      minutes: 3,
      blocks: [
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Shortcut', 'Means'],
          rows: [
            ['x += 5', 'x = x + 5'],
            ['x -= 5', 'x = x - 5'],
            ['x *= 2', 'x = x * 2'],
            ['x /= 2', 'x = x / 2  (x becomes a float)'],
            ['x //= 2', 'x = x // 2'],
            ['x %= 3', 'x = x % 3'],
            ['x **= 2', 'x = x ** 2']
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'A wallet',
          code: 'balance = 500\nbalance += 250   # salary\nbalance -= 120   # lunch\nbalance *= 2     # lucky day\nprint(balance)',
          output: '1260'
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'No ++ in Python',
          body: 'x++ is a SyntaxError. Write x += 1. (And ++x is legal but does nothing: it is just two plus signs.)'
        }
      ]
    },
    {
      id: 'math-helpers',
      eyebrow: 'Numbers',
      title: 'Built-in helpers and the math module',
      minutes: 10,
      blocks: [
        {
          type: 'table',
          codeColumns: [0, 2, 3],
          columns: ['Built-in', 'What it does', 'Example', 'Result'],
          rows: [
            ['abs(x)', 'Distance from zero (drops the minus sign)', 'abs(3.5 - 10)', '6.5'],
            ['min(a, b, …)', 'Smallest of the values', 'min(4, 9, 2)', '2'],
            ['max(a, b, …)', 'Largest of the values', 'max(4, 9, 2)', '9'],
            ['pow(x, y)', 'x to the power y, same as x ** y', 'pow(2, 0.5)', '1.4142135623730951'],
            ['round(x)', 'Nearest whole number', 'round(1234.5678)', '1235'],
            ['round(x, n)', 'Keep n decimal places', 'round(3.14159, 2)', '3.14']
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Built in — no import needed',
          code: 'print(abs(-7))\nprint(min(4, 9, 2), max(4, 9, 2))\nprint(pow(2, 10))\nprint(round(1234.5678, 1))',
          output: '7\n2 9\n1024\n1234.6'
        },
        {
          type: 'table',
          codeColumns: [0, 2, 3],
          columns: ['math.…', 'What it does', 'Example', 'Result'],
          rows: [
            ['math.sqrt(x)', 'Square root (always a float)', 'math.sqrt(81)', '9.0'],
            ['math.floor(x)', 'Round down to a whole number', 'math.floor(-3.7)', '-4'],
            ['math.ceil(x)', 'Round up to a whole number', 'math.ceil(3.2)', '4'],
            ['math.trunc(x)', 'Cut off the decimals (towards zero)', 'math.trunc(-3.7)', '-3'],
            [
              'math.pi',
              'The constant π (not a function: no brackets)',
              'math.pi',
              '3.141592653589793'
            ],
            ['math.factorial(n)', 'n × (n-1) × … × 1', 'math.factorial(5)', '120'],
            ['math.gcd(a, b)', 'Greatest common divisor', 'math.gcd(12, 18)', '6'],
            [
              'math.isclose(a, b)',
              'Safe way to compare floats',
              'math.isclose(0.1 + 0.2, 0.3)',
              'True'
            ]
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'The math module',
          code: 'import math\n\nprint(math.sqrt(81))\nprint(math.floor(3.7), math.ceil(3.2))\nprint(math.pi)\nprint(round(math.pi * 5 ** 2, 2))   # area of a circle, r = 5',
          output: '9.0\n3 4\n3.141592653589793\n78.54'
        },
        {
          type: 'analogy',
          title: 'A toolbox',
          body: 'Built-ins are the screwdriver in your pocket. import math opens the bigger toolbox on the shelf — you only open it when you need it.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Sample usage: everyday problems',
          code: 'import math\n\n# Temperature gap between 18° and 31° (always positive)\nprint(abs(18 - 31))\n\n# Cheapest and most expensive item\nprint(min(1500, 980, 2300), max(1500, 980, 2300))\n\n# 45 eggs, 12 per box: how many boxes? (a part-box still needs a box)\nprint(math.ceil(45 / 12))\n\n# A square field has area 144 m². How long is one side?\nprint(math.sqrt(144))\n\n# Price 1999 plus 7% tax, to 2 decimals\nprint(round(1999 * 1.07, 2))',
          output: '13\n980 2300\n4\n12.0\n2138.93'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Exercise: fill in each print()',
          code: 'import math\n\n# 1. The lift goes from floor 3 to floor -2.\n#    How many floors did it travel? (use abs)\nprint()\n\n# 2. 23 people each eat 3 slices; a pizza has 8 slices.\n#    How many pizzas must you order? (use math.ceil)\nprint()\n\n# 3. A square garden has area 50 m².\n#    Side length to 2 decimals? (use math.sqrt and round)\nprint()\n\n# 4. Hottest day this week: 31, 29, 34, 30, 28 (use max)\nprint()'
        },
        {
          type: 'code',
          runnable: true,
          title: 'One possible solution',
          hidden: true,
          code: 'import math\n\nprint(abs(3 - (-2)))              # 1\nprint(math.ceil(23 * 3 / 8))       # 2: 8.625 → 9\nprint(round(math.sqrt(50), 2))     # 3\nprint(max(31, 29, 34, 30, 28))     # 4',
          output: '5\n9\n7.07\n34'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'import math\nprint(math.floor(-2.5))',
          options: ['-2', '-3', '-2.5', '2'],
          answer: 1,
          explanation:
            'floor always rounds down, and down from -2.5 is -3. (math.trunc(-2.5) would give -2.)'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(max(3, 7.0, 5))',
          options: ['7', '7.0', '5', 'TypeError'],
          answer: 1,
          explanation:
            'max returns the largest value exactly as it was given, so the float 7.0 stays 7.0.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(pow(2, 3) + abs(-2))',
          options: ['10', '6', '-6', '8'],
          answer: 0,
          explanation: 'pow(2, 3) is 8, abs(-2) is 2, and 8 + 2 = 10.'
        },
        {
          type: 'quiz',
          question: 'What happens?',
          code: 'print(math.sqrt(9))',
          options: ['3.0', '3', 'NameError', 'SyntaxError'],
          answer: 2,
          explanation:
            'math is not built in: without import math, Python does not know the name math.'
        }
      ]
    },
    {
      id: 'comparisons',
      eyebrow: 'Comparisons',
      title: 'Asking questions: == != < > <= >=',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            'A comparison is a yes/no question. Its answer is a `bool`: `True` or `False`. Remember: `=` assigns a name, `==` asks “are these equal?”.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'age = 17\nprint(age >= 18)\nprint(age == 17, age != 17)\nprint(13 <= age < 20)   # chained: is age a teenager?\nprint("apple" < "banana")\nprint(10 == 10.0)',
          output: 'False\nTrue False\nTrue\nTrue\nTrue'
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Two traps',
          body: '"10" == 10 is False — text and numbers are never equal. And 0.1 + 0.2 == 0.3 is False (Day 1’s float lesson); use math.isclose() for floats.'
        },
        {
          type: 'analogy',
          title: 'A security guard',
          body: 'The guard at a club checks one thing: age >= 18? The answer is only ever yes or no. Comparisons are Python’s guards.'
        },
        {
          type: 'text',
          body: [
            '**How does Python compare strings?** Every character has a number called its **character code** (Unicode), and `ord("a")` shows it. Capitals A–Z are **65–90**, small letters a–z are **97–122**, and digits 0–9 are 48–57.',
            'Python compares two strings **one character at a time, left to right**: ① compare the first characters’ codes, and the smaller code wins ② if they are the same, move to the next character ③ if one string runs out first, the shorter one is smaller.',
            'So `"Zebra" < "apple"` only looks at "Z" (90) and "a" (97). 90 < 97, so the answer is `True` — the rest of the letters are never checked. Because all capitals come before all small letters, this is not normal dictionary order. Use `.lower()` on both sides when case should not matter.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'See the character codes',
          code: '# Every character has a number: its character code. ord() shows it.\nprint(ord(\"A\"), ord(\"Z\"))   # capital letters\nprint(ord(\"a\"), ord(\"z\"))   # small letters\nprint(ord(\"0\"), ord(\" \"))   # digits and space come even earlier\n\n# \"Zebra\" < \"apple\": compare the FIRST letters\' codes\nprint(ord(\"Z\"), ord(\"a\"))   # 90 < 97\nprint(\"Zebra\" < \"apple\")\n\n# First letters equal? Move on to the next letter\nprint(\"apple\" < \"apricot\")  # a = a, p = p, then p (112) < r (114)\n\n# One word runs out first? The shorter one is smaller\nprint(\"app\" < \"apple\")\n\n# Want normal dictionary order? Make both lowercase first\nprint(\"Zebra\".lower() < \"apple\")',
          output: '65 90\n97 122\n48 32\n90 97\nTrue\nTrue\nTrue\nFalse'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Exercise: write the comparison inside each print()',
          code: 'price = 2500\nbudget = 3000\npassword = "python123"\ntemp = 37.5\nscore = 50\n\n# 1. Can I afford it? (price is less than or equal to budget)\nprint()\n\n# 2. Is the password NOT "admin"?\nprint()\n\n# 3. Does the person have a fever? (temp is 37.5 or higher)\nprint()\n\n# 4. Did the student pass? (score is at least 50)\nprint()\n\n# 5. Is temp normal, between 36.1 and 37.2? (use a chained comparison)\nprint()'
        },
        {
          type: 'code',
          runnable: true,
          title: 'One possible solution',
          hidden: true,
          code: 'price = 2500\nbudget = 3000\npassword = "python123"\ntemp = 37.5\nscore = 50\n\nprint(price <= budget)         # 1\nprint(password != "admin")     # 2\nprint(temp >= 37.5)            # 3\nprint(score >= 50)             # 4: 50 counts, so >= not >\nprint(36.1 <= temp <= 37.2)    # 5',
          output: 'True\nTrue\nTrue\nTrue\nFalse'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(5 != 5.0)',
          options: ['True', 'False', 'TypeError', '5.0'],
          answer: 1,
          explanation:
            '5 and 5.0 have the same value (5 is converted up to 5.0), so “not equal” is False.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print("Zebra" < "apple")',
          options: ['True', 'False', 'TypeError', '"apple"'],
          answer: 0,
          explanation:
            'Python compares the first letters by their character codes: ord("Z") is 90 and ord("a") is 97. 90 < 97, so "Zebra" < "apple" is True and the other letters are never checked. All capitals (A–Z = 65–90) come before all small letters (a–z = 97–122).'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(3 < 5 < 4)',
          options: ['True', 'False', 'Error', '4'],
          answer: 1,
          explanation:
            'A chain means 3 < 5 and 5 < 4. The second part is False, so the whole chain is False.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(int("10") == 10)',
          options: ['False', 'True', 'TypeError', '10'],
          answer: 1,
          explanation:
            '"10" == 10 is False, but int("10") turns the text into the number 10 first, so the two are equal.'
        }
      ]
    },
    {
      id: 'logic',
      eyebrow: 'Comparisons',
      title: 'and, or, not: combining questions',
      minutes: 9,
      blocks: [
        {
          type: 'table',
          codeColumns: [0],
          columns: ['Operator', 'True when…', 'Example'],
          rows: [
            ['and', 'both sides are True', 'Has ticket AND has ID'],
            ['or', 'at least one side is True', 'Pay by cash OR by card'],
            ['not', 'the value is False', 'NOT raining']
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'age = 20\nhas_ticket = True\nis_vip = False\n\nprint(age >= 18 and has_ticket)\nprint(has_ticket or is_vip)\nprint(not is_vip)\nprint(age < 13 or age > 65)',
          output: 'True\nTrue\nTrue\nFalse'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Deep dive: short-circuit',
          body: 'Python stops as soon as it knows the answer. In False and x, x is never checked; in True or x, neither. That is why b != 0 and a / b > 1 never divides by zero.'
        },
        {
          type: 'text',
          body: [
            '**A classic bug: `day == "Sat" or "Sun"`.** In English, “day is Sat or Sun” sounds right, but Python does not read it that way. Two rules explain why.',
            '**Rule 1 — `==` runs before `or`** (see the precedence table). So Python groups it as `(day == "Sat") or ("Sun")`. The `"Sun"` on the right is not compared with anything; it is just a string on its own.',
            '**Rule 2 — `or` gives back one of its two values**, not always True/False. `a or b` checks the left side: if `a` is truthy, the answer is `a`; otherwise the answer is `b`. (`and` is the mirror: if `a` is falsy, the answer is `a`; otherwise `b`.)',
            '**Step by step with `day = "Mon"`:** ① `day == "Sat"` → `False` ② `False or "Sun"` → left side is falsy, so the answer is the right side → `"Sun"`. And because `"Sun"` is a non-empty string, it is truthy, so this test passes **every day**, even Monday. **Fix:** write a full comparison on both sides: `day == "Sat" or day == "Sun"`.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Step by step: why it prints Sun',
          code: '# 1. or gives back one of its two values (not always True/False)\nprint(3 or 5)           # 3 is truthy  → left side: 3\nprint(0 or 5)           # 0 is falsy   → right side: 5\nprint(\"\" or \"guest\")    # \"\" is falsy  → right side: guest\nprint(False or \"Sun\")   # False        → right side: Sun\n\n# 2. Step by step: day == \"Sat\" or \"Sun\"\nday = \"Mon\"\nstep1 = day == \"Sat\"    # == runs first (higher priority than or)\nprint(step1)            # False\nprint(step1 or \"Sun\")   # False or \"Sun\" → Sun\n\n# 3. Why it is a bug: \"Sun\" is truthy, so the test is ALWAYS truthy\nprint(bool(day == \"Sat\" or \"Sun\"))      # True, even on Monday!\n\n# 4. The fix: a full comparison on both sides of or\nprint(day == \"Sat\" or day == \"Sun\")     # False',
          output: '3\n5\nguest\nSun\nFalse\nSun\nTrue\nFalse'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Exercise: combine the questions inside each print()',
          code: 'age = 16\nhas_ticket = True\nwith_parent = False\nis_raining = True\nhas_umbrella = False\nday = "Sat"\n\n# 1. Can they see an 18+ movie? (18 or older AND has a ticket)\nprint()\n\n# 2. Is it the weekend? (day is "Sat" OR day is "Sun")\nprint()\n\n# 3. Will they get wet? (raining AND NOT has an umbrella)\nprint()\n\n# 4. Can they see a 16+ movie?\n#    (has a ticket AND (16 or older OR with a parent))\nprint()\n\n# 5. Is age NOT a teen age (13 to 19)? (use not)\nprint()'
        },
        {
          type: 'code',
          runnable: true,
          title: 'One possible solution',
          hidden: true,
          code: 'age = 16\nhas_ticket = True\nwith_parent = False\nis_raining = True\nhas_umbrella = False\nday = "Sat"\n\nprint(age >= 18 and has_ticket)                     # 1\nprint(day == "Sat" or day == "Sun")                 # 2: repeat day ==\nprint(is_raining and not has_umbrella)              # 3\nprint(has_ticket and (age >= 16 or with_parent))    # 4: brackets matter\nprint(not 13 <= age <= 19)                          # 5',
          output: 'False\nTrue\nTrue\nTrue\nFalse'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(True and not False)',
          options: ['False', 'True', 'None', 'Error'],
          answer: 1,
          explanation: 'not runs first: not False is True. Then True and True is True.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print(not (5 > 3 or 2 > 4))',
          options: ['True', 'False', 'Error', 'None'],
          answer: 1,
          explanation:
            'Brackets first: 5 > 3 is True, so True or False is True. Then not True is False.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'x = 0\nprint(x != 0 and 10 / x > 1)',
          options: ['ZeroDivisionError', 'False', 'True', 'None'],
          answer: 1,
          explanation:
            'Short-circuit: x != 0 is False, so Python never runs 10 / x. No division by zero happens.'
        },
        {
          type: 'quiz',
          question: 'A classic bug. What does this print?',
          code: 'day = "Mon"\nprint(day == "Sat" or "Sun")',
          options: ['False', 'True', 'Sun', 'Error'],
          answer: 2,
          explanation:
            '== runs before or, so Python reads it as (day == "Sat") or "Sun". Step 1: "Mon" == "Sat" is False. Step 2: False or "Sun": the left side is falsy, so or gives back the right side, the string "Sun". Write day == "Sat" or day == "Sun".'
        }
      ]
    },
    {
      id: 'if-basic',
      eyebrow: 'Decisions · 1 of 4',
      title: 'if: run a block only when the answer is True',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          body: [
            'So far every line ran, top to bottom. With `if`, a program can **decide**: run some lines only when a condition is True. There are four shapes of decision, one per slide: **if**, **if / else**, **if / elif / else** and **nested if**.',
            '**The parts of an `if`:** ① the keyword `if` ② a condition: anything that gives True or False (`temp > 30`, `name == ""`, `is_raining`) ③ a colon `:` ④ the **block**: the lines below, indented by **4 spaces**.',
            '**What happens:** if the condition is True, Python runs the block. If it is False, Python **skips** the block. Either way, it then carries on with the first line that is not indented.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'temp = 35\n\nif temp > 30:\n    print("It is hot! Drink water.")\n\nprint("Have a nice day")',
          output: 'It is hot! Drink water.\nHave a nice day'
        },
        {
          type: 'flow',
          demo: true,
          setup: 'temp = 35',
          tree: decision('temp > 30', true, action('print("It is hot! Drink water.")'), skip),
          explanation:
            '35 > 30 is True, so the path goes into the block. With temp = 20 it would take the False arrow, skip the block and run nothing.'
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Three common mistakes',
          body: '① Forgetting the colon: `if temp > 30` → SyntaxError. ② Forgetting to indent the block → IndentationError. ③ Writing `=` instead of `==`: `if age = 18:` → SyntaxError.'
        },
        {
          type: 'flow',
          setup: 'balance = 40',
          tree: decision('balance < 50', true, action('print("Low balance!")'), skip),
          explanation: '40 < 50 is True, so the warning prints.'
        },
        {
          type: 'flow',
          setup: 'battery = 80',
          tree: decision('battery < 20', false, action('print("Charge your phone")'), skip),
          explanation:
            '80 < 20 is False and there is no else, so nothing runs: the program just carries on.'
        }
      ]
    },
    {
      id: 'if-else',
      eyebrow: 'Decisions · 2 of 4',
      title: 'if / else: always one of two paths',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          body: [
            '`else` adds a second path for when the condition is False. Now **exactly one** of the two blocks runs: never both, never neither.',
            '`else` has **no condition** of its own; it just means “otherwise”. It sits at the same indent as its `if` and ends with a colon: `else:`.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'age = 16\n\nif age >= 18:\n    print("You can vote")\nelse:\n    print("Too young to vote")',
          output: 'Too young to vote'
        },
        {
          type: 'flow',
          demo: true,
          setup: 'age = 16',
          tree: decision(
            'age >= 18',
            false,
            action('print("You can vote")'),
            action('print("Too young to vote")')
          ),
          explanation: '16 >= 18 is False, so the path takes the False arrow to the else block.'
        },
        {
          type: 'analogy',
          title: 'A fork in the road',
          body: 'At a fork you must go left or right — you cannot take both, and you cannot stand still. if / else is a fork: the condition picks the side.'
        },
        {
          type: 'flow',
          setup: 'n = 7',
          tree: decision('n % 2 == 0', false, action('print("even")'), action('print("odd")')),
          explanation: '7 % 2 is 1, so n % 2 == 0 is False: the else block prints "odd".'
        },
        {
          type: 'flow',
          setup: 'password = "python"',
          tree: decision(
            'password == "python"',
            true,
            action('print("Welcome!")'),
            action('print("Wrong password")')
          ),
          explanation: 'The two strings are exactly equal, so the condition is True.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'x = 10\nif x > 5:\n    print("big")\nelse:\n    print("small")\nprint("end")',
          options: ['big\nend', 'small\nend', 'big\nsmall\nend', 'end'],
          answer: 0,
          explanation:
            'Exactly one of the two blocks runs ("big"), then the un-indented print("end") always runs.'
        }
      ]
    },
    {
      id: 'if-elif',
      eyebrow: 'Decisions · 3 of 4',
      title: 'if / elif / else: a ladder of choices',
      minutes: 8,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: 'score = int(input("Score? "))\n\nif score >= 80:\n    print("Grade A")\nelif score >= 60:\n    print("Grade B")\nelif score >= 40:\n    print("Grade C")\nelse:\n    print("Try again")\n\nprint("Done")',
          stdin: ['65']
        },
        {
          type: 'text',
          body: [
            '`elif` means “else if”. When there are **more than two** paths, add one `elif` per extra condition. You can have as many `elif`s as you need, and the final `else` is optional.',
            'Python checks the conditions **top to bottom** and runs only the **first** block whose condition is True; the rest are skipped. `else` catches everything left.',
            'The colon `:` opens a block, and the **4-space indent** shows which lines belong to it. `print("Done")` is not indented, so it always runs.'
          ]
        },
        {
          type: 'flow',
          demo: true,
          setup: 'score = 65',
          tree: decision(
            'score >= 80',
            false,
            action('print("Grade A")'),
            decision(
              'score >= 60',
              true,
              action('print("Grade B")'),
              decision(
                'score >= 40',
                null,
                action('print("Grade C")'),
                action('print("Try again")')
              )
            )
          ),
          explanation:
            '65 >= 80 is False, so step right to the next test. 65 >= 60 is True: "Grade B". The last test and the else are never checked.'
        },
        {
          type: 'analogy',
          title: 'A road with exits',
          body: 'You drive down the road and take the first exit whose sign matches. Once you exit you never see the later signs. else is the end of the road.'
        },
        {
          type: 'quiz',
          question: 'What does this print when score = 95?',
          code: 'if score >= 60:\n    print("B")\nelif score >= 80:\n    print("A")',
          options: ['A', 'B', 'A and B', 'Nothing'],
          answer: 1,
          explanation:
            '95 >= 60 is already True, so the first block runs and the elif is skipped. Put the strictest condition first.'
        },
        {
          type: 'flow',
          setup: 'score = 95',
          tree: decision(
            'score >= 50',
            true,
            action('print("pass")'),
            decision('score >= 90', null, action('print("excellent")'), action('print("fail")'))
          ),
          explanation:
            'Order trap: 95 >= 50 is True at the very first step, so "excellent" can never be reached. Put score >= 90 first.'
        },
        {
          type: 'flow',
          setup: 'temp = 25',
          tree: decision(
            'temp > 30',
            false,
            action('print("hot")'),
            decision(
              'temp > 20',
              true,
              action('print("warm")'),
              decision('temp > 10', null, action('print("cool")'), action('print("cold")'))
            )
          ),
          explanation:
            '25 > 30 is False, 25 > 20 is True: "warm". Python stops there, even though 25 > 10 is also True.'
        },
        {
          type: 'text',
          body: [
            '**One chain vs separate ifs:** `if … elif … else` picks **at most one** branch. Two separate `if` statements are checked independently, so both can run.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'One chain vs separate ifs',
          code: 'x = 15\n\n# One chain: only the FIRST True branch runs\nif x > 10:\n    print("chain: big")\nelif x > 5:\n    print("chain: medium")\n\n# Two separate ifs: each one is checked on its own\nif x > 10:\n    print("separate: big")\nif x > 5:\n    print("separate: medium")',
          output: 'chain: big\nseparate: big\nseparate: medium'
        }
      ],
      notes:
        'Try 85, 40 and 10 in the Input box. Then ask the student to swap the order of the conditions and explain what breaks.'
    },
    {
      id: 'if-nested',
      eyebrow: 'Decisions · 4 of 4',
      title: 'Nested if: a decision inside a decision',
      minutes: 10,
      blocks: [
        {
          type: 'text',
          body: [
            '**Nested if:** an `if` can sit **inside** another `if`, indented one more level. The inner test is only checked when the outer test is True.',
            '**How to trace the path:** ① check the outer condition ② if it is True, step inside and check the inner conditions the same way, top to bottom ③ if it is False, skip the **whole** indented block, every inner `if` included, and go to the outer `elif`/`else` ④ a line that goes back to a smaller indent is outside the block, so it always runs afterwards.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Nested if: a door with two checks',
          code: 'age = 20\nhas_id = False\n\nif age >= 18:\n    print("Checking ID...")\n    if has_id:\n        print("Welcome in")\n    else:\n        print("Please show your ID")\nelse:\n    print("Sorry, too young")\n\nprint("Next person")',
          output: 'Checking ID...\nPlease show your ID\nNext person'
        },
        {
          type: 'flow',
          demo: true,
          setup: 'age = 20\nhas_id = False',
          tree: decision(
            'age >= 18',
            true,
            decision(
              'has_id',
              false,
              action('print("Welcome in")'),
              action('print("Show your ID")')
            ),
            action('print("Too young")')
          ),
          explanation:
            'Outer: 20 >= 18 is True, so step inside. Inner: has_id is False, so the inner else runs.'
        },
        {
          type: 'quiz',
          question: 'Which path is taken? What does this print?',
          code: 'temp = 28\nraining = True\nif temp > 25:\n    if raining:\n        print("umbrella")\n    else:\n        print("sunscreen")\nelse:\n    print("jacket")',
          options: ['sunscreen', 'umbrella', 'jacket', 'umbrella\njacket'],
          answer: 1,
          explanation:
            'Outer: 28 > 25 is True, so step inside. Inner: raining is True, so "umbrella". The outer else is skipped.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'x = 3\nif x > 5:\n    print("A")\n    if x > 1:\n        print("B")\nprint("C")',
          options: ['B\nC', 'A\nB\nC', 'C', 'Nothing'],
          answer: 2,
          explanation:
            '3 > 5 is False, so the whole indented block is skipped. x > 1 would be True, but Python never gets inside to check it. Only C, which is not indented, runs.'
        },
        {
          type: 'flow',
          setup: 'age = 15\nhas_id = True',
          tree: decision(
            'age >= 18',
            false,
            decision(
              'has_id',
              null,
              action('print("Welcome in")'),
              action('print("Show your ID")')
            ),
            action('print("Too young")')
          ),
          explanation:
            'The outer test is False, so the whole inner if is skipped, even though has_id is True.'
        },
        {
          type: 'flow',
          setup: 'n = 12',
          tree: decision(
            'n % 2 == 0',
            true,
            decision('n % 3 == 0', true, action('print("even, /3")'), action('print("even")')),
            decision('n % 3 == 0', null, action('print("odd, /3")'), action('print("odd")'))
          ),
          explanation:
            '12 % 2 is 0, so step into the True side. There, 12 % 3 is also 0: "even, /3". The right-hand side is never checked.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Exercise: cinema ticket price',
          code: '# Cinema ticket price. Print the price for this person.\n#   under 12        → 3000\n#   12 to 59        → 5000, but students pay 4000  (nested if!)\n#   60 or older     → 2500\n# Then try age = 8, age = 30 with is_student = False, and age = 65.\nage = 20\nis_student = True\n\n# Your code here'
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'age = 20\nis_student = True\n\nif age < 12:\n    print(3000)\nelif age < 60:\n    if is_student:      # only checked for ages 12 to 59\n        print(4000)\n    else:\n        print(5000)\nelse:\n    print(2500)',
          output: '4000'
        }
      ],
      notes:
        'Show the Flow Tracer game on the projector first: students shout which block runs before you click, then everyone watches the path animate. Finish with the Operator Challenge, True or False? and Path Finder games from the Games page — about 15 minutes.'
    },
    {
      id: 'project',
      eyebrow: 'Mini project',
      title: 'Build a calculator',
      minutes: 8,
      blocks: [
        {
          type: 'callout',
          tone: 'success',
          title: 'Requirements',
          body: 'Ask for two numbers and an operator (+ - * / // % **). Print the result as “a op b = result”. If the user divides by zero or types an unknown operator, print a friendly message instead of crashing.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Write yours here (edit freely)',
          code: '# Your code here\n',
          stdin: ['12', '/', '5']
        },
        {
          type: 'code',
          runnable: true,
          title: 'One possible solution',
          hidden: true,
          code: 'a = float(input("First number: "))\nop = input("Operator (+ - * / // % **): ")\nb = float(input("Second number: "))\n\nif op == "+":\n    result = a + b\nelif op == "-":\n    result = a - b\nelif op == "*":\n    result = a * b\nelif op == "**":\n    result = a ** b\nelif op in ("/", "//", "%") and b == 0:\n    result = None\n    print("You can’t divide by zero.")\nelif op == "/":\n    result = a / b\nelif op == "//":\n    result = a // b\nelif op == "%":\n    result = a % b\nelse:\n    result = None\n    print(f"Unknown operator: {op}")\n\nif result is not None:\n    print(f"{a:g} {op} {b:g} = {result:g}")',
          stdin: ['12', '/', '5']
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Level up',
          body: 'Show both answers for division: “12 / 5 = 2.4 (2 remainder 2)” using divmod(). Then print whether the result is even or odd — but only when it is a whole number.'
        }
      ],
      notes:
        '{x:g} prints 12.0 as 12 and 2.4 as 2.4 — mention it only if asked. Test the solution with 7, /, 0 and with 2, ^, 3.'
    },
    {
      id: 'errors',
      eyebrow: 'Debugging',
      title: 'Today’s new errors',
      minutes: 2,
      blocks: [
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Error', 'Example', 'What it means'],
          rows: [
            ['ZeroDivisionError', '10 / 0', 'Dividing (/, //, %) by zero'],
            ['ValueError', 'int("19.5")', 'Text isn’t a valid whole number — try float()'],
            [
              'IndentationError',
              '    print(x)',
              'Indent missing after :, or indent where none belongs'
            ],
            ['SyntaxError', 'if x = 1:', 'Used = (assign) where == (compare) was needed']
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Fix the bugs (there are two)',
          code: 'x = int(input("Number? "))\nif x % 2 = 0:\nprint("even")',
          stdin: ['4']
        }
      ]
    },
    {
      id: 'review',
      eyebrow: 'Review',
      title: 'Can you answer these?',
      minutes: 2,
      blocks: [
        {
          type: 'quiz',
          question: 'What is the type of 4 + 2.0?',
          options: ['int', 'float', 'str', 'TypeError'],
          answer: 1,
          explanation: 'Mixing int and float always gives a float: 6.0.'
        },
        {
          type: 'quiz',
          question: 'What is bool("0")?',
          options: ['True', 'False', '0', 'ValueError'],
          answer: 0,
          explanation: '"0" is a non-empty string, so it is True. Only "" (empty) is False.'
        },
        {
          type: 'quiz',
          question: 'What is 23 % 5?',
          options: ['4', '4.6', '3', '5'],
          answer: 2,
          explanation: '5 fits into 23 four times (20); 23 - 20 leaves 3.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework: Shopping Bill',
          body: 'Ask for an item price (float) and quantity (int). Print the subtotal, then 7% VAT, then the total, all with 2 decimals. If the subtotal is over 1000 THB, give a 10% discount before VAT. Stretch: split the bill between N friends and show what is left over in satang with // and %.'
        }
      ]
    }
  ]
}

export default day2
