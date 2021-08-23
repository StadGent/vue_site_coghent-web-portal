<template>
  <section>
    <div v-for="image in result.mediafiles" :key="image.original_file_location">
      <img :src="image.original_file_location" />
    </div>

  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument } from '../../coghent-vue-3-component-library/src/queries'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export default defineComponent({
  name: 'EntityDetails',
  setup: () => {
    const id = asString(useRoute().params['entityID'])

    console.log('EntityID', id);

    const { result, error, loading, refetch } = useQuery(GetEntityByIdDocument, { id })

    console.log('EntityResult', result.value)

    return { result }
  },
})
</script>

<style scoped>
</style>
