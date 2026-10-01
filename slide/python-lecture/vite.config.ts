import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Icons({ compiler: 'vue3' }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        {
          pinia: ['defineStore', 'storeToRefs', 'acceptHMRUpdate'],
          'vue-i18n': ['createI18n', 'useI18n']
        }
      ],
      dirs: ['./src/stores/**/*.store.ts', './src/composables/**'],
      dts: './typings/auto-imports.d.ts',
      dtsMode: 'overwrite',
      viteOptimizeDeps: true
    }),
    Components({
      dirs: ['./src/components'],
      dts: './typings/components.d.ts',
      resolvers: [
        AntDesignVueResolver({ importStyle: false }),
        IconsResolver({ prefix: 'Icon' })
      ]
    })
  ],
  server: {
    port: 3100,
    open: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/_index.scss" as *;`
      }
    }
  }
})
