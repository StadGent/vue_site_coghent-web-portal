<template>
  <div class="h-full p-8 flex text-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepOne.title') }}</h1>
    <div class="h-full m-8 bg-text-white border-2 border-black border-dashed flex flex-col justify-center items-center">
      <h2 class="font-normal text-2xl mb-4">{{ t(`myWorks.upload.stepOne.sleep`) }}</h2>
      <base-button :text="t('myWorks.upload.stepOne.uploadFromComputer')" :on-click="() => {}" custom-style="ghost-purple" :icon-shown="true" custom-icon="upload" class="px-2 mx-3 ml-3" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { BaseButton } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'UploadStepOne',
  components: { BaseButton },
  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>
