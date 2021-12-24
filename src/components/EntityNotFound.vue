<template>
<div class="flex justify-center items-center">
  <CardComponent :large="true" class="mx-4 sm:mx-0">
  <h1 class="text-lg font-bold">{{t('main.notfound')}}</h1>
  </CardComponent>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {CardComponent} from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'EntityNotFound',
  components: {
    CardComponent,
  },
  setup: () => {
    const { t } = useI18n()

    return {
      t,
    }
  }
})
  
</script>

