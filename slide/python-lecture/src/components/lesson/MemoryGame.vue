<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const word = (en: string, my: string) => (locale.value === 'my' ? my : en)
const mode = ref('list')
const step = ref(0)
const guess = ref('')
const mutable = computed(() => mode.value === 'list')
const original = computed(() => (mutable.value ? '[1, 2]' : '"Felix"'))
const changed = computed(() => (mutable.value ? '[1, 2, 3]' : '"Neo"'))
const correct = computed(() => (mutable.value ? changed.value : original.value))
const lines = computed(() => [
  `a = ${original.value}`,
  'b = a',
  mutable.value ? 'a.append(3)' : 'a = "Neo"'
])
const targetA = computed(() => (!mutable.value && step.value === 3 ? 'O2' : 'O1'))
const explanation = computed(
  () =>
    [
      word('Ready! Run the first line.', 'အဆင်သင့်! ပထမလိုင်းကို run ပါ။'),
      word(
        'Evaluate the right side, then bind a to O1.',
        'ညာဘက်ကို တွက်ပြီး a ကို O1 ဆီ ချိတ်တယ်။'
      ),
      word(
        'b refers to O1 too. This assignment does not copy or allocate an object.',
        'b လည်း O1 ကို ညွှန်တယ်။ ဒီ assignment က object ကို copy မလုပ်ဘူး၊ အသစ်မဖန်တီးဘူး။'
      ),
      mutable.value
        ? word(
            'append changes O1 itself. Both names see the changed list.',
            'append က O1 ကိုယ်တိုင်ကို ပြောင်းတယ်။ နှစ်ခုလုံးက ပြောင်းထားတဲ့ list ကို မြင်ရတယ်။'
          )
        : word(
            'a moves to O2. The original "Felix" object stays unchanged, and b still refers to O1.',
            'a က O2 ဆီ ရွှေ့တယ်။ မူလ "Felix" object မပြောင်းဘူး။ b က O1 ကို ညွှန်နေဆဲပါ။'
          )
    ][step.value]
)
function back() {
  step.value--
  guess.value = ''
}
function reset(next = mode.value) {
  mode.value = next
  step.value = 0
  guess.value = ''
}
</script>

<template>
  <section class="memory-game">
    <h2>
      {{
        word(
          'Memory mission: follow the name tags',
          'Memory လေ့ကျင့်ခန်း: နာမည်ကပ်ပြားတွေကို လိုက်ကြည့်ပါ'
        )
      }}
    </h2>
    <p>
      {{
        word(
          'Run two lines, predict b, then reveal the final operation.',
          'လိုင်းနှစ်ခု run ပြီး b ကို ခန့်မှန်းပါ။ နောက်ဆုံး operation ကို ကြည့်ပါ။'
        )
      }}
    </p>
    <div class="controls">
      <button :aria-pressed="mutable" @click="reset('list')">Mutable list</button>
      <button :aria-pressed="!mutable" @click="reset('string')">Immutable string</button>
    </div>
    <ol class="code-lines">
      <li
        v-for="(line, index) in lines"
        :key="line"
        :class="{ executed: index < step, current: index === step }"
      >
        <code>{{ line }}</code
        ><span v-if="index < step"> ✓</span>
      </li>
    </ol>
    <div class="memory-map">
      <div>
        <h3>{{ word('Namespace · names', 'Namespace · နာမည်များ') }}</h3>
        <p v-if="!step">{{ word('No bindings yet', 'မချိတ်ရသေးပါ') }}</p>
        <div v-if="step >= 1" class="binding">
          <code>a → {{ targetA }}</code>
        </div>
        <div v-if="step >= 2" class="binding"><code>b → O1</code></div>
      </div>
      <div>
        <h3>{{ word('Memory · objects', 'Memory · object များ') }}</h3>
        <p v-if="!step">
          {{ word('No objects in this example yet', 'ဒီဥပမာထဲမှာ object မရှိသေးပါ') }}
        </p>
        <div v-if="step >= 1" class="object">
          <strong>O1 · {{ mutable ? 'list · mutable' : 'str · immutable' }}</strong>
          <code>{{ mutable && step === 3 ? changed : original }}</code>
          <small
            >{{ word('Referenced by', 'ညွှန်နေသော နာမည်') }}
            {{ step === 1 ? 'a' : targetA === 'O2' ? 'b' : 'a, b' }}</small
          >
        </div>
        <div v-if="targetA === 'O2' && step === 3" class="object">
          <strong>O2 · str · immutable</strong><code>{{ changed }}</code
          ><small>{{ word('Referenced by a', 'a က ညွှန်နေတယ်') }}</small>
        </div>
      </div>
    </div>
    <div v-if="step === 2" class="prediction">
      <strong>{{
        word('Predict: what will b be after line 3?', 'ခန့်မှန်းပါ: လိုင်း 3 ပြီးရင် b က ဘာလဲ?')
      }}</strong>
      <div class="controls">
        <button
          v-for="value in [original, changed]"
          :key="value"
          :aria-pressed="guess === value"
          @click="guess = value"
        >
          <code>{{ value }}</code>
        </button>
      </div>
    </div>
    <div aria-live="polite">
      <p v-if="step === 3">
        <strong>{{
          guess === correct
            ? word('Correct!', 'မှန်တယ်!')
            : word('Follow b’s reference:', 'b ညွှန်တဲ့ object ကို ကြည့်ပါ:')
        }}</strong>
        <code>b = {{ correct }}</code>
      </p>
      <p>{{ explanation }}</p>
    </div>
    <div class="controls">
      <button :disabled="step === 3 || (step === 2 && !guess)" @click="step++">
        {{
          step === 2
            ? word('Reveal & run line 3', 'အဖြေကြည့်ပြီး လိုင်း 3 run ပါ')
            : word('Run next line', 'နောက်လိုင်း run ပါ')
        }}
      </button>
      <button
        :disabled="step === 0"
        @click="back"
      >
        {{ word('Back', 'နောက်ပြန်') }}
      </button>
      <button @click="reset()">{{ word('Restart', 'ပြန်စပါ') }}</button>
    </div>
    <small>{{
      word(
        'Conceptual diagram: O1/O2 are illustrative identities, not real memory addresses. Python may create or reuse immutable objects. List elements also refer to objects; those references are omitted here.',
        'အယူအဆပြ diagram ပါ။ O1/O2 က တကယ့် memory address မဟုတ်ဘူး။ Immutable object ကို Python က ဖန်တီးနိုင်သလို ရှိပြီးသားကိုလည်း သုံးနိုင်တယ်။ List element တွေကလည်း object တွေကို ညွှန်တယ်၊ ဒီမှာ အဲဒီ reference တွေ မပြထားဘူး။'
      )
    }}</small>
  </section>
</template>

<style scoped lang="scss">
.memory-game {
  padding: 24px;
  border: 1px solid $color-line;
  border-radius: $radius;
  background: rgba($color-blue, 0.04);
  display: grid;
  gap: 16px;
}
h2 {
  font-size: 23px;
}
h3 {
  font-size: 15px;
  margin-bottom: 12px;
}
p {
  margin: 0;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
button {
  padding: 9px 14px;
  border: 1px solid $color-blue;
  border-radius: 8px;
  background: $color-paper;
  color: $color-ink;
  cursor: pointer;
}
button[aria-pressed='true'] {
  background: $color-blue;
  color: white;
}
button:disabled {
  opacity: 0.45;
  cursor: default;
}
button:focus-visible {
  outline: 3px solid $color-amber;
  outline-offset: 3px;
}
.code-lines {
  padding: 12px 12px 12px 36px;
  background: $color-paper;
  border-radius: 8px;
}
.code-lines li {
  padding: 6px;
}
.current {
  border-left: 3px solid $color-amber;
  background: rgba($color-amber, 0.12);
}
.executed {
  color: $color-green;
}
.memory-map {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.binding {
  padding: 10px;
  margin-bottom: 8px;
  background: $color-paper;
  border-radius: 8px;
  font-size: 20px;
}
.object {
  border: 2px solid $color-blue;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 8px;
  display: grid;
  gap: 6px;
  background: $color-paper;
}
.object code {
  font-size: 22px;
}
small {
  font-size: 13px;
}
.prediction {
  display: grid;
  gap: 10px;
}
@media (max-width: 600px) {
  .memory-game {
    padding: 16px;
  }
  .memory-map {
    grid-template-columns: 1fr;
  }
}
</style>
