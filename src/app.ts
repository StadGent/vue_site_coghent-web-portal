import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { createSSRApp } from 'vue'
import App from './App.vue'
import createRouter from './router'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { OpenIdConnectClient } from 'session-vue-3-oidc-library'
import 'coghent-vue-3-component-library/lib/index.css'
import i18n from './i18n'
import 'vue-universal-modal/dist/index.css'
import VueUniversalModal from 'vue-universal-modal'
import StoreFactory from './stores/StoreFactory'
import { ConfigStore } from './stores/ConfigStore'

export default async function (authenticated: boolean = true) {
  const configStore = StoreFactory.get(ConfigStore)
  const app = createSSRApp(App)

  const config = await fetch('../config.json').then((r) => r.json());
  configStore.setConfig(config)
  let auth = undefined
  if(authenticated){
    auth = new OpenIdConnectClient(config.oidc);
  }
  const router = createRouter(auth)
  
  const apolloClient = new ApolloClient({
    link: createHttpLink({ uri: config.graphQlLink }),
    cache: new InMemoryCache(),
  })

  const authCode = new URLSearchParams(window.location.search).get('code');
  if (authCode && auth) {
    auth.processAuthCode(authCode, router);
  }

  app
    .use(router)
    .use(auth as any)
    .use(i18n)
    .use(VueUniversalModal, {
      teleportTarget: '#modals',
    })
    .provide(DefaultApolloClient, apolloClient)

  return {
    app,
    router,
    auth,
    i18n,
  }
}
