import type { LessonTranslation } from '@/models/translation.model'
import { fixed } from '@/functions/stats.function'
import {
  binomApprox,
  boxDraw,
  boxFaulty,
  boxN,
  callsAtLeast9,
  callsMu,
  callsPs,
  couponN,
  couponP,
  couponPs,
  drinksMean,
  drinksVar,
  gameMean,
  hyperPs,
  leakN,
  leakP,
  leakSeen,
  leakTail
} from '@/data/lessons/dataScience/day06StatsDiscrete.lesson'

const f2 = (v: number) => fixed(v, 2)
const f4 = (v: number) => fixed(v, 4)

const stats5: LessonTranslation = {
  title: 'စာရင်းအင်း ၅: discrete random variable များ',
  summary:
    'Random variable၊ probability distribution၊ expected value နှင့် standard deviation၊ နာမည်ကြီး distribution သုံးမျိုး — binomial၊ Poisson နှင့် hypergeometric — slider များဖြင့် စူးစမ်းပြီး statistical inference ကို စတင် မြည်းစမ်းခြင်း။',
  topics: [
    'Random variable',
    'Probability distribution',
    'Expected value',
    'Binomial distribution',
    'Poisson distribution',
    'Hypergeometric distribution'
  ],
  sections: [
    {
      id: 'random-variables',
      eyebrow: 'အခန်း ၅ · 5.1 Random variable များ',
      title: 'Random variable အမျိုးအစား နှစ်မျိုး',
      blocks: [
        {
          type: 'text',
          body: [
            '**Random variable** ဆိုတာ value က ကံ (chance) ပေါ် မူတည်တဲ့ ဂဏန်းပါ — စမ်းသပ်မှုရဲ့ ရလဒ်ဖြစ်ပြီး **X** လို စာလုံးကြီးနဲ့ ရေးတယ်။',
            '**Discrete** random variable က value တွေကို **စာရင်းလုပ်** နိုင်တယ် (ရေတွက်: 0, 1, 2, …)။ **Continuous** random variable က interval တစ်ခုထဲက value **ဘာမဆို** ယူနိုင်တယ် (တိုင်းတာ: 4.23 မိနစ်၊ 500.7 ml)။ ဒီအခန်းက discrete random variable အကြောင်းပါ; continuous တွေကို အခန်း ၆ မှာ လေ့လာမယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['Random variable X', 'ဖြစ်နိုင်တဲ့ value များ', 'အမျိုးအစား'],
          rows: [
            ['မှာယူမှု တစ်ခုထဲက သောက်စရာ အရေအတွက်', '1, 2, 3, 4', 'Discrete'],
            ['Coupon သုံးတဲ့ ဖောက်သည် အရေအတွက် (၆ ယောက်ထဲက)', '0, 1, …, 6', 'Discrete'],
            [
              'တစ်နာရီအတွင်း ဖုန်းခေါ်မှု အရေအတွက်',
              '0, 1, 2, … (ပုံသေ အများဆုံး မရှိ)',
              'Discrete'
            ],
            ['ပို့ဆောင်ချိန် (မိနစ်)', 'Value ဘာမဆို၊ ဥပမာ 23.7', 'Continuous'],
            ['ဘူးရဲ့ ဖြည့်ပမာဏ (ml)', 'Value ဘာမဆို၊ ဥပမာ 500.3', 'Continuous']
          ]
        },
        {
          type: 'chart',
          title: 'Discrete: သီးခြား bar များ။ Continuous: ချောမွေ့တဲ့ မျဉ်းကွေး။',
          chart: {
            charts: [
              { title: 'Discrete (မှာယူမှုတစ်ခုရဲ့ သောက်စရာ)' },
              { title: 'Continuous (ဖြည့်ပမာဏ)' }
            ]
          }
        }
      ]
    },
    {
      id: 'distribution',
      eyebrow: 'အခန်း ၅ · 5.2 Discrete probability distribution များ',
      title: 'Probability distribution နှင့် သူ့ရဲ့ expected value',
      blocks: [
        {
          type: 'text',
          body: [
            'Discrete random variable တစ်ခုရဲ့ **probability distribution** က ဖြစ်နိုင်တဲ့ value x တစ်ခုစီကို သူ့ probability p(x) နဲ့ စာရင်းပြုစုတယ်။ Table၊ graph ဒါမှမဟုတ် ပုံသေနည်း ဖြစ်နိုင်တယ်။ စည်းမျဉ်း နှစ်ခု အမြဲ မှန်တယ်: p(x) တိုင်း **≥ 0** နဲ့ **Σp(x) = 1**။',
            'ကော်ဖီဆိုင် တစ်ဆိုင်က မှာယူမှု တစ်ခုထဲက သောက်စရာ အရေအတွက် X ရဲ့ distribution က ဒီလို ဖြစ်တယ်လို့ တွေ့တယ်:'
          ]
        },
        { type: 'table', columns: ['သောက်စရာ x', 'p(x)', 'x · p(x)', '(x − μ)² · p(x)'] },
        {
          type: 'chart',
          title: 'မှာယူမှု တစ်ခုရဲ့ သောက်စရာ distribution (X ≥ 3 ကို အရောင်ခြယ်)',
          chart: { xLabel: 'မှာယူမှုထဲက သောက်စရာ (x)' },
          caption:
            'P(X ≥ 3) = 0.15 + 0.05 = **0.20**: မှာယူမှု ငါးခုမှာ တစ်ခုက သောက်စရာ ၃ ခွက်နဲ့ အထက် ပါတယ်။'
        },
        {
          type: 'text',
          body: [
            `**Mean** ဒါမှမဟုတ် **expected value** က **μ = Σ x·p(x)** = 1(0.5) + 2(0.3) + 3(0.15) + 4(0.05) = သောက်စရာ **${f2(drinksMean)}** ခွက်။ ဒါက **ရေရှည် ပျမ်းမျှ** ပါ: မှာယူမှု ထောင်ချီမှာ ဆိုင်က မှာယူမှု တစ်ခုကို ${f2(drinksMean)} ခွက်လောက် ရောင်းရတယ်၊ မှာယူမှု တစ်ခုချင်းမှာ ${f2(drinksMean)} ခွက် မပါပေမဲ့။`,
            `**Variance** က **σ² = Σ(x − μ)²·p(x)** = ${f4(drinksVar)}၊ ဒါကြောင့် **standard deviation** က σ = √${f4(drinksVar)} = သောက်စရာ **${f4(Math.sqrt(drinksVar))}** ခွက်။`,
            `**ဂိမ်းတစ်ခု တရားမျှတသလား?** အံစာတုံး လှိမ့်ဖို့ 20 THB ပေး; 6 ကျရင် 100 THB နိုင်။ သင့်အမြတ် X က +80 (probability 1/6) ဒါမှမဟုတ် −20 (probability 5/6)။ E(X) = 80(1/6) + (−20)(5/6) = **${f2(gameMean)} THB**။ ပျမ်းမျှ ဂိမ်းတစ်ပွဲကို ${f2(Math.abs(gameMean))} THB လောက် ရှုံးတယ် — ရေရှည်မှာ စီစဉ်သူက နိုင်တယ်။`
          ]
        },
        {
          type: 'chart',
          title: 'အံစာတုံး ဂိမ်း: သင့်အမြတ်',
          chart: { xLabel: 'အမြတ် THB', yLabel: 'Probability' }
        }
      ]
    },
    {
      id: 'binomial',
      eyebrow: 'အခန်း ၅ · 5.3 Binomial distribution',
      title: 'Binomial distribution',
      blocks: [
        {
          type: 'text',
          body: [
            '**Binomial experiment** မှာ ဂုဏ်သတ္တိ လေးခု ရှိတယ်: ① တူညီတဲ့ စမ်းသပ်မှု **n** ကြိမ် ② စမ်းသပ်မှု တစ်ခုစီမှာ ရလဒ် နှစ်ခု၊ “အောင်မြင်” ဒါမှမဟုတ် “ကျရှုံး” ③ အောင်မြင်နိုင်ခြေ **p** က စမ်းသပ်မှုတိုင်းမှာ တူတယ် ④ စမ်းသပ်မှုတွေက **independent**။',
            'ဒါဆိုရင် X = အောင်မြင်မှု အရေအတွက် က **binomial distribution** ရှိတယ်: **P(X = x) = C(n, x) · pˣ · (1 − p)ⁿ⁻ˣ**။ C(n, x) က အောင်မြင်မှု x ခု ဖြစ်နိုင်တဲ့ အစီအစဉ်တွေကို ရေတွက်တယ် (အခန်း ၄)၊ pˣ(1 − p)ⁿ⁻ˣ က အဲဒီ အစီအစဉ် တစ်ခုစီရဲ့ probability ပါ။',
            'Mean က **μ = np** နဲ့ standard deviation က **σ = √(np(1 − p))**။',
            `**ဥပမာ:** ဖောက်သည်တွေရဲ့ ${couponP * 100}% က coupon သုံးတယ်။ နောက် ဖောက်သည် **${couponN}** ယောက်ထဲက ၂ ယောက် အတိအကျ သုံးဖို့ ဘယ်လောက် ဖြစ်နိုင်လဲ? P(X = 2) = C(6, 2)(0.2)²(0.8)⁴ = 15 × 0.04 × 0.4096 = **${f4(couponPs[2]!)}**။`
          ]
        },
        { type: 'table', columns: ['x', 'C(6, x)', 'P(X = x)'] },
        {
          type: 'chart',
          title: `Binomial distribution, n = ${couponN}, p = ${couponP}`,
          chart: { xLabel: 'Coupon သုံးတဲ့ ဖောက်သည် (x)' },
          caption: `အဖြစ်နိုင်ဆုံး ရလဒ်က coupon သုံးသူ ၁ ယောက်; mean က np = ${f2(couponN * couponP)} နဲ့ σ = √(6 × 0.2 × 0.8) = ${f4(Math.sqrt(couponN * couponP * (1 - couponP)))}။`
        },
        {
          type: 'chart',
          title: 'စူးစမ်းပါ: n နဲ့ p ကို ပြောင်းပါ',
          caption:
            'p = 0.5 ဆိုရင် bar တွေ symmetric ဖြစ်တယ်။ p ငယ်ရင် ဘယ်ဘက်မှာ စုတယ် (ညာဘက် skewed); p ကြီးရင် ညာဘက်မှာ။ n တိုးရင် mean np က ညာဘက် ရွှေ့ပြီး distribution ပိုပျံ့တယ်။'
        },
        { type: 'code', title: 'Python နဲ့ binomial probability များ' }
      ]
    },
    {
      id: 'binomial-inference',
      eyebrow: 'အခန်း ၅ · 5.3 Binomial ကို အသုံးချခြင်း',
      title: 'Probability ကို သုံးပြီး အဆိုတစ်ခုကို စစ်ဆေးခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            `ပေးသွင်းသူ တစ်ယောက်က သူ့ဘူးတွေရဲ့ **${leakP * 100}%** ပဲ ယိုတယ်လို့ ဆိုတယ်။ ဘူး **${leakN}** ဘူး စစ်ပြီး **${leakSeen}** ဘူး ယိုတာ တွေ့တယ်။ အဆိုကို ယုံရမလား?`,
            `**ရှားပါးတဲ့ ဖြစ်ရပ်ရဲ့ ယုတ္တိ:** အဆို မှန်တယ်လို့ ယူဆပါ (p = ${leakP})။ ဒါဆို ${leakN} ထဲက ယိုတဲ့ဘူး အရေအတွက် X က binomial ဖြစ်တယ်။ ကျွန်တော်တို့ ရလဒ် **လောက် အစွန်းရောက်တဲ့** ရလဒ် — ၄ ဘူးနဲ့ အထက် — ဘယ်လောက် ဖြစ်နိုင်လဲ? P(X ≥ 4) = 1 − [P(0) + P(1) + P(2) + P(3)] = **${f4(leakTail)}**။`,
            `ဒါက **1,000 မှာ ${fixed(leakTail * 1000, 0)}** လောက်ပါ။ အဆို မှန်ရင် ယိုတာ ၄ ဘူးနဲ့ အထက် မမြင်ရသလောက်ပါ။ ဒါကြောင့် **ယိုနှုန်း အမှန်က 5% ထက် များတယ်လို့ ခိုင်လုံတဲ့ အထောက်အထား** ရှိတယ်။ ဒီလို တွေးနည်း — “အဆို မှန်ရင် ကျွန်တော်တို့ ရလဒ်က အလွန် ထူးခြားမလား?” — က နောက်အခန်းတွေက hypothesis testing ရဲ့ အခြေခံပါ။`
          ]
        },
        { type: 'table', columns: ['ယိုတဲ့ x', 'p = 0.05 ဆိုရင် P(X = x)'] },
        {
          type: 'chart',
          title: 'အဆို မှန်ရင်: P(X ≥ 4) က လိမ္မော်ရောင် အမြီး',
          chart: { xLabel: '20 ထဲက ယိုတဲ့ ဘူး' },
          caption:
            'ယိုနှုန်း တကယ် 5% ဆိုရင် 20 ထဲမှာ ယိုတဲ့ဘူး ၁ ဘူးလောက် မျှော်မှန်းရမယ်။ လိမ္မော်ရောင် bar (4 နဲ့ အထက်) တွေက မမြင်ရသလောက် — အဲဒါက ကျွန်တော်တို့ တကယ် တွေ့ခဲ့တာပါ။'
        }
      ]
    },
    {
      id: 'poisson',
      eyebrow: 'အခန်း ၅ · 5.4 Poisson distribution',
      title: 'Poisson distribution: interval တစ်ခုထဲက အရေအတွက်',
      blocks: [
        {
          type: 'text',
          body: [
            '**Poisson distribution** က အချိန် ဒါမှမဟုတ် နေရာ **interval တစ်ခုထဲမှာ event ဖြစ်တဲ့ အကြိမ်ရေ** ကို ဖော်ပြတယ် — တစ်နာရီ ဖုန်းခေါ်မှု၊ စာမျက်နှာတစ်ခု ရိုက်မှား၊ တစ်မိနစ် ဖောက်သည် — event တွေက independent ဖြစ်ပြီး ပျမ်းမျှနှုန်း μ က ပုံသေ ဖြစ်တဲ့အခါ။',
            '**P(X = x) = e^(−μ) · μˣ ÷ x!**၊ x = 0, 1, 2, … အတွက် (e ≈ 2.71828)။ Mean က **μ** ဖြစ်ပြီး standard deviation က **√μ**။',
            `**ဥပမာ:** ပို့ဆောင်ရေး ဆိုင်တစ်ဆိုင်က တစ်နာရီ ပျမ်းမျှ **μ = ${callsMu} ခေါ်မှု** ရတယ်။ P(ခေါ်မှု ၂ ခု အတိအကျ) = e⁻⁴ · 4² ÷ 2! = 0.0183 × 16 ÷ 2 = **${f4(callsPs[2]!)}**။`
          ]
        },
        { type: 'table', columns: ['ခေါ်မှု x', 'P(X = x)'] },
        {
          type: 'chart',
          title: `Poisson distribution, μ = ${callsMu}`,
          chart: { xLabel: 'တစ်နာရီ ခေါ်မှု (x)' },
          caption: `နာရီ အများစုမှာ ခေါ်မှု 2 ကနေ 6 ရတယ်။ P(9 နဲ့ အထက်) = **${f4(callsAtLeast9)}** (လိမ္မော်)။ ဆိုင်က တစ်နာရီထဲ ခေါ်မှု ၉ ခု ရုတ်တရက် ရရင် ပျမ်းမျှ ၄ အတွက် အလွန် ထူးခြားတယ် — တစ်ခုခု ပြောင်းသွားတဲ့ လက္ခဏာပါ။`
        },
        {
          type: 'chart',
          title: 'စူးစမ်းပါ: ပျမ်းမျှ μ ကို ပြောင်းပါ',
          caption:
            'μ ငယ်ရင် နာရီ အများစုမှာ event 0 ဒါမှမဟုတ် 1 ပဲ ရှိပြီး ညာဘက်ကို အလွန် skewed ဖြစ်တယ်။ μ ကြီးလာရင် distribution က ညာဘက် ရွှေ့ပြီး ပို symmetric ဖြစ်လာတယ်။'
        },
        { type: 'code', title: 'Python နဲ့ Poisson probability များ' }
      ]
    },
    {
      id: 'hypergeometric',
      eyebrow: 'အခန်း ၅ · 5.5 Hypergeometric distribution',
      title: 'Hypergeometric distribution: ပြန်မထည့်ဘဲ sample ယူခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            'Binomial က အောင်မြင်နိုင်ခြေ မပြောင်းဖို့ လိုတယ်။ **သေးငယ်တဲ့** population ကနေ **ပြန်မထည့်ဘဲ** sample ယူရင် အဲဒါ မမှန်တော့ဘူး: ဆွဲတိုင်း ကျန်တာ ပြောင်းသွားတယ်။',
            '**Hypergeometric:** ပစ္စည်း N ခုရှိတဲ့ population မှာ “အောင်မြင်” r ခု ရှိတယ်။ ပြန်မထည့်ဘဲ n ခု ဆွဲ။ **P(X = x) = C(r, x) · C(N − r, n − x) ÷ C(N, n)**: အောင်မြင် x ခုနဲ့ ကျရှုံး n − x ခု ရွေးနည်းကို n ခု ရွေးနည်း အားလုံးနဲ့ စား။',
            `**ဥပမာ:** ဖုန်း **${boxN}** လုံးပါတဲ့ သေတ္တာမှာ ချို့ယွင်းတာ **${boxFaulty}** လုံး ရှိတယ်။ ဝယ်သူက random **${boxDraw}** လုံး စစ်တယ်။ P(ချို့ယွင်းတာ မတွေ့) = C(3, 0)·C(9, 4) ÷ C(12, 4) = 1 × 126 ÷ 495 = **${f4(hyperPs[0]!)}**။`
          ]
        },
        {
          type: 'table',
          columns: [
            'တွေ့တဲ့ ချို့ယွင်း x',
            'Hypergeometric P(X = x)',
            'Binomial ခန့်မှန်းချက် (p = 3/12)'
          ]
        },
        {
          type: 'chart',
          title: '12 လုံးထဲက 4 လုံး စစ်ရင် တွေ့တဲ့ ချို့ယွင်း ဖုန်း',
          chart: { xLabel: 'တွေ့တဲ့ ချို့ယွင်း ဖုန်း (x)' },
          caption: `ဝယ်သူက ချို့ယွင်း ဖုန်း ၃ လုံးလုံး လွတ်သွားဖို့ ${fixed(hyperPs[0]! * 100, 1)}% ဖြစ်နိုင်တယ်။ Population က သေးလွန်းလို့ ဆွဲတိုင်း အခွင့်အရေး တကယ် ပြောင်းသွားတဲ့အတွက် binomial က တခြား အဖြေ (${f4(binomApprox[0]!)}) ပေးတယ်။ N က n ထက် အများကြီး ကြီးရင် နှစ်ခု အတူတူနီးပါး ဖြစ်တယ်။`
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
          question: 'ဘယ်ဟာက discrete random variable လဲ?',
          options: [
            'ကျောင်းသားရဲ့ အရပ်',
            'ဒီနေ့ ရတဲ့ email အရေအတွက်',
            '100 m ပြေးချိန်',
            'ပါဆယ်ရဲ့ အလေးချိန်'
          ],
          explanation:
            'Email တွေကို ရေတွက်နိုင်တယ် (0, 1, 2, …)။ ကျန်တာတွေကို တိုင်းတာပြီး interval ထဲက value ဘာမဆို ယူနိုင်တယ်။'
        },
        {
          type: 'quiz',
          question: 'X က value 0 နဲ့ 10 ကို probability 0.6 နဲ့ 0.4 နဲ့ ယူတယ်။ E(X) က ဘာလဲ?',
          explanation: 'E(X) = 0(0.6) + 10(0.4) = 4။'
        },
        {
          type: 'quiz',
          question:
            'စာမေးပွဲမှာ ရွေးစရာ ၄ ခုစီပါတဲ့ မေးခွန်း ၁၀ ခု ရှိတယ်။ ကျောင်းသားက အဖြေတိုင်းကို ခန့်မှန်းတယ်။ မှန်တဲ့ အဖြေ အရေအတွက်ကို ဘယ် distribution က ဖော်ပြလဲ?',
          options: [
            'μ = 10 ရှိတဲ့ Poisson',
            'n = 10၊ p = 0.25 ရှိတဲ့ Binomial',
            'Hypergeometric',
            'n = 4၊ p = 0.10 ရှိတဲ့ Binomial'
          ],
          explanation:
            'Independent စမ်းသပ်မှု ၁၀ ခု၊ တစ်ခုစီ မှန်ဖို့ probability 1/4: binomial၊ n = 10၊ p = 0.25။ မျှော်မှန်း အမှတ် np = 2.5။'
        },
        {
          type: 'quiz',
          question:
            'Website တစ်ခုက တစ်နာရီ ပျမ်းမျှ sign-up ၃ ခု ရတယ်။ တစ်နာရီထဲက sign-up တွေကို ဘယ် distribution နဲ့ ပုံစံချမလဲ?',
          options: ['Binomial', 'μ = 3 ရှိတဲ့ Poisson', 'Hypergeometric', 'Normal'],
          explanation: 'ပုံသေ ပျမ်းမျှနှုန်းနဲ့ interval ထဲက event တွေကို ရေတွက်ခြင်း: Poisson။'
        },
        {
          type: 'callout',
          title: 'အိမ်စာ: ခန့်မှန်းဖြေတဲ့ စာမေးပွဲ',
          body: 'အပေါ်က မေးခွန်း ၁၀ ခု ခန့်မှန်းဖြေ စာမေးပွဲအတွက် binomial ပုံသေနည်းနဲ့ x = 0 ကနေ 10 အထိ P(X = x) ကို တွက်ပြီး distribution ဆွဲပါ၊ P(X ≥ 6) ကို ရှာပါ။ ကျောင်းသားက ၆ မှတ်နဲ့ အထက် ရရင် ခန့်မှန်းဖြေရုံပဲလို့ ယုံမလား? ရှားပါးတဲ့ ဖြစ်ရပ် ယုတ္တိကို သုံးပြီး ရှင်းပြပါ။'
        }
      ]
    }
  ]
}

export default stats5
