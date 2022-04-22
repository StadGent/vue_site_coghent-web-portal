<template>
  <section class="flex flex-col items-center">
    <h1 v-show="defaultRelations.length === 0 && !noHeader" class="md:text-5xl sm:text-4xl text-3xl font-bold w-8/12 text-center py-10 block leading-normal">
      {{ t('main.title') }}
      <span class="text-accent-purple">{{ t('main.rich') }}</span>
    </h1>
    <div v-show="defaultRelations.length === 0 && !noHeader" class="w-full py-6 flex flex-col lg:flex-row justify-center items-center relative">
      <div v-show="!route.query.touch" class="w-8/12">
        <base-search v-model="searchQueryForInput" :loading="loading" :search-label="t('main.search')" class="w-8/12" @on-click="getData" @keyup.enter="getData" />
      </div>
      <div class=" " :class="route.query.touch ? 'transform scale-150' : 'lg:absolute lg:right-0'">
        <base-button class="inline⁻block w-max ml-10" :text="t('buttons.surprise')" custom-style="ghost-black" custom-icon="surprise" :icon-shown="true" :on-click="() => resetQuery()" />
      </div>
    </div>
    <Filter
      v-if="!noFilters"
      :selected="selectedFilters"
      :loading="loading"
      :filter-all="t('buttons.all-works')"
      :filters="relationData ? relationData.Entities.relations : []"
      @new-selected="updatSelectedFilters"
    />

    <div v-if="entityData" class="flex w-full flex-col items-center justify-center">
      <the-masonry
        ref="masonry"
        :small="small"
        :entities="entityData ? entityData.Entities : {}"
        :loading="loading"
        :items-each-load="limit"
        :end-of-data="endOfData"
        :generate-url="generateUrl"
        :no-image-url="noImageUrl"
        :noCopy="route.query.touch ? true : false"
        @load-more="loadMore"
        @navigateWithRouter="goToDetailsPage"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, watch, ref, reactive, PropType, computed, toRaw, onMounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { BaseSearch, GetEntitiesDocument, GetEntitiesQuery, GetEntitiesQueryVariables, BaseButton, TheMasonry } from 'coghent-vue-3-component-library'
import 'coghent-vue-3-component-library/lib/index.css'
import { useI18n } from 'vue-i18n'
import Filter from './Filter.vue'
import { Entity, Maybe, Relation, Scalars, Story } from 'coghent-vue-3-component-library/lib/queries'
import useSeed from '../composables/useSeed'
import useIIIF from '@/composables/useIIIF'
import { useHistory } from './BreadCrumbs.vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'AssetGrid',
  components: { BaseSearch, TheMasonry, BaseButton, Filter },
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
    noHeader: {
      type: Boolean,
      default: false,
    },
    noFilters: {
      type: Boolean,
      default: false,
    },
    noRelations: {
      type: Boolean,
      default: false,
    },
  },
  setup: (props) => {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const selectedFilters = ref<string[]>([])
    const searchQueryForInput = ref<string>('')
    const searchQueryForQuery = ref<string>(props.defaultSearchQuery)
    let _skip: Maybe<Scalars['Int']> = 0
    const limit: Maybe<Scalars['Int']> = 25
    const endOfData = ref<Boolean>(false)
    const entityData = ref<GetEntitiesQuery | { results: Entity[] } | undefined>()
    const relationData = ref<GetEntitiesQuery | undefined>()
    const emptySearch = ref<Boolean>(false)
    const masonry = ref<any>(null)
    const { randomValue, refresh: refreshSeed } = useSeed()
    const { generateUrl, noImageUrl } = useIIIF()
    const { clearHistory } = useHistory()
    const frameList: string[] = [
      'entities/df39c7c0-7be2-4ba3-935a-fdaa04443d00',
      'entities/a408b8f5-3517-46e9-8572-25b4e1a7cb12',
      'entities/28db711b-8f0a-41bb-85b3-06449d51eae6',
      'entities/edd2f296-3b60-4963-8061-f41ded2d726f',
      'entities/914a91e6-c213-4f13-8e38-313be0502f93',
      'entities/c513d5db-53f4-419d-b9d5-199ce54cd3bc',
      'entities/ab13db4c-5a04-410a-898a-6e79a3a3ea74',
      'entities/03a4e320-8bc0-4a89-b804-e410af40befa',
      'entities/8d1ec60d-6546-4372-a914-1ec247c57a01',
      'entities/fffe30bd-fa8f-4fbe-891f-b430c7ddcfa6',
      'entities/4fe58733-9787-4e5b-9509-ce3ba6634cee',
      'entities/0d00a910-9beb-436a-a842-46890902aae0',
      'entities/b030ebc5-4d3c-4b52-be56-3e2f7dee849d',
      'entities/2165a1c8-6e4d-479c-9ba0-5cf28e4b9214',
      'entities/23a8b928-c92f-46e4-8738-51053b0c7659',
      'entities/425c5312-8453-4398-8609-2fa7cd79ec27',
      'entities/4097e14d-fcab-401b-b659-1b292fefee5c',
      'entities/867f65e9-5fa8-4319-a967-d8707a1ab7c6',
      'entities/e3645039-08ee-4ce6-b572-43e6c5405359',
      'entities/d3c38a38-168f-47df-b51d-06f06cdef95a',
    ]

    const getSelectedFilters = computed<string[]>(() => {
      if (props.defaultRelations?.length > 0 && selectedFilters.value.length === 0) {
        return props.defaultRelations
      } else if (route.query.touch) {
        return frameList
      }
      return selectedFilters.value
    })

    const { result, loading, fetchMore, onResult, refetch } = useQuery<GetEntitiesQuery, GetEntitiesQueryVariables>(
      GetEntitiesDocument,

      () => ({
        limit: limit,
        skip: (_skip = 0),
        searchValue: {
          value: searchQueryForQuery.value,
          isAsc: false,
          relation_filter: getSelectedFilters.value,
          randomize: getSelectedFilters.value.length > 0 || searchQueryForQuery.value !== '' ? false : true,
          seed: randomValue.value,
          key: 'title',
          has_mediafile: true,
          skip_relations: props.noRelations ? props.noRelations : false,
        },
      }),
      () => ({
        prefetch: false,
      })
    )

    const isEndOfResult = (queryResult: GetEntitiesQuery | undefined) => {
      if (queryResult) {
        if (queryResult && queryResult.Entities?.results && queryResult.Entities?.count && queryResult.Entities?.results.length >= queryResult.Entities?.count) {
          endOfData.value = true
        } else {
          endOfData.value = false
        }
      } else {
        endOfData.value = true
      }
    }

    onResult((queryResult) => {
      entityData.value = queryResult.data
      relationData.value = queryResult.data
      isEndOfResult(queryResult.data)
    })

    const getData = () => {
      if (searchQueryForQuery.value !== searchQueryForInput.value) {
        if (masonry.value && masonry.value.contructTiles) {
          masonry.value.contructTiles(limit, true)
        }
        selectedFilters.value = []
        searchQueryForQuery.value = searchQueryForInput.value
      }

      if (searchQueryForQuery.value === '' && searchQueryForInput.value === '') {
        resetQuery()
      }
    }

    const resetQuery = () => {
      refreshSeed()
      if (masonry.value && masonry.value.contructTiles) {
        masonry.value.contructTiles(limit, true)
      }
      selectedFilters.value = []
      if (searchQueryForQuery.value === '') {
        refetch()
      } else {
        searchQueryForInput.value = ''
        searchQueryForQuery.value = ''
      }
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
          if (fetchMoreResult?.Entities && fetchMoreResult?.Entities?.results && fetchMoreResult?.Entities?.results?.length < limit) {
            endOfData.value = true
          }
          if (previousData.Entities && previousData.Entities.results && fetchMoreResult!.Entities?.results) {
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

    const goToDetailsPage = (entity: Entity) => {
      if (!router.currentRoute.value.params.entityID) {
        clearHistory()
      }
      router.push({ path: '/entity/' + entity.object_id, query: route.query })
    }

    console.log(route.query.touch)

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
      resetQuery,
      generateUrl,
      noImageUrl,
      goToDetailsPage,
      route,
    }
  },
})
</script>
