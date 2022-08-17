import { router } from '@/app'
import StoreFactory from '@/stores/StoreFactory'
import { UserStore } from '@/stores/UserStore'
import { ref } from 'vue'
import { RouteLocationNormalized } from 'vue-router'

export const routeRequiresAuth = ref<boolean>(false)
export const queryParamsToDelete = ['session_state', 'code']

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

  const removeParametFromQueryParams = (_query: any, _params: Array<string>) => {
    const updatedQuery = {} as any
    let key: keyof typeof _query
    for (key in _query) {
      !_params.includes(key) ? updatedQuery[key] = _query[key] : null
    }
    return updatedQuery
  }

  return {
    checkRouteOnRequireAuth,
    setAuthenticatedUser,
    reactOnIsAuthenticated,
    removeParametFromQueryParams,
  }
}

export default authHelper