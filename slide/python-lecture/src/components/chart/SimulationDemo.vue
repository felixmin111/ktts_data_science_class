<script setup lang="ts">
import { fixed } from '@/functions/stats.function'

const props = defineProps<{ experiment: 'coin' | 'die' | 'twoDice'; eventLabel: string }>()
const { t } = useI18n()

/** True probability of the event and one trial of the experiment. */
const spec = computed(() => {
  switch (props.experiment) {
    case 'coin':
      return { p: 1 / 2, exact: '1/2', trial: () => Math.random() < 0.5 }
    case 'die':
      return { p: 1 / 6, exact: '1/6', trial: () => Math.floor(Math.random() * 6) === 5 }
    default:
      return {
        p: 6 / 36,
        exact: '6/36',
        trial: () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2 === 7
      }
  }
})

const trials = ref(0)
const hits = ref(0)
/** Relative frequency after each recorded checkpoint, for the chart. */
const history = ref<{ n: number; rf: number }[]>([])

function run(times: number) {
  for (let i = 0; i < times; i++) {
    trials.value += 1
    if (spec.value.trial()) hits.value += 1
    // Record roughly 60 checkpoints however many trials there are.
    if (trials.value <= 20 || trials.value % Math.ceil(trials.value / 60) === 0) {
      history.value.push({ n: trials.value, rf: hits.value / trials.value })
    }
  }
  history.value = [...history.value]
}

function reset() {
  trials.value = 0
  hits.value = 0
  history.value = []
}

const relative = computed(() => (trials.value ? hits.value / trials.value : 0))
</script>

<template>
  <div class="sim">
    <div class="sim__controls">
      <a-button
        v-for="k in [1, 10, 100, 1000]"
        :key="k"
        :type="k === 100 ? 'primary' : 'default'"
        @click="run(k)"
      >
        <template #icon><IconMdiDiceMultiple /></template>
        {{ t('lesson.chart.runTimes', { n: k }) }}
      </a-button>
      <a-button v-if="trials" type="text" @click="reset">
        <template #icon><IconMdiRestart /></template>
      </a-button>
    </div>

    <table class="sim__table">
      <tbody>
        <tr>
          <th>{{ t('lesson.chart.trials') }}</th>
          <td>{{ trials }}</td>
        </tr>
        <tr>
          <th>{{ eventLabel }}</th>
          <td>{{ hits }}</td>
        </tr>
        <tr class="sim__rf">
          <th>{{ t('lesson.chart.relativeFrequency') }}</th>
          <td>{{ trials ? `${hits} / ${trials} = ${fixed(relative, 4)}` : '—' }}</td>
        </tr>
        <tr>
          <th>{{ t('lesson.chart.trueProbability') }}</th>
          <td>{{ spec.exact }} = {{ fixed(spec.p, 4) }}</td>
        </tr>
      </tbody>
    </table>

    <ChartView
      v-if="history.length > 1"
      :chart="{
        kind: 'line',
        x: history.map((h) => h.n),
        series: [
          {
            name: t('lesson.chart.relativeFrequency'),
            values: history.map((h) => Number(fixed(h.rf, 4)))
          }
        ],
        xLabel: t('lesson.chart.trials'),
        yLabel: t('lesson.chart.relativeFrequency'),
        yMin: 0,
        yMax: 1,
        reference: {
          value: spec.p,
          label: `${t('lesson.chart.trueProbability')} ${fixed(spec.p, 3)}`
        }
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.sim {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__table {
    width: 100%;
    max-width: 460px;
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
  }

  &__rf td {
    font-weight: 700;
    color: #c2410c;
  }
}
</style>
