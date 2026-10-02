import type { LessonTranslation } from '@/models/translation.model'

const day4: LessonTranslation = {
  title: 'Collection များ: data နေထိုင်ရာ',
  summary:
    'Dataset တိုင်း စတင်ရာ container လေးမျိုး — list, dict, tuple နှင့် set — နှင့် မှန်ကန်တဲ့ တစ်ခုကို ရွေးချယ်ခြင်း ဘာကြောင့် အရေးကြီးလဲ။',
  topics: ['list', 'dict', 'tuple & set', 'Mutability'],
  sections: [
    {
      id: 'lists',
      eyebrow: 'list',
      title: 'List များ: အစီအစဉ်ကျတဲ့ value တန်း',
      blocks: [
        {
          type: 'text',
          body: [
            '**List** က value အများကြီးကို square bracket ထဲမှာ အစီအစဉ်အတိုင်း သိမ်းတယ်။ ဒါက data ရဲ့ အရိုးရှင်းဆုံး “column” ပါ။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ရထား',
          body: 'List ဆိုတာ ရထားတစ်စင်းပါ: တွဲတွေက ပုံသေ အစီအစဉ်နဲ့၊ 0 ကနေ နံပါတ်တပ်ထားတယ်။ တွဲ 2 ထဲကို ကြည့်လို့ရတယ်၊ တွဲတွေ ရေလို့ရတယ်၊ အဆုံးမှာ တွဲအသစ် ချိတ်လို့ရတယ် — တွဲတွေက ဘာမဆို သယ်နိုင်တယ်။'
        },
        { type: 'code', title: 'List တွေ ပြောင်းလဲနိုင်တယ် (mutable ဖြစ်တယ်)' }
      ],
      notes:
        'Day 1 နဲ့ ပြန်ချိတ်ပါ: string တွေလည်း sequence ဖြစ်လို့ indexing နဲ့ slicing က အတူတူပဲ အလုပ်လုပ်တယ်။ အသစ်ဖြစ်တဲ့ အချက်က list တွေ MUTABLE ဖြစ်တာ — string တွေ မဟုတ်ခဲ့ဘူး။'
    },
    {
      id: 'mutability',
      eyebrow: 'list · အသေးစိတ်',
      title: 'နာမည် နှစ်ခု၊ list တစ်ခု: mutability ထောင်ချောက်',
      blocks: [
        {
          type: 'text',
          body: [
            'Day 1 ကို သတိရပါ: `=` က နာမည်ကပ်ပြား ကပ်တာ၊ ဘယ်တော့မှ copy မကူးဘူး။ ဂဏန်းတွေမှာ ပြဿနာ မရှိခဲ့ဘူး၊ ဂဏန်းတွေက ပြောင်းလို့ မရလို့။ List တွေက ပြောင်းလို့ **ရတယ်** — ဒါကြောင့် list တစ်ခုပေါ်က ကပ်ပြား နှစ်ခုက အပြောင်းအလဲ တိုင်းကို မျှဝေကြတယ်။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'မျှဝေထားတဲ့ Google Doc',
          body: 'b = a က document တစ်ခုတည်းရဲ့ link ကို မျှဝေတာ: ပြင်တဲ့သူတိုင်းက လူတိုင်းအတွက် ပြောင်းသွားစေတယ်။ a.copy() က “Make a copy” — ဘေးကင်းကင်း ပြင်လို့ရတဲ့ document အသစ်။'
        },
        {
          type: 'quiz',
          question: 'ဘာ print ထွက်မလဲ?',
          explanation:
            'a နဲ့ b က list တစ်ခုတည်းပေါ်က ကပ်ပြား နှစ်ခုမို့ append က a ကနေလည်း မြင်ရတယ်။'
        }
      ],
      notes:
        'ဒီ bug က data scientist တွေကို အမြဲ ကိုက်တယ် — pandas မှာလည်း ဒီ idea ပဲ ရှိတယ် (view နဲ့ copy၊ SettingWithCopyWarning)။ အခုကတည်းက နားလည်ထားရင် နောက်ပိုင်း နာရီပေါင်းများစွာ သက်သာမယ်။'
    },
    {
      id: 'dicts',
      eyebrow: 'dict',
      title: 'Dictionary များ: နာမည်နဲ့ ရှာခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            '**Dict** က **key** တွေကို **value** တွေနဲ့ တွဲပေးတယ်။ “တတိယ value” လို့ မေးမယ့်အစား “price လို့ခေါ်တဲ့ value” လို့ မေးတယ်။ Key သန်းပေါင်းများစွာ ရှိရင်တောင် ချက်ချင်း ရှာတွေ့တယ်။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ဖုန်းလမ်းညွှန်စာအုပ်',
          body: 'ဖုန်းလမ်းညွှန်ကို စာမျက်နှာ 1 ကနေ ဘယ်တော့မှ မဖတ်ဘူး။ နာမည်ဆီ တန်းခုန်ပြီး နံပါတ်ကို ဖတ်တယ်။ Key တွေက နာမည်တွေ (မထပ်ရဘူး)၊ value တွေက နံပါတ်တွေ။'
        },
        { type: 'code', title: 'မရှိတဲ့ key ကို မေးခြင်း' },
        {
          type: 'callout',
          title: 'KeyError',
          body: 'Key မရှိရင် menu["Mocha"] က crash ဖြစ်တယ်။ menu.get("Mocha") (None ပေးတယ်) ကို သုံးပါ၊ ဒါမှမဟုတ် "Mocha" in menu နဲ့ အရင် စစ်ပါ။'
        }
      ]
    },
    {
      id: 'records',
      eyebrow: 'list + dict',
      title: 'Dict တွေရဲ့ list က table တစ်ခု',
      blocks: [
        {
          type: 'text',
          body: [
            'သူတို့ကို ပေါင်းလိုက်ရင် dataset အားလုံးနီးပါးရဲ့ ပုံသဏ္ဌာန် ရတယ်: **dict တစ်ခုစီက row** (order တစ်ခု)၊ **key တစ်ခုစီက column** နာမည်။ ဒါက နောက်ပိုင်း pandas ထဲ load လုပ်မယ့်ဟာ အတိအကျပါ။'
          ]
        },
        { type: 'code' },
        {
          type: 'table',
          columns: ['Python', 'Spreadsheet စကားလုံး', 'pandas စကားလုံး (Day 10)'],
          rows: [
            ['List တစ်ခုလုံး', 'orders', 'DataFrame'],
            ['Dict တစ်ခု', 'orders[0]', 'row တစ်ခု'],
            ['Key တစ်ခု', '"item"', 'column တစ်ခု']
          ]
        },
        {
          type: 'callout',
          title: 'သင့်အလှည့်',
          body: 'စတုတ္ထ order တစ်ခု ထပ်ထည့်ပါ၊ ပြီးရင် negative index သုံးပြီး နောက်ဆုံး order ရဲ့ branch ကို print ထုတ်ပါ။'
        }
      ],
      notes:
        'Order အားလုံးကို ပေါင်းဖို့ loop လိုတယ် — ဒါက Day 8 အတွက် စေ့ဆော်ချက် အတိအကျပါ။ မေးပါ: order 240 ခုရဲ့ revenue ကို ဘယ်လို ပေါင်းမလဲ? (Loop လိုအပ်ကြောင်း ကိုယ်တိုင် ခံစားမိပါစေ။)'
    },
    {
      id: 'tuples-sets',
      eyebrow: 'tuple & set',
      title: 'Tuple နှင့် set: အထူးပြုသူများ',
      blocks: [
        { type: 'code' },
        {
          type: 'table',
          columns: ['Type', 'Syntax', 'အစီအစဉ်ရှိ?', 'ပြောင်းလို့ရ?', 'လက်တွေ့ နှိုင်းယှဉ်ချက်'],
          rows: [
            ['list', '[1, 2, 2]', 'ရှိ', 'ရ', 'ရထားတွဲများ'],
            ['tuple', '(1, 2, 2)', 'ရှိ', 'မရ', 'Print ထုတ်ထားတဲ့ ပြေစာ'],
            ['dict', '{"a": 1}', 'ရှိ (ထည့်သည့် အစီအစဉ်)', 'ရ', 'ဖုန်းလမ်းညွှန်'],
            ['set', '{1, 2}', 'မရှိ', 'ရ', 'ဧည့်သည်စာရင်း — နာမည်တစ်ခု တစ်ကြိမ်']
          ]
        },
        {
          type: 'quiz',
          question: 'လာရောက်ခဲ့တဲ့ မတူညီတဲ့ customer အရေအတွက် လိုတယ်။ အကောင်းဆုံး tool က?',
          explanation:
            'Set က ထပ်နေတာတွေကို အလိုအလျောက် ဖယ်ပေးတော့ len(set(customers)) က မထပ်တဲ့ visitor တွေကို ရေတွက်ပေးတယ်။'
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'သီအိုရီ + လက်တွေ့ ကမ္ဘာ',
      title: 'Structure ရွေးချယ်ခြင်း: မြန်နှုန်း နှင့် တကယ့် API များ',
      blocks: [
        {
          type: 'text',
          body: [
            '**သီအိုရီ — ရှာဖွေမှု ဘယ်လို အလုပ်လုပ်လဲ။** `x in my_list` က item တွေကို တစ်ခုချင်း စစ်တော့ နှစ်ဆရှည်တဲ့ list က နှစ်ဆ ကြာတယ် (ကွန်ပျူတာ သိပ္ပံပညာရှင်တွေက O(n) လို့ ရေးကြတယ်)။ Dict ဒါမှမဟုတ် set က **hashing** ကို သုံးတယ်: key ဘယ်မှာ ရှိရမလဲ တွက်ပြီး အဲဒီကို တန်းခုန်သွားတော့ အရွယ်အစား ကြီးလာလည်း အချိန် မတိုးသလောက်ပဲ (O(1))။'
          ]
        },
        { type: 'code', title: 'Customer တစ်သန်းထဲက တစ်ယောက်ကို ရှာပါ' },
        {
          type: 'analogy',
          title: 'စာရွက်ပုံ နှင့် ဖုန်းလမ်းညွှန်',
          body: 'မစီထားတဲ့ စာရွက်ပုံထဲမှာ နာမည်ရှာရင် စာမျက်နှာ တိုင်းကို စစ်ရတယ် (list)။ ဖုန်းလမ်းညွှန်ရဲ့ အက္ခရာစဉ် tab တွေက မှန်ကန်တဲ့ စာမျက်နှာဆီ တန်းပို့ပေးတယ် (dict ဒါမှမဟုတ် set)။'
        },
        {
          type: 'case',
          domain: 'သင်သုံးတဲ့ app တိုင်း',
          title: 'API တွေက list နဲ့ dict တွေနဲ့ စကားပြောတယ်',
          problem: 'ရာသီဥတု app တစ်ခုက ရာသီဥတု ဝန်ဆောင်မှုကနေ ဒီနေ့ ခန့်မှန်းချက်ကို ပြရမယ်။',
          data: 'ဝန်ဆောင်မှုက JSON ကို ပြန်ပေးတယ် — Python list နဲ့ dict တွေနဲ့ အတိအကျ တူတဲ့ စာသား။',
          method:
            'json.loads က အဲဒီ စာသားကို dict နဲ့ list တွေအဖြစ် ပြောင်းတယ်; app က လိုတဲ့ key တွေကို ဖတ်တယ်။',
          outcome:
            'ဘဏ်၊ map ဒါမှမဟုတ် social media ကနေ download လုပ်မယ့် data အများစုက ဒီပုံစံနဲ့ ရောက်လာတယ်။'
        },
        { type: 'code', title: 'API ပုံစံ JSON response ကို ဖတ်ပါ' }
      ]
    },
    {
      id: 'review',
      eyebrow: 'ပြန်လည်သုံးသပ်ခြင်း',
      title: 'နားလည်မှုကို စစ်ဆေးပါ',
      blocks: [
        {
          type: 'quiz',
          question: 'ဒါက ဘာကို print ထုတ်မလဲ?',
          explanation: 'Key မရှိရင် .get() က default (0) ကို return ပြန်တယ်။'
        },
        {
          type: 'quiz',
          question: 'ဘယ်စာကြောင်းက sales list ရဲ့ သီးခြား copy ကို ဖန်တီးလဲ?',
          explanation: '= က နာမည်ကပ်ပြား ထပ်ကပ်ရုံပဲ။ .copy() က list အသစ် တည်ဆောက်တယ်။'
        },
        {
          type: 'callout',
          title: 'အိမ်စာ',
          body: 'အကြိုက်ဆုံး ကော်ဖီဆိုင် ဒါမှမဟုတ် အစားအစာတွေကို ဖော်ပြတဲ့ dict 5 ခုပါ list တစ်ခု လုပ်ပါ (name, price, rating)။ ဒုတိယ တစ်ခု၊ နောက်ဆုံး တစ်ခုရဲ့ price နဲ့ မထပ်တဲ့ rating တွေရဲ့ set ကို print ထုတ်ပါ။'
        }
      ]
    }
  ]
}

export default day4
