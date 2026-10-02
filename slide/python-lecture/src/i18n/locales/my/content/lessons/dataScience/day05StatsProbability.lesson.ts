import type { LessonTranslation } from '@/models/translation.model'
import { choose, fixed, permutations } from '@/functions/stats.function'
import {
  defectRate,
  falsePositive,
  pDiseaseGivenPositive,
  pPositive,
  prevalence,
  sensitivity,
  social,
  socialEither,
  tab
} from '@/data/lessons/dataScience/day05StatsProbability.lesson'

const f3 = (v: number) => fixed(v, 3)
const f4 = (v: number) => fixed(v, 4)
const branchMy = ['မြို့လယ်', 'တက္ကသိုလ်', 'ဘူတာ']
const levelMy = ['မြင့်', 'အလယ်အလတ်', 'နိမ့်']

const stats4: LessonTranslation = {
  title: 'စာရင်းအင်း ၄: probability (ဖြစ်နိုင်ခြေ)',
  summary:
    'Probability ရဲ့ အဓိပ္ပာယ်၊ sample space နှင့် event၊ complement၊ addition နှင့် multiplication rule၊ conditional probability နှင့် independence၊ Bayes’ theorem နှင့် counting rule များ — အံစာတုံး simulation၊ Venn diagram နှင့် probability tree များဖြင့်။',
  topics: [
    'Probability',
    'Sample space',
    'Addition rule',
    'Conditional probability',
    'Independence',
    'Bayes’ theorem',
    'Counting rule'
  ],
  sections: [
    {
      id: 'probability',
      eyebrow: 'အခန်း ၄ · 4.1 Probability ရဲ့ သဘောတရား',
      title: 'Probability ဆိုတာ ဘာလဲ?',
      blocks: [
        {
          type: 'text',
          body: [
            '**Experiment (စမ်းသပ်မှု)** ဆိုတာ ရလဒ် မသေချာတဲ့ လုပ်ငန်းစဉ် ဘာမဆိုပါ: အကြွေစေ့ပစ်၊ အံစာတုံးလှိမ့်၊ ဖောက်သည်ကို မေးခွန်းမေး။ ရလဒ်တစ်ခုရဲ့ **probability** က **0** (မဖြစ်နိုင်) ကနေ **1** (သေချာ) အထိ ဂဏန်းတစ်ခုဖြစ်ပြီး ဘယ်လောက် ဖြစ်နိုင်လဲ တိုင်းတယ်။ ရလဒ် အားလုံးရဲ့ probability တွေကို ပေါင်းရင် 1 ရတယ်။',
            'Probability ရှာဖို့ နည်းလမ်း သုံးမျိုး ရှိတယ်:',
            '**① Classical နည်း** — ရလဒ်အားလုံး **ဖြစ်နိုင်ခြေ တူ** ရင် ယုတ္တိကို သုံး: P = (event ထဲက ရလဒ် အရေအတွက်) ÷ (ရလဒ် စုစုပေါင်း)။ မှန်ကန်တဲ့ အံစာတုံး: P(6) = 1/6။',
            '**② Relative frequency နည်း** — စမ်းသပ်မှုကို အကြိမ်များစွာ ထပ်လုပ်ပြီး ရလဒ် ဖြစ်ခဲ့တဲ့ အချိုးကို သုံး။ စစ်တမ်းကောက်ခံထားတဲ့ ဖောက်သည် 1,000 ထဲက 140 က ရေခဲလက်ဖက်ရည် ကြိုက်ရင် P ≈ 140/1,000 = 0.14။',
            '**③ Subjective နည်း** — စမ်းသပ်မှုကို ထပ်မလုပ်နိုင်ရင် အတွေ့အကြုံ ဒါမှမဟုတ် ကျွမ်းကျင်သူ ဆုံးဖြတ်ချက်ကို သုံး: “ဒီဆိုင်ခွဲ အသစ် အောင်မြင်ဖို့ 70% ဖြစ်နိုင်တယ်လို့ ထင်တယ်။”'
          ]
        },
        {
          type: 'table',
          columns: ['နည်း', 'ဘယ်အချိန် သုံးမလဲ', 'ဥပမာ'],
          rows: [
            ['Classical', 'ရလဒ်အားလုံး ဖြစ်နိုင်ခြေ တူ', 'P(ခေါင်း) = 1/2; P(အံစာတုံး 6) = 1/6'],
            [
              'Relative frequency',
              'အကြိမ်များစွာ ထပ်လုပ် ဒါမှမဟုတ် ကြည့်နိုင်',
              'ဖောက်သည် 1,000 ထဲက 140 → 0.14'
            ],
            ['Subjective', 'တစ်ကြိမ်တည်း အခြေအနေ', 'မန်နေဂျာရဲ့ ဆုံးဖြတ်ချက် 0.7']
          ]
        },
        {
          type: 'chart',
          title: 'စမ်းကြည့်ပါ: relative frequency က probability ဆီ ငြိမ်သွားတယ်',
          chart: { eventLabel: '6 ကျတဲ့ အကြိမ်ရေ' },
          caption:
            'နည်းနည်း လှိမ့်ရင် 6 ရဲ့ အချိုးက ခုန်နေတယ်။ အကြိမ် ထောင်ချီ လှိမ့်ရင် 1/6 ≈ 0.167 နား ငြိမ်သွားတယ်။ ဒါက probability ရဲ့ **ရေရှည် relative frequency** သဘောတရားဖြစ်ပြီး နောက်အခန်းတွေမှာ statistical inference အတွက် သုံးတဲ့ အဓိပ္ပာယ်ပါ။'
        }
      ]
    },
    {
      id: 'sample-space',
      eyebrow: 'အခန်း ၄ · 4.2 Sample space နှင့် event',
      title: 'Sample space နှင့် event များ',
      blocks: [
        {
          type: 'text',
          body: [
            '**Sample space** ဆိုတာ စမ်းသပ်မှုတစ်ခုရဲ့ ဖြစ်နိုင်တဲ့ ရလဒ် **အားလုံး** ရဲ့ စာရင်းပါ။ **Event** ဆိုတာ ရလဒ်တွေရဲ့ အစုပါ။',
            'အံစာတုံး နှစ်တုံး လှိမ့်ရင် ဖြစ်နိုင်ခြေ တူတဲ့ ရလဒ် 6 × 6 = **36** ခု ရှိတယ်၊ အောက်မှာ (ပထမ အံစာတုံး၊ ဒုတိယ အံစာတုံး) အဖြစ် ပြထားတယ်။ “စုစုပေါင်း 7” event မှာ အရောင်ခြယ်ထားတဲ့ ရလဒ် ၆ ခု ပါလို့ classical နည်းအရ P(စုစုပေါင်း = 7) = 6/36 = **1/6 ≈ 0.167**။'
          ]
        },
        {
          type: 'chart',
          title: 'အံစာတုံး နှစ်တုံးရဲ့ sample space — event: စုစုပေါင်း = 7',
          chart: { rowLabel: 'အံ ၁ \\ အံ ၂', columnLabel: 'ဒုတိယ အံစာတုံး' },
          caption:
            'ကွက်တိုင်းက ရလဒ် တစ်ခုပါ။ အရောင်ခြယ်ထားတဲ့ ကွက်တွေကို ရေတွက်ပြီး 36 နဲ့ စားရင် probability ရတယ်။'
        },
        {
          type: 'table',
          columns: ['စုစုပေါင်း', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          rows: [
            ['ရလဒ်များ', '1', '2', '3', '4', '5', '6', '5', '4', '3', '2', '1'],
            ['Probability', ...[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((k) => f3(k / 36))]
          ]
        },
        {
          type: 'chart',
          title: 'စုစုပေါင်း တစ်ခုစီရဲ့ probability',
          chart: { xLabel: 'အံစာတုံး နှစ်တုံးရဲ့ စုစုပေါင်း', yLabel: 'Probability' },
          caption:
            'ကွက် အများဆုံးက 7 ဖြစ်လို့ 7 က အဖြစ်နိုင်ဆုံး စုစုပေါင်းပါ။ Probability ၁၁ ခုကို ပေါင်းရင် 36/36 = 1။'
        },
        {
          type: 'chart',
          title: 'Simulation နဲ့ စစ်ပါ: စုစုပေါင်း = 7',
          chart: { eventLabel: '7 ကျတဲ့ အကြိမ်ရေ' }
        }
      ]
    },
    {
      id: 'complement-addition',
      eyebrow: 'အခန်း ၄ · 4.3 Probability စည်းမျဉ်းများ',
      title: 'Complement နှင့် addition rule',
      blocks: [
        {
          type: 'text',
          body: [
            '**Complement:** “A မဟုတ်” က A ရဲ့ အပြင်က အရာအားလုံးပါ၊ Ā လို့ ရေးတယ်။ တစ်ခုခုတော့ ဖြစ်ရမှာမို့ **P(Ā) = 1 − P(A)**။ အံစာတုံး နှစ်တုံးနဲ့ P(တူတွဲ) = 6/36၊ ဒါကြောင့် P(တူတွဲ မဟုတ်) = 1 − 6/36 = **30/36 ≈ 0.833**။',
            '**Union နှင့် intersection:** “A **သို့မဟုတ်** B” (A ∪ B) က A၊ B ဒါမှမဟုတ် နှစ်ခုလုံး ဖြစ်တာ။ “A **နှင့်** B” (A ∩ B) က နှစ်ခုလုံး ဖြစ်တာ။',
            '**Addition rule:** P(A သို့မဟုတ် B) = P(A) + P(B) − P(A နှင့် B)။ P(A) နဲ့ P(B) ကို ပေါင်းရင် ထပ်နေတဲ့ အပိုင်းကို နှစ်ခါ ရေတွက်မိလို့ နုတ်ရတယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['ကျောင်းသား ၂၀၀ စစ်တမ်း', 'အရေအတွက်', 'Probability'],
          rows: [
            [
              'TikTok သုံး (A)',
              String(social.tiktok),
              `${social.tiktok}/200 = ${fixed(social.tiktok / 200, 2)}`
            ],
            [
              'Facebook သုံး (B)',
              String(social.facebook),
              `${social.facebook}/200 = ${fixed(social.facebook / 200, 2)}`
            ],
            [
              'နှစ်ခုလုံး သုံး (A နှင့် B)',
              String(social.both),
              `${social.both}/200 = ${fixed(social.both / 200, 2)}`
            ],
            [
              'TikTok သို့မဟုတ် Facebook သုံး (A သို့မဟုတ် B)',
              `${social.tiktok} + ${social.facebook} − ${social.both} = ${socialEither}`,
              `${fixed(socialEither / 200, 2)}`
            ],
            ['နှစ်ခုလုံး မသုံး', String(200 - socialEither), fixed((200 - socialEither) / 200, 2)]
          ]
        },
        {
          type: 'chart',
          title: 'Venn diagram: A သို့မဟုတ် B (အရောင်ခြယ်)',
          chart: { a: 'TikTok (A)', b: 'Facebook (B)' },
          caption: `ဂဏန်းတွေက နယ်မြေ တစ်ခုစီက ကျောင်းသားတွေပါ: TikTok ပဲ 70၊ နှစ်ခုလုံး 50၊ Facebook ပဲ 40၊ နှစ်ခုလုံး မသုံး 40။ အရောင်ခြယ် ဧရိယာ (A သို့မဟုတ် B) မှာ 70 + 50 + 40 = ${socialEither} ယောက် ရှိလို့ P(A သို့မဟုတ် B) = ${socialEither}/200 = **${fixed(socialEither / 200, 2)}**။ 120 + 90 ပေါင်းရင် အလယ်က 50 ကို နှစ်ခါ ရေတွက်မိမယ်။`
        },
        {
          type: 'chart',
          title: 'Diagram တူပေါ်က တခြား event များ',
          chart: {
            charts: [
              { title: 'A နှင့် B' },
              { title: 'A ဖြစ်ပြီး B မဖြစ်' },
              { title: 'A မဟုတ် (complement)' }
            ]
          }
        },
        {
          type: 'callout',
          title: 'အပြန်အလှန် ချန်လှပ်တဲ့ (mutually exclusive) event များ',
          body: 'A နဲ့ B **အတူ မဖြစ်နိုင်** ရင် (ထပ်နေတာ မရှိ) **mutually exclusive** ဖြစ်ပြီး P(A နှင့် B) = 0၊ စည်းမျဉ်းက ရိုးရိုး P(A သို့မဟုတ် B) = P(A) + P(B) ဖြစ်သွားတယ်။ ဥပမာ: အံစာတုံး တစ်တုံးမှာ 1 ကျ ဒါမှမဟုတ် 6 ကျ: 1/6 + 1/6 = 2/6။'
        }
      ]
    },
    {
      id: 'contingency',
      eyebrow: 'အခန်း ၄ · 4.3 Probability စည်းမျဉ်းများ',
      title: 'Contingency table ကနေ probability များ',
      blocks: [
        {
          type: 'text',
          body: [
            'အခန်း ၂ က ကော်ဖီဆိုင် ဖောက်သည် ၉၀ ရဲ့ cross-tab က **contingency table** လည်း ဖြစ်တယ်။ ဖောက်သည် တစ်ယောက်ကို random ရွေးပါ: ကွက် တစ်ကွက် ÷ 90 က အဲဒီ **ပေါင်းစပ်မှု** ရဲ့ probability ဖြစ်ပြီး row ဒါမှမဟုတ် column total ÷ 90 က **event တစ်ခုတည်း** ရဲ့ probability ပါ။'
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
          type: 'table',
          columns: ['Event', 'တွက်ချက်မှု', 'Probability'],
          rows: [
            ['ကျေနပ်မှု မြင့်', `${tab.columnTotals[0]} / 90`, f3(tab.columnTotals[0]! / 90)],
            ['ဘူတာ', `${tab.rowTotals[2]} / 90`, f3(tab.rowTotals[2]! / 90)],
            ['ဘူတာ နှင့် နိမ့်', `${tab.counts[2]![2]} / 90`, f3(tab.counts[2]![2]! / 90)],
            [
              'ဘူတာ သို့မဟုတ် နိမ့်',
              `(${tab.rowTotals[2]} + ${tab.columnTotals[2]} − ${tab.counts[2]![2]}) / 90`,
              f3((tab.rowTotals[2]! + tab.columnTotals[2]! - tab.counts[2]![2]!) / 90)
            ]
          ]
        },
        {
          type: 'chart',
          title: 'ဘူတာ သို့မဟုတ် နိမ့် ကို Venn diagram ပေါ်မှာ',
          chart: { a: 'ဘူတာ', b: 'နိမ့်' },
          caption:
            'Addition rule ပြန်ပါ: ဘူတာ ဆိုင်ခွဲလည်းဖြစ် နိမ့်လည်း ဖြစ်တဲ့ ဖောက်သည် ၁၂ ယောက်ကို တစ်ခါပဲ ရေတွက်တယ်။'
        }
      ]
    },
    {
      id: 'conditional',
      eyebrow: 'အခန်း ၄ · 4.4 Conditional probability',
      title: 'Conditional probability နှင့် independence',
      blocks: [
        {
          type: 'text',
          body: [
            '**Conditional probability** P(A | B) — “B **ဖြစ်ပြီးသား ဆိုရင်** A” — က B ဖြစ်ပြီးမှန်း သိနေတဲ့အခါ A ရဲ့ probability ပါ။ B ကို သိတာက sample space ကို B ပဲ ကျန်အောင် ကျဉ်းစေတယ်: **P(A | B) = P(A နှင့် B) ÷ P(B)**။',
            `**ဥပမာ:** ဖောက်သည် တစ်ယောက် ရွေးပြီး တက္ကသိုလ် ဆိုင်ခွဲက ဖြစ်တယ်လို့ ပြောတယ်။ P(မြင့် | တက္ကသိုလ်) = P(မြင့် နှင့် တက္ကသိုလ်) ÷ P(တက္ကသိုလ်) = (${tab.counts[1]![0]}/90) ÷ (${tab.rowTotals[1]}/90) = ${tab.counts[1]![0]}/${tab.rowTotals[1]} = **${f3(tab.counts[1]![0]! / tab.rowTotals[1]!)}**။ Table ထဲမှာ တက္ကသိုလ် row ကိုပဲ ကြည့်ရုံပါ။`,
            '**Independence (လွတ်လပ်မှု):** B ကို သိတာက A ရဲ့ ဖြစ်နိုင်ခြေကို မပြောင်းရင် A နဲ့ B က **independent**: **P(A | B) = P(A)**။ မဟုတ်ရင် **dependent** (မှီခိုတယ်)။'
          ]
        },
        {
          type: 'table',
          columns: ['Probability', 'Value', 'အဓိပ္ပာယ်'],
          rows: [
            ['P(မြင့်)', f3(tab.columnTotals[0]! / 90), 'ဖောက်သည် ဘယ်သူမဆို'],
            [
              'P(မြင့် | မြို့လယ်)',
              f3(tab.counts[0]![0]! / tab.rowTotals[0]!),
              'မြို့လယ် ဖောက်သည်တွေပဲ'
            ],
            [
              'P(မြင့် | တက္ကသိုလ်)',
              f3(tab.counts[1]![0]! / tab.rowTotals[1]!),
              'တက္ကသိုလ် ဖောက်သည်တွေပဲ'
            ],
            ['P(မြင့် | ဘူတာ)', f3(tab.counts[2]![0]! / tab.rowTotals[2]!), 'ဘူတာ ဖောက်သည်တွေပဲ']
          ]
        },
        {
          type: 'chart',
          title: 'ဆိုင်ခွဲကို သိတာက P(မြင့်) ကို ပြောင်းသလား?',
          chart: {
            categories: ['P(မြင့်)', 'မြို့လယ် ဆိုရင်', 'တက္ကသိုလ် ဆိုရင်', 'ဘူတာ ဆိုရင်'],
            yLabel: 'ကျေနပ်မှု မြင့်ရဲ့ probability'
          },
          caption: `စုစုပေါင်း P(မြင့်) = ${f3(tab.columnTotals[0]! / 90)} ဖြစ်ပေမဲ့ တက္ကသိုလ်မှာ ${f3(tab.counts[1]![0]! / tab.rowTotals[1]!)} နဲ့ ဘူတာမှာ ${f3(tab.counts[2]![0]! / tab.rowTotals[2]!)} ပဲ ရှိတယ်။ ဆိုင်ခွဲကို သိတာက probability ကို **ပြောင်းစေ** လို့ ကျေနပ်မှုနဲ့ ဆိုင်ခွဲက **dependent** ဖြစ်တယ်။`
        },
        {
          type: 'callout',
          title: 'Independent ဥပမာ',
          body: 'အံစာတုံး နှစ်တုံး လှိမ့်ပါ။ P(ဒုတိယ အံ 6) = 1/6 ဖြစ်ပြီး P(ဒုတိယ အံ 6 | ပထမ အံ 6) ကလည်း 1/6 ပဲ — အံစာတုံးတွေ အချင်းချင်း မသက်ရောက်ဘူး။ ဒီ event တွေက independent ပါ။'
        }
      ]
    },
    {
      id: 'multiplication',
      eyebrow: 'အခန်း ၄ · 4.4 Multiplication rule',
      title: 'Multiplication rule နှင့် probability tree များ',
      blocks: [
        {
          type: 'text',
          body: [
            '**Multiplication rule:** P(A နှင့် B) = P(A) × P(B | A)။ A နဲ့ B က **independent** ဆိုရင် ရိုးရိုး **P(A) × P(B)** ဖြစ်တယ်။',
            `စက်တစ်လုံးက ပစ္စည်း **${defectRate * 100}%** ကို ချို့ယွင်းအောင် ထုတ်တယ်၊ တစ်ခုနဲ့ တစ်ခု independent ပါ။ ပစ္စည်း နှစ်ခု စစ်ပါ။ **Probability tree** က လမ်းကြောင်း တိုင်းကို ပြတယ်: လမ်းကြောင်း တစ်လျှောက် မြှောက်ရင် အဲဒီ လမ်းကြောင်းရဲ့ probability ရပြီး ကိုယ့် event ဖြစ်စေတဲ့ လမ်းကြောင်းတွေကို ပေါင်းပါ။`
          ]
        },
        {
          type: 'chart',
          title: 'ပစ္စည်း နှစ်ခု စစ်တယ် — ချို့ယွင်းတာ တစ်ခုတည်း ပါတဲ့ လမ်းကြောင်းများ',
          chart: {
            branches: [
              { label: 'ချို့ယွင်း', children: [{ label: 'ချို့ယွင်း' }, { label: 'ကောင်း' }] },
              { label: 'ကောင်း', children: [{ label: 'ချို့ယွင်း' }, { label: 'ကောင်း' }] }
            ]
          }
        },
        {
          type: 'table',
          columns: ['Event', 'တွက်ချက်မှု', 'Probability'],
          rows: [
            ['နှစ်ခုလုံး ချို့ယွင်း', `${defectRate} × ${defectRate}`, f4(defectRate ** 2)],
            [
              'တစ်ခုတည်း ချို့ယွင်း',
              `${defectRate} × ${1 - defectRate} + ${1 - defectRate} × ${defectRate}`,
              f4(2 * defectRate * (1 - defectRate))
            ],
            [
              'နှစ်ခုလုံး ကောင်း',
              `${1 - defectRate} × ${1 - defectRate}`,
              f4((1 - defectRate) ** 2)
            ],
            ['စုစုပေါင်း', '', '1.0000']
          ]
        }
      ]
    },
    {
      id: 'bayes',
      eyebrow: 'အခန်း ၄ · 4.5 Bayes’ theorem',
      title: 'Bayes’ theorem: သတင်းအချက်အလက် အသစ်နဲ့ probability ကို အပ်ဒိတ်လုပ်ခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            '**Bayes’ theorem** က **prior** probability (သတင်းအသစ် မတိုင်ခင်) ကို **posterior** probability (သတင်းအသစ် ရပြီးနောက်) အဖြစ် ပြောင်းတယ်: **P(A | B) = P(A) · P(B | A) ÷ P(B)**၊ P(B) ကို B ဆီ ရောက်တဲ့ tree လမ်းကြောင်းတွေ ပေါင်းပြီး ရတယ်။',
            `**ဆေးစစ်ချက် တစ်ခု။** လူတွေရဲ့ ${prevalence * 100}% က ရောဂါ ရှိတယ် (prior)။ စစ်ချက်က ရောဂါရှိသူ ${sensitivity * 100}% အတွက် positive ပြပေမဲ့ ကျန်းမာသူ ${falsePositive * 100}% အတွက်လည်း positive ပြတယ်။ သင့်စစ်ချက် positive ဆိုရင် ရောဂါ ရှိဖို့ ဘယ်လောက် ဖြစ်နိုင်လဲ?`
          ]
        },
        {
          type: 'chart',
          title: 'Probability tree: ရောဂါ၊ ပြီးမှ စစ်ချက် ရလဒ်',
          chart: {
            branches: [
              { label: 'ရောဂါရှိ', children: [{ label: 'Positive' }, { label: 'Negative' }] },
              { label: 'ကျန်းမာ', children: [{ label: 'Positive' }, { label: 'Negative' }] }
            ]
          }
        },
        {
          type: 'table',
          columns: ['အဆင့်', 'တွက်ချက်မှု', 'ရလဒ်'],
          rows: [
            [
              'P(positive နှင့် ရောဂါရှိ)',
              `${prevalence} × ${sensitivity}`,
              f4(prevalence * sensitivity)
            ],
            [
              'P(positive နှင့် ကျန်းမာ)',
              `${1 - prevalence} × ${falsePositive}`,
              f4((1 - prevalence) * falsePositive)
            ],
            ['P(positive)', 'အရောင်ခြယ် လမ်းကြောင်း နှစ်ခုကို ပေါင်း', f4(pPositive)],
            [
              'P(ရောဂါရှိ | positive)',
              `${f4(prevalence * sensitivity)} ÷ ${f4(pPositive)}`,
              f3(pDiseaseGivenPositive)
            ]
          ]
        },
        {
          type: 'chart',
          title: 'စစ်ဆေးခံ လူ 10,000 ထဲမှာ',
          chart: {
            categories: ['Positive ဖြစ်ပြီး ဖျား', 'Positive ဖြစ်ပြီး ကျန်းမာ'],
            yLabel: 'Positive ပြတဲ့ လူ'
          },
          caption: `Positive ရလဒ်တွေရဲ့ **${fixed(pDiseaseGivenPositive * 100, 1)}%** ပဲ အမှန်ပါ! ရောဂါက ရှားလို့ ကျန်းမာသူ 9,900 ထဲက 5% false positive (${Math.round(10000 * (1 - prevalence) * falsePositive)}) က true positive (${Math.round(10000 * prevalence * sensitivity)}) ထက် များတယ်။ ဒါကြောင့် ဆရာဝန်တွေက positive ဖြစ်တဲ့ စစ်ဆေးချက်ကို ထပ်စစ်တာပါ။`
        }
      ]
    },
    {
      id: 'counting',
      eyebrow: 'အခန်း ၄ · 4.6 Counting rule များ',
      title: 'ရေတွက်ခြင်း စည်းမျဉ်းများ',
      blocks: [
        {
          type: 'text',
          body: [
            'Classical နည်းက ရလဒ်တွေရဲ့ **အရေအတွက်** လိုတယ်။ စာရင်းလုပ်ဖို့ များလွန်းရင် စည်းမျဉ်းတွေနဲ့ ရေတွက်တယ်။',
            '**Multiplication principle:** ရွေးချယ်မှု တစ်ခုကို m နည်း၊ ဒုတိယကို n နည်း လုပ်နိုင်ရင် အတူတူ **m × n** နည်း ရှိတယ်။ ကော်ဖီဆိုင်မှာ size ၃ မျိုးနဲ့ သောက်စရာ ၄ မျိုး ရှိတယ်: 3 × 4 = **12** မှာယူမှု မျိုး။',
            `**Permutation** (အစီအစဉ် အရေးကြီး): n ခုထဲက k ခုကို အစီအစဉ်နဲ့ စီ: **n! ÷ (n − k)!**။ ကျောင်းသား ၁၀ ထဲက ပထမ၊ ဒုတိယ၊ တတိယ ဆု ရွေး: 10 × 9 × 8 = **${permutations(10, 3)}**။`,
            `**Combination** (အစီအစဉ် အရေးမကြီး): n ခုထဲက k ခု ရွေး: **n! ÷ (k!(n − k)!)**၊ C(n, k) လို့ ရေးတယ်။ ကျောင်းသား ၁၀ ထဲက ၃ ယောက် အသင်း ရွေး: ${permutations(10, 3)} ÷ 3! = **${choose(10, 3)}**။`
          ]
        },
        {
          type: 'chart',
          title: 'Multiplication principle: size ၃ × သောက်စရာ ၄ = မှာယူမှု ၁၂',
          chart: {
            rows: ['အသေး', 'အလတ်', 'အကြီး'],
            columns: ['လက်ဖက်ရည်', 'ကော်ဖီ', 'ဖျော်ရည်', 'Smoothie'],
            rowLabel: 'Size \\ သောက်စရာ'
          }
        },
        {
          type: 'table',
          columns: ['မေးခွန်း', 'စည်းမျဉ်း', 'တွက်ချက်မှု', 'အဖြေ'],
          rows: [
            ['Size × သောက်စရာ', 'Multiplication principle', '3 × 4', '12'],
            [
              '၁၀ ယောက်ထဲက ပထမ၊ ဒုတိယ၊ တတိယ ဆု',
              'Permutation',
              '10 × 9 × 8',
              String(permutations(10, 3))
            ],
            ['၁၀ ယောက်ထဲက ၃ ယောက် အသင်း', 'Combination', '720 ÷ 6', String(choose(10, 3))],
            [
              'ထီ: 45 ထဲက ဂဏန်း ၆ လုံး',
              'Combination',
              'C(45, 6)',
              choose(45, 6).toLocaleString('en-US')
            ]
          ]
        },
        { type: 'code', title: 'Python နဲ့ ရေတွက်ခြင်း' }
      ]
    },
    {
      id: 'review',
      eyebrow: 'ပြန်လည်သုံးသပ်ခြင်း',
      title: 'ဒါတွေကို ဖြေနိုင်လား?',
      blocks: [
        {
          type: 'quiz',
          question: 'P(မနက်ဖြန် မိုးရွာ) = 0.3။ P(မိုးမရွာ) က ဘာလဲ?',
          options: ['0.3', '0.7', '1.3', 'မပြောနိုင်'],
          explanation: 'Complement rule: 1 − 0.3 = 0.7။'
        },
        {
          type: 'quiz',
          question: 'P(A) = 0.5၊ P(B) = 0.4၊ P(A နှင့် B) = 0.2။ P(A သို့မဟုတ် B) က ဘာလဲ?',
          explanation: 'Addition rule: 0.5 + 0.4 − 0.2 = 0.7။'
        },
        {
          type: 'quiz',
          question:
            'Event နှစ်ခုက independent ဖြစ်တယ်။ P(A) = 0.5 နဲ့ P(B) = 0.2။ P(A နှင့် B) က ဘာလဲ?',
          explanation: 'Independent event တွေအတွက် မြှောက်ပါ: 0.5 × 0.2 = 0.1။'
        },
        {
          type: 'quiz',
          question:
            'ခရီးထွက်ဖို့ စာအုပ် ၅ အုပ်ထဲက ၂ အုပ် ရွေးနည်း ဘယ်နှနည်း ရှိလဲ (အစီအစဉ် အရေးမကြီး)?',
          explanation: 'Combination: C(5, 2) = 5 × 4 ÷ 2 = 10။'
        },
        {
          type: 'callout',
          title: 'အိမ်စာ: Bayes ကို စမ်းပါ',
          body: 'ဆေးစစ်ချက် ဂဏန်းတွေကို ပြောင်းပါ: လူတွေရဲ့ 10% က ရောဂါ ရှိရင် P(ရောဂါ | positive) ဘာဖြစ်မလဲ? False-positive နှုန်း 1% အထိ ကျရင်ကော? ဖြစ်ရပ် တစ်ခုစီအတွက် tree ဆွဲပြီး Python စာကြောင်း အနည်းငယ်နဲ့ အဖြေကို စစ်ပါ။'
        }
      ]
    }
  ]
}

export default stats4
