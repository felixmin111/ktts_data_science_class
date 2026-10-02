import type { GameDefinition } from '@/models/game.model'

const operatorChallenge: GameDefinition = {
  id: 'operator-challenge',
  title: 'Operator Challenge',
  tagline: 'Conversions, operators and if/elif: outthink the interpreter.',
  icon: 'calculator',
  color: '#1F7A8C',
  track: 'foundations',
  day: 2,
  secondsPerQuestion: 20,
  questionsPerRound: 10,
  bank: [
    {
      prompt: 'What is printed?',
      code: 'print(3 + 2.0)',
      options: ['5.0', '5', '5.00', 'TypeError'],
      answer: 0,
      explanation: 'int + float: Python converts upward to float, so the result is 5.0.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(True + 1)',
      options: ['2', 'True1', 'TypeError', 'True'],
      answer: 0,
      explanation: 'bool is a kind of int: True counts as 1, so 1 + 1 = 2.'
    },
    {
      prompt: 'What happens?',
      code: 'age = input("Age: ")   # user types 20\nprint(age + 1)',
      options: ['TypeError', '21', '201', '20 1'],
      answer: 0,
      explanation: 'input() always returns a str. Convert first: int(age) + 1.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(int("7") + int(2.9))',
      options: ['9', '10', '9.9', 'ValueError'],
      answer: 0,
      explanation: 'int("7") is 7 and int(2.9) cuts the decimals to 2: 7 + 2 = 9.'
    },
    {
      prompt: 'What happens?',
      code: 'print(int("3.5"))',
      options: ['ValueError', '3', '4', '3.5'],
      answer: 0,
      explanation: 'int() cannot read a decimal string. Use int(float("3.5")) to get 3.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(round(2.567, 2))',
      options: ['2.57', '2.56', '2.6', '3'],
      answer: 0,
      explanation: 'round(x, 2) keeps two decimal places and rounds the third.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(bool("False"))',
      options: ['True', 'False', 'Error', '"False"'],
      answer: 0,
      explanation: 'Any non-empty string is truthy, even the text "False".'
    },
    {
      prompt: 'What is printed?',
      code: 'print(bool(0), bool(""), bool(" "))',
      options: ['False False True', 'False False False', 'True False True', 'False True True'],
      answer: 0,
      explanation: '0 and "" are empty, so False. " " contains a space, so it is True.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(2 + 3 * 4)',
      options: ['14', '20', '24', '9'],
      answer: 0,
      explanation: '* goes before +: 3 * 4 = 12, then 2 + 12 = 14.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(-2 ** 2)',
      options: ['-4', '4', '-2', 'Error'],
      answer: 0,
      explanation: '** binds tighter than the minus sign: -(2 ** 2) = -4. Write (-2) ** 2 for 4.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(2 ** 3 ** 2)',
      options: ['512', '64', '36', '12'],
      answer: 0,
      explanation: '** works right to left: 3 ** 2 = 9, then 2 ** 9 = 512.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(10 - 4 - 3)',
      options: ['3', '9', '-3', '1'],
      answer: 0,
      explanation: '- works left to right: (10 - 4) - 3 = 3.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(125 // 60, 125 % 60)',
      options: ['2 5', '2 25', '2.08 5', '5 2'],
      answer: 0,
      explanation: '125 seconds = 2 whole minutes (// 60) and 5 seconds left over (% 60).'
    },
    {
      prompt: 'What is printed?',
      code: 'print(divmod(23, 6))',
      options: ['(3, 5)', '(5, 3)', '3.83', '(3, 0.83)'],
      answer: 0,
      explanation: 'divmod gives (quotient, remainder) together: 23 = 6 * 3 + 5.'
    },
    {
      prompt: 'Which expression tells you if n is even?',
      options: ['n % 2 == 0', 'n / 2 == 0', 'n // 2 == 0', 'n % 2 == 1'],
      answer: 0,
      explanation: 'An even number leaves no remainder when divided by 2.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(-7 // 2)',
      options: ['-4', '-3', '-3.5', '3'],
      answer: 0,
      explanation: '// rounds down (towards minus infinity): -3.5 becomes -4.'
    },
    {
      prompt: 'What is printed?',
      code: 'x = 10\nx += 5\nx *= 2\nprint(x)',
      options: ['30', '20', '25', '15'],
      answer: 0,
      explanation: 'x += 5 makes 15, then x *= 2 makes 30.'
    },
    {
      prompt: 'What happens?',
      code: 'count = 0\ncount++',
      options: ['SyntaxError', 'count becomes 1', 'count stays 0', 'count becomes 2'],
      answer: 0,
      explanation: 'Python has no ++ operator. Write count += 1.'
    },
    {
      prompt: 'What is printed?',
      code: 'import math\nprint(math.sqrt(16), abs(-3))',
      options: ['4.0 3', '4 3', '4.0 -3', '8.0 3'],
      answer: 0,
      explanation: 'math.sqrt always returns a float; abs(-3) is the distance from zero, 3.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(1 < 5 < 10)',
      options: ['True', 'False', 'Error', '10'],
      answer: 0,
      explanation: 'Python chains comparisons: 1 < 5 and 5 < 10 are both True.'
    },
    {
      prompt: 'What happens?',
      code: 'x = 5\nif x = 5:\n    print("five")',
      options: ['SyntaxError', 'five', 'Nothing is printed', 'True'],
      answer: 0,
      explanation: '= assigns a value; == compares. An if needs the comparison ==.'
    },
    {
      prompt: 'What is printed?',
      code: 'print("apple" < "banana")',
      options: ['True', 'False', 'TypeError', '"apple"'],
      answer: 0,
      explanation: 'Strings compare in dictionary order, and "a" comes before "b".'
    },
    {
      prompt: 'What is printed?',
      code: 'print(True or False and False)',
      options: ['True', 'False', 'None', 'Error'],
      answer: 0,
      explanation: 'and goes before or: False and False is False, then True or False is True.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(not 5 > 3)',
      options: ['False', 'True', '-5', 'Error'],
      answer: 0,
      explanation: 'The comparison runs first: 5 > 3 is True, and not True is False.'
    },
    {
      prompt: 'What is printed?',
      code: 'age = 15\nprint(age >= 13 and age <= 19)',
      options: ['True', 'False', '15', 'Error'],
      answer: 0,
      explanation: 'Both sides are True, so and gives True: 15 is a teenager.'
    },
    {
      prompt: 'What is printed?',
      code: 'score = 85\nif score >= 50:\n    print("pass")\nelif score >= 80:\n    print("great")\nelse:\n    print("fail")',
      options: ['pass', 'great', 'pass\ngreat', 'fail'],
      answer: 0,
      explanation: 'Python takes the first True branch and skips the rest. Put the strictest check first.'
    },
    {
      prompt: 'What is printed?',
      code: 'temp = 30\nif temp > 35:\n    print("hot")\nelif temp > 25:\n    print("warm")\nelse:\n    print("cool")',
      options: ['warm', 'hot', 'cool', 'warm\ncool'],
      answer: 0,
      explanation: '30 > 35 is False, 30 > 25 is True, so the elif branch runs.'
    },
    {
      prompt: 'What is printed?',
      code: 'name = ""\nif name:\n    print("Hi", name)\nelse:\n    print("No name")',
      options: ['No name', 'Hi', 'Hi ', 'Error'],
      answer: 0,
      explanation: 'An empty string is falsy, so the else branch runs.'
    }
  ]
}

export default operatorChallenge
