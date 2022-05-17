<template>
  <div>
    <p>logging in</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMeDocument, User } from 'coghent-vue-3-component-library'
import { UserStore } from '../stores/UserStore'
import StoreFactory from '../stores/StoreFactory'
import { router, useSessionAuth } from '@/app'

export default defineComponent({
  components: {},
  setup() {
    const userStore = StoreFactory.get(UserStore)

    const { result, fetchMore, loading, onResult, refetch } = useQuery<any>(GetMeDocument, {})

    // onResult(({ data, error }) => {
    //   if (data) {
    //     console.log('WEB | login data', data)
    //     console.log('WEB | login user', data.User)
    //     userStore.setUser(data.User)
    //     router.go(-1)
    //   } else {
    //     console.log('GetMeDocument', error)
    //   }
    // })

    onMounted(async () => {
      console.log(`STEP 1 | WEB | LOGGING IN`)
      if (useSessionAuth != null) {
        await useSessionAuth.redirectToLogin()
      }
      refetch({})
        ?.then((result) => {
          console.log('data', result.data)
          const data = result.data
          if (data) {
            // console.log('STEP 1 | WEB | login user', data.User)
            userStore.setUser(data.User)
            router.go(-1)
            // console.log('STEP 1 | WEB | Going back 1 route step')
          }
        })
        .catch((error) => console.log('GetMeDocument', error))
    })

    return {}
  },
})
</script>

<style scoped></style>
