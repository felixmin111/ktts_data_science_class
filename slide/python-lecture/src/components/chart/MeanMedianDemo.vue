<script setup lang="ts">
import { fixed, mean, median, niceTicks } from '@/functions/stats.function'

const props = defineProps<{ data: number[]; min: number; max: number; xLabel?: string }>()
const { t } = useI18n()

/** The last value is the one the learner moves. */
const moving = ref(props.data.at(-1)!)
const values = computed(() => [...props.data.slice(0, -1), moving.value])
const m = computed(() => mean(values.value))
const md = computed(() => median(values.value))

const W = 600
const ticks = computed(() => niceTicks(props.min, props.max, 8))
const x = (v: number) => {
  const lo = ticks.value[0]!
  const hi = ticks.value.at(-1)!
  return 30 + ((v - lo) / (hi - lo)) * (W - 60)
}
const dots = computed(() => {
  const stacks = new Map<number, number>()
  return values.value.map((v, i) => {
    const level = stacks.get(v) ?? 0
    stacks.set(v, level + 1)
    return { cx: x(v), cy: 150 - level * 13, moving: i === values.value.length - 1 }
  })
})
</script>

<template>
  <div class="mm">
    <label class="mm__slider" for="mean-median-slider">
      <span
        >{{ t('lesson.chart.moveValue') }}: <strong>{{ moving }}</strong></span
      >
      <input
        id="mean-median-slider"
        v-model.number="moving"
        type="range"
        :min="min"
        :max="max"
        step="1"
      />
    </label>
    <svg :viewBox="`0 0 ${W} 210`" role="img" aria-label="mean and median">
      <line class="axis" x1="30" :x2="W - 30" y1="160" y2="160" />
      <text v-for="tk in ticks" :key="tk" class="tick" :x="x(tk)" y="178" text-anchor="middle">
        {{ tk }}
      </text>
      <circle
        v-for="(d, i) in dots"
        :key="i"
        :cx="d.cx"
        :cy="d.cy"
        r="6"
        :class="d.moving ? 'dot dot--moving' : 'dot'"
      />
      <line class="median" :x1="x(md)" :x2="x(md)" y1="40" y2="160" />
      <text class="median-text" :x="x(md)" y="30" text-anchor="middle">
        {{ t('lesson.chart.median') }} {{ fixed(md, 1) }}
      </text>
      <line class="mean" :x1="x(m)" :x2="x(m)" y1="56" y2="160" />
      <text class="mean-text" :x="x(m)" y="50" text-anchor="middle">
        {{ t('lesson.chart.mean') }} {{ fixed(m, 1) }}
      </text>
      <text v-if="xLabel" class="label" :x="W / 2" y="202" text-anchor="middle">{{ xLabel }}</text>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.mm {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__slider {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 420px;
    font-size: 14px;
    color: $color-body;

    strong {
      color: #c2410c;
    }

    input {
      accent-color: #c2410c;
    }
  }

  svg {
    display: block;
    width: 100%;
    max-width: 640px;
    height: auto;
    margin: 0 auto;
    font-family: $font-sans;
  }
}

.axis {
  stroke: $color-muted;
  stroke-width: 1.5;
}

.tick {
  font-size: 11.5px;
  fill: $color-muted;
}

.label {
  font-size: 13px;
  font-weight: 600;
  fill: $color-body;
}

.dot {
  fill: #2a62a6;

  &--moving {
    fill: #c2410c;
  }
}

.median {
  stroke: #2e7550;
  stroke-width: 3;
}

.median-text {
  font-size: 12.5px;
  font-weight: 700;
  fill: #2e7550;
}

.mean {
  stroke: #c2410c;
  stroke-width: 3;
  stroke-dasharray: 6 4;
}

.mean-text {
  font-size: 12.5px;
  font-weight: 700;
  fill: #c2410c;
}
</style>
