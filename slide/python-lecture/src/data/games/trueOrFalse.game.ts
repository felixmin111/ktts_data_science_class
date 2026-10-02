import type { GameDefinition, GameQuestion } from '@/models/game.model'

const OPTIONS = ['True', 'False']

const q = (code: string, answer: boolean, explanation: string): GameQuestion => ({
  prompt: 'True or False?',
  code,
  options: OPTIONS,
  answer: answer ? 0 : 1,
  explanation
})

const trueOrFalse: GameDefinition = {
  id: 'true-or-false',
  title: 'True or False?',
  tagline: 'Comparisons, and/or/not: judge each condition in seconds.',
  icon: 'scale-balance',
  color: '#A23B72',
  track: 'foundations',
  day: 2,
  secondsPerQuestion: 10,
  questionsPerRound: 12,
  bank: [
    // Comparisons
    q('7 >= 7', true, '>= means greater OR equal, and 7 equals 7.'),
    q('7 > 7', false, '> is strictly greater. 7 is not greater than itself.'),
    q('10 == 10.0', true, 'The int is converted up to 10.0, so the values are equal.'),
    q('"10" == 10', false, 'Text and numbers are never equal.'),
    q('5 != 5.0', false, 'The values are equal, so “not equal” is False.'),
    q('0.1 + 0.2 == 0.3', false, 'Float rounding makes the left side 0.30000000000000004.'),
    q('"apple" < "banana"', true, 'Strings compare in dictionary order: a comes before b.'),
    q(
      '"Zebra" < "apple"',
      true,
      'Only the first letters are compared, by character code: "Z" is 90, "a" is 97, and 90 < 97.'
    ),
    q('"cat" == "Cat"', false, 'Python is case-sensitive: c and C are different characters.'),
    q('len("hello") > 5', false, 'len("hello") is 5, and 5 > 5 is False.'),
    // Chained comparisons
    q('1 < 5 < 10', true, 'Both 1 < 5 and 5 < 10 are True.'),
    q('3 < 5 < 4', false, 'It means 3 < 5 and 5 < 4. The second part is False.'),
    q('age = 15\n13 <= age <= 19', true, '15 is between 13 and 19, so it is a teen age.'),
    // and / or / not
    q('True and False', false, 'and needs BOTH sides to be True.'),
    q('True or False', true, 'or needs at least ONE side to be True.'),
    q('not True', false, 'not flips the value: not True is False.'),
    q('not 5 > 3', false, 'The comparison runs first: 5 > 3 is True, then not True is False.'),
    q('5 > 3 and 2 > 4', false, '5 > 3 is True but 2 > 4 is False, and and needs both.'),
    q('5 > 3 or 2 > 4', true, '5 > 3 is True, which is enough for or.'),
    q(
      'True or False and False',
      true,
      'and goes first: False and False is False. Then True or False is True.'
    ),
    q(
      'not (True and False)',
      true,
      'Brackets first: True and False is False. Then not False is True.'
    ),
    q('not True or True', true, 'not goes first: not True is False. Then False or True is True.'),
    q(
      'x = 0\nx != 0 and 10 / x > 1',
      false,
      'Short-circuit: x != 0 is False, so 10 / x never runs.'
    ),
    q(
      'age = 16\nhas_ticket = True\nage >= 18 and has_ticket',
      false,
      'Having a ticket is not enough: 16 >= 18 is False.'
    ),
    q(
      'raining = True\numbrella = False\nraining and not umbrella',
      true,
      'It is raining AND there is no umbrella: you will get wet.'
    ),
    // Truthiness
    q('bool(0)', false, '0 is the only falsy int.'),
    q('bool(-1)', true, 'Every number except 0 is truthy, negatives too.'),
    q('bool("")', false, 'An empty string is falsy.'),
    q('bool(" ")', true, 'A space is a character, so the string is not empty.'),
    q('bool("False")', true, 'Any non-empty string is truthy, even the text "False".'),
    q('bool(0.0)', false, '0.0 is zero, so it is falsy.')
  ]
}

export default trueOrFalse
