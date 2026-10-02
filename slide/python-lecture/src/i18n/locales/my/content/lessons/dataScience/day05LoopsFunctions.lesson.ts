import type { LessonTranslation } from '@/models/translation.model'

const day5: LessonTranslation = {
  title: 'Data အတွက် ဆုံးဖြတ်ချက်၊ loop နှင့် function များ',
  summary:
    'if/else၊ for loop၊ comprehension နှင့် function များ — နောက်ပိုင်း pandas က သင့်အစား လုပ်ပေးမယ့် logic ဖြစ်လို့ သူဘာလုပ်နေလဲ သိထားရမယ်။',
  topics: [
    'if / elif / else',
    'for loop များ',
    'Accumulator များ',
    'Comprehension များ',
    'Function များ'
  ],
  sections: [
    {
      id: 'conditions',
      eyebrow: 'ဆုံးဖြတ်ချက်များ',
      title: 'if / elif / else: data ကို ဆုံးဖြတ်ခိုင်းပါ',
      blocks: [
        {
          type: 'text',
          body: [
            'နှိုင်းယှဉ်ချက် (`>`, `<`, `>=`, `==`, `!=`) က **bool** ကို ထုတ်ပေးတယ်: `True` ဒါမှမဟုတ် `False`။ `if` က condition True ဖြစ်မှသာ block ကို run တယ်။ **Indentation** (space 4 ခု) က ဘယ်စာကြောင်းတွေ block ထဲ ပါလဲ ပြတယ်။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'လေဆိပ် လုံခြုံရေး လမ်းကြောင်းများ',
          body: 'ခရီးသည်တိုင်းကို လမ်းကြောင်းတွေနဲ့ အစီအစဉ်အတိုင်း စစ်တယ် — “သံတမန်လား?”၊ “လေယာဉ်အမှုထမ်းလား?”၊ မဟုတ်ရင် “ကျန်တဲ့သူအားလုံး”။ ပထမဆုံး ကိုက်ညီတဲ့ လမ်းကြောင်းက နိုင်ပြီး ကျန်တာတွေကို ကျော်သွားတယ်။ elif က ဒီအတိုင်း အတိအကျ အလုပ်လုပ်တယ်။'
        },
        { type: 'code', title: 'Condition တွေကို and / or / not နဲ့ ပေါင်းပါ' },
        {
          type: 'quiz',
          question: 'score = 50။ ဘယ် label ကို print ထုတ်မလဲ?',
          options: ['A', 'B', 'C', 'ဘာမှ မထွက်'],
          explanation: '50 > 50 က False (ညီတာ၊ ကြီးတာ မဟုတ်ဘူး)၊ ဒါကြောင့် else ဆီ ရောက်သွားတယ်။'
        }
      ]
    },
    {
      id: 'for-loops',
      eyebrow: 'Loop များ',
      title: 'for loop များ: row တိုင်းအတွက် လုပ်ပါ',
      blocks: [
        {
          type: 'text',
          body: [
            '`for` loop က collection ထဲက value တစ်ခုချင်းကို ယူ၊ နာမည်ပေးပြီး indent လုပ်ထားတဲ့ block ကို run တယ်။ **Accumulator pattern** — 0 ကနေစ၊ loop ထဲမှာ ပေါင်း — က `sum()` တိုင်းရဲ့ ဘိုးဘေး ဖြစ်တယ်။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ငွေကိုင်',
          body: 'ငွေကိုင်က ခြင်းထဲက ပစ္စည်းတိုင်းကို တစ်ခုချင်း scan ဖတ်ပြီး screen က စုစုပေါင်းကို ဆက်တိုက် ပြနေတယ်။ ခြင်းက list၊ scanner က for loop၊ screen က accumulator။'
        },
        { type: 'code', title: 'range, enumerate နှင့် zip' }
      ]
    },
    {
      id: 'loop-records',
      eyebrow: 'Loop + data',
      title: 'လက်နဲ့ filter လုပ်ပြီး အုပ်စုဖွဲ့ခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            'Loop နဲ့ `if` ကို ပေါင်းလိုက်ရင် table တစ်ခုအကြောင်း တကယ့် မေးခွန်းတွေကို ဖြေနိုင်တယ်။ ဒုတိယ program ကို သတိထားကြည့်ပါ: dict ထဲကို ရေတွက်ထည့်တာက **လက်နဲ့ လုပ်တဲ့ groupby** — Day 11 မှာ pandas က ဒါကို တစ်ကြောင်းတည်းနဲ့ လုပ်ပေးမယ်။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'အကြွေစေ့တွေကို ဘူးတွေထဲ ခွဲထည့်ခြင်း',
          body: 'အကြွေစေ့ တစ်စေ့စီအတွက် label ကို ဖတ်ပြီး ကိုက်ညီတဲ့ ဘူးထဲ ထည့်ပါ — အဲဒီ label ကို ပထမဆုံး မြင်တဲ့အခါ ဘူးအသစ် ဖန်တီးပါ။ အဆုံးမှာ ဘူးတစ်ခုစီကို ရေတွက်ပါ။ dict.get(key, 0) က “ဘူး၊ မရှိသေးရင် ဘူးအလွတ်” ပါ။'
        }
      ],
      notes:
        'revenue_by_branch ကို ကျောင်းသားကိုယ်တိုင် အရင်ရေးကြည့်ခိုင်းပါ။ ဒါက အခုထိ အခက်ဆုံး program; အကျိုးကျေးဇူးက Day 11 မှာ groupby ကို နက်နက်ရှိုင်းရှိုင်း နားလည်ခြင်း။'
    },
    {
      id: 'comprehensions',
      eyebrow: 'Python ပုံစံ',
      title: 'Comprehension များ: တစ်ကြောင်းတည်းနဲ့ loop',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'စက်ရုံ conveyor belt',
          body: 'ပစ္စည်းတွေ ဝင်လာတယ် (for p in prices)၊ အရည်အသွေးစစ် ဂိတ်က တချို့ကို ပစ်ထုတ်တယ် (if p >= 60)၊ စက်က ကျန်တာ တစ်ခုချင်းကို ပြောင်းလဲပေးတယ် (p * 1.07)၊ အဆုံးက ဘူးက ရလဒ်တွေကို စုတယ် ([ ])။'
        },
        {
          type: 'quiz',
          question: 'ရလဒ်က ဘာလဲ?',
          explanation:
            'range(4) က 0,1,2,3 ကို ပေးတယ်; စုံကိန်းတွေက 0 နဲ့ 2; နှစ်ဆလုပ်ရင် 0 နဲ့ 4 ဖြစ်တယ်။'
        }
      ]
    },
    {
      id: 'functions',
      eyebrow: 'Function များ',
      title: 'Function များ: ချက်နည်းကို နာမည်ပေးပြီး ထာဝရ ပြန်သုံးပါ',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ဘလင်ဒါ',
          body: 'Parameter တွေက ထည့်တဲ့ အရာ (သစ်သီး၊ နွားနို့)၊ body က ကြိတ်ခြင်း၊ return က ထွက်လာတဲ့ smoothie — နောက်ဖန်ခွက်ထဲ လောင်းလို့ရတဲ့ အရာ။ print() က smoothie ကို ပြတင်းပေါက်ကနေ ပြရုံပဲ; အဲဒါကို သောက်လို့ မရဘူး။'
        },
        { type: 'code', title: 'return နှင့် print — Day 1 ကို မှတ်မိလား?' },
        {
          type: 'callout',
          title: 'Data scientist တွေ ဘာကြောင့် function တွေကို ချစ်လဲ',
          body: 'ဇန်နဝါရီ၊ ဖေဖော်ဝါရီ နဲ့ မတ်လ data တွေပေါ်မှာ သန့်စင်တဲ့ အဆင့် တစ်ခုတည်းကို run ရမယ်။ Function အဖြစ် တစ်ခါရေး၊ တစ်ခါ စမ်း၊ သုံးခါ ခေါ်ပါ။ နောက်ပိုင်း pandas က ကိုယ်ပိုင် function တွေကို column တစ်ခုလုံးပေါ် apply လုပ်ခွင့်ပေးတယ်။'
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'သီအိုရီ + လက်တွေ့ ကမ္ဘာ',
      title: 'လက်နဲ့ ရေးထားတဲ့ စည်းမျဉ်းများ: ပထမဆုံး “model” များ',
      blocks: [
        {
          type: 'text',
          body: [
            '**သီအိုရီ။** **Algorithm** ဆိုတာ တိကျပြီး အဆုံးရှိတဲ့ အဆင့်များစာရင်း — ကွန်ပျူတာ လိုက်လုပ်နိုင်တဲ့ ချက်နည်း။ Machine learning မတိုင်ခင် “ဉာဏ်ရည်ရှိတဲ့” စနစ်တွေက အများစု လက်နဲ့ရေးထားတဲ့ if/else စည်းမျဉ်းတွေ ဖြစ်ပြီး **rule-based system** (ဒါမှမဟုတ် expert system) လို့ ခေါ်တယ်။ ရှင်းပြဖို့နဲ့ စစ်ဆေးဖို့ လွယ်လို့ အခုထိ နေရာတိုင်းမှာ ရှိနေတုန်းပဲ။',
            'Machine learning က ဒါကို ပြောင်းပြန်လှန်တယ်: စည်းမျဉ်းတွေ ရေးမယ့်အစား ဥပမာတွေ ပေးပြီး ကွန်ပျူတာက သူတို့ကို **သင်ယူ** တယ်။ စည်းမျဉ်းတွေကို ကိုယ်တိုင် ရေးတတ်တာက model ဘာလုပ်နေလဲ နားလည်ဖို့ နည်းလမ်း ဖြစ်တယ်။'
          ]
        },
        {
          type: 'case',
          domain: 'ဘဏ်များ',
          title: 'လိမ်လည်မှု စည်းမျဉ်းများ',
          problem: 'သံသယဖြစ်ဖွယ် ကတ်ငွေပေးချေမှုတွေကို လူတစ်ယောက် စစ်ဖို့ အမှတ်အသား ပြုပါ။',
          data: 'ငွေလွှဲမှု တစ်ခုစီ: ပမာဏ၊ နိုင်ငံ၊ အချိန်၊ ကုန်သည် အမျိုးအစား။',
          method:
            '“ပမာဏ ကြီး AND နိုင်ငံခြား AND ညဘက်” လို စည်းမျဉ်းများ — မကြာခဏ သင်ယူထားတဲ့ model နဲ့ ပေါင်းသုံးတယ်။',
          outcome:
            'ငွေပေးချေမှု အများစုက ချက်ချင်း ဖြတ်သွားတယ်; အနည်းငယ်ကိုတော့ SMS စစ်ဆေးဖို့ ဆိုင်းထားတယ်။'
        },
        { type: 'code', title: 'Rule-based လိမ်လည်မှု စစ်ဆေးစနစ် ရေးပါ' },
        {
          type: 'analogy',
          title: 'ချက်နည်းကတ် နှင့် မြည်းစမ်းတဲ့ စားဖိုမှူး',
          body: 'Rule-based system က ချက်နည်းကတ်: အဆင့်တွေ တိကျတယ်၊ အမြဲ ရလဒ်တူတယ်၊ စစ်ဆေးဖို့ လွယ်တယ်။ Machine learning က ဟင်းပွဲ ထောင်ပေါင်းများစွာ မြည်းဖူးပြီး အတွေ့အကြုံနဲ့ ချိန်ညှိတဲ့ စားဖိုမှူး — ပိုပြောင်းလွယ်ပြင်လွယ် ရှိပေမဲ့ ရှင်းပြဖို့ ပိုခက်တယ်။'
        }
      ]
    },
    {
      id: 'challenge',
      eyebrow: 'စိန်ခေါ်မှု',
      title: 'summarize(orders) ကို ရေးပါ',
      blocks: [
        {
          type: 'callout',
          title: 'လိုအပ်ချက်များ',
          body: 'summarize(orders) function တစ်ခု ရေးပါ၊ အဲဒါက dict ကို RETURN ပြန်ရမယ်: order အရေအတွက်၊ စုစုပေါင်း revenue၊ order တစ်ခုလျှင် ပျမ်းမျှ revenue (ဒဿမ 2 နေရာ)၊ နဲ့ quantity အလိုက် အရောင်းရဆုံး ပစ္စည်း။'
        },
        { type: 'code', title: 'သင့်အဖြေ' },
        { type: 'code', title: 'ဖြေရှင်းနည်း တစ်ခု' },
        {
          type: 'callout',
          title: 'နောက်တစ်ခု',
          body: 'Order 4 ခုအတွက် စာကြောင်း ~15 ကြောင်း ရေးခဲ့ရတယ်။ Day 10 မှာ pandas က order 240 ခုအကြောင်း မေးခွန်းတူတွေကို စာကြောင်း 4 ကြောင်းလောက်နဲ့ ဖြေပေးမယ် — အခု သူ နောက်ကွယ်မှာ ဘာလုပ်လဲ သိနေပြီ။'
        }
      ],
      notes:
        'max(units, key=units.get) က အသစ် — key= က max ကို ဘယ်လို နှိုင်းယှဉ်ရမလဲ ပြောပေးတယ်လို့ ရှင်းပြပါ: အက္ခရာစဉ်အလိုက် မဟုတ်ဘဲ key တစ်ခုစီရဲ့ value အလိုက်။'
    }
  ]
}

export default day5
