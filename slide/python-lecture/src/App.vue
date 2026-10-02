<script setup lang="ts">
const { antdLocale } = storeToRefs(useLocaleStore())
useDocumentTitle()

const vueRoute = useRoute()
const isBlankLayout = computed(() => vueRoute.meta.layout === 'blank')
</script>

<template>
  <a-config-provider
    :locale="antdLocale"
    :theme="{
      token: {
        fontFamily: `'IBM Plex Sans', 'Noto Sans Myanmar', Arial, sans-serif`,
        colorPrimary: '#2A62A6',
        colorLink: '#2A62A6',
        borderRadius: 10
      }
    }"
    :wave="{ disabled: true }"
  >
    <RouterView v-if="isBlankLayout" />
    <AppLayout v-else>
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in" appear>
          <Component :is="Component" v-if="Component" :key="route.name" />
        </Transition>
      </RouterView>
    </AppLayout>
  </a-config-provider>
</template>
