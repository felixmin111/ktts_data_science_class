import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const PRINTED = 'ဘာ print ထွက်မလဲ?'

const q = (prompt: string, explanation: string, options?: string[]): QuestionTranslation => ({
  prompt,
  explanation,
  ...(options && { options })
})

const pandasPredict: GameTranslation = {
  title: 'pandas ခန့်မှန်းသူ',
  tagline: 'Collection များ၊ NumPy နှင့် pandas: ရလဒ်ကို ခန့်မှန်းပါ။',
  bank: [
    q(PRINTED, 'a နဲ့ b က list တစ်ခုတည်းရဲ့ နာမည်နှစ်ခု — append က နှစ်ခုလုံးကို ပြောင်းစေတယ်။'),
    q(PRINTED, 'Key မရှိရင် .get က default ကို return ပြန်တယ်။'),
    q('ရလဒ်က ဘာလဲ?', 'if က 50 ထက်ကြီးတဲ့ ဈေးနှုန်းတွေကိုပဲ ထားတယ်။'),
    q(PRINTED, 'Set က မထပ်တဲ့ value တွေကိုပဲ သိမ်းတယ်: a, b, c။'),
    q(PRINTED, 'Array တွေက element တစ်ခုချင်း တွက်တယ်; list ဆိုရင် ထပ်ပွားလိမ့်မယ်။'),
    q(PRINTED, 'Boolean mask က condition True ဖြစ်တဲ့ value တွေကို ထားတယ်။'),
    q(PRINTED, 'axis=0 (row တွေ) ပေါင်းချုံ့သွားပြီး column တစ်ခုစီအတွက် value တစ်ခု ကျန်တယ်။'),
    q(PRINTED, 'Float တစ်ခုက array တစ်ခုလုံးကို float64 အဖြစ် မြှင့်တင်တယ်။'),
    q(
      'df မှာ row 240 နဲ့ column 8 ရှိတယ်။ df.shape က ဘာလဲ?',
      'shape က (row, column) tuple ဖြစ်တယ်။'
    ),
    q(
      'ဒါက ဘယ် type ကို return ပြန်လဲ?',
      'ကွင်းတစ်ထပ်ထဲမှာ column နာမည် တစ်ခုဆိုရင် Series ကို return ပြန်တယ်။'
    ),
    q(
      'ဒါက ဘယ် type ကို return ပြန်လဲ?',
      'Column နာမည်တွေရဲ့ LIST ဆိုရင် DataFrame ကို return ပြန်တယ်။'
    ),
    q(
      'Default index နဲ့ဆိုရင် row ဘယ်နှခုလဲ?',
      'loc က label နဲ့ slice လုပ်ပြီး အဆုံးကိုပါ ထည့်တယ်: label 0–4။'
    ),
    q(
      'Default index နဲ့ဆိုရင် row ဘယ်နှခုလဲ?',
      'iloc က position နဲ့ slice လုပ်ပြီး Python list လိုပဲ အဆုံးကို ချန်တယ်။'
    ),
    q(
      'quantity ≥ 3 ဖြစ်တဲ့ Campus order တွေကို ဘယ်စာကြောင်းက ထားပေးလဲ?',
      'နှိုင်းယှဉ်ချက်တစ်ခုစီကို ကွင်းခတ်ပြီး & ကို သုံးပါ၊ ညီမျှခြင်းအတွက် == ကို သုံးပါ။'
    ),
    q(
      'ဒါက ဘာကို ထုတ်ပေးလဲ?',
      'Branch အလိုက် ခွဲတယ်၊ အုပ်စုတစ်ခုစီအတွင်း revenue ကို ပေါင်းတယ်၊ Series တစ်ခုအဖြစ် ပြန်ပေါင်းတယ်။',
      [
        'ဆိုင်ခွဲ တစ်ခုစီရဲ့ စုစုပေါင်း revenue',
        'ဆိုင်ခွဲ အားလုံးရဲ့ စုစုပေါင်း revenue',
        'ဆိုင်ခွဲ အရေအတွက်',
        'Order တစ်ခုလျှင် ပျမ်းမျှ revenue'
      ]
    ),
    q(
      'Int column တစ်ခုမှာ value တစ်ခု ပျောက်နေတယ်။ သူ့ dtype က ဖြစ်သွားမှာက…',
      'NaN က float ဖြစ်လို့ pandas က column ကို float64 အဖြစ် သိမ်းတယ်။'
    )
  ]
}

export default pandasPredict
