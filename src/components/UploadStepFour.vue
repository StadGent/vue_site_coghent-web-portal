<template>
  <div class="m-8 h-full flex text-center items-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepFour.title') }}</h1>
    <div class="w-full h-full flex flex-col py-8 justify-center items-center">
      <div class="w-3/4 bg-text-white py-4 px-8 flex flex-row text-left">
        <div class="w-2/5 flex flex-grow justify-center items-center py-8">
          <img src="/no-image.png" alt="">
        </div>
        <div class="w-3/5 flex flex-grow text-left">
          
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { uploadState } from 'coghent-vue-3-component-library/lib'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { MetadataQuestion } from './UploadStepThree.vue'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const metadata = ref<Array<MetadataQuestion>>([])

    const setMetadata = () => {
      for (let index = 1; index <= 4; index++) {
        const answer = uploadState.metadata
        metadata.value.push({
          text: t(`myWorks.upload.stepThree.metadata.q${index}`),
          answer: null,
          key: null,
        })
      }
    }

    const init = () => {
      setMetadata()
    }

    return {
      t,
    }
  },
})
</script>
