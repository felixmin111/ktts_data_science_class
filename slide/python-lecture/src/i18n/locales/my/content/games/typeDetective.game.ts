import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const q = (explanation: string): QuestionTranslation => ({
  prompt: 'ဒီ value က ဘယ် type လဲ?',
  explanation
})

const typeDetective: GameTranslation = {
  title: 'Type စုံထောက်',
  tagline: 'str, int, float လား bool လား? သဲလွန်စတွေကို မြန်မြန်ဖတ်ပါ။',
  bank: [
    q('Quote တွေကြောင့် စာသား ဖြစ်တယ်။'),
    q('ဂဏန်းသက်သက်၊ အစက်မပါ: ကိန်းပြည့်။'),
    q('အစက်ကြောင့် ဒဿမကိန်း ဖြစ်တယ်။'),
    q('Quote က နိုင်တယ် — ဒါက character 2 နဲ့ 0 ပါ။'),
    q('.0 ပါရုံနဲ့တောင် float ဖြစ်တယ်။'),
    q('အနုတ် ကိန်းပြည့်တွေလည်း int ပဲ။'),
    q('Quote ပါပြန်ပြီ — ဂဏန်းနဲ့တူတဲ့ စာသား။'),
    q('ဂဏန်း literal ထဲက underscore တွေကို လျစ်လျူရှုတယ်။'),
    q('True နဲ့ False (စာလုံးကြီးနဲ့စ၊ quote မပါ) က bool။'),
    q('Quote ပါရင် F-a-l-s-e ဆိုတဲ့ စာသားသက်သက်ပဲ။'),
    q('/ က အမြဲ float ကို return ပြန်တယ်: 5.0။'),
    q('Int နှစ်ခုကို // နဲ့ စားရင် int ရတယ်: 5။'),
    q('Scientific notation က float: 1000.0။'),
    q('String အလွတ်လည်း string ပဲ။'),
    q('Python int တွေမှာ အရွယ်အစား ကန့်သတ်ချက် မရှိဘူး။'),
    q('len() က အရေအတွက်ကို return ပြန်တယ် — ကိန်းပြည့်။'),
    q('str() က ဂဏန်းကို "25" စာသားအဖြစ် ပြောင်းတယ်။'),
    q('int() က "7" စာသားကို ဂဏန်း 7 အဖြစ် ပြောင်းတယ်။'),
    q('Float + float = float (0.30000000000000004)။'),
    q('နှိုင်းယှဉ်ချက်က True ဒါမှမဟုတ် False ကို ထုတ်ပေးတယ်။'),
    q('ဂဏန်းရိုက်ထည့်ရင်တောင် input() က အမြဲ str ကို return ပြန်တယ်။'),
    q('Int နဲ့ float ရောရင် float ရတယ်။')
  ]
}

export default typeDetective
