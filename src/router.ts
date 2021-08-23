import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import TheGrid from './components/TheGrid.vue'
import EntityDetails from './components/EntityDetails.vue'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

const routes = [
  { path: '/', redirect: '/home' },
  {path:  '/home', component: TheGrid},
  { path: '/entity/:entityID', component: EntityDetails, props:true },
]

export default function () {
  return createRouter({ routes, history })
}
