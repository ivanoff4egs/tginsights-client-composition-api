import './assets/bootstrap.min.css'

import { createApp } from 'vue'
import pinia from './stores/localStoragePlugin.js'

import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
