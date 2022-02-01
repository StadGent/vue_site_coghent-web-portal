<template>
  <!-- main-->
  <div class="sm:grid sm:grid-cols-2 mt-20 flex-col">
    <section class="flex items-center justify-between px-10 mb-5 sm:mb-0">
      <div v-show="loading" class="h-80 animate-pulse bg-background-medium rounded-md shadow w-full" />
      <the-carousel v-if="!loading && photos" :source="photos" :infotext="t('main.info')" :mediafiles="mediaFiles" @opening-ccmodal="openCCModal" />
    </section>
    <CardComponent :large="true" class="mx-4 sm:mx-0">
      <div class="flex bg-background-medium px-10 py-10" :class="{ [`animate-pulse h-80 justify-center items-center`]: loading, [`flex-col`]: !loading }">
        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h1 v-if="result" class="text-lg font-bold">
          {{ result.Entity?.title[0]?.value }}
        </h1>
        <div v-if="result" class="pt-5 font-light">
          <p v-show="result.Entity?.description && result.Entity?.description[0]">
            {{ result.Entity?.description[0]?.value }}
          </p>
        </div>
        <div v-if="result" class="pt-5 font-medium">
          <a
            v-for="metaData in types"
            :key="metaData.id"
            class="inline-block px-2 py-2 bg-background-dark mr-4 mb-4 bg-opacity-50 cursor-pointer hover:underline"
            :href="
              metaData.id && metaData.relation == 'vervaardiger'
                ? '/creator/' + metaData.id.replace('entities/', '') + '?fromPage=' + result.Entity?.title[0]?.value
                : metaData.id
                ? '/relation/' + metaData.id.replace('entities/', '')
                : undefined
            "
            >{{ metaData.label }}</a
          >
        </div>
        <base-button
          v-if="photos"
          class="inline⁻block w-max ml-3 mt-3 hover:underline"
          :text="t('details.more')"
          custom-style="ghost-black"
          custom-icon="info"
          :icon-shown="true"
          :on-click="openDetailsModal"
        />
      </div>
    </CardComponent>
    <section v-if="result" class="col-span-2">
      <h2 class="font-bold text-2xl w-full text-center pt-10 mb-2">
        {{ t('details.discover') }}
      </h2>
      <the-grid v-if="relationStringArray.length > 0" :small="true" :default-relations="relationStringArray" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument, TheCarousel, CardComponent, BaseButton, FullRelationFragment, ImageSource } from 'coghent-vue-3-component-library'
import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'
import { useCCModal } from './CreativeModal.vue'
import { useDetailsModal } from './DetailsModal.vue'
import useIIIF from '../composables/useIIIF'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

const metaDataInLabel: string[] = [
  'objectnaam',
  'object_category',
  'MensgemaaktObject.draagt',
  'Entiteit.maaktDeelUitVan',
  'MaterieelDing.productie',
  'MensgemaaktObject.maaktDeelUitVan',
  'MaterieelDing.bestaatUit',
  'MaterieelDing.isOvergedragenBijVerwerving',
  'Entiteit.classificatie',
  'Entiteit.wordtNaarVerwezenDoor',
]

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
    const router = useRouter()
    const { result, onResult, loading } = useQuery(GetEntityByIdDocument, { id })
    const selectedImageIndex = ref<Number>(0)
    const selectedImageMetaData = ref<any | undefined>()
    const photos = ref<ImageSource[] | undefined>()
    const mediaFiles = ref<any | undefined>()
    const types = ref<any[] | undefined>()
    const relationStringArray = ref<string[]>([])
    const relationsLabelArray = ref<string[]>([])
    const { openCCModal } = useCCModal()
    const { openDetailsModal, setEntity } = useDetailsModal()
    const { generateUrl, generateInfoUrl, noImageUrl } = useIIIF()

    onResult((queryResult: any) => {
      if (!queryResult.error) {
        const photosArray: ImageSource[] = []

        mediaFiles.value = queryResult.data.Entity?.mediafiles
        queryResult.data.Entity?.mediafiles.forEach((value: any) => {
          if (value.filename) {
            photosArray.push({
              imageUrl: generateUrl(value.filename, 'full'),
              infoJson: generateInfoUrl(value.filename),
              fallBackUrl: generateUrl(value.filename, 'full', 'max'),
            })
          }
        })
        photos.value = photosArray.length === 0 ? [{ imageUrl: noImageUrl, infoJson: noImageUrl, fallBackUrl: noImageUrl }] : photosArray

        // selectedImage.value = queryResult.data.Entity?.mediafiles[selectedImageIndex]

        queryResult.data.Entity?.relations
          .filter((filter: FullRelationFragment) => filter.label && filter.label !== '')
          .forEach((relation: any) => {
            relationStringArray.value.push(relation.key)
            relation.label && relationsLabelArray.value.push(relation.label)
          })

        const typeArray: any[] = []
        // queryResult.data.Entity?.metadata.forEach((value: any) => {
        //   if (metaDataInTag.includes(value.key)) {
        //     typeArray.push(value.value)
        //   }
        // })
        queryResult.data.Entity?.relations.forEach((value: any) => {
          if (!metaDataInLabel.includes(value.label)) {
            value.value && typeArray.push({ label: value.value, id: value.key, relation: value.label })
          }
        })
        types.value = typeArray

        if (result.value && result.value.Entity) {
          setEntity({ ...result.value.Entity, types: typeArray })
        }
      } else {
        router.push('/entity/not-found')
      }
    })

    const { t } = useI18n()

    return {
      result,
      t,
      photos,
      types,
      relationStringArray,
      openCCModal,
      openDetailsModal,
      selectedImageIndex,
      selectedImageMetaData,
      mediaFiles,
      router,
      loading,
    }
  },
})
</script>

<style scoped></style>
