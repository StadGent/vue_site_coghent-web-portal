import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import TheGrid from './components/TheGrid.vue'
import EntityDetails from './components/EntityDetails.vue'
import ThePavilion from './components/ThePavilion.vue'
import TheProfilePage from './pages/TheProfilePage.vue'
import TheStoryboxPage from './pages/TheStoryboxPage.vue'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

const routes = [
  { path: '/', redirect: '/home', meta: { requiresAuth: true }},
  { path: '/home', component: TheGrid, meta: { requiresAuth: true }},
  { path: '/entity/:entityID', component: EntityDetails, meta: { requiresAuth: true }},
  { path: '/pavilion', component: ThePavilion, meta: { requiresAuth: true }},
  { path: '/profile', component: TheProfilePage, meta: { requiresAuth: true }},
  { path : '/storybox', component: TheStoryboxPage, meta: { requiresAuth: true }}
]

export default function (auth: any) {
  const router = createRouter({ routes, history: createWebHistory(process.env.BASE_URL) });
  if(auth) {
    router.beforeEach(async (to, _from, next) => {
      if (!to.matched.some((route) => route.meta.requiresAuth)) {
        console.log('next')
        return next();
      }
      await auth.assertIsAuthenticated(to.fullPath, next);
    })
  }
  return router
}
