import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'



const app = createApp(App)

app.use(ElementPlus);
app.config.globalProperties.$electron = window.electron

app.config.globalProperties.$path = window.nodePath
app.mount('#app')
