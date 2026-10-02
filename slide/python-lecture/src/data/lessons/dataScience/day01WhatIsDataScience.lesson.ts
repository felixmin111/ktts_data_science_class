import type { Lesson } from '@/models/lesson.model'
import { py } from '../py'

const day1: Lesson = {
  id: 'ds-1',
  track: 'data-science',
  day: 1,
  title: 'What is data science?',
  summary:
    'The theory behind the field: from raw data to wisdom, the four kinds of analytics, the project lifecycle, real case studies, roles and ethics.',
  durationMinutes: 60,
  topics: ['Theory', 'DIKW pyramid', '4 types of analytics', 'Lifecycle', 'Case studies', 'Ethics'],
  available: true,
  sections: [
    {
      id: 'definition',
      eyebrow: 'Theory',
      title: 'Data science = three skills overlapping',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'Data science is the practice of using **data** to answer questions and make **better decisions**. It sits where three skills overlap — and you need all three:'
          ]
        },
        {
          type: 'table',
          columns: ['Skill', 'What it gives you', 'Missing it looks like…'],
          rows: [
            [
              'Maths & statistics',
              'Knowing if a pattern is real or just chance',
              'Celebrating a “trend” that is random noise'
            ],
            [
              'Programming',
              'Handling thousands or millions of rows quickly',
              'Copy-pasting in Excel for a week'
            ],
            [
              'Domain knowledge',
              'Asking the right question and knowing what is plausible',
              'A perfect model that answers a useless question'
            ]
          ]
        },
        {
          type: 'analogy',
          title: 'The doctor',
          body: 'A doctor combines medical knowledge (domain), test results (data) and proven methods for reading them (statistics). Lab results alone don’t cure anyone — the diagnosis and the treatment decision do. Data scientists are doctors for organisations.'
        }
      ],
      notes:
        'Ask her which domain SHE knows well (health, retail, education…). Data science is most powerful in a domain you already understand — that is her advantage.'
    },
    {
      id: 'dikw',
      eyebrow: 'Theory',
      title: 'From data to wisdom: the DIKW pyramid',
      minutes: 7,
      blocks: [
        {
          type: 'text',
          body: [
            'Raw data is not useful by itself. Each level up the pyramid adds **context** and **meaning**, until it supports an action.'
          ]
        },
        {
          type: 'table',
          columns: ['Level', 'Meaning', 'Café example'],
          rows: [
            ['Data', 'Raw facts, no context', '“1043, 2026-01-17, Latte, 2”'],
            ['Information', 'Data organised and summarised', '“We sold 96 lattes in Q1”'],
            [
              'Knowledge',
              'Patterns and explanations',
              '“Latte sales peak at Downtown on weekends”'
            ],
            [
              'Wisdom',
              'A decision based on knowledge',
              '“Schedule an extra barista at Downtown on Sundays”'
            ]
          ]
        },
        {
          type: 'analogy',
          title: 'Weather',
          body: '“32 °C, 80% humidity” is data. “It is hot and humid today” is information. “Hot, humid afternoons here usually end in storms” is knowledge. “Take an umbrella” is wisdom.'
        }
      ]
    },
    {
      id: 'analytics-types',
      eyebrow: 'Theory',
      title: 'Four questions, four kinds of analytics',
      minutes: 9,
      blocks: [
        {
          type: 'table',
          columns: ['Type', 'Question', 'Real-world example', 'Difficulty'],
          rows: [
            ['Descriptive', 'What happened?', 'A monthly sales report', '★'],
            [
              'Diagnostic',
              'Why did it happen?',
              'Sales dropped because a competitor opened next door',
              '★★'
            ],
            ['Predictive', 'What will happen?', 'A weather forecast; next week’s demand', '★★★'],
            ['Prescriptive', 'What should we do?', 'A maps app choosing your fastest route', '★★★★']
          ]
        },
        {
          type: 'analogy',
          title: 'A visit to the doctor',
          body: 'Describe the symptoms (descriptive), find the cause (diagnostic), give a prognosis (predictive) and write the prescription (prescriptive). Each step needs the one before it.'
        },
        {
          type: 'code',
          runnable: true,
          title: 'Descriptive analytics in three lines (you will write this on Day 10)',
          code: py`
import pandas as pd

df = pd.read_csv("cafe_sales.csv")
df["revenue"] = df["quantity"] * df["unit_price"]
print(df.groupby("branch")["revenue"].sum())   # "What happened?"
`
        },
        {
          type: 'quiz',
          question: '“Our model says 30% of customers will cancel next month.” Which type is this?',
          options: ['Descriptive', 'Diagnostic', 'Predictive', 'Prescriptive'],
          answer: 2,
          explanation:
            'It estimates the future — predictive. “Send them a discount” would be prescriptive.'
        }
      ]
    },
    {
      id: 'lifecycle',
      eyebrow: 'Theory',
      title: 'The data science lifecycle',
      minutes: 8,
      blocks: [
        {
          type: 'table',
          columns: ['Step', 'Question it answers', 'In this course'],
          rows: [
            ['1. Ask', 'What decision are we trying to make?', 'Days 1–6 (theory and statistics)'],
            ['2. Collect', 'Where is the data?', 'CSV files, pd.read_csv() — Day 10'],
            ['3. Clean', 'Is the data trustworthy?', 'pandas cleaning — Day 11'],
            ['4. Explore', 'What patterns exist?', 'NumPy, pandas, groupby — Days 9–11'],
            ['5. Visualize', 'How do we see it?', 'matplotlib — Day 12'],
            ['6. Communicate', 'What should we do?', 'A short report — Day 13']
          ]
        },
        {
          type: 'analogy',
          title: 'The detective',
          body: 'A detective doesn’t collect every fingerprint in the city. They start with a question (“who took the cake?”), gather the relevant clues, throw away misleading ones, find the pattern and present the case. Then a new question starts the loop again.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Where the time really goes',
          body: 'Practitioners often say most of a project’s time goes into collecting and cleaning data, not building models. Clean data with a simple method usually beats messy data with a clever one.'
        }
      ]
    },
    {
      id: 'case-studies',
      eyebrow: 'Real world',
      title: 'Data science in the real world',
      minutes: 12,
      blocks: [
        {
          type: 'case',
          domain: 'Streaming & e-commerce',
          title: '“Because you watched…” recommendations',
          problem:
            'Thousands of titles or products; each customer only sees a handful on the home screen.',
          data: 'What each person watched, bought, rated, skipped or searched for.',
          method:
            'Recommendation systems: find people with similar behaviour and suggest what they liked.',
          outcome: 'Customers find things they enjoy faster, so they stay and buy more.'
        },
        {
          type: 'case',
          domain: 'Ride-hailing & delivery',
          title: 'Dynamic pricing and arrival times',
          problem: 'Demand jumps when it rains or offices close; drivers are in the wrong places.',
          data: 'Live GPS of drivers, ride requests per area, time of day, weather, traffic.',
          method: 'Time-series forecasting of demand per area + regression to predict travel time.',
          outcome:
            'Prices rise where demand outstrips drivers, pulling drivers there; ETAs become accurate.'
        },
        {
          type: 'case',
          domain: 'Banks',
          title: 'Catching card fraud in milliseconds',
          problem:
            'A tiny fraction of transactions are fraudulent, but each one costs money and trust.',
          data: 'Amount, location, merchant, time and the customer’s normal spending pattern.',
          method: 'Anomaly detection and classification: “does this look unlike this customer?”',
          outcome: 'Suspicious payments are blocked or verified by SMS before the money leaves.'
        },
        {
          type: 'case',
          domain: 'Hospitals',
          title: 'Who needs a follow-up call?',
          problem:
            'Some patients return to hospital soon after discharge; nurses can’t call everyone.',
          data: 'Diagnosis, age, previous admissions, medicines, length of stay.',
          method: 'Classification: estimate each patient’s risk of readmission.',
          outcome:
            'Nurses call the highest-risk patients first — the same staff time helps more people.'
        },
        {
          type: 'case',
          domain: 'Agriculture',
          title: 'Forecasting the harvest',
          problem: 'Farmers and governments must plan storage, prices and imports before harvest.',
          data: 'Rainfall, temperature, soil type, satellite images of fields, past yields.',
          method: 'Regression: predict tons per hectare from the conditions this season.',
          outcome:
            'Earlier, better planning — and early warning when a region is heading for a bad year.'
        }
      ],
      notes:
        'For each case, ask her to name ONE more piece of data that could improve it. Then ask: which of the four analytics types is each case? (Mostly predictive/prescriptive.)'
    },
    {
      id: 'roles',
      eyebrow: 'Careers',
      title: 'Who does what in a data team?',
      minutes: 7,
      blocks: [
        {
          type: 'table',
          columns: ['Role', 'Main job', 'Typical tools', 'Café example'],
          rows: [
            [
              'Data analyst',
              'Reports and dashboards: what happened?',
              'SQL, Excel, pandas, BI tools',
              'Monthly sales dashboard'
            ],
            [
              'Data scientist',
              'Experiments and models: why, and what next?',
              'Python, statistics, machine learning',
              'Predict tomorrow’s demand per item'
            ],
            [
              'Data engineer',
              'Pipelines that move and store data reliably',
              'SQL, cloud, Airflow, Spark',
              'Send every till’s sales to one database nightly'
            ],
            [
              'ML engineer',
              'Put models into real products',
              'Python, APIs, cloud',
              'Show the demand forecast in the manager’s app'
            ]
          ]
        },
        {
          type: 'callout',
          tone: 'success',
          title: 'Your path',
          body: 'Most people start as a data analyst: Python + pandas + charts + clear communication — exactly Days 7–13 of this course.'
        }
      ]
    },
    {
      id: 'ethics',
      eyebrow: 'Theory',
      title: 'Ethics: data is about people',
      minutes: 6,
      blocks: [
        {
          type: 'table',
          columns: ['Principle', 'Question to ask', 'Example of getting it wrong'],
          rows: [
            [
              'Privacy',
              'Do we need personal details at all?',
              'Publishing “anonymous” data that can be re-identified'
            ],
            [
              'Consent',
              'Did people agree to this use?',
              'Using customer photos to train a model without asking'
            ],
            [
              'Fairness',
              'Does it treat groups differently?',
              'A model copying past discrimination in its training data'
            ],
            [
              'Transparency',
              'Can we explain a decision?',
              'A loan refused with no reason anyone can give'
            ]
          ]
        },
        {
          type: 'case',
          domain: 'Hiring',
          title: 'A model that learned old bias',
          problem: 'A large tech company wanted to rank job applicants’ CVs automatically.',
          data: 'CVs of people hired over the previous ten years — mostly men.',
          method: 'A model trained to recognise “CVs like the ones we hired before”.',
          outcome:
            'It reportedly learned to downgrade CVs mentioning women’s activities, and the company dropped the tool (reported in 2018).'
        },
        {
          type: 'analogy',
          title: 'A mirror',
          body: 'A model is a mirror of its training data. If the past was unfair, the mirror reflects that unfairness — faster and at scale.'
        }
      ]
    },
    {
      id: 'review',
      eyebrow: 'Review',
      title: 'Check your understanding',
      minutes: 4,
      blocks: [
        {
          type: 'quiz',
          question:
            '“Add a night shift because Downtown sales after 8 pm doubled.” Which DIKW level?',
          options: ['Data', 'Information', 'Knowledge', 'Wisdom'],
          answer: 3,
          explanation: 'It is a decision based on a pattern — wisdom.'
        },
        {
          type: 'quiz',
          question: 'Who builds the pipeline that copies sales from every till into one database?',
          options: ['Data analyst', 'Data scientist', 'Data engineer', 'Designer'],
          answer: 2,
          explanation: 'Moving and storing data reliably is data engineering.'
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Homework',
          body: 'Pick one app you use daily (food delivery, banking, social media). Write: one decision it makes with data, what data it probably uses, which analytics type it is, and one ethical risk.'
        }
      ]
    }
  ]
}

export default day1
