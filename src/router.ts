import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import TheGrid from './components/TheGrid.vue'
import EntityDetails from './components/EntityDetails.vue'
import CreatorDetails from './components/CreatorDetails.vue'
import RelationDetail from './components/RelationDetail.vue'

import EntityNotFound from './components/EntityNotFound.vue'
import ThePavilion from './pages/ThePavilion.vue'
import TheProfilePage from './pages/TheProfilePage.vue'
import TheStoryboxPage from './pages/TheStoryboxPage.vue'
import TheLoginPage from './pages/TheLoginPage.vue'
import { ref } from 'vue'
import { UserStore } from './stores/UserStore'
import StoreFactory from './stores/StoreFactory'
import { ApolloProvider, useQuery } from '@apollo/client'
import { apolloClient, useSessionAuth } from './app'
import { GetMeDocument } from 'coghent-vue-3-component-library/lib'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

// , meta: { requiresAuth: true }
const routes = [
  { path: '/', component: TheGrid },
  { path: '/home', redirect: '/' },
  { path: '/entity/:entityID', name: 'singleObject', component: EntityDetails },
  { path: '/entity/not-found', component: EntityNotFound },
  { path: '/creator/:creatorID', component: CreatorDetails },
  { path: '/relation/:relationID', component: RelationDetail },
  { path: '/visit/:visitCode', redirect: '/', component: TheGrid },
  { path: '/pavilion', component: ThePavilion },
  { path: '/profile', component: TheProfilePage, meta: { requiresAuth: true } },
  { path: '/storybox', component: TheStoryboxPage, meta: { requiresAuth: true } },
  { path: '/login', component: TheLoginPage, meta: { requiresAuth: false } },
]

export default function (auth: any) {
  const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
      // always scroll to top
      return { top: 0 }
    },
  })
  if (auth != null) {
    router.beforeEach(async (to, _from, next) => {
      // HACK:
      to.query = {}
      //
      await auth.verifyServerAuth()
      if (auth.user != null) {
        StoreFactory.get(UserStore).setUser(auth.user)
      }
      if (!to.matched.some((route) => route.meta.requiresAuth)) {
        return next()
      }
      await auth.assertIsAuthenticated(to.fullPath, next)
      if (auth.user != null) {
        console.log(`| session has user`)
        StoreFactory.get(UserStore).setUser(auth.user)
      }
    })
  }
  return router
}
