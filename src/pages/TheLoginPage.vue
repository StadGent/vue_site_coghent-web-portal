<template>
  <div>
    <p>logging in</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetMeDocument, User } from 'coghent-vue-3-component-library'
import { UserStore } from '../stores/UserStore'
import StoreFactory from '../stores/StoreFactory'

export default defineComponent({
  components: { },
  setup() {
    const userStore = StoreFactory.get(UserStore)

    const { result, fetchMore, loading, onResult } = useQuery<any>(GetMeDocument, {})

    onResult(({ data, error }) => {
      // console.log(data)
      userStore.setUser(data.User)
    })

    return {
    }
  },
})
</script>

<style scoped>
</style>