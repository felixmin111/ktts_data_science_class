<script setup lang="ts">
import { findLesson, lessonLabel } from '@/data/lessons'
import Routes from '@/router/uri.route'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const progress = useProgressStore()
const { teacherMode } = storeToRefs(progress)

const lesson = computed(() => findLesson(String(route.params.lessonId)))
const sections = computed(() => lesson.value?.sections ?? [])
const sectionIndex = computed(() => {
  const found = sections.value.findIndex((section) => section.id === route.params.sectionId)
  return found >= 0 ? found : 0
})
const section = computed(() => sections.value[sectionIndex.value])
const prev = computed(() => sections.value[sectionIndex.value - 1])
const next = computed(() => sections.value[sectionIndex.value + 1])
const percent = computed(() =>
  lesson.value ? progress.percent(lesson.value.id, sections.value.length) : 0
)

watch(
  section,
  (current) => {
    if (lesson.value && current) progress.markVisited(lesson.value.id, current.id)
  },
  { immediate: true }
)

function go(sectionId: string | undefined) {
  if (!sectionId || !lesson.value) return
  router.push({ name: Routes.LESSON.name, params: { lessonId: lesson.value.id, sectionId } })
  window.scrollTo({ top: 0 })
}

onKeyStroke(['ArrowLeft', 'ArrowRight'], (event) => {
  const target = event.target as HTMLElement | null
  if (target?.closest('textarea, input')) return
  go(event.key === 'ArrowRight' ? next.value?.id : prev.value?.id)
})
</script>

<template>
  <div v-if="lesson && section" class="lesson container">
    <aside class="lesson__toc">
      <p class="lesson__toc-title">{{ lessonLabel(lesson) }} · {{ lesson.title }}</p>
      <a-progress :percent="percent" size="small" stroke-color="#2A62A6" />
      <ol>
        <li v-for="(item, index) in sections" :key="item.id">
          <RouterLink
            :to="{ name: Routes.LESSON.name, params: { lessonId: lesson.id, sectionId: item.id } }"
            :class="{
              active: index === sectionIndex,
              visited: progress.visited[lesson.id]?.includes(item.id)
            }"
          >
            <span class="num">{{ index + 1 }}</span>
            <span>{{ item.title }}</span>
          </RouterLink>
        </li>
      </ol>
      <a-button type="link" size="small" @click="progress.reset(lesson.id)">
        {{ t('lesson.resetProgress') }}
      </a-button>
    </aside>

    <article class="lesson__body">
      <header class="lesson__header">
        <p class="lesson__eyebrow">
          {{ String(sectionIndex + 1).padStart(2, '0') }} · {{ section.eyebrow }}
          <span v-if="section.minutes"> · {{ t('common.minutes', { n: section.minutes }) }}</span>
        </p>
        <h1>{{ section.title }}</h1>
      </header>

      <a-alert
        v-if="teacherMode && section.notes"
        type="warning"
        show-icon
        :message="t('lesson.teacherNotes')"
        :description="section.notes"
        class="lesson__notes"
      />

      <LessonBlockRenderer
        v-for="(block, index) in section.blocks"
        :key="`${section.id}-${index}`"
        :block="block"
      />

      <div v-if="!next" class="lesson__done">
        <IconMdiPartyPopper class="lesson__done-icon" />
        <p>{{ t('lesson.finished') }}</p>
        <RouterLink :to="{ name: Routes.GAMES.name }">
          <a-button type="primary">{{ t('lesson.playGame') }}</a-button>
        </RouterLink>
      </div>

      <nav class="lesson__pager">
        <a-button :disabled="!prev" size="large" @click="go(prev?.id)">
          <template #icon><IconMdiArrowLeft /></template>
          {{ prev?.title ?? t('common.previous') }}
        </a-button>
        <a-button v-if="next" type="primary" size="large" @click="go(next.id)">
          {{ next.title }}
          <IconMdiArrowRight class="lesson__arrow" />
        </a-button>
      </nav>
    </article>
  </div>

  <div v-else class="container lesson__missing">
    <a-result status="404" :title="t('lesson.notFound')">
      <template #extra>
        <RouterLink :to="{ name: Routes.HOME.name }">
          <a-button type="primary">{{ t('notFound.home') }}</a-button>
        </RouterLink>
      </template>
    </a-result>
  </div>
</template>

<style scoped lang="scss">
.lesson {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 40px;
  max-width: 1280px;
  padding-top: 32px;

  @include mobile {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  &__toc {
    position: sticky;
    top: calc(#{$nav-height} + 24px);
    align-self: start;
    max-height: calc(100vh - #{$nav-height} - 48px);
    overflow-y: auto;

    @include mobile {
      position: static;
      max-height: none;

      ol {
        display: none;
      }
    }

    ol {
      margin: 12px 0;
      padding: 0;
      list-style: none;
    }

    a {
      display: flex;
      gap: 10px;
      padding: 7px 10px;
      border-radius: $radius-sm;
      color: $color-body;
      font-size: 14px;
      line-height: 1.35;

      &:hover {
        background: rgba($color-ink, 0.05);
        color: $color-ink;
      }

      &.active {
        background: $color-ink;
        color: $color-paper;

        .num {
          background: $color-amber;
          color: $color-ink;
        }
      }

      &.visited:not(.active) .num {
        background: rgba($color-blue, 0.15);
        color: $color-blue;
      }
    }

    .num {
      display: grid;
      place-items: center;
      flex: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: $color-line;
      font-size: 11px;
      font-weight: 700;
    }
  }

  &__toc-title {
    font-family: $font-display;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 6px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 22px;
    min-width: 0;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__header h1 {
    margin-top: 8px;
    font-size: clamp(30px, 4vw, 44px);
  }

  &__notes {
    border-radius: $radius;
  }

  &__done {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 28px;
    border-radius: $radius;
    background: rgba($color-green, 0.08);
    font-size: 18px;
    font-weight: 600;
  }

  &__done-icon {
    font-size: 40px;
    color: $color-green;
  }

  &__pager {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    padding-top: 20px;
    border-top: 1px solid $color-line;

    :deep(.ant-btn) {
      max-width: 48%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
  }

  &__missing {
    padding-top: 48px;
  }
}
</style>
