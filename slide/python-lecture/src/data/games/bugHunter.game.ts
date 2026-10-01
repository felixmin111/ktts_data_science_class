import type { GameDefinition, GameQuestion } from '@/models/game.model'

const ERRORS = ['No error', 'SyntaxError', 'NameError', 'TypeError', 'ValueError']

const q = (code: string, answer: string, explanation: string): GameQuestion => ({
  prompt: 'Which error does this raise?',
  code,
  options: ERRORS,
  answer: ERRORS.indexOf(answer),
  explanation
})

const bugHunter: GameDefinition = {
  id: 'bug-hunter',
  title: 'Bug Hunter',
  tagline: 'Spot the error before Python does.',
  icon: 'bug',
  color: '#2E7550',
  track: 'foundations',
  day: 1,
  secondsPerQuestion: 15,
  questionsPerRound: 8,
  bank: [
    q('print("Hi)', 'SyntaxError', 'The string never closes — the grammar is broken.'),
    q('name = "Neo"\nprint(nmae)', 'NameError', 'nmae was never assigned. Typo!'),
    q('print("Age: " + 25)', 'TypeError', 'Cannot + a str and an int.'),
    q('int("twenty")', 'ValueError', 'Right type (str), impossible value.'),
    q('print("Age:", 25)', 'No error', 'Commas let print() mix types safely.'),
    q('2name = "Neo"', 'SyntaxError', 'Names cannot start with a digit.'),
    q('int("3.5")', 'ValueError', 'int() expects whole-number text. Use float() first.'),
    q('float("3.5")', 'No error', 'float() happily converts "3.5".'),
    q('s = "Python"\ns[0] = "J"', 'TypeError', 'Strings are immutable: no item assignment.'),
    q('Print("hi")', 'NameError', 'Python is case-sensitive: Print is not print.'),
    q('class = "A"', 'SyntaxError', 'class is a reserved keyword.'),
    q('print("5" * 3)', 'No error', 'A string times an int repeats it: 555.'),
    q('print("5" * "3")', 'TypeError', 'You cannot multiply a string by a string.'),
    q(
      'age = input("Age? ")\nprint(age + 1)',
      'TypeError',
      'input() returns a str; add int() around it.'
    ),
    q('print(f"{2 + 3}")', 'No error', 'Any expression works inside f-string braces.')
  ]
}

export default bugHunter
