<template>
  <section class="flex flex-col items-center">
    <h1 class="text-5xl font-bold w-8/12 text-center py-10 block leading-normal">
      {{ t('main.title') }} <span class="text-accent-purple">{{ t('main.rich') }}</span>
    </h1>
    <div class="w-8/12 py-6">
      <base-search v-model="keyword" :label="t('main.library')" @on-click="getData" />
    </div>
    <Filter :filter-all="'Alle werken'" :filters="['Foto collectie', 'Associatie 1', 'Associatie 2', 'Associatie 3']" @selected="setSelectedFilters" />
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
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetFullEntitiesDocument, BaseSearch } from 'coghent-vue-3-component-library'
import 'coghent-vue-3-component-library/lib/index.css'
import TheMasonry from './TheMasonry.vue'
import { useI18n } from 'vue-i18n'
import Filter from './Filter.vue'
import { CTA } from '../call-to-action'

export default defineComponent({
  name: 'AssetGrid',
  components: { BaseSearch, TheMasonry, Filter },
  props: {},
  setup: () => {
    let listWithCTA: Object[] = []
    const keyword = ref<string>('')
    const { result, fetchMore, loading } = useQuery<any>(GetFullEntitiesDocument, {
      searchValue: { value: keyword.value },
    })

    const getData = () => {
      fetchMore({
        variables: {
          searchValue: { value: keyword.value },
        },
        updateQuery: (prev, { fetchMoreResult: res }) => res || prev,
      })
    }

    const setSelectedFilters = (values: string[]) => {
      console.log(values)
    }

    const { t } = useI18n()

    return {
      keyword,
      getData,
      loading,
      result,
      t,
      setSelectedFilters,
    }
  },
})
</script>
