<template>
  <div>
    <p>logging in</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMeDocument } from 'coghent-vue-3-component-library'
import { UserStore } from '../stores/UserStore'
import StoreFactory from '../stores/StoreFactory'
import { router, useSessionAuth } from '@/app'

export default defineComponent({
  components: {},
  setup() {
    const userStore = StoreFactory.get(UserStore)

    const { refetch } = useQuery<any>(GetMeDocument, {})

    const getMe = (_authCode: string) => {
      refetch({ accessToken: _authCode })
        ?.then((result) => {
          const data = result.data
          if (data) {
            userStore.setUser(data.User)
            router.go(-1)
          }
        })
        .catch((error) => {
          // fetch('/api/logout')
          router.push('/')
        })
    }

    onMounted(async () => {
      if (useSessionAuth != null) {
        await useSessionAuth.redirectToLogin()
        getMe(useSessionAuth.authCode)
      }
    })

    return {}
  },
})
</script>

<style scoped></style>
