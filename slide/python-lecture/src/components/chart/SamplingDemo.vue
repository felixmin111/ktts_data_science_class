<script setup lang="ts">
import { round } from '@/functions/stats.function'

const props = defineProps<{
  populationSize: number
  withTrait: number
  sampleSize: number
  traitLabel: string
  otherLabel: string
}>()
const { t } = useI18n()

/** Small seeded generator so the population looks the same every visit. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const population = computed(() => {
  const rand = seeded(7)
  const members = Array.from({ length: props.populationSize }, (_, i) => i < props.withTrait)
  for (let i = members.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[members[i], members[j]] = [members[j]!, members[i]!]
  }
  return members
})

const truePercent = computed(() => round((props.withTrait / props.populationSize) * 100, 1))
const sample = ref<Set<number>>(new Set())
const draws = ref<number[]>([])

function draw() {
  const picked = new Set<number>()
  while (picked.size < props.sampleSize) {
    picked.add(Math.floor(Math.random() * props.populationSize))
  }
  sample.value = picked
  const hits = [...picked].filter((i) => population.value[i]).length
  draws.value = [...draws.value, round((hits / props.sampleSize) * 100, 1)]
}

function reset() {
  sample.value = new Set()
  draws.value = []
}

const lastHits = computed(() => [...sample.value].filter((i) => population.value[i]).length)
const columns = computed(() => Math.ceil(Math.sqrt(props.populationSize * 1.8)))
</script>

<template>
  <div class="sampling">
    <div class="sampling__top">
      <div>
        <div class="grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
          <span
            v-for="(hasTrait, i) in population"
            :key="i"
            class="person"
            :class="{
              'person--trait': hasTrait,
              'person--sampled': sample.has(i),
              'person--faded': sample.size > 0 && !sample.has(i)
            }"
          />
        </div>
        <p class="legend">
          <span class="key key--trait" /> {{ traitLabel }} <span class="key" /> {{ otherLabel }}
          <span class="key key--sampled" /> {{ t('lesson.chart.inSample') }}
        </p>
      </div>
      <table class="stats">
        <tbody>
          <tr>
            <th>{{ t('lesson.chart.population') }} (N)</th>
            <td>{{ populationSize }}</td>
          </tr>
          <tr>
            <th>{{ t('lesson.chart.truePercent') }}</th>
            <td>{{ withTrait }} / {{ populationSize }} = {{ truePercent }}%</td>
          </tr>
          <tr>
            <th>{{ t('lesson.chart.sample') }} (n)</th>
            <td>{{ sampleSize }}</td>
          </tr>
          <tr v-if="draws.length" class="stats__latest">
            <th>{{ t('lesson.chart.samplePercent') }}</th>
            <td>{{ lastHits }} / {{ sampleSize }} = {{ draws.at(-1) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="sampling__controls">
      <a-button type="primary" @click="draw">
        <template #icon><IconMdiDiceMultiple /></template>
        {{ draws.length ? t('lesson.chart.drawAgain') : t('lesson.chart.draw') }}
      </a-button>
      <a-button v-if="draws.length" type="text" @click="reset">
        <template #icon><IconMdiRestart /></template>
      </a-button>
    </div>

    <ChartView
      v-if="draws.length"
      :chart="{
        kind: 'line',
        x: draws.map((_, i) => i + 1),
        series: [{ name: t('lesson.chart.samplePercent'), values: draws }],
        xLabel: t('lesson.chart.drawNumber'),
        yLabel: t('lesson.chart.samplePercent'),
        yMin: 0,
        yMax: 100,
        pointsOnly: true,
        percent: true,
        reference: { value: truePercent, label: `${t('lesson.chart.truePercent')} ${truePercent}%` }
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.sampling {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 260px);
    gap: 16px;
    align-items: start;

    @include mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__controls {
    display: flex;
    gap: 8px;
  }
}

.grid {
  display: grid;
  gap: 3px;
  max-width: 460px;
}

.person {
  aspect-ratio: 1;
  max-width: 100%;
  border-radius: 50%;
  background: #c9d3e0;
  transition:
    opacity 150ms,
    transform 150ms;

  &--trait {
    background: #2a62a6;
  }

  &--faded {
    opacity: 0.25;
  }

  &--sampled {
    opacity: 1;
    transform: scale(1.25);
    box-shadow: 0 0 0 2px #c2410c;
  }
}

.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 8px;
  font-size: 13px;
  color: $color-body;
}

.key {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #c9d3e0;

  &--trait {
    background: #2a62a6;
  }

  &--sampled {
    background: transparent;
    box-shadow: 0 0 0 2px #c2410c;
  }
}

.stats {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 6px 8px;
    border-bottom: 1px solid $color-line;
    text-align: left;
  }

  th {
    font-weight: 600;
    color: $color-body;
  }

  td {
    font-variant-numeric: tabular-nums;
    color: $color-ink;
  }

  &__latest td {
    font-weight: 700;
    color: #c2410c;
  }
}
</style>
