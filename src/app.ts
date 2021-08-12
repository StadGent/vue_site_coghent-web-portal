import { createSSRApp } from 'vue'
import App from './App.vue'
import createRouter from './router'
import 'coghent-vue-3-component-library/lib/index.css'

export default function () {
  const app = createSSRApp(App)
  const router = createRouter()

  app.use(router)

  return {
    app,
    router,
  }
}
