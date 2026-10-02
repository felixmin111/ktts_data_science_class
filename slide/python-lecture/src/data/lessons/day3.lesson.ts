import type { Lesson } from '@/models/lesson.model'
import {
  assign,
  augment,
  forEach,
  forRange,
  loopProgram,
  print,
  stmt,
  when,
  whileLoop
} from '@/functions/loop.function'

const n = (v: unknown) => Number(v)

const day3: Lesson = {
  id: 'day-3',
  track: 'foundations',
  day: 3,
  title: 'Loops: repeat without copy-paste',
  summary:
    'while and for loops, range(), counters and totals, break and continue — watch every pass on an animated loop diagram, then build a times-table program.',
  durationMinutes: 60,
  topics: ['while loops', 'Counters & totals', 'for & range()', 'break / continue', 'Times table'],
  available: true,
  sections: [
    {
      id: 'recap',
      eyebrow: 'Warm-up',
      title: 'Yesterday in one program',
      minutes: 3,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: 'score = 72\n\nif score >= 80:\n    print("A")\nelif score >= 60:\n    print("B")\nelse:\n    print("C")',
          output: 'B'
        },
        {
          type: 'quiz',
          question: 'This grades one student. How would you grade 30 students?',
          options: [
            'Copy the if / elif / else 30 times',
            'Write it once and let Python repeat it for each student',
            'Python cannot do that',
            'Use one very long if'
          ],
          answer: 1,
          explanation:
            'Copying code 30 times is slow and easy to get wrong. Today we learn loops: write the steps once and let Python repeat them.'
        }
      ],
      notes:
        'Ask the student how long it would take to grade 30 students with copy-paste, then what happens if the grade boundaries change.'
    },
    {
      id: 'why-loops',
      eyebrow: 'Loops',
      title: 'Why loops? Write it once, run it many times',
      minutes: 4,
      blocks: [
        {
          type: 'code',
          runnable: true,
          code: '# Without a loop: one line per number. 100 numbers = 100 lines.\nprint(1)\nprint(2)\nprint(3)\n\n# With a loop: two lines for any amount.\nfor i in range(1, 4):\n    print(i)',
          output: '1\n2\n3\n1\n2\n3'
        },
        {
          type: 'text',
          body: [
            'A **loop** runs the same block of code again and again. Each run of the block is called a **pass** (or an iteration).',
            'Python has two loops: **`while`** repeats **as long as a condition is True**, and **`for`** repeats **once for each item** in a sequence, such as the numbers from `range()` or the letters of a string.'
          ]
        },
        {
          type: 'analogy',
          title: 'Laps on a running track',
          body: '“Keep running while you still have energy” is a while loop: you check before every lap. “Run one lap for each name on this list” is a for loop: you know the number of laps before you start.'
        }
      ]
    },
    {
      id: 'while-loop',
      eyebrow: 'Loops · while',
      title: 'while: repeat as long as the condition is True',
      minutes: 8,
      blocks: [
        {
          type: 'text',
          body: [
            '**The four parts of a counting while loop:** ① a **start value** before the loop (`i = 1`) ② the **condition**, checked at the top before every pass (`i <= 3`) ③ the **body**, indented by 4 spaces ④ an **update** that moves the variable towards the end (`i += 1`).',
            '**How it runs:** check the condition. True → run the whole body, then go back up and check again. False → skip the body and carry on after the loop.'
          ]
        },
        {
          type: 'loop',
          mode: 'demo',
          program: loopProgram(
            [assign('i', 1)],
            whileLoop('i <= 3', (v) => n(v.i) <= 3),
            [print('i', (v) => String(v.i)), augment('i', '+=', '1', () => 1)],
            [print('"Done"', () => 'Done')]
          ),
          explanation:
            'The check ran 4 times but the body only 3: on the fourth check i was 4, 4 <= 3 was False, and the dot left through the False arrow to print "Done".'
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'The never-ending loop',
          body: 'Forget the update (`i += 1`) and i stays 1 forever: `i <= 3` is always True, so the loop never stops. If your program seems frozen, look for a missing update first.'
        },
        {
          type: 'loop',
          mode: 'trace',
          program: loopProgram(
            [assign('n', 10)],
            whileLoop('n > 0', (v) => n(v.n) > 0),
            [augment('n', '-=', '3', () => 3)],
            [print('n', (v) => String(v.n))]
          ),
          explanation:
            'n went 10 → 7 → 4 → 1 → -2. The condition is only checked at the top, so from 1 the body ran once more and n ended below zero.'
        },
        {
          type: 'quiz',
          question: 'How many times does "Hi" print?',
          code: 'i = 5\nwhile i < 3:\n    print("Hi")\n    i += 1',
          options: ['0', '1', '3', 'Forever'],
          answer: 0,
          explanation:
            '5 < 3 is False the very first time, so the body never runs. A while loop can run zero times.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Exercise: countdown',
          code: '# Exercise: countdown\n# Use a while loop to print 5, 4, 3, 2, 1 (one number per line),\n# then print "Liftoff!" once, after the loop.\n\nn = 5\n# Your code here\n'
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'n = 5\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("Liftoff!")',
          output: '5\n4\n3\n2\n1\nLiftoff!'
        }
      ]
    },
    {
      id: 'counters-totals',
      eyebrow: 'Loops · patterns',
      title: 'Counters and totals',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            '**Total pattern:** create `total = 0` **before** the loop, then add to it inside: `total += x`. After the loop, `total` holds the sum.',
            '**Counter pattern:** create `count = 0` before the loop, then `count += 1` each time something happens. Put it inside an `if` to count only some items.',
            'Both must start **before** the loop. If you write `total = 0` inside the body, it is reset to 0 on every pass.'
          ]
        },
        {
          type: 'loop',
          mode: 'demo',
          program: loopProgram(
            [assign('total', 0)],
            forRange('i', 1, 6),
            [augment('total', '+=', 'i', (v) => n(v.i))],
            [print('total', (v) => String(v.total))]
          ),
          explanation:
            'Watch total grow in the variables panel: 0 → 1 → 3 → 6 → 10 → 15. The print is after the loop, so it runs once, at the end.'
        },
        {
          type: 'loop',
          mode: 'trace',
          program: loopProgram(
            [assign('count', 0)],
            forEach('ch', '"banana"', ['b', 'a', 'n', 'a', 'n', 'a']),
            [
              when(
                'ch == "a"',
                (v) => v.ch === 'a',
                augment('count', '+=', '1', () => 1)
              )
            ],
            [print('count', (v) => String(v.count))]
          ),
          explanation:
            'The if was checked for all 6 letters, but count only grew on the three passes where ch was "a".'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'for i in range(1, 4):\n    total = 0\n    total += i\nprint(total)',
          options: ['6', '3', '0', 'Error'],
          answer: 1,
          explanation:
            'total = 0 is inside the loop, so it is reset on every pass. After the last pass it is 0 + 3 = 3. Move total = 0 above the loop to get 6.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Exercise: a total and a counter in one loop',
          code: '# Exercise: a total and a counter in one loop\n# Loop over the numbers 1 to 30.\n#   1. Add up all the EVEN numbers         (total pattern)\n#   2. Count how many are multiples of 3   (counter pattern)\n# Print both results after the loop. Hint: i % 2 == 0 means "even".\n\ntotal = 0\ncount = 0\n# Your code here\n'
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'total = 0\ncount = 0\nfor i in range(1, 31):\n    if i % 2 == 0:\n        total += i      # add every even number\n    if i % 3 == 0:\n        count += 1      # count multiples of 3\nprint("Sum of even numbers:", total)\nprint("Multiples of 3:", count)',
          output: 'Sum of even numbers: 240\nMultiples of 3: 10'
        }
      ]
    },
    {
      id: 'for-range',
      eyebrow: 'Loops · for',
      title: 'for and range(): repeat for each value',
      minutes: 9,
      blocks: [
        {
          type: 'text',
          body: [
            '`for i in range(1, 4):` gives `i` the values 1, 2, 3, one per pass. There is no start value or update to forget: the `for` loop does both for you.',
            '`range()` makes the numbers. It always **stops before** the stop value.'
          ]
        },
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Call', 'Values', 'Read it as'],
          rows: [
            ['range(5)', '0 1 2 3 4', 'from 0, stop before 5'],
            ['range(2, 6)', '2 3 4 5', 'from 2, stop before 6'],
            ['range(1, 10, 2)', '1 3 5 7 9', 'from 1, add 2 each time'],
            ['range(5, 0, -1)', '5 4 3 2 1', 'count down, stop before 0'],
            ['range(0)', '(nothing)', 'zero passes']
          ]
        },
        {
          type: 'loop',
          mode: 'demo',
          program: loopProgram(
            [],
            forRange('i', 3, 0, -1),
            [print('i', (v) => String(v.i))],
            [print('"Go!"', () => 'Go!')]
          ),
          explanation:
            'With a step of -1 the loop counts down 3, 2, 1. There is no fourth value, so the check is False and "Go!" prints once after the loop.'
        },
        {
          type: 'loop',
          mode: 'trace',
          program: loopProgram([], forRange('i', 2, 10, 3), [print('i', (v) => String(v.i))]),
          explanation:
            'range(2, 10, 3) gives 2, 5 and 8. The next value would be 11, which is not below 10, so the check is False.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'A for loop over a string',
          code: 'for ch in "Python":\n    print(ch, end=" ")',
          output: 'P y t h o n '
        },
        {
          type: 'quiz',
          question: 'How many numbers does range(1, 5) give?',
          options: ['5', '4', '6', '1'],
          answer: 1,
          explanation: '1, 2, 3, 4: it stops before 5. A quick rule: stop − start = 5 − 1 = 4.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Exercise: number each letter',
          code: '# Exercise: number each letter\n# Print every letter of the word with its index, like:\n#   0 P\n#   1 y\n# Hint: range(len(word)) gives 0, 1, 2, … and word[i] is the letter at index i.\n\nword = "Python"\n# Your code here\n'
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'word = "Python"\nfor i in range(len(word)):\n    print(i, word[i])',
          output: '0 P\n1 y\n2 t\n3 h\n4 o\n5 n'
        }
      ]
    },
    {
      id: 'break-continue',
      eyebrow: 'Loops · control',
      title: 'break and continue',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            '**`break`** leaves the loop **immediately**, even if there are values left. Use it when you have found what you were looking for.',
            '**`continue`** skips the **rest of this pass** and goes straight back to the check. Use it to ignore some items.'
          ]
        },
        {
          type: 'loop',
          mode: 'demo',
          program: loopProgram(
            [],
            forRange('i', 1, 10),
            [when('i % 4 == 0', (v) => n(v.i) % 4 === 0, 'break'), print('i', (v) => String(v.i))],
            [print('"After the loop"', () => 'After the loop')]
          ),
          explanation:
            'On the pass where i was 4, the if was True and break jumped straight to the code after the loop. 5 to 9 never ran.'
        },
        {
          type: 'loop',
          mode: 'trace',
          program: loopProgram([], forRange('i', 1, 6), [
            when('i % 2 == 0', (v) => n(v.i) % 2 === 0, 'continue'),
            print('i', (v) => String(v.i))
          ]),
          explanation:
            'On even passes, continue jumped back to the check before print, so only the odd numbers 1, 3, 5 were printed.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Searching with break',
          code: 'secret = 7\n\nfor guess in [3, 9, 7, 1]:\n    if guess == secret:\n        print("Found it!")\n        break\n    print(guess, "is wrong")',
          output: '3 is wrong\n9 is wrong\nFound it!'
        },
        {
          type: 'quiz',
          question: 'What does this print?',
          code: 'for i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)',
          options: ['1\n2', '1\n2\n4\n5', '3', '1\n2\n3\n4\n5'],
          answer: 1,
          explanation:
            'continue skips only the pass where i is 3. The loop carries on with 4 and 5. With break it would print only 1 and 2.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Exercise: find the first match with break',
          code: '# Exercise: find the first match with break\n# Start at 101 and count up. Stop at the FIRST number that can be\n# divided by both 5 and 7 (no remainder), then print it.\n# Hint: while True + break; n % 5 == 0 means "divisible by 5".\n\nn = 101\n# Your code here\n'
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'n = 101\nwhile True:\n    if n % 5 == 0 and n % 7 == 0:\n        break\n    n += 1\nprint("First number above 100 divisible by 5 and 7:", n)',
          output: 'First number above 100 divisible by 5 and 7: 105'
        }
      ],
      notes:
        'Play the Loop Runner game from the Games page on the projector: students call out the answer, then everyone watches the loop run.'
    },
    {
      id: 'while-vs-for',
      eyebrow: 'Loops · choosing',
      title: 'while or for?',
      minutes: 3,
      blocks: [
        {
          type: 'table',
          columns: ['Use', 'When', 'Example'],
          rows: [
            [
              'for',
              'You know the values or the count before you start',
              'Print a times table; check every letter'
            ],
            [
              'while',
              'You repeat until something happens',
              'Ask for a password until it is right; save until you reach a goal'
            ]
          ]
        },
        {
          type: 'callout',
          tone: 'success',
          title: 'Rule of thumb',
          body: 'If a for loop can do it, use for. It has no start value or update to forget, so it can never run forever by accident.'
        }
      ]
    },
    {
      id: 'practice',
      eyebrow: 'Practice',
      title: 'Practice set: from easy to challenging',
      minutes: 15,
      blocks: [
        {
          type: 'text',
          body: [
            'Six exercises, from ★ (easy) to ★★★ (challenging). For each one: ① read the comments ② write your code in the box ③ press **Run** and compare with what the comments ask for ④ only then open the solution.',
            'Every exercise uses one of today’s patterns: **repeat a fixed number of times** (`for` + `range`), **repeat until something happens** (`while`), **total / counter**, or **stop early** (`break`).',
            '**★1** A star triangle: 5 lines of 1 to 5 stars. **★2** Count the vowels (a, e, i, o, u) in a sentence. **★★3** Add up the digits of a number (4729 → 22). **★★4** Ask for 5 scores with input() and print the total and average. **★★★5** At most 3 tries for a password. **★★★6** A number-guessing game with “Too low / Too high” hints until the guess is right.'
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: '★ Exercise 1: a star triangle',
          code: '# ★ Exercise 1: a star triangle\n# Print this triangle with a for loop:\n# *\n# **\n# ***\n# ****\n# *****\n# Hint: "*" * 3 gives "***" (string repetition from Day 1).\n\n# Your code here\n'
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'for i in range(1, 6):\n    print("*" * i)',
          output: '*\n**\n***\n****\n*****'
        },
        {
          type: 'code',
          runnable: true,
          title: '★ Exercise 2: count the vowels',
          code: '# ★ Exercise 2: count the vowels\n# Count how many vowels (a, e, i, o, u) the sentence has.\n# Hint: loop over the letters; ch in "aeiou" is True when ch is a vowel.\n# Use .lower() so capital letters count too.\n\nsentence = "Loops make programs powerful"\n# Your code here\n'
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'sentence = "Loops make programs powerful"\ncount = 0\nfor ch in sentence.lower():\n    if ch in "aeiou":\n        count += 1\nprint("Vowels:", count)',
          output: 'Vowels: 9'
        },
        {
          type: 'code',
          runnable: true,
          title: '★★ Exercise 3: add up the digits',
          code: '# ★★ Exercise 3: add up the digits\n# Add up the digits of n: 4 + 7 + 2 + 9 = 22.\n# Hint (Day 2 operators):\n#   n % 10   is the last digit   (4729 % 10 = 9)\n#   n // 10  drops the last digit (4729 // 10 = 472)\n# Repeat while n > 0.\n\nn = 4729\n# Your code here\n'
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'n = 4729\ntotal = 0\nwhile n > 0:\n    total += n % 10   # last digit\n    n //= 10          # drop the last digit\nprint("Digit sum:", total)',
          output: 'Digit sum: 22'
        },
        {
          type: 'loop',
          mode: 'trace',
          title: 'Watch the digit sum run',
          program: loopProgram(
            [assign('n', 4729), assign('total', 0)],
            whileLoop('n > 0', (v) => n(v.n) > 0),
            [
              augment('total', '+=', 'n % 10', (v) => n(v.n) % 10),
              stmt('n //= 10', (v) => {
                v.n = Math.floor(n(v.n) / 10)
              })
            ],
            [print('total', (v) => String(v.total))]
          ),
          explanation:
            'Each pass takes the last digit with n % 10 (9, then 2, then 7, then 4) and removes it with n //= 10. When n reaches 0, the condition is False and total is 22.'
        },
        {
          type: 'code',
          runnable: true,
          title: '★★ Exercise 4: average of five scores',
          code: '# ★★ Exercise 4: average of five scores\n# Ask for 5 scores with input() inside a for loop.\n# Keep a running total, then print the total and the average.\n# (The Input box below already has 5 scores ready.)\n\ntotal = 0\n# Your code here\n',
          stdin: ['70', '85', '90', '60', '95']
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'total = 0\nfor i in range(5):\n    score = int(input(f"Score {i + 1}: "))\n    total += score\nprint("Total:", total)\nprint("Average:", total / 5)',
          stdin: ['70', '85', '90', '60', '95'],
          output: 'Score 1: Score 2: Score 3: Score 4: Score 5: Total: 400\nAverage: 80.0'
        },
        {
          type: 'code',
          runnable: true,
          title: '★★★ Exercise 5: three tries for the password',
          code: '# ★★★ Exercise 5: three tries for the password\n# The password is "python". Let the user try at most 3 times.\n#   right password → print "Welcome!" and stop asking\n#   wrong password → print "Wrong password"\n# If all 3 tries are wrong, print "Account locked" at the end.\n# Hint: while tries < 3 and password != "python":\n\npassword = ""\ntries = 0\n# Your code here\n',
          stdin: ['abc', '1234', 'python']
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'password = ""\ntries = 0\nwhile tries < 3 and password != "python":\n    password = input("Password: ")\n    tries += 1\n    if password == "python":\n        print("Welcome!")\n    else:\n        print("Wrong password")\n\nif password != "python":\n    print("Account locked")',
          stdin: ['abc', '1234', 'python'],
          output: 'Password: Wrong password\nPassword: Wrong password\nPassword: Welcome!'
        },
        {
          type: 'code',
          runnable: true,
          title: '★★★ Exercise 6: guess the number',
          code: '# ★★★ Exercise 6: guess the number\n# The secret number is 7. Keep asking for a guess until it is right.\n# After each guess print "Too low", "Too high" or\n# "Correct! You needed N tries" — then stop.\n# Hint: while True + if / elif / else + break, and a counter for the tries.\n\nsecret = 7\ntries = 0\n# Your code here\n',
          stdin: ['3', '9', '7']
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: 'secret = 7\ntries = 0\nwhile True:\n    guess = int(input("Guess (1-10): "))\n    tries += 1\n    if guess < secret:\n        print("Too low")\n    elif guess > secret:\n        print("Too high")\n    else:\n        print("Correct! You needed", tries, "tries")\n        break',
          stdin: ['3', '9', '7'],
          output:
            'Guess (1-10): Too low\nGuess (1-10): Too high\nGuess (1-10): Correct! You needed 3 tries'
        }
      ],
      notes:
        'Let students work in pairs. Walk around during ★★ and ★★★; most mistakes are a missing update (endless loop) or a total reset inside the loop. Change the Input box values to test the password and guessing programs with different answers.'
    },
    {
      id: 'project',
      eyebrow: 'Mini project',
      title: 'Times table and savings goal',
      minutes: 10,
      blocks: [
        {
          type: 'callout',
          tone: 'success',
          title: 'Requirements',
          body: 'Part 1: ask for a number and print its times table from 1 to 10, as “7 x 3 = 21”. Part 2: ask how much you save each week and your goal. Use a while loop to print how many weeks it takes to reach the goal.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Write yours here (edit freely)',
          code: '# Your code here\n',
          stdin: ['7', '1500', '10000']
        },
        {
          type: 'code',
          runnable: true,
          hidden: true,
          title: 'One possible solution',
          code: '# Part 1: times table\nnumber = int(input("Number: "))\nfor i in range(1, 11):\n    print(number, "x", i, "=", number * i)\n\n# Part 2: savings goal\nweekly = int(input("Saved each week: "))\ngoal = int(input("Goal: "))\nsaved = 0\nweeks = 0\nwhile saved < goal:\n    saved += weekly\n    weeks += 1\nprint("You reach", goal, "after", weeks, "weeks")',
          stdin: ['7', '1500', '10000']
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Level up',
          body: 'In Part 1, skip the line for 5 with continue. In Part 2, print the running total every week, and stop early with break if the weekly amount is 0 (otherwise the loop never ends).'
        }
      ],
      notes:
        'Test the solution with 7, 1500, 10000 (7 weeks), then ask what happens with a weekly amount of 0, and why the Level up mentions break.'
    },
    {
      id: 'errors',
      eyebrow: 'Debugging',
      title: 'Today’s new errors',
      minutes: 3,
      blocks: [
        {
          type: 'table',
          codeColumns: [0, 1],
          columns: ['Problem', 'Example', 'What it means'],
          rows: [
            [
              'Never-ending loop',
              'while i <= 3: print(i)',
              'The update (i += 1) is missing, so the condition never becomes False'
            ],
            ['Off by one', 'range(1, 10)', 'Stops at 9, not 10. Use range(1, 11) to include 10'],
            [
              'IndentationError',
              'print(i)',
              'The loop body is not indented under the for / while line'
            ],
            ['TypeError', 'range(2.5)', 'range() needs whole numbers (int), not floats']
          ]
        },
        {
          type: 'code',
          runnable: true,
          title: 'Fix the bugs (there are two): it should print 15',
          code: 'total = 0\nfor i in range(1, 5):\ntotal += i\nprint("Sum of 1 to 5 is", total)'
        }
      ]
    },
    {
      id: 'review',
      eyebrow: 'Review',
      title: 'Can you answer these?',
      minutes: 3,
      blocks: [
        {
          type: 'quiz',
          question: 'What is list(range(3))?',
          options: ['[1, 2, 3]', '[0, 1, 2]', '[0, 1, 2, 3]', '[3]'],
          answer: 1,
          explanation: 'range(3) starts at 0 and stops before 3.'
        },
        {
          type: 'quiz',
          question: 'Which loop should you use to ask for a password until it is correct?',
          options: ['for', 'while', 'Either, it makes no difference', 'Neither'],
          answer: 1,
          explanation:
            'You do not know how many tries it will take, so repeat while the password is wrong.'
        },
        {
          type: 'quiz',
          question: 'What does break do?',
          options: [
            'Skips the rest of this pass',
            'Leaves the loop immediately',
            'Stops the whole program',
            'Restarts the loop'
          ],
          answer: 1,
          explanation:
            'break leaves the loop and the program carries on after it. continue is the one that skips the rest of a pass.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework: FizzBuzz',
          body: 'Print the numbers 1 to 20, but print “Fizz” for multiples of 3, “Buzz” for multiples of 5 and “FizzBuzz” for multiples of both. Stretch: count how many Fizz, Buzz and FizzBuzz lines you printed and show the totals at the end.'
        }
      ]
    }
  ]
}

export default day3
