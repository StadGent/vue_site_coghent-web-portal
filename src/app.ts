import { ApolloClient, ApolloLink, createHttpLink, fromPromise, InMemoryCache, NormalizedCacheObject, ServerError } from '@apollo/client/core'
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
import { User } from 'coghent-vue-3-component-library'
import { UserStore } from './stores/UserStore'


export let iiif: any
export let router: Router
export let apolloClient: ApolloClient<NormalizedCacheObject>;
export let useSessionAuth: typeof OpenIdConnectClient | null

// Features
export const useAuthFeature = ref<boolean>(false)

export default async function (authenticated: boolean) {
  const configStore = StoreFactory.get(ConfigStore)
  const config = await fetch('../config.json').then((r) => r.json())
  configStore.setConfig(config)
  useAuthFeature.value = configStore.config.value.features?.login ? configStore.config.value.features?.login : false
  const app = createSSRApp(App)
  const head = createHead()

  if (useAuthFeature.value === true) {
    useSessionAuth != null ? useSessionAuth : useSessionAuth = new OpenIdConnectClient(config.oidc)

    useSessionAuth.authCode = new URLSearchParams(window.location.search).get('code')
    console.log(useSessionAuth.authCode)
  }

  iiif = useIIIF(configStore.config.value.iiifLink)

  router = createRouter(useSessionAuth ? useSessionAuth : null)
  const userStore = StoreFactory.get(UserStore)

  const graphqlErrorInterceptor = onError((error) => {
    console.log({ error });

    if (useAuthFeature.value === true) {
      // FIXME: express sends response.status(401)
      if (error.networkError) {
        const network = error.networkError as ServerError;
        // console.log('auth before login auth', useSessionAuth);
        if (network && network.statusCode === 401 || network.statusCode === 400 && useSessionAuth != null) {
          console.log('Catched network error with statuscode 401 Unauthorized');
          useSessionAuth.redirectToLogin('/');
        }
      };

      // FIXME: express does not send response.status(401). response from call is 401b
      if (error.response?.errors && error.response?.errors[0]) {
        console.log('STATUS', error.response?.errors[0].extensions.response.status)
        fetch('/api/logout')
          .then(async (response) => {
            // console.log(`STEP 1 | WEB LOGOUT | status response `, response.status)
            userStore.setUser({} as typeof User)
            // console.log(`STEP 1 | WEB LOGOUT | user set to none`)
            router.push('/')
            // console.log(`STEP 1 | WEB LOGOUT | going back to home page /`)
            //FIXME: Definitly not correct masonery component call needs to be retriggered/reloaded
            window.location.reload()

          })
          .catch((error) => console.log(`WEB | Couldn't logout`, error))
      }
    }

  });

  // DEV: see what calls are happening from graphql in the browser console
  const graphqlRequestIntercepter = new ApolloLink((operation, forward) => {
    console.log('GRAPHQL call => ', operation.operationName)
    return forward(operation);
  });

  apolloClient = new ApolloClient({
    link: graphqlErrorInterceptor.concat(graphqlRequestIntercepter.concat(createHttpLink({ uri: config.graphQlLink || '/api/graphql' }))),
    cache: new InMemoryCache(),
  })

  if (useAuthFeature.value === true && useSessionAuth && useSessionAuth.authCode != null) {
    console.log(`WEB | PROCESS AUTH`)
    useSessionAuth.processAuthCode(useSessionAuth.authCode, router as any)
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
