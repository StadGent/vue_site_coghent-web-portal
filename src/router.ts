import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import TheGrid from './components/TheGrid.vue'
import EntityDetails from './components/EntityDetails.vue'
import ThePavilion from './components/ThePavilion.vue'
import TheProfilePage from './pages/TheProfilePage.vue'
import TheStoryboxPage from './pages/TheStoryboxPage.vue'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: TheGrid },
  { path: '/entity/:entityID', component: EntityDetails },
  { path: '/pavilion', component: ThePavilion },
  {path: '/profile', component: TheProfilePage},
  {path : '/storybox', component: TheStoryboxPage}
]

export default function () {
  return createRouter({ routes, history })
}
