<script setup lang="ts">
import { classIndex, classLabel } from '@/functions/stats.function'

const props = defineProps<{
  data: number[]
  bounds: number[]
  xLabel?: string
  yLabel?: string
}>()
const { t } = useI18n()

/** How many values have been sorted into classes so far. */
const placed = ref(0)
const playing = ref(false)
const reduceMotion = usePreferredReducedMotion()
let timer: ReturnType<typeof setInterval> | undefined

const classes = computed(() =>
  props.bounds.slice(0, -1).map((lower, i) => classLabel(lower, props.bounds[i + 1]!))
)
const indexes = computed(() => props.data.map((v) => classIndex(v, props.bounds)))
const counts = computed(() => {
  const c = classes.value.map(() => 0)
  indexes.value.slice(0, placed.value).forEach((i) => {
    if (i >= 0) c[i]! += 1
  })
  return c
})
const current = computed(() => (placed.value > 0 ? placed.value - 1 : -1))
const currentClass = computed(() => (current.value >= 0 ? indexes.value[current.value]! : -1))
const done = computed(() => placed.value >= props.data.length)

function stop() {
  clearInterval(timer)
  playing.value = false
}

function play() {
  if (done.value) placed.value = 0
  playing.value = true
  const delay = reduceMotion.value === 'reduce' ? 60 : props.data.length > 40 ? 160 : 260
  timer = setInterval(() => {
    placed.value += 1
    if (done.value) stop()
  }, delay)
}

function step() {
  stop()
  if (!done.value) placed.value += 1
}

function finish() {
  stop()
  placed.value = props.data.length
}

function reset() {
  stop()
  placed.value = 0
}

onBeforeUnmount(stop)

function tally(n: number) {
  const groups = Array.from({ length: Math.floor(n / 5) }, () => '|||||')
  if (n % 5) groups.push('|'.repeat(n % 5))
  return groups.join(' ')
}
</script>

<template>
  <div class="builder">
    <div class="builder__chips" :aria-label="t('lesson.chart.rawData')">
      <span
        v-for="(v, i) in data"
        :key="i"
        class="chip"
        :class="{ 'chip--placed': i < placed, 'chip--current': i === current }"
      >
        {{ v }}
      </span>
    </div>

    <div class="builder__body">
      <table class="tally">
        <thead>
          <tr>
            <th>{{ t('lesson.chart.class') }}</th>
            <th>{{ t('lesson.chart.tally') }}</th>
            <th>{{ t('lesson.chart.frequency') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(label, i) in classes" :key="label" :class="{ hit: i === currentClass }">
            <td>{{ label }}</td>
            <td class="tally__marks">{{ tally(counts[i]!) }}</td>
            <td class="tally__count">{{ counts[i] }}</td>
          </tr>
          <tr class="tally__total">
            <td>{{ t('lesson.chart.total') }}</td>
            <td />
            <td>{{ placed }}</td>
          </tr>
        </tbody>
      </table>
      <ChartView
        class="builder__chart"
        :chart="{ kind: 'histogram', bounds, counts, xLabel, yLabel }"
      />
    </div>

    <div class="builder__controls">
      <a-button v-if="!playing" type="primary" @click="play">
        <template #icon><IconMdiPlay /></template>
        {{ done ? t('lesson.chart.replay') : t('lesson.chart.build') }}
      </a-button>
      <a-button v-else @click="stop">
        <template #icon><IconMdiPause /></template>
        {{ t('lesson.loop.pause') }}
      </a-button>
      <a-button :disabled="done" @click="step">
        <template #icon><IconMdiDebugStepOver /></template>
        {{ t('lesson.chart.oneValue') }}
      </a-button>
      <a-button type="text" :disabled="done" @click="finish">{{
        t('lesson.chart.finish')
      }}</a-button>
      <a-button v-if="placed > 0" type="text" @click="reset">
        <template #icon><IconMdiRestart /></template>
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.builder {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  &__body {
    display: grid;
    grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
    gap: 16px;
    align-items: center;

    @include mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.chip {
  min-width: 34px;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid $color-line;
  background: $color-card;
  font-family: $font-mono;
  font-size: 13px;
  text-align: center;
  color: $color-ink;
  transition:
    background 150ms,
    opacity 150ms;

  &--placed {
    opacity: 0.35;
  }

  &--current {
    opacity: 1;
    background: $color-amber;
    border-color: $color-amber;
    font-weight: 700;
  }
}

.tally {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 5px 8px;
    border-bottom: 1px solid $color-line;
    text-align: left;
  }

  th {
    font-size: 12px;
    color: $color-muted;
  }

  td:first-child {
    font-family: $font-mono;
    white-space: nowrap;
  }

  tr.hit td {
    background: $color-tint;
  }

  &__marks {
    font-family: $font-mono;
    letter-spacing: 1px;
    color: $color-blue;
    overflow-wrap: anywhere;
  }

  &__count {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__total td {
    font-weight: 700;
  }
}
</style>
