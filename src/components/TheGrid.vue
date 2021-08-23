<template>
  <section>
    <div class="grid grid-cols-4 gap-4">
      <div v-for="entity in entities" :key="entity.id">
        <div v-if="entity.image"><img :src="entity.image" /></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { GetEntitiesDocument } from '../../coghent-vue-3-component-library/src/queries'
import axios from 'axios'
import 'coghent-vue-3-component-library/lib/index.css'
import { DataRepository } from '../repositories/DataRepository'
import { Collection, Result } from '../models/CollectionModel'

export default defineComponent({
  name: 'AssetGrid',
  components: {},
  props: {},
  setup: (props) => {
    const keyword = ref<string>('Strijkijzer')
    const entities = ref<Result[]>([])
    const dataRepo: DataRepository = new DataRepository()

    const getData = () => {
      console.log(result)
      dataRepo.getCollectionData(keyword.value).then((response: Collection) => {
        const length = response.results.length - 1
        response.results.forEach((result: Result, index) => {
          dataRepo.getRelationData(result._id).then((relations: any) => {
            result.relations = relations

            dataRepo.getMediaData(result._id).then((media: any) => {
              if (media[0]) {
                result.image = media[0].thumbnail_file_location
              }

              if (index === length) {
                entities.value = response.results
                console.log('entities', entities)
              }
            })
          })
        })
      })
    }

    onMounted(() => {
      getData()
    })

    const { result, loading, fetchMore } = useQuery(GetEntitiesDocument, {
      searchQuery: 'strijkijzer',
    })
    console.log('result', result)

    return {
      entities,
    }
  },
})
</script>

<style scoped>
</style>
