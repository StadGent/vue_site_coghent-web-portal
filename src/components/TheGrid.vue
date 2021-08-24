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
    <the-masonry v-if="result" :entities="result.Entities" :loading="loading" />
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, provide } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetFullEntitiesDocument, BaseInput } from 'coghent-vue-3-component-library'
import 'coghent-vue-3-component-library/lib/index.css'
import TheMasonry from './TheMasonry.vue'

export default defineComponent({
  name: 'AssetGrid',
  components: { BaseInput, TheMasonry },
  props: {},
  setup: () => {
    const keyword = ref<string>('')

    const { result, fetchMore, loading } = useQuery<any>(GetFullEntitiesDocument, {
      searchQuery: keyword.value,
    })

    const getData = () => {
      fetchMore({
        variables: {
          searchQuery: keyword.value,
        },
        updateQuery: (prev, { fetchMoreResult: res }) => res || prev,
      })
    }

    return {
      keyword,
      getData,
      loading,
      result,
    }
  },
})
</script>
