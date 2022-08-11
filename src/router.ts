import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import TheGrid from './components/TheGrid.vue'
import EntityDetails from './components/EntityDetails.vue'
import CreatorDetails from './components/CreatorDetails.vue'
import RelationDetail from './components/RelationDetail.vue'

import EntityNotFound from './components/EntityNotFound.vue'
import ThePavilion from './pages/ThePavilion.vue'
import TheProfilePage from './pages/TheProfilePage.vue'
import TheStoryboxPage from './pages/TheStoryboxPage.vue'
import TheStoriesPage from './pages/TheStoriesPage.vue'
import NewStoryPage from './pages/NewStoryPage.vue'
import TheLoginPage from './pages/TheLoginPage.vue'
import TheWorksPage from './pages/TheWorksPage.vue'
import TheVisitPage from './pages/TheVisitPage.vue'
import TheUploadPage from './pages/TheUploadPage.vue'
import TheTestimonyPage from './pages/TheTestimonyPage.vue'
import { UserStore } from './stores/UserStore'
import StoreFactory from './stores/StoreFactory'
import routerHelper, { routeRequiresAuth } from '@/composables/helper.router'

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
  { path: '/visit/:visitCode', component: TheVisitPage, meta: { requiresAuth: false } },
  { path: '/pavilion', component: ThePavilion },
  { path: '/profile', component: TheProfilePage, meta: { requiresAuth: true } },
  { path: '/mystories', component: TheStoriesPage, meta: { requiresAuth: true } },
  { path: '/mystories/new', component: NewStoryPage, meta: { requiresAuth: true } },
  { path: '/mystories/:storyboxId', component: TheStoryboxPage, meta: { requiresAuth: true } },
  { path: '/myworks', component: TheWorksPage, meta: { requiresAuth: true } },
  { path: '/mytestimonies', component: TheTestimonyPage, meta: { requiresAuth: true } },
  { path: '/upload', component: TheUploadPage, meta: { requiresAuth: true } },
  { path: '/login', component: TheLoginPage, meta: { requiresAuth: true } },
]

export const { checkRouteOnRequireAuth } = routerHelper()

export default function (auth: any) {
  const userStore = StoreFactory.get(UserStore)
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
      checkRouteOnRequireAuth(to)
      if (routeRequiresAuth.value === true) {
        await auth.assertIsAuthenticated(to.fullPath, next)
        if (auth.user != null && !userStore.hasUser) {
          userStore.setUser(auth.user)
        }
      } else {
        return next()
      }
      if (auth.user != null && !userStore.hasUser) {
        userStore.setUser(auth.user)
      }
    })
  }
  return router
}
