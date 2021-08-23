import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { createSSRApp } from 'vue'
import App from './App.vue'
import createRouter from './router'
import { DefaultApolloClient } from '@vue/apollo-composable'
import 'coghent-vue-3-component-library/lib/index.css'

export default function () {
  const app = createSSRApp(App)
  const router = createRouter()
  const apolloClient = new ApolloClient({
    link: createHttpLink({ uri: 'http://localhost:8071/api/graphql' }),
    cache: new InMemoryCache(),
  })

  app.use(router).provide(DefaultApolloClient, apolloClient)

  return {
    app,
    router,
  }
}
