import type { LessonTranslation } from '@/models/translation.model'

const day6: LessonTranslation = {
  title: 'NumPy: array တစ်ခုလုံးနဲ့ တွေးခြင်း',
  summary:
    'Vectorized သင်္ချာ၊ boolean mask များ၊ 2-D array များ၊ axis နှင့် broadcasting — pandas ရဲ့ နောက်ကွယ်က အင်ဂျင်။',
  topics: ['ndarray', 'Vectorization', 'Boolean mask များ', 'axis', 'Broadcasting'],
  sections: [
    {
      id: 'why-numpy',
      eyebrow: 'ဘာကြောင့် NumPy လဲ?',
      title: 'List တွေက ပြောင်းလွယ်တယ်။ Array တွေက မြန်တယ်။',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'လက်နဲ့ ပန်းကန်ဆေးခြင်း နှင့် ပန်းကန်ဆေးစက်',
          body: 'Python for loop က ပန်းကန်တစ်ချပ်ချင်းကို လက်နဲ့ ဆေးပြီး ဘယ်လို ပန်းကန်လဲ အကြိမ်တိုင်း စစ်တယ်။ NumPy က ပန်းကန်တစ်မျိုးတည်းအတွက် တည်ဆောက်ထားတဲ့ ပန်းကန်ဆေးစက်ထဲ စင်တစ်ခုလုံး ထည့်ပြီး တစ်ခါတည်း run တယ် (မြန်တဲ့ C code နဲ့)။ ဒါကို vectorization လို့ ခေါ်တယ်။'
        },
        { type: 'code', title: 'မြန်နှုန်း ကွာခြားချက်ကို ကိုယ်တိုင် ကြည့်ပါ' }
      ],
      notes:
        'အတိအကျ မြန်နှုန်းက စက်အလိုက် ကွာတယ် (browser ထဲမှာ ပိုနည်းတယ်)၊ ဒါပေမဲ့ NumPy က ပုံမှန်အားဖြင့် ဆယ်ဆနဲ့ချီ မြန်တယ်။ နက်ရှိုင်းတဲ့ အကြောင်းရင်း: array က type တစ်မျိုးတည်းရဲ့ ဂဏန်းအကြမ်းတွေကို memory ထဲမှာ ဘေးချင်းကပ် သိမ်းတော့ element တစ်ခုချင်း type စစ်စရာ မလိုဘူး။'
    },
    {
      id: 'arrays',
      eyebrow: 'ndarray',
      title: 'Array ရဲ့ ခန္ဓာဗေဒ: dtype, shape, ndim',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ကြက်ဥ ဗန်း',
          body: 'ကြက်ဥ ဗန်းထဲက အကွက်တိုင်း အရွယ်အစား တူပြီး အရာ တစ်မျိုးတည်းကို ထည့်တယ်။ Array လည်း ဒီအတိုင်းပဲ: element တိုင်းအတွက် dtype တစ်ခု။ Integer တွေကြားထဲ 2.5 ထည့်ကြည့်ရင် NumPy က ဗန်းတစ်ခုလုံးကို float အဖြစ် မြှင့်တင်လိုက်တယ်။'
        },
        {
          type: 'table',
          columns: ['Attribute', 'အဓိပ္ပာယ်', 'temps အတွက်'],
          rows: [
            ['dtype', 'element တိုင်းရဲ့ type', 'float64'],
            ['shape', 'dimension တစ်ခုစီရဲ့ အရွယ်အစား', '(5,)'],
            ['ndim', 'dimension အရေအတွက်', '1'],
            ['size', 'element စုစုပေါင်း အရေအတွက်', '5']
          ]
        }
      ]
    },
    {
      id: 'aggregations',
      eyebrow: 'စာရင်းအင်း',
      title: 'Vectorized သင်္ချာ နှင့် summary statistics',
      blocks: [
        { type: 'code' },
        {
          type: 'callout',
          title: 'Mean နှင့် median',
          body: 'Mean ကို အစွန်းရောက် value တွေက ဆွဲတယ်; median က အလယ် value။ Customer တစ်ယောက်က latte 50 ခွက် မှာရင် mean က ခုန်တက်သွားပေမဲ့ median က မရွှေ့သလောက်ပဲ။ ဝင်ငွေ ဒါမှမဟုတ် order အရွယ်အစားလို စောင်းနေတဲ့ data အတွက် median ကို ဖော်ပြပါ။'
        }
      ]
    },
    {
      id: 'masks',
      eyebrow: 'Boolean mask များ',
      title: 'True/False mask များဖြင့် filter လုပ်ခြင်း',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'Stencil',
          body: 'Mask ဆိုတာ နေရာတချို့မှာ အပေါက်ပါတဲ့ stencil တစ်ချပ်။ Array ပေါ် အုပ်လိုက်ရင် အပေါက်အောက်က value တွေပဲ ပေါ်တယ်။ ဒီ idea အတိအကျက pandas မှာ df[df["price"] > 60] ဖြစ်လာတယ်။'
        },
        { type: 'code', title: 'အဖြစ်များတဲ့ အမှား: & အစား and' },
        {
          type: 'quiz',
          question: 'ဒါက ဘာကို print ထုတ်မလဲ?',
          explanation: 'Mask က 9 နဲ့ 7 ကို ထားတယ်; သူတို့ပေါင်းလဒ်က 16။'
        }
      ]
    },
    {
      id: 'two-d',
      eyebrow: '2-D array များ',
      title: 'Row, column နှင့် axis argument',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'Spreadsheet စုစုပေါင်းများ',
          body: 'axis=0 က row တွေကို အောက်ဘက်ကို ဖိချုံ့ပြီး column တစ်ခုစီအတွက် စုစုပေါင်း တစ်ခု ပေးတယ် — အောက်ဆုံးက totals row။ axis=1 က column တွေကို ဘေးတိုက် ဖိချုံ့ပြီး row တစ်ခုစီအတွက် စုစုပေါင်း တစ်ခု ပေးတယ် — ညာဘက်က totals column။ သင်ပြောတဲ့ axis က ပျောက်သွားတဲ့ ဟာ။'
        },
        {
          type: 'quiz',
          question: 'sales ရဲ့ shape က (3, 4)။ sales.mean(axis=0) ရဲ့ shape က ဘာလဲ?',
          explanation:
            'axis 0 (row 3 ခု) ပျောက်သွားပြီး column တစ်ခုစီအတွက် value တစ်ခု ကျန်တယ်: (4,)။'
        }
      ]
    },
    {
      id: 'broadcasting',
      eyebrow: 'Broadcasting',
      title: 'Broadcasting: သေးတဲ့ array ကို ဆန့်ထုတ်ခြင်း',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ဈေးနှုန်း စတစ်ကာများ',
          body: 'ဈေးနှုန်း စတစ်ကာ တစ်တန်းနဲ့ အရေအတွက် table တစ်ခုလုံး ရှိတယ်။ NumPy က စတစ်ကာတန်းကို နေ့တိုင်းအတွက် “မိတ္တူကူး” (memory ကို တကယ် မကူးဘဲ) ပြီး အကွက်တစ်ကွက်ချင်း မြှောက်တယ်။'
        },
        {
          type: 'callout',
          title: 'စည်းမျဉ်း',
          body: 'Shape တွေကို ညာဘက်ကနေ နှိုင်းယှဉ်ပါ: အရွယ်အစား အတွဲတိုင်း တူရမယ်၊ ဒါမှမဟုတ် တစ်ခုက 1 ဖြစ်ရမယ်။ (2, 3) နဲ့ (3,) ရတယ်; (2, 3) နဲ့ (2,) က ValueError ဖြစ်တယ်။'
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'သီအိုရီ + လက်တွေ့ ကမ္ဘာ',
      title: 'Vector, matrix — ပြီးတော့ ပုံတွေက array တွေ',
      blocks: [
        {
          type: 'text',
          body: [
            '**သီအိုရီ။** သင်္ချာမှာ 1-D array က **vector** ဖြစ်ပြီး 2-D array က **matrix** ဖြစ်တယ်။ Linear algebra — vector နဲ့ matrix တွေကို ပေါင်း၊ ချဲ့ နဲ့ မြှောက်ခြင်း — က machine learning ရဲ့ ဘာသာစကား: model ဆိုတာ data ကို ဖြတ်ပြီး မြှောက်တဲ့ ဂဏန်း matrix အစုအဝေး တစ်ခု အများစု ဖြစ်တယ်။',
            'Greyscale ဓာတ်ပုံ က အလင်းအမှောင် value တွေရဲ့ matrix ပဲ (0 = အနက်, 255 = အဖြူ)။ အရောင်ဓာတ်ပုံ က 3-D array: အမြင့် × အကျယ် × အရောင် channel 3 ခု (အနီ, အစိမ်း, အပြာ)။'
          ]
        },
        { type: 'code', title: 'Array သင်္ချာနဲ့ “ပုံ” ကို ပြင်ပါ' },
        {
          type: 'case',
          domain: 'ဖုန်းများ နှင့် ဆေးရုံများ',
          title: 'ဓာတ်ပုံ filter များ နှင့် ဆေးဘက်ဆိုင်ရာ scan များ',
          problem:
            'ဓာတ်ပုံကို ချက်ချင်း လင်းအောင် လုပ်ပါ၊ ဒါမှမဟုတ် scan ပေါ်မှာ အကျိတ်ကို မီးမောင်းထိုးပါ။',
          data: 'ဂဏန်း သန်းပေါင်းများစွာပါ array တွေအဖြစ် သိမ်းထားတဲ့ ပုံများ။',
          method:
            'Pixel တိုင်းပေါ်မှာ တစ်ပြိုင်နက် vectorized array သင်္ချာ (ပေါင်း၊ မြှောက်၊ clip); ML model တွေက array တူတူကို ဖတ်တယ်။',
          outcome:
            'Filter တွေ real time မှာ အလုပ်လုပ်တယ်; model တွေက radiologist အရင်ကြည့်ဖို့ scan တွေကို အမှတ်အသား ပြုပေးနိုင်တယ်။'
        },
        {
          type: 'analogy',
          title: 'ဂဏန်းအလိုက် ဆေးခြယ်ခြင်း',
          body: 'Digital ပုံ ဆိုတာ ဂဏန်းတစ်ခုစီက အရောင်အသွေး တစ်ခုဖြစ်တဲ့ ဂဏန်းအလိုက် ဆေးခြယ်ရတဲ့ grid တစ်ခု။ “လင်းအောင်” ဆိုတာ ဂဏန်းတိုင်းကို ပေါင်းတာ; “ပြောင်းပြန်” ဆိုတာ 255 ထဲက ဂဏန်းတိုင်းကို နုတ်တာ။ NumPy က grid တစ်ခုလုံးကို တစ်ချက်တည်းနဲ့ လုပ်တယ်။'
        }
      ]
    },
    {
      id: 'random',
      eyebrow: 'Simulation',
      title: 'Random ဂဏန်းများ နှင့် ကိန်းကြီးများ ဥပဒေ',
      blocks: [
        { type: 'code' },
        {
          type: 'text',
          body: [
            'တရားမျှတတဲ့ အံစာတုံးရဲ့ တကယ့် ပျမ်းမျှက 3.5။ နည်းနည်းပဲ လှိမ့်ရင် ပျမ်းမျှက လွင့်နေတယ်; အများကြီး လှိမ့်ရင် တည်ငြိမ်သွားတယ်။ ဒါကြောင့် လူ 10 ယောက် စစ်တမ်းက noise များပြီး 10,000 ယောက် စစ်တမ်းက ယုံကြည်ရတယ်။'
          ]
        },
        {
          type: 'callout',
          title: 'အိမ်စာ',
          body: 'rng.normal(32, 2, size=7) နဲ့ ၇ ရက်စာ အပူချိန်ကို simulate လုပ်ပါ။ အပူဆုံးနေ့ နံပါတ် (argmax + 1)၊ 33 °C ထက် ကျော်တဲ့ ရက်အရေအတွက် နဲ့ Fahrenheit ပြောင်းထားတဲ့ အပူချိန်တွေ (C * 9 / 5 + 32) ကို loop မသုံးဘဲ print ထုတ်ပါ။'
        }
      ]
    }
  ]
}

export default day6
