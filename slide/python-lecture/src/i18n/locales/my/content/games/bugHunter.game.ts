import type { GameTranslation, QuestionTranslation } from '@/models/translation.model'

const q = (explanation: string): QuestionTranslation => ({
  prompt: 'ဒါက ဘယ် error ကို ဖြစ်စေမလဲ?',
  options: ['Error မရှိ', 'SyntaxError', 'NameError', 'TypeError', 'ValueError'],
  explanation
})

const bugHunter: GameTranslation = {
  title: 'Bug မုဆိုး',
  tagline: 'Python မတိုင်ခင် error ကို ရှာတွေ့အောင် လုပ်ပါ။',
  bank: [
    q('String က မပိတ်ဘူး — သဒ္ဒါ ပျက်နေတယ်။'),
    q('nmae ကို ဘယ်တုန်းကမှ assign မလုပ်ခဲ့ဘူး။ စာလုံးပေါင်းမှားတာ!'),
    q('str နဲ့ int ကို + လုပ်လို့ မရဘူး။'),
    q('Type မှန်တယ် (str)၊ value က မဖြစ်နိုင်ဘူး။'),
    q('Comma တွေသုံးရင် print() က type မတူတာတွေကို ဘေးကင်းကင်း ရောပေးတယ်။'),
    q('နာမည်တွေကို ဂဏန်းနဲ့ မစရဘူး။'),
    q('int() က ကိန်းပြည့် စာသားကို မျှော်လင့်တယ်။ float() ကို အရင်သုံးပါ။'),
    q('float() က "3.5" ကို အဆင်ပြေပြေ ပြောင်းပေးတယ်။'),
    q('String တွေက immutable: item assignment လုပ်လို့ မရဘူး။'),
    q('Python က စာလုံးအကြီးအသေး ခွဲတယ်: Print က print မဟုတ်ဘူး။'),
    q('class က reserved keyword ဖြစ်တယ်။'),
    q('String ကို int နဲ့ မြှောက်ရင် ထပ်ခါပွားတယ်: 555။'),
    q('String ကို string နဲ့ မြှောက်လို့ မရဘူး။'),
    q('input() က str ကို return ပြန်တယ်; int() နဲ့ ပတ်ပါ။'),
    q('f-string ကွင်းထဲမှာ ဘယ် expression မဆို ထည့်လို့ရတယ်။')
  ]
}

export default bugHunter
