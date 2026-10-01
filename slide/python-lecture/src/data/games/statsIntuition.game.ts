import type { GameDefinition } from '@/models/game.model'

const statsIntuition: GameDefinition = {
  id: 'stats-intuition',
  title: 'Statistics Intuition',
  tagline: 'Mean, median, spread and outliers — answer by feel, then by maths.',
  icon: 'sigma',
  color: '#2A62A6',
  track: 'data-science',
  day: 2,
  secondsPerQuestion: 20,
  questionsPerRound: 10,
  bank: [
    {
      prompt: 'What is the median?',
      code: '[3, 9, 1, 7, 5]',
      options: ['5', '7', '9', '3'],
      answer: 0,
      explanation: 'Sorted: 1, 3, 5, 7, 9 — the middle value is 5.'
    },
    {
      prompt: 'What is the median?',
      code: '[1, 3, 7, 9]',
      options: ['5', '3', '7', '4'],
      answer: 0,
      explanation: 'With an even count, average the two middle values: (3 + 7) / 2 = 5.'
    },
    {
      prompt: 'Which number best describes a TYPICAL value here?',
      code: '[2, 4, 6, 8, 100]',
      options: ['Median = 6', 'Mean = 24', 'Max = 100', 'Range = 98'],
      answer: 0,
      explanation: 'The outlier 100 drags the mean up to 24; the median (6) stays typical.'
    },
    {
      prompt: 'What is the mean?',
      code: '[10, 20, 30]',
      options: ['20', '30', '60', '10'],
      answer: 0,
      explanation: '(10 + 20 + 30) / 3 = 20.'
    },
    {
      prompt: 'Which dataset has the larger standard deviation?',
      code: 'A = [50, 50, 50, 50]\nB = [20, 80, 40, 60]',
      options: ['B', 'A', 'They are equal', 'Cannot tell'],
      answer: 0,
      explanation: 'Both have mean 50, but B’s values are far from 50 while A’s are exactly 50.'
    },
    {
      prompt: 'What is the standard deviation?',
      code: '[7, 7, 7, 7]',
      options: ['0', '7', '1', '28'],
      answer: 0,
      explanation: 'Every value equals the mean, so there is no spread at all.'
    },
    {
      prompt: 'What is the mode?',
      code: '["QR", "Cash", "QR", "Card", "QR"]',
      options: ['QR', 'Cash', 'Card', 'There is none'],
      answer: 0,
      explanation: 'QR appears most often (3 times). The mode works for categories too.'
    },
    {
      prompt: 'You add 10 to every value. The standard deviation…',
      options: ['Stays the same', 'Increases by 10', 'Doubles', 'Becomes 10'],
      answer: 0,
      explanation:
        'Shifting everything moves the mean too; the distances from the mean do not change.'
    },
    {
      prompt: 'You multiply every value by 2. The standard deviation…',
      options: ['Doubles', 'Stays the same', 'Is squared', 'Halves'],
      answer: 0,
      explanation: 'Every distance from the mean doubles, so the std doubles.'
    },
    {
      prompt: 'Mean = 70, median = 50. The data is probably…',
      options: [
        'Right-skewed (long tail of big values)',
        'Left-skewed',
        'Perfectly symmetric',
        'Uniform'
      ],
      answer: 0,
      explanation: 'A few large values pull the mean above the median: a right tail.'
    },
    {
      prompt: 'Normal data, mean 100, std 15. About what share is ABOVE 130?',
      options: ['2.5%', '5%', '16%', '32%'],
      answer: 0,
      explanation:
        '130 is +2 std. 95% lies within ±2 std, leaving 5% outside — half of it (2.5%) above.'
    },
    {
      prompt: 'What is the range?',
      code: '[4, 15, 8, 1]',
      options: ['14', '15', '11', '7'],
      answer: 0,
      explanation: 'Range = max − min = 15 − 1 = 14.'
    },
    {
      prompt: 'Q1 = 20 and Q3 = 40. With the 1.5 × IQR rule, which value is an outlier?',
      options: ['75', '65', '-5', '35'],
      answer: 0,
      explanation: 'IQR = 20, so the fences are 20 − 30 = −10 and 40 + 30 = 70. Only 75 is outside.'
    },
    {
      prompt: 'One CEO salary of 1,000,000 joins 100 normal salaries. What changes most?',
      options: ['The mean', 'The median', 'The mode', 'Nothing changes'],
      answer: 0,
      explanation: 'The mean uses every value’s size; the median and mode barely move.'
    },
    {
      prompt: 'Which summary makes sense for a nominal column like “branch”?',
      options: ['Mode', 'Mean', 'Standard deviation', 'Median'],
      answer: 0,
      explanation: 'Names have no order or size — you can only count them, so use the mode.'
    },
    {
      prompt: 'The mean of 4 numbers is 10. Three of them are 8, 9 and 13. The fourth is…',
      options: ['10', '30', '40', '12'],
      answer: 0,
      explanation: 'The total must be 4 × 10 = 40; 40 − (8 + 9 + 13) = 10.'
    }
  ]
}

export default statsIntuition
