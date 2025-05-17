import './assets/bootstrap.min.css'
import VueAwesomePaginate from "vue-awesome-paginate";

import { createApp } from 'vue'
import pinia from './stores/localStoragePlugin.js'

import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueAwesomePaginate)

app.mount('#app')
