<script setup lang="ts">
import Routes from '@/router/uri.route'

const { t } = useI18n()
const route = useRoute()
const progress = useProgressStore()
const { teacherMode } = storeToRefs(progress)

const activeKey = computed(() => {
  if (route.meta.menuKey !== Routes.LESSON.menuKey) return route.meta.menuKey
  return String(route.params.lessonId).startsWith('ds-') ? 'data-science' : Routes.LESSON.menuKey
})

const links = computed(() => [
  { key: Routes.HOME.menuKey, label: t('nav.home'), to: { name: Routes.HOME.name } },
  {
    key: Routes.LESSON.menuKey,
    label: t('nav.lessons'),
    to: { name: Routes.LESSON.name, params: { lessonId: 'day-1' } }
  },
  {
    key: 'data-science',
    label: t('nav.dataScience'),
    to: { name: Routes.LESSON.name, params: { lessonId: 'ds-1' } }
  },
  { key: Routes.GAMES.menuKey, label: t('nav.games'), to: { name: Routes.GAMES.name } },
  {
    key: Routes.PLAYGROUND.menuKey,
    label: t('nav.playground'),
    to: { name: Routes.PLAYGROUND.name }
  }
])
</script>

<template>
  <header class="nav">
    <div class="nav__inner container">
      <RouterLink :to="{ name: Routes.HOME.name }" class="nav__brand">
        <span class="nav__logo">py</span>
        <span class="nav__name">{{ t('app.name') }}</span>
      </RouterLink>

      <nav class="nav__links">
        <RouterLink
          v-for="link in links"
          :key="link.key"
          :to="link.to"
          class="nav__link"
          :class="{ 'nav__link--active': activeKey === link.key }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <label class="nav__teacher">
        <a-switch v-model:checked="teacherMode" size="small" />
        <span>{{ t('common.teacherMode') }}</span>
      </label>
    </div>
  </header>
</template>

<style scoped lang="scss">
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  height: $nav-height;
  background: rgba($color-paper, 0.88);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $color-line;

  &__inner {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 24px;
    max-width: 1280px;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: $color-ink;
    font-family: $font-display;
    font-weight: 700;
    font-size: 18px;
  }

  &__logo {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: $color-ink;
    color: $color-amber;
    font-family: $font-mono;
    font-size: 15px;
  }

  &__links {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }

  &__link {
    padding: 8px 14px;
    border-radius: 999px;
    color: $color-body;
    font-weight: 500;

    &:hover {
      color: $color-ink;
      background: rgba($color-ink, 0.06);
    }

    &--active {
      color: $color-paper;
      background: $color-ink;

      &:hover {
        color: $color-paper;
        background: $color-ink;
      }
    }
  }

  &__teacher {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: $color-muted;
    cursor: pointer;
  }

  @include mobile {
    &__name,
    &__teacher span {
      display: none;
    }

    &__inner {
      gap: 12px;
    }

    &__link {
      padding: 6px 10px;
      font-size: 14px;
    }
  }
}
</style>
