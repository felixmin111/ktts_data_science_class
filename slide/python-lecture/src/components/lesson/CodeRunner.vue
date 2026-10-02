<script setup lang="ts">
import { highlightPython } from '@/functions/highlight.function'
import type { RunResult } from '@/models/python.model'

const props = withDefaults(
  defineProps<{
    code: string
    title?: string
    expectedOutput?: string
    stdin?: string[]
    runnable?: boolean
    minLines?: number
  }>(),
  { title: undefined, expectedOutput: undefined, stdin: () => [], runnable: false, minLines: 1 }
)

const { t } = useI18n()
const { status, loadingPackages, run } = usePyodide()
const { copy, copied } = useClipboard()

const source = ref(props.code)
const stdinText = ref(props.stdin.join('\n'))
const result = ref<RunResult | null>(null)
const running = ref(false)
const loadFailed = ref(false)
const usesInput = computed(() => /\binput\s*\(/.test(source.value))
const highlighted = computed(() => highlightPython(source.value) + '\n')
const rows = computed(() => Math.max(props.minLines, source.value.split('\n').length))

watch(
  () => props.code,
  (code) => {
    source.value = code
    result.value = null
  }
)

async function onRun() {
  running.value = true
  loadFailed.value = false
  try {
    const lines = stdinText.value === '' ? [] : stdinText.value.split('\n')
    result.value = await run(source.value, lines)
  } catch {
    loadFailed.value = true
  } finally {
    running.value = false
  }
}

function onReset() {
  source.value = props.code
  stdinText.value = props.stdin.join('\n')
  result.value = null
}

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLTextAreaElement
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault()
    onRun()
  } else if (event.key === 'Tab' && !event.shiftKey) {
    event.preventDefault()
    const { selectionStart, selectionEnd } = target
    source.value = `${source.value.slice(0, selectionStart)}    ${source.value.slice(selectionEnd)}`
    nextTick(() => target.setSelectionRange(selectionStart + 4, selectionStart + 4))
  }
}
</script>

<template>
  <div class="runner">
    <div class="runner__bar">
      <span class="runner__title">{{ title ?? 'main.py' }}</span>
      <div class="runner__actions">
        <a-button size="small" type="text" class="runner__ghost" @click="copy(source)">
          {{ copied ? t('code.copied') : t('code.copy') }}
        </a-button>
        <template v-if="runnable">
          <a-button
            v-if="source !== code"
            size="small"
            type="text"
            class="runner__ghost"
            @click="onReset"
          >
            {{ t('code.reset') }}
          </a-button>
          <a-button size="small" class="runner__run" :loading="running" @click="onRun">
            <template #icon><IconMdiPlay /></template>
            {{ running ? t('code.running') : t('code.run') }}
          </a-button>
        </template>
      </div>
    </div>

    <div class="runner__editor" :style="{ '--rows': rows }">
      <!-- eslint-disable-next-line vue/no-v-html -- highlightPython escapes all source text -->
      <pre class="runner__code" aria-hidden="true" v-html="highlighted" />
      <textarea
        v-if="runnable"
        v-model="source"
        class="runner__input"
        spellcheck="false"
        autocapitalize="off"
        autocomplete="off"
        :aria-label="t('code.ariaLabel')"
        @keydown="onKeydown"
      />
    </div>

    <div v-if="runnable && usesInput" class="runner__stdin">
      <label>{{ t('code.input') }}</label>
      <a-textarea v-model:value="stdinText" :auto-size="{ minRows: 1, maxRows: 6 }" />
    </div>

    <div v-if="running && status === 'loading'" class="runner__panel runner__panel--muted">
      {{ t('code.loadingPython') }}
    </div>
    <div v-else-if="running && loadingPackages.length" class="runner__panel runner__panel--muted">
      {{ t('code.loadingPackages', { names: loadingPackages.join(', ') }) }}
    </div>
    <div v-else-if="loadFailed" class="runner__panel runner__panel--error">
      {{ t('code.pythonFailed') }}
    </div>
    <div v-else-if="result" class="runner__panel">
      <span class="runner__label">
        {{ t('code.output') }} · {{ Math.round(result.durationMs) }} ms
      </span>
      <pre class="runner__out">{{
        result.output || (result.error || result.images.length ? '' : t('code.noOutput'))
      }}</pre>
      <pre v-if="result.error" class="runner__out runner__out--error">{{ result.error }}</pre>
      <img
        v-for="(image, index) in result.images"
        :key="index"
        :src="`data:image/png;base64,${image}`"
        :alt="`Chart ${index + 1} produced by the code`"
        class="runner__chart"
      />
    </div>
    <div v-else-if="expectedOutput" class="runner__panel runner__panel--expected">
      <span class="runner__label">{{ t('code.expected') }}</span>
      <pre class="runner__out">{{ expectedOutput }}</pre>
    </div>
  </div>
</template>

<style scoped lang="scss">
$line: 1.6;
$pad: 18px;

.runner {
  border-radius: $radius;
  overflow: hidden;
  background: $code-bg;
  box-shadow: 0 8px 24px rgba($color-navy, 0.12);

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px 8px 18px;
    background: #0d182b;
  }

  &__title {
    font-family: $font-mono;
    font-size: 13px;
    color: $code-com;
  }

  &__actions {
    display: flex;
    gap: 6px;
  }

  &__ghost {
    color: $code-com;

    &:hover {
      color: $code-fg !important;
    }
  }

  &__run {
    background: $color-amber;
    border-color: $color-amber;
    color: $color-ink;
    font-weight: 600;

    &:hover {
      background: #f5c55a !important;
      border-color: #f5c55a !important;
      color: $color-ink !important;
    }
  }

  &__editor {
    position: relative;
    min-height: calc(var(--rows) * 1em * #{$line} + #{$pad} * 2);
    font-family: $font-mono;
    font-size: 15px;
  }

  &__code,
  &__input {
    margin: 0;
    padding: $pad 20px;
    font: inherit;
    line-height: $line;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    tab-size: 4;
  }

  &__code {
    color: $code-fg;

    :deep(.tok-str) {
      color: $code-str;
    }

    :deep(.tok-num) {
      color: $code-num;
    }

    :deep(.tok-com) {
      color: $code-com;
      font-style: italic;
    }

    :deep(.tok-fn) {
      color: $code-fn;
    }

    :deep(.tok-kw) {
      color: $code-kw;
    }
  }

  &__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    resize: none;
    border: 0;
    outline: none;
    background: transparent;
    color: transparent;
    caret-color: $color-amber;

    &::selection {
      background: rgba($color-amber, 0.3);
    }
  }

  &__stdin {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 20px 16px;
    border-top: 1px solid rgba(#fff, 0.08);

    label {
      font-size: 12px;
      color: $code-com;
    }

    :deep(textarea) {
      font-family: $font-mono;
    }
  }

  &__panel {
    padding: 14px 20px 18px;
    background: $color-card;
    border-top: 3px solid $color-amber;

    &--muted {
      color: $color-muted;
    }

    &--error {
      color: $color-red;
    }

    &--expected {
      border-top-color: $color-line;
      background: #f3efe5;
    }
  }

  &__label {
    @include eyebrow($color-muted);

    font-size: 11px;
  }

  &__chart {
    display: block;
    max-width: 100%;
    margin-top: 12px;
    border-radius: $radius-sm;
    background: #fff;
  }

  &__out {
    margin: 6px 0 0;
    font-family: $font-mono;
    font-size: 15px;
    line-height: 1.55;
    white-space: pre;
    overflow-x: auto;
    color: $color-ink;

    &--error {
      color: $color-red;
      font-weight: 600;
    }
  }
}
</style>
