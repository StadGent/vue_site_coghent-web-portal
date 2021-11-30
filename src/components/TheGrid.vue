<template>
  <section class="flex flex-col items-center">
    <h1 v-show="defaultRelations.length === 0" class="md:text-5xl sm:text-4xl text-3xl font-bold w-8/12 text-center py-10 block leading-normal">
      {{ t('main.title') }}
      <span class="text-accent-purple">{{ t('main.rich') }}</span>
    </h1>
    <div v-show="defaultRelations.length === 0" class="w-8/12 py-6">
      <base-search v-model="searchQueryForInput" :label="t('main.library')" :search-label="t('main.search')" @on-click="getData" v-on:keyup.enter="getData" />
    </div>
    <Filter v-if="relationData" class="my-5" :selected="selectedFilters" :filter-all="'Alle werken'" :filters="relationData.Entities.relations" @new-selected="updatSelectedFilters" />
    <div v-show="loading" class="pt-10">
      <svg class="animate-spin -ml-1 mr-3 h-20 w-20 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
    <div v-if="emptySearch">
      <p v-show="!loading" class="text-center">
        {{ t('main.empty') }}
      </p>
    </div>
    <div v-if="!emptySearch" class="flex flex-col items-center justify-center">
      <the-masonry v-if="entityData" v-show="!loading" :small="small" :entities="entityData.Entities" :loading="loading" />
      <base-button v-show="!loading && !endOfData" :text="t('main.load')" :on-click="loadMore" custom-style="ghost-black" :icon-shown="false" class="px-2 m-4 text-center" />
    </div>
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
import { empty } from '@apollo/client/core'

export default defineComponent({
  name: 'AssetGrid',
  components: { BaseSearch, TheMasonry, BaseButton, Filter },
  props: {
    defaultSearchQuery: {
      type: String,
      default: 'Nova',
      required: false,
    },
    defaultRelations: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [],
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  setup: (props) => {
    const { t } = useI18n()
    const selectedFilters = ref<string[]>([])
    const searchQueryForInput = ref<string>('')
    const searchQueryForQuery = ref<string>(props.defaultSearchQuery)
    let _skip: Maybe<Scalars['Int']> = 0
    const _limit: Maybe<Scalars['Int']> = 20
    const endOfData = ref<Boolean>(false)
    const entityData = ref<GetEntitiesQuery | undefined>()
    const relationData = ref<GetEntitiesQuery | undefined>()
    const emptySearch = ref<Boolean>(false)

    const getSelectedFilters = computed(() => {
      if (props.defaultRelations?.length > 0 && selectedFilters.value.length === 0) {
        return props.defaultRelations
      }
      return selectedFilters.value
    })

    const { result, loading, fetchMore, onResult } = useQuery<GetEntitiesQuery, GetEntitiesQueryVariables>(
      GetEntitiesDocument,

      () => ({
        limit: _limit,
        skip: (_skip = 0),
        searchValue: {
          value: searchQueryForQuery.value,
          isAsc: false,
          key: 'title',
          relation_filter: getSelectedFilters.value,
        },
      }),
      () => ({
        prefetch: false,
      })
    )

    const { result: relationResult, onResult: onRelationResult } = useQuery<GetEntitiesQuery, GetEntitiesQueryVariables>(
      GetEntitiesDocument,
      () => ({
        limit: _limit,
        skip: _skip,
        searchValue: {
          value: searchQueryForQuery.value,
          isAsc: false,
          key: 'title',
          relation_filter: props.defaultRelations.length > 0 ? props.defaultRelations : [],
        },
      }),
      () => ({
        prefetch: false,
      })
    )

    onResult(() => {
      const temp = result.value
      if (temp?.Entities?.results?.length === 0 || !temp?.Entities?.results) {
        endOfData.value = true
        emptySearch.value = true
      } else {
        endOfData.value = false
        entityData.value = temp
        emptySearch.value = false
      }
    })

    onRelationResult(() => {
      const temp = relationResult.value
      console.log('relationData', temp)
      if (temp?.Entities?.relations?.length === 0 || !temp?.Entities?.relations) {
        //do nothing for now
      } else {
        relationData.value = temp
      }
    })

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
          if (fetchMoreResult?.Entities?.results?.length == 0) {
            endOfData.value = true
            return previousData
          }
          if (previousData.Entities && previousData.Entities.results && fetchMoreResult!.Entities?.results) {
            endOfData.value = false
            return {
              previousData,
              Entities: {
                ...previousData.Entities,
                results: [...previousData.Entities.results, ...fetchMoreResult!.Entities.results],
              },
            }
          } else {
            return previousData
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
      relationData,
      loadMore,
      endOfData,
      entityData,
      emptySearch,
    }
  },
})
</script>
