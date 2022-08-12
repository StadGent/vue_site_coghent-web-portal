import { ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core'
import { createSSRApp, ref, watch } from 'vue'
import App from './App.vue'
import createRouter from './router'
import { createUploadLink } from 'apollo-upload-client'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { OpenIdConnectClient } from 'session-vue-3-oidc-library'
import 'coghent-vue-3-component-library/lib/index.css'
import i18n from './i18n'
import 'vue-universal-modal/dist/index.css'
import VueUniversalModal from 'vue-universal-modal'
import StoreFactory from './stores/StoreFactory'
import { ConfigStore, useAuthFeature } from './stores/ConfigStore'
import { createHead } from '@vueuse/head'
import { useIIIF } from 'coghent-vue-3-component-library'
import { Router } from 'vue-router'
import { onError } from '@apollo/client/link/error'
import { UserStore } from './stores/UserStore'
import useGraphqlErrors from './composables/useGraphqlErrors'
import FloatingVue from 'floating-vue'
import { Dropdown, VClosePopper } from 'floating-vue'
import 'floating-vue/dist/style.css'
import authHelper, { routeRequiresAuth } from './composables/helper.auth'

export let iiif: any
export let router: Router
export let apolloClient: ApolloClient<NormalizedCacheObject>
export let useSessionAuth: typeof OpenIdConnectClient | null
export const storyboxCount = ref<number>(0)
export const { checkRouteOnRequireAuth, setAuthenticatedUser, reactOnIsAuthenticated } = authHelper()

export default async function (authenticated: boolean) {
  console.log(`>web-portal updated session to v0.1.7`)
  console.log(`>web-portal updated CL to v0.1.122`)
  const configStore = StoreFactory.get(ConfigStore)
  const config = await fetch('../config.json').then((r) => r.json())
  configStore.setConfig(config)
  configStore.setFeatureFlags()

  const authCode = ref<string | null>(null)

  const app = createSSRApp(App)
  const head = createHead()

  if (useAuthFeature.value === true) {
    useSessionAuth ? useSessionAuth : (useSessionAuth = new OpenIdConnectClient(config.oidc))
    authCode.value = new URLSearchParams(window.location.search).get('code')
  }

  watch(useSessionAuth.isAuthenticated, (isAuthenticated: boolean) => {
    reactOnIsAuthenticated(useSessionAuth, isAuthenticated)
  })

  iiif = useIIIF(configStore.config.value.iiifLink)

  router = createRouter(useSessionAuth != null ? useSessionAuth : null)

  const graphqlErrorInterceptor = onError((error) => {
    const errorHandler = useGraphqlErrors(error)
    // errorHandler.logFormattedErrors() // DEV:
    if (useAuthFeature.value === true && errorHandler.checkForUnauthorized() === true) {
      if (useSessionAuth.isAuthenticated.value) {
        return error.forward(error.operation)
      } else {
        router.push(`/`)
      }
    }
  })

  // DEV: see what calls are happening from graphql in the browser console
  const graphqlRequestIntercepter = new ApolloLink((operation, forward) => {
    // console.log('GRAPHQL call => ', operation.operationName) //DEV:
    return forward(operation)
  })

  const graphqlLink = createUploadLink({ uri: config.graphQlLink || '/api/graphql' })

  apolloClient = new ApolloClient({
    link: graphqlErrorInterceptor.concat(graphqlRequestIntercepter.concat(graphqlLink)),
    cache: new InMemoryCache(),
  })

  if (useAuthFeature.value === true && useSessionAuth) {
    if (authCode.value !== null) {
      await useSessionAuth.processAuthCode(authCode.value, router as any)
      authCode.value = null
    } else {
      await useSessionAuth.verifyServerAuth()
    }
    routeRequiresAuth.value === true ? await useSessionAuth.verifyServerAuth() : null
  }

  if (useAuthFeature.value === true) {
    app.use(useSessionAuth as typeof OpenIdConnectClient)
  }

  app
    .use(router, FloatingVue)
    .use(i18n)
    .use(head)
    .use(VueUniversalModal, {
      teleportTarget: '#modals',
    })
    .component('VDropdown', Dropdown)
    .directive('close-popper', VClosePopper)
    .provide(DefaultApolloClient, apolloClient)

  return {
    app,
    router,
    useSessionAuth,
    i18n,
  }
}
