<template>
  <div class="m-8 h-full flex text-center items-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepThree.title') }}</h1>
    <div class="w-full h-full grid grid-cols-2 gap-4 py-8">
      <div class="bg-text-white py-4 px-8 flex flex-col text-left">
        <h2 class="font-bold text-lg mb-4">{{ t('myWorks.upload.stepThree.metadata.title') }}</h2>
        <span class="pr-4 overflow-y-auto">
          <div class="flex flex-col my-4" v-for="question of metadata" :key="question.text" @change="updateMetadata">
            <label class="block text-base font-normal mb-2" :for="question.text"> {{ question.text }} </label>
            <input
              v-model="question.answer"
              :key="question.text"
              class="bg-background-light appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>
        </span>
      </div>
      <div class="bg-text-white py-4 px-8 flex flex-col text-left">
        <h2 class="font-bold text-lg">{{ t('myWorks.upload.stepThree.relation.title') }}</h2>
        <span>
          <input
            @change="updatedRelations"
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
          <div v-for="relation of relations" :key="relation" class="mr-2 bg-tag-neutral max-h-8 w-fit flex items-center px-2 py-1" @change="updatedRelations">
            <span>relation</span> <BaseIcon icon="close" class="stroke-current ml-2 p-1 cursor-pointer" :on-click="removeFromRelations(relation)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Relation } from 'coghent-vue-3-component-library'
import { MetaKey, BaseIcon, Metadata } from 'coghent-vue-3-component-library'
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { debounce } from 'ts-debounce'
import { uploadState } from 'coghent-vue-3-component-library'

export type MetadataQuestion = {
  text: string
  answer: string | null
  key: typeof MetaKey | null
}

export default defineComponent({
  components: {
    BaseIcon,
  },
  emits: [`updatedMetadata`, 'updatedRelations'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const metadata = ref<Array<MetadataQuestion>>([])
    const relations = ref<Array<typeof Relation>>([])
    const relationSearch = ref<string>('')
    const searchValue = ref<string | null>(null)
    const dropdownResults = ref<Array<string>>([])

    watch(relationSearch, async (value) => {
      searchValue.value = null
      searchValue.value = await debounce(() => relationSearch.value, 700)()
    })

    watch(searchValue, (value) => {
      console.log(`searchValue`, value)
    })

    const setMetadataQuestions = () => {
      const metaTags: Array<typeof MetaKey> = ['title', 'description', 'maker', 'periode']
      for (let index = 1; index <= 4; index++) {
        const match = uploadState.metadata.find((meta: typeof Metadata) => meta.key === metaTags[index - 1])
        metadata.value.push({
          text: t(`myWorks.upload.stepThree.metadata.q${index}`),
          answer: match !== undefined ? match.value : null,
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

    const updateMetadata = () => {
      const updatedMetadata: Array<typeof Metadata> = []
      for (const meta of metadata.value) {
        if (meta.answer != null && meta.answer != '') {
          updatedMetadata.push({
            key: meta.key,
            value: meta.answer,
            label: meta.text,
          } as typeof Metadata)
        }
      }
      emit(`updatedMetadata`, updatedMetadata)
    }

    const updatedRelations = () => {
      console.log(`updatedRelations`)
      emit(`updatedRelations`, relations.value)
      console.log(`relations`, relations.value)
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
      updatedRelations,
    }
  },
})
</script>
