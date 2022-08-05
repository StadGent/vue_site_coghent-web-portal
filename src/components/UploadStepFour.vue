<template>
  <div class="m-8 h-full flex text-center items-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepFour.title') }}</h1>
    <div class="w-full h-full flex flex-col pb-8 mt-8 items-center overflow-y-scroll">
      <div class="w-4/5 bg-text-white w-full py-4 px-4 lg:px-8 flex flex-col items-center lg:items-start lg:flex-row text-left mb-6">
        <div class="w-2/5 flex flex-grow justify-center items-start py-8">
          <img :src="setMediafile()" alt="" />
        </div>
        <div class="w-3/5 flex flex-grow flex-col text-left p-8 w-full">
          <div class="flex flex-col mb-4" v-for="meta of metadata" :key="meta.key">
            <p class="text-base font-normal mb-2 text-touchtable-dark opacity-50">{{ meta.text }}</p>
            <h4 class="font-semibold text-lg">{{ meta.answer !== null ? meta.answer : t('details.modal.unknown') }}</h4>
          </div>
          <div>
            <h4 v-if="uploadState.relations.length >= 1" class="text-base font-normal mb-2 text-touchtable-dark opacity-50">{{ t(`myWorks.upload.stepFour.relations`) }}</h4>
            <div class="flex flex-row flex-wrap gap-2">
              <p v-for="relation of uploadState.relations" :key="relation.key" class="mr-2 bg-tag-neutral flex items-center px-2 py-1">
                {{ relation.value }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import uploadWizard, { MetadataQuestion } from '@/composables/uploadWizard'
import { uploadState, NO_IMAGE_PATH } from 'coghent-vue-3-component-library'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const { getMetadataWithQuestions } = uploadWizard()
    const metadata = ref<Array<MetadataQuestion>>(getMetadataWithQuestions())

    const setMediafile = () => {
      let imageSrc = NO_IMAGE_PATH
      if (uploadState.file !== null) imageSrc = uploadState.file
      if (uploadState.base64Image !== null) imageSrc = uploadState.base64Image
      return imageSrc
    }

    return {
      t,
      uploadState,
      setMediafile,
      metadata,
    }
  },
})
</script>
