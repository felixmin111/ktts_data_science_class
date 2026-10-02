import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const NOTHING = 'ဘာမှ print မထွက်ဘူး'

const q = (explanation: string, options?: string[]): QuestionTranslation => ({
  prompt: 'လမ်းကြောင်းကို လိုက်ပါ: ဘာ print ထွက်မလဲ?',
  explanation,
  ...(options && { options })
})

const pathFinder: GameTranslation = {
  title: 'လမ်းကြောင်း ရှာဖွေသူ',
  tagline: 'if၊ elif၊ else နဲ့ nested if: နောက်ဆုံး print ဆီ ရောက်တဲ့ လမ်းကို ခြေရာခံပါ။',
  bank: [
    q('72 >= 80 က False၊ 72 >= 60 က True မို့ elif run ပြီး else ကို ကျော်တယ်။'),
    q('Condition နှစ်ခုလုံး False မို့ else က ဖမ်းယူတယ်။', ['C', 'B', 'A', NOTHING]),
    q('25 > 20 က ပထမဆုံး True ဖြစ်တဲ့ စစ်ချက်။ 25 > 10 ကလည်း True ပေမဲ့ Python က အဲဒီမှာ ရပ်တယ်။'),
    q('0 > 0 ရော 0 < 0 ရော False မို့ else run တယ်။', ['zero', 'positive', 'negative', NOTHING]),
    q(
      '95 >= 50 က True ဖြစ်ပြီးသားမို့ elif ကို ဘယ်တော့မှ မစစ်ဘူး။ အတင်းကျပ်ဆုံး condition ကို အရင်ထားပါ။',
      ['pass', 'excellent', 'pass\nexcellent', NOTHING]
    ),
    q(
      'age >= 18 ကို အရင်စစ်ပြီး True ဖြစ်တော့ ဒီအစီအစဉ်နဲ့ "senior" ကို ဘယ်တော့မှ မရောက်နိုင်ဘူး။'
    ),
    q('စစ်ချက် နှစ်ခုလုံး False ပြီး else မရှိတော့ ဘယ် branch မှ မ run ဘူး။', [
      NOTHING,
      'big',
      'medium',
      'Error'
    ]),
    q('ဒါတွေက chain တစ်ခု မဟုတ်ဘဲ သီးခြား if နှစ်ခု။ တစ်ခုချင်းစီကို သီးသန့် စစ်တယ်။', [
      'A\nB',
      'A',
      'B',
      NOTHING
    ]),
    q('elif နဲ့ဆိုရင် chain တစ်ခုတည်း: "A" run ပြီးတာနဲ့ elif ကို ကျော်တယ်။', [
      'A',
      'A\nB',
      'B',
      NOTHING
    ]),
    q('ပထမ if က False (else လည်း မရှိ)။ ဒုတိယ if/else က သီးခြား chain: 7 > 5 မို့ "B"။'),
    q('print("done") က indent မလုပ်ထားလို့ if ရဲ့ အပြင်မှာ ရှိပြီး အမြဲ run တယ်။', [
      'done',
      'big\ndone',
      NOTHING,
      'big'
    ]),
    q('print နှစ်ခုလုံး indent လုပ်ထားလို့ if ထဲမှာ ပါတယ်။ စစ်ချက် False မို့ တစ်ခုမှ မ run ဘူး။', [
      NOTHING,
      'done',
      'big\ndone',
      'big'
    ]),
    q('and က နှစ်ဘက်လုံး လိုတယ်: has_ticket က False မို့ စစ်ချက် တစ်ခုလုံး False။', [
      'stop',
      'enter',
      'enter\nstop',
      NOTHING
    ]),
    q('ဒုတိယ နှိုင်းယှဉ်ချက်က True၊ or က တစ်ခုပဲ လိုတယ်။', ['weekend', 'work', NOTHING, 'Error']),
    q('String အလွတ်က falsy မို့ not name က True။'),
    q('အပြင် စစ်ချက်: 20 >= 18 က True မို့ အထဲဝင်။ အတွင်း စစ်ချက်: has_id က True မို့ "enter"။'),
    q('အပြင် စစ်ချက် True မို့ အထဲဝင်။ အတွင်း စစ်ချက် False မို့ အတွင်း else run တယ်။', [
      'show ID',
      'enter',
      'too young',
      NOTHING
    ]),
    q('အပြင် စစ်ချက် False မို့ အတွင်း block တစ်ခုလုံးကို ကျော်ပြီး အပြင် else run တယ်။', [
      'too young',
      'enter',
      'show ID',
      NOTHING
    ]),
    q(
      'အပြင် if ထဲဝင်: A ထုတ်။ အတွင်း 8 > 10 က False၊ B ကို ကျော်။ C က အပြင်အဆင့်ကို ပြန်ရောက်လို့ run တယ်။ D က အားလုံးရဲ့ အပြင်မှာ။'
    ),
    q(
      'အပြင် စစ်ချက် False မို့ A၊ အတွင်း if နဲ့ C အားလုံး ကျော်တယ်။ D (indent မလုပ်ထား) တစ်ခုပဲ run တယ်။',
      ['D', 'C\nD', 'A\nC\nD', NOTHING]
    ),
    q('မိုးရွာနေတော့ အထဲဝင်။ ထီး မရှိတော့ အတွင်း else: "taxi"။'),
    q('12 % 2 က 0 မို့ အထဲဝင်။ 12 % 3 ကလည်း 0 မို့ အတွင်း if run တယ်။'),
    q('800 <= 500 က False မို့ အပြင် else ထဲ ဝင်။ အထဲမှာ 500 > 0 က True။', [
      'not enough money',
      'paid',
      'empty wallet',
      NOTHING
    ]),
    q('နောက်ကျတော့ score က 75 ဖြစ်သွားတယ်။ ပြီးမှ 75 >= 80 က False၊ 75 >= 60 က True: "B"။'),
    q('အပြင်: 5 > 3 က True။ အတွင်း chain: 10 < 5 က False၊ 10 < 20 က True: "B"။')
  ]
}

export default pathFinder
