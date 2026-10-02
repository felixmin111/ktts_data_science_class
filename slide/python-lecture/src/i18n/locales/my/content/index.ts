import type { ContentTranslation } from '@/models/translation.model'
import day1 from './lessons/day1.lesson'
import dsDay1 from './lessons/dataScience/day01WhatIsDataScience.lesson'
import dsDay2 from './lessons/dataScience/day02DataStatistics.lesson'
import dsDay3 from './lessons/dataScience/day03ThinkingWithData.lesson'
import dsDay4 from './lessons/dataScience/day04Collections.lesson'
import dsDay5 from './lessons/dataScience/day05LoopsFunctions.lesson'
import dsDay6 from './lessons/dataScience/day06Numpy.lesson'
import dsDay7 from './lessons/dataScience/day07Pandas.lesson'
import dsDay8 from './lessons/dataScience/day08CleanGroup.lesson'
import dsDay9 from './lessons/dataScience/day09Visualization.lesson'
import dsDay10 from './lessons/dataScience/day10Project.lesson'
import typeDetective from './games/typeDetective.game'
import predictOutput from './games/predictOutput.game'
import bugHunter from './games/bugHunter.game'
import caseMatch from './games/caseMatch.game'
import statsIntuition from './games/statsIntuition.game'
import correlationCausation from './games/correlationCausation.game'
import pandasPredict from './games/pandasPredict.game'
import dataDetective from './games/dataDetective.game'
import chartPicker from './games/chartPicker.game'

const myanmar: ContentTranslation = {
  tracks: {
    foundations: {
      title: 'Python အခြေခံ',
      description:
        'Python ဘယ်လို တွေးလဲ: value များ၊ နာမည်များ၊ type များ နှင့် user နှင့် စကားပြောခြင်း။',
      labelPrefix: 'Day'
    },
    'data-science': {
      title: 'Data Science အတွက် Python',
      description:
        'Day 1–3: သီအိုရီ နှင့် လက်တွေ့ ဖြစ်ရပ်များ။ Day 4–10: Python၊ NumPy၊ pandas နှင့် chart များ၊ နောက်ဆုံးမှာ လက်တွေ့ analysis project တစ်ခုဖြင့် အဆုံးသတ်မည်။',
      labelPrefix: 'Day'
    }
  },
  lessons: {
    'day-1': day1,
    'day-2': {
      title: 'ဂဏန်းများ၊ operator များ နှင့် ဂဏန်းပေါင်းစက်',
      summary: 'မကြာမီ လာမည်။',
      topics: ['Type ပြောင်းခြင်း', 'Operator များ', 'ဂဏန်းပေါင်းစက်']
    },
    'ds-1': dsDay1,
    'ds-2': dsDay2,
    'ds-3': dsDay3,
    'ds-4': dsDay4,
    'ds-5': dsDay5,
    'ds-6': dsDay6,
    'ds-7': dsDay7,
    'ds-8': dsDay8,
    'ds-9': dsDay9,
    'ds-10': dsDay10
  },
  games: {
    'type-detective': typeDetective,
    'predict-output': predictOutput,
    'bug-hunter': bugHunter,
    'case-match': caseMatch,
    'stats-intuition': statsIntuition,
    'correlation-causation': correlationCausation,
    'pandas-predict': pandasPredict,
    'data-detective': dataDetective,
    'chart-picker': chartPicker
  }
}

export default myanmar
