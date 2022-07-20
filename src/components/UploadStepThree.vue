<template>
  <div class="m-8 h-full flex text-center items-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepThree.title') }}</h1>
    <div class="w-full h-full grid grid-cols-2 gap-4 py-8">
      <div class="bg-text-white py-4 px-8 flex flex-col text-left">
        <h2 class="font-bold text-lg mb-4">{{ t('myWorks.upload.stepThree.metadata.title') }}</h2>
        <span class="pr-4 overflow-y-auto">
          <div class="flex flex-col my-4" v-for="question of metadata" :key="question.text">
            <label class="block text-base font-normal mb-2" :for="question.text"> {{ question.text }} </label>

            <input type="text" v-modal="testVar">
            <p>testvar{{testVar}}</p>
            <input
              @update="(event) => question.answer = event.target.value"
              :value="question.answer"
              :id="question.text"
              class="bg-background-light appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
            <p>answer: {{question}}</p>
          </div>
        </span>
      </div>
      <div class="bg-text-white py-4 px-8 flex flex-col text-left">
        <h2 class="font-bold text-lg">{{ t('myWorks.upload.stepThree.relation.title') }}</h2>
        <span>
          <input
            v-model="relationSearch"
            class="mt-8 bg-background-light appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            :placeholder="t(`myWorks.upload.stepThree.relation.search`)"
          />
          <ul v-if="dropdownResults.length >= 1" class="px-2">
            <li v-for="result of dropdownResults" :key="result" class="bg-background-medium text-left flex items-center h-8 px-4 py-1 hover:bg-background-dark" @click="addToRelations(result)">
              {{ result }}
            </li>
          </ul>
        </span>

        <h3 class="mt-8 text-base font-normal">{{ t(`myWorks.upload.stepThree.relation.relations`) }}</h3>
        <div class="flex-grow my-4 p-4 flex flex-row flex-wrap bg-background-light gap-2">
          <div v-for="relation of relations" :key="relation" class="mr-2 bg-tag-neutral max-h-8 w-fit flex items-center px-2 py-1">
            <span>relation</span> <BaseIcon icon="close" class="stroke-current ml-2 p-1 cursor-pointer" :on-click="removeFromRelations(relation)" />
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

export type MetadataQuestion = {
  text: string
  answer: string | null
  key: typeof MetaKey | null
}

export default defineComponent({
  components: {
    BaseIcon,
  },
  emits: [],
  setup(props, { emit }) {
    const { t } = useI18n()
    const metadata = ref<Array<MetadataQuestion>>([])
    const relations = ref<Array<typeof Relation>>(['dsds', 'sdsd'])
    const relationSearch = ref<string>('')
    const searchValue = ref<string | null>(null)
    const queryRelations = ref<boolean>(false)
    const testVar = ref<string>('')
    const dropdownResults = ref<Array<string>>([])

    const { onResult, loading } = useQuery(
      GetEntitiesDocument,
      () => ({
        limit: 10,
        skip: 0,
        searchValue: {
          value: '',
          isAsc: false,
          relation_filter: [searchValue.value],
          randomize: true,
          // seed: randomValue.value,
          key: 'title',
          has_mediafile: false,
          skip_relations: true,
          and_filter: true,
        },
      }),
      () => ({
        prefetch: false,
        enabled: true,
      })
    )

    onResult((response) => {
      console.log(`response`, response)
      // dropdownResults.value = response.data.Entities.results
    })

    watch(relationSearch, async (value) => {
      searchValue.value = null
      if (loading.value === false) {
        searchValue.value = await debounce(() => relationSearch.value, 700)()
      }
    })
    watch(searchValue, async (value) => {
      console.log(`searchValue`, value)
    })

    watch(
      () => metadata,
      async (value) => {
        console.log(`metadata`, value)
      }
    )
    watch(
      () => testVar,
      async (value) => {
        console.log(`testVar`, value)
      }
    )

    const setMetadataQuestions = () => {
      const metaTags: Array<typeof MetaKey> = ['title', 'description', 'maker', 'periode']
      for (let index = 1; index <= 4; index++) {
        metadata.value.push({
          text: t(`myWorks.upload.stepThree.metadata.q${index}`),
          answer: null,
          key: metaTags[index - 1],
        })
      }
    }

    const addToRelations = (_result: string) => {
      console.log(`adding to relations`, _result)
      relations.value.push({} as typeof Relation)
    }

    const removeFromRelations = (_relation: typeof Relation) => {
      relations.value = relations.value.filter((relation: typeof Relation) => relation != _relation)
    }

    const updateMetadata = (_event: any, _question: MetadataQuestion) => {
      console.log(`update metadata`)
      console.log(`_event`, _event.target.value)
      console.log(`_question`, _question)
      // _question.answer = _event.target.value

      console.log(`metadata`, metadata)
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
      dropdownResults,
      addToRelations,
      removeFromRelations,
      updateMetadata,
      testVar
    }
  },
})
</script>
