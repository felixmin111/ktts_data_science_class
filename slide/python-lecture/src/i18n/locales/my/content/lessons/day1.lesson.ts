import type { LessonTranslation } from '@/models/translation.model'

const day1: LessonTranslation = {
  title: 'Python ဖြင့် ကွန်ပျူတာနှင့် စကားပြောခြင်း',
  summary:
    'print()၊ variable များ၊ data type များနှင့် input() — နောက်ကွယ်မှာ Python တကယ်ဘာလုပ်နေလဲ ဆိုတာပါ ကြည့်မယ်။',
  topics: ['print()', 'Variable များ', 'str / int / float', 'input()', 'f-string များ'],
  sections: [
    {
      id: 'programming',
      eyebrow: 'အနွေးလေ့ကျင့်ခန်း',
      title: 'Programming = တိကျတဲ့ ညွှန်ကြားချက် ပေးခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            'လူတစ်ယောက်က “Neo ကို နှုတ်ဆက်လိုက်” ဆိုတာကို နားလည်ပြီး ကွက်လပ်တွေကို common sense နဲ့ ဖြည့်တွေးပါတယ်။ ကွန်ပျူတာကတော့ စာလုံးပေါင်း၊ ကွင်းနဲ့ quote တွေ တိကျတဲ့ ညွှန်ကြားချက် လိုပါတယ် — ရေးထားတာကို **အတိအကျ** လုပ်ပါတယ်။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'စက်ရုပ် စားဖိုမှူး',
          body: 'လူစားဖိုမှူးက “ဆားနည်းနည်း ထည့်” ဆိုတာ နားလည်တယ်။ စက်ရုပ် စားဖိုမှူးကတော့ “အိုး ၁ ထဲကို ဆား ၂ ဂရမ် အခုထည့်” လို့ ပြောမှ ရတယ်။ Code ဆိုတာ စက်ရုပ်ရဲ့ ချက်ပြုတ်နည်း — တိကျတယ်၊ အစီအစဉ်ကျတယ်၊ စာလုံးအတိုင်း လိုက်လုပ်တယ်။'
        }
      ],
      notes:
        'မေးကြည့်ပါ: Facebook၊ TikTok၊ banking app ဘယ်သူသုံးလဲ? နှိပ်လိုက်တိုင်း တစ်ယောက်ယောက် ရေးထားတဲ့ ညွှန်ကြားချက်တွေ run နေတာပါ။ Run မနှိပ်ခင် output ကို ကြိုခန့်မှန်းခိုင်းပါ။'
    },
    {
      id: 'how-python-runs',
      eyebrow: 'Python ဆိုတာ ဘာလဲ?',
      title: 'Run ကို နှိပ်လိုက်တဲ့အခါ ဘာဖြစ်သွားလဲ',
      blocks: [
        {
          type: 'table',
          columns: ['အဆင့်', 'ဘာဖြစ်လဲ'],
          rows: [
            ['1. Source', 'hello.py — သင်ရေးတဲ့ ရိုးရိုး စာသား'],
            [
              '2. Compiler',
              'သဒ္ဒါကို စစ်ပြီး bytecode အဖြစ် ဘာသာပြန်တယ် (SyntaxError က ဒီမှာ ဖြစ်တယ်)'
            ],
            [
              '3. Bytecode',
              'Virtual machine အတွက် ရိုးရှင်းတဲ့ ညွှန်ကြားချက် အသေးလေးတွေ (.pyc အဖြစ် သိမ်းထားတယ်)'
            ],
            ['4. Python VM', 'Bytecode ကို တစ်ဆင့်ချင်း run ပြီး output ထုတ်ပေးတယ်']
          ]
        },
        {
          type: 'analogy',
          title: 'သီချင်း notes စာရွက်',
          body: 'သင်က သီချင်းကို ရေးစပ်တယ် (source)။ ကူးရေးသူက ပိုရိုးရှင်းတဲ့ notation နဲ့ ပြန်ရေးတယ် (bytecode)။ ဂီတပညာရှင် — Python Virtual Machine — က note တစ်ခုချင်း တီးတယ်။'
        },
        { type: 'code', title: 'Bytecode ကို ချောင်းကြည့်ရအောင်' },
        {
          type: 'callout',
          title: 'အသေးစိတ်',
          body: 'Bytecode ထဲမှာ 10 + 5 က 15 ဖြစ်နေပြီ ဆိုတာ သတိထားကြည့်ပါ — program မ run ခင်ကတည်းက compiler က constant expression တွေကို တွက်ထားပြီးသားပါ။'
        }
      ]
    },
    {
      id: 'print-anatomy',
      eyebrow: 'print()',
      title: 'ပထမဆုံး code တစ်ကြောင်းကို ခွဲခြမ်းကြည့်ခြင်း',
      blocks: [
        { type: 'code' },
        {
          type: 'table',
          columns: ['အပိုင်း', 'အမည်', 'အဓိပ္ပာယ်'],
          rows: [
            [
              'print',
              'built-in function',
              'Python နဲ့အတူ ပါလာတဲ့ နာမည်ပေးထားပြီး ထပ်ခါသုံးလို့ရတဲ့ လုပ်ဆောင်ချက်'
            ],
            ['( )', 'call operator', '“အခု run လိုက်” ။ အထဲက value တွေက argument — input တွေပါ'],
            [
              '" "',
              'string literal',
              'Quote တွေက စာသား ဘယ်ကစပြီး ဘယ်မှာဆုံးလဲ ပြတယ်။ \' \' ရော " " ရော သုံးလို့ရတယ်'
            ]
          ]
        },
        {
          type: 'analogy',
          title: 'အရောင်းစက် (vending machine)',
          body: 'print က စက်၊ ( ) က ခလုတ်နှိပ်တာ၊ အထဲထည့်တာက သင်ရွေးတဲ့ ပစ္စည်း။ ခလုတ်မနှိပ်ရင် = ဘာမှ မဖြစ်ဘူး။'
        }
      ]
    },
    {
      id: 'print-options',
      eyebrow: 'print()',
      title: 'sep နဲ့ end: print() မှာ ခလုတ်တွေ ပိုရှိသေးတယ်',
      blocks: [
        {
          type: 'text',
          body: [
            'တကယ့် signature က `print(*objects, sep=" ", end="\\n", file=sys.stdout, flush=False)` ပါ။ Value တိုင်းကို `str()` နဲ့ စာသားပြောင်းတယ်၊ `sep` နဲ့ ဆက်တယ်၊ `end` နဲ့ အဆုံးသတ်တယ်။',
            'print() က **None ကို return ပြန်တယ်** — value ကို ပြပေးတာ၊ ပြန်ပေးတာ မဟုတ်ဘူး။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'နံရံ ဆောက်ခြင်း',
          body: 'sep က အုတ်တွေကြားက အင်္ဂတေ၊ end က အပေါ်ဆုံး အဖုံး။ မူလ အင်္ဂတေ = space တစ်ခု၊ မူလ အဖုံး = စာကြောင်းအသစ်။'
        },
        {
          type: 'quiz',
          question: 'ဒါက ဘာကို print ထုတ်မလဲ?',
          explanation: 'sep="" ဆိုတော့ value နှစ်ခုကြားမှာ ဘာမှ မထည့်ဘူး။'
        }
      ]
    },
    {
      id: 'operators',
      eyebrow: 'print()',
      title: 'Python ကို ဂဏန်းပေါင်းစက်အဖြစ် သုံးခြင်း',
      blocks: [
        {
          type: 'table',
          columns: ['Operator', 'အဓိပ္ပာယ်', 'ဥပမာ', 'ရလဒ်'],
          rows: [
            ['+', 'ပေါင်း', '7 + 2', '9'],
            ['-', 'နုတ်', '7 - 2', '5'],
            ['*', 'မြှောက်', '7 * 2', '14'],
            ['/', 'စား (အမြဲ float)', '7 / 2', '3.5'],
            ['//', 'အောက်သို့ ပြည့်ကိန်းစား (floor divide)', '7 // 2', '3'],
            ['%', 'အကြွင်း', '7 % 2', '1'],
            ['**', 'ထပ်ကိန်း', '7 ** 2', '49']
          ]
        },
        {
          type: 'analogy',
          title: 'ကွတ်ကီး ၁၇ ခု၊ သူငယ်ချင်း ၅ ယောက်',
          body: '17 // 5 → တစ်ယောက်ကို ၃ ခုစီ။ 17 % 5 → ၂ ခု ကျန်တယ်။'
        },
        { type: 'code' }
      ]
    },
    {
      id: 'variables',
      eyebrow: 'Variable များ',
      title: 'Variable ဆိုတာ သေတ္တာ မဟုတ်ဘူး။ နာမည်ကပ်ပြား ဖြစ်တယ်။',
      blocks: [
        {
          type: 'text',
          body: [
            '`name = "Neo"` ရဲ့ အဓိပ္ပာယ်က: ပထမ `"Neo"` object ကို ဖန်တီးတယ်၊ ပြီးမှ `name` ဆိုတဲ့ နာမည်ကို အဲဒီ object မှာ **ကပ်** လိုက်တယ်။ Assignment ကို ညာမှ ဘယ်သို့ ဖတ်ပါ။ `=` က “ညီတယ်” မဟုတ်ဘူး — အဲဒါက `==` ပါ။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ဖုန်းထဲက contact များ',
          body: '“အမေ” ဆိုတာ ဖုန်းနံပါတ် မဟုတ်ဘူး — ဖုန်းနံပါတ်တစ်ခုကို ညွှန်ပြနေတဲ့ ဖုန်းထဲသိမ်းထားတဲ့ နာမည်ပါ။ Python ရဲ့ နာမည်တွေက namespace ထဲမှာ နေတယ်၊ value တွေက memory ထဲမှာ နေတယ်။'
        },
        {
          type: 'callout',
          title: 'သင့်အလှည့်',
          body: 'name၊ age၊ country နဲ့ favorite_food ကို ကိုယ်ပိုင် value တွေနဲ့ ဖန်တီးပြီး လေးခုလုံးကို print ထုတ်ပါ။'
        }
      ]
    },
    {
      id: 'aliasing',
      eyebrow: 'Variable များ',
      title: 'နာမည် နှစ်ခု၊ object တစ်ခု — နှင့် rebinding',
      blocks: [
        {
          type: 'text',
          body: [
            'Python variable တွေက **object ကို ညွှန်တဲ့ နာမည်တွေ** ဖြစ်တယ်။ နာမည်များစွာက object တစ်ခုတည်းကို ညွှန်နိုင်တယ်။ `b = a` က object ကို copy မလုပ်ဘဲ နာမည်ကို ချိတ်ပေးတာပါ။',
            '**Mutable** object တွေကို ဖန်တီးပြီးနောက် ပြောင်းလဲနိုင်တယ်။ `list`, `dict`, `set` တို့ ပါဝင်တယ်။ နာမည်နှစ်ခုက object တစ်ခုတည်းကို ညွှန်နေရင် တစ်ခုကနေ ပြောင်းတာကို နှစ်ခုလုံးက မြင်ရတယ်။',
            '**Immutable** object တွေကို ဖန်တီးပြီးနောက် ပြောင်းလဲမရဘူး။ `int`, `float`, `str`, `bool`, `tuple` တို့ ပါဝင်တယ်။ Value အသစ် assign လုပ်ရင် နာမည်ကို တခြား object ဆီ ပြန်ချိတ်ပေးတယ်။ အဲဒီ object ကို Python က ဖန်တီးနိုင်သလို ရှိပြီးသားကို သုံးနိုင်တယ်။'
          ]
        },
        { type: 'code', title: 'Mutation: အတူသုံးတဲ့ list ကို ပြောင်းခြင်း' },
        { type: 'code', title: 'Rebinding: နာမည်တစ်ခုကို string တခြားတစ်ခုဆီ ရွှေ့ခြင်း' },
        {
          type: 'callout',
          title: 'ဘာ operation လုပ်လဲ ဆိုတာ အရေးကြီးတယ်',
          body: 'a.append(3) က list ကို ပြောင်းတယ်။ a = [3] က a နာမည်ကို ပြန်ချိတ်တယ်။ Tuple ရဲ့ element တွေကို အစားထိုးမရပေမယ့် အထဲက mutable object (ဥပမာ list) ကို ပြောင်းနိုင်တယ်။'
        },
        { type: 'memory' },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ပုလင်းပေါ်က sticky note များ',
          body: 'ပုလင်းတစ်လုံးပေါ်မှာ sticky note နှစ်ခု။ Note a ကို ခွာပြီး ပုလင်းအသစ်ပေါ် ကပ်လိုက်ရင် — ပုလင်းအဟောင်း မပြောင်းဘူး၊ note b လည်း မပြောင်းဘူး။'
        },
        {
          type: 'text',
          body: [
            '`x = x + 1` က algebra မဟုတ်ဘူး: ① ညာဘက်ကို အရင်တွက် (x ကို ရှာ → 5) ② int object **အသစ်** 6 ကို တွက်ထုတ် ③ x ကပ်ပြားကို အဲဒီပေါ် ရွှေ့ကပ်။ Int တွေက immutable — 5 object ကို ဘယ်တော့မှ မပြောင်းဘူး။'
          ]
        },
        { type: 'code' },
        {
          type: 'quiz',
          question: 'ဒီ code ပြီးရင် b က ဘာလဲ?',
          options: ['10', '15', '5', 'Error'],
          explanation:
            'b က 10 object ကို ညွှန်နေတုန်းပဲ။ a + 5 က object အသစ် 15 ကို ဖန်တီးပြီး a ကပ်ပြားတစ်ခုတည်းပဲ ရွှေ့သွားတယ်။'
        }
      ]
    },
    {
      id: 'naming',
      eyebrow: 'Variable များ',
      title: 'နာမည်ပေးခြင်း: စည်းမျဉ်းများနှင့် ထုံးစံများ',
      blocks: [
        {
          type: 'table',
          columns: ['စည်းမျဉ်း', 'ရတယ်', 'Error / ရှောင်ပါ'],
          rows: [
            ['စာလုံး၊ ဂဏန်း နဲ့ _ သာ', 'user_name', 'user-name (error)'],
            ['ဂဏန်းနဲ့ မစရ', 'name2', '2name (error)'],
            ['အကြီးအသေး ခွဲတယ်', 'age နဲ့ Age မတူဘူး', '—'],
            ['Keyword မဖြစ်ရ', 'class_name', 'class (error)'],
            ['ထုံးစံ: snake_case', 'favorite_food', 'FavoriteFood (Python ပုံစံ မဟုတ်)'],
            ['ထုံးစံ: CONSTANT များ', 'PI = 3.14159', '—']
          ]
        },
        { type: 'code', title: 'Reserved keyword အားလုံး' }
      ]
    },
    {
      id: 'types',
      eyebrow: 'Data type များ',
      title: 'အဓိက type သုံးမျိုး၊ လက်တွေ့ဘဝက အရာသုံးခု',
      blocks: [
        {
          type: 'table',
          columns: ['Type', 'အဓိပ္ပာယ်', 'ဥပမာ', 'နှိုင်းယှဉ်ချက်'],
          rows: [
            ['str', 'စာသား', '"Neo"', 'ဆွဲကြိုးထဲက ပုတီးစေ့များ — အစီအစဉ်ကျတဲ့ character တန်း'],
            [
              'int',
              'ကိန်းပြည့်',
              '25',
              'အကြွေစေ့ ရေတွက်ခြင်း — တိကျတယ်၊ အပိုင်းကိန်း မရှိ၊ အရွယ်အစား ကန့်သတ်ချက် မရှိ'
            ],
            [
              'float',
              'ဒဿမကိန်း',
              '1.75',
              'ပေတံနဲ့ တိုင်းခြင်း — လုံလောက်အောင် တိကျတယ်၊ ဒါပေမဲ့ အမြဲ ခန့်မှန်းတန်ဖိုး'
            ]
          ]
        },
        { type: 'code' }
      ]
    },
    {
      id: 'strings',
      eyebrow: 'Data type · str',
      title: 'String များ: character တန်းတစ်ခု',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ဆွဲကြိုး',
          body: 'ပုတီးစေ့ 0 ကို ကြည့်လို့ရတယ်၊ ပုတီးစေ့တွေ ရေလို့ရတယ်၊ အပိုင်းတစ်ပိုင်း ကူးလို့ရတယ် — ဒါပေမဲ့ ပုတီးစေ့ကို လဲလို့ မရဘူး။ String တွေက immutable: အသစ်တစ်ခု တည်ဆောက်ပါ၊ ဥပမာ "J" + s[1:]။'
        },
        {
          type: 'text',
          body: [
            '**Immutable** ဆိုတာ “တည်ဆောက်ပြီးရင် ပြောင်းလို့မရ” လို့ ဆိုလိုတယ်။ Character တစ်လုံးကို ဖတ်တာ (`s[0]`) ရတယ်၊ ဒါပေမဲ့ အစားထိုးဖို့ (`s[0] = "J"`) ကြိုးစားရင် **TypeError** တက်တယ်။',
            '"Jython" ရချင်ရင် string **အသစ်** တစ်ခု တည်ဆောက်ရတယ်: `"J"` + `s[1:]` (index 1 ကနေ အဆုံးထိ၊ "ython") → "Jython"။ ပြီးမှ `s = ...` နဲ့ s ကပ်ပြားကို string အသစ်ပေါ် ရွှေ့ကပ်တယ်။ မူလ "Python" ကို လုံးဝ မထိဘူး။',
            'String method တွေလည်း ဒီအတိုင်းပဲ: `s.upper()`၊ `s.replace("P", "J")` တို့က string အသစ်ကို **return** ပြန်ပေးတယ်။ ရလဒ်ကို မသိမ်းထားရင် ဘာမှ မပြောင်းဘူး။'
          ]
        },
        { type: 'code', title: 'Character တစ်လုံးကို ပြောင်းကြည့်ပါ' },
        { type: 'code', title: 'အစား string အသစ် တည်ဆောက်ပါ' },
        {
          type: 'callout',
          title: 'အဖြစ်များတဲ့ အမှား',
          body: '`name.upper()` ကို သီးသန့်တစ်ကြောင်း ရေးပြီး name ပြောင်းသွားမယ်လို့ ထင်တာ။ Method တွေက string ကို နေရာမှာတင် ဘယ်တော့မှ မပြင်ဘူး — ရလဒ်ကို အမြဲ ပြန်သိမ်းပါ: `name = name.upper()`။'
        },
        {
          type: 'code',
          title: 'လေ့ကျင့်ခန်း: print() တစ်ခုချင်းစီကို ဖြည့်ပါ (comment ထဲက မေးခွန်းကို ဖြေပါ)'
        },
        { type: 'code', title: 'ဖြေနည်း တစ်ခု' },
        {
          type: 'quiz',
          question: 'ဒါက ဘာကို print ထုတ်မလဲ?',
          explanation: 'အနုတ် index တွေက နောက်ဆုံးကနေ ရေတယ်: s[-1] က "n"၊ ဒါကြောင့် s[-2] က "o"။'
        },
        {
          type: 'quiz',
          question: 'ဒါက ဘာကို print ထုတ်မလဲ?',
          explanation: 'stop မပါရင် “အဆုံးထိ” လို့ ဆိုလိုတယ်။ Index 2 က "t" မို့ "thon" ရတယ်။'
        },
        {
          type: 'quiz',
          question: 'ဒါက ဘာကို print ထုတ်မလဲ?',
          explanation: 's[:2] က "Py" (start မပါရင် “အစကနေ”)၊ s[-1] က "n": "Py" + "n" = "Pyn"။'
        },
        {
          type: 'quiz',
          question: 'ဒါက ဘာကို print ထုတ်မလဲ?',
          explanation:
            'upper() က string အသစ်ကို return ပြန်ပေမဲ့ ဘယ်သူမှ မသိမ်းထားဘူး။ name က "cat" ကိုပဲ ညွှန်နေတုန်း။ name = name.upper() လို့ ရေးပါ။'
        },
        {
          type: 'quiz',
          question: 'ဘာဖြစ်မလဲ?',
          options: ['IndexError', 'ဘာမှ print မထွက်ဘူး', 'n', '""'],
          explanation: '"Python" မှာ index 0 ကနေ 5 ထိပဲ ရှိတယ်။ Index 10 ကို တောင်းရင် အပြင်ရောက်သွားတယ်: IndexError။'
        }
      ]
    },
    {
      id: 'numbers',
      eyebrow: 'Data type · int & float',
      title: 'int မှာ အမြင့်ဆုံး ကန့်သတ်ချက် မရှိ၊ float က ခန့်မှန်းတန်ဖိုး',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: '1 ÷ 3',
          body: 'ဒဿမမှာ 1/3 = 0.3333… တစ်နေရာမှာ ရပ်ရမယ်။ Float တွေကို binary (IEEE 754) နဲ့ သိမ်းတယ်၊ 0.1 မှာလည်း binary မှာ ဒီပြဿနာ ရှိတယ်။ Float တွေကို == နဲ့ ဘယ်တော့မှ မနှိုင်းယှဉ်ပါနဲ့ ; ငွေအတွက်ဆိုရင် int ပြား ဒါမှမဟုတ် decimal.Decimal သုံးပါ။'
        },
        {
          type: 'callout',
          title: 'အသေးစိတ်',
          body: 'Python int တွေက memory ခွင့်ပြုသလောက် ကြီးလာနိုင်တယ် — Java ရဲ့ 2,147,483,647 ကန့်သတ်ချက်လို overflow မဖြစ်ဘူး။ လိုအပ်တိုင်း ဘီးအသစ်ထပ်ထည့်တဲ့ မိုင်တိုင်းကိရိယာလိုပဲ။'
        }
      ]
    },
    {
      id: 'text-vs-number',
      eyebrow: 'Data type များ',
      title: '"20" က စာသား။ 20 က ဂဏန်း။',
      blocks: [
        {
          type: 'table',
          columns: ['Expression', 'ရလဒ်', 'ဘာကြောင့်လဲ'],
          rows: [
            ['"20" + "5"', '"205"', '+ က string တွေကို ဆက်တယ်'],
            ['20 + 5', '25', '+ က ဂဏန်းတွေကို ပေါင်းတယ်'],
            ['"20" * 3', '"202020"', '* က string ကို ထပ်ခါ ပွားတယ်'],
            ['"20" + 5', 'TypeError', 'သင်ဆိုလိုတာကို Python က မှန်းမပေးဘူး']
          ]
        },
        {
          type: 'analogy',
          title: 'ဘောလုံး ဂျာစီ',
          body: 'ဂျာစီပေါ် ရိုက်ထားတဲ့ “20” က label တစ်ခု — ရမှတ်ထဲ ပေါင်းလို့ မရဘူး။ ဂိုး 20 ကတော့ ပေါင်းလို့ရတဲ့ ပမာဏ။'
        },
        { type: 'code', title: 'Dynamic + strong typing' }
      ],
      notes: 'ဒီနေရာမှာ Games စာမျက်နှာက Type Detective ဂိမ်းကို ကစားပါ — ၃ မိနစ်လောက် ကြာတယ်။'
    },
    {
      id: 'input',
      eyebrow: 'input()',
      title: 'နားထောင်တတ်တဲ့ program များ',
      blocks: [
        {
          type: 'text',
          body: [
            'input() က ① prompt ကို ပြတယ် ② program ကို ခဏရပ်တယ် ③ user ရိုက်ပြီး Enter နှိပ်တာကို စောင့်တယ် ④ ရိုက်ထားတာကို **str အဖြစ်** return ပြန်တယ်။',
            'ဒီ site မှာတော့ အဖြေတွေက code အောက်က **Input** box ကနေ လာတယ် — input() တစ်ခါခေါ်တိုင်း တစ်ကြောင်း။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'စားပွဲထိုး',
          body: 'စားပွဲထိုးက မေးတယ်၊ အဖြေကို စောင့်တယ်၊ မှတ်စုစာအုပ်ထဲ ရေးတယ် — အမြဲ စာလုံးအဖြစ်ပဲ။ “25” တောင်မှ မီးဖိုချောင်က ပြောင်းမပေးမချင်း မင်ရေးထားတာပဲ။'
        }
      ]
    },
    {
      id: 'conversion',
      eyebrow: 'input()',
      title: 'input() က အမြဲ string ကို return ပြန်တယ်',
      blocks: [
        { type: 'code', title: 'ထောင်ချောက်' },
        { type: 'code', title: 'ပြင်နည်း — အတွင်းကနေ အပြင်ကို ဖတ်ပါ' },
        {
          type: 'table',
          columns: ['ခေါ်ပုံ', 'ရလဒ်', 'မှတ်ချက်'],
          rows: [
            ['int("25")', '25', 'စာသား → ကိန်းပြည့်'],
            ['float("1.75")', '1.75', 'စာသား → ဒဿမကိန်း'],
            ['str(25)', '"25"', 'ဂဏန်း → စာသား'],
            ['int(3.99)', '3', 'ဒဿမကို ဖြတ်ပစ်တယ် — round မလုပ်ဘူး!'],
            ['int("3.5")', 'ValueError', 'float() ကို အရင်သုံးပါ'],
            ['int("abc")', 'ValueError', 'ဂဏန်းလုံးဝ မဟုတ်ဘူး']
          ]
        },
        {
          type: 'analogy',
          title: 'ငွေလဲကောင်တာ',
          body: 'တကယ့် ဘတ်ငွေစက္ကူ ပေးရင် → ဒေါ်လာ ရတယ်။ Monopoly ငွေ ပေးရင် → ကောင်တာက လက်မခံဘူး။ အဲဒီ ငြင်းပယ်ခြင်းက ValueError ပါ။'
        }
      ]
    },
    {
      id: 'fstrings',
      eyebrow: 'Format ချခြင်း',
      title: 'f-string များ: ကွက်လပ်ဖြည့်ခြင်း',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'Form စာ',
          body: '“ချစ်ခင်ရပါသော {name}၊ သင်မှာထားသော {price} ဘတ် order အဆင်သင့်ဖြစ်ပါပြီ။” Template ကို တစ်ခါရေးရုံပဲ၊ ကွက်လပ်တိုင်းကို Python က လက်ရှိ value နဲ့ ဖြည့်ပေးတယ်။'
        }
      ]
    },
    {
      id: 'project',
      eyebrow: 'Project အသေး',
      title: '“ကိုယ့်အကြောင်း” program တစ်ခု တည်ဆောက်ပါ',
      blocks: [
        {
          type: 'callout',
          title: 'လိုအပ်ချက်များ',
          body: 'User ရဲ့ နာမည်၊ နိုင်ငံ နဲ့ အကြိုက်ဆုံး အစားအစာကို မေးပြီး အချက်အလက်တွေကို print ထုတ်ပါ။ အဆင့်မြှင့်: အသက်ကို မေးပါ၊ int() နဲ့ ပြောင်းပြီး ခန့်မှန်း မွေးနှစ်ကို f-string နဲ့ print ထုတ်ပါ။'
        },
        { type: 'code', title: 'ဒီမှာ ကိုယ်တိုင်ရေးပါ (စိတ်ကြိုက်ပြင်ပါ)' },
        { type: 'code', title: 'ဖြေရှင်းနည်း တစ်ခု' }
      ]
    },
    {
      id: 'errors',
      eyebrow: 'Debugging',
      title: 'Error တွေကို ကျွမ်းကျင်သူလို ဖတ်ခြင်း',
      blocks: [
        {
          type: 'table',
          columns: ['Error', 'ဥပမာ', 'ဘာကိုဆိုလိုလဲ'],
          rows: [
            ['SyntaxError', 'print("Hi)', 'သဒ္ဒါ ပျက်နေတယ်: quote ဒါမှမဟုတ် ကွင်း ကျန်ခဲ့တယ်'],
            [
              'NameError',
              'print(nmae)',
              'ဒီနာမည်ကို ဘယ်တုန်းကမှ assign မလုပ်ခဲ့ဘူး (စာလုံးပေါင်းမှား?)'
            ],
            ['TypeError', '"Age: " + 25', 'ဒီ operation အတွက် type မှားနေတယ်'],
            ['ValueError', 'int("twenty")', 'Type မှန်တယ်၊ value က မဖြစ်နိုင်ဘူး']
          ]
        },
        {
          type: 'analogy',
          title: 'ဆရာဝန်ရဲ့ အစီရင်ခံစာ',
          body: 'Traceback ဆိုတာ ဆေးစစ်ချက် အစီရင်ခံစာပါ: ရောဂါအမည်အတွက် နောက်ဆုံးစာကြောင်းကို တန်းကြည့်ပါ၊ ပြီးရင် ဘယ်နေရာ နာနေလဲ သိဖို့ line number ကို စစ်ပါ။'
        },
        { type: 'code', title: 'Bug ကို ပြင်ပါ' }
      ]
    },
    {
      id: 'review',
      eyebrow: 'ပြန်လည်သုံးသပ်ခြင်း',
      title: 'ဒါတွေကို ဖြေနိုင်မလား?',
      blocks: [
        {
          type: 'quiz',
          question: 'print() က ဘာကို return ပြန်လဲ?',
          options: ['သူ print ထုတ်ခဲ့တဲ့ စာသား', 'None', 'True', 'Character အရေအတွက်'],
          explanation: 'print() က value ကို ပြပေးတယ်၊ None ကို return ပြန်တယ်။'
        },
        {
          type: 'quiz',
          question: 'type(10 / 2) က ဘာလဲ?',
          explanation: '/ က အမြဲ float ကို return ပြန်တယ်: 5.0။'
        },
        {
          type: 'quiz',
          question: 'input() က အမြဲ ဘာကို return ပြန်လဲ?',
          options: ['int', 'User ရိုက်တာကို type မှန်အတိုင်း', 'str', 'None'],
          explanation:
            'input() က အမြဲ str ကို return ပြန်တယ် — int() ဒါမှမဟုတ် float() နဲ့ ပြောင်းပါ။'
        },
        {
          type: 'callout',
          title: 'အိမ်စာ: ကိုယ်ရေးအကျဉ်း Program',
          body: 'နာမည်၊ အသက်၊ နိုင်ငံ၊ အကြိုက်ဆုံး အစားအစာ နဲ့ ဝါသနာကို မေးပြီး သပ်သပ်ရပ်ရပ် profile တစ်ခု print ထုတ်ပါ။ စိန်ခေါ်မှု: int() နဲ့ အသက်ကို လအဖြစ်ပြောင်းပါ၊ print("=" * 30) နဲ့ ဘောင်ခတ်ပါ၊ f-string တွေ သုံးပါ။'
        }
      ]
    }
  ]
}

export default day1
