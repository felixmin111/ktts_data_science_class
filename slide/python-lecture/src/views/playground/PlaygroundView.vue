<script setup lang="ts">
const { t } = useI18n()

const starter = `# Try anything here. Ctrl/Cmd + Enter runs the code.
name = input("What is your name? ")
age = int(input("How old are you? "))

print(f"Hello, {name}!")
print(f"In 10 years you will be {age + 10}.")
print(type(name), type(age))
`
</script>

<template>
  <div class="container playground">
    <h1>{{ t('playground.title') }}</h1>
    <p class="playground__body">{{ t('playground.body') }}</p>
    <CodeRunner
      :code="starter"
      title="playground.py"
      runnable
      :stdin="['Neo', '25']"
      :min-lines="14"
    />
  </div>
</template>

<style scoped lang="scss">
.playground {
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h1 {
    font-size: 40px;
  }

  &__body {
    color: $color-body;
    font-size: 18px;
  }
}
</style>
