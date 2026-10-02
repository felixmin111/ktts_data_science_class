import type { LessonTranslation } from '@/models/translation.model'
import {
  boxSummary,
  fixed,
  mean,
  median,
  percentile,
  round,
  stdev,
  sum
} from '@/functions/stats.function'
import {
  b0,
  b1,
  cov,
  courseGrade,
  dBounds,
  dCounts,
  dMids,
  drinkTimes,
  dtDev,
  dtimeMean,
  dtimeSd,
  dtimeWithin2,
  dtSS,
  fillMean,
  fillSd,
  fillWithin,
  gm,
  gradeParts,
  groupedMean,
  groupedVar,
  incomeBox,
  incomeMean,
  incomeMedian,
  incomes,
  machineA,
  machineB,
  pcts,
  q1m,
  q1s,
  q2m,
  q2s,
  r,
  shoeSizes,
  zA,
  zB
} from '@/data/lessons/dataScience/day04StatsNumerical.lesson'
import {
  deliveryTimes,
  hours,
  quiz1,
  quiz2,
  score
} from '@/data/lessons/dataScience/stats/statsData'

const f2 = (v: number) => fixed(v, 2)
const partMy: Record<string, string> = {
  Homework: 'အိမ်စာ',
  'Midterm exam': 'စာမေးပွဲ (အလယ်)',
  'Final exam': 'စာမေးပွဲ (နောက်ဆုံး)'
}

function percentileRowMy(p: number): string[] {
  const i = (p / 100) * incomes.length
  const whole = Number.isInteger(round(i, 9))
  return [
    `${p} ရာခိုင်နှုန်းမှတ်`,
    `(${p}/100) × ${incomes.length} = ${round(i, 2)}`,
    whole
      ? `ကိန်းပြည့် → နေရာ ${i} နဲ့ ${i + 1} ကို ပျမ်းမျှ`
      : `ကိန်းပြည့် မဟုတ် → နေရာ ${Math.ceil(i)} အထိ အပေါ်ကို round`,
    String(percentile(incomes, p))
  ]
}

const stats3: LessonTranslation = {
  title: 'စာရင်းအင်း ၃: data ကို ဂဏန်းများဖြင့် ဖော်ပြခြင်း',
  summary:
    'Mean၊ median နှင့် mode; range၊ variance နှင့် standard deviation; Empirical Rule နှင့် Chebyshev; z-score; percentile နှင့် box plot; correlation နှင့် least squares line; weighted၊ grouped နှင့် geometric mean များ။',
  topics: [
    'Mean၊ median၊ mode',
    'Variance နှင့် standard deviation',
    'Empirical Rule',
    'z-score',
    'Percentile နှင့် box plot',
    'Correlation',
    'Weighted နှင့် geometric mean'
  ],
  sections: [
    {
      id: 'centre',
      eyebrow: 'အခန်း ၃ · 3.1 ဗဟိုချက်',
      title: 'Data ရဲ့ ဗဟို: mean၊ median နှင့် mode',
      blocks: [
        {
          type: 'text',
          body: [
            'အခန်း ၂ က data ကို table နဲ့ graph တွေနဲ့ ဖော်ပြခဲ့တယ်။ ဒီအခန်းက **ဂဏန်း** တွေနဲ့ ဖော်ပြတယ်။ ပထမ မေးခွန်း: **ဗဟို** က ဘယ်မှာလဲ?',
            '**Mean** (ပျမ်းမျှ): value အားလုံးကို ပေါင်းပြီး အရေအတွက်နဲ့ စား။ Value n ခုရှိတဲ့ sample အတွက် x̄ = Σx ÷ n။ Value N ခုရှိတဲ့ population တစ်ခုလုံးရဲ့ mean ကို μ (မျူး) လို့ ရေးတယ်။ **Sample** ကနေ တွက်တဲ့ ဂဏန်း (x̄ လို) က **statistic**; **population** အတွက် အဲဒီ ဂဏန်းမျိုး (μ လို) က **parameter** ဖြစ်ပြီး sample statistic က သူ့ရဲ့ **point estimate** (တစ်မှတ်တည်း ခန့်မှန်းချက်) ပါ။',
            '**Median**: value တွေကို စီပါ; အလယ်က value က median ပါ (အရေအတွက် စုံရင် အလယ် value နှစ်ခုရဲ့ ပျမ်းမျှ)။ Data ရဲ့ တစ်ဝက်က အောက်မှာ၊ တစ်ဝက်က အပေါ်မှာ။',
            '**Mode**: အကြိမ်ရေ အများဆုံး ပေါ်တဲ့ value။'
          ]
        },
        {
          type: 'table',
          columns: ['အိမ်ထောင်စု', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          rows: [['ဝင်ငွေ (ထောင် THB)', ...incomes.map(String)]]
        },
        {
          type: 'text',
          body: [
            `**Mean:** (18 + 21 + … + 41 + 120) ÷ 12 = ${sum(incomes)} ÷ 12 = **${f2(incomeMean)}** ထောင် THB။`,
            `**Median:** n = 12 က စုံကိန်းမို့ စီထားတဲ့ ၆ ခုမြောက် နဲ့ ၇ ခုမြောက် value ကို ပျမ်းမျှ: (28 + 30) ÷ 2 = **${incomeMedian}** ထောင် THB။`,
            `အိမ်ထောင်စု ၁၁ စုက 41 နဲ့ အောက် ရှာတယ်၊ ဒါပေမဲ့ mean က ${f2(incomeMean)} လို့ ပြောတယ်: 120 ရှာတဲ့ အိမ်ထောင်စု တစ်စုက **mean ကို အပေါ်ဆွဲတင်** တယ်။ Median က 120 ဘယ်လောက် ဝေးလဲ ဂရုမစိုက်လို့ ပုံမှန် အိမ်ထောင်စုကို ပိုကောင်းကောင်း ဖော်ပြတယ်။ ဒါကြောင့် ဝင်ငွေနဲ့ အိမ်ဈေးကို များသောအားဖြင့် **median** နဲ့ ဖော်ပြကြတယ်။`
          ]
        },
        {
          type: 'chart',
          title: 'စမ်းကြည့်ပါ: အချမ်းသာဆုံး အိမ်ထောင်စုကို ရွှေ့ပါ',
          chart: { xLabel: 'လစဉ် ဝင်ငွေ (ထောင် THB)' },
          caption:
            'Slider ကို ဆွဲပါ။ **Mean** (အစက်ချ၊ လိမ္မော်) က ရွေ့နေတဲ့ value နောက် လိုက်တယ်၊ ဒါပေမဲ့ **median** (အစိမ်း) က လုံးဝ မရွေ့ဘူး၊ ဘာကြောင့်လဲဆိုတော့ စီထားတဲ့ စာရင်းရဲ့ အလယ်က မပြောင်းလို့ပါ။ Mean က value တိုင်းရဲ့ အရွယ်ကို သုံးတယ်; median က နေရာကိုပဲ သုံးတယ်။'
        },
        {
          type: 'table',
          columns: ['ရောင်းရတဲ့ ဖိနပ် size', 'အဖြစ်အများဆုံး', 'Mode'],
          rows: [
            [
              shoeSizes.join(', '),
              `40 က ${shoeSizes.filter((v) => v === 40).length} ကြိမ် ပေါ်တယ်`,
              '40'
            ]
          ]
        },
        {
          type: 'chart',
          title: 'ပုံသဏ္ဌာန် သုံးမျိုးအတွက် mean၊ median နှင့် mode',
          chart: {
            charts: [
              { title: 'Symmetric: mean ≈ median ≈ mode' },
              { title: 'ညာဘက် skewed: mode < median < mean' },
              { title: 'ဘယ်ဘက် skewed: mean < median < mode' }
            ]
          },
          caption:
            'Mean ကို **အမြီးရှည်** ဘက်ကို ဆွဲတယ်။ ဒါကြောင့် mean က median ထက် အများကြီး ကြီးရင် data က ညာဘက်ကို skewed; ငယ်ရင် ဘယ်ဘက်ကို skewed။ Mode က qualitative data အတွက် အသုံးဝင်တယ် (လူကြိုက်အများဆုံး ဖိနပ် size ဒါမှမဟုတ် သောက်စရာ)။'
        },
        { type: 'code', title: 'Python နဲ့ mean၊ median နှင့် mode' }
      ]
    },
    {
      id: 'variation',
      eyebrow: 'အခန်း ၃ · 3.2 ပျံ့နှံ့မှု တိုင်းတာချက်',
      title: 'ဘယ်လောက် ပျံ့နေလဲ? Range၊ variance နှင့် standard deviation',
      blocks: [
        {
          type: 'text',
          body: [
            'Data set နှစ်ခုမှာ ဗဟို တူပေမဲ့ ပျံ့နှံ့မှု အလွန် ကွာနိုင်တယ်။ ကော်ဖီစက် နှစ်လုံးလုံး ပျမ်းမျှ 250 ml ပေမဲ့ တစ်လုံးက အများကြီး ပိုတည်ငြိမ်တယ်:'
          ]
        },
        {
          type: 'table',
          columns: ['စက်', 'ဖြည့်ပမာဏ (ml)', 'Mean', 'Range', 'Standard deviation'],
          rows: [
            [
              'A',
              machineA.join(', '),
              String(mean(machineA)),
              String(Math.max(...machineA) - Math.min(...machineA)),
              f2(stdev(machineA))
            ],
            [
              'B',
              machineB.join(', '),
              String(mean(machineB)),
              String(Math.max(...machineB) - Math.min(...machineB)),
              f2(stdev(machineB))
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Mean တူ၊ ပျံ့နှံ့မှု မတူ',
          chart: { charts: [{ title: 'စက် A' }, { title: 'စက် B' }] },
          caption:
            'ဗဟို နှစ်ခုလုံး 250 ml ပါ။ စက် B ရဲ့ ခွက်တွေက 240 ကနေ 258 ml အထိ လွဲတယ် — ဖောက်သည် သတိထားမိမှာပါ။'
        },
        {
          type: 'text',
          body: [
            '**Range** = အကြီးဆုံး − အငယ်ဆုံး။ လွယ်ပေမဲ့ value နှစ်ခုကိုပဲ သုံးတယ်။',
            '**Variance** က value တိုင်းကို သုံးတယ်: value တွေက mean ကနေ ပျမ်းမျှ ဘယ်လောက် ဝေးလဲ၊ **နှစ်ထပ်** ယူပြီး။ Sample အတွက်: s² = Σ(x − x̄)² ÷ (n − 1)။ Population အတွက်: σ² = Σ(x − μ)² ÷ N။ Sample ကို n မဟုတ်ဘဲ **n − 1** နဲ့ စားတာက sample က သူ့ population ထက် နည်းနည်း ပျံ့နှံ့မှု နည်းလေ့ရှိလို့ပါ; n − 1 က အဲဒါကို ပြင်ပေးတယ်။',
            '**Standard deviation** = √variance (sample အတွက် s၊ population အတွက် σ)။ ဒါက **မူလ ယူနစ်** (ml၊ မိနစ်၊ THB) ကို ပြန်ရောက်လို့ များသောအားဖြင့် ဖော်ပြတဲ့ ဂဏန်းပါ။',
            '**တွက်ပြချက်:** barista တစ်ယောက်က သောက်စရာ ၅ ခွက်အတွက် 3၊ 5၊ 6၊ 4 နဲ့ 7 မိနစ် ကြာတယ်။ Mean က 25 ÷ 5 = **5**။'
          ]
        },
        {
          type: 'table',
          columns: ['x (မိနစ်)', 'x − x̄', '(x − x̄)²'],
          rows: [
            ...drinkTimes.map((v, i) => [String(v), String(dtDev[i]), String(dtDev[i]! ** 2)]),
            ['ပေါင်းလဒ်', '0', String(dtSS)]
          ]
        },
        {
          type: 'text',
          body: [
            `s² = ${dtSS} ÷ (5 − 1) = **${f2(dtSS / 4)}**၊ ဒါကြောင့် s = √${f2(dtSS / 4)} = **${f2(Math.sqrt(dtSS / 4))} မိနစ်**။ Deviation တွေကို ပေါင်းရင် အမြဲ 0 ရတယ် (အပေါင်းနဲ့ အနုတ် ချေသွားတယ်)၊ ဒါကြောင့် နှစ်ထပ် ယူတာပါ။`
          ]
        },
        {
          type: 'chart',
          title: 'Mean ကနေ deviation တစ်ခုစီ',
          chart: {
            categories: drinkTimes.map((v, i) => `ခွက် ${i + 1} (${v})`),
            yLabel: 'Deviation နှစ်ထပ် (x − x̄)²'
          },
          caption:
            'ခွက် ၁ နဲ့ ၅ က mean ကနေ ၂ မိနစ် ဝေးလို့ တစ်ခုစီက sum of squares ကို 4 ပေါင်းထည့်တယ်; ခွက် ၂ က mean နဲ့ တူလို့ 0 ပေါင်းတယ်။'
        },
        { type: 'code', title: 'Python နဲ့ variance နှင့် standard deviation' }
      ]
    },
    {
      id: 'empirical-rule',
      eyebrow: 'အခန်း ၃ · 3.2 ပျံ့နှံ့မှု တိုင်းတာချက်',
      title: 'Standard deviation ကို ဖတ်ခြင်း: Empirical Rule နှင့် Chebyshev',
      blocks: [
        {
          type: 'text',
          body: [
            'Population က **normal distribution** (symmetric ခေါင်းလောင်းပုံ) ဖြစ်ရင် **Empirical Rule** အရ value တွေရဲ့ **68.26%** လောက်က μ ± 1σ အတွင်း၊ **95.44%** က μ ± 2σ အတွင်း၊ **99.73%** က μ ± 3σ အတွင်း ရှိတယ်။ Value တစ်ခုချင်းရဲ့ သတ်မှတ် ရာခိုင်နှုန်းကို ပါဝင်တဲ့ ဒီလို interval တွေကို **tolerance interval** လို့ ခေါ်တယ်။',
            `ကျွန်တော်တို့ ဘူးဖြည့်မှု ၂၄ ခု (အခန်း ၁) က အမောက်ပုံ ရှိတယ်။ Sample mean x̄ = **${f2(fillMean)} ml**၊ s = **${f2(fillSd)} ml**။`
          ]
        },
        {
          type: 'chart',
          title: 'ဘူးဖြည့်မှုအတွက် Empirical Rule',
          chart: { xLabel: 'ဖြည့်ပမာဏ (ml)' }
        },
        {
          type: 'table',
          columns: [
            'Interval',
            'နယ်နိမိတ် (ml)',
            'Rule ခန့်မှန်းချက်',
            'ကျွန်တော်တို့ ဖြည့်မှု ၂၄ ခု'
          ],
          rows: [1, 2, 3].map((k) => [
            `x̄ ± ${k}s`,
            `${fixed(fillMean - k * fillSd, 1)} ကနေ ${fixed(fillMean + k * fillSd, 1)}`,
            ['68.26%', '95.44%', '99.73%'][k - 1]!,
            `24 ထဲက ${fillWithin[k - 1]} = ${fixed((fillWithin[k - 1]! / 24) * 100, 0)}%`
          ])
        },
        {
          type: 'text',
          body: [
            '**Chebyshev ရဲ့ Theorem** က ပုံသဏ္ဌာန် **ဘယ်လိုပဲဖြစ်ဖြစ်** အလုပ်ဖြစ်တယ်: value တွေရဲ့ အနည်းဆုံး **1 − 1/k²** က mean ရဲ့ standard deviation k ခု အတွင်း ရှိတယ်။ k = 2 ဆိုရင် အနည်းဆုံး **75%**; k = 3 ဆိုရင် အနည်းဆုံး **88.89%**။ Empirical Rule ထက် အားနည်းပေမဲ့ ဘယ်တော့မှ မမှားဘူး။',
            `**ဥပမာ:** ပို့ဆောင်ချိန် ၅၀ (အခန်း ၂) က skewed ဖြစ်လို့ Empirical Rule မသုံးနိုင်ဘူး။ Mean = ${f2(dtimeMean)}၊ s = ${f2(dtimeSd)} မိနစ်။ Chebyshev က ${fixed(dtimeMean - 2 * dtimeSd, 1)} ကနေ ${fixed(dtimeMean + 2 * dtimeSd, 1)} မိနစ် အတွင်း အနည်းဆုံး 75% ရှိမယ်လို့ ကတိပေးတယ်; တကယ်တော့ 50 ထဲက ${dtimeWithin2} (${round((dtimeWithin2 / 50) * 100, 0)}%) ရှိတယ်။`,
            '**Coefficient of variation** = (s ÷ x̄) × 100%။ ဒါက ပျံ့နှံ့မှုကို **mean နဲ့ နှိုင်းယှဉ်ပြီး** တိုင်းလို့ ယူနစ် မတူရင်တောင် အလုပ်ဖြစ်တယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['Data', 'Mean', 'Standard deviation', 'Coefficient of variation'],
          rows: [
            [
              'ဘူးဖြည့်မှု (ml)',
              f2(fillMean),
              f2(fillSd),
              `${fixed((fillSd / fillMean) * 100, 2)}%`
            ],
            [
              'ပို့ဆောင်ချိန် (မိနစ်)',
              f2(dtimeMean),
              f2(dtimeSd),
              `${fixed((dtimeSd / dtimeMean) * 100, 2)}%`
            ]
          ]
        },
        {
          type: 'chart',
          title: 'နှိုင်းယှဉ် ပျံ့နှံ့မှု: coefficient of variation',
          chart: {
            categories: ['ဘူးဖြည့်မှု', 'ပို့ဆောင်ချိန်'],
            yLabel: 'Coefficient of variation (%)'
          },
          caption:
            'ဘူးဖြည့်မှုက သူ့ mean ရဲ့ ရာခိုင်နှုန်း တစ်ရာပုံ တစ်ပုံလောက်ပဲ ကွဲတယ် — အလွန် တည်ငြိမ်တယ်။ ပို့ဆောင်ချိန်က သူ့ mean ရဲ့ လေးပုံတစ်ပုံလောက် ကွဲတယ် — အများကြီး ခန့်မှန်းရ ခက်တယ်။'
        }
      ]
    },
    {
      id: 'z-scores',
      eyebrow: 'အခန်း ၃ · 3.2 ပျံ့နှံ့မှု တိုင်းတာချက်',
      title: 'z-score: value တစ်ခု ဘယ်လောက် ထူးခြားလဲ?',
      blocks: [
        {
          type: 'text',
          body: [
            '**z-score** က value တစ်ခုက mean ကနေ standard deviation ဘယ်နှခု ဝေးလဲ ပြောတယ်: **z = (x − mean) ÷ standard deviation**။ z = 0 က ပျမ်းမျှ အတိအကျ; z = 2 က standard deviation နှစ်ခု အပေါ်; z = −1 က တစ်ခု အောက်။',
            'z-score က **မတူတဲ့** distribution တွေက value တွေကို နှိုင်းယှဉ်ခွင့်ပေးတယ်။ ကျောင်းသား တစ်ယောက်က **Quiz 1 မှာ 80** နဲ့ **Quiz 2 မှာ 85** ရတယ်။ အတန်းနဲ့ ယှဉ်ရင် ဘယ်ဟာက ပိုကောင်းတဲ့ ရလဒ်လဲ?'
          ]
        },
        {
          type: 'table',
          columns: ['Quiz', 'အမှတ်', 'အတန်း mean', 'အတန်း s', 'z-score'],
          rows: [
            ['Quiz 1', '80', f2(q1m), f2(q1s), `(80 − ${f2(q1m)}) ÷ ${f2(q1s)} = ${f2(zA)}`],
            ['Quiz 2', '85', f2(q2m), f2(q2s), `(85 − ${f2(q2m)}) ÷ ${f2(q2s)} = ${f2(zB)}`]
          ]
        },
        {
          type: 'chart',
          title: 'အမှတ် နှစ်ခုလုံးကို သူ့ mean ကနေ standard deviation အနေနဲ့',
          chart: { yLabel: 'z-score' },
          caption: `Quiz 2 ရဲ့ 85 က ပိုမြင့်ပုံပေါက်ပေမဲ့ z-score က ${f2(zB)}၊ Quiz 1 က ${f2(zA)}။ အတန်းနဲ့ ယှဉ်ရင် ရလဒ် နှစ်ခုက ${Math.abs(zA - zB) < 0.1 ? 'အတူတူနီးပါး ကောင်းတယ်' : zA > zB ? 'Quiz 1 မှာ ပိုကောင်းတယ်' : 'Quiz 2 မှာ ပိုကောင်းတယ်'}။ မူလ အမှတ်က သူ့အုပ်စုရဲ့ mean နဲ့ ပျံ့နှံ့မှု မပါရင် အဓိပ္ပာယ် သိပ်မရှိဘူး။`
        }
      ]
    },
    {
      id: 'percentiles',
      eyebrow: 'အခန်း ၃ · 3.3 Percentile များ',
      title: 'Percentile၊ quartile နှင့် box-and-whiskers display',
      blocks: [
        {
          type: 'text',
          body: [
            '**p ရာခိုင်နှုန်းမှတ် (pth percentile)** ဆိုတာ data ရဲ့ p% က သူ့အောက် ဒါမှမဟုတ် တူ ရှိတဲ့ value ပါ။ Data က skewed ဖြစ် ဒါမှမဟုတ် outlier ရှိရင် percentile တွေက mean နဲ့ standard deviation ထက် data ကို ပိုကောင်းကောင်း ဖော်ပြတယ်။',
            '**စာအုပ်ရဲ့ အဆင့် သုံးဆင့်:** ① value n ခုကို စီ ② i = (p ÷ 100) × n တွက် ③ i က ကိန်းပြည့် **မဟုတ်** ရင် **အပေါ်ကို** round လုပ်: အဲဒီ နေရာက percentile; i က ကိန်းပြည့် **ဖြစ်** ရင် နေရာ i နဲ့ i + 1 က value တွေကို ပျမ်းမျှ။',
            '**Quartile** တွေက data ကို လေးပိုင်း ခွဲတယ်: **Q1** = 25th percentile၊ **Q2** = median၊ **Q3** = 75th percentile။ **Interquartile range** IQR = Q3 − Q1 က data ရဲ့ အလယ် တစ်ဝက်ကို ဖုံးတယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['Percentile', 'i = (p/100)·n', 'စည်းမျဉ်း', 'Value (ထောင် THB)'],
          rows: pcts.map(percentileRowMy)
        },
        {
          type: 'text',
          body: [
            `ဒါကြောင့် Q1 = ${incomeBox.q1}၊ median = ${incomeBox.median}၊ Q3 = ${incomeBox.q3} နဲ့ IQR = ${incomeBox.q3} − ${incomeBox.q1} = **${incomeBox.iqr}**။`,
            `**Box-and-whiskers display:** ① Q1 ကနေ Q3 အထိ box တစ်ခု ဆွဲပြီး median မှာ မျဉ်းတစ်ကြောင်း ② **အတွင်း fence** Q1 − 1.5·IQR = ${incomeBox.innerFences[0]} နဲ့ Q3 + 1.5·IQR = ${incomeBox.innerFences[1]}၊ **အပြင် fence** Q1 − 3·IQR = ${incomeBox.outerFences[0]} နဲ့ Q3 + 3·IQR = ${incomeBox.outerFences[1]} ကို တွက် ③ whisker တွေကို **အတွင်း fence အတွင်းက** အငယ်ဆုံးနဲ့ အကြီးဆုံး value အထိ ဆွဲ ④ အတွင်းနဲ့ အပြင် fence ကြားက value တွေက **mild outlier** (အဝိုင်းဖောက်)၊ အပြင် fence ကျော်တဲ့ value တွေက **extreme outlier** (အဝိုင်းပြည့်)။`
          ]
        },
        {
          type: 'chart',
          title: 'အိမ်ထောင်စု ဝင်ငွေ ၁၂ ခုရဲ့ box plot',
          chart: { xLabel: 'လစဉ် ဝင်ငွေ (ထောင် THB)' },
          caption: `Box က အိမ်ထောင်စုတွေရဲ့ အလယ် တစ်ဝက် (${incomeBox.q1} ကနေ ${incomeBox.q3}) ကို ပြတယ်။ ဝင်ငွေ 120 က အပြင် fence (${incomeBox.outerFences[1]}) ကို ကျော်တယ်: **extreme outlier** ဖြစ်လို့ အစက်ပြည့်နဲ့ ပြထားတယ်။`
        },
        {
          type: 'chart',
          title: 'Quiz 1 နှင့် Quiz 2 ကို box plot နဲ့ နှိုင်းယှဉ်ခြင်း',
          chart: { xLabel: 'အမှတ်' },
          caption: `Quiz 2 ရဲ့ box က ညာဘက် ပိုရောက်ပြီး (median ${median(quiz2)} နဲ့ ${median(quiz1)}) ပိုကျဉ်းတယ် (IQR ${boxSummary(quiz2).iqr} နဲ့ ${boxSummary(quiz1).iqr}): အမှတ် ပိုမြင့်ပြီး ပိုတည်ငြိမ်တယ်။ Quiz 1 ရဲ့ အနိမ့်ဆုံး အမှတ် 28 ကို သတိထားပါ: dot plot မှာ ဝေးနေပုံ ရပေမဲ့ အတွင်း fence (${boxSummary(quiz1).innerFences[0]}) အတွင်းမှာ ရှိလို့ box-plot စည်းမျဉ်းအရ outlier **မဟုတ်ဘူး** — ရှည်တဲ့ whisker က အဲဒီအထိ ရောက်သွားတယ်။`
        },
        { type: 'code', title: 'စာအုပ်ရဲ့ percentile နည်းကို Python နဲ့' },
        {
          type: 'callout',
          title: 'Software က quartile နည်းနည်း ကွဲနိုင်တယ်',
          body: 'Percentile တွက်နည်း လက်ခံထားတာ အများအပြား ရှိတယ်။ pandas နဲ့ NumPy က default အနေနဲ့ value တွေကြား interpolate လုပ်လို့ data set အသေးတွေမှာ စာအုပ်နည်းနဲ့ နည်းနည်း ကွဲနိုင်တယ်။ Data set ကြီးတွေမှာ နည်းလမ်းတွေ နီးကပ်စွာ တူတယ်။'
        }
      ]
    },
    {
      id: 'correlation',
      eyebrow: 'အခန်း ၃ · 3.4 Variable နှစ်ခု',
      title: 'Covariance၊ correlation နှင့် least squares line',
      blocks: [
        {
          type: 'text',
          body: [
            'အခန်း ၂ ရဲ့ scatter plot က စာကျက်ချိန်နဲ့ စာမေးပွဲ အမှတ် အတူ တက်တာကို ပြခဲ့တယ်။ အခု **ဘယ်လောက် ပြင်းလဲ** တိုင်းမယ်။',
            '**Sample covariance** s_xy = Σ(x − x̄)(y − ȳ) ÷ (n − 1)။ x နဲ့ y နှစ်ခုလုံး သူ့ mean အပေါ် (ဒါမှမဟုတ် နှစ်ခုလုံး အောက်) မှာ ရှိရင် အတွဲတစ်ခုက အပေါင်း ပမာဏ ပေးတယ်၊ မဟုတ်ရင် အနုတ်။ s_xy အပေါင်း → အပေါင်း ဆက်နွယ်မှု; အနုတ် → အနုတ်။ ဒါပေမဲ့ သူ့အရွယ်က ယူနစ်ပေါ် မူတည်လို့ ဆုံးဖြတ်ရ ခက်တယ်။',
            '**Correlation coefficient** r = s_xy ÷ (s_x · s_y)။ ဒါက အမြဲ **−1 နဲ့ 1 ကြား** ရှိတယ်: +1 နားဆိုရင် ပြင်းထန်တဲ့ အပေါင်း မျဉ်းဖြောင့် ဆက်နွယ်မှု၊ −1 နားဆိုရင် ပြင်းထန်တဲ့ အနုတ်၊ 0 နားဆိုရင် မျဉ်းဖြောင့် ဆက်နွယ်မှု နည်း ဒါမှမဟုတ် မရှိ။',
            '**Least squares line** ŷ = b₀ + b₁x က အမှတ်တွေကနေ မျဉ်းဆီ ဒေါင်လိုက် အကွာအဝေး နှစ်ထပ်တွေကို အငယ်ဆုံး ဖြစ်စေတဲ့ မျဉ်းဖြောင့်ပါ။ Slope b₁ = s_xy ÷ s_x²၊ intercept b₀ = ȳ − b₁x̄။'
          ]
        },
        {
          type: 'table',
          columns: ['ပမာဏ', 'ပုံသေနည်း', 'Value'],
          rows: [
            ['x̄ (နာရီ)', 'Σx ÷ n', f2(mean(hours))],
            ['ȳ (အမှတ်)', 'Σy ÷ n', f2(mean(score))],
            ['s_xy', 'Σ(x − x̄)(y − ȳ) ÷ (n − 1)', f2(cov)],
            ['r', 's_xy ÷ (s_x · s_y)', fixed(r, 3)],
            ['b₁ (slope)', 's_xy ÷ s_x²', fixed(b1, 3)],
            ['b₀ (intercept)', 'ȳ − b₁x̄', f2(b0)]
          ]
        },
        {
          type: 'chart',
          title: `Least squares line: ŷ = ${f2(b0)} + ${f2(b1)}x`,
          chart: { xLabel: 'စာကျက်ချိန် နာရီ (x)', yLabel: 'စာမေးပွဲ အမှတ် (y)' },
          caption: `r = ${fixed(r, 3)} — ပြင်းထန်တဲ့ အပေါင်း မျဉ်းဖြောင့် ဆက်နွယ်မှု။ Slope ${f2(b1)} က စာကျက်ချိန် တစ်နာရီ ပိုတိုင်း ပျမ်းမျှ ${fixed(b1, 1)} မှတ်လောက် ပိုရတယ်လို့ ဆိုလိုတယ်။ ၅ နာရီ ကျက်တဲ့ ကျောင်းသားအတွက် မျဉ်းက ${f2(b0)} + ${f2(b1)} × 5 = **${fixed(b0 + b1 * 5, 1)}** လို့ ခန့်မှန်းတယ်။ (သတိရပါ: ဆက်နွယ်မှုက အကြောင်းရင်းကို သက်သေမပြဘူး။)`
        },
        { type: 'code', title: 'Python နဲ့ correlation နှင့် least squares line' }
      ]
    },
    {
      id: 'weighted-grouped',
      eyebrow: 'အခန်း ၃ · 3.5 Weighted mean နှင့် grouped data',
      title: 'Weighted mean နှင့် အုပ်စုဖွဲ့ data ကနေ mean',
      blocks: [
        {
          type: 'text',
          body: [
            '**Weighted mean** က value အချို့ကို ပိုအရေးကြီးစေတယ်: **Σ(w·x) ÷ Σw**။ သင်တန်း အဆင့်က ပုံမှန် ဥပမာ — နောက်ဆုံး စာမေးပွဲက အိမ်စာထက် ပိုအရေးကြီးတယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['အပိုင်း', 'အမှတ် (x)', 'Weight (w)', 'w × x'],
          rows: [
            ...gradeParts.map((g) => [
              partMy[g.part]!,
              String(g.score),
              `${g.weight}%`,
              String(g.score * g.weight)
            ]),
            ['စုစုပေါင်း', '', '100%', String(sum(gradeParts.map((g) => g.score * g.weight)))]
          ]
        },
        {
          type: 'chart',
          title: 'သင်တန်း အဆင့်ကို အပိုင်း တစ်ခုစီရဲ့ ပံ့ပိုးမှု',
          chart: {
            categories: gradeParts.map((g) => partMy[g.part]!),
            yLabel: 'ပံ့ပိုးတဲ့ အမှတ် (w × x ÷ 100)'
          },
          caption: `သင်တန်း အဆင့် = ${sum(gradeParts.map((g) => g.score * g.weight))} ÷ 100 = **${fixed(courseGrade, 1)}**။ 92၊ 74 နဲ့ 81 ရဲ့ ရိုးရိုး ပျမ်းမျှက ${fixed(mean(gradeParts.map((g) => g.score)), 1)} ဖြစ်မယ် — အိမ်စာကို နောက်ဆုံး စာမေးပွဲနဲ့ တန်းတူ သဘောထားလို့ မြင့်လွန်းတယ်။`
        },
        {
          type: 'text',
          body: [
            'တခါတလေ မူလ value တွေ မဟုတ်ဘဲ **frequency table** (grouped data) ပဲ ရှိတယ်။ ဒါဆိုရင် class တစ်ခုထဲက value တိုင်းက class **အလယ်မှတ်** M မှာ ရှိတယ်လို့ ယူဆတယ်: mean ≈ **Σ(f·M) ÷ n**၊ variance ≈ **Σf(M − x̄)² ÷ (n − 1)**။'
          ]
        },
        {
          type: 'table',
          columns: ['Class (မိနစ်)', 'အလယ်မှတ် M', 'Frequency f', 'f × M'],
          rows: [
            ...dCounts.map((c, i) => [
              `${dBounds[i]} < ${dBounds[i + 1]}`,
              fixed(dMids[i]!, 1),
              String(c),
              fixed(c * dMids[i]!, 1)
            ]),
            [
              'စုစုပေါင်း',
              '',
              String(deliveryTimes.length),
              fixed(sum(dMids.map((m, i) => m * dCounts[i]!)), 1)
            ]
          ]
        },
        {
          type: 'chart',
          title: 'Grouped ခန့်မှန်းချက် နှင့် mean အတိအကျ',
          chart: {
            categories: ['Grouped data ကနေ mean', 'မူလ data ရဲ့ mean အတိအကျ'],
            yLabel: 'မိနစ်'
          },
          caption: `Grouped ခန့်မှန်းချက် (${f2(groupedMean)} မိနစ်၊ s ≈ ${f2(Math.sqrt(groupedVar))}) က mean အတိအကျ (${f2(dtimeMean)}၊ s = ${f2(dtimeSd)}) နဲ့ နီးတယ်။ အုပ်စုဖွဲ့ရင် အသေးစိတ် နည်းနည်း ဆုံးရှုံးပေမဲ့ များသောအားဖြင့် အစီရင်ခံစာက frequency table ပဲ ပေးတယ်။`
        }
      ]
    },
    {
      id: 'geometric-mean',
      eyebrow: 'အခန်း ၃ · 3.6 Geometric mean',
      title: 'Geometric mean: ပြောင်းလဲမှုနှုန်းတွေကို ပျမ်းမျှခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            '10,000 THB ရင်းနှီးမြှုပ်နှံတယ်။ ပထမနှစ် **50%** တိုး (→ 15,000); ဒုတိယနှစ် **50%** ကျ (→ 7,500)။ ရိုးရိုး ပျမ်းမျှ အမြတ်က (50% − 50%) ÷ 2 = **0%** — ဒါပေမဲ့ 2,500 THB ဆုံးရှုံးသွားတယ်!',
            'ပေါင်းဆင့်တိုးတဲ့ နှုန်းတွေအတွက် **geometric mean** သုံးပါ: တိုးတက်မှု factor (1 + နှုန်း) တွေကို မြှောက်၊ n ထပ်ကိန်းရင်း ယူပြီး 1 နုတ်: **R_g = ((1 + R₁)(1 + R₂)…(1 + Rₙ))^(1/n) − 1**။',
            `ဒီမှာ: (1.5 × 0.5)^(1/2) − 1 = √0.75 − 1 = တစ်နှစ်ကို **${fixed(gm * 100, 2)}%**။ စစ်ကြည့်: 10,000 × (1 ${gm < 0 ? '−' : '+'} ${fixed(Math.abs(gm), 4)})² = ${Math.round(10000 * (1 + gm) ** 2).toLocaleString('en-US')} THB ✓။`
          ]
        },
        {
          type: 'table',
          columns: ['နှစ်', 'အမြတ်', 'တိုးတက်မှု factor', 'တန်ဖိုး (THB)'],
          rows: [
            ['အစ', '', '', '10,000'],
            ['1', '+50%', '1.5', '15,000'],
            ['2', '−50%', '0.5', '7,500']
          ]
        },
        {
          type: 'chart',
          title: 'Arithmetic mean နှင့် geometric mean',
          chart: {
            x: ['အစ', 'နှစ် 1', 'နှစ် 2'],
            series: [
              { name: 'တကယ့် တန်ဖိုး' },
              { name: '“တစ်နှစ် 0%” (arithmetic mean)' },
              { name: `တစ်နှစ် ${fixed(gm * 100, 1)}% (geometric mean)` }
            ],
            yLabel: 'တန်ဖိုး (THB)'
          },
          caption:
            'Geometric mean ကပဲ တကယ့် နောက်ဆုံး တန်ဖိုး 7,500 မှာ ဆုံးတယ်။ ရင်းနှီးမြှုပ်နှံမှု အမြတ်၊ လူဦးရေ တိုးနှုန်း နဲ့ ဈေးနှုန်း ပြောင်းလဲမှုတွေအတွက် သုံးပါ။'
        }
      ]
    },
    {
      id: 'review',
      eyebrow: 'ပြန်လည်သုံးသပ်ခြင်း',
      title: 'ဒါတွေကို ဖြေနိုင်လား?',
      blocks: [
        {
          type: 'quiz',
          question:
            'မြို့တစ်မြို့က အိမ်ဈေးတွေ ညာဘက်ကို အလွန် skewed ဖြစ်တယ်။ ပုံမှန် အိမ်ကို ဘယ်ဂဏန်းက အကောင်းဆုံး ဖော်ပြလဲ?',
          options: ['Mean', 'Median', 'Range', 'Variance'],
          explanation:
            'ဈေးကြီးတဲ့ အိမ် အနည်းငယ်က mean ကို အပေါ်ဆွဲတင်တယ်; median က သူတို့ ဘယ်လောက် အစွန်းရောက်လဲ ဂရုမစိုက်ဘူး။'
        },
        {
          type: 'quiz',
          question:
            'Data က ခေါင်းလောင်းပုံ ဖြစ်ပြီး mean 50၊ standard deviation 4 ရှိတယ်။ 42 နဲ့ 58 ကြားမှာ ရာခိုင်နှုန်း ဘယ်လောက် ရှိလဲ?',
          explanation:
            '42 နဲ့ 58 က 50 ကနေ standard deviation ၂ ခု ဝေးလို့ Empirical Rule က 95.44% လောက် ပေးတယ်။'
        },
        {
          type: 'quiz',
          question: 'Value တစ်ခုမှာ z = −1.5 ရှိတယ်။ ဘာကို ဆိုလိုလဲ?',
          options: [
            'Mean ထက် 1.5 ပိုတယ်',
            'Mean ထက် standard deviation 1.5 ခု အောက်မှာ',
            'အမှားတစ်ခု',
            '15th percentile'
          ],
          explanation:
            'z က mean ကနေ standard deviation ကို ရေတွက်တယ်; အနုတ်လက္ခဏာက အောက်ကို ဆိုလိုတယ်။'
        },
        {
          type: 'quiz',
          question: 'ဈေးနှုန်းနဲ့ ရောင်းရတဲ့ အရေအတွက်ကြား r = −0.92။ ဘာပြောလဲ?',
          options: [
            'ဆက်နွယ်မှု မရှိ',
            'အားနည်းတဲ့ အပေါင်း ဆက်နွယ်မှု',
            'ပြင်းထန်တဲ့ အနုတ် မျဉ်းဖြောင့် ဆက်နွယ်မှု',
            'ဈေးနှုန်းက အရောင်း ကျစေတယ်'
          ],
          explanation:
            '−1 နားဆိုတာ ပြင်းထန်စွာ အနုတ်ဖြစ်ပြီး မျဉ်းဖြောင့်နီးပါး။ Correlation တစ်ခုတည်းက အကြောင်းရင်းကို သက်သေမပြဘူး။'
        },
        {
          type: 'callout',
          title: 'အိမ်စာ: ကိုယ်ပိုင် ဂဏန်းများ',
          body: 'အခန်း ၂ အတွက် စုခဲ့တဲ့ data ကို သုံးပါ။ Mean၊ median၊ mode၊ range၊ variance နဲ့ standard deviation ကို လက်နဲ့ တွက်ပါ; ပြီးရင် Q1၊ Q3၊ IQR နဲ့ fence တွေ တွက်ပြီး box plot ဆွဲပါ။ ဂဏန်းတိုင်းကို Python နဲ့ စစ်ပါ။ နောက်ဆုံးမှာ စာကြောင်း နှစ်ကြောင်း ရေးပါ: ဗဟိုအကြောင်း တစ်ကြောင်း၊ ပျံ့နှံ့မှုအကြောင်း တစ်ကြောင်း။'
        }
      ]
    }
  ]
}

export default stats3
