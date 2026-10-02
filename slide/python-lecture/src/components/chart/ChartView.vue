<script setup lang="ts">
import { classCounts, cumulative, linearFit, niceTicks, round } from '@/functions/stats.function'
import type { ChartSpec } from '@/models/chart.model'

const props = withDefaults(defineProps<{ chart: ChartSpec; small?: boolean }>(), { small: false })

/** Statistics figures drawn by StatFigure. */
const STAT_KINDS: ChartSpec['kind'][] = ['box', 'bell', 'venn', 'tree', 'grid', 'pmf']
const COLORS = ['#2A62A6', '#C2410C', '#2E7550', '#7B5EA7', '#B26B00', '#1F7A8C']
const HIGHLIGHT = '#C2410C'

const W = computed(() => (props.small ? 320 : 600))
const H = computed(() => (props.small ? 200 : 320))
const M = computed(() => ({ top: 24, right: 20, bottom: 52, left: 54 }))
const plotW = computed(() => W.value - M.value.left - M.value.right)
const plotH = computed(() => H.value - M.value.top - M.value.bottom)

function fmt(v: number, percent = false) {
  const text = Number.isInteger(v) ? String(v) : String(round(v, 2))
  return percent ? `${text}%` : text
}

/** Linear scale helper. */
function scale(d0: number, d1: number, r0: number, r1: number) {
  return (v: number) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0)
}

// ---- Value axis (shared by bar, histogram, line) ------------------------------------------------

function valueAxis(values: number[], yMin?: number, yMax?: number) {
  const max = yMax ?? Math.max(...values, 1)
  const ticks = niceTicks(yMin ?? 0, max * 1.08)
  const top = ticks.at(-1)!
  const y = scale(ticks[0]!, top, M.value.top + plotH.value, M.value.top)
  return { ticks, y }
}

// ---- Bar --------------------------------------------------------------------------------------

const bar = computed(() => {
  const c = props.chart
  if (c.kind !== 'bar') return null
  const { ticks, y } = valueAxis(c.values, c.yMin)
  const band = plotW.value / c.categories.length
  const width = band * 0.62
  const base = y(ticks[0]!)
  return {
    ticks,
    y,
    bars: c.values.map((v, i) => ({
      x: M.value.left + band * i + (band - width) / 2,
      width,
      top: y(v),
      height: Math.max(0, base - y(v)),
      value: v,
      label: c.categories[i]!,
      color: c.highlight?.includes(i) ? HIGHLIGHT : COLORS[0]
    })),
    base,
    percent: c.percent
  }
})

const grouped = computed(() => {
  const c = props.chart
  if (c.kind !== 'groupedBar') return null
  const all = c.series.flatMap((s) => s.values)
  const { ticks, y } = valueAxis(all)
  const band = plotW.value / c.categories.length
  const inner = (band * 0.8) / c.series.length
  const base = y(0)
  return {
    ticks,
    y,
    base,
    groups: c.categories.map((label, gi) => ({
      label,
      center: M.value.left + band * gi + band / 2,
      bars: c.series.map((s, si) => ({
        x: M.value.left + band * gi + band * 0.1 + inner * si,
        width: inner * 0.92,
        top: y(s.values[gi]!),
        height: base - y(s.values[gi]!),
        value: s.values[gi]!,
        color: COLORS[si % COLORS.length]
      }))
    })),
    legend: c.series.map((s, i) => ({ name: s.name, color: COLORS[i % COLORS.length] })),
    percent: c.percent
  }
})

// ---- Pie --------------------------------------------------------------------------------------

const pie = computed(() => {
  const c = props.chart
  if (c.kind !== 'pie') return null
  const total = c.values.reduce((a, b) => a + b, 0)
  const cx = W.value * 0.36
  const cy = H.value / 2
  const r = Math.min(H.value / 2 - 20, W.value * 0.3)
  let angle = -Math.PI / 2
  return {
    cx,
    cy,
    r,
    slices: c.values.map((v, i) => {
      const share = v / total
      const start = angle
      const end = angle + share * Math.PI * 2
      angle = end
      const large = end - start > Math.PI ? 1 : 0
      const p = (a: number, rr = r) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]
      const [x0, y0] = p(start)
      const [x1, y1] = p(end)
      const mid = (start + end) / 2
      const [lx, ly] = p(mid, r * 0.66)
      return {
        path: `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z`,
        color: COLORS[i % COLORS.length],
        label: c.categories[i]!,
        percent: share * 100,
        degrees: share * 360,
        lx,
        ly
      }
    })
  }
})

// ---- Pareto -----------------------------------------------------------------------------------

const pareto = computed(() => {
  const c = props.chart
  if (c.kind !== 'pareto') return null
  const total = c.values.reduce((a, b) => a + b, 0)
  const percents = c.values.map((v) => (v / total) * 100)
  const cum = cumulative(percents)
  const yLeft = scale(0, 100, M.value.top + plotH.value, M.value.top)
  const band = plotW.value / c.categories.length
  const width = band * 0.7
  return {
    ticks: [0, 20, 40, 60, 80, 100],
    y: yLeft,
    bars: percents.map((p, i) => ({
      x: M.value.left + band * i + (band - width) / 2,
      width,
      top: yLeft(p),
      height: yLeft(0) - yLeft(p),
      value: p,
      label: c.categories[i]!,
      cx: M.value.left + band * i + band / 2,
      cum: cum[i]!
    }))
  }
})

// ---- Histogram --------------------------------------------------------------------------------

const histogram = computed(() => {
  const c = props.chart
  if (c.kind !== 'histogram') return null
  const counts = c.counts ?? classCounts(c.data ?? [], c.bounds)
  const n = counts.reduce((a, b) => a + b, 0)
  const heights = c.percent ? counts.map((k) => (k / n) * 100) : counts
  const { ticks, y } = valueAxis(heights)
  const x = scale(c.bounds[0]!, c.bounds.at(-1)!, M.value.left, M.value.left + plotW.value)
  return {
    ticks,
    y,
    x,
    bounds: c.bounds,
    base: y(0),
    bars: heights.map((h, i) => ({
      x: x(c.bounds[i]!),
      width: x(c.bounds[i + 1]!) - x(c.bounds[i]!),
      top: y(h),
      height: y(0) - y(h),
      value: h
    })),
    percent: c.percent
  }
})

// ---- Line / polygon / ogive ------------------------------------------------------------------

const line = computed(() => {
  const c = props.chart
  if (c.kind !== 'line') return null
  const all = c.series.flatMap((s) => s.values)
  const lo = c.yMin ?? Math.min(0, ...all)
  const hi = c.yMax ?? Math.max(...all, c.reference?.value ?? -Infinity)
  const ticks = niceTicks(lo, hi * (c.yMax ? 1 : 1.05))
  const y = scale(ticks[0]!, ticks.at(-1)!, M.value.top + plotH.value, M.value.top)
  const step = plotW.value / Math.max(1, c.x.length - 1)
  const xs = c.x.map((_, i) => M.value.left + (c.x.length === 1 ? plotW.value / 2 : step * i))
  const labelEvery = Math.ceil(c.x.length / (props.small ? 6 : 12))
  return {
    ticks,
    y,
    xs,
    labels: c.x.map((v, i) => ({ text: String(v), x: xs[i]!, show: i % labelEvery === 0 })),
    series: c.series.map((s, si) => ({
      name: s.name,
      color: COLORS[si % COLORS.length],
      points: s.values.map((v, i) => [xs[i]!, y(v)] as [number, number])
    })),
    reference: c.reference ? { y: y(c.reference.value), label: c.reference.label } : null,
    pointsOnly: c.pointsOnly,
    percent: c.percent
  }
})

// ---- Scatter ----------------------------------------------------------------------------------

const scatter = computed(() => {
  const c = props.chart
  if (c.kind !== 'scatter') return null
  const xsRaw = c.points.map((p) => p[0])
  const ysRaw = c.points.map((p) => p[1])
  const xt = niceTicks(Math.min(...xsRaw), Math.max(...xsRaw))
  const yt = niceTicks(Math.min(...ysRaw), Math.max(...ysRaw))
  const x = scale(xt[0]!, xt.at(-1)!, M.value.left, M.value.left + plotW.value)
  const y = scale(yt[0]!, yt.at(-1)!, M.value.top + plotH.value, M.value.top)
  let trend: [number, number, number, number] | null = null
  if (c.trend) {
    const { slope, intercept } = linearFit(c.points)
    const x0 = xt[0]!
    const x1 = xt.at(-1)!
    trend = [x(x0), y(intercept + slope * x0), x(x1), y(intercept + slope * x1)]
  }
  return { xt, yt, x, y, points: c.points.map((p) => [x(p[0]), y(p[1])]), trend }
})

// ---- Dot plot ---------------------------------------------------------------------------------

const dot = computed(() => {
  const c = props.chart
  if (c.kind !== 'dot') return null
  const step = c.step ?? 1
  const values = c.data.map((v) => round(Math.round(v / step) * step, 6))
  const ticks = niceTicks(Math.min(...values), Math.max(...values), props.small ? 5 : 8)
  const x = scale(ticks[0]!, ticks.at(-1)!, M.value.left, M.value.left + plotW.value)
  const stacks = new Map<number, number>()
  const r = props.small ? 4 : 5.5
  const baseY = M.value.top + plotH.value - r - 2
  const dots = [...values]
    .sort((a, b) => a - b)
    .map((v) => {
      const level = stacks.get(v) ?? 0
      stacks.set(v, level + 1)
      return { cx: x(v), cy: baseY - level * (r * 2 + 1.5), highlight: c.highlight?.includes(v) }
    })
  return { ticks, x, dots, r }
})

const legendSeries = computed(() =>
  line.value && line.value.series.length > 1 ? line.value.series : null
)
const axisLabels = computed(() => {
  const c = props.chart
  return {
    x: 'xLabel' in c ? c.xLabel : undefined,
    y: 'yLabel' in c ? c.yLabel : undefined
  }
})
</script>

<template>
  <div v-if="chart.kind === 'gallery'" class="gallery">
    <figure v-for="(item, i) in chart.charts" :key="i" class="gallery__item">
      <figcaption>{{ item.title }}</figcaption>
      <ChartView :chart="item.chart" small />
    </figure>
  </div>

  <StatFigure v-else-if="STAT_KINDS.includes(chart.kind)" :chart="chart" />

  <div v-else class="chart" :class="{ 'chart--small': small }">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="axisLabels.y ?? chart.kind">
      <!-- Value grid and axis (bar, grouped, histogram, line, pareto) -->
      <g v-if="bar || grouped || histogram || line || pareto" class="grid">
        <template v-for="t in (bar ?? grouped ?? histogram ?? line ?? pareto)!.ticks" :key="t">
          <line
            :x1="M.left"
            :x2="W - M.right"
            :y1="(bar ?? grouped ?? histogram ?? line ?? pareto)!.y(t)"
            :y2="(bar ?? grouped ?? histogram ?? line ?? pareto)!.y(t)"
          />
          <text
            class="tick"
            :x="M.left - 8"
            :y="(bar ?? grouped ?? histogram ?? line ?? pareto)!.y(t)"
            text-anchor="end"
            dy="0.32em"
          >
            {{ fmt(t, Boolean((bar ?? grouped ?? histogram ?? line)?.percent) || Boolean(pareto)) }}
          </text>
        </template>
      </g>

      <!-- Bar -->
      <g v-if="bar">
        <g v-for="(b, i) in bar.bars" :key="i">
          <rect :x="b.x" :y="b.top" :width="b.width" :height="b.height" :fill="b.color" rx="3" />
          <text class="value" :x="b.x + b.width / 2" :y="b.top - 6" text-anchor="middle">
            {{ fmt(b.value, bar.percent) }}
          </text>
          <text class="cat" :x="b.x + b.width / 2" :y="bar.base + 18" text-anchor="middle">
            {{ b.label }}
          </text>
        </g>
        <line class="axis" :x1="M.left" :x2="W - M.right" :y1="bar.base" :y2="bar.base" />
      </g>

      <!-- Grouped bar -->
      <g v-if="grouped">
        <g v-for="(g, gi) in grouped.groups" :key="gi">
          <g v-for="(b, bi) in g.bars" :key="bi">
            <rect :x="b.x" :y="b.top" :width="b.width" :height="b.height" :fill="b.color" rx="2" />
            <text
              v-if="!small"
              class="value value--small"
              :x="b.x + b.width / 2"
              :y="b.top - 5"
              text-anchor="middle"
            >
              {{ fmt(b.value, grouped.percent) }}
            </text>
          </g>
          <text class="cat" :x="g.center" :y="grouped.base + 18" text-anchor="middle">
            {{ g.label }}
          </text>
        </g>
        <line class="axis" :x1="M.left" :x2="W - M.right" :y1="grouped.base" :y2="grouped.base" />
      </g>

      <!-- Pie -->
      <g v-if="pie">
        <path v-for="(s, i) in pie.slices" :key="i" :d="s.path" :fill="s.color" class="slice" />
        <text
          v-for="(s, i) in pie.slices"
          :key="`l${i}`"
          class="slice-label"
          :x="s.lx"
          :y="s.ly"
          text-anchor="middle"
          dy="0.32em"
        >
          {{ s.percent >= 6 ? `${round(s.percent, 1)}%` : '' }}
        </text>
        <g v-for="(s, i) in pie.slices" :key="`k${i}`">
          <rect :x="W * 0.7" :y="40 + i * 26" width="14" height="14" rx="3" :fill="s.color" />
          <text class="cat" :x="W * 0.7 + 22" :y="47 + i * 26" dy="0.32em">
            {{ s.label }} · {{ round(s.degrees, 0) }}°
          </text>
        </g>
      </g>

      <!-- Pareto -->
      <g v-if="pareto">
        <g v-for="(b, i) in pareto.bars" :key="i">
          <rect :x="b.x" :y="b.top" :width="b.width" :height="b.height" :fill="COLORS[0]" rx="2" />
          <text class="value value--small" :x="b.cx" :y="b.top - 5" text-anchor="middle">
            {{ fmt(round(b.value, 1), true) }}
          </text>
          <text class="cat cat--small" :x="b.cx" :y="M.top + plotH + 16" text-anchor="middle">
            {{ b.label }}
          </text>
        </g>
        <polyline
          class="cum-line"
          :points="pareto.bars.map((b) => `${b.cx},${pareto!.y(b.cum)}`).join(' ')"
        />
        <g v-for="(b, i) in pareto.bars" :key="`c${i}`">
          <circle :cx="b.cx" :cy="pareto.y(b.cum)" r="4" class="cum-dot" />
          <!-- The first cumulative point equals the first bar, which is already labelled. -->
          <text v-if="i > 0" class="cum-text" :x="b.cx + 6" :y="pareto.y(b.cum) - 8">
            {{ fmt(round(b.cum, 1), true) }}
          </text>
        </g>
        <line class="axis" :x1="M.left" :x2="W - M.right" :y1="pareto.y(0)" :y2="pareto.y(0)" />
      </g>

      <!-- Histogram -->
      <g v-if="histogram">
        <g v-for="(b, i) in histogram.bars" :key="i">
          <rect
            :x="b.x"
            :y="b.top"
            :width="b.width"
            :height="b.height"
            :fill="COLORS[0]"
            class="hist-bar"
          />
          <text
            v-if="b.value > 0"
            class="value"
            :x="b.x + b.width / 2"
            :y="b.top - 6"
            text-anchor="middle"
          >
            {{ fmt(round(b.value, 2), histogram.percent) }}
          </text>
        </g>
        <line
          class="axis"
          :x1="M.left"
          :x2="W - M.right"
          :y1="histogram.base"
          :y2="histogram.base"
        />
        <text
          v-for="bnd in histogram.bounds"
          :key="bnd"
          class="tick"
          :x="histogram.x(bnd)"
          :y="histogram.base + 16"
          text-anchor="middle"
        >
          {{ bnd }}
        </text>
      </g>

      <!-- Line -->
      <g v-if="line">
        <line
          v-if="line.reference"
          class="reference"
          :x1="M.left"
          :x2="W - M.right"
          :y1="line.reference.y"
          :y2="line.reference.y"
        />
        <text
          v-if="line.reference"
          class="reference-label"
          :x="W - M.right"
          :y="line.reference.y - 6"
          text-anchor="end"
        >
          {{ line.reference.label }}
        </text>
        <g v-for="s in line.series" :key="s.name">
          <polyline
            v-if="!line.pointsOnly"
            class="series"
            :stroke="s.color"
            :points="s.points.map((p) => p.join(',')).join(' ')"
          />
          <circle
            v-for="(p, i) in s.points"
            :key="i"
            :cx="p[0]"
            :cy="p[1]"
            :r="small ? 3 : 4"
            :fill="s.color"
          />
        </g>
        <text
          v-for="(l, i) in line.labels.filter((label) => label.show)"
          :key="i"
          class="tick"
          :x="l.x"
          :y="M.top + plotH + 16"
          text-anchor="middle"
        >
          {{ l.text }}
        </text>
      </g>

      <!-- Scatter -->
      <g v-if="scatter">
        <g class="grid">
          <template v-for="t in scatter.yt" :key="`y${t}`">
            <line :x1="M.left" :x2="W - M.right" :y1="scatter.y(t)" :y2="scatter.y(t)" />
            <text class="tick" :x="M.left - 8" :y="scatter.y(t)" text-anchor="end" dy="0.32em">
              {{ fmt(t) }}
            </text>
          </template>
          <text
            v-for="t in scatter.xt"
            :key="`x${t}`"
            class="tick"
            :x="scatter.x(t)"
            :y="M.top + plotH + 16"
            text-anchor="middle"
          >
            {{ fmt(t) }}
          </text>
        </g>
        <line
          v-if="scatter.trend"
          class="trend"
          :x1="scatter.trend[0]"
          :y1="scatter.trend[1]"
          :x2="scatter.trend[2]"
          :y2="scatter.trend[3]"
        />
        <circle
          v-for="(p, i) in scatter.points"
          :key="i"
          :cx="p[0]"
          :cy="p[1]"
          :r="small ? 3.5 : 5"
          class="scatter-dot"
        />
      </g>

      <!-- Dot plot -->
      <g v-if="dot">
        <line class="axis" :x1="M.left" :x2="W - M.right" :y1="M.top + plotH" :y2="M.top + plotH" />
        <text
          v-for="t in dot.ticks"
          :key="t"
          class="tick"
          :x="dot.x(t)"
          :y="M.top + plotH + 16"
          text-anchor="middle"
        >
          {{ fmt(t) }}
        </text>
        <circle
          v-for="(d, i) in dot.dots"
          :key="i"
          :cx="d.cx"
          :cy="d.cy"
          :r="dot.r"
          :fill="d.highlight ? HIGHLIGHT : COLORS[0]"
        />
      </g>

      <!-- Axis titles -->
      <text
        v-if="axisLabels.x"
        class="axis-title"
        :x="M.left + plotW / 2"
        :y="H - 10"
        text-anchor="middle"
      >
        {{ axisLabels.x }}
      </text>
      <text
        v-if="axisLabels.y"
        class="axis-title"
        :transform="`translate(14 ${M.top + plotH / 2}) rotate(-90)`"
        text-anchor="middle"
      >
        {{ axisLabels.y }}
      </text>
    </svg>

    <ul v-if="grouped || legendSeries" class="legend">
      <li v-for="item in grouped?.legend ?? legendSeries ?? []" :key="item.name">
        <span :style="{ background: item.color }" />{{ item.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.chart {
  width: 100%;

  svg {
    display: block;
    width: 100%;
    max-width: 640px;
    height: auto;
    margin: 0 auto;
    font-family: $font-sans;
  }

  &--small svg {
    max-width: 340px;
  }
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;

  &__item {
    margin: 0;
    padding: 10px;
    border-radius: $radius-sm;
    background: $color-card;
    border: 1px solid $color-line;

    figcaption {
      font-size: 14px;
      font-weight: 600;
      color: $color-ink;
      text-align: center;
    }
  }
}

.grid line {
  stroke: $color-line;
  stroke-width: 1;
}

.axis {
  stroke: $color-muted;
  stroke-width: 1.5;
}

.tick {
  font-size: 11.5px;
  fill: $color-muted;
  font-variant-numeric: tabular-nums;
}

.value {
  font-size: 12.5px;
  font-weight: 700;
  fill: $color-ink;
  font-variant-numeric: tabular-nums;

  &--small {
    font-size: 11px;
  }
}

.cat {
  font-size: 12.5px;
  fill: $color-body;

  &--small {
    font-size: 10.5px;
  }
}

.axis-title {
  font-size: 12.5px;
  font-weight: 600;
  fill: $color-body;
}

.slice {
  stroke: #fff;
  stroke-width: 2;
}

.slice-label {
  font-size: 12.5px;
  font-weight: 700;
  fill: #fff;
}

.hist-bar {
  stroke: #fff;
  stroke-width: 1;
}

.cum-line {
  fill: none;
  stroke: #c2410c;
  stroke-width: 2.5;
}

.cum-dot {
  fill: #c2410c;
}

.cum-text {
  font-size: 10.5px;
  font-weight: 700;
  fill: #c2410c;
}

.series {
  fill: none;
  stroke-width: 2.5;
}

.reference {
  stroke: #c2410c;
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
}

.reference-label {
  font-size: 11.5px;
  font-weight: 700;
  fill: #c2410c;
}

.trend {
  stroke: #c2410c;
  stroke-width: 2;
  stroke-dasharray: 6 4;
}

.scatter-dot {
  fill: #2a62a6;
  fill-opacity: 0.85;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 16px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: $color-body;

  li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  span {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }
}
</style>
