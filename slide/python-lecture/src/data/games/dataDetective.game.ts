import type { GameDefinition, GameQuestion } from '@/models/game.model'

const PROBLEMS = [
  'Missing value',
  'Duplicate row',
  'Inconsistent text',
  'Impossible value',
  'Wrong data type'
]

const q = (code: string, answer: string, explanation: string): GameQuestion => ({
  prompt: 'What is wrong with this data?',
  code,
  options: PROBLEMS,
  answer: PROBLEMS.indexOf(answer),
  explanation
})

const dataDetective: GameDefinition = {
  id: 'data-detective',
  title: 'Data Detective',
  tagline: 'Spot what is wrong with the data — and learn the fix.',
  icon: 'broom',
  color: '#2E7550',
  track: 'data-science',
  day: 11,
  secondsPerQuestion: 15,
  questionsPerRound: 10,
  bank: [
    q(
      'order_id,item,quantity\n1012,Thai Tea,1\n1012,Thai Tea,1',
      'Duplicate row',
      'The same order twice. Fix: df.drop_duplicates().'
    ),
    q(
      'item\n" Latte"\nLATTE\nlatte',
      'Inconsistent text',
      'One item, three spellings. Fix: .str.strip().str.title().'
    ),
    q(
      'item,quantity\nCookie,-2',
      'Impossible value',
      'You cannot sell −2 cookies. Check the source, or remove the row.'
    ),
    q(
      'item,unit_price\nMocha,',
      'Missing value',
      'The price is empty. Fix: fill it from the menu with .fillna(...).'
    ),
    q(
      'df["date"].dtype\n# -> object   (values look like "2026-01-05")',
      'Wrong data type',
      'Dates stored as text. Fix: pd.to_datetime(df["date"]).'
    ),
    q(
      'age\n25\ntwenty\n31',
      'Wrong data type',
      'Text in a numeric column. Fix: pd.to_numeric(df["age"], errors="coerce") and review.'
    ),
    q(
      'branch\nDowntown\ndowntown\n"Downtown "',
      'Inconsistent text',
      'Case and spaces differ. Fix: .str.strip().str.title().'
    ),
    q(
      'height_cm\n165\n172\n1700',
      'Impossible value',
      'Nobody is 17 metres tall — probably a typo for 170. Investigate before fixing.'
    ),
    q(
      'email,phone\nneo@mail.com,',
      'Missing value',
      'The phone number is empty. Decide: keep the row, fill “unknown”, or drop.'
    ),
    q(
      'price\n"75 THB"\n"60 THB"',
      'Wrong data type',
      'Numbers stored as text with a unit. Fix: .str.replace(" THB", "").astype(int).'
    ),
    q(
      'customer_id,visit_date\nC7,2026-02-01\nC7,2026-02-01',
      'Duplicate row',
      'Identical rows — likely recorded twice. Fix: drop_duplicates().'
    ),
    q(
      'exam_score  # allowed 0-100\n88\n105',
      'Impossible value',
      'Scores cannot exceed 100. Check the grading record.'
    ),
    q(
      'gender\nF\nFemale\nf',
      'Inconsistent text',
      'One category, three codes. Fix: map them to one value with .replace or .map.'
    ),
    q(
      'rating\n4\nNaN\n5',
      'Missing value',
      'NaN means the value is missing. Check WHY before filling (Day 8).'
    ),
    q(
      'signup_date  # data collected in 2026\n2031-04-02',
      'Impossible value',
      'A date in the future. Probably a typing error — check the source.'
    )
  ]
}

export default dataDetective
