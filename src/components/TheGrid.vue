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
import { useActiveBox } from '@/composables/useActiveBox'
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
    const limit: Maybe<Scalars['Int']> = route.query.touch ? 50 : 25
    const endOfData = ref<Boolean>(false)
    const entityData = ref<GetEntitiesQuery | undefined>()
    const relationData = ref<GetEntitiesQuery | undefined>()
    const emptySearch = ref<Boolean>(false)
    const masonry = ref<any>(null)
    const { randomValue, refresh: refreshSeed } = useSeed()
    const { generateUrl, noImageUrl } = useIIIF()
    const { clearHistory } = useHistory()
    const frameList = ref<string[]>([])
    const queryEnabled = ref<boolean>(true)
    const { getActiveBox, activeBox } = useActiveBox()

    const getSelectedFilters = computed<string[]>(() => {
      if (props.defaultRelations?.length > 0 && selectedFilters.value.length === 0) {
        return props.defaultRelations
      } else if (route.query.touch && !selectedFilters.value.length) {
        return frameList.value
      }
      return selectedFilters.value
    })

    onMounted(() => {
      if (route.query.touch) {
        queryEnabled.value = false
        getActiveBox().then((result) => {
          const frameIds: string[] = []
          if (result) {
            result.forEach((story: any) => {
              const storyFrameIds: string[] = story.frames.map((frame: Entity) => 'entities/' + frame.id)
              frameIds.push(...storyFrameIds)
            })
            frameList.value.push(...frameIds)
            queryEnabled.value = true
            refetch()
          }
        })
      } else {
        refetch()
      }
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
          // seed: randomValue.value,
          key: 'title',
          has_mediafile: true,
          skip_relations: props.noRelations ? props.noRelations : false,
        },
      }),
      () => ({
        prefetch: false,
        enabled: queryEnabled.value,
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
      frameList.value = []
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
      let newTiles = []
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
