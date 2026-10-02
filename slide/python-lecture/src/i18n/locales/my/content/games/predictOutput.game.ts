import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const q = (explanation: string, options?: string[]): QuestionTranslation => ({
  prompt: 'ဘာ print ထွက်မလဲ?',
  explanation,
  ...(options && { options })
})

const predictOutput: GameTranslation = {
  title: 'Output ကို ခန့်မှန်းပါ',
  tagline: 'Interpreter ကိုယ်တိုင် ဖြစ်ကြည့်ပါ: screen ပေါ်မှာ ဘာပေါ်မလဲ?',
  bank: [
    q('sep ကို value တွေကြားမှာပဲ ထည့်တယ်၊ အဆုံးမှာ မထည့်ဘူး။'),
    q(
      'end="..." က newline နေရာမှာ အစားထိုးတော့ နောက် print က စာကြောင်းတစ်ကြောင်းတည်းမှာ ဆက်ထွက်တယ်။'
    ),
    q('String နှစ်ခုကို + လုပ်ရင် ဆက်ပေးတယ်။'),
    q('/ က အမြဲ float ကို return ပြန်တယ်။'),
    q('17 // 5 က 3 (အုပ်စုအပြည့်)၊ 17 % 5 က 2 (အကြွင်း)။'),
    q('ညာဘက် (5 + 1) ကို အရင်တွက်တယ်၊ ပြီးမှ x ကို 6 ပေါ် ပြန်ကပ်တယ်။'),
    q('b က 10 object ကို ညွှန်နေတုန်းပဲ; a တစ်ခုတည်းပဲ ရွှေ့သွားတယ်။'),
    q('* က string ကို ထပ်ခါ ပွားတယ်။'),
    q('Slice က start ကို ထည့်ပြီး stop ကို ချန်တယ်: index 0, 1, 2။'),
    q('Binary floating point ကြောင့် 0.1 + 0.2 က 0.30000000000000004 ဖြစ်တယ်။'),
    q('f-string က {name} နေရာမှာ name ရဲ့ value နဲ့ အစားထိုးတယ်။'),
    q('int() က ဒဿမကို ဖြတ်ပစ်တယ် — round မလုပ်ဘူး။'),
    q('Space ကိုလည်း character တစ်လုံးအဖြစ် ရေတယ်: 5 + 1 + 5။'),
    q('ပထမစာကြောင်းက hi ကို print ထုတ်တယ်; print က None ကို return ပြန်ပြီး x ထဲ သိမ်းတယ်။')
  ]
}

export default predictOutput
