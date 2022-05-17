
<template>
  <div class="w-full flex justify-center items-center flex-col items-center justify-center">
    <h2 class="text-lg my-2 font-bold w-3/4 text-center mt-32">{{ t('storybox.step3.thankyou') }}</h2>
    <h2 class="text-lg my-2 font-bold w-3/4 text-center mt-4">{{ t('storybox.step3.status') }}</h2>
      <img class="mt-16" src="SB_created.svg" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const { t } = useI18n()
    return { t }
  },
})
</script>

<style>
</style>