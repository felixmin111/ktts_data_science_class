<script setup lang="ts">
import { renderInline } from '@/functions/highlight.function'
import type { ChartBlock } from '@/models/lesson.model'

defineProps<{ block: ChartBlock }>()
</script>

<template>
  <figure class="chart-block">
    <figcaption v-if="block.title" class="chart-block__title">
      <IconMdiChartBox /> {{ block.title }}
    </figcaption>
    <SamplingDemo v-if="block.chart.kind === 'sampling'" v-bind="block.chart" />
    <StemLeafView v-else-if="block.chart.kind === 'stemLeaf'" v-bind="block.chart" />
    <HistogramBuilder
      v-else-if="block.chart.kind === 'histogram' && block.chart.animate && block.chart.data"
      :data="block.chart.data"
      :bounds="block.chart.bounds"
      :x-label="block.chart.xLabel"
      :y-label="block.chart.yLabel"
    />
    <SimulationDemo v-else-if="block.chart.kind === 'simulation'" v-bind="block.chart" />
    <DistributionExplorer v-else-if="block.chart.kind === 'explorer'" v-bind="block.chart" />
    <MeanMedianDemo v-else-if="block.chart.kind === 'meanMedian'" v-bind="block.chart" />
    <ChartView v-else :chart="block.chart" />
    <!-- eslint-disable vue/no-v-html -- renderInline escapes all text -->
    <p v-if="block.caption" class="chart-block__caption" v-html="renderInline(block.caption)" />
    <!-- eslint-enable vue/no-v-html -->
  </figure>
</template>

<style scoped lang="scss">
.chart-block {
  @include card;

  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 18px 20px;

  @include mobile {
    padding: 14px 12px;
  }

  &__title {
    @include eyebrow;

    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__caption {
    font-size: 15px;
    color: $color-body;

    :deep(strong) {
      color: $color-ink;
    }
  }
}
</style>
