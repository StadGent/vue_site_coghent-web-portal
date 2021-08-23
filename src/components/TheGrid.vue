<template>
  <section class="flex flex-col items-center">
    <h1 class="text-5xl font-bold w-8/12 text-center py-10 block leading-normal">
      Duik mee in de geschiedenis en ontdek de vele werken uit onze <span class="text-accent-purple">rijke collectie!</span>
    </h1>
    <div class="w-8/12 py-6">
      <base-input v-model="keyword" label="bibliotheek" @on-click="getData" />
    </div>
    <div v-show="loading" class="pt-10">
      <svg class="animate-spin -ml-1 mr-3 h-20 w-20 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>

    <div v-show="!loading" class="grid--masonry">
      <router-link v-for="entity in entities" v-show="entity.image" :key="entity.id" class="relative group" :to="'/entity/' + entity._id">
        <span
          :class="{
            'w-full bg-background-dark animate-pulse h-full left-0 top-0 absolute': loading,
            'w-full bg-text-dark h-full left-0 top-0 group-hover:opacity-50 opacity-0 absolute': !loading,
          }"
        />
        <img :src="entity.image" />
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, provide } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { GetEntitiesDocument, BaseInput } from 'coghent-vue-3-component-library'
import axios from 'axios'
import 'coghent-vue-3-component-library/lib/index.css'
import { DataRepository } from '../repositories/DataRepository'
import { Collection, Result } from '../models/CollectionModel'

export default defineComponent({
  name: 'AssetGrid',
  components: { BaseInput },
  props: {},
  setup: (props) => {
    const keyword = ref<string>('asset')
    const entities = ref<Result[]>([])
    const dataRepo: DataRepository = new DataRepository()
    const loading = ref<boolean>(true)

    const getData = () => {
      loading.value = true
      dataRepo.getCollectionData(keyword.value).then((response: Collection) => {
        const length = response.results.length - 1
        response.results.forEach((result: Result, index) => {
          dataRepo.getRelationData(result._id).then((relations: any) => {
            result.relations = relations

            dataRepo.getMediaData(result._id).then((media: any) => {
              if (media[0]) {
                result.image = media[0].original_file_location
              }

              if (index === length) {
                entities.value = response.results
                console.log('entities', entities)
              }
            })
          })
        })
        loading.value = false
      })
    }

    onMounted(() => {
      getData()
    })

    const { result, fetchMore } = useQuery(GetEntitiesDocument, {
      searchQuery: '',
    })
    console.log('result', result)

    return {
      entities,
      keyword,
      getData,
      loading,
    }
  },
})
</script>

<style scoped>
/* basic reset */
* {
  margin: 0;
}

/* grid styles */
.grid--masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, Min(30em, 100%));
  grid-template-rows: masonry;
  justify-content: center;
  grid-gap: 0.5em;
  padding: 0.5em;
}
.grid--masonry > * {
  align-self: start;
}

/* prettifying styles */
html {
  background: #555;
}

img {
  display: block;
  width: 100%;
  border-radius: 4px;
  box-shadow: 2px 2px 5px rgba(#000, 0.7);
}
</style>
