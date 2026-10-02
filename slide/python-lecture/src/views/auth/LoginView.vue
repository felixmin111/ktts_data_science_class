<script setup lang="ts">
import { apiErrorCode } from '@/config/http-client'
import { safeRedirect } from '@/functions/redirect.function'
import Routes from '@/router/uri.route'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const submitting = ref(false)
const errorCode = ref('')
const sessionExpired = computed(() => route.query.expired === '1')

async function onSubmit() {
  submitting.value = true
  errorCode.value = ''
  try {
    await auth.login({ email: form.email, password: form.password })
    await router.replace(safeRedirect(route.query))
  } catch (error) {
    errorCode.value = apiErrorCode(error)
    form.password = ''
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AuthShell :title="t('auth.login.title')" :subtitle="t('auth.login.subtitle')">
    <a-alert
      v-if="sessionExpired && !errorCode"
      type="info"
      show-icon
      :message="t('auth.sessionExpired')"
      class="auth-form__alert"
    />
    <a-alert
      v-if="errorCode"
      type="error"
      show-icon
      :message="t(`errors.${errorCode}`)"
      class="auth-form__alert"
    />

    <a-form layout="vertical" :model="form" :disabled="submitting" @finish="onSubmit">
      <a-form-item
        :label="t('auth.email')"
        name="email"
        :rules="[{ required: true, type: 'email', message: t('auth.validation.email') }]"
      >
        <a-input v-model:value="form.email" autocomplete="email" size="large" />
      </a-form-item>
      <a-form-item
        :label="t('auth.password')"
        name="password"
        :rules="[{ required: true, message: t('auth.validation.required') }]"
      >
        <a-input-password
          v-model:value="form.password"
          autocomplete="current-password"
          size="large"
        />
      </a-form-item>
      <a-button type="primary" html-type="submit" size="large" block :loading="submitting">
        {{ t('auth.login.submit') }}
      </a-button>
    </a-form>

    <p class="auth-form__switch">
      {{ t('auth.login.noAccount') }}
      <RouterLink :to="{ name: Routes.REGISTER.name, query: route.query }">
        {{ t('auth.login.toRegister') }}
      </RouterLink>
    </p>
  </AuthShell>
</template>

<style scoped lang="scss">
.auth-form {
  &__alert {
    margin-bottom: 16px;
  }

  &__switch {
    margin-top: 20px;
    text-align: center;
    color: $color-muted;
  }
}
</style>
