import type { GameDefinition } from '@/models/game.model'
import { action, decision, flowQuestion, skip } from '@/functions/flow.function'

const flowTracer: GameDefinition = {
  id: 'flow-tracer',
  title: 'Flow Tracer',
  tagline: 'Read the flowchart, click the block that runs, then watch the path light up.',
  icon: 'sitemap',
  color: '#6D4BC2',
  track: 'foundations',
  day: 2,
  secondsPerQuestion: 30,
  questionsPerRound: 8,
  bank: [
    // Simple if / else
    flowQuestion(
      'age = 20',
      decision('age >= 18', true, action('print("adult")'), action('print("child")')),
      '20 >= 18 is True, so Python takes the True branch.'
    ),
    flowQuestion(
      'temp = 12',
      decision('temp > 25', false, action('print("hot")'), action('print("not hot")')),
      '12 > 25 is False, so Python takes the False branch: the else block.'
    ),
    // if with no else
    flowQuestion(
      'x = 3',
      decision('x > 5', false, action('print("big")'), skip),
      '3 > 5 is False and there is no else, so nothing runs.'
    ),
    flowQuestion(
      'name = ""',
      decision('name == ""', true, action('print("no name")'), skip),
      'name is the empty string, so name == "" is True.'
    ),
    // if / elif / else ladders
    flowQuestion(
      'score = 72',
      decision(
        'score >= 80',
        false,
        action('print("A")'),
        decision('score >= 60', true, action('print("B")'), action('print("C")'))
      ),
      '72 >= 80 is False, so move right to the next test. 72 >= 60 is True: "B".'
    ),
    flowQuestion(
      'score = 35',
      decision(
        'score >= 80',
        false,
        action('print("A")'),
        decision('score >= 60', false, action('print("B")'), action('print("C")'))
      ),
      'Both tests are False, so the path goes all the way to the else block.'
    ),
    flowQuestion(
      'temp = 25',
      decision(
        'temp > 30',
        false,
        action('print("hot")'),
        decision(
          'temp > 20',
          true,
          action('print("warm")'),
          decision('temp > 10', null, action('print("cool")'), action('print("cold")'))
        )
      ),
      '25 > 20 is the first True test. Python stops there and never checks temp > 10.'
    ),
    flowQuestion(
      'n = 0',
      decision(
        'n > 0',
        false,
        action('print("positive")'),
        decision('n < 0', false, action('print("negative")'), action('print("zero")'))
      ),
      '0 > 0 and 0 < 0 are both False, so the else block runs.'
    ),
    flowQuestion(
      'score = 95',
      decision(
        'score >= 50',
        true,
        action('print("pass")'),
        decision('score >= 90', null, action('print("excellent")'), skip)
      ),
      'Order trap: 95 >= 50 is already True, so the path never reaches score >= 90.'
    ),
    flowQuestion(
      'speed = 45',
      decision(
        'speed > 100',
        false,
        action('print("arrest")'),
        decision(
          'speed > 80',
          false,
          action('print("big fine")'),
          decision('speed > 60', false, action('print("small fine")'), skip)
        )
      ),
      'Every test is False and there is no else at the end, so nothing runs.'
    ),
    // Conditions with and / or / not
    flowQuestion(
      'age = 20\nhas_ticket = False',
      decision(
        'age >= 18 and has_ticket',
        false,
        action('print("enter")'),
        action('print("stop")')
      ),
      'and needs both sides. has_ticket is False, so the whole condition is False.'
    ),
    flowQuestion(
      'day = "Sun"',
      decision(
        'day == "Sat" or day == "Sun"',
        true,
        action('print("weekend")'),
        action('print("work")')
      ),
      'day == "Sun" is True, and or needs only one True side.'
    ),
    // Nested if / else
    flowQuestion(
      'age = 20\nhas_id = False',
      decision(
        'age >= 18',
        true,
        decision('has_id', false, action('print("enter")'), action('print("show ID")')),
        action('print("too young")')
      ),
      'Outer: 20 >= 18 is True, so step inside. Inner: has_id is False: "show ID".'
    ),
    flowQuestion(
      'age = 15\nhas_id = True',
      decision(
        'age >= 18',
        false,
        decision('has_id', null, action('print("enter")'), action('print("show ID")')),
        action('print("too young")')
      ),
      'The outer test is False, so the whole inner if is skipped, even though has_id is True.'
    ),
    flowQuestion(
      'raining = True\nhas_umbrella = False',
      decision(
        'raining',
        true,
        decision('has_umbrella', false, action('print("walk")'), action('print("taxi")')),
        action('print("bike")')
      ),
      'It is raining, so step inside. No umbrella, so the inner else: "taxi".'
    ),
    flowQuestion(
      'n = 9',
      decision(
        'n % 2 == 0',
        false,
        decision('n % 3 == 0', null, action('print("even, /3")'), action('print("even")')),
        decision('n % 3 == 0', true, action('print("odd, /3")'), action('print("odd")'))
      ),
      '9 % 2 is 1, so go right into the outer else. There, 9 % 3 is 0: "odd, /3".'
    ),
    flowQuestion(
      'balance = 500\nprice = 800',
      decision(
        'price <= balance',
        false,
        action('print("paid")'),
        decision('balance > 0', true, action('print("not enough")'), action('print("empty")'))
      ),
      '800 <= 500 is False, then balance > 0 is True: "not enough".'
    ),
    // A ladder inside a nested if
    flowQuestion(
      'x = 5\ny = 10',
      decision(
        'x > 3',
        true,
        decision(
          'y < 5',
          false,
          action('print("A")'),
          decision('y < 20', true, action('print("B")'), action('print("C")'))
        ),
        action('print("D")')
      ),
      'Outer: 5 > 3 is True, step inside. Inner ladder: 10 < 5 is False, 10 < 20 is True: "B".'
    )
  ]
}

export default flowTracer
