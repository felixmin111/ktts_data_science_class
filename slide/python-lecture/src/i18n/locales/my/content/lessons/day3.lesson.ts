import type { LessonTranslation } from '@/models/translation.model'

const day3: LessonTranslation = {
  title: 'Loop များ: copy-paste မလုပ်ဘဲ ထပ်ခါ run ခြင်း',
  summary:
    'while နဲ့ for loop၊ range()၊ counter နဲ့ total၊ break နဲ့ continue — animation loop diagram ပေါ်မှာ အကြိမ်တိုင်းကို ကြည့်ပြီး မြှောက်ဇယား program တစ်ခု တည်ဆောက်ပါ။',
  topics: [
    'while loop များ',
    'Counter နှင့် total',
    'for နှင့် range()',
    'break / continue',
    'မြှောက်ဇယား'
  ],
  sections: [
    {
      id: 'recap',
      eyebrow: 'အနွေးလေ့ကျင့်ခန်း',
      title: 'မနေ့က သင်ခန်းစာ program တစ်ခုထဲမှာ',
      blocks: [
        { type: 'code' },
        {
          type: 'quiz',
          question:
            'ဒါက ကျောင်းသား တစ်ယောက်ကို အဆင့်သတ်မှတ်တယ်။ ကျောင်းသား ၃၀ ကို ဘယ်လို အဆင့်သတ်မှတ်မလဲ?',
          options: [
            'if / elif / else ကို ၃၀ ခါ copy ကူး',
            'တစ်ခါပဲ ရေးပြီး ကျောင်းသားတိုင်းအတွက် Python ကို ထပ်ခါ run ခိုင်း',
            'Python က အဲဒါ မလုပ်နိုင်ဘူး',
            'အရမ်းရှည်တဲ့ if တစ်ခု သုံး'
          ],
          explanation:
            'Code ကို ၃၀ ခါ copy ကူးတာ နှေးပြီး မှားလွယ်တယ်။ ဒီနေ့ loop တွေကို သင်မယ်: အဆင့်တွေကို တစ်ခါ ရေးပြီး Python ကို ထပ်ခါ run ခိုင်းတာ။'
        }
      ],
      notes:
        'Copy-paste နဲ့ ကျောင်းသား ၃၀ ကို အဆင့်သတ်မှတ်ရင် ဘယ်လောက် ကြာမလဲ မေးပါ၊ ပြီးရင် အဆင့် နယ်နိမိတ်တွေ ပြောင်းသွားရင် ဘာဖြစ်မလဲ မေးပါ။'
    },
    {
      id: 'why-loops',
      eyebrow: 'Loop များ',
      title: 'Loop ဘာကြောင့် လိုလဲ? တစ်ခါ ရေး၊ အကြိမ်ကြိမ် run',
      blocks: [
        { type: 'code' },
        {
          type: 'text',
          body: [
            '**Loop** ဆိုတာ code block တစ်ခုတည်းကို ထပ်ခါထပ်ခါ run တာပါ။ Block ကို တစ်ခါ run တိုင်းကို **pass** (သို့မဟုတ် iteration) လို့ ခေါ်တယ်။',
            'Python မှာ loop နှစ်မျိုး ရှိတယ်: **`while`** က **condition True ဖြစ်နေသရွေ့** ထပ်ခါ run တယ်၊ **`for`** က `range()` ကနေ ဂဏန်းတွေ ဒါမှမဟုတ် string တစ်ခုရဲ့ စာလုံးတွေလို sequence တစ်ခုထဲက **item တစ်ခုစီအတွက် တစ်ခါ** run တယ်။'
          ]
        },
        {
          type: 'analogy',
          title: 'ပြေးလမ်းပေါ်က ပတ်ပြေးခြင်း',
          body: '“အားရှိနေသရွေ့ ဆက်ပြေး” က while loop: ပတ်တိုင်း မပြေးခင် စစ်တယ်။ “ဒီစာရင်းထဲက နာမည် တစ်ခုစီအတွက် တစ်ပတ် ပြေး” က for loop: မစခင် ဘယ်နှပတ်လဲ သိပြီးသား။'
        }
      ]
    },
    {
      id: 'while-loop',
      eyebrow: 'Loop များ · while',
      title: 'while: condition True ဖြစ်နေသရွေ့ ထပ်ခါ run',
      blocks: [
        {
          type: 'text',
          body: [
            '**ရေတွက်တဲ့ while loop ရဲ့ အစိတ်အပိုင်း လေးခု:** ① loop မတိုင်ခင် **စ value** (`i = 1`) ② pass တိုင်း မတိုင်ခင် အပေါ်မှာ စစ်တဲ့ **condition** (`i <= 3`) ③ space 4 ခု indent လုပ်ထားတဲ့ **body** ④ variable ကို အဆုံးဘက် ရွှေ့ပေးတဲ့ **update** (`i += 1`)။',
            '**ဘယ်လို run လဲ:** condition ကို စစ်။ True → body တစ်ခုလုံး run ပြီး အပေါ်ပြန်တက် ထပ်စစ်။ False → body ကို ကျော်ပြီး loop အောက်က ဆက် run။'
          ]
        },
        {
          type: 'loop',
          explanation:
            'စစ်ချက်က ၄ ခါ run ပေမဲ့ body က ၃ ခါပဲ: စတုတ္ထ အကြိမ် စစ်တော့ i က 4၊ 4 <= 3 က False ဖြစ်ပြီး အစက်က False မြှားအတိုင်း ထွက်ပြီး "Done" ကို print ထုတ်တယ်။'
        },
        {
          type: 'callout',
          title: 'မဆုံးနိုင်တဲ့ loop',
          body: 'Update (`i += 1`) ကို မေ့ရင် i က 1 အမြဲ ဖြစ်နေတယ်: `i <= 3` က အမြဲ True မို့ loop ဘယ်တော့မှ မရပ်ဘူး။ Program ရပ်နေသလို ဖြစ်နေရင် update ပျောက်နေလား အရင် ရှာပါ။'
        },
        {
          type: 'loop',
          explanation:
            'n က 10 → 7 → 4 → 1 → -2 ဖြစ်သွားတယ်။ Condition ကို အပေါ်မှာပဲ စစ်တော့ 1 ကနေ body က တစ်ခါ ထပ် run ပြီး n က သုညအောက် ရောက်သွားတယ်။'
        },
        {
          type: 'quiz',
          question: '"Hi" ကို ဘယ်နှခါ print ထုတ်မလဲ?',
          options: ['0', '1', '3', 'အဆုံးမရှိ'],
          explanation:
            '5 < 3 က ပထမဆုံး အကြိမ်မှာတင် False မို့ body ဘယ်တော့မှ မ run ဘူး။ while loop က သုည ခါ run နိုင်တယ်။'
        },
        {
          type: 'code',
          title:
            'လေ့ကျင့်ခန်း: နောက်ပြန်ရေ — while loop နဲ့ 5, 4, 3, 2, 1 ကို print ထုတ်ပြီး loop အောက်မှာ "Liftoff!" တစ်ခါ print ထုတ်ပါ'
        },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' }
      ]
    },
    {
      id: 'counters-totals',
      eyebrow: 'Loop များ · ပုံစံများ',
      title: 'Counter နှင့် total',
      blocks: [
        {
          type: 'text',
          body: [
            '**Total ပုံစံ:** loop **မတိုင်ခင်** `total = 0` ဖန်တီး၊ ပြီးမှ အထဲမှာ ပေါင်းထည့်: `total += x`။ Loop ပြီးရင် `total` ထဲမှာ ပေါင်းလဒ် ရှိတယ်။',
            '**Counter ပုံစံ:** loop မတိုင်ခင် `count = 0` ဖန်တီး၊ ပြီးမှ တစ်ခုခု ဖြစ်တိုင်း `count += 1`။ Item အချို့ကိုပဲ ရေတွက်ချင်ရင် `if` ထဲ ထည့်ပါ။',
            'နှစ်ခုလုံး loop **မတိုင်ခင်** စရမယ်။ `total = 0` ကို body ထဲမှာ ရေးရင် pass တိုင်း 0 ပြန်ဖြစ်သွားတယ်။'
          ]
        },
        {
          type: 'loop',
          explanation:
            'Variable panel မှာ total ကြီးလာတာ ကြည့်ပါ: 0 → 1 → 3 → 6 → 10 → 15။ print က loop အောက်မှာ ရှိလို့ အဆုံးမှာ တစ်ခါပဲ run တယ်။'
        },
        {
          type: 'loop',
          explanation:
            'if ကို စာလုံး ၆ လုံးလုံးအတွက် စစ်ပေမဲ့ ch က "a" ဖြစ်တဲ့ pass သုံးခုမှာပဲ count ကြီးလာတယ်။'
        },
        {
          type: 'quiz',
          question: 'ဒါက ဘာကို print ထုတ်မလဲ?',
          explanation:
            'total = 0 က loop ထဲမှာ ရှိလို့ pass တိုင်း ပြန်စတယ်။ နောက်ဆုံး pass ပြီးရင် 0 + 3 = 3။ 6 ရချင်ရင် total = 0 ကို loop အပေါ် ရွှေ့ပါ။'
        },
        {
          type: 'code',
          title:
            'လေ့ကျင့်ခန်း: loop တစ်ခုထဲမှာ total နဲ့ counter — 1 ကနေ 30 ထဲက စုံကိန်းတွေကို ပေါင်းပြီး 3 ရဲ့ ဆတိုးကိန်းတွေကို ရေတွက်ပါ'
        },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' }
      ]
    },
    {
      id: 'for-range',
      eyebrow: 'Loop များ · for',
      title: 'for နှင့် range(): value တစ်ခုစီအတွက် ထပ်ခါ run',
      blocks: [
        {
          type: 'text',
          body: [
            '`for i in range(1, 4):` က pass တစ်ခုစီမှာ `i` ကို 1, 2, 3 value တွေ ပေးတယ်။ မေ့စရာ စ value ဒါမှမဟုတ် update မရှိဘူး: `for` loop က နှစ်ခုလုံး လုပ်ပေးတယ်။',
            '`range()` က ဂဏန်းတွေ ထုတ်ပေးတယ်။ Stop value **မတိုင်ခင်** အမြဲ ရပ်တယ်။'
          ]
        },
        {
          type: 'table',
          columns: ['Call', 'Value များ', 'ဖတ်နည်း'],
          rows: [
            ['range(5)', '0 1 2 3 4', '0 ကနေ၊ 5 မတိုင်ခင် ရပ်'],
            ['range(2, 6)', '2 3 4 5', '2 ကနေ၊ 6 မတိုင်ခင် ရပ်'],
            ['range(1, 10, 2)', '1 3 5 7 9', '1 ကနေ၊ တစ်ခါ 2 ပေါင်း'],
            ['range(5, 0, -1)', '5 4 3 2 1', 'နောက်ပြန်ရေ၊ 0 မတိုင်ခင် ရပ်'],
            ['range(0)', '(ဘာမှ မရှိ)', 'pass သုည']
          ]
        },
        {
          type: 'loop',
          explanation:
            'Step -1 နဲ့ loop က 3, 2, 1 နောက်ပြန် ရေတယ်။ စတုတ္ထ value မရှိတော့ စစ်ချက် False ဖြစ်ပြီး loop အောက်မှာ "Go!" က တစ်ခါ print ထွက်တယ်။'
        },
        {
          type: 'loop',
          explanation:
            'range(2, 10, 3) က 2, 5 နဲ့ 8 ပေးတယ်။ နောက် value က 11 ဖြစ်မှာ၊ 10 အောက် မဟုတ်တော့ စစ်ချက် False။'
        },
        { type: 'code', title: 'String ပေါ်မှာ for loop' },
        {
          type: 'quiz',
          question: 'range(1, 5) က ဂဏန်း ဘယ်နှလုံး ပေးလဲ?',
          explanation: '1, 2, 3, 4: 5 မတိုင်ခင် ရပ်တယ်။ အမြန်နည်း: stop − start = 5 − 1 = 4။'
        },
        {
          type: 'code',
          title:
            'လေ့ကျင့်ခန်း: စာလုံးတိုင်းကို နံပါတ်တပ်ပါ — range(len(word)) နဲ့ index နဲ့ စာလုံးကို print ထုတ်ပါ'
        },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' }
      ]
    },
    {
      id: 'break-continue',
      eyebrow: 'Loop များ · ထိန်းချုပ်ခြင်း',
      title: 'break နှင့် continue',
      blocks: [
        {
          type: 'text',
          body: [
            '**`break`** က value ကျန်သေးရင်တောင် loop ကို **ချက်ချင်း** ထွက်တယ်။ ရှာနေတာ တွေ့ပြီဆိုရင် သုံးပါ။',
            '**`continue`** က **ဒီ pass ရဲ့ ကျန်တာ** ကို ကျော်ပြီး စစ်ချက်ဆီ တန်းပြန်သွားတယ်။ Item အချို့ကို လျစ်လျူရှုချင်ရင် သုံးပါ။'
          ]
        },
        {
          type: 'loop',
          explanation:
            'i က 4 ဖြစ်တဲ့ pass မှာ if က True ဖြစ်ပြီး break က loop အောက်က code ဆီ တန်းခုန်သွားတယ်။ 5 ကနေ 9 ဘယ်တော့မှ မ run ဘူး။'
        },
        {
          type: 'loop',
          explanation:
            'စုံကိန်း pass တွေမှာ continue က print မတိုင်ခင် စစ်ချက်ဆီ ပြန်ခုန်တော့ မကိန်း 1, 3, 5 ပဲ print ထွက်တယ်။'
        },
        { type: 'code', title: 'break နဲ့ ရှာဖွေခြင်း' },
        {
          type: 'quiz',
          question: 'ဒါက ဘာကို print ထုတ်မလဲ?',
          explanation:
            'continue က i က 3 ဖြစ်တဲ့ pass ကိုပဲ ကျော်တယ်။ Loop က 4 နဲ့ 5 ကို ဆက်လုပ်တယ်။ break ဆိုရင် 1 နဲ့ 2 ပဲ print ထွက်မယ်။'
        },
        {
          type: 'code',
          title:
            'လေ့ကျင့်ခန်း: break နဲ့ ပထမဆုံး ကိုက်ညီတာကို ရှာပါ — 101 ကနေ စပြီး 5 ရော 7 ရော နဲ့ စားလို့ပြတ်တဲ့ ပထမ ဂဏန်းကို ရှာပါ'
        },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' }
      ],
      notes:
        'Games စာမျက်နှာက Loop ပြေးသူ ဂိမ်းကို projector ပေါ်မှာ ကစားပါ: ကျောင်းသားတွေ အဖြေ အော်ဖြေပြီး loop run တာကို အတူတူ ကြည့်ပါ။'
    },
    {
      id: 'while-vs-for',
      eyebrow: 'Loop များ · ရွေးချယ်ခြင်း',
      title: 'while လား for လား?',
      blocks: [
        {
          type: 'table',
          columns: ['သုံးရန်', 'ဘယ်အချိန်', 'ဥပမာ'],
          rows: [
            [
              'for',
              'မစခင် value တွေ ဒါမှမဟုတ် အကြိမ်ရေကို သိရင်',
              'မြှောက်ဇယား print ထုတ်; စာလုံးတိုင်းကို စစ်'
            ],
            [
              'while',
              'တစ်ခုခု မဖြစ်မချင်း ထပ်လုပ်ရင်',
              'Password မှန်တဲ့အထိ မေး; ပန်းတိုင် ရောက်တဲ့အထိ စု'
            ]
          ]
        },
        {
          type: 'callout',
          title: 'လက်တွေ့ စည်းမျဉ်း',
          body: 'for loop နဲ့ လုပ်လို့ရရင် for ကို သုံးပါ။ မေ့စရာ စ value ဒါမှမဟုတ် update မရှိလို့ မတော်တဆ အဆုံးမရှိ run တာ ဘယ်တော့မှ မဖြစ်ဘူး။'
        }
      ]
    },
    {
      id: 'practice',
      eyebrow: 'လေ့ကျင့်ခန်း',
      title: 'လေ့ကျင့်ခန်း အစုံ: လွယ်ရာကနေ စိန်ခေါ်မှုအထိ',
      blocks: [
        {
          type: 'text',
          body: [
            'လေ့ကျင့်ခန်း ခြောက်ခု ရှိတယ်၊ ★ (လွယ်) ကနေ ★★★ (စိန်ခေါ်) အထိ။ တစ်ခုချင်းအတွက်: ① comment တွေကို ဖတ် ② box ထဲမှာ code ရေး ③ **Run** နှိပ်ပြီး comment က တောင်းတာနဲ့ နှိုင်းယှဉ် ④ အဲဒီနောက်မှ အဖြေကို ဖွင့်ပါ။',
            'လေ့ကျင့်ခန်းတိုင်းက ဒီနေ့ ပုံစံတစ်ခုခုကို သုံးတယ်: **အကြိမ်ရေ ပုံသေ ထပ်လုပ်** (`for` + `range`)၊ **တစ်ခုခု မဖြစ်မချင်း ထပ်လုပ်** (`while`)၊ **total / counter** ဒါမှမဟုတ် **စောစော ရပ်** (`break`)။',
            '**★1** ကြယ် တြိဂံ: ကြယ် ၁ ပွင့်ကနေ ၅ ပွင့်အထိ စာကြောင်း ၅ ကြောင်း။ **★2** စာကြောင်းထဲက vowel (a, e, i, o, u) တွေကို ရေတွက်။ **★★3** ဂဏန်းရဲ့ digit တွေကို ပေါင်း (4729 → 22)။ **★★4** input() နဲ့ အမှတ် ၅ ခု မေးပြီး စုစုပေါင်းနဲ့ ပျမ်းမျှ။ **★★★5** password ကို အများဆုံး ၃ ခါ ကြိုးစားခွင့်။ **★★★6** ဂဏန်း ခန့်မှန်း ဂိမ်း: မှန်တဲ့အထိ "Too low / Too high" အရိပ်အမြွက် ပေးပါ။'
          ]
        },
        { type: 'code', title: '★ လေ့ကျင့်ခန်း ၁: ကြယ် တြိဂံ' },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' },
        { type: 'code', title: '★ လေ့ကျင့်ခန်း ၂: vowel တွေကို ရေတွက်ပါ' },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' },
        { type: 'code', title: '★★ လေ့ကျင့်ခန်း ၃: digit တွေကို ပေါင်းပါ' },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' },
        {
          type: 'loop',
          title: 'Digit ပေါင်းခြင်း run တာကို ကြည့်ပါ',
          explanation:
            'Pass တိုင်း n % 10 နဲ့ နောက်ဆုံး digit (9၊ ပြီးမှ 2၊ 7၊ 4) ကို ယူပြီး n //= 10 နဲ့ ဖယ်တယ်။ n က 0 ရောက်တော့ condition က False ဖြစ်ပြီး total က 22။'
        },
        { type: 'code', title: '★★ လေ့ကျင့်ခန်း ၄: အမှတ် ငါးခုရဲ့ ပျမ်းမျှ' },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' },
        { type: 'code', title: '★★★ လေ့ကျင့်ခန်း ၅: password ကို သုံးခါ ကြိုးစားခွင့်' },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' },
        { type: 'code', title: '★★★ လေ့ကျင့်ခန်း ၆: ဂဏန်း ခန့်မှန်းပါ' },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' }
      ],
      notes:
        'ကျောင်းသားတွေကို အတွဲလိုက် လုပ်ခိုင်းပါ။ ★★ နဲ့ ★★★ အချိန်မှာ လှည့်ကြည့်ပါ; အမှားအများစုက update ပျောက်တာ (loop မဆုံး) ဒါမှမဟုတ် loop ထဲမှာ total ပြန်စတာပါ။ Password နဲ့ ခန့်မှန်း program တွေကို အဖြေ မတူအောင် Input box value တွေ ပြောင်းပြီး စမ်းပါ။'
    },
    {
      id: 'project',
      eyebrow: 'Mini project',
      title: 'မြှောက်ဇယား နှင့် ငွေစုပန်းတိုင်',
      blocks: [
        {
          type: 'callout',
          title: 'လိုအပ်ချက်များ',
          body: 'အပိုင်း ၁: ဂဏန်းတစ်ခု မေးပြီး သူ့ရဲ့ မြှောက်ဇယားကို 1 ကနေ 10 အထိ “7 x 3 = 21” ပုံစံနဲ့ print ထုတ်ပါ။ အပိုင်း ၂: တစ်ပတ်ကို ဘယ်လောက် စုလဲ နဲ့ ပန်းတိုင်ကို မေးပါ။ ပန်းတိုင် ရောက်ဖို့ ဘယ်နှပတ် ကြာလဲ while loop နဲ့ print ထုတ်ပါ။'
        },
        { type: 'code', title: 'ဒီမှာ ကိုယ်တိုင် ရေးပါ (စိတ်ကြိုက် ပြင်နိုင်)' },
        { type: 'code', title: 'ဖြစ်နိုင်တဲ့ အဖြေ တစ်ခု' },
        {
          type: 'callout',
          title: 'အဆင့်မြှင့်',
          body: 'အပိုင်း ၁ မှာ 5 အတွက် စာကြောင်းကို continue နဲ့ ကျော်ပါ။ အပိုင်း ၂ မှာ အပတ်တိုင်း စုစုပေါင်းကို print ထုတ်ပြီး တစ်ပတ် စုငွေ 0 ဖြစ်ရင် break နဲ့ စောစော ရပ်ပါ (မဟုတ်ရင် loop ဘယ်တော့မှ မဆုံးဘူး)။'
        }
      ],
      notes:
        'Solution ကို 7, 1500, 10000 နဲ့ စမ်းပါ (၇ ပတ်)၊ ပြီးရင် တစ်ပတ် စုငွေ 0 ဆိုရင် ဘာဖြစ်မလဲ၊ အဆင့်မြှင့်မှာ break ကို ဘာကြောင့် ပြောလဲ မေးပါ။'
    },
    {
      id: 'errors',
      eyebrow: 'Debugging',
      title: 'ဒီနေ့ တွေ့ရမယ့် error အသစ်များ',
      blocks: [
        {
          type: 'table',
          columns: ['ပြဿနာ', 'ဥပမာ', 'ဆိုလိုချက်'],
          rows: [
            [
              'မဆုံးနိုင်တဲ့ loop',
              'while i <= 3: print(i)',
              'Update (i += 1) မပါလို့ condition က ဘယ်တော့မှ False မဖြစ်ဘူး'
            ],
            [
              'တစ်လုံး လွဲ',
              'range(1, 10)',
              '10 မဟုတ်ဘဲ 9 မှာ ရပ်တယ်။ 10 ပါချင်ရင် range(1, 11) သုံးပါ'
            ],
            [
              'IndentationError',
              'print(i)',
              'Loop body ကို for / while စာကြောင်း အောက်မှာ indent မလုပ်ထားဘူး'
            ],
            ['TypeError', 'range(2.5)', 'range() က float မဟုတ်ဘဲ ကိန်းပြည့် (int) လိုတယ်']
          ]
        },
        { type: 'code', title: 'Bug တွေကို ပြင်ပါ (နှစ်ခု ရှိတယ်): 15 ကို print ထုတ်ရမယ်' }
      ]
    },
    {
      id: 'review',
      eyebrow: 'ပြန်လည်သုံးသပ်ခြင်း',
      title: 'ဒါတွေကို ဖြေနိုင်လား?',
      blocks: [
        {
          type: 'quiz',
          question: 'list(range(3)) က ဘာလဲ?',
          explanation: 'range(3) က 0 ကနေ စပြီး 3 မတိုင်ခင် ရပ်တယ်။'
        },
        {
          type: 'quiz',
          question: 'Password မှန်တဲ့အထိ မေးဖို့ ဘယ် loop ကို သုံးသင့်လဲ?',
          options: ['for', 'while', 'ဘယ်ဟာမဆို၊ ကွာခြားချက် မရှိ', 'နှစ်ခုလုံး မဟုတ်'],
          explanation: 'ဘယ်နှခါ ကြိုးစားရမလဲ မသိတော့ password မှားနေသရွေ့ ထပ်လုပ်ပါ။'
        },
        {
          type: 'quiz',
          question: 'break က ဘာလုပ်လဲ?',
          options: [
            'ဒီ pass ရဲ့ ကျန်တာကို ကျော်တယ်',
            'Loop ကို ချက်ချင်း ထွက်တယ်',
            'Program တစ်ခုလုံးကို ရပ်တယ်',
            'Loop ကို ပြန်စတယ်'
          ],
          explanation:
            'break က loop ကို ထွက်ပြီး program က loop အောက်က ဆက် run တယ်။ Pass ရဲ့ ကျန်တာကို ကျော်တာက continue ပါ။'
        },
        {
          type: 'callout',
          title: 'အိမ်စာ: FizzBuzz',
          body: '1 ကနေ 20 အထိ ဂဏန်းတွေကို print ထုတ်ပါ၊ ဒါပေမဲ့ 3 ရဲ့ ဆတိုးကိန်းအတွက် “Fizz”၊ 5 ရဲ့ ဆတိုးကိန်းအတွက် “Buzz”၊ နှစ်ခုလုံးရဲ့ ဆတိုးကိန်းအတွက် “FizzBuzz” print ထုတ်ပါ။ အဆင့်မြှင့်: Fizz၊ Buzz နဲ့ FizzBuzz ဘယ်နှခါ print ထုတ်ခဲ့လဲ ရေတွက်ပြီး အဆုံးမှာ စုစုပေါင်းကို ပြပါ။'
        }
      ]
    }
  ]
}

export default day3
