<template>
  <div v-if="result" class="w-full overflow-x-hidden">
    <div class="grid sm:grid-cols-2 sm:gap-3 h-auto w-full px-3">
      <div class="pb-0 sm:pb-24">
        <section>
          <h1 class="md:text-5xl sm:text-4xl text-3xl font-bold w-full py-10 block leading-normal">{{ result.Entity?.title[0]?.value }}</h1>
        </section>
      </div>
    </div>
    <div class="flex flex-col w-full px-3">
      <the-grid :small="false" :no-filters="true" :default-relations="[`entities/${id}`]" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument } from 'coghent-vue-3-component-library'
import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export default defineComponent({
  name: 'RelationDetail',
  components: {
    TheGrid,
  },
  setup: () => {
    const id = asString(useRoute().params['relationID'])
    const { result } = useQuery(GetEntityByIdDocument, { id })
    const { t } = useI18n()

    return {
      id,
      result,
      t,
    }
  },
})
</script>

<style scoped></style>
