<script setup lang="ts">
useDocumentTitle()
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        fontFamily: `'IBM Plex Sans', Arial, sans-serif`,
        colorPrimary: '#2A62A6',
        colorLink: '#2A62A6',
        borderRadius: 10
      }
    }"
    :wave="{ disabled: true }"
  >
    <AppLayout>
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in" appear>
          <Component :is="Component" v-if="Component" :key="route.name" />
        </Transition>
      </RouterView>
    </AppLayout>
  </a-config-provider>
</template>
