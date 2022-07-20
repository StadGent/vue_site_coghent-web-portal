<template>
  <div class="m-8 h-full flex text-center items-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepFour.title') }}</h1>
    <div class="w-full h-full flex flex-col py-8 justify-center items-center">
      <div class="w-4/5 bg-text-white py-4 px-8 flex flex-row text-left">
        <div class="w-2/5 flex flex-grow justify-center items-center py-8">
          <img src="/no-image.png" alt="" />
        </div>
        <div class="w-3/5 flex flex-grow flex-col text-left p-8">
          <div v-for="meta of uploadState.metadata" :key="meta.key" class="flex flex-col mb-4">
            <p class="text-base font-normal mb-2 text-touchtable-dark opacity-50">{{ meta.label }}</p>
            <h4 class="font-semibold text-lg">{{ meta.value }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { uploadState, Metadata } from 'coghent-vue-3-component-library'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const metadata = ref<Array<typeof Metadata>>([])

    const init = () => {}

    init()

    return {
      t,
      uploadState,
    }
  },
})
</script>
