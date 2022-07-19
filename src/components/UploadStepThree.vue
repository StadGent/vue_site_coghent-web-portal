<template>
  <div class="m-8 h-full flex text-center items-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepThree.title') }}</h1>
    <div class="w-full h-full grid grid-cols-2 gap-4 py-8">
      <div class="bg-text-white py-4 px-8 flex flex-col text-left">
        <h2 class="font-bold text-lg mb-4">{{ t('myWorks.upload.stepThree.metadata.title') }}</h2>
        <span class="pr-4 overflow-y-auto">
          <div class="flex flex-col my-4" v-for="question of metadata" :key="question.text">
            <label class="block text-base font-normal mb-2" :for="question.text"> {{ question.text }} </label>
            <input
              @update="(event) => (question.answer = event.target.value)"
              :value="question.answer"
              :id="question.text"
              class="bg-background-light appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>
        </span>
      </div>
      <div class="bg-text-white py-4 px-8 flex flex-col text-left">
        <h2 class="font-bold text-lg">{{ t('myWorks.upload.stepThree.relation.title') }}</h2>
        <input
          v-model="relationSearch"
          class="mt-8 bg-background-light appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          :placeholder="t(`myWorks.upload.stepThree.relation.search`)"
        />
        <h3 class="mt-8 text-base font-normal">{{ t(`myWorks.upload.stepThree.relation.relations`) }}</h3>
        <div class="flex-grow my-4 p-4 flex flex-row flex-wrap bg-background-light gap-2">
          <div v-for="tag of relations" :key="tag" class="mr-2 bg-tag-neutral max-h-8 w-fit flex items-center px-2 py-1">
            <span>tag</span> <BaseIcon icon="check" class="stroke-current ml-2 p-1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { Relation } from 'coghent-vue-3-component-library'
import { GetEntitiesDocument } from 'coghent-vue-3-component-library'
import { MetaKey, BaseIcon } from 'coghent-vue-3-component-library'
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { debounce } from 'ts-debounce'

type MetadataQuestion = {
  text: string
  answer: string | null
  key: typeof MetaKey | null
}

export default defineComponent({
  components: {
    BaseIcon,
  },
  setup() {
    const { t } = useI18n()
    const metadata = ref<Array<MetadataQuestion>>([])
    const relations = ref<Array<typeof Relation>>([])
    const relationSearch = ref<string>('')
    const searchValue = ref<string | null>(null)
    const queryRelations = ref<boolean>(true)

    const { result, onResult, loading, fetchMore } = useQuery(
      GetEntitiesDocument,
      () => ({
        limit: 10,
        skip: 0,
        searchValue: {
          value: '',
          isAsc: false,
          relation_filter: [],
          randomize: true,
          // seed: randomValue.value,
          key: 'title',
          has_mediafile: true,
          skip_relations: false,
          and_filter: true,
        },
      }),
      () => ({
        prefetch: false,
        enabled: queryRelations.value,
      })
    )

    onResult((response) => {
      console.log(`response`, response)
      queryRelations.value = false
    })

    watch(relationSearch, async (value) => {
      searchValue.value = null
      if (loading.value === false && queryRelations.value === false) {
        searchValue.value = await debounce(() => relationSearch.value, 3000)()
        await fetchMore({
          variables: {
            limit: 10,
            skip: 0,
            searchValue: {
              value: searchValue.value,
              isAsc: false,
              relation_filter: [],
              randomize: true,
              // seed: randomValue.value,
              key: 'title',
              has_mediafile: true,
              skip_relations: false,
              and_filter: true,
            },
          },
        })
        queryRelations.value = true
      }
    })
    watch(searchValue, async (value) => {
      console.log(`searchValue`, value)
    })

    const setMetadataQuestions = () => {
      for (let index = 1; index <= 4; index++) {
        metadata.value.push({
          text: t(`myWorks.upload.stepThree.metadata.q${index}`),
          answer: null,
          key: null,
        })
      }
    }

    const init = () => {
      searchValue.value = null
      setMetadataQuestions()
    }

    init()

    return {
      t,
      metadata,
      relations,
      relationSearch,
    }
  },
})
</script>
