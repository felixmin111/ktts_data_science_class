import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const q = (explanation: string): QuestionTranslation => ({
  prompt: 'True လား False လား?',
  explanation
})

const trueOrFalse: GameTranslation = {
  title: 'True လား False လား?',
  tagline: 'နှိုင်းယှဉ်ချက်၊ and/or/not: condition တစ်ခုချင်းကို စက္ကန့်ပိုင်းအတွင်း ဆုံးဖြတ်ပါ။',
  bank: [
    // Comparisons
    q('>= ဆိုတာ ကြီး သို့မဟုတ် ညီ၊ 7 က 7 နဲ့ ညီတယ်။'),
    q('> က တင်းကျပ်စွာ ကြီးရမယ်။ 7 က သူ့ကိုယ်သူ မကြီးဘူး။'),
    q('int ကို 10.0 အဖြစ် အပေါ်တက် ပြောင်းတော့ value တွေ ညီတယ်။'),
    q('စာသားနဲ့ ဂဏန်း ဘယ်တော့မှ မညီဘူး။'),
    q('Value တွေ ညီတော့ “မညီ” က False။'),
    q('Float ရဲ့ round ဖြစ်မှုကြောင့် ဘယ်ဘက်က 0.30000000000000004 ဖြစ်တယ်။'),
    q('String တွေကို အဘိဓာန် အစီအစဉ်နဲ့ နှိုင်းယှဉ်တယ်: a က b ရှေ့မှာ။'),
    q('ပထမ စာလုံးတွေကိုပဲ character code နဲ့ နှိုင်းယှဉ်တယ်: "Z" က 90၊ "a" က 97၊ 90 < 97။'),
    q('Python က စာလုံးအကြီးအသေး ခွဲတယ်: c နဲ့ C က character မတူဘူး။'),
    q('len("hello") က 5၊ 5 > 5 က False။'),
    // Chained comparisons
    q('1 < 5 ရော 5 < 10 ရော True။'),
    q('3 < 5 and 5 < 4 လို့ ဆိုလိုတယ်။ ဒုတိယပိုင်းက False။'),
    q('15 က 13 နဲ့ 19 ကြား ရှိတော့ ဆယ်ကျော်သက် အရွယ်။'),
    // and / or / not
    q('and က နှစ်ဘက်လုံး True ဖြစ်ဖို့ လိုတယ်။'),
    q('or က အနည်းဆုံး တစ်ဘက် True ဖြစ်ဖို့ပဲ လိုတယ်။'),
    q('not က value ကို ပြောင်းပြန်လှန်တယ်: not True က False။'),
    q('Comparison က အရင် run တယ်: 5 > 3 က True၊ ပြီးမှ not True က False။'),
    q('5 > 3 က True ပေမဲ့ 2 > 4 က False၊ and က နှစ်ခုလုံး လိုတယ်။'),
    q('5 > 3 က True၊ or အတွက် အဲဒါ လုံလောက်တယ်။'),
    q('and က အရင်: False and False က False။ ပြီးမှ True or False က True။'),
    q('ကွင်း အရင်: True and False က False။ ပြီးမှ not False က True။'),
    q('not က အရင်: not True က False။ ပြီးမှ False or True က True။'),
    q('Short-circuit: x != 0 က False မို့ 10 / x ကို ဘယ်တော့မှ မ run ဘူး။'),
    q('လက်မှတ် ရှိရုံနဲ့ မလုံလောက်ဘူး: 16 >= 18 က False။'),
    q('မိုးရွာနေတယ် AND ထီး မရှိဘူး: စိုသွားမယ်။'),
    // Truthiness
    q('int တွေထဲမှာ 0 တစ်ခုတည်းပဲ falsy။'),
    q('0 မှလွဲပြီး ဂဏန်းတိုင်း truthy၊ အနုတ်ကိန်းတွေလည်း ပါတယ်။'),
    q('String အလွတ်က falsy။'),
    q('Space က character တစ်လုံးမို့ string က အလွတ် မဟုတ်ဘူး။'),
    q('အလွတ်မဟုတ်တဲ့ string မှန်သမျှ truthy၊ "False" ဆိုတဲ့ စာသားတောင်။'),
    q('0.0 က သုညမို့ falsy။')
  ]
}

export default trueOrFalse
