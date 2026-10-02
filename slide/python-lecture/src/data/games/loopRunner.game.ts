import type { GameDefinition } from '@/models/game.model'
import {
  assign,
  augment,
  forEach,
  forRange,
  loopProgram,
  loopQuestion,
  print,
  when,
  whileLoop
} from '@/functions/loop.function'

const n = (v: unknown) => Number(v)

const loopRunner: GameDefinition = {
  id: 'loop-runner',
  title: 'Loop Runner',
  tagline: 'Read the loop diagram, predict the result, then watch every pass run live.',
  icon: 'refresh',
  color: '#1F7A8C',
  track: 'foundations',
  day: 3,
  secondsPerQuestion: 30,
  questionsPerRound: 8,
  bank: [
    // while loops
    loopQuestion(
      loopProgram(
        [assign('i', 1)],
        whileLoop('i <= 3', (v) => n(v.i) <= 3),
        [print('i', (v) => String(v.i)), augment('i', '+=', '1', () => 1)]
      ),
      'output',
      ['1\n2\n3\n4', '0\n1\n2', '1\n2'],
      'i starts at 1. Each pass prints i, then adds 1. When i becomes 4, 4 <= 3 is False and the loop stops.'
    ),
    loopQuestion(
      loopProgram(
        [assign('i', 0)],
        whileLoop('i < 3', (v) => n(v.i) < 3),
        [augment('i', '+=', '1', () => 1), print('i', (v) => String(v.i))]
      ),
      'output',
      ['0\n1\n2', '1\n2', '0\n1\n2\n3'],
      'Here i grows before it is printed, so the first print shows 1 and the last shows 3.'
    ),
    loopQuestion(
      loopProgram(
        [assign('n', 10)],
        whileLoop('n > 0', (v) => n(v.n) > 0),
        [augment('n', '-=', '3', () => 3)]
      ),
      'passes',
      ['3', '10', '5'],
      'n goes 10 → 7 → 4 → 1 → -2. That is 4 passes; then -2 > 0 is False.'
    ),
    loopQuestion(
      loopProgram(
        [assign('n', 10)],
        whileLoop('n > 0', (v) => n(v.n) > 0),
        [augment('n', '-=', '3', () => 3)]
      ),
      { variable: 'n' },
      ['0', '1', '-3'],
      'The loop only checks n > 0 at the top. From 1 it subtracts 3 once more, so n ends at -2.'
    ),
    loopQuestion(
      loopProgram(
        [assign('i', 5)],
        whileLoop('i < 3', (v) => n(v.i) < 3),
        [print('i', (v) => String(v.i)), augment('i', '+=', '1', () => 1)]
      ),
      'output',
      ['5', '5\n6\n7', 'Error'],
      '5 < 3 is False the very first time, so the body never runs and nothing is printed.'
    ),
    loopQuestion(
      loopProgram(
        [assign('x', 1)],
        whileLoop('x < 50', (v) => n(v.x) < 50),
        [augment('x', '*=', '2', () => 2)]
      ),
      { variable: 'x' },
      ['50', '32', '128'],
      'x doubles: 1, 2, 4, 8, 16, 32, 64. 32 < 50 is still True, so it doubles once more to 64.'
    ),
    loopQuestion(
      loopProgram(
        [assign('n', 0)],
        whileLoop('True', () => true),
        [augment('n', '+=', '1', () => 1), when('n == 3', (v) => n(v.n) === 3, 'break')]
      ),
      { variable: 'n' },
      ['2', '4', 'The loop never ends'],
      'while True would run forever, but break leaves the loop as soon as n reaches 3.'
    ),
    // for loops and range
    loopQuestion(
      loopProgram([], forRange('i', 3), [print('i', (v) => String(v.i))]),
      'output',
      ['1\n2\n3', '0\n1\n2\n3', '3'],
      'range(3) means 0, 1, 2: it starts at 0 and stops before 3.'
    ),
    loopQuestion(
      loopProgram([], forRange('i', 1, 5), [print('i', (v) => String(v.i))]),
      'output',
      ['1\n2\n3\n4\n5', '0\n1\n2\n3\n4', '2\n3\n4\n5'],
      'range(1, 5) starts at 1 and stops before 5: 1, 2, 3, 4.'
    ),
    loopQuestion(
      loopProgram([], forRange('i', 2, 10, 3), [print('i', (v) => String(v.i))]),
      'output',
      ['2\n5\n8\n11', '2\n3\n4', '3\n6\n9'],
      'Start at 2 and add 3 each time: 2, 5, 8. The next value, 11, is not below 10.'
    ),
    loopQuestion(
      loopProgram(
        [],
        forRange('i', 3, 0, -1),
        [print('i', (v) => String(v.i))],
        [print('"Go!"', () => 'Go!')]
      ),
      'output',
      ['3\n2\n1\n0\nGo!', '1\n2\n3\nGo!', '3\nGo!'],
      'A step of -1 counts down: 3, 2, 1. It stops before 0. Go! is after the loop, so it prints once.'
    ),
    loopQuestion(
      loopProgram([], forRange('i', 10, 0, -2), [print('i', (v) => String(v.i))]),
      'passes',
      ['10', '4', '6'],
      'range(10, 0, -2) gives 10, 8, 6, 4, 2: five values, so five passes.'
    ),
    loopQuestion(
      loopProgram([], forEach('ch', '"cat"', ['c', 'a', 't']), [print('ch', (v) => String(v.ch))]),
      'output',
      ['cat', 'c\nat', '"c"\n"a"\n"t"'],
      'A for loop over a string takes one character at a time, and each print starts a new line.'
    ),
    // Counters and totals
    loopQuestion(
      loopProgram([assign('total', 0)], forRange('i', 1, 5), [
        augment('total', '+=', 'i', (v) => n(v.i))
      ]),
      { variable: 'total' },
      ['15', '4', '6'],
      'total collects 1 + 2 + 3 + 4 = 10. range(1, 5) stops before 5.'
    ),
    loopQuestion(
      loopProgram([assign('total', 0)], forRange('i', 2, 9, 2), [
        augment('total', '+=', 'i', (v) => n(v.i))
      ]),
      { variable: 'total' },
      ['30', '12', '36'],
      'range(2, 9, 2) is 2, 4, 6, 8, and 2 + 4 + 6 + 8 = 20.'
    ),
    loopQuestion(
      loopProgram([assign('f', 1)], forRange('i', 1, 5), [augment('f', '*=', 'i', (v) => n(v.i))]),
      { variable: 'f' },
      ['10', '120', '4'],
      'f multiplies 1 × 2 × 3 × 4 = 24. Starting at 1 matters: starting at 0 would give 0.'
    ),
    loopQuestion(
      loopProgram([assign('count', 0)], forEach('ch', '"banana"', ['b', 'a', 'n', 'a', 'n', 'a']), [
        when(
          'ch == "a"',
          (v) => v.ch === 'a',
          augment('count', '+=', '1', () => 1)
        )
      ]),
      { variable: 'count' },
      ['2', '6', '1'],
      'The if is checked on all 6 letters, but count only grows for the three "a"s.'
    ),
    // break and continue
    loopQuestion(
      loopProgram([], forRange('i', 1, 10), [
        when('i % 4 == 0', (v) => n(v.i) % 4 === 0, 'break'),
        print('i', (v) => String(v.i))
      ]),
      'output',
      ['1\n2\n3\n4', '4', '1\n2\n3\n5\n6\n7\n9'],
      'When i is 4, break jumps straight out of the loop, before print. So only 1, 2, 3 are printed.'
    ),
    loopQuestion(
      loopProgram([], forRange('i', 1, 6), [
        when('i % 2 == 0', (v) => n(v.i) % 2 === 0, 'continue'),
        print('i', (v) => String(v.i))
      ]),
      'output',
      ['2\n4', '1\n2\n3\n4\n5', '1\n3'],
      'continue skips the rest of this pass and goes back to the top, so even numbers are never printed.'
    ),
    loopQuestion(
      loopProgram([], forRange('i', 1, 4), [
        print('i', (v) => String(v.i)),
        when(
          'i == 2',
          (v) => n(v.i) === 2,
          print('"two!"', () => 'two!')
        )
      ]),
      'output',
      ['1\ntwo!\n3', '1\n2\n3', 'two!'],
      'Every pass prints i. Only on the pass where i is 2 does the if also print "two!".'
    )
  ]
}

export default loopRunner
