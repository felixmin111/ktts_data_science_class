import type { Lesson } from '@/models/lesson.model'

const day1: Lesson = {
  id: 'day-1',
  track: 'foundations',
  day: 1,
  title: 'Talking to computers in Python',
  summary:
    'print(), variables, data types and input() — and what Python really does underneath each of them.',
  durationMinutes: 60,
  topics: ['print()', 'Variables', 'str / int / float', 'input()', 'f-strings'],
  available: true,
  sections: [
    {
      id: 'programming',
      eyebrow: 'Warm-up',
      title: 'Programming = giving exact instructions',
      minutes: 5,
      blocks: [
        {
          type: 'text',
          body: [
            'A human understands “Say hello to Neo.” and fills the gaps with common sense. A computer needs an instruction with exact spelling, brackets and quotes — it does **precisely** what you wrote.'
          ]
        },
        { type: 'code', code: 'print("Hello, Neo!")', output: 'Hello, Neo!', runnable: true },
        {
          type: 'analogy',
          title: 'The robot chef',
          body: 'A human cook understands “add a pinch of salt.” A robot chef needs “add 2 g of salt to pot 1, now.” Code is the robot’s recipe: precise, ordered, and taken literally.'
        }
      ],
      notes:
        'Ask: who uses Facebook, TikTok, a banking app? Every tap runs instructions someone wrote. Ask her to predict the output before pressing Run.'
    },
    {
      id: 'how-python-runs',
      eyebrow: 'What is Python?',
      title: 'What happens when you press Run',
      minutes: 5,
      blocks: [
        {
          type: 'table',
          columns: ['Step', 'What happens'],
          rows: [
            ['1. Source', 'hello.py — plain text that you write'],
            [
              '2. Compiler',
              'Checks the grammar, translates to bytecode (SyntaxError happens here)'
            ],
            ['3. Bytecode', 'Small, simple instructions for a virtual machine (cached as .pyc)'],
            ['4. Python VM', 'Executes the bytecode step by step and produces output']
          ]
        },
        {
          type: 'analogy',
          title: 'Sheet music',
          body: 'You compose the song (source). A copyist rewrites it in a simpler notation (bytecode). The musician — the Python Virtual Machine — plays it note by note.'
        },
        {
          type: 'code',
          title: 'Peek at the bytecode',
          code: 'import dis\ndis.dis("print(10 + 5)")',
          runnable: true
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Deep dive',
          body: 'Notice that 10 + 5 is already 15 in the bytecode — the compiler folds constant expressions before the program even runs.'
        }
      ]
    },
    {
      id: 'print-anatomy',
      eyebrow: 'print()',
      title: 'Anatomy of your first line',
      minutes: 4,
      blocks: [
        { type: 'code', code: 'print("Hello World!")', output: 'Hello World!', runnable: true },
        {
          type: 'table',
          codeColumns: [0],
          columns: ['Part', 'Name', 'Meaning'],
          rows: [
            ['print', 'built-in function', 'A named, reusable action that ships with Python'],
            ['( )', 'call operator', '“Run it now.” Values inside are arguments — the inputs'],
            [
              '" "',
              'string literal',
              'Quotes mark where text starts and ends. \' \' and " " both work'
            ]
          ]
        },
        {
          type: 'analogy',
          title: 'A vending machine',
          body: 'print is the machine, ( ) is pressing the button, and what you put inside is your selection. No button press = nothing happens.'
        }
      ]
    },
    {
      id: 'print-options',
      eyebrow: 'print()',
      title: 'sep and end: print() has more knobs',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          body: [
            'The real signature is `print(*objects, sep=" ", end="\\n", file=sys.stdout, flush=False)`. Every value is turned into text with `str()`, joined with `sep`, and finished with `end`.',
            'print() **returns None** — it shows a value, it does not give one back.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'print("A", "B", "C")\nprint("A", "B", "C", sep="-")\nprint("2026", "10", "01", sep="/")\nprint("Loading", end="...")\nprint("done!")\nprint(10 + 5, "items")',
          output: 'A B C\nA-B-C\n2026/10/01\nLoading...done!\n15 items'
        },
        {
          type: 'analogy',
          title: 'Building a wall',
          body: 'sep is the mortar between the bricks; end is the cap on top. Default mortar = one space, default cap = a new line.'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'print("Hi", "there", sep="")',
          options: ['Hi there', 'Hithere', 'Hi,there', 'Hi\\nthere'],
          answer: 1,
          explanation: 'sep="" means nothing is placed between the two values.'
        }
      ]
    },
    {
      id: 'operators',
      eyebrow: 'print()',
      title: 'Python as a calculator',
      minutes: 4,
      blocks: [
        {
          type: 'table',
          codeColumns: [0, 2, 3],
          columns: ['Operator', 'Meaning', 'Example', 'Result'],
          rows: [
            ['+', 'Add', '7 + 2', '9'],
            ['-', 'Subtract', '7 - 2', '5'],
            ['*', 'Multiply', '7 * 2', '14'],
            ['/', 'Divide (always float)', '7 / 2', '3.5'],
            ['//', 'Floor divide', '7 // 2', '3'],
            ['%', 'Remainder', '7 % 2', '1'],
            ['**', 'Power', '7 ** 2', '49']
          ]
        },
        {
          type: 'analogy',
          title: '17 cookies, 5 friends',
          body: '17 // 5 → 3 cookies each. 17 % 5 → 2 cookies left over.'
        },
        {
          type: 'code',
          runnable: true,
          code: 'print(17 // 5, 17 % 5)\nprint(10 / 2)\nprint(-7 // 2)   # rounds DOWN, toward minus infinity\nprint(2 + 3 * 4, (2 + 3) * 4)'
        }
      ]
    },
    {
      id: 'variables',
      eyebrow: 'Variables',
      title: 'A variable is not a box. It’s a name tag.',
      minutes: 6,
      blocks: [
        {
          type: 'text',
          body: [
            '`name = "Neo"` means: first create the object `"Neo"`, then **attach** the name `name` to it. Read assignments right to left. `=` is not “equals” — that is `==`.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'name = "Neo"\nage = 25\ncity = "Bangkok"\n\nprint(name, age, city)\nprint(id(age))  # the object\'s identity'
        },
        {
          type: 'analogy',
          title: 'Phone contacts',
          body: '“Mom” isn’t a phone number — it’s a name saved in your phone that points to one. Python’s names live in a namespace; the values live in memory.'
        },
        {
          type: 'callout',
          tone: 'success',
          title: 'Your turn',
          body: 'Create name, age, country and favorite_food with your own values, then print all four.'
        }
      ]
    },
    {
      id: 'aliasing',
      eyebrow: 'Variables',
      title: 'Two names, one object — and rebinding',
      minutes: 6,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: 'a = 25\nb = a\nprint(a is b)   # same object?\n\na = 30          # move tag a to a new object\nprint(a, b)\nprint(a is b)'
        },
        {
          type: 'analogy',
          title: 'Sticky notes on jars',
          body: 'Two sticky notes on one jar. Peel note a off and stick it on a new jar — the old jar doesn’t change, and neither does note b.'
        },
        {
          type: 'text',
          body: [
            '`x = x + 1` is not algebra: ① evaluate the right side (look up x → 5) ② compute a **new** int object 6 ③ move the tag x onto it. Ints are immutable — the 5 object is never changed.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'x = 5\nx = x + 1\nx += 1  # shortcut\nprint(x)\n\na, b = 1, 2\na, b = b, a  # swap without a temp variable\nprint(a, b)'
        },
        {
          type: 'quiz',
          question: 'After this code, what is b?',
          code: 'a = 10\nb = a\na = a + 5',
          options: ['10', '15', '5', 'Error'],
          answer: 0,
          explanation:
            'b still points at the 10 object. a + 5 created a new object 15 and only the tag a moved.'
        }
      ]
    },
    {
      id: 'naming',
      eyebrow: 'Variables',
      title: 'Naming: rules and conventions',
      minutes: 3,
      blocks: [
        {
          type: 'table',
          codeColumns: [1],
          columns: ['Rule', 'Works', 'Breaks / avoid'],
          rows: [
            ['Letters, digits and _ only', 'user_name', 'user-name (error)'],
            ['Can’t start with a digit', 'name2', '2name (error)'],
            ['Case-sensitive', 'age and Age differ', '—'],
            ['Not a keyword', 'class_name', 'class (error)'],
            ['Convention: snake_case', 'favorite_food', 'FavoriteFood (un-Pythonic)'],
            ['Convention: CONSTANTS', 'PI = 3.14159', '—']
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'All reserved keywords',
          code: 'import keyword\nprint(len(keyword.kwlist))\nprint(keyword.kwlist)'
        }
      ]
    },
    {
      id: 'types',
      eyebrow: 'Data types',
      title: 'Three core types, three real-world things',
      minutes: 4,
      blocks: [
        {
          type: 'table',
          codeColumns: [0, 2],
          columns: ['Type', 'Meaning', 'Example', 'Analogy'],
          rows: [
            ['str', 'Text', '"Neo"', 'Beads on a necklace — an ordered sequence of characters'],
            ['int', 'Whole number', '25', 'Counting coins — exact, no fractions, no size limit'],
            [
              'float',
              'Decimal number',
              '1.75',
              'Measuring with a ruler — precise enough, always approximate'
            ]
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'print(type("Neo"))\nprint(type(25))\nprint(type(1.75))\nprint(type("20"))'
        }
      ]
    },
    {
      id: 'strings',
      eyebrow: 'Data types · str',
      title: 'Strings: a sequence of characters',
      minutes: 3,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: 's = "Python"\nprint(s[0], s[-1])   # P n\nprint(s[0:3])        # Pyt  (stop is excluded)\nprint(len(s))\nprint(s.upper())\nprint("Ha" * 3)'
        },
        {
          type: 'analogy',
          title: 'A necklace',
          body: 'You can look at bead 0, count the beads or copy a section — but you can’t swap a bead. Strings are immutable: build a new one instead, e.g. "J" + s[1:].'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Try to change a character',
          code: 's = "Python"\ns[0] = "J"'
        }
      ]
    },
    {
      id: 'numbers',
      eyebrow: 'Data types · int & float',
      title: 'int has no ceiling; float is approximate',
      minutes: 4,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: 'print(2 ** 100)\nprint(1_000_000 == 1000000)\n\nprint(0.1 + 0.2)\nprint(0.1 + 0.2 == 0.3)\n\nimport math\nprint(round(0.1 + 0.2, 2), math.isclose(0.1 + 0.2, 0.3))'
        },
        {
          type: 'analogy',
          title: '1 ÷ 3',
          body: 'In decimal, 1/3 = 0.3333… you must stop somewhere. Floats are stored in binary (IEEE 754), and 0.1 has the same problem in binary. Never compare floats with == ; for money use int cents or decimal.Decimal.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Deep dive',
          body: 'Python ints grow as big as memory allows — no overflow like Java’s 2,147,483,647 limit. An odometer that adds a wheel whenever it needs one.'
        }
      ]
    },
    {
      id: 'text-vs-number',
      eyebrow: 'Data types',
      title: '"20" is text. 20 is a number.',
      minutes: 3,
      blocks: [
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Expression', 'Result', 'Why'],
          rows: [
            ['"20" + "5"', '"205"', '+ joins strings'],
            ['20 + 5', '25', '+ adds numbers'],
            ['"20" * 3', '"202020"', '* repeats a string'],
            ['"20" + 5', 'TypeError', 'Python won’t guess what you meant']
          ]
        },
        {
          type: 'analogy',
          title: 'The football jersey',
          body: '“20” printed on a jersey is a label — you can’t add it to the score. 20 goals is a quantity you can add to.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Dynamic + strong typing',
          code: 'x = 5\nx = "five"        # allowed: the type lives on the object\nprint(type(x))\nprint("5" + 5)    # not allowed: no silent mixing'
        }
      ],
      notes: 'Play the Type Detective game from the Games page here — it takes about 3 minutes.'
    },
    {
      id: 'input',
      eyebrow: 'input()',
      title: 'Programs that listen',
      minutes: 5,
      blocks: [
        {
          type: 'text',
          body: [
            'input() ① shows the prompt ② pauses the program ③ waits for the user to type and press Enter ④ returns what they typed **as a str**.',
            'In this site, answers come from the **Input** box under the code — one line per input() call.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          code: 'name = input("What is your name? ")\ncity = input("Where do you live? ")\nprint("Hello,", name, "from", city)',
          stdin: ['Neo', 'Bangkok']
        },
        {
          type: 'analogy',
          title: 'The waiter',
          body: 'The waiter asks, waits for your answer, and writes it on a notepad — always as words. Even “25” is just ink until the kitchen converts it.'
        }
      ]
    },
    {
      id: 'conversion',
      eyebrow: 'input()',
      title: 'input() always returns a string',
      minutes: 4,
      blocks: [
        {
          type: 'code',
          runnable: true,
          title: 'The trap',
          code: 'age = input("Age? ")\nprint(type(age))\nprint(age + 1)',
          stdin: ['25']
        },
        {
          type: 'code',
          runnable: true,
          title: 'The fix — read it inside-out',
          code: 'age = int(input("Age? "))\nprint("Next year:", age + 1)',
          stdin: ['25']
        },
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Call', 'Result', 'Note'],
          rows: [
            ['int("25")', '25', 'text → whole number'],
            ['float("1.75")', '1.75', 'text → decimal'],
            ['str(25)', '"25"', 'number → text'],
            ['int(3.99)', '3', 'cuts decimals — no rounding!'],
            ['int("3.5")', 'ValueError', 'use float() first'],
            ['int("abc")', 'ValueError', 'not a number at all']
          ]
        },
        {
          type: 'analogy',
          title: 'Currency exchange',
          body: 'Hand over real baht notes → you get dollars. Hand over Monopoly money → the counter refuses. That refusal is a ValueError.'
        }
      ]
    },
    {
      id: 'fstrings',
      eyebrow: 'Formatting',
      title: 'f-strings: fill in the blanks',
      minutes: 3,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: 'name, age, price = "Neo", 25, 49.5\n\nprint(f"Hi {name}!")\nprint(f"{name} turns {age + 1} next year")\nprint(f"Price: {price:.2f} THB")\nprint(f"{age=}")'
        },
        {
          type: 'analogy',
          title: 'A form letter',
          body: '“Dear {name}, your order of {price} THB is ready.” You write the template once; Python fills each blank with the current value.'
        }
      ]
    },
    {
      id: 'project',
      eyebrow: 'Mini project',
      title: 'Build an “About Me” program',
      minutes: 6,
      blocks: [
        {
          type: 'callout',
          tone: 'success',
          title: 'Requirements',
          body: 'Ask for the user’s name, country and favorite food, then print the information. Level up: ask for age, convert it with int() and print the approximate birth year with an f-string.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Write yours here (edit freely)',
          code: '# Your code here\n',
          stdin: ['Neo', 'Myanmar', 'Pizza', '25']
        },
        {
          type: 'code',
          runnable: true,
          title: 'One possible solution',
          code: 'name = input("What is your name? ")\ncountry = input("Where are you from? ")\nfood = input("What is your favorite food? ")\nage = int(input("How old are you? "))\n\nprint("Hello!")\nprint("My name is", name)\nprint("I am from", country)\nprint(f"My favorite food is {food}")\nprint(f"Born around {2026 - age}")',
          stdin: ['Neo', 'Myanmar', 'Pizza', '25']
        }
      ]
    },
    {
      id: 'errors',
      eyebrow: 'Debugging',
      title: 'Reading errors like a pro',
      minutes: 2,
      blocks: [
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Error', 'Example', 'What it means'],
          rows: [
            ['SyntaxError', 'print("Hi)', 'Grammar broken: missing quote or bracket'],
            ['NameError', 'print(nmae)', 'That name was never assigned (typo?)'],
            ['TypeError', '"Age: " + 25', 'Wrong type for this operation'],
            ['ValueError', 'int("twenty")', 'Right type, impossible value']
          ]
        },
        {
          type: 'analogy',
          title: 'A doctor’s report',
          body: 'A traceback is a medical report: jump to the last line for the diagnosis, then check the line number to see where it hurts.'
        },
        { type: 'code', runnable: true, title: 'Fix the bug', code: 'name = "Neo"\nprint(nmae)' }
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
          question: 'What does print() return?',
          options: ['The text it printed', 'None', 'True', 'The number of characters'],
          answer: 1,
          explanation: 'print() displays a value; it returns None.'
        },
        {
          type: 'quiz',
          question: 'What is type(10 / 2)?',
          options: ['int', 'float', 'str', 'bool'],
          answer: 1,
          explanation: '/ always returns a float: 5.0.'
        },
        {
          type: 'quiz',
          question: 'What does input() always return?',
          options: ['int', 'Whatever the user typed, as the right type', 'str', 'None'],
          answer: 2,
          explanation: 'input() always returns a str — convert with int() or float().'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework: Personal Profile Program',
          body: 'Ask for name, age, country, favorite food and hobby, then print a neat profile. Stretch: age in months with int(), a border with print("=" * 30), and f-strings.'
        }
      ]
    }
  ]
}

export default day1
