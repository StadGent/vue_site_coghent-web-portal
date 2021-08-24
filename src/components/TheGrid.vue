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

    <div v-if='result'  class="grid--masonry">
      <router-link v-for="entity in result.Entities.results" v-show="entity.mediafiles && entity.mediafiles.length > 0" :key="entity.id" class="relative group" :to="'/entity/' + entity.id">
        <span
          :class="{
            'w-full bg-background-dark animate-pulse h-full left-0 top-0 absolute': loading,
            'w-full bg-text-dark h-full left-0 top-0 group-hover:opacity-50 opacity-0 absolute': !loading,
          }"
        />
        <img v-if="entity.mediafiles && entity.mediafiles.length > 0" :src="entity.mediafiles[0].original_file_location" />
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, provide } from 'vue'
import {  useQuery } from '@vue/apollo-composable'
import { GetFullEntitiesDocument, BaseInput } from 'coghent-vue-3-component-library'
import 'coghent-vue-3-component-library/lib/index.css'

export default defineComponent({
  name: 'AssetGrid',
  components: { BaseInput },
  props: {},
  setup: () => {
    const keyword = ref<string>('')

    const { result, fetchMore, loading } = useQuery<any>(GetFullEntitiesDocument, {
      searchQuery: keyword.value,
    })

    const getData = () => {
      fetchMore({
          variables:  {
        searchQuery: keyword.value
      },
          updateQuery: (prev, { fetchMoreResult: res }) => res || prev,
      });
    }
    console.log(result)

    return {
      keyword,
      getData,
      loading,
      result
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
