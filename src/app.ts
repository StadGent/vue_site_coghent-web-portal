import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { createSSRApp } from 'vue'
import App from './App.vue'
import createRouter from './router'
import { DefaultApolloClient } from '@vue/apollo-composable'
import 'coghent-vue-3-component-library/lib/index.css'
import i18n from './i18n'

export default function () {
  const app = createSSRApp(App)
  const router = createRouter()
  const apolloClient = new ApolloClient({
    link: createHttpLink({ uri: 'http://localhost:8071/api/graphql' }),
    cache: new InMemoryCache(),
  })

  app.use(router).use(i18n).provide(DefaultApolloClient, apolloClient)

  return {
    app,
    router,
    i18n,
  }
}
