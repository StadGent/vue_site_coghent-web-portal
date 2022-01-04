<template>
<div class="grid grid-cols-2 gap-3 h-auto">
  <div class="w-full">
    <section>
      <div>
        <base-button class="inline⁻block w-full" :text="t('creator.goBack')" custom-style="details-black" custom-icon="arrowLeftLine" :icon-shown="true" />
      </div>
      <h1 class="md:text-5xl sm:text-4xl text-3xl font-bold w-full py-10 block leading-normal">
          Creator Details
      </h1>
    </section>
    <section>
      <base-meta-data-tab :tabNames="tabs"/>
      <base-meta-data
      key-word="Achternaam"
      type="Mendini"
      :error-text="t('details.modal.unknown')"
      />
    </section>
  </div>
  <div class="w-full justify-center items-center">
    <img src="" class="w-auto"/>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument, BaseButton, BaseMetaData, BaseMetaDataTab } from 'coghent-vue-3-component-library'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export default defineComponent({
  name: 'CreatorDetails',
  props: {

  },
  components: {
    BaseButton,
    BaseMetaData,
    BaseMetaDataTab,
    // TheGrid
  },
  setup: () => {
    const { t } = useI18n()
    const id = asString(useRoute().params['creatorID'])
    const { result, onResult } = useQuery(GetEntityByIdDocument, { id})
    const router = useRouter()
    const tabs: Array<string> = ['Design Museum Gent', 'STAM', 'Industriemuseum']

    console.log(id)

    onResult((queryResult: any) => {
      if (!queryResult.error) {
          console.log(queryResult)

      }
      // else{
      //     router.push('/entity/not-found')
      // }
    })
    return {
      t,
      tabs,
    }
  }
})
  
</script>

