<script setup lang="ts">
import {
  layoutLoop,
  pyLiteral,
  runLoop,
  type LoopBox,
  type LoopPoint
} from '@/functions/loop.function'
import type { LoopProgram } from '@/models/loop.model'

const props = withDefaults(
  defineProps<{
    program: LoopProgram
    /**
     * watch: the parent starts the run with `play()` / `skip()`.
     * trace: the run stops at every check until the learner answers True or False.
     */
    mode?: 'watch' | 'trace'
  }>(),
  { mode: 'watch' }
)
const emit = defineEmits<{ done: []; mistake: [] }>()
const { t } = useI18n()

const layout = computed(() => layoutLoop(props.program))
const run = computed(() => runLoop(props.program))
const steps = computed(() => run.value.steps)
const boxes = computed(() => new Map(layout.value.boxes.map((box) => [box.id, box])))

/** Index of the step the dot has reached. */
const at = ref(0)
const dot = ref<LoopPoint | null>(null)
const activeEdge = ref<string | null>(null)
const playing = ref(false)
const finished = ref(false)
const fast = ref(false)
/** Trace mode: waiting for the learner to judge this check. */
const asking = ref(false)
const wrongGuess = ref(false)
const reduceMotion = usePreferredReducedMotion()

const step = computed(() => steps.value[at.value]!)
const prevStep = computed(() => steps.value[Math.max(0, at.value - 1)]!)
const pendingStep = computed(() => steps.value[at.value + 1])

const visits = computed(() => {
  const counts = new Map<string, number>()
  for (const s of steps.value.slice(0, at.value + 1))
    counts.set(s.node, (counts.get(s.node) ?? 0) + 1)
  return counts
})

/** Variables in order of first appearance, with the ones that just changed marked. */
const variables = computed(() => {
  const shown = step.value.vars
  const before = prevStep.value.vars
  return Object.keys(shown).map((name) => ({
    name,
    value: pyLiteral(shown[name]!),
    changed: at.value > 0 && before[name] !== shown[name]
  }))
})

const verdict = computed(() =>
  step.value.check === undefined || asking.value
    ? null
    : { node: step.value.node, value: step.value.check }
)

const question = computed(() => {
  const next = pendingStep.value
  if (!asking.value || !next) return ''
  if (next.node === 'loop') {
    return props.program.loop.kind === 'while'
      ? t('lesson.loop.askWhile', { condition: props.program.loop.condition })
      : t('lesson.loop.askFor', { header: props.program.loop.code })
  }
  const item = props.program.body[Number(next.node.split('-')[1])]
  return item?.kind === 'if' ? t('lesson.loop.askIf', { condition: item.condition }) : ''
})

// ---- Animation --------------------------------------------------------------------------------

let frame = 0
let timer: ReturnType<typeof setTimeout> | undefined

function stop() {
  cancelAnimationFrame(frame)
  clearTimeout(timer)
}

function edgeBetween(from: string, to: string) {
  return layout.value.edges.find((e) => e.from === from && e.to === to)
}

function length(a: LoopPoint, b: LoopPoint) {
  return Math.hypot(b[0] - a[0], b[1] - a[1])
}

function pointAlong(points: LoopPoint[], distance: number): LoopPoint {
  let remaining = distance
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!
    const b = points[i]!
    const segment = length(a, b)
    if (remaining <= segment) {
      const r = segment === 0 ? 1 : remaining / segment
      return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]
    }
    remaining -= segment
  }
  return points.at(-1)!
}

function finish() {
  stop()
  at.value = steps.value.length - 1
  dot.value = null
  activeEdge.value = null
  playing.value = false
  asking.value = false
  if (!finished.value) {
    finished.value = true
    emit('done')
  }
}

/** Moves the dot to the next step, then calls `then`. */
function hop(then: () => void) {
  const next = steps.value[at.value + 1]
  if (!next) return finish()
  const edge = edgeBetween(step.value.node, next.node)
  const arrive = () => {
    dot.value = null
    activeEdge.value = null
    at.value += 1
    then()
  }
  if (!edge || reduceMotion.value === 'reduce') return arrive()
  const total = edge.points.slice(1).reduce((sum, p, i) => sum + length(edge.points[i]!, p), 0)
  const speed = fast.value ? 0.9 : 0.45 // px per ms
  const startTime = performance.now()
  activeEdge.value = `${edge.from}>${edge.to}`
  const tick = (now: number) => {
    const travelled = (now - startTime) * speed
    dot.value = pointAlong(edge.points, Math.min(total, travelled))
    if (travelled < total) frame = requestAnimationFrame(tick)
    else arrive()
  }
  frame = requestAnimationFrame(tick)
}

function pauseFor(s: { check?: boolean }) {
  if (s.check === undefined) return fast.value ? 60 : 140
  return fast.value ? 260 : 520
}

function advance() {
  if (!playing.value) return
  if (at.value >= steps.value.length - 1) return finish()
  if (props.mode === 'trace' && pendingStep.value?.check !== undefined) {
    asking.value = true
    playing.value = false
    return
  }
  hop(() => {
    timer = setTimeout(advance, pauseFor(step.value))
  })
}

function play() {
  if (finished.value) restart()
  playing.value = true
  advance()
}

function pause() {
  playing.value = false
  stop()
  dot.value = null
  activeEdge.value = null
}

function stepOnce() {
  if (playing.value || asking.value) return
  if (props.mode === 'trace' && pendingStep.value?.check !== undefined) {
    asking.value = true
    return
  }
  hop(() => {
    if (at.value >= steps.value.length - 1) finish()
  })
}

function answer(guess: boolean) {
  const next = pendingStep.value
  if (!asking.value || !next) return
  if (guess !== next.check) {
    wrongGuess.value = true
    emit('mistake')
    return
  }
  wrongGuess.value = false
  asking.value = false
  playing.value = true
  hop(() => {
    timer = setTimeout(advance, pauseFor(step.value))
  })
}

function restart() {
  stop()
  at.value = 0
  dot.value = null
  activeEdge.value = null
  finished.value = false
  asking.value = false
  wrongGuess.value = false
  playing.value = false
}

function skip() {
  finish()
}

defineExpose({ play, pause, skip, restart, playing, finished, fast })
onBeforeUnmount(stop)
watch(() => props.program, restart)

// ---- Drawing helpers --------------------------------------------------------------------------

function hexagon(box: LoopBox) {
  const { x, y, width, height } = box
  const half = width / 2
  const tip = 16
  return [
    [x - half, y],
    [x - half + tip, y - height / 2],
    [x + half - tip, y - height / 2],
    [x + half, y],
    [x + half - tip, y + height / 2],
    [x - half + tip, y + height / 2]
  ]
    .map((p) => p.join(','))
    .join(' ')
}

function boxText(box: LoopBox) {
  if (box.kind === 'start') return t('game.flow.start')
  if (box.kind === 'end') return t('lesson.loop.end')
  return box.text
}
</script>

<template>
  <div class="loop-board" :class="{ 'loop-board--asking': asking }">
    <div class="loop-board__chart-wrap">
      <svg
        class="loop-board__chart"
        :viewBox="`0 0 ${layout.width} ${layout.height}`"
        :style="{ maxWidth: `${Math.round(layout.width * 1.15)}px` }"
        role="img"
        :aria-label="t('lesson.loop.chartLabel')"
      >
        <defs>
          <marker
            id="loop-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="12"
            markerHeight="12"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" class="loop-board__arrow" />
          </marker>
        </defs>

        <g v-for="edge in layout.edges" :key="`${edge.from}>${edge.to}`">
          <polyline
            class="edge"
            :class="{ 'edge--active': activeEdge === `${edge.from}>${edge.to}` }"
            :points="edge.points.map((p) => p.join(',')).join(' ')"
            marker-end="url(#loop-arrow)"
          />
          <text
            v-if="edge.label && edge.labelAt"
            class="edge__label"
            :class="edge.label === 'True' ? 'edge__label--yes' : 'edge__label--no'"
            :x="edge.labelAt[0]"
            :y="edge.labelAt[1]"
            text-anchor="middle"
          >
            {{ edge.label }}
          </text>
        </g>

        <circle v-if="dot" class="loop-board__dot" :cx="dot[0]" :cy="dot[1]" r="8" />

        <g
          v-for="box in layout.boxes"
          :key="box.id"
          class="box"
          :class="[
            `box--${box.kind}`,
            {
              'box--current': step.node === box.id && !finished,
              'box--visited': visits.has(box.id)
            }
          ]"
        >
          <polygon v-if="box.kind === 'check'" class="box__shape" :points="hexagon(box)" />
          <rect
            v-else
            class="box__shape"
            :x="box.x - box.width / 2"
            :y="box.y - box.height / 2"
            :width="box.width"
            :height="box.height"
            :rx="
              box.kind === 'start' || box.kind === 'end' || box.kind === 'jump' ? box.height / 2 : 8
            "
          />
          <text class="box__text" :x="box.x" :y="box.y" text-anchor="middle" dy="0.35em">
            {{ boxText(box) }}
          </text>
          <g
            v-if="(box.kind === 'stmt' || box.kind === 'check') && (visits.get(box.id) ?? 0) > 0"
            class="box__count"
          >
            <rect
              :x="box.x - box.width / 2 - 14"
              :y="box.y - box.height / 2 - 10"
              width="30"
              height="20"
              rx="10"
            />
            <text
              :x="box.x - box.width / 2 + 1"
              :y="box.y - box.height / 2"
              text-anchor="middle"
              dy="0.35em"
            >
              ×{{ visits.get(box.id) }}
            </text>
          </g>
        </g>

        <g
          v-if="verdict"
          :key="`${verdict.node}-${at}`"
          class="verdict"
          :class="verdict.value ? 'verdict--yes' : 'verdict--no'"
        >
          <rect
            :x="boxes.get(verdict.node)!.x + boxes.get(verdict.node)!.width / 2 - 52"
            :y="boxes.get(verdict.node)!.y - boxes.get(verdict.node)!.height / 2 - 22"
            width="54"
            height="20"
            rx="10"
          />
          <text
            :x="boxes.get(verdict.node)!.x + boxes.get(verdict.node)!.width / 2 - 25"
            :y="boxes.get(verdict.node)!.y - boxes.get(verdict.node)!.height / 2 - 12"
            text-anchor="middle"
            dy="0.35em"
          >
            {{ verdict.value ? 'True' : 'False' }}
          </text>
        </g>
      </svg>
    </div>

    <aside class="loop-board__side">
      <p class="loop-board__pass" :class="{ 'loop-board__pass--idle': step.pass === 0 }">
        {{ step.pass > 0 ? t('lesson.loop.pass', { n: step.pass }) : t('lesson.loop.notStarted') }}
      </p>
      <div class="panel">
        <p class="panel__title">{{ t('lesson.loop.variables') }}</p>
        <p v-if="!variables.length" class="panel__empty">{{ t('lesson.loop.noVariables') }}</p>
        <dl v-else class="vars">
          <div
            v-for="v in variables"
            :key="`${v.name}-${v.changed ? at : 'same'}`"
            class="vars__row"
            :class="{ 'vars__row--changed': v.changed }"
          >
            <dt>{{ v.name }}</dt>
            <dd>{{ v.value }}</dd>
          </div>
        </dl>
      </div>
      <div class="panel panel--console">
        <p class="panel__title">{{ t('lesson.loop.output') }}</p>
        <p v-if="!step.output.length" class="panel__empty">{{ t('lesson.loop.noOutput') }}</p>
        <ol v-else class="console">
          <li
            v-for="(line, i) in step.output"
            :key="i"
            :class="{
              console__new:
                i === step.output.length - 1 && step.output.length !== prevStep.output.length
            }"
          >
            {{ line }}
          </li>
        </ol>
      </div>
    </aside>

    <div v-if="asking" class="loop-board__ask" role="group" :aria-label="question">
      <p>
        <strong>{{ question }}</strong>
        <span v-if="wrongGuess" class="loop-board__hint">{{ t('lesson.loop.tryAgainHint') }}</span>
      </p>
      <div class="loop-board__ask-buttons">
        <a-button class="ask ask--yes" @click="answer(true)">True</a-button>
        <a-button class="ask ask--no" @click="answer(false)">False</a-button>
      </div>
    </div>

    <div class="loop-board__controls">
      <slot
        name="controls"
        :play="play"
        :pause="pause"
        :step="stepOnce"
        :restart="restart"
        :skip="skip"
        :playing="playing"
        :finished="finished"
        :asking="asking"
        :fast="fast"
        :toggle-fast="() => (fast = !fast)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';

.loop-board {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 14px;

  @include mobile {
    grid-template-columns: minmax(0, 1fr);
  }

  &__chart-wrap {
    min-width: 0;
    overflow-x: auto;
    padding: 10px;
    border-radius: $radius;
    background: $color-paper;
  }

  &__chart {
    display: block;
    width: 100%;
    height: auto;
    margin: 0 auto;
    font-family: $font-mono;
    font-variant-ligatures: none;
  }

  &__arrow {
    fill: $color-muted;
  }

  &__dot {
    fill: var(--accent, #{$color-blue});
    stroke: #fff;
    stroke-width: 3;
    filter: drop-shadow(0 0 6px var(--accent, #{$color-blue}));
  }

  &__pass {
    align-self: flex-start;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    background: var(--accent, #{$color-blue});

    &--idle {
      color: $color-muted;
      background: $color-line;
    }
  }

  &__side {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  &__ask,
  &__controls {
    grid-column: 1 / -1;
  }

  &__ask {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-radius: $radius;
    border: 2px solid $color-amber;
    background: $color-tint;
    animation: pulse 1.2s ease-in-out infinite;

    p {
      display: flex;
      flex-direction: column;
      gap: 4px;
      color: $color-ink;
    }
  }

  &__hint {
    font-size: 14px;
    color: $color-red;
  }

  &__ask-buttons {
    display: flex;
    gap: 10px;
  }

  &__controls:empty {
    display: none;
  }
}

.ask {
  min-width: 96px;
  font-weight: 700;

  &--yes {
    border-color: $color-green;
    color: $color-green;
  }

  &--no {
    border-color: $color-red;
    color: $color-red;
  }
}

.edge {
  fill: none;
  stroke: $color-muted;
  stroke-width: 2;
  transition: stroke 150ms;

  &--active {
    stroke: var(--accent, #{$color-blue});
    stroke-width: 4;
  }

  &__label {
    font-family: $font-sans;
    font-size: 12px;
    font-weight: 700;

    &--yes {
      fill: $color-green;
    }

    &--no {
      fill: $color-red;
    }
  }
}

.box {
  &__shape {
    stroke-width: 2;
    transition:
      fill 150ms,
      stroke 150ms;
  }

  &__text {
    font-size: 13.5px;
    pointer-events: none;
  }

  &--start &__shape,
  &--end &__shape {
    fill: $color-navy;
    stroke: $color-navy;
  }

  &--start &__text,
  &--end &__text {
    font-family: $font-sans;
    font-weight: 700;
    fill: #fff;
  }

  &--check &__shape {
    fill: var(--accent, #{$color-blue});
    stroke: var(--accent, #{$color-blue});
  }

  &--check &__text {
    fill: #fff;
    font-weight: 600;
  }

  &--stmt &__shape {
    fill: #fff;
    stroke: $color-blue;
  }

  &--stmt &__text {
    fill: $color-ink;
  }

  &--jump &__shape {
    fill: color.mix($color-amber, #fff, 30%);
    stroke: $color-amber-ink;
  }

  &--jump &__text {
    fill: $color-amber-ink;
    font-weight: 700;
  }

  &--current &__shape {
    stroke: $color-amber;
    stroke-width: 4;
  }

  &--stmt.box--current &__shape {
    fill: color.mix($color-amber, #fff, 18%);
  }

  &__count {
    rect {
      fill: $color-ink;
    }

    text {
      font-family: $font-sans;
      font-size: 11px;
      font-weight: 700;
      fill: #fff;
    }
  }
}

.verdict {
  animation: pop 250ms ease-out;
  transform-box: fill-box;
  transform-origin: center;

  text {
    font-family: $font-sans;
    font-size: 11.5px;
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

.panel {
  padding: 12px 14px;
  border-radius: $radius-sm;
  border: 1px solid $color-line;
  background: $color-card;

  &__title {
    @include eyebrow($color-muted);

    font-size: 11px;
    margin-bottom: 8px;
  }

  &__empty {
    font-size: 13px;
    color: $color-muted;
    font-style: italic;
  }

  &--console {
    background: $code-bg;
    border-color: $code-bg;

    .panel__title {
      color: $code-com;
    }

    .panel__empty {
      color: $code-com;
    }
  }
}

.vars {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  font-family: $font-mono;
  font-size: 14px;

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 3px 8px;
    border-radius: 6px;

    dt {
      color: $color-body;
    }

    dd {
      margin: 0;
      font-weight: 600;
      color: $color-ink;
      text-align: right;
      overflow-wrap: anywhere;
    }

    &--changed {
      animation: flash 900ms ease-out;
    }
  }
}

.console {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: $font-mono;
  font-size: 14px;
  color: $code-fg;
  max-height: 180px;
  overflow-y: auto;

  li {
    white-space: pre-wrap;
  }

  &__new {
    animation: type-in 400ms ease-out;
    color: $code-str;
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

@keyframes flash {
  from {
    background: color.mix($color-amber, #fff, 60%);
  }

  to {
    background: transparent;
  }
}

@keyframes type-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes pulse {
  50% {
    box-shadow: 0 0 0 4px rgba($color-amber, 0.25);
  }
}

@media (prefers-reduced-motion: reduce) {
  .verdict,
  .vars__row--changed,
  .console__new,
  .loop-board__ask {
    animation: none;
  }
}
</style>
