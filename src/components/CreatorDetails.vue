<template>
<div v-if="result" class="w-full overflow-x-hidden">
  <div class="grid sm:grid-cols-2 sm:gap-3 h-auto w-full px-3">
    <div v-if="person" class="pb-0 sm:pb-24">
      <section>
        <div>
          <base-button class="inline⁻block w-full" :text="t('creator.goBack')+ ' ' + route.query.fromPage" custom-style="details-black" custom-icon="arrowLeftLine" :icon-shown="true" @click="goToPreviousPage" />
        </div>
        <h1 class="md:text-5xl sm:text-4xl text-3xl font-bold w-full py-10 block leading-normal">{{person.fullName}}</h1>
      </section>
      <div class="w-screen">
          <base-meta-data-tab :tab-names="tabs" :hidden="true"/>
        </div>
      <section v-if="info">
        <base-meta-data v-for="(info, index) in person.extraInfo" :key="index" :key-word="t('creator.' + info.key)" :type="info.value" :error-text="t('details.modal.unknown')" class="w-full" />
      </section>
      <section v-else>
        <p>{{t('creator.noMetadata')}}</p>
      </section>
    </div>
    <div class="w-full justify-center items-center">
      <img src="" class="w-auto" />
    </div>
  </div>
  <div class="flex flex-col w-full px-3">
  <h2 class="md:text-5xl sm:text-4xl text-3xl font-bold w-full text-center py-10 block leading-normal">{{t('creator.moreWorks') + ' ' + person.fullName}}</h2>
<the-grid :small="true" :no-header="true" class="sm:mt-24" :defaultRelations="relationStringArray"/>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetCreatorByIdDocument, BaseButton, BaseMetaData, BaseMetaDataTab, FullRelationFragment } from 'coghent-vue-3-component-library'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export type Metadata = {
  key:string
  value:string
}

export type Person = {
  fullName?:string
  extraInfo?:Metadata[]
}

export default defineComponent({
  name: 'CreatorDetails',
  components: {
    BaseButton,
    BaseMetaData,
    BaseMetaDataTab,
    TheGrid
  },
  props: {},
  setup: () => {
    const { t } = useI18n()
    const id = asString(useRoute().params['creatorID'])
    const { result, onResult } = useQuery(GetCreatorByIdDocument, { id })
    const router = useRouter()
    const route = useRoute()
    const metadata = ref<Metadata[]>()
    const person = ref<Person>()
    const relationStringArray = ref<string[]>([])
    const relationsLabelArray = ref<string[]>([])
    const tabs: Array<string> = ['Design Museum Gent', 'STAM', 'Industriemuseum']

    const goToPreviousPage = () => {
      router.back()
    }

    const getNameFromMetadata = (key: string) => {
      if (metadata.value){
        const foundItem = metadata.value.find(element => element.key == key)
        metadata.value = metadata.value.filter(element => element != foundItem)
        return foundItem?.value
      }
    }

    onResult((queryResult: any) => {
      if (!queryResult.error) {
        const tempMetadata: Array<Metadata> = queryResult.data.Entity?.metadata
        metadata.value = tempMetadata.filter(item => item.value != '')
        person.value = {
          fullName: getNameFromMetadata('fullname'),
          extraInfo:metadata.value
        }
        
        queryResult.data.Entity?.relations
          .forEach((relation: any) => {
            relationStringArray.value.push(relation.key)
            relation.label && relationsLabelArray.value.push(relation.label)
          })
        
      }
      else{
          router.push('/entity/not-found')
      }
    })
    return {
      t,
      tabs,
      goToPreviousPage,
      route,
      person,
      result,
      relationStringArray
    }
  },
})
</script>