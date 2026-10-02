import type { ContentTranslation } from '@/models/translation.model'
import day1 from './lessons/day1.lesson'
import day2 from './lessons/day2.lesson'
import day3 from './lessons/day3.lesson'
import dsDay1 from './lessons/dataScience/day01WhatIsDataScience.lesson'
import dsDay2 from './lessons/dataScience/day02DataStatistics.lesson'
import dsDay3 from './lessons/dataScience/day03ThinkingWithData.lesson'
import dsStats3 from './lessons/dataScience/day04StatsNumerical.lesson'
import dsStats4 from './lessons/dataScience/day05StatsProbability.lesson'
import dsStats5 from './lessons/dataScience/day06StatsDiscrete.lesson'
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
import operatorChallenge from './games/operatorChallenge.game'
import trueOrFalse from './games/trueOrFalse.game'
import pathFinder from './games/pathFinder.game'
import flowTracer from './games/flowTracer.game'
import loopRunner from './games/loopRunner.game'
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
        'Day 1–6: သီအိုရီ နှင့် စာရင်းအင်း (data၊ graph၊ ဂဏန်း အနှစ်ချုပ်၊ probability နှင့် distribution)။ Day 7–13: Python၊ NumPy၊ pandas နှင့် chart များ၊ နောက်ဆုံးမှာ လက်တွေ့ analysis project တစ်ခုဖြင့် အဆုံးသတ်မည်။',
      labelPrefix: 'Day'
    }
  },
  lessons: {
    'day-1': day1,
    'day-2': day2,
    'day-3': day3,
    'ds-1': dsDay1,
    'ds-2': dsDay2,
    'ds-3': dsDay3,
    'ds-stats-3': dsStats3,
    'ds-stats-4': dsStats4,
    'ds-stats-5': dsStats5,
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
    'operator-challenge': operatorChallenge,
    'true-or-false': trueOrFalse,
    'path-finder': pathFinder,
    'flow-tracer': flowTracer,
    'loop-runner': loopRunner,
    'case-match': caseMatch,
    'stats-intuition': statsIntuition,
    'correlation-causation': correlationCausation,
    'pandas-predict': pandasPredict,
    'data-detective': dataDetective,
    'chart-picker': chartPicker
  }
}

export default myanmar
