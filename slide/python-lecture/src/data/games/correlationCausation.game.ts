import type { GameDefinition, GameQuestion } from '@/models/game.model'

const STORIES = ['Causation', 'Reverse causation', 'Hidden third factor', 'Coincidence']

const q = (prompt: string, answer: string, explanation: string): GameQuestion => ({
  prompt,
  options: STORIES,
  answer: STORIES.indexOf(answer),
  explanation
})

const correlationCausation: GameDefinition = {
  id: 'correlation-causation',
  title: 'Correlation or Causation?',
  tagline: 'Read the headline. Which story best explains it?',
  icon: 'link-variant',
  color: '#B03A1E',
  track: 'data-science',
  day: 3,
  secondsPerQuestion: 20,
  questionsPerRound: 10,
  bank: [
    q(
      'Ice-cream sales and drownings rise and fall together.',
      'Hidden third factor',
      'Hot weather drives both.'
    ),
    q(
      'The more firefighters sent to a fire, the more damage it causes.',
      'Hidden third factor',
      'Bigger fires need more firefighters AND cause more damage.'
    ),
    q(
      'In a large randomised trial, the vaccinated group had far fewer infections.',
      'Causation',
      'Random assignment balances hidden factors, so the vaccine is the difference.'
    ),
    q(
      'Countries that eat more chocolate win more Nobel prizes.',
      'Hidden third factor',
      'Wealthier countries tend to have both more chocolate and more research funding.'
    ),
    q(
      'Students who use tutoring have lower grades than those who don’t.',
      'Reverse causation',
      'Struggling students are the ones who seek tutoring.'
    ),
    q(
      'The number of films one actor appeared in each year tracks pool drownings that year.',
      'Coincidence',
      'With enough data series, some will match by pure chance.'
    ),
    q(
      'Children with bigger shoe sizes read better.',
      'Hidden third factor',
      'Older children have bigger feet and read better — age drives both.'
    ),
    q(
      'People who sleep with their shoes on more often wake up with a headache.',
      'Hidden third factor',
      'Going to bed drunk causes both.'
    ),
    q(
      'A/B test with 50,000 random visitors: the new checkout button sold 12% more.',
      'Causation',
      'A large randomised experiment isolates the effect of the button.'
    ),
    q(
      'Cities with more police officers have more crime.',
      'Reverse causation',
      'High crime leads cities to hire more police (city size also plays a part).'
    ),
    q(
      'Your team won all 4 matches in which you wore your lucky socks.',
      'Coincidence',
      'Four matches is far too few to separate luck from any real effect.'
    ),
    q(
      'People who carry a lighter are more likely to get lung cancer.',
      'Hidden third factor',
      'Smokers carry lighters, and smoking causes the cancer.'
    ),
    q(
      'Patients who take painkillers report more pain than those who don’t.',
      'Reverse causation',
      'Being in pain is why people take painkillers.'
    ),
    q(
      'On rainy days, shops sell more umbrellas.',
      'Causation',
      'The rain makes people buy umbrellas — the direction is obvious and the mechanism is clear.'
    ),
    q(
      'Countries with more TVs per person have longer life expectancy.',
      'Hidden third factor',
      'National wealth brings both TVs and better healthcare.'
    )
  ]
}

export default correlationCausation
