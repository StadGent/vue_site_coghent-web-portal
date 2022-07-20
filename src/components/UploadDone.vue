<template>
  <div class="m-8 h-full flex text-center items-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepDone.title') }}</h1>
    <div class="w-full h-full flex flex-col py-8 justify-center items-center">
      <div class="w-4/5 bg-text-white py-4 px-8 py-8 my-8 flex flex-col text-left flex-grow text-center items-center">
        <h2 class="text-lg font-bold">{{ t('myWorks.upload.stepDone.info') }}</h2>
        <h3 class="text-lg font-bold mt-8">{{ t('myWorks.upload.stepDone.thanks') }}</h3>
        <img class="mt-8 w-36" src="handsUp.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>
