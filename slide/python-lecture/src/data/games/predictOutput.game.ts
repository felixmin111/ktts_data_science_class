import type { GameDefinition } from '@/models/game.model'

const predictOutput: GameDefinition = {
  id: 'predict-output',
  title: 'Predict the Output',
  tagline: 'Be the interpreter: what does the screen show?',
  icon: 'crystal-ball',
  color: '#B26B00',
  track: 'foundations',
  day: 1,
  secondsPerQuestion: 20,
  questionsPerRound: 8,
  bank: [
    {
      prompt: 'What is printed?',
      code: 'print("A", "B", "C", sep="-")',
      options: ['A-B-C', 'A B C', 'ABC', 'A-B-C-'],
      answer: 0,
      explanation: 'sep is placed between values only, not at the end.'
    },
    {
      prompt: 'What is printed?',
      code: 'print("Loading", end="...")\nprint("done")',
      options: ['Loading...done', 'Loading...\ndone', 'Loading done', 'Loadingdone...'],
      answer: 0,
      explanation: 'end="..." replaces the newline, so the next print continues on the same line.'
    },
    {
      prompt: 'What is printed?',
      code: 'print("20" + "5")',
      options: ['205', '25', 'TypeError', '20 5'],
      answer: 0,
      explanation: '+ on two strings joins them.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(10 / 2)',
      options: ['5.0', '5', '5.00', 'TypeError'],
      answer: 0,
      explanation: '/ always returns a float.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(17 // 5, 17 % 5)',
      options: ['3 2', '3.4 2', '3 0.4', '2 3'],
      answer: 0,
      explanation: '17 // 5 is 3 (whole groups), 17 % 5 is 2 (the leftover).'
    },
    {
      prompt: 'What is printed?',
      code: 'x = 5\nx = x + 1\nprint(x)',
      options: ['6', '5', 'Error', 'x + 1'],
      answer: 0,
      explanation: 'The right side is evaluated first (5 + 1), then x is re-attached to 6.'
    },
    {
      prompt: 'What is printed?',
      code: 'a = 10\nb = a\na = 20\nprint(b)',
      options: ['10', '20', '30', 'Error'],
      answer: 0,
      explanation: 'b still points at the 10 object; only a moved.'
    },
    {
      prompt: 'What is printed?',
      code: 'print("Ha" * 3)',
      options: ['HaHaHa', 'Ha3', 'TypeError', 'Ha Ha Ha'],
      answer: 0,
      explanation: '* repeats a string.'
    },
    {
      prompt: 'What is printed?',
      code: 's = "Python"\nprint(s[0:3])',
      options: ['Pyt', 'Pyth', 'yth', 'P'],
      answer: 0,
      explanation: 'Slices include the start and exclude the stop: indexes 0, 1, 2.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(0.1 + 0.2 == 0.3)',
      options: ['False', 'True', '0.3', 'Error'],
      answer: 0,
      explanation: '0.1 + 0.2 is 0.30000000000000004 because of binary floating point.'
    },
    {
      prompt: 'What is printed?',
      code: 'name = "Neo"\nprint(f"Hi {name}!")',
      options: ['Hi Neo!', 'Hi {name}!', 'Hi name!', 'f"Hi Neo!"'],
      answer: 0,
      explanation: 'An f-string replaces {name} with the value of name.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(int(3.99))',
      options: ['3', '4', '3.99', 'ValueError'],
      answer: 0,
      explanation: 'int() cuts the decimals off — it does not round.'
    },
    {
      prompt: 'What is printed?',
      code: 'print(len("Hello World"))',
      options: ['11', '10', '2', '12'],
      answer: 0,
      explanation: 'The space counts as a character: 5 + 1 + 5.'
    },
    {
      prompt: 'What is printed?',
      code: 'x = print("hi")\nprint(x)',
      options: ['hi\nNone', 'hi\nhi', 'None', 'hi'],
      answer: 0,
      explanation: 'The first line prints hi; print returns None, which is stored in x.'
    }
  ]
}

export default predictOutput
