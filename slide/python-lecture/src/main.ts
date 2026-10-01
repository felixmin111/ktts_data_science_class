import 'ant-design-vue/dist/reset.css'
import '@/assets/styles/main.scss'

import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import i18n from '@/i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(i18n)

router.isReady().then(() => app.mount('#app'))
