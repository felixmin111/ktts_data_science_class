<script setup lang="ts">
import { renderInline } from '@/functions/highlight.function'
import type { LessonBlock } from '@/models/lesson.model'

defineProps<{ block: LessonBlock }>()
</script>

<template>
  <div v-if="block.type === 'text'" class="text-block">
    <!-- eslint-disable vue/no-v-html -- renderInline escapes all text -->
    <p v-for="(paragraph, index) in block.body" :key="index" v-html="renderInline(paragraph)" />
    <!-- eslint-enable vue/no-v-html -->
  </div>
  <MemoryGame v-else-if="block.type === 'memory'" />
  <SolutionReveal v-else-if="block.type === 'code' && block.hidden" :title="block.title">
    <CodeRunner
      :code="block.code"
      :title="block.title"
      :expected-output="block.output"
      :stdin="block.stdin"
      :runnable="block.runnable"
    />
  </SolutionReveal>
  <CodeRunner
    v-else-if="block.type === 'code'"
    :code="block.code"
    :title="block.title"
    :expected-output="block.output"
    :stdin="block.stdin"
    :runnable="block.runnable"
    :min-lines="block.runnable && block.code.trim().startsWith('#') ? 6 : 1"
  />
  <AnalogyCard v-else-if="block.type === 'analogy'" :title="block.title" :body="block.body" />
  <InfoTable
    v-else-if="block.type === 'table'"
    :columns="block.columns"
    :rows="block.rows"
    :code-columns="block.codeColumns"
  />
  <CalloutCard
    v-else-if="block.type === 'callout'"
    :tone="block.tone"
    :title="block.title"
    :body="block.body"
  />
  <CaseStudyCard v-else-if="block.type === 'case'" :study="block" />
  <QuizCard v-else-if="block.type === 'quiz'" :quiz="block" />
</template>

<style scoped lang="scss">
.text-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 18px;
  color: $color-body;

  :deep(strong) {
    color: $color-ink;
  }
}
</style>
