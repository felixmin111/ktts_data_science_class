import type { Lesson } from '@/models/lesson.model'

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
      minutes: 4,
      blocks: [
        {
          type: 'text',
          body: [
            'When an `int` meets a `float`, Python quietly widens the int to a float, because every int fits in a float but not the other way round. The result is always a **float**.',
            '`bool` is a subtype of `int`: `True` behaves like 1 and `False` like 0. Text is never converted automatically — that is the one you must do yourself.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'print(3 + 2.0)\nprint(type(3 + 2.0))\nprint(10 / 5)        # / always gives a float\nprint(True + True)\nprint(isinstance(True, int))',
          output: "5.0\n<class 'float'>\n2.0\n2\nTrue"
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
      minutes: 5,
      blocks: [
        {
          type: 'table',
          codeColumns: [1, 2],
          columns: ['Priority', 'Operators', 'Example', 'Result'],
          rows: [
            ['1 (first)', '( )', '(2 + 3) * 4', '20'],
            ['2', '**', '2 * 3 ** 2', '18'],
            ['3', '-x', '-2 ** 2', '-4'],
            ['4', '* / // %', '10 - 6 / 2', '7.0'],
            ['5', '+ -', '1 + 2 * 3', '7'],
            ['6', '== != < > <= >=', '1 + 1 == 2', 'True'],
            ['7', 'not', 'not 1 == 2', 'True'],
            ['8', 'and', '—', '—'],
            ['9 (last)', 'or', '—', '—']
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
      minutes: 4,
      blocks: [
        {
          type: 'code',
          runnable: true,
          title: 'Built in — no import needed',
          code: 'print(abs(-7))\nprint(min(4, 9, 2), max(4, 9, 2))\nprint(pow(2, 10))\nprint(round(1234.5678, 1))',
          output: '7\n2 9\n1024\n1234.6'
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
        }
      ]
    },
    {
      id: 'comparisons',
      eyebrow: 'Comparisons',
      title: 'Asking questions: == != < > <= >=',
      minutes: 5,
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
        }
      ]
    },
    {
      id: 'logic',
      eyebrow: 'Comparisons',
      title: 'and, or, not: combining questions',
      minutes: 4,
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
        }
      ]
    },
    {
      id: 'if-elif',
      eyebrow: 'Decisions',
      title: 'if / elif / else: acting on the answer',
      minutes: 5,
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
            'Python checks the conditions **top to bottom** and runs only the **first** block whose condition is True; the rest are skipped. `else` catches everything left.',
            'The colon `:` opens a block, and the **4-space indent** shows which lines belong to it. `print("Done")` is not indented, so it always runs.'
          ]
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
        }
      ],
      notes:
        'Try 85, 40 and 10 in the Input box. Then ask the student to swap the order of the conditions and explain what breaks.'
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
