<script setup lang="ts">
import { stemLeaf, type StemRow } from '@/functions/stats.function'

const props = defineProps<{
  data: number[]
  leafUnit: number
  split?: boolean
  compare?: number[]
  labels?: string[]
}>()
const { t } = useI18n()

const right = computed(() => stemLeaf(props.data, props.leafUnit, props.split))
const left = computed(() =>
  props.compare ? stemLeaf(props.compare, props.leafUnit, props.split) : null
)

/** Rows from both sides, lined up by stem (and half when split). */
const rows = computed(() => {
  const key = (r: StemRow) => r.stem * 2 + (r.half ?? 0)
  const all = [...right.value, ...(left.value ?? [])].map(key)
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const out: { stem: number; right: number[]; left: number[] }[] = []
  for (let k = lo; k <= hi; k += props.split ? 1 : 2) {
    const find = (rs: StemRow[] | null) => rs?.find((r) => key(r) === k)?.leaves ?? []
    out.push({ stem: Math.floor(k / 2), right: find(right.value), left: find(left.value) })
  }
  return out
})
</script>

<template>
  <div class="stem-leaf">
    <p v-if="labels?.length" class="stem-leaf__labels">
      <span v-if="compare">{{ labels[1] }}</span>
      <span>{{ labels[0] }}</span>
    </p>
    <table>
      <tbody>
        <tr v-for="(r, i) in rows" :key="i">
          <td v-if="compare" class="leaves leaves--left">{{ [...r.left].reverse().join('') }}</td>
          <td class="stem">{{ r.stem }}</td>
          <td class="leaves">{{ r.right.join('') }}</td>
        </tr>
      </tbody>
    </table>
    <p class="stem-leaf__unit">{{ t('lesson.chart.leafUnit', { unit: leafUnit }) }}</p>
  </div>
</template>

<style scoped lang="scss">
.stem-leaf {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  table {
    border-collapse: collapse;
    font-family: $font-mono;
    font-size: 17px;
  }

  td {
    padding: 2px 10px;
  }

  &__labels {
    display: flex;
    gap: 120px;
    font-weight: 600;
    color: $color-ink;
  }

  &__unit {
    font-size: 13px;
    color: $color-muted;
  }
}

.stem {
  border-left: 2px solid $color-ink;
  border-right: 2px solid $color-ink;
  font-weight: 700;
  color: $color-ink;
  text-align: center;
}

.leaves {
  letter-spacing: 4px;
  color: #2a62a6;

  &--left {
    text-align: right;
    color: #c2410c;
  }
}
</style>
