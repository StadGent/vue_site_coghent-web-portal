import { router } from '@/app'
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
    if (_auth.user) {
      userStore.setUser(_auth.user)
    }
  }

  const reactOnIsAuthenticated = (_auth: any, _isAuthenticated: boolean) => {
    if (_isAuthenticated === true && !userStore.hasUser) {
      setAuthenticatedUser(_auth)
    } else if (_isAuthenticated === false) {
      userStore.setUser(null)
      if (routeRequiresAuth.value === true) router.push(`/`)
    }
  }

  return {
    checkRouteOnRequireAuth,
    setAuthenticatedUser,
    reactOnIsAuthenticated,
  }
}

export default authHelper