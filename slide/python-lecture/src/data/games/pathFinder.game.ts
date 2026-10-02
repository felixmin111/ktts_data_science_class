import type { GameDefinition, GameQuestion } from '@/models/game.model'

const q = (code: string, options: string[], explanation: string): GameQuestion => ({
  prompt: 'Follow the path: what is printed?',
  code,
  options,
  answer: 0,
  explanation
})

const pathFinder: GameDefinition = {
  id: 'path-finder',
  title: 'Path Finder',
  tagline: 'if, elif, else and nested ifs: trace the road to the final print.',
  icon: 'source-branch',
  color: '#3A7D44',
  track: 'foundations',
  day: 2,
  secondsPerQuestion: 25,
  questionsPerRound: 8,
  bank: [
    // One chain: the first True branch wins
    q(
      'score = 72\nif score >= 80:\n    print("A")\nelif score >= 60:\n    print("B")\nelse:\n    print("C")',
      ['B', 'A', 'C', 'B\nC'],
      '72 >= 80 is False, 72 >= 60 is True, so the elif runs and the else is skipped.'
    ),
    q(
      'score = 35\nif score >= 80:\n    print("A")\nelif score >= 60:\n    print("B")\nelse:\n    print("C")',
      ['C', 'B', 'A', 'Nothing'],
      'Both conditions are False, so else catches it.'
    ),
    q(
      'temp = 25\nif temp > 30:\n    print("hot")\nelif temp > 20:\n    print("warm")\nelif temp > 10:\n    print("cool")\nelse:\n    print("cold")',
      ['warm', 'cool', 'warm\ncool', 'hot'],
      '25 > 20 is the first True test. Python stops there, even though 25 > 10 is also True.'
    ),
    q(
      'n = 0\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")',
      ['zero', 'positive', 'negative', 'Nothing'],
      '0 > 0 and 0 < 0 are both False, so else runs.'
    ),
    // Order traps
    q(
      'score = 95\nif score >= 50:\n    print("pass")\nelif score >= 90:\n    print("excellent")',
      ['pass', 'excellent', 'pass\nexcellent', 'Nothing'],
      '95 >= 50 is already True, so the elif is never checked. Put the strictest condition first.'
    ),
    q(
      'age = 70\nif age >= 18:\n    print("adult")\nelif age >= 65:\n    print("senior")\nelse:\n    print("child")',
      ['adult', 'senior', 'adult\nsenior', 'child'],
      'age >= 18 is checked first and is True, so "senior" can never be reached in this order.'
    ),
    // No else
    q(
      'x = 3\nif x > 5:\n    print("big")\nelif x > 4:\n    print("medium")',
      ['Nothing', 'big', 'medium', 'Error'],
      'Both tests are False and there is no else, so no branch runs.'
    ),
    // Separate ifs vs one chain
    q(
      'x = 15\nif x > 10:\n    print("A")\nif x > 5:\n    print("B")',
      ['A\nB', 'A', 'B', 'Nothing'],
      'These are two separate if statements, not one chain. Each one is checked on its own.'
    ),
    q(
      'x = 15\nif x > 10:\n    print("A")\nelif x > 5:\n    print("B")',
      ['A', 'A\nB', 'B', 'Nothing'],
      'With elif it is one chain: once "A" runs, the elif is skipped.'
    ),
    q(
      'x = 7\nif x > 10:\n    print("A")\nif x > 5:\n    print("B")\nelse:\n    print("C")',
      ['B', 'C', 'A\nB', 'B\nC'],
      'The first if is False (and has no else). The second if/else is its own chain: 7 > 5, so "B".'
    ),
    // Indentation: what always runs
    q(
      'x = 1\nif x > 5:\n    print("big")\nprint("done")',
      ['done', 'big\ndone', 'Nothing', 'big'],
      'print("done") is not indented, so it is outside the if and always runs.'
    ),
    q(
      'x = 1\nif x > 5:\n    print("big")\n    print("done")',
      ['Nothing', 'done', 'big\ndone', 'big'],
      'Both prints are indented, so both belong to the if. The test is False, so neither runs.'
    ),
    // Conditions with and / or / not
    q(
      'age = 20\nhas_ticket = False\nif age >= 18 and has_ticket:\n    print("enter")\nelse:\n    print("stop")',
      ['stop', 'enter', 'enter\nstop', 'Nothing'],
      'and needs both sides: has_ticket is False, so the whole test is False.'
    ),
    q(
      'day = "Sun"\nif day == "Sat" or day == "Sun":\n    print("weekend")\nelse:\n    print("work")',
      ['weekend', 'work', 'Nothing', 'Error'],
      'The second comparison is True, and or needs just one.'
    ),
    q(
      'name = ""\nif not name:\n    print("no name")\nelse:\n    print("hi", name)',
      ['no name', 'hi', 'hi ', 'Error'],
      'An empty string is falsy, so not name is True.'
    ),
    // Nested if
    q(
      'age = 20\nhas_id = True\nif age >= 18:\n    if has_id:\n        print("enter")\n    else:\n        print("show ID")\nelse:\n    print("too young")',
      ['enter', 'show ID', 'too young', 'enter\nshow ID'],
      'Outer test: 20 >= 18 is True, so go inside. Inner test: has_id is True, so "enter".'
    ),
    q(
      'age = 20\nhas_id = False\nif age >= 18:\n    if has_id:\n        print("enter")\n    else:\n        print("show ID")\nelse:\n    print("too young")',
      ['show ID', 'enter', 'too young', 'Nothing'],
      'The outer test is True, so go inside. The inner test is False, so the inner else runs.'
    ),
    q(
      'age = 15\nhas_id = True\nif age >= 18:\n    if has_id:\n        print("enter")\n    else:\n        print("show ID")\nelse:\n    print("too young")',
      ['too young', 'enter', 'show ID', 'Nothing'],
      'The outer test is False, so the whole inner block is skipped and the outer else runs.'
    ),
    q(
      'x = 8\nif x > 5:\n    print("A")\n    if x > 10:\n        print("B")\n    print("C")\nprint("D")',
      ['A\nC\nD', 'A\nB\nC\nD', 'A\nD', 'D'],
      'Go inside the outer if: print A. Inner test 8 > 10 is False, skip B. C is back at the outer level, so it runs. D is outside everything.'
    ),
    q(
      'x = 3\nif x > 5:\n    print("A")\n    if x > 10:\n        print("B")\n    print("C")\nprint("D")',
      ['D', 'C\nD', 'A\nC\nD', 'Nothing'],
      'The outer test is False, so A, the inner if and C are all skipped. Only D (not indented) runs.'
    ),
    q(
      'raining = True\nhas_umbrella = False\nif raining:\n    if has_umbrella:\n        print("walk")\n    else:\n        print("taxi")\nelse:\n    print("bike")',
      ['taxi', 'walk', 'bike', 'walk\ntaxi'],
      'It is raining, so go inside. No umbrella, so the inner else: "taxi".'
    ),
    q(
      'n = 12\nif n % 2 == 0:\n    if n % 3 == 0:\n        print("even, divisible by 3")\n    else:\n        print("even")\nelse:\n    print("odd")',
      ['even, divisible by 3', 'even', 'odd', 'even\nodd'],
      '12 % 2 is 0, so go inside. 12 % 3 is also 0, so the inner if runs.'
    ),
    q(
      'balance = 500\nprice = 800\nif price <= balance:\n    print("paid")\nelse:\n    if balance > 0:\n        print("not enough money")\n    else:\n        print("empty wallet")',
      ['not enough money', 'paid', 'empty wallet', 'Nothing'],
      '800 <= 500 is False, so go into the outer else. Inside it, 500 > 0 is True.'
    ),
    q(
      'score = 85\nlate = True\nif score >= 50:\n    if late:\n        score -= 10\n    if score >= 80:\n        print("A")\n    elif score >= 60:\n        print("B")\nelse:\n    print("fail")',
      ['B', 'A', 'fail', 'A\nB'],
      'Late, so score drops to 75. Then 75 >= 80 is False and 75 >= 60 is True: "B".'
    ),
    q(
      'x = 5\ny = 10\nif x > 3:\n    if y < 5:\n        print("A")\n    elif y < 20:\n        print("B")\n    else:\n        print("C")\nelse:\n    print("D")',
      ['B', 'A', 'C', 'D'],
      'Outer: 5 > 3 is True. Inner chain: 10 < 5 is False, 10 < 20 is True: "B".'
    )
  ]
}

export default pathFinder
