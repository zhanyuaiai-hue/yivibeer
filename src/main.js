import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initCopyConfig } from './config/copy'

// 初始化文案配置
initCopyConfig()

createApp(App).use(router).mount('#app')
