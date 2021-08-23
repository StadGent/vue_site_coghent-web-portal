<template>
  <section>
    <p style="font-size: 25pt">
      <strong>{{ title }}</strong>
    </p>
    <div v-for="image in mediafiles" :key="image">
      <img :src="image" style="width: 500px; height: 500px; margin: auto" />
    </div>
    <p v-for="type in types" :key="type">
      <strong>{{ type }}</strong>
    </p>
    <p style="max-width: 500px; margin: auto">
      {{ description }}
    </p>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument } from 'coghent-vue-3-component-library'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export default defineComponent({
  name: 'EntityDetails',
  setup: () => {
    const id = asString(useRoute().params['entityID'])
    console.log('EntityID', id)
    const { result, error, loading, refetch } = useQuery(GetEntityByIdDocument, { id })
    console.log('EntityResult', result.value)
    const title = result.value?.Entity?.title[0]?.value
    // console.log('Entity.title', result.value?.Entity?.title[0]?.value)
    let description
    let types: any[] = []
    const metadata = result.value?.Entity?.metadata
    metadata?.forEach((element) => {
      switch (element?.key) {
        case 'description':
          description = element.value
          break
        case 'type':
          types.push(element.value)
          break
      }
    })
    //  console.log('Description', description);
    //  console.log('Type', type);
    // console.log('metadata', metadata);
    let mediafiles: any[] = []
    result.value?.Entity?.mediafiles?.forEach((mediafile) => {
      mediafiles.push(mediafile?.original_file_location)
    })
    console.log('mediafiles', mediafiles)
    return { result, description, title, types, mediafiles }
  },
})
</script>

<style scoped></style>
