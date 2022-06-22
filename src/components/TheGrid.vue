<template>
  <section class="flex flex-col items-center p-4 sm:p-0">
    <h1 v-show="defaultRelations.length === 0 && !noHeader" class="md:text-5xl sm:text-4xl text-3xl font-bold w-full sm:w-8/12 text-center py-10 block leading-normal">
      {{ t('main.title') }}
      <span class="text-accent-purple">{{ t('main.rich') }}</span>
    </h1>
    <div v-show="defaultRelations.length === 0 && !noHeader" class="w-full py-6 flex flex-col lg:flex-row justify-center items-center relative">
      <div v-show="!route.query.touch" class="w-full sm:w-8/12">
        <base-search v-model="searchQueryForInput" :loading="loading" :search-label="t('main.search')" @on-click="getData" @keyup.enter="getData" />
      </div>
      <div :class="route.query.touch ? 'transform scale-150' : 'lg:absolute lg:right-0'">
        <base-button class="inline⁻block w-max ml-10" :text="t('buttons.surprise')" custom-style="ghost-black" custom-icon="surprise" :icon-shown="true" :on-click="() => resetQuery()" />
      </div>
    </div>
    <Filter v-if="!noFilters" :selected="selectedFilters" :loading="loading" :filter-all="t('buttons.all-works')" :filters="relationData" @new-selected="updateSelectedFilters" />

    <div v-if="entityData && entityData.Entities" class="flex w-full flex-col items-center justify-center">
      <the-masonry
        ref="masonry"
        :small="small"
        :entities="entityData ? entityData.Entities : {}"
        :loading="loading"
        :items-each-load="limit"
        :end-of-data="endOfData"
        :generate-url="generateUrl"
        @load-more="loadMore"
      >
        <template #tile="{ entity, tile, small }">
          <router-link :to="{ path: '/entity/' + entity.object_id, query: route.query }" class="absolute top-0 left-0 z-30 h-full w-full" @click="!route.params.entityID ? clearHistory() : undefined">
            <span v-show="tile.mediafiles[0] !== 'placeholder'" class="w-full bg-text-dark h-full left-0 top-0 group-hover:opacity-50 opacity-0 absolute rounded-md"> </span>

            <span v-show="!small && tile.mediafiles[0] !== 'placeholder'" class="absolute w-full h-full max-h-full left-0 top-0 group-hover:opacity-100 opacity-0 overflow-hidden">
              <div class="w-full h-full flex flex-col items-center justify-center text-center text-text-white break-words">
                <p v-if="entity.title && entity.title[0]" class="opacity-100 mb-2 px-10 font-bold">
                  {{ entity.title[0].value }}
                </p>
                <p v-if="entity.description && entity.description[0] && tile.type === 'SingleImage'" id="description" class="opacity-100 px-10">
                  {{ entity.description[0].value.length > 100 ? entity.description[0].value.substring(0, 100) + '...' : entity.description[0].value }}
                </p>
                <base-button text="Lees meer" custom-style="ghost-white" :icon-shown="true" :icon-left="false" custom-icon="arrowRightLine" />

                <div v-if="!route.query.touch" @click.prevent="() => copyUrl(entity.id)">
                  <base-button class="z-10 w-0 mt-3 ml-3" custom-style="secondary-round" :icon-shown="true" custom-icon="link" />
                </div>
              </div>
            </span>
          </router-link>
        </template>
      </the-masonry>
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
import { useActiveBox } from '@/composables/useActiveBox'
import { useHistory } from './BreadCrumbs.vue'
import { useRouter, useRoute } from 'vue-router'
import useClipboard from 'vue-clipboard3'
import { iiif } from '@/app'

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
    const useAndFilter = ref<Boolean>(false)
    const entityData = ref<typeof GetEntitiesQuery | undefined>()
    const relationData = ref<Relation[] | undefined>([])
    const emptySearch = ref<Boolean>(false)
    const masonry = ref<any>(null)
    const { randomValue, refresh: refreshSeed } = useSeed()
    const { generateUrl, generateInfoUrl, noImageUrl } = iiif
    const { clearHistory } = useHistory()
    const frameList = ref<string[]>([])
    const queryEnabled = ref<boolean>(true)
    const { getActiveBox, activeBox } = useActiveBox()
    const { toClipboard } = useClipboard()

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

    const { result, loading, fetchMore, onResult, refetch } = useQuery<typeof GetEntitiesQuery, typeof GetEntitiesQueryVariables>(
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
          and_filter: useAndFilter.value,
        },
      }),
      () => ({
        prefetch: false,
        enabled: queryEnabled.value,
      })
    )

    const isEndOfResult = (queryResult: typeof GetEntitiesQuery | undefined) => {
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
      if (queryResult.data) {
        entityData.value = queryResult.data
        relationData.value = !router.currentRoute.value.params.entityID
          ? queryResult.data.Entities.relations
          : queryResult.data.Entities.relations.filter((relation: Relation) => relation.type != 'isIn')
        isEndOfResult(queryResult.data)
      }
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

    const updateSelectedFilters = (input: string[]) => {
      useAndFilter.value = input.length ? true : false
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

    const copyUrl = async (id: string) => {
      try {
        var suffix = '/entity/' + id
        var splitted = window.location.href.substring(0, window.location.href.lastIndexOf('/'))
        var url = splitted + suffix
        await toClipboard(url)
      } catch (e) {
        console.error(e)
      }
    }

    return {
      t,
      limit,
      getData,
      loading,
      result,
      selectedFilters,
      updateSelectedFilters,
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
      clearHistory,
      route,
      copyUrl,
    }
  },
})
</script>
