<template>
  <section class="flex flex-col items-center">
    <h1 class="md:text-5xl sm:text-4xl text-3xl font-bold w-8/12 text-center py-10 block leading-normal">
      {{ t('details.notFound.title') }}
      <span class="text-accent-purple">{{ t('details.notFound.not') }}</span>
      {{ t('details.notFound.found') }}
    </h1>
  </section>
  <section class="col-span-2">
    <h2 class="font-bold text-2xl w-full text-center pt-10 mb-2">
      {{ t('details.notFound.other') }}
    </h2>
    <the-grid :small="true" :no-header="true" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'EntityNotFound',
  components: {
    TheGrid,
  },
  setup: () => {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>
