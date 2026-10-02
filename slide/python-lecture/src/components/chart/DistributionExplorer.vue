<script setup lang="ts">
import { binomialPmf, fixed, poissonPmf } from '@/functions/stats.function'

const props = defineProps<{
  distribution: 'binomial' | 'poisson'
  n?: number
  p?: number
  mu?: number
}>()
const { t } = useI18n()

const n = ref(props.n ?? 10)
const p = ref(props.p ?? 0.3)
const mu = ref(props.mu ?? 2)

const dist = computed(() => {
  if (props.distribution === 'binomial') {
    const xs = Array.from({ length: n.value + 1 }, (_, i) => i)
    const mean = n.value * p.value
    return {
      xs,
      ps: xs.map((x) => binomialPmf(x, n.value, p.value)),
      mean,
      sd: Math.sqrt(n.value * p.value * (1 - p.value)),
      formula: `μ = np = ${n.value} × ${fixed(p.value, 2)} = ${fixed(mean, 2)}`,
      sdFormula: `σ = √(np(1 − p)) = ${fixed(Math.sqrt(n.value * p.value * (1 - p.value)), 3)}`
    }
  }
  const top = Math.max(10, Math.ceil(mu.value + 4 * Math.sqrt(mu.value)))
  const xs = Array.from({ length: top + 1 }, (_, i) => i)
  return {
    xs,
    ps: xs.map((x) => poissonPmf(x, mu.value)),
    mean: mu.value,
    sd: Math.sqrt(mu.value),
    formula: `μ = ${fixed(mu.value, 1)}`,
    sdFormula: `σ = √μ = ${fixed(Math.sqrt(mu.value), 3)}`
  }
})
</script>

<template>
  <div class="explorer">
    <div class="explorer__sliders">
      <template v-if="distribution === 'binomial'">
        <label for="explorer-n">
          <span
            >n ({{ t('lesson.chart.trials') }}) = <strong>{{ n }}</strong></span
          >
          <input id="explorer-n" v-model.number="n" type="range" min="1" max="20" step="1" />
        </label>
        <label for="explorer-p">
          <span
            >p ({{ t('lesson.chart.successChance') }}) = <strong>{{ fixed(p, 2) }}</strong></span
          >
          <input
            id="explorer-p"
            v-model.number="p"
            type="range"
            min="0.05"
            max="0.95"
            step="0.05"
          />
        </label>
      </template>
      <label v-else for="explorer-mu">
        <span
          >μ ({{ t('lesson.chart.averageCount') }}) = <strong>{{ fixed(mu, 1) }}</strong></span
        >
        <input id="explorer-mu" v-model.number="mu" type="range" min="0.5" max="10" step="0.5" />
      </label>
    </div>
    <p class="explorer__formula">
      <code>{{ dist.formula }}</code> · <code>{{ dist.sdFormula }}</code>
    </p>
    <StatFigure
      :chart="{
        kind: 'pmf',
        x: dist.xs,
        p: dist.ps,
        mean: dist.mean,
        meanLabel: `μ = ${fixed(dist.mean, 2)}`,
        xLabel: 'x',
        yLabel: 'P(X = x)'
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.explorer {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__sliders {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px 20px;

    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      color: $color-body;
    }

    strong {
      color: $color-ink;
      font-variant-numeric: tabular-nums;
    }

    input {
      width: 100%;
      accent-color: #2a62a6;
    }
  }

  &__formula {
    font-size: 14px;
    color: $color-body;
  }
}
</style>
