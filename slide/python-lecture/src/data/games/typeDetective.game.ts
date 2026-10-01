import type { GameDefinition, GameQuestion } from '@/models/game.model'

const TYPES = ['str', 'int', 'float', 'bool']

const q = (code: string, answer: string, explanation: string): GameQuestion => ({
  prompt: 'What type is this value?',
  code,
  options: TYPES,
  answer: TYPES.indexOf(answer),
  explanation
})

const typeDetective: GameDefinition = {
  id: 'type-detective',
  title: 'Type Detective',
  tagline: 'str, int, float or bool? Read the clues fast.',
  icon: 'magnify',
  color: '#2A62A6',
  track: 'foundations',
  day: 1,
  secondsPerQuestion: 10,
  questionsPerRound: 10,
  bank: [
    q('"Bangkok"', 'str', 'Quotes make it text.'),
    q('20', 'int', 'Digits only, no dot: a whole number.'),
    q('3.14', 'float', 'The dot makes it a decimal number.'),
    q('"20"', 'str', 'Quotes win — these are the characters 2 and 0.'),
    q('7.0', 'float', 'Even .0 makes it a float.'),
    q('-5', 'int', 'Negative whole numbers are still int.'),
    q('"3.14"', 'str', 'Quotes again — text that looks like a number.'),
    q('1_000', 'int', 'Underscores are ignored inside number literals.'),
    q('True', 'bool', 'True and False (capitalised, no quotes) are bool.'),
    q('"False"', 'str', 'With quotes it is just the text F-a-l-s-e.'),
    q('10 / 2', 'float', '/ always returns a float: 5.0.'),
    q('10 // 2', 'int', '// with two ints gives an int: 5.'),
    q('1e3', 'float', 'Scientific notation is a float: 1000.0.'),
    q("''", 'str', 'An empty string is still a string.'),
    q('2 ** 100', 'int', 'Python ints have no size limit.'),
    q('len("hi")', 'int', 'len() returns a count — a whole number.'),
    q('str(25)', 'str', 'str() converts the number to text "25".'),
    q('int("7")', 'int', 'int() converts text "7" to the number 7.'),
    q('0.1 + 0.2', 'float', 'Float + float = float (0.30000000000000004).'),
    q('5 > 3', 'bool', 'A comparison produces True or False.'),
    q('input("Age? ")', 'str', 'input() ALWAYS returns a str, even if you type digits.'),
    q('3 * 2.0', 'float', 'Mixing int and float gives a float.')
  ]
}

export default typeDetective
