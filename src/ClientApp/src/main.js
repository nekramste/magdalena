//import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import globalMixin from './globalMixin'

const app = createApp({
  extends: App,
  mixins: [globalMixin],
  components: {}
}).use(router).use(store);

app.mount('#app');