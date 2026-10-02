import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const PRINT = 'ဒီ loop က ဘာကို print ထုတ်မလဲ?'
const PASSES = 'Loop body က ဘယ်နှခါ run မလဲ?'
const after = (name: string) => `Loop ပြီးရင် ${name} ရဲ့ value က ဘာလဲ?`

const q = (prompt: string, explanation: string, options?: string[]): QuestionTranslation => ({
  prompt,
  explanation,
  ...(options && { options })
})

const loopRunner: GameTranslation = {
  title: 'Loop ပြေးသူ',
  tagline:
    'Loop diagram ကို ဖတ်၊ ရလဒ်ကို ခန့်မှန်း၊ ပြီးရင် pass တိုင်း တိုက်ရိုက် run တာကို ကြည့်ပါ။',
  bank: [
    // while loops
    q(
      PRINT,
      'i က 1 ကနေ စတယ်။ Pass တိုင်း i ကို print ထုတ်ပြီး 1 ပေါင်းတယ်။ i က 4 ဖြစ်တော့ 4 <= 3 က False ဖြစ်ပြီး loop ရပ်တယ်။'
    ),
    q(PRINT, 'ဒီမှာ i က print မထုတ်ခင် ကြီးလာလို့ ပထမ print က 1 ပြပြီး နောက်ဆုံးက 3 ပြတယ်။'),
    q(PASSES, 'n က 10 → 7 → 4 → 1 → -2 ဖြစ်တယ်။ Pass ၄ ခါ; ပြီးမှ -2 > 0 က False။'),
    q(
      after('n'),
      'Loop က n > 0 ကို အပေါ်မှာပဲ စစ်တယ်။ 1 ကနေ 3 ကို တစ်ခါ ထပ်နုတ်တော့ n က -2 မှာ ဆုံးတယ်။'
    ),
    q(
      PRINT,
      '5 < 3 က ပထမဆုံး အကြိမ်မှာတင် False မို့ body ဘယ်တော့မှ မ run ဘဲ ဘာမှ print မထွက်ဘူး။',
      ['(ဘာမှ print မထွက်ဘူး)', '5', '5\n6\n7', 'Error']
    ),
    q(
      after('x'),
      'x က နှစ်ဆ တိုးတယ်: 1, 2, 4, 8, 16, 32, 64။ 32 < 50 က True သေးလို့ 64 အထိ တစ်ခါ ထပ်တိုးတယ်။'
    ),
    q(
      after('n'),
      'while True က အဆုံးမရှိ run မှာ၊ ဒါပေမဲ့ n က 3 ရောက်တာနဲ့ break က loop ကို ထွက်တယ်။',
      ['3', '2', '4', 'Loop ဘယ်တော့မှ မဆုံးဘူး']
    ),
    // for loops and range
    q(PRINT, 'range(3) ဆိုတာ 0, 1, 2: 0 ကနေ စပြီး 3 မတိုင်ခင် ရပ်တယ်။'),
    q(PRINT, 'range(1, 5) က 1 ကနေ စပြီး 5 မတိုင်ခင် ရပ်တယ်: 1, 2, 3, 4။'),
    q(PRINT, '2 ကနေ စပြီး တစ်ခါ 3 ပေါင်း: 2, 5, 8။ နောက် value 11 က 10 အောက် မဟုတ်ဘူး။'),
    q(
      PRINT,
      'Step -1 က နောက်ပြန် ရေတယ်: 3, 2, 1။ 0 မတိုင်ခင် ရပ်တယ်။ Go! က loop အောက်မှာ ရှိလို့ တစ်ခါပဲ print ထွက်တယ်။'
    ),
    q(PASSES, 'range(10, 0, -2) က 10, 8, 6, 4, 2 ပေးတယ်: value ၅ ခု၊ ဒါကြောင့် pass ၅ ခါ။'),
    q(
      PRINT,
      'String ပေါ်က for loop က character တစ်လုံးချင်း ယူတယ်၊ print တိုင်း စာကြောင်းအသစ် စတယ်။'
    ),
    // Counters and totals
    q(after('total'), 'total က 1 + 2 + 3 + 4 = 10 ကို စုတယ်။ range(1, 5) က 5 မတိုင်ခင် ရပ်တယ်။'),
    q(after('total'), 'range(2, 9, 2) က 2, 4, 6, 8၊ 2 + 4 + 6 + 8 = 20။'),
    q(after('f'), 'f က 1 × 2 × 3 × 4 = 24 မြှောက်တယ်။ 1 ကနေ စတာ အရေးကြီးတယ်: 0 ကနေ စရင် 0 ရမယ်။'),
    q(after('count'), 'if ကို စာလုံး ၆ လုံးလုံးမှာ စစ်ပေမဲ့ "a" သုံးလုံးအတွက်ပဲ count ကြီးတယ်။'),
    // break and continue
    q(
      PRINT,
      'i က 4 ဖြစ်တော့ break က print မတိုင်ခင် loop အပြင်ကို တန်းခုန်တယ်။ ဒါကြောင့် 1, 2, 3 ပဲ print ထွက်တယ်။'
    ),
    q(
      PRINT,
      'continue က ဒီ pass ရဲ့ ကျန်တာကို ကျော်ပြီး အပေါ်ပြန်သွားတော့ စုံကိန်းတွေ ဘယ်တော့မှ print မထွက်ဘူး။'
    ),
    q(
      PRINT,
      'Pass တိုင်း i ကို print ထုတ်တယ်။ i က 2 ဖြစ်တဲ့ pass မှာပဲ if က "two!" ကိုပါ print ထုတ်တယ်။'
    )
  ]
}

export default loopRunner
