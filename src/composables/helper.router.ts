import { ref, watch } from 'vue'
import { RouteLocationNormalized } from 'vue-router'

export const routeRequiresAuth = ref<boolean>(false)

const routerHelper = () => {

  const checkRouteOnRequireAuth = (_to: RouteLocationNormalized) => {
    routeRequiresAuth.value = _to.matched.some((route) => route.meta.requiresAuth)
    return routeRequiresAuth.value
  }

  return {
    checkRouteOnRequireAuth,
  }
}

export default routerHelper