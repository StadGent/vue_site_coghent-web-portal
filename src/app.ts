import { ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core'
import { createSSRApp, ref } from 'vue'
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
import { ConfigStore } from './stores/ConfigStore'
import { createHead } from '@vueuse/head'
import { useIIIF } from 'coghent-vue-3-component-library'
import { Router } from 'vue-router'
import { onError } from '@apollo/client/link/error'
import { UserStore } from './stores/UserStore'
import useGraphqlErrors from './composables/useGraphqlErrors'
import FloatingVue from 'floating-vue'
import { Dropdown, VClosePopper } from 'floating-vue'
import 'floating-vue/dist/style.css'

export let iiif: any
export let router: Router
export let apolloClient: ApolloClient<NormalizedCacheObject>
export let useSessionAuth: typeof OpenIdConnectClient | null
export const storyboxCount = ref<number>(0)

// Features
export const useAuthFeature = ref<boolean>(false)
export const useStoryboxFeature = ref<boolean>(false)
export const useGoogleFeature = ref<boolean>(false)
export const useTestimonyFeature = ref<boolean>(false)
export const useWorksFeature = ref<boolean>(false)
//

export default async function (authenticated: boolean) {
  console.log(`>web-portal updated session to v0.1.7`)
  console.log(`>web-portal updated CL to v0.1.106`)
  const configStore = StoreFactory.get(ConfigStore)
  const config = await fetch('../config.json').then((r) => r.json())
  configStore.setConfig(config)

  useAuthFeature.value = configStore.config.value.features?.login ? configStore.config.value.features?.login : false
  useStoryboxFeature.value = configStore.config.value.features?.storybox ? configStore.config.value.features?.storybox : false
  useTestimonyFeature.value = configStore.config.value.features.testimony ? configStore.config.value.features.testimony : false
  useGoogleFeature.value = configStore.config.value.features?.googleTags ? configStore.config.value.features?.googleTags : false
  useWorksFeature.value = configStore.config.value.features?.myWorks ? configStore.config.value.features?.myWorks : false
  const app = createSSRApp(App)
  const head = createHead()
  const userStore = StoreFactory.get(UserStore)

  if (useAuthFeature.value === true) {
    useSessionAuth != null ? useSessionAuth : (useSessionAuth = new OpenIdConnectClient(config.oidc))
    if (useSessionAuth.user?.value != null) {
      userStore.setUser(useSessionAuth.user.value)
    }
    useSessionAuth.authCode = new URLSearchParams(window.location.search).get('code')

    userStore.setUser(useSessionAuth.user ? JSON.parse(useSessionAuth.user) : null)
  }

  iiif = useIIIF(configStore.config.value.iiifLink)

  router = createRouter(useSessionAuth != null ? useSessionAuth : null)

  const graphqlErrorInterceptor = onError((error) => {
    // console.log({ error }) // DEV:
    const errorHandler = useGraphqlErrors(error)
    // errorHandler.logFormattedErrors() // DEV:
    if (useAuthFeature.value === true && errorHandler.checkForUnauthorized() === true) {
      console.log(`NEEDS LOGIN`)
      new Promise(async (resolve, reject) => {
        await fetch('/api/logout')
        useSessionAuth.resetAuthProperties()
        userStore.setUser(null)
        resolve
      })
      router.push(`/`)
    }
  })

  // DEV: see what calls are happening from graphql in the browser console
  const graphqlRequestIntercepter = new ApolloLink((operation, forward) => {
    // console.log('GRAPHQL call => ', operation.operationName) //DEV:
    return forward(operation)
  })
  const userLink = new ApolloLink((operation, forward) => {
    if (useAuthFeature.value === true && useSessionAuth != null) {
      new Promise(async (resolve, reject) => {
        await fetch(`/api/me`).then(async (response) => {
          if (response.status === 200) {
            useSessionAuth.user = await response.json()
            userStore.hasUser ? null : userStore.setUser(useSessionAuth.user)
          } else resolve
        })
      })
    }

    return forward(operation)
  })

  const graphqlLink = createUploadLink({ uri: config.graphQlLink || '/api/graphql' })

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
