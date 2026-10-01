import type { GameDefinition, GameQuestion } from '@/models/game.model'

const CHARTS = ['Line chart', 'Bar chart', 'Histogram', 'Scatter plot']

const q = (prompt: string, answer: string, explanation: string): GameQuestion => ({
  prompt,
  options: CHARTS,
  answer: CHARTS.indexOf(answer),
  explanation
})

const chartPicker: GameDefinition = {
  id: 'chart-picker',
  title: 'Chart Picker',
  tagline: 'Read the question, choose the right chart.',
  icon: 'chart-bar',
  color: '#C2410C',
  track: 'data-science',
  day: 9,
  secondsPerQuestion: 12,
  questionsPerRound: 10,
  bank: [
    q('How did daily revenue change over March?', 'Line chart', 'Change over time → line.'),
    q('Which of our 3 branches sold the most cups?', 'Bar chart', 'Comparing categories → bar.'),
    q(
      'How are exam scores spread across the class?',
      'Histogram',
      'Distribution of one number → histogram.'
    ),
    q(
      'Do students who sleep more get higher scores?',
      'Scatter plot',
      'Two numbers, do they move together → scatter.'
    ),
    q(
      'What is the trend of website visitors per week this year?',
      'Line chart',
      'A trend over time → line.'
    ),
    q('Which item is the best seller?', 'Bar chart', 'Ranking categories → (sorted) bar.'),
    q(
      'Are most orders small, or are big orders common?',
      'Histogram',
      'How order sizes are distributed → histogram.'
    ),
    q(
      'Is house price related to house size?',
      'Scatter plot',
      'Relationship between two numeric variables → scatter.'
    ),
    q('Compare average salary across 5 departments.', 'Bar chart', 'One value per category → bar.'),
    q(
      'How did the temperature change hour by hour today?',
      'Line chart',
      'Continuous time axis → line.'
    ),
    q('What ages do our customers tend to be?', 'Histogram', 'Distribution of ages → histogram.'),
    q(
      'Do ads with a bigger budget get more clicks?',
      'Scatter plot',
      'Budget vs clicks, two numbers → scatter.'
    ),
    q(
      'Monthly revenue of two branches over a year, on one chart.',
      'Line chart',
      'Two time series → two lines.'
    ),
    q('Number of orders paid by Cash, Card and QR.', 'Bar chart', 'Counts per category → bar.')
  ]
}

export default chartPicker
