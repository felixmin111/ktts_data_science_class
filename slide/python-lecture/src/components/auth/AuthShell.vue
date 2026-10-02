<script setup lang="ts">
import Routes from '@/router/uri.route'

defineProps<{ title: string; subtitle: string }>()
const { t } = useI18n()
</script>

<template>
  <div class="auth">
    <header class="auth__top">
      <RouterLink :to="{ name: Routes.LOGIN.name }" class="auth__brand">
        <span class="auth__logo">py</span>
        <span>{{ t('app.name') }}</span>
      </RouterLink>
      <LanguageSwitcher />
    </header>

    <main class="auth__card">
      <h1>{{ title }}</h1>
      <p class="auth__subtitle">{{ subtitle }}</p>
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.auth {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 64px;
  background: radial-gradient(circle at 85% 20%, #1d3a66 0%, $color-navy 60%);

  &__top {
    width: 100%;
    max-width: 960px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: $color-paper;
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
    background: $color-amber;
    color: $color-ink;
    font-family: $font-mono;
    font-size: 15px;
  }

  &__card {
    width: 100%;
    max-width: 420px;
    margin-top: 10vh;
    padding: 32px;
    border-radius: $radius-lg;
    background: $color-card;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);

    @include mobile {
      padding: 24px 20px;
    }
  }

  &__subtitle {
    margin: 8px 0 24px;
    color: $color-muted;
  }
}
</style>
