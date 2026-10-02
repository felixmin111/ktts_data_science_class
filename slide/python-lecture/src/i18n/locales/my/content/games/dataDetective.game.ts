import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const PROBLEMS = [
  'Value ပျောက်နေ (Missing value)',
  'Row ထပ်နေ (Duplicate row)',
  'စာသား မညီ (Inconsistent text)',
  'မဖြစ်နိုင်တဲ့ value (Impossible value)',
  'Data type မှား (Wrong data type)'
]

const q = (explanation: string): QuestionTranslation => ({
  prompt: 'ဒီ data မှာ ဘာမှားနေလဲ?',
  options: PROBLEMS,
  explanation
})

const dataDetective: GameTranslation = {
  title: 'Data စုံထောက်',
  tagline: 'Data မှာ ဘာမှားနေလဲ ရှာပါ — ပြင်နည်းကိုလည်း လေ့လာပါ။',
  bank: [
    q('Order တစ်ခုတည်း နှစ်ခါ ပါနေတယ်။ ပြင်နည်း: df.drop_duplicates()။'),
    q('ပစ္စည်းတစ်ခုတည်း၊ စာလုံးပေါင်း သုံးမျိုး။ ပြင်နည်း: .str.strip().str.title()။'),
    q('ကွတ်ကီး −2 ခု ရောင်းလို့ မရဘူး။ မူရင်းကို စစ်ပါ ဒါမှမဟုတ် row ကို ဖယ်ပါ။'),
    q('ဈေးနှုန်း ဗလာ ဖြစ်နေတယ်။ ပြင်နည်း: menu ကနေ .fillna(...) နဲ့ ဖြည့်ပါ။'),
    q('ရက်စွဲတွေကို စာသားအဖြစ် သိမ်းထားတယ်။ ပြင်နည်း: pd.to_datetime(df["date"])။'),
    q(
      'ဂဏန်း column ထဲမှာ စာသား ပါနေတယ်။ ပြင်နည်း: pd.to_numeric(df["age"], errors="coerce") ပြီးရင် ပြန်စစ်ပါ။'
    ),
    q('စာလုံးအကြီးအသေး နဲ့ space တွေ မတူဘူး။ ပြင်နည်း: .str.strip().str.title()။'),
    q('ဘယ်သူမှ ၁၇ မီတာ မရှည်ဘူး — 170 ကို ရိုက်မှားတာ ဖြစ်နိုင်တယ်။ မပြင်ခင် စုံစမ်းပါ။'),
    q('ဖုန်းနံပါတ် ဗလာ ဖြစ်နေတယ်။ ဆုံးဖြတ်ပါ: row ကို ထားမလား၊ “unknown” ဖြည့်မလား၊ ဖယ်မလား။'),
    q(
      'ဂဏန်းတွေကို ယူနစ်နဲ့ စာသားအဖြစ် သိမ်းထားတယ်။ ပြင်နည်း: .str.replace(" THB", "").astype(int)။'
    ),
    q('တူညီတဲ့ row တွေ — နှစ်ခါ မှတ်တမ်းတင်မိတာ ဖြစ်နိုင်တယ်။ ပြင်နည်း: drop_duplicates()။'),
    q('အမှတ်က 100 ထက် မကျော်နိုင်ဘူး။ အမှတ်ပေး မှတ်တမ်းကို စစ်ပါ။'),
    q(
      'အမျိုးအစား တစ်ခု၊ code သုံးမျိုး။ ပြင်နည်း: .replace ဒါမှမဟုတ် .map နဲ့ value တစ်ခုတည်းဖြစ်အောင် ပြောင်းပါ။'
    ),
    q('NaN ဆိုတာ value ပျောက်နေတာ။ မဖြည့်ခင် ဘာကြောင့် ပျောက်လဲ စစ်ပါ (Day 8)။'),
    q('အနာဂတ်က ရက်စွဲ။ ရိုက်မှားတာ ဖြစ်နိုင်တယ် — မူရင်းကို စစ်ပါ။')
  ]
}

export default dataDetective
