<template>
  <section class="flex flex-col items-center">
    <h1 class="md:text-5xl sm:text-4xl text-3xl font-bold w-8/12 text-center py-10 block leading-normal">
      {{ t('main.title') }}
      <span class="text-accent-purple">{{ t('main.rich') }}</span>
    </h1>
    <div class="w-8/12 py-6">
      <base-search v-model="searchQueryForInput" :label="t('main.library')" :searchLabel="t('main.search')" @on-click="getData" />
    </div>
    <Filter v-if="relationResult" @new-selected="updatSelectedFilters" :selected="selectedFilters" :filter-all="'Alle werken'" :filters="relationResult.Entities.relations" />
    <div v-show="loading" class="pt-10">
      <svg class="animate-spin -ml-1 mr-3 h-20 w-20 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
    <the-masonry v-if="result" :entities="result.Entities" :loading="loading" />
    <base-button :text="t('main.load')" :on-click="loadMore" custom-style="ghost-black" :icon-shown="false" class="px-2 m-4" />
  </section>
</template>

<script lang="ts">
import { defineComponent, watch, ref, reactive, PropType, computed, toRaw } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { BaseSearch, GetEntitiesDocument, GetEntitiesQuery, GetEntitiesQueryVariables, BaseButton } from 'coghent-vue-3-component-library'
import 'coghent-vue-3-component-library/lib/index.css'
import TheMasonry from './TheMasonry.vue'
import { useI18n } from 'vue-i18n'
import Filter from './Filter.vue'
import { Maybe, Scalars } from 'coghent-vue-3-component-library/lib/queries'

export default defineComponent({
  name: 'AssetGrid',
  components: { BaseSearch, TheMasonry, BaseButton, Filter },
  props: {
    defaultSearchQuery: {
      type: String,
      default: 'Nova',
      required: false,
    },
  },
  setup: (props) => {
    const { t } = useI18n()
    const selectedFilters = ref<string[]>([])
    const searchQueryForInput = ref<string>('')
    const searchQueryForQuery = ref<string>(props.defaultSearchQuery)
    let _skip: Maybe<Scalars['Int']> = 0
    const _limit: Maybe<Scalars['Int']> = 20
    let resultList = ref<Object[]>([])

    const { result, loading, fetchMore, onResult } = useQuery<GetEntitiesQuery, GetEntitiesQueryVariables>(
      GetEntitiesDocument,
      () => ({
        limit: _limit,
        skip: _skip,
        searchValue: {
          value: searchQueryForQuery.value,
          isAsc: false,
          key: 'title',
          relation_filter: selectedFilters.value,
        },
      }),
      () => ({
        prefetch: false,
      })
    )

    const { result: relationResult } = useQuery<GetEntitiesQuery, GetEntitiesQueryVariables>(
      GetEntitiesDocument,
      () => ({
        limit: _limit,
        skip: _skip,
        searchValue: {
          value: searchQueryForQuery.value,
          isAsc: false,
          key: 'title',
          relation_filter: [],
        },
      }),
      () => ({
        prefetch: false,
      })
    )

    const getData = () => {
      selectedFilters.value = []
      searchQueryForQuery.value = searchQueryForInput.value === '' ? props.defaultSearchQuery : searchQueryForInput.value
    }

    const updatSelectedFilters = (input: string[]) => {
      selectedFilters.value = input
    }

    const loadMore = () => {
      _skip = _skip! + _limit
      fetchMore({
        variables: {
          skip: _skip,
        },
        updateQuery: (previousData, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousData
          }
          return {
            ...previousData,
            ...fetchMoreResult,
          }
        },
      })
    }

    return {
      t,
      getData,
      loading,
      result,
      selectedFilters,
      updatSelectedFilters,
      searchQueryForQuery,
      searchQueryForInput,
      relationResult,
      loadMore    }
  },
})
</script>
