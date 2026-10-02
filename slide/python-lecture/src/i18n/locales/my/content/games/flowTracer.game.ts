import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const q = (explanation: string): QuestionTranslation => ({
  prompt: 'Run မယ့် block ကို နှိပ်ပါ။',
  explanation
})

const flowTracer: GameTranslation = {
  title: 'Flow ခြေရာခံ',
  tagline: 'Flowchart ကို ဖတ်၊ run မယ့် block ကို နှိပ်၊ ပြီးရင် လမ်းကြောင်း လင်းလာတာကို ကြည့်ပါ။',
  bank: [
    // Simple if / else
    q('20 >= 18 က True မို့ Python က True branch ကို ယူတယ်။'),
    q('12 > 25 က False မို့ Python က False branch ဖြစ်တဲ့ else block ကို ယူတယ်။'),
    // if with no else
    q('3 > 5 က False ပြီး else မရှိတော့ ဘာမှ မ run ဘူး။'),
    q('name က string အလွတ်မို့ name == "" က True။'),
    // if / elif / else ladders
    q('72 >= 80 က False မို့ ညာဘက် နောက်စစ်ချက်ဆီ ရွှေ့။ 72 >= 60 က True: "B"။'),
    q('စစ်ချက် နှစ်ခုလုံး False မို့ လမ်းကြောင်းက else block အထိ ရောက်သွားတယ်။'),
    q(
      '25 > 20 က ပထမဆုံး True ဖြစ်တဲ့ စစ်ချက်။ Python က အဲဒီမှာ ရပ်ပြီး temp > 10 ကို မစစ်တော့ဘူး။'
    ),
    q('0 > 0 ရော 0 < 0 ရော False မို့ else block run တယ်။'),
    q(
      'အစီအစဉ် ထောင်ချောက်: 95 >= 50 က True ဖြစ်ပြီးသားမို့ score >= 90 ဆီ လမ်းကြောင်း ဘယ်တော့မှ မရောက်ဘူး။'
    ),
    q('စစ်ချက်တိုင်း False ပြီး အဆုံးမှာ else မရှိတော့ ဘာမှ မ run ဘူး။'),
    // Conditions with and / or / not
    q('and က နှစ်ဘက်လုံး လိုတယ်။ has_ticket က False မို့ condition တစ်ခုလုံး False။'),
    q('day == "Sun" က True၊ or က True တစ်ဘက်ပဲ လိုတယ်။'),
    // Nested if / else
    q('အပြင်: 20 >= 18 က True မို့ အထဲဝင်။ အတွင်း: has_id က False: "show ID"။'),
    q('အပြင် စစ်ချက် False မို့ has_id က True ဖြစ်ပေမဲ့ အတွင်း if တစ်ခုလုံးကို ကျော်တယ်။'),
    q('မိုးရွာနေတော့ အထဲဝင်။ ထီး မရှိတော့ အတွင်း else: "taxi"။'),
    q('9 % 2 က 1 မို့ ညာဘက် အပြင် else ထဲ ဝင်။ အဲဒီမှာ 9 % 3 က 0: "odd, /3"။'),
    q('800 <= 500 က False၊ ပြီးမှ balance > 0 က True: "not enough"။'),
    // A ladder inside a nested if
    q('အပြင်: 5 > 3 က True၊ အထဲဝင်။ အတွင်း ladder: 10 < 5 က False၊ 10 < 20 က True: "B"။')
  ]
}

export default flowTracer
