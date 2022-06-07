import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core'
import { createSSRApp, ref } from 'vue'
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
import { createHead } from '@vueuse/head'
import { useIIIF } from 'coghent-vue-3-component-library'
import { Router } from 'vue-router'
import { onError } from '@apollo/client/link/error'
import { UserStore } from './stores/UserStore'
import useGraphqlErrors from './composables/useGraphqlErrors'

export let iiif: any
export let router: Router
export let apolloClient: ApolloClient<NormalizedCacheObject>
export let useSessionAuth: typeof OpenIdConnectClient | null

// Features
export const useAuthFeature = ref<boolean>(false)
export const useStoryboxFeature = ref<boolean>(false)
//

export default async function (authenticated: boolean) {
  const configStore = StoreFactory.get(ConfigStore)
  const config = await fetch('../config.json').then((r) => r.json())
  configStore.setConfig(config)

  useAuthFeature.value = configStore.config.value.features?.login ? configStore.config.value.features?.login : false
  useStoryboxFeature.value = configStore.config.value.features?.storybox ? configStore.config.value.features?.storybox : false
  const app = createSSRApp(App)
  const head = createHead()
  const userStore = StoreFactory.get(UserStore)

  if (useAuthFeature.value === true) {
    useSessionAuth != null ? useSessionAuth : (useSessionAuth = new OpenIdConnectClient(config.oidc))
    if (useSessionAuth.user.value != null) {
      userStore.setUser(useSessionAuth.user.value)
    }
    useSessionAuth.authCode = new URLSearchParams(window.location.search).get('code')

    userStore.setUser(useSessionAuth.user ? JSON.parse(useSessionAuth.user.value) : null)
  }

  iiif = useIIIF(configStore.config.value.iiifLink)

  router = createRouter(useSessionAuth != null ? useSessionAuth : null)

  const graphqlErrorInterceptor = onError((error) => {
    console.log({ error })
    const errorHandler = useGraphqlErrors(error)
    // errorHandler.logFormattedErrors() // DEV:
    if (useAuthFeature.value === true && errorHandler.checkForUnauthorized() === true) {
      console.log(`NEEDS LOGIN`)
      new Promise(async (resolve, reject) => {
        await fetch('/api/logout')
        useSessionAuth.resetAuthProperties()
        resolve
      })
      useSessionAuth.redirectToLogin(router.currentRoute?.value.fullPath)
    }
  })

  // DEV: see what calls are happening from graphql in the browser console
  const graphqlRequestIntercepter = new ApolloLink((operation, forward) => {
    // console.log('GRAPHQL call => ', operation.operationName) //DEV:
    return forward(operation)
  })
  const userLink = new ApolloLink((operation, forward) => {
    if (useAuthFeature.value === true && useSessionAuth != null) {
      new Promise(async (req, resolve) => {
        await fetch(`/api/me`).then(async (response) => {
          if (response.status === 200) {
            useSessionAuth.user = await response.json()
            userStore.setUser(useSessionAuth.user)
          }
        })
        resolve()
      })
    }

    return forward(operation)
  })

  const graphqlLink = createHttpLink({ uri: config.graphQlLink || '/api/graphql' })

  apolloClient = new ApolloClient({
    link: graphqlErrorInterceptor.concat(graphqlRequestIntercepter.concat(userLink.concat(graphqlLink))),
    cache: new InMemoryCache(),
  })

  if (useAuthFeature.value === true && useSessionAuth && useSessionAuth.authCode != null) {
    await useSessionAuth.processAuthCode(useSessionAuth.authCode, router as any)
  }

  if (useAuthFeature.value === true) {
    app.use(useSessionAuth as typeof OpenIdConnectClient)
  }

  app
    .use(router)
    .use(i18n)
    .use(head)
    .use(VueUniversalModal, {
      teleportTarget: '#modals',
    })
    .provide(DefaultApolloClient, apolloClient)

  return {
    app,
    router,
    useSessionAuth,
    i18n,
  }
}
