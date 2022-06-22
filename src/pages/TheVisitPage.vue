<template>
  <div class="flex flex-col items-center justify-center w-full">
    <BaseIcon class="black p-12 opacity-50" icon="link" :width="250" :height="250" /><BoxVisitCode :code="code" />
    <div class="flex items-center mt-12 flex-col-reverse md:flex-row">
      <CircleLoader class="mt-4 md:mt-0" />
      <p>{{ t('visit.linkCodeToAccount') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { BoxVisitCode, BaseIcon, CircleLoader, useStoryBox } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { apolloClient } from '@/app'

export default defineComponent({
  name: 'TheVisitPage',
  components: { BoxVisitCode, BaseIcon, CircleLoader },
  props: {},
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const code = ref<string | string[]>(route.params.visitCode)

    watch(
      () => code.value,
      () => {
        if (code.value.length == 8) {
          const link = useStoryBox(apolloClient).linkCodeToUser(code.value)
          if (!link.errors) {
            console.log('Linked')
            console.log(link)
          }
        }
      }
    )

    return { t, code }
  },
})
</script>

<style scoped>
.black {
  stroke: black;
}
</style>
