import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import TheGrid from './components/TheGrid.vue'
import EntityDetails from './components/EntityDetails.vue'
import ThePavilion from './components/ThePavilion.vue'
import TheProfilePage from './pages/TheProfilePage.vue'
import TheStoryboxPage from './pages/TheStoryboxPage.vue'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

// , meta: { requiresAuth: true }
const routes = [
  { path: '/', redirect: '/home'},
  { path: '/home', component: TheGrid},
  { path: '/entity/:entityID', component: EntityDetails},
  { path: '/pavilion', component: ThePavilion},
  { path: '/profile', component: TheProfilePage, meta: { requiresAuth: true }},
  { path : '/storybox', component: TheStoryboxPage}
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
