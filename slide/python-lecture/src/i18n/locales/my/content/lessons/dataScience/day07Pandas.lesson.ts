import type { LessonTranslation } from '@/models/translation.model'

const day7: LessonTranslation = {
  title: 'pandas: စွမ်းအားထူး spreadsheet များ',
  summary:
    'Series နှင့် DataFrame များ၊ CSV ဖွင့်ခြင်း၊ loc/iloc ဖြင့် ရွေးခြင်း၊ filter လုပ်ခြင်း၊ column အသစ်များ၊ စီခြင်း နှင့် ရက်စွဲများ။',
  topics: ['Series', 'DataFrame', 'read_csv', 'loc / iloc', 'Filter လုပ်ခြင်း', 'ရက်စွဲများ'],
  sections: [
    {
      id: 'series-dataframe',
      eyebrow: 'အဓိက object များ',
      title: 'Series နှင့် DataFrame',
      blocks: [
        {
          type: 'text',
          body: [
            '**Series** ဆိုတာ **label** (index) ပါတဲ့ NumPy array တစ်ခု။ **DataFrame** ဆိုတာ table တစ်ခု: index တူတူ မျှဝေတဲ့ Series တွေရဲ့ dict — column တစ်ခုလျှင် Series တစ်ခု။'
          ]
        },
        { type: 'code' },
        {
          type: 'analogy',
          title: 'စွမ်းအားထူး spreadsheet',
          body: 'DataFrame က Excel sheet နဲ့ တူတယ်၊ ဒါပေမဲ့ column တိုင်းက NumPy array (မြန်တယ်၊ type တစ်မျိုး)၊ row တိုင်းမှာ label ရှိတယ်၊ operation တိုင်းက နောက်လ ဖိုင်ပေါ်မှာ တစ်စက္ကန့်အတွင်း ပြန် run လို့ရတဲ့ code တစ်ကြောင်း ဖြစ်တယ်။'
        },
        {
          type: 'table',
          columns: ['အရင်က idea', 'pandas ပုံစံ'],
          rows: [
            ['ဂဏန်း list (Day 7)', 'Series'],
            ['NumPy array (Day 9)', 'Series ထဲက value များ'],
            ['dict တွေရဲ့ list (Day 7)', 'DataFrame'],
            ['dict key များ', 'column နာမည်များ'],
            ['list position များ', 'index (row label များ)']
          ]
        }
      ]
    },
    {
      id: 'load-inspect',
      eyebrow: 'ပထမဆုံး ကြည့်ခြင်း',
      title: 'CSV ကို ဖွင့်ပြီး စစ်ဆေးပါ',
      blocks: [
        {
          type: 'text',
          body: [
            'ကျွန်တော်တို့ dataset `cafe_sales.csv` မှာ ကော်ဖီဆိုင်ခွဲ သုံးခုက order 240 ခု ပါတယ် (2026 ဇန်နဝါရီ–မတ်)။ ဒီစာမျက်နှာထဲက Python မှာ အသင့်ရှိပြီးသား။ **Analyse မလုပ်ခင် အမြဲ စစ်ဆေးပါ။**'
          ]
        },
        { type: 'code' },
        { type: 'code', title: 'Summary statistics ကို တစ်ကြောင်းတည်းနဲ့' },
        {
          type: 'table',
          columns: ['Method', 'ဖြေပေးတာ'],
          rows: [
            ['df.shape', 'ဘယ်လောက် ကြီးလဲ?'],
            ['df.head() / df.tail()', 'ဘယ်လို ပုံစံလဲ?'],
            ['df.dtypes / df.info()', 'Type တွေ မှန်ရဲ့လား? ပျောက်နေတဲ့ value ရှိလား?'],
            ['df.describe()', 'Range၊ ပျမ်းမျှ၊ သံသယဖြစ်စရာ min/max?'],
            ['s.value_counts()', 'အမျိုးအစား တစ်ခုစီ ဘယ်နှခါ ပေါ်လဲ?']
          ]
        }
      ],
      notes:
        'unit_price mean နဲ့ quantity min က 1၊ max က 4 ဆိုတာ ထောက်ပြပါ — describe() က မဖြစ်နိုင်တဲ့ value တွေကို ရှာဖွေတဲ့ နည်းလမ်း (Day 11 မှာ အနုတ် quantity တွေကို တွေ့ရမယ်)။'
    },
    {
      id: 'selecting',
      eyebrow: 'ရွေးချယ်ခြင်း',
      title: 'Column, row, loc နှင့် iloc',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ရုပ်ရှင်ရုံ ထိုင်ခုံများ',
          body: 'loc က လက်မှတ်ပေါ် ရိုက်ထားတဲ့ နာမည်ကို သုံးတယ် (“row F, seat Window”); iloc က ဘယ်ဘက်အစွန်းကနေ ထိုင်ခုံ ရေတွက်တယ် (“6 တန်းမြောက်၊ ပထမ ထိုင်ခုံ”)။ Index က 0, 1, 2… ဖြစ်နေရင် တူတူပဲ ထင်ရတယ် — filter ဒါမှမဟုတ် sort လုပ်လိုက်ပြီး label တွေ position တွေနဲ့ မကိုက်တော့တဲ့ အချိန်အထိ။'
        },
        {
          type: 'quiz',
          question: 'df.loc[0:2] က row ဘယ်နှခု return ပြန်လဲ (default index)?',
          explanation: 'loc က label နဲ့ slice လုပ်ပြီး အဆုံး label ကိုပါ ထည့်တယ်: row 0, 1 နဲ့ 2။'
        }
      ]
    },
    {
      id: 'filtering',
      eyebrow: 'Filter လုပ်ခြင်း',
      title: 'Mask များဖြင့် row တွေကို filter လုပ်ခြင်း',
      blocks: [
        {
          type: 'text',
          body: [
            'Day 9 က NumPy stencil အတိအကျပဲ: နှိုင်းယှဉ်ချက်က True/False Series ကို ပေးပြီး `df[mask]` က True row တွေကို ထားတယ်။'
          ]
        },
        { type: 'code' },
        {
          type: 'callout',
          title: 'Condition များအတွက် စည်းမျဉ်း သုံးခု',
          body: '& (and)၊ | (or)၊ ~ (not) ကို သုံးပါ — စကားလုံးတွေကို ဘယ်တော့မှ မသုံးပါနဲ့။ နှိုင်းယှဉ်ချက်တစ်ခုစီကို ကွင်းခတ်ပါ။ == (ညီမျှခြင်း သင်္ကေတ နှစ်ခု) နဲ့ နှိုင်းယှဉ်ပါ။'
        }
      ]
    },
    {
      id: 'new-columns',
      eyebrow: 'ပြောင်းလဲခြင်း',
      title: 'Column အသစ်များ၊ စီခြင်း နှင့် အဆင့်သတ်မှတ်ခြင်း',
      blocks: [
        { type: 'code' },
        {
          type: 'callout',
          title: 'map နှင့် lambda',
          body: 'lambda q: ... က နာမည်မပါတဲ့ တစ်ကြောင်းတည်း function အသေးလေး။ .map() က column ရဲ့ value တိုင်းပေါ်မှာ သူ့ကို ခေါ်တယ်။ ဖြစ်နိုင်ရင် vectorized သင်္ချာကို ဦးစားပေးပါ; vectorized ပုံစံ မရှိတဲ့ logic အတွက် map/apply ကို သုံးပါ။'
        }
      ]
    },
    {
      id: 'theory-real-world',
      eyebrow: 'သီအိုရီ + လက်တွေ့ ကမ္ဘာ',
      title: 'Tidy data: analysis ကို လွယ်ကူစေတဲ့ ပုံသဏ္ဌာန်',
      blocks: [
        {
          type: 'text',
          body: [
            '**သီအိုရီ — tidy data** (စာရင်းအင်းပညာရှင် Hadley Wickham က လူသိများစေခဲ့တဲ့ အမည်): **variable တစ်ခုစီက column၊ observation တစ်ခုစီက row၊ value တစ်ခုစီက cell။** လူတွေအတွက် လုပ်ထားတဲ့ spreadsheet တွေက မကြာခဏ “wide” ဖြစ်နေတယ် — လတွေကို column တွေမှာ ဖြန့်ထားတယ်။ Tidy data က groupby၊ filter နဲ့ chart တွေ မျှော်လင့်တဲ့ ပုံစံ။'
          ]
        },
        { type: 'code', title: 'Wide (လူအတွက်) → tidy (analysis အတွက်) ကို melt ဖြင့်' },
        {
          type: 'case',
          domain: 'ရုံးတိုင်း',
          title: 'လစဉ် Excel အစီရင်ခံစာကို automate လုပ်ခြင်း',
          problem:
            'စာရင်းကိုင်တစ်ယောက်က လတိုင်း ဆိုင်ခွဲ spreadsheet တွေက ဂဏန်းတွေကို အစီရင်ခံစာ တစ်ခုထဲ ကူးဖို့ ရက်ပေါင်းများစွာ ကုန်တယ်။',
          data: 'ဆိုင်ခွဲ တစ်ခုစီ၊ လ တစ်လစီအတွက် Excel/CSV ဖိုင် တစ်ခု။',
          method:
            'pandas script တစ်ခု: ဖိုင်တိုင်းကို ဖတ်၊ tidy လုပ်၊ အုပ်စုဖွဲ့ပြီး အနှစ်ချုပ်၊ output ဖိုင် တစ်ခု ရေး။',
          outcome:
            'အစီရင်ခံစာက စက္ကန့်ပိုင်းပဲ ကြာတယ်၊ copy-paste အမှား မရှိဘူး၊ စာရင်းကိုင်က အချိန်ကို analysis မှာ သုံးနိုင်တယ်။'
        },
        {
          type: 'analogy',
          title: 'Mise en place',
          body: 'စားဖိုမှူးတွေက ချက်ပြုတ်ခြင်း မစခင် ပါဝင်ပစ္စည်း တိုင်းကို ပြင်ဆင်စီစဉ်ထားတယ် — ဒါက mise en place။ Table ကို tidy လုပ်တာက data ဗားရှင်းပါ: ပုံသဏ္ဌာန် ကျသွားတာနဲ့ ချက်နည်းတိုင်း (groupby, chart, model) မြန်ဆန်တယ်။'
        }
      ]
    },
    {
      id: 'dates',
      eyebrow: 'ရက်စွဲများ',
      title: 'ရက်စွဲများနှင့် အလုပ်လုပ်ခြင်း',
      blocks: [
        { type: 'code' },
        {
          type: 'analogy',
          title: 'ရက်စွဲနဲ့ တူတဲ့ စာသား',
          body: 'Day 1 က "20" နဲ့ 20 လိုပဲ: "2026-01-05" ကို မပြောင်းမချင်း character တွေပဲ။ pd.to_datetime ပြီးရင် pandas က ဇန်နဝါရီလ တနင်္လာနေ့ ဖြစ်တယ်လို့ သိပြီး စီ၊ နုတ် နဲ့ အုပ်စုဖွဲ့ နိုင်တယ်။'
        },
        {
          type: 'callout',
          title: 'အိမ်စာ',
          body: 'cafe_sales.csv ကို သုံးပြီး: (1) Campus မှာ QR နဲ့ ပေးချေခဲ့တဲ့ order ဘယ်နှခုလဲ? (2) Menu ပေါ်မှာ အဈေးအကြီးဆုံး ပစ္စည်းက ဘာလဲ? (3) revenue column ထည့်ပြီး စုစုပေါင်း revenue အလိုက် အကောင်းဆုံး ရက်ကို ရှာပါ (အကြံ: ရက်စွဲနဲ့ filter လုပ်တာ ရတယ်; groupby က နောက်သင်ခန်းစာမှာ လာမယ်)။'
        }
      ]
    }
  ]
}

export default day7
