<template>
  <!-- main-->
  <div v-if="result" class="sm:grid sm:grid-cols-2 mt-20 flex-col">
    <section class="flex items-center justify-between px-10 mb-5 sm:mb-0">
      <the-carousel v-if="photos" :source="photos" :infotext="t('main.info')" @opening-ccmodal="openCCModal" />
    </section>
    <CardComponent v-if="result" :large="true" class="mx-4 sm:mx-0">
      <div class="flex flex-col bg-background-medium px-10 py-10">
        <h1 class="text-lg font-bold">
          {{ result.Entity?.title[0]?.value }}
        </h1>
        <div class="pt-5 font-light">
          <p v-show="result.Entity?.description && result.Entity?.description[0]">
            {{ result.Entity?.description[0]?.value }}
          </p>
        </div>
        <div class="pt-5 font-medium">
          <span v-for="metaData in types" :key="metaData" class="inline-block px-2 py-2 bg-background-dark mr-4 mb-4 bg-opacity-50">{{ metaData }}</span>
        </div>
        <base-button class="inline⁻block w-max ml-3 mt-3" :text="t('details.more')" custom-style="ghost-black" custom-icon="info" :icon-shown="true" :on-click="openDetailsModal" />
      </div>
    </CardComponent>
    <section class="col-span-2">
      <h2 class="font-bold text-2xl w-full text-center pt-10 mb-2">
        {{ t('details.discover') }}
      </h2>
      <the-grid v-if="relationStringArray.length > 0" :small="true" :default-relations="relationStringArray" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument, TheCarousel, CardComponent, BaseButton, BaseModal, FullRelationFragment } from 'coghent-vue-3-component-library'
import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'
import { useCCModal } from './CreativeModal.vue'
import { useDetailsModal } from './DetailsModal.vue'
import useIIIF from '../composables/useIIIF'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

const metaDataInTag: string[] = ['carriedOutBy', 'isTypeOf', 'isIn']

export default defineComponent({
  name: 'EntityDetails',
  components: {
    TheGrid,
    CardComponent,
    TheCarousel,
    BaseButton,
  },
  setup: () => {
    const id = asString(useRoute().params['entityID'])
    const router = useRouter();
    const { result, onResult } = useQuery(GetEntityByIdDocument, { id })
    const selectedImageIndex = ref<number>(0)
    const relations = ref([])
    const photos = ref<string[] | undefined>()
    const types = ref<any[] | undefined>()
    const relationStringArray = ref<string[]>([])
    const relationsLabelArray = ref<string[]>([])
    const { openCCModal } = useCCModal()
    const { openDetailsModal, setEntity } = useDetailsModal()
    const { generateUrl, noImageUrl } = useIIIF()

    onResult((queryResult: any) => {
      if (!queryResult.error){
      const photosArray: string[] = []

      queryResult.data.Entity?.mediafiles.forEach((value: any) => {
        if (value.filename) {
          photosArray.push(generateUrl(value.filename, 'full'))
        }
      })
      photos.value = photosArray.length === 0 ? [noImageUrl] : photosArray

      queryResult.data.Entity?.relations
        .filter((filter: FullRelationFragment) => filter.label && filter.label !== '')
        .forEach((relation: any) => {
          relationStringArray.value.push(relation.key)
          relation.label && relationsLabelArray.value.push(relation.label)
        })

      const typeArray: any[] = []
      queryResult.data.Entity?.metadata.forEach((value: any) => {
        if (metaDataInTag.includes(value.key)) {
          typeArray.push(value.value)
        }
      })
      console.log(queryResult.data.Entity?.relations)
      queryResult.data.Entity?.relations.forEach((value: any) => {
        if (metaDataInTag.includes(value.type)) {
          typeArray.push(value.label)
        }
      })
      types.value = typeArray

      if (result.value && result.value.Entity) {
        setEntity(result.value.Entity)
      }
     }else{
       router.push('/entity/not-found')
     }})

    const { t } = useI18n()

    return {
      result,
      selectedImageIndex,
      relations,
      t,
      photos,
      types,
      relationStringArray,
      relationsLabelArray,
      openCCModal,
      openDetailsModal,
    }
  },
})
</script>

<style scoped></style>
