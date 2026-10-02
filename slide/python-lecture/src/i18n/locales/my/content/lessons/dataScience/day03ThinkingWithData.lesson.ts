import type { LessonTranslation } from '@/models/translation.model'
import { classLabel, fixed, round } from '@/functions/stats.function'
import {
  bounds,
  complaintCum,
  complaints,
  complaintTotal,
  counts,
  cumCounts,
  drinkTable,
  k,
  length,
  maxTime,
  mids,
  minTime,
  n,
  tab,
  tabRow
} from '@/data/lessons/dataScience/day03ThinkingWithData.lesson'
import { drinks, quiz1 } from '@/data/lessons/dataScience/stats/statsData'

const drinkMy: Record<string, string> = {
  Tea: 'လက်ဖက်ရည်',
  Coffee: 'ကော်ဖီ',
  Juice: 'ဖျော်ရည်',
  Smoothie: 'Smoothie',
  Water: 'ရေ'
}
const complaintMy: Record<string, string> = {
  'Late delivery': 'ပို့ဆောင်မှု နောက်ကျ',
  'Wrong item': 'ပစ္စည်း မှား',
  'Cold food': 'အစာ အေးနေ',
  'Missing item': 'ပစ္စည်း ပျောက်',
  'Rude rider': 'ပို့သူ ရိုင်း',
  'Damaged package': 'ထုပ်ပိုး ပျက်စီး',
  Other: 'အခြား'
}
const branchMy = ['မြို့လယ်', 'တက္ကသိုလ်', 'ဘူတာ']
const levelMy = ['မြင့်', 'အလယ်အလတ်', 'နိမ့်']
const monthMy = ['ဇန်', 'ဖေ', 'မတ်', 'ဧ']
const pct = (v: number, d = 2) => `${fixed(v, d)}%`
const tens = (v: number) => (Number.isInteger(v) ? String(v) : fixed(v, 1))
const drinkCats = drinkTable.map((r) => drinkMy[r.category]!)

const day3: LessonTranslation = {
  title: 'စာရင်းအင်း ၂: data ကို table နှင့် graph များဖြင့် ဖော်ပြခြင်း',
  summary:
    'Frequency table၊ bar၊ pie နှင့် Pareto chart၊ အဆင့်ဆင့် တည်ဆောက်တဲ့ histogram၊ distribution ပုံသဏ္ဌာန်၊ polygon၊ ogive၊ dot plot၊ stem-and-leaf၊ cross-tabulation၊ scatter plot — graph တွေ ဘယ်လို လှည့်စားနိုင်လဲ ပါဝင်တယ်။',
  topics: [
    'Frequency table များ',
    'Bar၊ pie နှင့် Pareto chart',
    'Histogram',
    'Distribution ပုံသဏ္ဌာန်',
    'Polygon နှင့် ogive',
    'Dot plot နှင့် stem-and-leaf',
    'Cross-tabulation',
    'Scatter plot',
    'လှည့်စားတဲ့ graph များ'
  ],
  sections: [
    {
      id: 'describe',
      eyebrow: 'အခန်း ၂ · ဒီကစပါ',
      title: 'Data ကို ဖော်ပြခြင်း: ဂဏန်းပုံကနေ ပုံတစ်ပုံဆီ',
      blocks: [
        {
          type: 'text',
          body: [
            '**Descriptive statistics** က data set တစ်ခုရဲ့ အရေးကြီးတဲ့ လက္ခဏာတွေကို ဖော်ပြတယ်။ ဒီအခန်းမှာ **table** နဲ့ **graph** တွေ သုံးတယ်; နောက်အခန်းမှာ mean လို ဂဏန်းတွေ ထပ်ထည့်မယ်။',
            'သင့်တော်တဲ့ table နဲ့ graph က **variable အမျိုးအစား** (အခန်း ၁) ပေါ် မူတည်တယ်: qualitative data ကို **အုပ်စုအလိုက် ရေတွက်** တယ်; quantitative data ကို **ဂဏန်း အပိုင်းအခြား** (class) တွေထဲ **အုပ်စုဖွဲ့** ဒါမှမဟုတ် အမှတ်တစ်ခုချင်း ပြတယ်။ Variable နှစ်ခုကို အတူတူ **cross-tab** ဒါမှမဟုတ် **scatter plot** နဲ့ ပြတယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['Data', 'Table', 'Graph'],
          rows: [
            [
              'Qualitative variable တစ်ခု',
              'Frequency distribution',
              'Bar chart၊ pie chart၊ Pareto chart'
            ],
            [
              'Quantitative variable တစ်ခု',
              'Class ပါတဲ့ frequency distribution',
              'Histogram၊ polygon၊ ogive၊ dot plot၊ stem-and-leaf'
            ],
            [
              'Qualitative variable နှစ်ခု',
              'Cross-tabulation table',
              'Row percentage တွေရဲ့ grouped bar chart'
            ],
            ['Quantitative variable နှစ်ခု', '(x, y) အတွဲ table', 'Scatter plot']
          ]
        },
        {
          type: 'chart',
          title: 'ဒီအခန်းရဲ့ အဓိက graph များ',
          chart: {
            charts: [
              { title: 'Bar chart', chart: { categories: drinkCats } },
              { title: 'Histogram' },
              { title: 'Scatter plot' }
            ]
          }
        }
      ]
    },
    {
      id: 'frequency',
      eyebrow: 'အခန်း ၂ · 2.1 Qualitative data',
      title: 'Frequency distribution နှင့် bar chart',
      blocks: [
        {
          type: 'text',
          body: [
            'ကော်ဖီဆိုင် တစ်ဆိုင်က နောက်ဆုံး **ဖောက်သည် ၄၀** ယောက် မှာတဲ့ သောက်စရာကို ချရေးထားတယ်။ မူလ စာရင်း (အောက်မှာ) အတိုင်းဆိုရင် ဘာမှ မြင်ရခက်တယ်။',
            '**Frequency distribution** ဆိုတာ **class** (အုပ်စု) တစ်ခုစီထဲ item ဘယ်နှခု ကျလဲ ရေတွက်တဲ့ table ပါ။ Class တွေ ထပ်မနေရဘူး၊ item တိုင်းက class တစ်ခုတည်းထဲ ကျရမယ်။'
          ]
        },
        {
          type: 'table',
          columns: [
            'မှာယူမှု',
            'မှာယူမှု',
            'မှာယူမှု',
            'မှာယူမှု',
            'မှာယူမှု',
            'မှာယူမှု',
            'မှာယူမှု',
            'မှာယူမှု'
          ],
          rows: Array.from({ length: drinks.length / 8 }, (_, r) =>
            drinks.slice(r * 8, r * 8 + 8).map((d) => drinkMy[d]!)
          )
        },
        {
          type: 'text',
          body: [
            'သောက်စရာ တစ်ခုချင်းကို ရေတွက်ပြီး class တစ်ခုစီအတွက် column နှစ်ခု ထပ်တွက်ပါ။ **n** = item စုစုပေါင်း ဆိုရင်:',
            '**Relative frequency** = frequency ÷ n (item အားလုံးထဲက အပိုင်းအစ)။ **Percent frequency** = relative frequency × 100။ Relative frequency တွေကို ပေါင်းရင် အမြဲ **1**၊ percent frequency တွေကို ပေါင်းရင် **100%** ရတယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['သောက်စရာ', 'Frequency', 'Relative frequency', 'Percent frequency'],
          rows: [
            ...drinkTable.map((r) => [
              drinkMy[r.category]!,
              String(r.frequency),
              `${r.frequency}/${drinks.length} = ${fixed(r.relative, 3)}`,
              pct(r.percent, 1)
            ]),
            ['စုစုပေါင်း', String(drinks.length), '1.000', '100%']
          ]
        },
        {
          type: 'chart',
          title: 'သောက်စရာ မှာယူမှုရဲ့ bar chart များ',
          chart: {
            charts: [
              {
                title: 'Frequency bar chart',
                chart: { categories: drinkCats, yLabel: 'မှာယူမှု အရေအတွက်' }
              },
              {
                title: 'Percent bar chart',
                chart: { categories: drinkCats, yLabel: 'မှာယူမှု ရာခိုင်နှုန်း' }
              }
            ]
          },
          caption:
            '**Bar chart** က class တစ်ခုကို bar တစ်ခု ဆွဲတယ်; အမြင့်က frequency (ဒါမှမဟုတ် ရာခိုင်နှုန်း)။ Chart နှစ်ခုလုံး ပုံသဏ္ဌာန် တူတယ် — ဝင်ရိုးပဲ ပြောင်းတယ်။ Class တွေက သီးခြား အုပ်စုတွေမို့ bar တွေကြားမှာ **ကွက်လပ်** ရှိတယ်။ **ဖတ်နည်း:** လက်ဖက်ရည်က လူကြိုက်အများဆုံး (35%)၊ ရေက အနည်းဆုံး (7.5%)။'
        },
        { type: 'code', title: 'Frequency distribution ကို Python နဲ့' }
      ]
    },
    {
      id: 'pie',
      eyebrow: 'အခန်း ၂ · 2.1 Qualitative data',
      title: 'Pie chart များ',
      blocks: [
        {
          type: 'text',
          body: [
            '**Pie chart** က class တစ်ခုစီကို စက်ဝိုင်းရဲ့ အချပ်တစ်ချပ်အဖြစ် ပြတယ်။ စက်ဝိုင်း တစ်ခုလုံး (360°) က data set တစ်ခုလုံးမို့ အချပ်တစ်ချပ်စီက **relative frequency × 360°** ရတယ်။',
            'လက်ဖက်ရည်အတွက်: 0.350 × 360° = **126°**။ ရေအတွက်: 0.075 × 360° = **27°**။'
          ]
        },
        {
          type: 'table',
          columns: ['သောက်စရာ', 'Relative frequency', 'အချပ် ထောင့်'],
          rows: [
            ...drinkTable.map((r) => [
              drinkMy[r.category]!,
              fixed(r.relative, 3),
              `${fixed(r.relative, 3)} × 360° = ${round(r.relative * 360, 0)}°`
            ]),
            ['စုစုပေါင်း', '1.000', '360°']
          ]
        },
        {
          type: 'chart',
          title: 'သောက်စရာ မှာယူမှုရဲ့ pie chart',
          chart: { categories: drinkCats },
          caption:
            'Pie chart က class နည်းနည်းပဲ ရှိတဲ့ **အလုံးတစ်ခုရဲ့ အစိတ်အပိုင်းတွေ** ကို ပြဖို့ အကောင်းဆုံးပါ။ Class တွေကို အချင်းချင်း နှိုင်းယှဉ်ဖို့ bar chart က ဖတ်ရ ပိုလွယ်တယ်၊ ဘာကြောင့်လဲဆိုတော့ မျက်လုံးက ထောင့်ထက် အလျားကို ပိုကောင်းကောင်း ခန့်မှန်းတယ်။'
        }
      ]
    },
    {
      id: 'pareto',
      eyebrow: 'အခန်း ၂ · 2.1 Qualitative data',
      title: 'Pareto chart: ပြဿနာကြီး အနည်းငယ်ကို ရှာပါ',
      blocks: [
        {
          type: 'text',
          body: [
            '**Pareto principle**: ပြဿနာ အမျိုးအစား **အနည်းငယ်** က အခက်အခဲ **အများစု** ကို ဖြစ်စေလေ့ရှိတယ်။ **Pareto chart** က လုပ်ငန်းတစ်ခုကို ဘယ်ပြဿနာ အရင်ပြင်မလဲ ဆုံးဖြတ်ဖို့ ကူညီတယ်။',
            '**တည်ဆောက်နည်း:** ① ပြဿနာ အမျိုးအစား တစ်ခုစီကို ရေတွက် ② row တွေကို **အများဆုံး** ကနေ အနည်းဆုံးအထိ စီ၊ “အခြား” ကို အမြဲ နောက်ဆုံးထား ③ ရာခိုင်နှုန်း တစ်ခုစီ တွက် ④ **cumulative percent** (စုစုပေါင်း ရာခိုင်နှုန်း) တွက်: row တစ်ခုရဲ့ ရာခိုင်နှုန်း + အပေါ်က row အားလုံး ⑤ bar တွေကို အဲဒီအစီအစဉ်နဲ့ ဆွဲပြီး cumulative percent ကို မျဉ်းအဖြစ် ဆွဲ။',
            '“အခြား” က သေးရမယ် (အကြီးဆုံး class ထက် နည်းရမယ်)။ 5% လောက် ဒါမှမဟုတ် အောက် class တွေကို “အခြား” ထဲ ပေါင်းလေ့ ရှိတယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['တိုင်ကြားချက် (တစ်လ ၂၀၀)', 'Frequency', 'Percent', 'Cumulative percent'],
          rows: [
            ...complaints.map(([name, count], i) => [
              complaintMy[name]!,
              String(count),
              pct((count / complaintTotal) * 100, 1),
              pct(complaintCum[i]!, 1)
            ]),
            ['စုစုပေါင်း', String(complaintTotal), '100%', '']
          ]
        },
        {
          type: 'chart',
          title: 'ပို့ဆောင်ရေး တိုင်ကြားချက်တွေရဲ့ Pareto chart',
          chart: { categories: complaints.map(([name]) => complaintMy[name]!) },
          caption: `မျဉ်းက ပထမ ပြဿနာ သုံးခု — ပို့ဆောင်မှု နောက်ကျ၊ ပစ္စည်း မှား နဲ့ အစာ အေးနေ — က တိုင်ကြားချက် အားလုံးရဲ့ **${fixed(complaintCum[2]!, 1)}%** ဖြစ်တယ်လို့ ပြတယ်။ ဒီသုံးခုကို အရင်ပြင်ရင် အားထုတ်မှုနဲ့ ယှဉ်ပြီး အကြီးဆုံး တိုးတက်မှု ရမယ်။`
        }
      ]
    },
    {
      id: 'histogram',
      eyebrow: 'အခန်း ၂ · 2.2 Quantitative data',
      title: 'Histogram ကို အဆင့် ငါးဆင့်နဲ့ တည်ဆောက်ခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            'အစားအသောက် ပို့ဆောင်ရေး ကုမ္ပဏီ တစ်ခုက **ပို့ဆောင်မှု ၅၀** (မှာတဲ့အချိန်ကနေ တံခါးဝရောက်တဲ့အထိ မိနစ်) ကို အချိန်မှတ်တယ်။ သူ့ကတိက “မိနစ် ၄၀ အောက်” ပါ။ အချိန်တွေကို **class** (ဂဏန်း အပိုင်းအခြား) တွေရဲ့ frequency distribution နဲ့ အနှစ်ချုပ်ပြီး **histogram** ဆွဲပါမယ်။'
          ]
        },
        {
          type: 'table',
          columns: [
            'မိနစ်',
            'မိနစ်',
            'မိနစ်',
            'မိနစ်',
            'မိနစ်',
            'မိနစ်',
            'မိနစ်',
            'မိနစ်',
            'မိနစ်',
            'မိနစ်'
          ]
        },
        {
          type: 'text',
          body: [
            `**အဆင့် ၁ — class အရေအတွက် K။** **2^K စည်းမျဉ်း** ကို သုံးပါ: K က 2^K ဟာ n ထက် **ကြီး** တဲ့ အငယ်ဆုံး ကိန်းပြည့်။ ဒီမှာ n = ${n}: 2^5 = 32 က ${n} ထက် မကြီးဘူး၊ 2^6 = 64 ကတော့ ကြီးတယ်၊ ဒါကြောင့် **K = ${k}**။`,
            `**အဆင့် ၂ — class အလျား။** (အကြီးဆုံး − အငယ်ဆုံး) ÷ K = (${maxTime} − ${minTime}) ÷ ${k} = ${round((maxTime - minTime) / k, 4)}။ Data ရဲ့ တိကျမှု (မိနစ် ကိန်းပြည့်) အထိ **အပေါ်ကို** round လုပ်ပါ: **အလျား = ${length}**။`,
            `**အဆင့် ၃ — class နယ်နိမိတ်များ။** အငယ်ဆုံး value ကနေ စပြီး အလျားကို ဆက်ပေါင်းပါ: ${bounds.join(', ')}။ ဒါက ထပ်မနေတဲ့ class ${k} ခု ပေးတယ်။ “12 < 17” ဆိုတာ **12 နဲ့ အထက်၊ ဒါပေမဲ့ 17 အောက်** လို့ ဆိုလိုတယ်။`,
            '**အဆင့် ၄ — ရေတွက်မှတ် (tally) လုပ်ပြီး** class တစ်ခုစီထဲ value ဘယ်နှခု ကျလဲ ရေတွက်ပါ (ဖြစ်ပုံကို ကြည့်ဖို့ အောက်က ခလုတ်ကို နှိပ်ပါ)။',
            '**အဆင့် ၅ — histogram ဆွဲပါ:** class တစ်ခုကို ထောင့်မှန်စတုဂံ တစ်ခု၊ class အကျယ်အတိုင်း ကျယ်ပြီး frequency အတိုင်း မြင့်တယ်။ Class တွေက ဆက်တိုက် ဂဏန်းမျဉ်း တစ်ခုကို ဖုံးလို့ bar တွေ **ထိနေ** တယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['Data set အရွယ် n', 'Class အရေအတွက် K'],
          rows: [
            ['16 ကနေ 31', '5'],
            ['32 ကနေ 63', '6'],
            ['64 ကနေ 127', '7'],
            ['128 ကနေ 255', '8'],
            ['256 ကနေ 511', '9']
          ]
        },
        {
          type: 'chart',
          title: 'အဆင့် ၄ နှင့် ၅: histogram ကိုယ်တိုင် တည်ဆောက်တာကို ကြည့်ပါ',
          chart: { xLabel: 'ပို့ဆောင်ချိန် (မိနစ်)', yLabel: 'Frequency' },
          caption:
            'Value တစ်ခုစီ လိမ္မော်ရောင် လင်းလာပြီး သူ့ class မှာ ရေတွက်မှတ် တစ်ခု ရပြီး bar က တစ်ခု မြင့်လာတယ်။ ၅၀ လုံး နေရာချပြီးရင် အရေအတွက်တွေ ပေါင်းရင် ၅၀ ရတယ်။'
        },
        {
          type: 'table',
          columns: [
            'Class (မိနစ်)',
            'အလယ်မှတ်',
            'Frequency',
            'Relative frequency',
            'Percent frequency'
          ],
          rows: [
            ...counts.map((c, i) => [
              classLabel(bounds[i]!, bounds[i + 1]!),
              tens(mids[i]!),
              String(c),
              `${c}/${n} = ${fixed(c / n, 2)}`,
              pct((c / n) * 100, 0)
            ]),
            ['စုစုပေါင်း', '', String(n), '1.00', '100%']
          ]
        },
        {
          type: 'chart',
          title: 'Percent frequency histogram',
          chart: { xLabel: 'ပို့ဆောင်ချိန် (မိနစ်)', yLabel: 'ပို့ဆောင်မှု ရာခိုင်နှုန်း' },
          caption: `**Table နဲ့ histogram က ပြောတာ:** ပို့ဆောင်မှု အများစုက မိနစ် 17 ကနေ 27 ကြာတယ် (${n} ထဲက ${counts[1]! + counts[2]!}၊ ${round(((counts[1]! + counts[2]!) / n) * 100, 0)}%); class 17 < 22 က အဖြစ်အများဆုံး; ၃၇ မိနစ်နဲ့ အထက် ကြာတာ ${counts.at(-1)} ခုပဲ ရှိတယ်။ ပို့ဆောင်မှုတိုင်း မိနစ် ၄၂ အောက် ဖြစ်ပေမဲ့ တစ်ခု (${maxTime} မိနစ်) က မိနစ် ၄၀ ကတိကို ချိုးဖောက်တယ်။ မူလ စာရင်းက ဒါတွေကို တစ်ချက်ကြည့်ရုံနဲ့ မပြောနိုင်ဘူး။`
        },
        { type: 'code', title: 'Class၊ အရေအတွက် နှင့် histogram ကို Python နဲ့' }
      ]
    },
    {
      id: 'shapes',
      eyebrow: 'အခန်း ၂ · 2.2 Quantitative data',
      title: 'Distribution ရဲ့ ပုံသဏ္ဌာန်',
      blocks: [
        {
          type: 'text',
          body: [
            'Histogram ရဲ့ အနားသတ်က **distribution ရဲ့ ပုံသဏ္ဌာန်** ပါ။ ပုံသဏ္ဌာန် လေးမျိုးက ထပ်ခါထပ်ခါ ပေါ်လာတယ်:',
            '**Symmetric (အမောက်ပုံ):** ဘယ်နဲ့ ညာ ဘက်တွေ မှန်ထဲက ပုံရိပ်လို တူတယ်။ **ညာဘက်ကို skewed:** ညာဘက်မှာ အမြီးရှည် — value အနည်းငယ်က ကျန်တာထက် အများကြီး ကြီးတယ်။ **ဘယ်ဘက်ကို skewed:** ဘယ်ဘက်မှာ အမြီးရှည် — value အနည်းငယ်က အများကြီး ငယ်တယ်။ **အထွတ် နှစ်ခု:** အုပ်စု နှစ်ခု ရောနေတာ များတယ်။'
          ]
        },
        {
          type: 'chart',
          title: 'အဖြစ်များတဲ့ ပုံသဏ္ဌာန် လေးမျိုး',
          chart: {
            charts: [
              { title: 'Symmetric' },
              { title: 'ညာဘက်ကို skewed' },
              { title: 'ဘယ်ဘက်ကို skewed' },
              { title: 'အထွတ် နှစ်ခု' }
            ]
          }
        },
        {
          type: 'table',
          columns: ['ပုံသဏ္ဌာန်', 'ဘယ်လို ပုံရလဲ', 'ပုံမှန် လက်တွေ့ ဥပမာ'],
          rows: [
            [
              'Symmetric',
              'မှန်ထဲက ပုံရိပ်၊ အလယ်မှာ အမြင့်ဆုံး',
              'လူကြီးတွေရဲ့ အရပ်; စက်ရဲ့ ဖြည့်ပမာဏ'
            ],
            [
              'ညာဘက် skewed',
              'ညာဘက်ကို အမြီးရှည်',
              'ဝင်ငွေ; ပို့ဆောင်ချိန် (အနည်းငယ် အရမ်းနောက်ကျ)'
            ],
            [
              'ဘယ်ဘက် skewed',
              'ဘယ်ဘက်ကို အမြီးရှည်',
              'လွယ်တဲ့ စာမေးပွဲ: အများစု အမှတ်မြင့်၊ အနည်းငယ် အရမ်းနိမ့်'
            ],
            [
              'အထွတ် နှစ်ခု',
              'အမောက် နှစ်ခု',
              'အုပ်စု နှစ်ခု ရော: လေ့ကျင့်တဲ့ ကျောင်းသားနဲ့ မလေ့ကျင့်တဲ့ ကျောင်းသား'
            ]
          ]
        },
        {
          type: 'quiz',
          question:
            'ကျွန်တော်တို့ ပို့ဆောင်ချိန် histogram မှာ value အများစုက ဘယ်ဘက်မှာ ရှိပြီး ညာဘက်ကို အမြီးရှည် ရှိတယ်။ ပုံသဏ္ဌာန်က ဘာလဲ?',
          options: ['Symmetric', 'ညာဘက်ကို skewed', 'ဘယ်ဘက်ကို skewed', 'အထွတ် နှစ်ခု'],
          explanation:
            'အမြီးက ညာဘက်ကို ညွှန်တယ်: ပို့ဆောင်မှု အနည်းငယ်က အများစုထက် အများကြီး ပိုကြာတယ်။ ဒါက ညာဘက်ကို skewed ပါ။'
        }
      ]
    },
    {
      id: 'polygon',
      eyebrow: 'အခန်း ၂ · 2.2 Quantitative data',
      title: 'Frequency polygon: distribution နှစ်ခု နှိုင်းယှဉ်ခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            '**Frequency polygon** က **class အလယ်မှတ်** တစ်ခုစီ အပေါ်မှာ class frequency (ဒါမှမဟုတ် ရာခိုင်နှုန်း) အမြင့်နဲ့ အမှတ်တစ်ခု ချပြီး အမှတ်တွေကို မျဉ်းနဲ့ ဆက်တယ်။ မျဉ်းတစ်ကြောင်းပဲ ဖြစ်လို့ **distribution နှစ်ခုကို graph တစ်ခုတည်းမှာ** ဆွဲပြီး နှိုင်းယှဉ်နိုင်တယ်။',
            'ဆရာ တစ်ယောက်က ကျောင်းသား ၄၀ တည်းရဲ့ Quiz 1 နဲ့ Quiz 2 အမှတ်တွေကို 10 မှတ် class တွေထဲ အုပ်စုဖွဲ့တယ်။ Quiz နှစ်ခုကြားမှာ အတန်းက **အပတ်စဉ် လေ့ကျင့်ခန်း** စတယ်။ အရွယ်မတူတဲ့ အုပ်စုတွေကိုလည်း နှိုင်းယှဉ်နိုင်အောင် ရာခိုင်နှုန်း သုံးတယ်။'
          ]
        },
        { type: 'table', columns: ['Class', 'အလယ်မှတ်', 'Quiz 1 (%)', 'Quiz 2 (%)'] },
        {
          type: 'chart',
          title: 'Quiz 1 နှင့် Quiz 2 ရဲ့ percent frequency polygon',
          chart: { xLabel: 'အမှတ် (class အလယ်မှတ်)', yLabel: 'ကျောင်းသား ရာခိုင်နှုန်း' },
          caption:
            'Quiz 1 မှာ **အထွတ် နှစ်ခု** (60 ကျော် နဲ့ 90 ကျော်) ရှိတယ်: ကျောင်းသား အုပ်စု နှစ်ခု။ Quiz 2 မှာ 80 ကျော်မှာ **အထွတ် တစ်ခု** ပဲ ရှိတယ် — လေ့ကျင့်ပြီးနောက် အမှတ်နိမ့် အုပ်စု တက်လာတယ်။ Graph တစ်ခုက ဇာတ်လမ်း တစ်ခုလုံးကို ပြတယ်။'
        }
      ]
    },
    {
      id: 'ogive',
      eyebrow: 'အခန်း ၂ · 2.2 Quantitative data',
      title: 'Cumulative distribution နှင့် ogive',
      blocks: [
        {
          type: 'text',
          body: [
            '**Cumulative frequency** က class တစ်ခုစီရဲ့ **အပေါ်နယ်နိမိတ် အောက်** ရှိတဲ့ value တွေကို ရေတွက်တယ်: class frequency ကို အပေါ်က frequency အားလုံးနဲ့ ပေါင်း။ n နဲ့ စားရင် **cumulative relative frequency**၊ 100 နဲ့ မြှောက်ရင် **cumulative percent** ရတယ်။',
            '**Ogive** (“အိုဂိုက်ဗ်” လို့ အသံထွက်) က cumulative value တစ်ခုစီကို သူ့ class ရဲ့ **အပေါ်နယ်နိမိတ်** အပေါ်မှာ ချပြီး (အနိမ့်ဆုံး နယ်နိမိတ်မှာ 0 ကနေ စ) အမှတ်တွေကို ဆက်တယ်။ “မိနစ် ၂၇ အောက် ကြာတာ ဘယ်လောက် ရှိလဲ?” လို မေးခွန်းတွေကို ဖြေတယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['Class', 'Frequency', 'Cumulative frequency', 'Cumulative percent']
        },
        {
          type: 'chart',
          title: 'ပို့ဆောင်ချိန်တွေရဲ့ percent ogive',
          chart: {
            series: [{ name: 'Cumulative %' }],
            xLabel: 'ပို့ဆောင်ချိန် (class အပေါ်နယ်နိမိတ်၊ မိနစ်)',
            yLabel: 'Cumulative percent'
          },
          caption: `**Ogive ဖတ်နည်း:** မိနစ် 27 ကနေ မျဉ်းအထိ အပေါ်တက်ပြီး ဘေးဘက် သွားပါ: ပို့ဆောင်မှုရဲ့ **${round((cumCounts[2]! / n) * 100, 0)}%** က မိနစ် 27 အောက် ကြာတယ်။ Value တိုင်းက နောက်ဆုံး နယ်နိမိတ်အောက်မှာ ရှိလို့ မျဉ်းက အမြဲ 100% မှာ ဆုံးတယ်။`
        }
      ]
    },
    {
      id: 'dot-plot',
      eyebrow: 'အခန်း ၂ · 2.3 Dot plot',
      title: 'Dot plot နှင့် outlier များ',
      blocks: [
        {
          type: 'text',
          body: [
            '**Dot plot** က data ကို ဖုံးတဲ့ ဂဏန်းမျဉ်း တစ်ကြောင်း ဆွဲပြီး အပေါ်မှာ **value တစ်ခုကို အစက် တစ်စက်** ချတယ်; တူတဲ့ value တွေ ထပ်တင်တယ်။ Value **တိုင်း** ကို မြင်ရလို့ data set အသေးတွေနဲ့ သင့်တော်တယ်။',
            '**Outlier** ဆိုတာ ပုံမှန်မဟုတ်လောက်အောင် ကြီး ဒါမှမဟုတ် ငယ်ပြီး ကျန်တာတွေနဲ့ ဝေးနေတဲ့ value ပါ။ အရင်ဆုံး **ဘာကြောင့်လဲ** မေးပါ: တိုင်းတာမှု ဒါမှမဟုတ် ရိုက်ထည့်မှု အမှားဆိုရင် ပြင်ပါ (ပြင်လို့ မရရင် ဖယ်ပါ)။ အမှန်တကယ် ဆိုရင် data ထဲက အရေးကြီးဆုံး အချက် ဖြစ်နိုင်တယ်။'
          ]
        },
        {
          type: 'table',
          columns: [
            'အမှတ်',
            'အမှတ်',
            'အမှတ်',
            'အမှတ်',
            'အမှတ်',
            'အမှတ်',
            'အမှတ်',
            'အမှတ်',
            'အမှတ်',
            'အမှတ်'
          ]
        },
        {
          type: 'chart',
          title: 'Quiz 1 ရဲ့ dot plot (outlier ကို လိမ္မော်ရောင်)',
          chart: { xLabel: 'Quiz 1 အမှတ်' },
          caption: `အစက်တွေက အစု နှစ်စု (60 ကျော် နဲ့ 80–90 ကျော်) ဖြစ်နေတယ်၊ polygon ပြခဲ့သလိုပဲ။ အမှတ် **${Math.min(...quiz1)}** က တခြားသူ အားလုံးနဲ့ ဝေးနေတယ်: outlier တစ်ခု။ ဒါက ရိုက်မှား တာ မဟုတ်ဘူး — အဲဒီ ကျောင်းသားက အတန်း အများစု ပျက်ခဲ့လို့ ဆရာက အပိုအကူအညီ စီစဉ်ပေးခဲ့တယ်။`
        }
      ]
    },
    {
      id: 'stem-leaf',
      eyebrow: 'အခန်း ၂ · 2.4 Stem-and-leaf display',
      title: 'Stem-and-leaf display များ',
      blocks: [
        {
          type: 'text',
          body: [
            '**Stem-and-leaf display** က value တိုင်းကို ထိန်းထားရင်းနဲ့ data ကို **စီ** ပြီး ပုံသဏ္ဌာန်ကိုပါ ပြတယ်။ Value တစ်ခုစီကို **stem** (ရှေ့ဂဏန်းများ) နဲ့ **leaf** (နောက်ဆုံး ဂဏန်း) ခွဲပါ: ၂၄ မိနစ် → stem **2**၊ leaf **4**။',
            '**တည်ဆောက်နည်း:** ① stem တွေကို ရွေး (များသောအားဖြင့် row 5 ကနေ 20) ပြီး ကော်လံတစ်ခုထဲ အငယ်ဆုံးကို အပေါ်ဆုံးထား ရေး ② ဒေါင်လိုက်မျဉ်း ဆွဲ ③ value တစ်ခုစီရဲ့ leaf ကို သူ့ stem row မှာ ရေး ④ row တစ်ခုစီက leaf တွေကို အငယ်ကနေ အကြီး စီ။',
            'ဘေးတိုက် လှည့်ကြည့်ရင် display က histogram နဲ့ တူတယ်။ ကျပ်လွန်းရင် **stem တွေကို ခွဲ** ပါ: stem တစ်ခုကို နှစ်ခါ သုံး — leaf 0–4 ကို ပထမ row၊ 5–9 ကို ဒုတိယ row။'
          ]
        },
        {
          type: 'table',
          columns: ['Value', 'Stem', 'Leaf', 'ရေးပုံ'],
          rows: [
            ['12', '1', '2', '1 | 2'],
            ['24', '2', '4', '2 | 4'],
            ['37', '3', '7', '3 | 7'],
            ['41', '4', '1', '4 | 1']
          ]
        },
        {
          type: 'chart',
          title: 'ပို့ဆောင်ချိန် ၅၀ ရဲ့ stem-and-leaf display',
          caption:
            'Row “2” မှာ 20 ကနေ 29 အထိ အချိန် အားလုံး ရှိတယ်: အရှည်ဆုံး row ဖြစ်လို့ ပို့ဆောင်မှု အများစုက 20 ကျော် မိနစ် ကြာတယ်။ အပေါ်က row ရှည်တွေနဲ့ အောက်က row တိုတွေက histogram လိုပဲ ညာဘက် skew ကို ပြတယ်။'
        },
        {
          type: 'chart',
          title: 'Stem တွေကို ခွဲထားတဲ့ data တူ',
          caption:
            'Stem တစ်ခုကို row နှစ်ခု (0–4 နဲ့ 5–9) ခွဲရင် display ဆန့်ထွက်ပြီး ပုံသဏ္ဌာန်ကို ပိုအသေးစိတ် ပြတယ်။'
        },
        {
          type: 'chart',
          title: 'ကျောချင်းကပ် display: Quiz 1 (ဘယ်) နှင့် Quiz 2 (ညာ)',
          chart: { labels: ['Quiz 2', 'Quiz 1'] },
          caption:
            'Quiz နှစ်ခုလုံး stem ကော်လံ တစ်ခုတည်းကို မျှသုံးတယ်။ Quiz 1 ရဲ့ leaf (ဘယ်) တွေက 60 ကျော်နဲ့ 90 ကျော်မှာ စုနေတယ်; Quiz 2 ရဲ့ leaf (ညာ) တွေက 70 ကျော်ကနေ 90 ကျော်မှာ စုနေတယ်။ Outlier 28 က ညာဘက်မှာ အဖော် မရှိဘူး။'
        },
        { type: 'code', title: 'Stem-and-leaf display ကို Python နဲ့' }
      ]
    },
    {
      id: 'cross-tab',
      eyebrow: 'အခန်း ၂ · 2.5 Cross-tabulation',
      title: 'Cross-tabulation: qualitative variable နှစ်ခု',
      blocks: [
        {
          type: 'text',
          body: [
            'ကော်ဖီဆိုင် ကွင်းဆက် တစ်ခုက ဆိုင်ခွဲ သုံးခုမှာ **ဖောက်သည် ၉၀** ကို ဘယ်လောက် ကျေနပ်လဲ (မြင့်၊ အလယ်အလတ်၊ နိမ့်) မေးတယ်။ ကျေနပ်မှုက **ဆိုင်ခွဲပေါ် မူတည်** သလား?',
            '**Cross-tabulation table** က data ကို dimension နှစ်ခုနဲ့ ခွဲခြားတယ်: variable တစ်ခု (ဆိုင်ခွဲ) အတွက် row၊ နောက်တစ်ခု (ကျေနပ်မှု) အတွက် column။ ဖောက်သည် တစ်ယောက်ချင်းက **ကွက် (cell)** တစ်ကွက်တည်းထဲ ကျတယ်။ Row တစ်ခုကို ဘေးတိုက် ပေါင်းရင် **row total**၊ column တစ်ခုကို အောက်ကို ပေါင်းရင် **column total** ရတယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['ဆိုင်ခွဲ', ...levelMy, 'စုစုပေါင်း'],
          rows: [
            ...tab.rows.map((_, i) => [
              branchMy[i]!,
              ...tab.counts[i]!.map(String),
              String(tab.rowTotals[i])
            ]),
            ['စုစုပေါင်း', ...tab.columnTotals.map(String), String(tab.total)]
          ]
        },
        {
          type: 'text',
          body: [
            'အုပ်စု အရွယ် မတူရင် အရေအတွက်တွေကို နှိုင်းယှဉ်ရ ခက်လို့ **row percentage** တွက်တယ်: ကွက်တစ်ကွက် ÷ သူ့ row total × 100။ ဒါဆိုရင် row တစ်ခုစီက **အဲဒီ ဆိုင်ခွဲအတွက်** ကျေနပ်မှုရဲ့ percent frequency distribution ဖြစ်လာတယ်။',
            `ဥပမာ မြို့လယ်–မြင့် = ${tab.counts[0]![0]} ÷ ${tab.rowTotals[0]} × 100 = **${fixed(tabRow[0]![0]!, 1)}%**။`
          ]
        },
        {
          type: 'table',
          columns: ['ဆိုင်ခွဲ', 'မြင့်', 'အလယ်အလတ်', 'နိမ့်', 'စုစုပေါင်း'],
          rows: tab.rows.map((_, i) => [branchMy[i]!, ...tabRow[i]!.map((v) => pct(v, 1)), '100%'])
        },
        {
          type: 'chart',
          title: 'ဆိုင်ခွဲ တစ်ခုစီရဲ့ row percentage',
          chart: {
            categories: branchMy,
            series: levelMy.map((name) => ({ name })),
            yLabel: 'ဆိုင်ခွဲရဲ့ ဖောက်သည် ရာခိုင်နှုန်း'
          },
          caption:
            '**တက္ကသိုလ်** နဲ့ **မြို့လယ်** ဖောက်သည် အများစုက အလွန် ကျေနပ်တယ်၊ ဒါပေမဲ့ **ဘူတာ** မှာ အနည်းငယ်ပဲ ကျေနပ်တယ် — အများစုက အလယ်အလတ် ဒါမှမဟုတ် နိမ့် လို့ ပြောတယ်။ ဒါကြောင့် ကျေနပ်မှုက ဆိုင်ခွဲပေါ် မူတည်ပြီး ကွင်းဆက်က ဘူတာ ဆိုင်ခွဲမှာ ဘာကွာလဲ ရှာသင့်တယ်။'
        },
        { type: 'code', title: 'pd.crosstab က ရေတွက်ပေးတယ်' }
      ]
    },
    {
      id: 'scatter',
      eyebrow: 'အခန်း ၂ · 2.6 Scatter plot',
      title: 'Scatter plot: quantitative variable နှစ်ခု',
      blocks: [
        {
          type: 'text',
          body: [
            '**Scatter plot** က quantitative variable နှစ်ခုကြား ဆက်နွယ်မှုကို ပြတယ်။ Variable တစ်ခု (**x**) ကို အလျားလိုက် ဝင်ရိုး၊ နောက်တစ်ခု (**y**) ကို ဒေါင်လိုက် ဝင်ရိုးမှာ ထားပြီး element တစ်ခုကို (x, y) မှာ အမှတ်တစ်ခု ချပါ။',
            'အမှတ်တွေက ဘယ်ကနေ ညာ တက်ရင် ဆက်နွယ်မှုက **အပေါင်း (positive)**; ကျရင် **အနုတ် (negative)**; ပုံမရှိတဲ့ တိမ်တိုက် ဖြစ်ရင် မျဉ်းဖြောင့် ဆက်နွယ်မှု **နည်း ဒါမှမဟုတ် မရှိ**။ အမှတ်တွေ မျဉ်းတစ်ကြောင်း တလျှောက် ကျနေရင် trend ကို အနှစ်ချုပ်ဖို့ အဲဒီမျဉ်းကို ဆွဲတယ်။'
          ]
        },
        { type: 'table', columns: ['ကျောင်းသား', 'စာကျက်ချိန် နာရီ (x)', 'စာမေးပွဲ အမှတ် (y)'] },
        {
          type: 'chart',
          title: 'စာကျက်ချိန်နဲ့ ယှဉ်ထားတဲ့ စာမေးပွဲ အမှတ်',
          chart: { xLabel: 'စာကျက်ချိန် နာရီ (x)', yLabel: 'စာမေးပွဲ အမှတ် (y)' },
          caption:
            'ကျောင်းသား ၁ အတွက် x = 1 နဲ့ y = 52 မှာ အမှတ်ချ၊ ဒီလို ဆက်လုပ်ပါ။ အမှတ်တွေက ဘယ်ကနေ ညာ တက်တယ်: ပိုကျက်တဲ့ ကျောင်းသားတွေ အမှတ် ပိုမြင့်လေ့ ရှိတယ် — **အပေါင်း၊ မျဉ်းဖြောင့်နီးပါး** ဆက်နွယ်မှု။ အစက်ချ မျဉ်းက ဒါကို အနှစ်ချုပ်တယ်; ဘယ်လို တွက်လဲ အခန်း ၃ မှာ ပြမယ်။'
        },
        {
          type: 'chart',
          title: 'ဆက်နွယ်မှု သုံးမျိုး',
          chart: {
            charts: [{ title: 'အပေါင်း' }, { title: 'နည်း ဒါမှမဟုတ် မရှိ' }, { title: 'အနုတ်' }]
          }
        },
        {
          type: 'callout',
          title: 'ဆက်နွယ်မှုက အကြောင်းရင်းကို သက်သေမပြ',
          body: 'Scatter plot က နာရီနဲ့ အမှတ် အတူ ပြောင်းတာကို ပြတယ်။ စာကျက်တာက အမှတ်မြင့်တာကို ဖြစ်စေတယ်လို့ သက်သေမပြဘူး — စိတ်အားထက်သန်တဲ့ ကျောင်းသားတွေက ပိုကျက်ပြီး ပိုလည်း အိပ်ကောင်းနိုင်တယ်။ အခန်း ၁ က စမ်းသပ်မှုတွေကို သတိရပါ။'
        },
        { type: 'code', title: 'Scatter plot ကို Python နဲ့' }
      ]
    },
    {
      id: 'misleading',
      eyebrow: 'အခန်း ၂ · 2.7 လှည့်စားတဲ့ graph များ',
      title: 'Graph တွေ ဘယ်လို လှည့်စားနိုင်လဲ',
      blocks: [
        {
          type: 'text',
          body: [
            'Graph က အမှန်ကို ပြသင့်တယ်။ ဒါပေမဲ့ data တူကို ထူးခြားအောင် ဒါမှမဟုတ် ပျင်းစရာအောင် ဆွဲနိုင်တယ်။ မလှည့်စားခံရအောင် နည်းလမ်းတွေကို သင်ထားပါ။',
            'ကော်ဖီဆိုင် တစ်ဆိုင်ရဲ့ လစဉ် ဝင်ငွေက လေးလအတွင်း ထောင်ပေါင်း 152 ကနေ 161 THB အထိ တိုးတယ် — စုစုပေါင်း **6%** လောက်။ ဒေါင်လိုက် ဝင်ရိုးရဲ့ အစမှတ်က ဘာလုပ်လဲ ကြည့်ပါ:'
          ]
        },
        {
          type: 'table',
          columns: ['လ', ...monthMy],
          rows: [['ဝင်ငွေ (ထောင် THB)', '152', '155', '158', '161']]
        },
        {
          type: 'chart',
          title: 'Data တူ၊ အထင်အမြင် နှစ်မျိုး',
          chart: {
            charts: [
              { title: 'ဝင်ရိုး 150 က စ: “အကြီးအကျယ် တိုးတက်!”', chart: { categories: monthMy } },
              { title: 'ဝင်ရိုး 0 က စ: တည်ငြိမ်ပြီး အနည်းငယ် တိုး', chart: { categories: monthMy } }
            ]
          },
          caption:
            'ဘယ်ဘက်မှာ ဝင်ရိုးက 150 က စလို့ ဧပြီ bar က ဇန်နဝါရီထက် **လေးဆလောက်** မြင့်ပုံ ပေါက်တယ်။ ညာဘက်မှာ ဝင်ရိုးက 0 က စတော့ bar တွေ အတူတူနီးပါး ပုံရတယ် — ဒါက အမှန်ပါ: 161 က 152 ထက် 6% ပဲ ပိုတယ်။'
        },
        {
          type: 'table',
          columns: ['လှည့်ကွက်', 'အကျိုးသက်ရောက်မှု', 'ဘာစစ်မလဲ'],
          rows: [
            [
              'ဒေါင်လိုက် ဝင်ရိုး 0 က မစ',
              'အပြောင်းအလဲ အသေးက ကြီးပုံပေါက်',
              'ဝင်ရိုးပေါ်က ဂဏန်းတွေကို ဖတ်'
            ],
            [
              'ဆန့် ဒါမှမဟုတ် ဖိထားတဲ့ ဝင်ရိုး',
              'Trend တွေ မတ် ဒါမှမဟုတ် ပြား ပုံပေါက်',
              'တကယ့် value တွေကို နှိုင်းယှဉ်'
            ],
            [
              'အကျယ် မတူတဲ့ bar များ',
              'မျက်လုံးက အမြင့် မဟုတ်ဘဲ ဧရိယာကို နှိုင်းယှဉ်',
              'Bar တွေ အကျယ် တူရမယ်'
            ],
            [
              'တစ်ဘက်သတ် စာတန်း',
              '“အမြင့်ဆုံး!” နဲ့ “ပန်းတိုင်အောက် နေဆဲ”',
              'Data ကနေ ကိုယ်တိုင် ကောက်ချက်ဆွဲ'
            ]
          ]
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
            'ကျောင်းသား ၄၀ ရှိတဲ့ အတန်းမှာ class 70 < 80 ထဲ ကျောင်းသား ၁၀ ယောက် ရှိတယ်။ Relative frequency က ဘာလဲ?',
          explanation:
            'Relative frequency = frequency ÷ n = 10 ÷ 40 = 0.25 (percent frequency အနေနဲ့ 25%)။'
        },
        {
          type: 'quiz',
          question: '2^K စည်းမျဉ်းအရ value ၁၀၀ ရှိတဲ့ histogram မှာ class ဘယ်နှခု ရှိသင့်လဲ?',
          explanation: '2^6 = 64 က 100 ထက် မကြီးဘူး၊ 2^7 = 128 ကတော့ ကြီးတယ်။ ဒါကြောင့် K = 7။'
        },
        {
          type: 'quiz',
          question:
            'ဆိုင် သုံးဆိုင်ကြား ကျေနပ်မှု (မြင့် / အလယ်အလတ် / နိမ့်) ကို နှိုင်းယှဉ်ဖို့ ဘယ် graph သုံးသင့်လဲ?',
          options: [
            'Scatter plot',
            'Ogive',
            'Row percentage ရဲ့ bar chart ပါတဲ့ cross-tab',
            'Stem-and-leaf display'
          ],
          explanation:
            'ဆိုင်နဲ့ ကျေနပ်မှု နှစ်ခုလုံး qualitative မို့ cross-tabulate လုပ်ပြီး row percentage တွေကို နှိုင်းယှဉ်ပါ။'
        },
        {
          type: 'quiz',
          question: 'Histogram bar တွေ ဘာကြောင့် ထိနေပြီး bar chart bar တွေကြားမှာ ကွက်လပ် ရှိလဲ?',
          options: [
            'ပုံစံသက်သက်; ကွာခြားချက် မရှိ',
            'Histogram class တွေက ဆက်တိုက် ဂဏန်းမျဉ်း တစ်ကြောင်းကို ဖုံးတယ်; bar chart class တွေက သီးခြား အုပ်စုတွေ',
            'Histogram တွေမှာ data အမြဲ ပိုများလို့',
            'Bar chart တွေက ရာခိုင်နှုန်းအတွက်ပဲ'
          ],
          explanation:
            'Quantitative variable က class တွေကြားက ဘယ် value မဆို ယူနိုင်လို့ bar တွေ ထိတယ်။ အုပ်စုတွေက သီးခြားမို့ ခွဲဆွဲတယ်။'
        },
        {
          type: 'callout',
          title: 'အိမ်စာ: ကိုယ်ပိုင် data ကို ဖော်ပြပါ',
          body: 'နှစ်ပတ်လုံး နေ့တိုင်း ထပ်ခါလုပ်တဲ့ အရာတစ်ခု (ကျောင်းသွားချိန်၊ ဖုန်းဂိမ်း၊ ချက်ပြုတ်ချိန်) ကို အချိန်မှတ်ပါ။ ① 2^K စည်းမျဉ်းနဲ့ frequency distribution တည်ဆောက် ② histogram ဆွဲပြီး ပုံသဏ္ဌာန်ကို ဖော်ပြ ③ stem-and-leaf display ဆွဲ ④ သင့် graph ကို မမြင်ဘဲ သူငယ်ချင်း နားလည်နိုင်မယ့် စာကြောင်း နှစ်ကြောင်း ရေးပါ။'
        }
      ]
    }
  ]
}

export default day3
