<script setup lang="ts">
import { getTracks, lessonLabel, lessonsInTrack } from '@/data/lessons'
import Routes from '@/router/uri.route'

const { t } = useI18n()
const progress = useProgressStore()
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__text">
          <p class="hero__pill">{{ t('home.pill') }}</p>
          <h1>{{ t('home.heroTitle') }}</h1>
          <p class="hero__body">{{ t('home.heroBody') }}</p>
          <div class="hero__actions">
            <RouterLink :to="{ name: Routes.LESSON.name, params: { lessonId: 'day-1' } }">
              <a-button type="primary" size="large" class="hero__primary">
                {{ t('home.startDay1') }}
              </a-button>
            </RouterLink>
            <RouterLink :to="{ name: Routes.LESSON.name, params: { lessonId: 'ds-1' } }">
              <a-button size="large" ghost>{{ t('home.startDataScience') }}</a-button>
            </RouterLink>
            <RouterLink :to="{ name: Routes.GAMES.name }">
              <a-button size="large" ghost>{{ t('home.playGames') }}</a-button>
            </RouterLink>
          </div>
        </div>
        <pre
          class="hero__code"
        ><span class="c">&gt;&gt;&gt;</span> name = <span class="s">"Neo"</span>
<span class="c">&gt;&gt;&gt;</span> <span class="f">print</span>(<span class="s">f"Hello, {name}!"</span>)
Hello, Neo!
<span class="c">&gt;&gt;&gt;</span> df.<span class="f">groupby</span>(<span class="s">"branch"</span>)[<span class="s">"revenue"</span>].<span class="f">sum</span>()
Campus        6155
Downtown     14810
Riverside     7795</pre>
      </div>
    </section>

    <section v-for="track in getTracks()" :key="track.id" class="container block">
      <h2>{{ track.title }}</h2>
      <p class="block__lead">{{ track.description }}</p>
      <div class="grid">
        <component
          :is="lesson.available ? 'RouterLink' : 'div'"
          v-for="lesson in lessonsInTrack(track.id)"
          :key="lesson.id"
          :to="
            lesson.available
              ? { name: Routes.LESSON.name, params: { lessonId: lesson.id } }
              : undefined
          "
          class="lesson-card"
          :class="{ 'lesson-card--locked': !lesson.available }"
        >
          <div class="lesson-card__top">
            <span class="lesson-card__day">{{ lessonLabel(lesson) }}</span>
            <a-tag v-if="!lesson.available">{{ t('common.comingSoon') }}</a-tag>
            <span v-else class="lesson-card__min">
              {{ t('common.minutes', { n: lesson.durationMinutes }) }}
            </span>
          </div>
          <h3>{{ lesson.title }}</h3>
          <p class="lesson-card__summary">{{ lesson.summary }}</p>
          <div class="lesson-card__topics">
            <a-tag v-for="topic in lesson.topics" :key="topic">{{ topic }}</a-tag>
          </div>
          <template v-if="lesson.available">
            <a-progress
              :percent="progress.percent(lesson.id, lesson.sections.length)"
              :show-info="false"
              stroke-color="#2A62A6"
              size="small"
            />
            <span class="lesson-card__min">
              {{ t('home.progress', { n: progress.percent(lesson.id, lesson.sections.length) }) }}
            </span>
          </template>
        </component>
      </div>
    </section>

    <section class="container block">
      <h2>{{ t('home.gamesTitle') }}</h2>
      <GamesByTrack />
    </section>
  </div>
</template>

<style scoped lang="scss">
.hero {
  background: radial-gradient(circle at 85% 30%, #1d3a66 0%, $color-navy 55%);
  color: $color-paper;
  padding: 72px 0;

  &__inner {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 48px;
    align-items: center;
    max-width: 1180px;

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__pill {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    background: $color-amber;
    color: $color-ink;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
  }

  h1 {
    margin-top: 18px;
    color: $color-paper;
    font-size: clamp(40px, 6vw, 64px);
  }

  &__body {
    margin-top: 16px;
    font-size: 19px;
    color: #bfcbdc;
    max-width: 560px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  &__primary {
    background: $color-amber;
    border-color: $color-amber;
    color: $color-ink;
    font-weight: 600;

    &:hover {
      background: #f5c55a !important;
      color: $color-ink !important;
    }
  }

  &__code {
    margin: 0;
    padding: 24px 28px;
    border-radius: $radius-lg;
    background: $code-bg;
    border: 1px solid rgba(#fff, 0.08);
    color: $code-fg;
    font-size: 16px;
    line-height: 1.8;
    white-space: pre-wrap;

    .c {
      color: $code-com;
    }

    .s {
      color: $code-str;
    }

    .f {
      color: $code-fn;
    }

    .n {
      color: $code-num;
    }
  }
}

.block {
  margin-top: 56px;
  max-width: 1180px;

  h2 {
    font-size: 30px;
  }

  &__lead {
    margin: 6px 0 20px;
    color: $color-body;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.lesson-card {
  @include card;

  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px;
  color: $color-ink;
  transition:
    transform 160ms,
    box-shadow 160ms;

  &:not(&--locked):hover {
    color: $color-ink;
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba($color-navy, 0.1);
  }

  &--locked {
    opacity: 0.6;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__day {
    @include eyebrow;
  }

  h3 {
    font-size: 21px;
  }

  &__summary {
    color: $color-body;
  }

  &__topics {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 0;
  }

  &__min {
    font-size: 13px;
    color: $color-muted;
  }
}
</style>
