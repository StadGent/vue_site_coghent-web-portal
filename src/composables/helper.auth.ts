import StoreFactory from '@/stores/StoreFactory'
import { UserStore } from '@/stores/UserStore'
import { ref, watch } from 'vue'
import { RouteLocationNormalized } from 'vue-router'

export const routeRequiresAuth = ref<boolean>(false)

const authHelper = () => {
  const userStore = StoreFactory.get(UserStore)

  const checkRouteOnRequireAuth = (_to: RouteLocationNormalized) => {
    routeRequiresAuth.value = _to.matched.some((route) => route.meta.requiresAuth)
    return routeRequiresAuth.value
  }

  const setAuthenticatedUser = (_auth: any) => {
    if (_auth.user != null && !userStore.hasUser) {
      userStore.setUser(_auth.user)
    }
  }

  return {
    checkRouteOnRequireAuth,
    setAuthenticatedUser,
  }
}

export default authHelper