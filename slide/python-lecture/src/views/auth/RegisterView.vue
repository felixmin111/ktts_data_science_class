<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import { apiErrorCode } from '@/config/http-client'
import { safeRedirect } from '@/functions/redirect.function'
import Routes from '@/router/uri.route'

/** Same rule as the API: 8–72 characters with at least one letter and one digit. */
const PASSWORD_PATTERN = /^(?=.*\p{L})(?=.*\p{Nd}).{8,72}$/u

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({ displayName: '', email: '', password: '', confirmPassword: '' })
const submitting = ref(false)
const errorCode = ref('')

const rules = computed<Record<string, Rule[]>>(() => ({
  displayName: [
    { required: true, whitespace: true, message: t('auth.validation.required') },
    { max: 60, message: t('auth.validation.nameTooLong') }
  ],
  email: [{ required: true, type: 'email', max: 254, message: t('auth.validation.email') }],
  password: [
    { required: true, message: t('auth.validation.required') },
    { pattern: PASSWORD_PATTERN, message: t('auth.validation.password') }
  ],
  confirmPassword: [
    { required: true, message: t('auth.validation.required') },
    {
      validator: async (_rule: Rule, value: string) => {
        if (value && value !== form.password) throw new Error(t('auth.validation.passwordMismatch'))
      }
    }
  ]
}))

async function onSubmit() {
  submitting.value = true
  errorCode.value = ''
  try {
    await auth.register({
      displayName: form.displayName.trim(),
      email: form.email.trim(),
      password: form.password
    })
    await router.replace(safeRedirect(route.query))
  } catch (error) {
    errorCode.value = apiErrorCode(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AuthShell :title="t('auth.register.title')" :subtitle="t('auth.register.subtitle')">
    <a-alert
      v-if="errorCode"
      type="error"
      show-icon
      :message="t(`errors.${errorCode}`)"
      class="auth-form__alert"
    />

    <a-form
      layout="vertical"
      :model="form"
      :rules="rules"
      :disabled="submitting"
      @finish="onSubmit"
    >
      <a-form-item :label="t('auth.displayName')" name="displayName">
        <a-input v-model:value="form.displayName" autocomplete="name" size="large" />
      </a-form-item>
      <a-form-item :label="t('auth.email')" name="email">
        <a-input v-model:value="form.email" autocomplete="email" size="large" />
      </a-form-item>
      <a-form-item :label="t('auth.password')" name="password" :extra="t('auth.passwordHint')">
        <a-input-password v-model:value="form.password" autocomplete="new-password" size="large" />
      </a-form-item>
      <a-form-item :label="t('auth.confirmPassword')" name="confirmPassword">
        <a-input-password
          v-model:value="form.confirmPassword"
          autocomplete="new-password"
          size="large"
        />
      </a-form-item>
      <a-button type="primary" html-type="submit" size="large" block :loading="submitting">
        {{ t('auth.register.submit') }}
      </a-button>
    </a-form>

    <p class="auth-form__switch">
      {{ t('auth.register.haveAccount') }}
      <RouterLink :to="{ name: Routes.LOGIN.name, query: route.query }">
        {{ t('auth.register.toLogin') }}
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
