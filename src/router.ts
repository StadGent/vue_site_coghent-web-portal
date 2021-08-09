import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

const routes = [{ path: '/', component: HelloWorld }]

export default function () {
  return createRouter({ routes, history })
}
