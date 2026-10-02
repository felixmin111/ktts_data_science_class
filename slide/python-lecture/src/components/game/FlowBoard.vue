<script setup lang="ts">
import {
  SKIP_LABEL,
  flowPath,
  flowResults,
  layoutFlow,
  type FlowBox,
  type FlowPoint
} from '@/functions/flow.function'
import type { FlowPuzzle } from '@/models/game.model'

const props = withDefaults(
  defineProps<{
    puzzle: FlowPuzzle
    /** The question's options (shuffled end-block labels); a block's key is its index + 1. */
    options: string[]
    answer: number
    /** The player's pick once answered; null when time ran out. */
    chosen?: number | null
    /** True once the player has answered: the path animation runs. */
    revealed: boolean
    /** False for a demo chart: end blocks cannot be clicked. */
    clickable?: boolean
    /** Number badges for keyboard answers (games only). */
    showKeys?: boolean
  }>(),
  { chosen: undefined, clickable: true, showKeys: true }
)
const emit = defineEmits<{ choose: [index: number]; done: [] }>()
const { t } = useI18n()

const layout = computed(() => layoutFlow(props.puzzle.tree))
const path = computed(() => ['start', ...flowPath(props.puzzle.tree)])
const results = computed(() => flowResults(props.puzzle.tree))
const reachedId = computed(() => path.value.at(-1))
const leafIds = computed(
  () => new Set(layout.value.boxes.filter((box) => isLeaf(box)).map((box) => box.id))
)

function isLeaf(box: FlowBox) {
  return box.kind === 'action' || box.kind === 'skip'
}

function optionIndex(box: FlowBox) {
  return props.options.indexOf(box.text)
}

function displayText(box: FlowBox) {
  return box.text === SKIP_LABEL ? t('game.flow.nothing') : box.text
}

function hexagon(box: FlowBox) {
  const { x, y, width, height } = box
  const half = width / 2
  const tip = 18
  return [
    [x - half, y],
    [x - half + tip, y - height / 2],
    [x + half - tip, y - height / 2],
    [x + half, y],
    [x + half - tip, y + height / 2],
    [x - half + tip, y + height / 2]
  ]
    .map((point) => point.join(','))
    .join(' ')
}

function edgeLabel(points: FlowPoint[], branch: 'yes' | 'no') {
  const [start] = points
  return { x: start![0] + (branch === 'yes' ? -30 : 30), y: start![1] - 9 }
}

// ---- Path animation --------------------------------------------------------------------------

/** One polyline per hop along the path, from a box's centre to the next box's centre. */
const legs = computed<FlowPoint[][]>(() => {
  const boxes = new Map(layout.value.boxes.map((box) => [box.id, box]))
  return path.value.slice(1).map((to, index) => {
    const from = path.value[index]!
    const edge = layout.value.edges.find((e) => e.from === from && e.to === to)!
    const a = boxes.get(from)!
    const b = boxes.get(to)!
    return [[a.x, a.y], ...edge.points, [b.x, b.y]]
  })
})

const trail = ref<FlowPoint[]>([])
const dot = ref<FlowPoint | null>(null)
const visited = ref(new Set<string>())
const finished = ref(false)
const reduceMotion = usePreferredReducedMotion()

const SPEED = 0.42 // px per ms
const PAUSE = 420 // ms at each decision

let frame = 0
let timer: ReturnType<typeof setTimeout> | undefined

function length(a: FlowPoint, b: FlowPoint) {
  return Math.hypot(b[0] - a[0], b[1] - a[1])
}

function finish() {
  visited.value = new Set(path.value)
  trail.value = legs.value.flat()
  dot.value = null
  finished.value = true
  emit('done')
}

function runLeg(legIndex: number) {
  const leg = legs.value[legIndex]
  if (!leg) return finish()
  const total = leg.slice(1).reduce((sum, point, i) => sum + length(leg[i]!, point), 0)
  const done = trail.value.slice()
  const startTime = performance.now()

  const step = (now: number) => {
    let remaining = Math.min(total, (now - startTime) * SPEED)
    const drawn: FlowPoint[] = [leg[0]!]
    for (let i = 1; i < leg.length; i++) {
      const a = leg[i - 1]!
      const b = leg[i]!
      const segment = length(a, b)
      if (remaining >= segment) {
        drawn.push(b)
        remaining -= segment
        continue
      }
      const ratio = segment === 0 ? 1 : remaining / segment
      drawn.push([a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio])
      break
    }
    trail.value = [...done, ...drawn]
    dot.value = drawn.at(-1)!

    if ((now - startTime) * SPEED < total) {
      frame = requestAnimationFrame(step)
      return
    }
    const arrived = path.value[legIndex + 1]!
    visited.value = new Set([...visited.value, arrived])
    timer = setTimeout(() => runLeg(legIndex + 1), arrived in results.value ? PAUSE : 0)
  }
  frame = requestAnimationFrame(step)
}

function stop() {
  cancelAnimationFrame(frame)
  clearTimeout(timer)
}

watch(
  () => props.revealed,
  (revealed) => {
    if (!revealed) return
    if (reduceMotion.value === 'reduce') return finish()
    visited.value = new Set(['start'])
    trail.value = []
    runLeg(0)
  },
  { immediate: true }
)

onBeforeUnmount(stop)

function boxClass(box: FlowBox) {
  const classes = [`box--${box.kind}`]
  if (canChoose(box)) classes.push('box--choice')
  if (visited.value.has(box.id)) classes.push('box--visited')
  if (finished.value && isLeaf(box)) {
    if (box.id === reachedId.value) classes.push('box--right')
    else if (props.chosen !== null && optionIndex(box) === props.chosen) classes.push('box--wrong')
    else classes.push('box--dim')
  }
  return classes
}

function canChoose(box: FlowBox) {
  return props.clickable && !props.revealed && leafIds.value.has(box.id)
}

function choose(box: FlowBox) {
  if (canChoose(box)) emit('choose', optionIndex(box))
}
</script>

<template>
  <div class="flow">
    <CodeRunner :code="puzzle.setup" :title="t('game.flow.variables')" />

    <div class="flow__scroll">
      <svg
        class="flow__chart"
        :viewBox="`0 0 ${layout.width} ${layout.height}`"
        :style="{
          minWidth: `${Math.min(layout.width, 640)}px`,
          maxWidth: `${Math.round(layout.width * 1.1)}px`
        }"
        role="group"
        :aria-label="t('game.flow.chartLabel')"
      >
        <defs>
          <marker
            id="flow-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" class="flow__arrow" />
          </marker>
        </defs>

        <!-- Edges -->
        <g v-for="edge in layout.edges" :key="`${edge.from}-${edge.to}`">
          <polyline
            class="flow__edge"
            :points="edge.points.map((p) => p.join(',')).join(' ')"
            marker-end="url(#flow-arrow)"
          />
          <text
            v-if="edge.branch !== 'start'"
            class="flow__edge-label"
            :class="`flow__edge-label--${edge.branch}`"
            :x="edgeLabel(edge.points, edge.branch).x"
            :y="edgeLabel(edge.points, edge.branch).y"
            text-anchor="middle"
          >
            {{ edge.branch === 'yes' ? 'True' : 'False' }}
          </text>
        </g>

        <!-- Animated path, drawn under the boxes so the dot "enters" each one -->
        <polyline
          v-if="trail.length > 1"
          class="flow__trail"
          :points="trail.map((p) => p.join(',')).join(' ')"
        />

        <!-- Travelling dot -->
        <circle v-if="dot" class="flow__dot" :cx="dot[0]" :cy="dot[1]" r="9" />
        <!-- Boxes -->
        <g
          v-for="box in layout.boxes"
          :key="box.id"
          class="box"
          :class="boxClass(box)"
          :role="canChoose(box) ? 'button' : undefined"
          :tabindex="canChoose(box) ? 0 : undefined"
          :aria-label="isLeaf(box) ? displayText(box) : undefined"
          @click="choose(box)"
          @keydown.enter.prevent="choose(box)"
          @keydown.space.prevent="choose(box)"
        >
          <polygon v-if="box.kind === 'decision'" class="box__shape" :points="hexagon(box)" />
          <rect
            v-else
            class="box__shape"
            :x="box.x - box.width / 2"
            :y="box.y - box.height / 2"
            :width="box.width"
            :height="box.height"
            :rx="box.kind === 'start' ? box.height / 2 : 10"
          />
          <text class="box__text" :x="box.x" :y="box.y" text-anchor="middle" dy="0.35em">
            {{ box.kind === 'start' ? t('game.flow.start') : displayText(box) }}
          </text>

          <!-- Key badge on clickable blocks -->
          <g v-if="showKeys && isLeaf(box) && optionIndex(box) >= 0" class="box__key">
            <circle :cx="box.x - box.width / 2" :cy="box.y - box.height / 2" r="11" />
            <text
              :x="box.x - box.width / 2"
              :y="box.y - box.height / 2"
              text-anchor="middle"
              dy="0.35em"
            >
              {{ optionIndex(box) + 1 }}
            </text>
          </g>

          <!-- True/False verdict once the dot reaches a decision -->
          <g
            v-if="box.kind === 'decision' && visited.has(box.id) && box.id in results"
            class="box__verdict"
            :class="results[box.id] ? 'box__verdict--yes' : 'box__verdict--no'"
          >
            <rect
              :x="box.x + box.width / 2 - 44"
              :y="box.y - box.height / 2 - 24"
              width="56"
              height="22"
              rx="11"
            />
            <text
              :x="box.x + box.width / 2 - 16"
              :y="box.y - box.height / 2 - 13"
              text-anchor="middle"
              dy="0.35em"
            >
              {{ results[box.id] ? 'True' : 'False' }}
            </text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';

.flow {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__scroll {
    overflow-x: auto;
    padding: 8px 0;
    border-radius: $radius;
    background: $color-paper;
  }

  &__chart {
    display: block;
    width: 100%;
    height: auto;
    margin: 0 auto;
    font-family: $font-mono;
    // Show >= and != exactly as typed, not as ligature symbols.
    font-variant-ligatures: none;
  }

  &__edge {
    fill: none;
    stroke: $color-muted;
    stroke-width: 2;
  }

  &__arrow {
    fill: $color-muted;
  }

  &__edge-label {
    font-family: $font-sans;
    font-size: 13px;
    font-weight: 700;

    &--yes {
      fill: $color-green;
    }

    &--no {
      fill: $color-red;
    }
  }

  &__trail {
    fill: none;
    stroke: var(--accent);
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0.55;
  }

  &__dot {
    fill: var(--accent);
    stroke: #fff;
    stroke-width: 3;
    filter: drop-shadow(0 0 6px var(--accent));
  }
}

.box {
  transition: opacity 200ms;

  &__shape {
    stroke-width: 2;
    transition:
      fill 200ms,
      stroke 200ms;
  }

  &__text {
    font-size: 14px;
    pointer-events: none;
  }

  &--start &__shape {
    fill: $color-navy;
    stroke: $color-navy;
  }

  &--start &__text {
    font-family: $font-sans;
    font-weight: 700;
    fill: #fff;
  }

  &--decision &__shape {
    fill: var(--accent);
    stroke: var(--accent);
  }

  &--decision &__text {
    fill: #fff;
    font-weight: 600;
  }

  &--action &__shape {
    fill: #fff;
    stroke: $color-blue;
  }

  &--action &__text {
    fill: $color-ink;
  }

  &--skip &__shape {
    fill: #fff;
    stroke: $color-muted;
    stroke-dasharray: 6 4;
  }

  &--skip &__text {
    font-family: $font-sans;
    font-style: italic;
    fill: $color-muted;
  }

  &--choice {
    cursor: pointer;
    outline: none;

    &:hover .box__shape,
    &:focus-visible .box__shape {
      fill: color.mix($color-blue, #fff, 12%);
      stroke-width: 3;
    }
  }

  &--decision.box--visited &__shape {
    stroke: $color-amber;
    stroke-width: 4;
  }

  &--right &__shape {
    // Solid fills: the trail is drawn underneath and must not show through.
    fill: color.mix($color-green, #fff, 16%);
    stroke: $color-green;
    stroke-width: 4;
    stroke-dasharray: none;
    animation: glow 900ms ease-out 2;
  }

  &--wrong &__shape {
    fill: color.mix($color-red, #fff, 10%);
    stroke: $color-red;
    stroke-width: 3;
  }

  &--dim {
    opacity: 0.45;
  }

  &__key {
    pointer-events: none;

    circle {
      fill: $color-ink;
    }

    text {
      font-family: $font-sans;
      font-size: 12px;
      font-weight: 700;
      fill: #fff;
    }
  }

  &__verdict {
    animation: pop 300ms ease-out;
    transform-box: fill-box;
    transform-origin: center;

    text {
      font-family: $font-sans;
      font-size: 12px;
      font-weight: 700;
      fill: #fff;
    }

    &--yes rect {
      fill: $color-green;
    }

    &--no rect {
      fill: $color-red;
    }
  }
}

@keyframes pop {
  from {
    transform: scale(0.4);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes glow {
  50% {
    filter: drop-shadow(0 0 10px rgba($color-green, 0.8));
  }
}

@media (prefers-reduced-motion: reduce) {
  .box--right .box__shape,
  .box__verdict {
    animation: none;
  }
}
</style>
