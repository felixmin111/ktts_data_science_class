import type { GameDefinition, GameQuestion } from '@/models/game.model'

const TECHNIQUES = [
  'Classification',
  'Regression',
  'Clustering',
  'Recommendation',
  'Time-series forecasting',
  'Anomaly detection'
]

const q = (prompt: string, answer: string, explanation: string): GameQuestion => ({
  prompt,
  options: TECHNIQUES,
  answer: TECHNIQUES.indexOf(answer),
  explanation
})

const caseMatch: GameDefinition = {
  id: 'case-match',
  title: 'Real-World Case Match',
  tagline: 'A real business problem — which data science technique solves it?',
  icon: 'briefcase-search-outline',
  color: '#7B5EA7',
  track: 'data-science',
  day: 3,
  secondsPerQuestion: 20,
  questionsPerRound: 10,
  bank: [
    q(
      'A bank wants to stop card payments that look unlike the customer’s usual spending.',
      'Anomaly detection',
      'Find the rare, unusual transactions among millions of normal ones.'
    ),
    q(
      'An email service sorts messages into “spam” or “not spam”.',
      'Classification',
      'Two labelled categories — classic classification.'
    ),
    q(
      'A property website estimates the selling price of a house.',
      'Regression',
      'The answer is a number (a price).'
    ),
    q(
      'A supermarket wants to discover natural groups of shoppers, with no labels given.',
      'Clustering',
      'Grouping similar customers without predefined labels.'
    ),
    q(
      'A streaming app shows “Because you watched…” rows.',
      'Recommendation',
      'Suggest items based on the behaviour of similar users.'
    ),
    q(
      'A power company predicts electricity demand for each hour of next week.',
      'Time-series forecasting',
      'Future values of a series measured over time.'
    ),
    q(
      'A hospital estimates whether each patient will be readmitted within 30 days (yes/no).',
      'Classification',
      'A yes/no outcome per patient.'
    ),
    q(
      'A delivery app predicts how many minutes your food will take to arrive.',
      'Regression',
      'The answer is a quantity: minutes.'
    ),
    q(
      'A ride-hailing company forecasts how many ride requests each area will get in the next hour.',
      'Time-series forecasting',
      'Demand over time, per area.'
    ),
    q(
      'A factory camera labels each product photo as “OK” or “defective”.',
      'Classification',
      'Each image goes into one of two categories.'
    ),
    q(
      'A news site groups thousands of unlabelled articles by topic.',
      'Clustering',
      'Similar articles grouped without labels.'
    ),
    q(
      'An online shop shows “Customers who bought this also bought…”.',
      'Recommendation',
      'Items liked together by many customers.'
    ),
    q(
      'An IT team watches for unusual spikes in network traffic that could be an attack.',
      'Anomaly detection',
      'Rare deviations from normal patterns.'
    ),
    q(
      'A ministry predicts rice yield in tons per hectare from rainfall and temperature.',
      'Regression',
      'Predicting a continuous number from conditions.'
    )
  ]
}

export default caseMatch
