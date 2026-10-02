<script setup lang="ts">
import { boxSummary, fixed, niceTicks, round } from '@/functions/stats.function'
import type { ChartSpec } from '@/models/chart.model'

const props = defineProps<{ chart: ChartSpec }>()
const { t } = useI18n()

const BLUE = '#2A62A6'
const ORANGE = '#C2410C'
const W = 600

function scale(d0: number, d1: number, r0: number, r1: number) {
  return (v: number) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0)
}
const num = (v: number, d = 2) => (Number.isInteger(v) ? String(v) : String(round(v, d)))

// ---- Box-and-whiskers ------------------------------------------------------------------------

const box = computed(() => {
  const c = props.chart
  if (c.kind !== 'box') return null
  const summaries = c.groups.map((g) => ({ name: g.name, s: boxSummary(g.data) }))
  const all = summaries.flatMap(({ s }) => [s.min, s.max])
  const ticks = niceTicks(Math.min(...all), Math.max(...all), 8)
  const left = c.groups.some((g) => g.name) ? 110 : 30
  const x = scale(ticks[0]!, ticks.at(-1)!, left, W - 24)
  const rowH = 86
  const height = 40 + summaries.length * rowH + 36
  return {
    ticks,
    x,
    height,
    axisY: 30 + summaries.length * rowH,
    rows: summaries.map(({ name, s }, i) => ({ name, s, y: 30 + i * rowH + rowH / 2 }))
  }
})

// ---- Bell curve ------------------------------------------------------------------------------

const bell = computed(() => {
  const c = props.chart
  if (c.kind !== 'bell') return null
  const H = 300
  const lo = c.mean - 3.6 * c.sd
  const hi = c.mean + 3.6 * c.sd
  const x = scale(lo, hi, 30, W - 30)
  const pdf = (v: number) => Math.exp(-(((v - c.mean) / c.sd) ** 2) / 2)
  const y = (v: number) => 230 - pdf(v) * 180
  const curve = (a: number, b: number) => {
    const pts: string[] = []
    for (let i = 0; i <= 80; i++) {
      const v = a + ((b - a) * i) / 80
      pts.push(`${x(v)},${y(v)}`)
    }
    return pts
  }
  const band = (k: number) => {
    const a = c.mean - k * c.sd
    const b = c.mean + k * c.sd
    return `M${x(a)},230 L${curve(a, b).join(' L')} L${x(b)},230 Z`
  }
  const d = c.decimals ?? 1
  return {
    H,
    curve: curve(lo, hi).join(' '),
    bands: [
      { k: 3, path: band(3), pct: '99.73%', color: '#d6e2f2' },
      { k: 2, path: band(2), pct: '95.44%', color: '#a9c2e5' },
      { k: 1, path: band(1), pct: '68.26%', color: '#6e98d1' }
    ],
    ticks: [-3, -2, -1, 0, 1, 2, 3].map((k) => ({
      x: x(c.mean + k * c.sd),
      label: k === 0 ? 'μ' : `μ${k > 0 ? '+' : '−'}${Math.abs(k)}σ`,
      value: fixed(c.mean + k * c.sd, d)
    }))
  }
})

// ---- Venn diagram ----------------------------------------------------------------------------

const venn = computed(() => {
  const c = props.chart
  if (c.kind !== 'venn') return null
  return { c, cx1: 240, cx2: 360, cy: 150, r: 95 }
})

// ---- Probability tree ------------------------------------------------------------------------

const tree = computed(() => {
  const c = props.chart
  if (c.kind !== 'tree') return null
  const d = c.decimals ?? 2
  const leaves = c.branches.flatMap((b, bi) => b.children.map((ch, ci) => ({ b, bi, ch, ci })))
  const rowH = 52
  const height = leaves.length * rowH + 30
  const rootY = height / 2
  let leafIndex = 0
  const branches = c.branches.map((b, bi) => {
    const kids = b.children.map((ch, ci) => {
      const y = 30 + leafIndex++ * rowH
      return {
        label: ch.label,
        p: fixed(ch.p, d),
        joint: fixed(b.p * ch.p, Math.max(d + 2, 4)),
        y,
        hit: c.highlight?.includes(`${bi}-${ci}`)
      }
    })
    const y = (kids[0]!.y + kids.at(-1)!.y) / 2
    return { label: b.label, p: fixed(b.p, d), y, kids }
  })
  return { branches, rootY, height }
})

// ---- Sample space grid -----------------------------------------------------------------------

const grid = computed(() => (props.chart.kind === 'grid' ? props.chart : null))

// ---- Probability distribution ----------------------------------------------------------------

const pmf = computed(() => {
  const c = props.chart
  if (c.kind !== 'pmf') return null
  const H = 320
  const M = { top: 24, right: 20, bottom: 52, left: 54 }
  const ticks = niceTicks(0, Math.max(...c.p) * 1.1)
  const y = scale(0, ticks.at(-1)!, H - M.bottom, M.top)
  const band = (W - M.left - M.right) / c.x.length
  const width = Math.min(band * 0.7, 46)
  const cx = (i: number) => M.left + band * i + band / 2
  const xOf = (v: number) => {
    // Position of a (possibly fractional) x value between the bars.
    const i = c.x.findIndex((xv) => xv >= v)
    if (i <= 0) return cx(0)
    const a = c.x[i - 1]!
    const b = c.x[i]!
    return cx(i - 1) + ((v - a) / (b - a)) * (cx(i) - cx(i - 1))
  }
  return {
    H,
    M,
    ticks,
    y,
    bars: c.x.map((xv, i) => ({
      x: cx(i) - width / 2,
      cx: cx(i),
      width,
      top: y(c.p[i]!),
      height: y(0) - y(c.p[i]!),
      label: String(xv),
      p: c.p[i]!,
      hit: c.highlight?.includes(xv)
    })),
    meanX: c.mean !== undefined ? xOf(c.mean) : null
  }
})
</script>

<template>
  <!-- Box-and-whiskers -->
  <svg
    v-if="box"
    class="figure"
    :viewBox="`0 0 ${W} ${box.height}`"
    role="img"
    aria-label="box plot"
  >
    <g v-for="row in box.rows" :key="row.name">
      <text v-if="row.name" class="label" :x="10" :y="row.y" dy="0.32em">{{ row.name }}</text>
      <line
        class="whisker"
        :x1="box.x(row.s.whiskers[0])"
        :x2="box.x(row.s.q1)"
        :y1="row.y"
        :y2="row.y"
      />
      <line
        class="whisker"
        :x1="box.x(row.s.q3)"
        :x2="box.x(row.s.whiskers[1])"
        :y1="row.y"
        :y2="row.y"
      />
      <line
        class="whisker"
        :x1="box.x(row.s.whiskers[0])"
        :x2="box.x(row.s.whiskers[0])"
        :y1="row.y - 10"
        :y2="row.y + 10"
      />
      <line
        class="whisker"
        :x1="box.x(row.s.whiskers[1])"
        :x2="box.x(row.s.whiskers[1])"
        :y1="row.y - 10"
        :y2="row.y + 10"
      />
      <rect
        class="box-rect"
        :x="box.x(row.s.q1)"
        :y="row.y - 20"
        :width="box.x(row.s.q3) - box.x(row.s.q1)"
        height="40"
      />
      <line
        class="median"
        :x1="box.x(row.s.median)"
        :x2="box.x(row.s.median)"
        :y1="row.y - 20"
        :y2="row.y + 20"
      />
      <text class="small" :x="box.x(row.s.q1)" :y="row.y - 26" text-anchor="middle">
        Q1 {{ num(row.s.q1) }}
      </text>
      <text class="small" :x="box.x(row.s.median)" :y="row.y + 34" text-anchor="middle">
        Md {{ num(row.s.median) }}
      </text>
      <text class="small" :x="box.x(row.s.q3)" :y="row.y - 26" text-anchor="middle">
        Q3 {{ num(row.s.q3) }}
      </text>
      <circle
        v-for="v in row.s.mildOutliers"
        :key="`m${v}`"
        :cx="box.x(v)"
        :cy="row.y"
        r="5"
        class="mild"
      />
      <circle
        v-for="v in row.s.extremeOutliers"
        :key="`e${v}`"
        :cx="box.x(v)"
        :cy="row.y"
        r="5"
        class="extreme"
      />
    </g>
    <line
      class="axis"
      :x1="box.x(box.ticks[0]!)"
      :x2="box.x(box.ticks.at(-1)!)"
      :y1="box.axisY"
      :y2="box.axisY"
    />
    <text
      v-for="tk in box.ticks"
      :key="tk"
      class="tick"
      :x="box.x(tk)"
      :y="box.axisY + 16"
      text-anchor="middle"
    >
      {{ tk }}
    </text>
    <text
      v-if="chart.kind === 'box' && chart.xLabel"
      class="label"
      :x="W / 2"
      :y="box.height - 6"
      text-anchor="middle"
    >
      {{ chart.xLabel }}
    </text>
  </svg>

  <!-- Bell curve with the empirical rule -->
  <svg
    v-else-if="bell"
    class="figure"
    :viewBox="`0 0 ${W} ${bell.H}`"
    role="img"
    aria-label="normal curve"
  >
    <path v-for="b in bell.bands" :key="b.k" :d="b.path" :fill="b.color" />
    <polyline class="curve" :points="bell.curve" />
    <line class="axis" x1="30" :x2="W - 30" y1="230" y2="230" />
    <g v-for="tk in bell.ticks" :key="tk.label">
      <line class="axis" :x1="tk.x" :x2="tk.x" y1="230" y2="236" />
      <text class="small" :x="tk.x" y="250" text-anchor="middle">{{ tk.label }}</text>
      <text class="tick" :x="tk.x" y="266" text-anchor="middle">{{ tk.value }}</text>
    </g>
    <g v-for="(b, i) in [...bell.bands].reverse()" :key="`legend${b.k}`">
      <rect x="36" :y="14 + i * 20" width="14" height="14" rx="3" :fill="b.color" />
      <text class="small" x="56" :y="21 + i * 20" dy="0.32em">μ ± {{ b.k }}σ: {{ b.pct }}</text>
    </g>
    <text
      v-if="chart.kind === 'bell' && chart.xLabel"
      class="label"
      :x="W / 2"
      y="292"
      text-anchor="middle"
    >
      {{ chart.xLabel }}
    </text>
  </svg>

  <!-- Venn diagram -->
  <svg v-else-if="venn" class="figure" viewBox="0 0 600 300" role="img" aria-label="Venn diagram">
    <defs>
      <clipPath id="venn-a"><circle :cx="venn.cx1" :cy="venn.cy" :r="venn.r" /></clipPath>
      <clipPath id="venn-b"><circle :cx="venn.cx2" :cy="venn.cy" :r="venn.r" /></clipPath>
      <mask id="venn-not-b">
        <rect width="600" height="300" fill="white" />
        <circle :cx="venn.cx2" :cy="venn.cy" :r="venn.r" fill="black" />
      </mask>
      <mask id="venn-not-a">
        <rect width="600" height="300" fill="white" />
        <circle :cx="venn.cx1" :cy="venn.cy" :r="venn.r" fill="black" />
      </mask>
    </defs>
    <rect class="universe" x="40" y="20" width="520" height="260" rx="10" />
    <!-- shaded region -->
    <g class="shade">
      <rect
        v-if="venn.c.shade === 'notA'"
        x="40"
        y="20"
        width="520"
        height="260"
        rx="10"
        mask="url(#venn-not-a)"
      />
      <circle
        v-if="venn.c.shade === 'A' || venn.c.shade === 'AorB'"
        :cx="venn.cx1"
        :cy="venn.cy"
        :r="venn.r"
      />
      <circle
        v-if="venn.c.shade === 'B' || venn.c.shade === 'AorB'"
        :cx="venn.cx2"
        :cy="venn.cy"
        :r="venn.r"
      />
      <circle
        v-if="venn.c.shade === 'AandB'"
        :cx="venn.cx2"
        :cy="venn.cy"
        :r="venn.r"
        clip-path="url(#venn-a)"
      />
      <circle
        v-if="venn.c.shade === 'AnotB'"
        :cx="venn.cx1"
        :cy="venn.cy"
        :r="venn.r"
        mask="url(#venn-not-b)"
      />
    </g>
    <circle class="ring" :cx="venn.cx1" :cy="venn.cy" :r="venn.r" />
    <circle class="ring" :cx="venn.cx2" :cy="venn.cy" :r="venn.r" />
    <text class="set-label" :x="venn.cx1 - 70" y="52" text-anchor="middle">{{ venn.c.a }}</text>
    <text class="set-label" :x="venn.cx2 + 70" y="52" text-anchor="middle">{{ venn.c.b }}</text>
    <template v-if="venn.c.counts">
      <text class="count" :x="venn.cx1 - 45" :y="venn.cy" text-anchor="middle" dy="0.32em">
        {{ venn.c.counts.aOnly }}
      </text>
      <text
        class="count"
        :x="(venn.cx1 + venn.cx2) / 2"
        :y="venn.cy"
        text-anchor="middle"
        dy="0.32em"
      >
        {{ venn.c.counts.both }}
      </text>
      <text class="count" :x="venn.cx2 + 45" :y="venn.cy" text-anchor="middle" dy="0.32em">
        {{ venn.c.counts.bOnly }}
      </text>
      <text class="count" x="530" y="262" text-anchor="end">{{ venn.c.counts.neither }}</text>
    </template>
  </svg>

  <!-- Probability tree -->
  <svg
    v-else-if="tree"
    class="figure"
    :viewBox="`0 0 ${W} ${tree.height}`"
    role="img"
    aria-label="probability tree"
  >
    <circle cx="30" :cy="tree.rootY" r="6" class="node" />
    <g v-for="(b, bi) in tree.branches" :key="bi">
      <line class="branch" x1="36" :y1="tree.rootY" x2="190" :y2="b.y" />
      <text class="p" x="105" :y="(tree.rootY + b.y) / 2 - 6" text-anchor="middle">{{ b.p }}</text>
      <rect class="node-box" x="190" :y="b.y - 15" width="110" height="30" rx="6" />
      <text class="label" x="245" :y="b.y" text-anchor="middle" dy="0.32em">{{ b.label }}</text>
      <g v-for="(k, ki) in b.kids" :key="ki">
        <line class="branch" :class="{ hit: k.hit }" x1="300" :y1="b.y" x2="410" :y2="k.y" />
        <text class="p" x="350" :y="(b.y + k.y) / 2 - 6" text-anchor="middle">{{ k.p }}</text>
        <rect
          class="node-box"
          :class="{ hit: k.hit }"
          x="410"
          :y="k.y - 15"
          width="80"
          height="30"
          rx="6"
        />
        <text class="label" x="450" :y="k.y" text-anchor="middle" dy="0.32em">{{ k.label }}</text>
        <text class="joint" :class="{ hit: k.hit }" x="500" :y="k.y" dy="0.32em">
          = {{ k.joint }}
        </text>
      </g>
    </g>
  </svg>

  <!-- Sample space grid -->
  <div v-else-if="grid" class="grid-wrap">
    <p v-if="grid.columnLabel" class="grid-col-label">{{ grid.columnLabel }}</p>
    <table class="space">
      <thead>
        <tr>
          <th>{{ grid.rowLabel }}</th>
          <th v-for="col in grid.columns" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, r) in grid.rows" :key="row">
          <th>{{ row }}</th>
          <td
            v-for="(cell, ci) in grid.cells[r]"
            :key="ci"
            :class="{ hit: grid.highlight[r]?.[ci] }"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="grid-count">
      {{
        t('lesson.chart.highlighted', {
          k: grid.highlight.flat().filter(Boolean).length,
          n: grid.highlight.flat().length
        })
      }}
    </p>
  </div>

  <!-- Discrete probability distribution -->
  <svg
    v-else-if="pmf"
    class="figure"
    :viewBox="`0 0 ${W} ${pmf.H}`"
    role="img"
    aria-label="probability distribution"
  >
    <g v-for="tk in pmf.ticks" :key="tk">
      <line
        class="gridline"
        :x1="pmf.M.left"
        :x2="W - pmf.M.right"
        :y1="pmf.y(tk)"
        :y2="pmf.y(tk)"
      />
      <text class="tick" :x="pmf.M.left - 8" :y="pmf.y(tk)" text-anchor="end" dy="0.32em">
        {{ num(tk, 3) }}
      </text>
    </g>
    <g v-for="(b, i) in pmf.bars" :key="i">
      <rect
        :x="b.x"
        :y="b.top"
        :width="b.width"
        :height="b.height"
        :fill="b.hit ? ORANGE : BLUE"
        rx="2"
      />
      <text
        v-if="b.p >= 0.0005 && (pmf.bars.length <= 12 || b.p >= 0.01)"
        class="value"
        :x="b.cx"
        :y="b.top - 6"
        text-anchor="middle"
      >
        {{ fixed(b.p, b.p < 0.01 ? 4 : 3).replace(/^0/, '') }}
      </text>
      <text class="tick" :x="b.cx" :y="pmf.H - pmf.M.bottom + 16" text-anchor="middle">
        {{ b.label }}
      </text>
    </g>
    <line class="axis" :x1="pmf.M.left" :x2="W - pmf.M.right" :y1="pmf.y(0)" :y2="pmf.y(0)" />
    <template v-if="pmf.meanX !== null">
      <line class="mean-line" :x1="pmf.meanX" :x2="pmf.meanX" :y1="pmf.M.top" :y2="pmf.y(0)" />
      <text class="mean-text" :x="pmf.meanX + 6" :y="pmf.M.top + 10">
        {{ chart.kind === 'pmf' ? (chart.meanLabel ?? 'μ') : '' }}
      </text>
    </template>
    <text
      v-if="chart.kind === 'pmf' && chart.xLabel"
      class="label"
      :x="W / 2"
      :y="pmf.H - 10"
      text-anchor="middle"
    >
      {{ chart.xLabel }}
    </text>
    <text
      v-if="chart.kind === 'pmf' && chart.yLabel"
      class="label"
      :transform="`translate(14 ${(pmf.M.top + pmf.H - pmf.M.bottom) / 2}) rotate(-90)`"
      text-anchor="middle"
    >
      {{ chart.yLabel }}
    </text>
  </svg>
</template>

<style scoped lang="scss">
.figure {
  display: block;
  width: 100%;
  max-width: 640px;
  height: auto;
  margin: 0 auto;
  font-family: $font-sans;
}

.label {
  font-size: 13px;
  font-weight: 600;
  fill: $color-body;
}

.small {
  font-size: 11.5px;
  font-weight: 700;
  fill: $color-ink;
  font-variant-numeric: tabular-nums;
}

.tick {
  font-size: 11.5px;
  fill: $color-muted;
  font-variant-numeric: tabular-nums;
}

.value {
  font-size: 11px;
  font-weight: 700;
  fill: $color-ink;
  font-variant-numeric: tabular-nums;
}

.axis {
  stroke: $color-muted;
  stroke-width: 1.5;
}

.gridline {
  stroke: $color-line;
}

.whisker {
  stroke: $color-ink;
  stroke-width: 2;
}

.box-rect {
  fill: #d6e2f2;
  stroke: #2a62a6;
  stroke-width: 2;
}

.median {
  stroke: #c2410c;
  stroke-width: 3;
}

.mild {
  fill: #fff;
  stroke: #c2410c;
  stroke-width: 2;
}

.extreme {
  fill: #c2410c;
}

.curve {
  fill: none;
  stroke: #14213d;
  stroke-width: 2.5;
}

.universe {
  fill: #fff;
  stroke: $color-muted;
  stroke-width: 1.5;
}

.shade {
  fill: #f2b531;
  fill-opacity: 0.7;
}

.ring {
  fill: none;
  stroke: #14213d;
  stroke-width: 2;
}

.set-label {
  font-size: 15px;
  font-weight: 700;
  fill: #14213d;
}

.count {
  font-size: 18px;
  font-weight: 700;
  fill: #14213d;
}

.node {
  fill: #14213d;
}

.branch {
  stroke: $color-muted;
  stroke-width: 2;

  &.hit {
    stroke: #c2410c;
    stroke-width: 3.5;
  }
}

.p {
  font-size: 12.5px;
  font-weight: 700;
  fill: #2a62a6;
}

.node-box {
  fill: #fff;
  stroke: #2a62a6;
  stroke-width: 1.5;

  &.hit {
    fill: #fcf1d6;
    stroke: #c2410c;
    stroke-width: 2.5;
  }
}

.joint {
  font-size: 13px;
  font-weight: 700;
  fill: $color-ink;
  font-variant-numeric: tabular-nums;

  &.hit {
    fill: #c2410c;
  }
}

.mean-line {
  stroke: #c2410c;
  stroke-width: 2;
  stroke-dasharray: 6 4;
}

.mean-text {
  font-size: 12.5px;
  font-weight: 700;
  fill: #c2410c;
}

.grid-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
}

.grid-col-label,
.grid-count {
  font-size: 13px;
  font-weight: 600;
  color: $color-body;
}

.space {
  border-collapse: collapse;
  font-family: $font-mono;
  font-size: 13px;

  th,
  td {
    min-width: 46px;
    padding: 6px 4px;
    border: 1px solid $color-line;
    text-align: center;
  }

  th {
    background: $color-paper;
    font-family: $font-sans;
    color: $color-ink;
  }

  td.hit {
    background: #f2b531;
    font-weight: 700;
    color: $color-ink;
  }
}
</style>
