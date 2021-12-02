<template>
  <section class="flex flex-col items-center">
    <h1 v-show="defaultRelations.length === 0" class="md:text-5xl sm:text-4xl text-3xl font-bold w-8/12 text-center py-10 block leading-normal">
      {{ t('main.title') }}
      <span class="text-accent-purple">{{ t('main.rich') }}</span>
    </h1>
    <div v-show="defaultRelations.length === 0" class="w-8/12 py-6">
      <base-search v-model="searchQueryForInput" :search-label="t('main.search')" @on-click="getData" @keyup.enter="getData" />
    </div>
    <Filter v-if="relationData" class="my-5" :selected="selectedFilters" :filter-all="t('buttons.all-works')" :filters="relationData.Entities.relations" @new-selected="updatSelectedFilters" />

    <div class="flex w-full flex-col items-center justify-center">
      <the-masonry ref="masonry" :small="small" :entities="entityData ? entityData.Entities : {}" :loading="loading" :items-each-load="limit" :end-of-data="endOfData" @load-more="loadMore" />
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

export default defineComponent({
  name: 'AssetGrid',
  components: { BaseSearch, TheMasonry, Filter },
  props: {
    defaultSearchQuery: {
      type: String,
      default: '',
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
    const limit: Maybe<Scalars['Int']> = 25
    const endOfData = ref<Boolean>(false)
    const entityData = ref<GetEntitiesQuery | undefined>()
    const relationData = ref<GetEntitiesQuery | undefined>()
    const emptySearch = ref<Boolean>(false)
    const masonry = ref<any>(null)

    const getSelectedFilters = computed<string[]>(() => {
      if (props.defaultRelations?.length > 0 && selectedFilters.value.length === 0) {
        return props.defaultRelations
      }
      return selectedFilters.value
    })

    const { result, loading, fetchMore, onResult } = useQuery<GetEntitiesQuery, GetEntitiesQueryVariables>(
      GetEntitiesDocument,

      () => ({
        limit: limit,
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
        limit: limit,
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

    onResult((queryResult) => {
      entityData.value = queryResult.data

      if (queryResult.data && queryResult.data.Entities?.results && queryResult.data.Entities?.results.length < limit) {
        endOfData.value = true
      } else {
        endOfData.value = false
      }
    })

    onRelationResult((queryResult) => {
      if ((queryResult.data && queryResult.data.Entities?.relations?.length === 0) || (queryResult.data && !queryResult.data.Entities?.relations)) {
        //do nothing for now
      } else {
        relationData.value = queryResult.data
      }
    })

    const getData = () => {
      if (masonry.value && masonry.value.contructTiles) {
        masonry.value.contructTiles(limit, true)
      }
      selectedFilters.value = []
      searchQueryForQuery.value = searchQueryForInput.value
    }

    const updatSelectedFilters = (input: string[]) => {
      if (masonry.value && masonry.value.contructTiles) {
        masonry.value.contructTiles(limit, true)
      }
      selectedFilters.value = input
    }

    const loadMore = () => {
      if (masonry.value && masonry.value.contructTiles) {
        masonry.value.contructTiles(limit)
      }
      _skip = _skip! + limit
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
      limit,
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
      masonry,
    }
  },
})
</script>
