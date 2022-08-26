<template>
  <div class="m-8 h-full flex text-center items-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepThree.title') }}</h1>
    <div class="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 py-8 overflow-y-scroll">
      <div class="bg-text-white py-4 px-4 lg:px-8 flex flex-col text-left shadow-md">
        <h2 class="font-bold text-lg mb-4 pb-4">{{ t('myWorks.upload.stepThree.metadata.title') }}</h2>
        <span class="pr-4 overflow-y-auto">
          <div v-for="question of metadata" :key="question.text" class="flex flex-col my-4" @change="updateMetadata">
            <label class="block text-base font-normal mb-2" :for="question.text"> {{ question.text }} </label>
            <input
              :key="question.text"
              v-model="question.answer"
              class="bg-background-light appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>
        </span>
      </div>
      <div class="bg-text-white py-4 px-8 flex flex-col text-left shadow-md">
        <h2 class="font-bold text-lg">{{ t('myWorks.upload.stepThree.relation.title') }}</h2>
        <span>
          <input
            v-model="relationSearch"
            class="mt-8 bg-background-light appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            :placeholder="t(`myWorks.upload.stepThree.relation.search`)"
            @change="updatedRelations"
          />
          <ul v-if="dropdownResults.length >= 1 && relationSearch.length" class="px-2 max-h-20 overflow-y-scroll">
            <li v-for="item of dropdownResults" :key="item" class="bg-background-medium text-left flex items-center h-8 px-4 py-1 hover:bg-background-dark" @click="addToRelations(item)">
              {{ item.value }}
            </li>
          </ul>
        </span>

        <h3 class="mt-8 text-base font-normal">{{ t(`myWorks.upload.stepThree.relation.relations`) }}</h3>
        <div class="flex-grow flex my-4 p-4 flex flex-row flex-wrap bg-background-light gap-2">
          <div v-for="relation of relations" :key="relation" class="mr-2 bg-tag-neutral max-h-14 w-fit flex items-center px-2 py-1">
            <p>{{ relation.value }}</p>
            <BaseIcon icon="close" class="stroke-current ml-2 p-1 cursor-pointer" @click="() => removeFromRelations(relation)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Relation, GetUploadRelationsDocument } from 'coghent-vue-3-component-library'
import { BaseIcon, Metadata, KeyValuePair } from 'coghent-vue-3-component-library'
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { debounce } from 'ts-debounce'
import { uploadState } from 'coghent-vue-3-component-library'
import { useQuery } from '@vue/apollo-composable'
import { Entity } from 'coghent-vue-3-component-library'
import { getMetadataOfTypeFromEntity } from 'coghent-vue-3-component-library'
import uploadWizard, { MetadataQuestion } from '@/composables/uploadWizard'

export default defineComponent({
  components: {
    BaseIcon,
  },
  emits: [`updatedMetadata`, 'updatedRelations', 'stepDone'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const { getMetadataWithQuestions } = uploadWizard()
    const metadata = ref<Array<MetadataQuestion>>([])
    const relations = ref<Array<typeof Relation>>([])
    const relationSearch = ref<string>('')
    const dropdownResults = ref<Array<typeof KeyValuePair>>([])

    const { fetchMore } = useQuery(GetUploadRelationsDocument, { searchValue: '' })

    const setRelationDropdownData = (_entities: Array<typeof Entity>) => {
      const data: Array<typeof KeyValuePair> = []
      for (const entity of _entities) {
        let value = null
        if (entity.type === 'person') {
          const found = getMetadataOfTypeFromEntity(entity, 'fullname')
          found ? (value = found.value) : null
        }
        if (entity.type === 'thesaurus') {
          const found = getMetadataOfTypeFromEntity(entity, 'title')
          found ? (value = found.value) : null
        }
        if (value != null) {
          data.push({
            key: entity.id,
            value: value,
          } as typeof KeyValuePair)
        }
      }
      dropdownResults.value = data
    }

    watch(relationSearch, async (value) => {
      relationSearch.value = await debounce(() => relationSearch.value, 100)()
      dropdownResults.value = []
      if (relationSearch.value !== '' || relationSearch.value !== null) {
        const response = await fetchMore({ variables: { searchValue: relationSearch.value } })
        response?.data.GetUploadRelations ? setRelationDropdownData(response.data.GetUploadRelations.results) : null
      }
    })

    const addToRelations = (_keyValue: typeof KeyValuePair) => {
      const found = relations.value.find((keypair) => keypair.key === _keyValue.key)
      if (found === undefined) {
        relations.value.push({
          key: _keyValue.key,
          value: _keyValue.value,
        } as typeof Relation)
        updateRelations()
      }
    }

    const removeFromRelations = (_relation: typeof KeyValuePair) => {
      relations.value = relations.value.filter((relation: typeof Relation) => relation != _relation)
      updateRelations()
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

    const setRelations = () => {
      if (uploadState.relations && uploadState.relations.length >= 1) {
        for (const relation of uploadState.relations) {
          relations.value.push({ key: relation.key, value: relation.value } as typeof KeyValuePair)
        }
      } else if (uploadState.relation === undefined) {
        uploadState.relations = []
      }
    }

    const updateRelations = () => {
      emit(`updatedRelations`, relations.value)
      dropdownResults.value = []
      relationSearch.value = ''
    }

    const checkFields = () => {
      emit(`stepDone`, false)
    }

    const init = () => {
      console.log(`uploadState.metadata`, uploadState.metadata)
      metadata.value = getMetadataWithQuestions()
      setRelations()
      checkFields()
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
      updateRelations,
    }
  },
})
</script>
