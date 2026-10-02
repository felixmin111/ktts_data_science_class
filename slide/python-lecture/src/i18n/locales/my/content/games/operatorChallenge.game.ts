import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const q = (explanation: string, options?: string[]): QuestionTranslation => ({
  prompt: 'ဘာ print ထွက်မလဲ?',
  explanation,
  ...(options && { options })
})

const what = (explanation: string, options?: string[]): QuestionTranslation => ({
  prompt: 'ဘာဖြစ်မလဲ?',
  explanation,
  ...(options && { options })
})

const operatorChallenge: GameTranslation = {
  title: 'Operator စိန်ခေါ်မှု',
  tagline: 'Type ပြောင်းခြင်း၊ operator နဲ့ if/elif: interpreter ထက် အရင် တွေးပါ။',
  bank: [
    q('int + float: Python က float ဘက်ကို အပေါ်တက် ပြောင်းတော့ ရလဒ်က 5.0။'),
    q('bool က int အမျိုးအစားတစ်ခု: True ကို 1 လို့ ရေတော့ 1 + 1 = 2။'),
    what('input() က အမြဲ str ကို return ပြန်တယ်။ အရင်ပြောင်းပါ: int(age) + 1။'),
    q('int("7") က 7၊ int(2.9) က ဒဿမကို ဖြတ်ပစ်လို့ 2: 7 + 2 = 9။'),
    what('int() က ဒဿမပါတဲ့ string ကို မဖတ်နိုင်ဘူး။ 3 ရချင်ရင် int(float("3.5")) သုံးပါ။'),
    q('round(x, 2) က ဒဿမ နှစ်နေရာ ထားပြီး တတိယနေရာကို round လုပ်တယ်။'),
    q('အလွတ်မဟုတ်တဲ့ string မှန်သမျှ truthy — "False" ဆိုတဲ့ စာသားတောင် True ပဲ။'),
    q('0 နဲ့ "" က အလွတ်မို့ False။ " " ထဲမှာ space ပါတော့ True။'),
    q('* က + ထက် အရင်: 3 * 4 = 12၊ ပြီးမှ 2 + 12 = 14။'),
    q('** က အနုတ်လက္ခဏာထက် ပိုတင်းတယ်: -(2 ** 2) = -4။ 4 ရချင်ရင် (-2) ** 2 ရေးပါ။'),
    q('** က ညာကနေ ဘယ်ကို တွက်တယ်: 3 ** 2 = 9၊ ပြီးမှ 2 ** 9 = 512။'),
    q('- က ဘယ်ကနေ ညာကို တွက်တယ်: (10 - 4) - 3 = 3။'),
    q('125 စက္ကန့် = မိနစ်အပြည့် 2 (// 60) နဲ့ ကျန်တဲ့ စက္ကန့် 5 (% 60)။'),
    q('divmod က (စားလဒ်, အကြွင်း) ကို တစ်ပြိုင်နက် ပေးတယ်: 23 = 6 * 3 + 5။'),
    {
      prompt: 'n က စုံကိန်း ဟုတ်မဟုတ် ဘယ် expression က ပြောပြလဲ?',
      explanation: 'စုံကိန်းကို 2 နဲ့ စားရင် အကြွင်း မကျန်ဘူး။'
    },
    q('// က အောက်ဘက်ကို (အနုတ် အဆုံးမဲ့ဘက်) round လုပ်တယ်: -3.5 က -4 ဖြစ်တယ်။'),
    q('x += 5 က 15 ဖြစ်စေတယ်၊ ပြီးမှ x *= 2 က 30 ဖြစ်စေတယ်။'),
    what('Python မှာ ++ operator မရှိဘူး။ count += 1 လို့ ရေးပါ။', [
      'SyntaxError',
      'count က 1 ဖြစ်သွားမယ်',
      'count က 0 ပဲ ကျန်မယ်',
      'count က 2 ဖြစ်သွားမယ်'
    ]),
    q('math.sqrt က အမြဲ float ကို return ပြန်တယ်; abs(-3) က သုညကနေ အကွာအဝေး၊ 3။'),
    q('Python က comparison တွေကို ဆက်ချိတ်တယ်: 1 < 5 ရော 5 < 10 ရော True။'),
    what('= က value ထည့်တာ; == က နှိုင်းယှဉ်တာ။ if မှာ == လိုတယ်။', [
      'SyntaxError',
      'five',
      'ဘာမှ print မထွက်ဘူး',
      'True'
    ]),
    q('String တွေကို အဘိဓာန် အစီအစဉ်နဲ့ နှိုင်းယှဉ်တယ်၊ "a" က "b" ရှေ့မှာ။'),
    q('and က or ထက် အရင်: False and False က False၊ ပြီးမှ True or False က True။'),
    q('Comparison ကို အရင် run တယ်: 5 > 3 က True၊ not True က False။'),
    q('နှစ်ဘက်စလုံး True မို့ and က True ပေးတယ်: 15 က ဆယ်ကျော်သက်။'),
    q(
      'Python က ပထမဆုံး True ဖြစ်တဲ့ branch ကို ယူပြီး ကျန်တာကို ကျော်တယ်။ အတင်းကျပ်ဆုံး စစ်ချက်ကို အရင်ထားပါ။'
    ),
    q('30 > 35 က False၊ 30 > 25 က True မို့ elif branch run တယ်။'),
    q('String အလွတ်က falsy မို့ else branch run တယ်။')
  ]
}

export default operatorChallenge
