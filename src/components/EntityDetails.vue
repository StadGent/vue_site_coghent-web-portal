<template>
  <!-- main-->
  <bread-crumbs class="mx-4 sm:mx-0" />
  <entity-actions class="hidden mt-10 lg:inline-flex" v-if="result && result.Entity" :entity="result.Entity" />
  <div class="lg:grid lg:grid-cols-2 flex-col mt-4">
    <span>
      <section class="flex justify-between px-10 mb-5 sm:mb-0">
        <div v-show="loading" class="h-80 animate-pulse bg-background-medium rounded-md shadow w-full" />
        <the-carousel
          v-if="!loading && carouselFiles"
          :source="carouselFiles"
          :infotext="t('main.info')"
          :mediafiles="mediaFiles"
          :is-touch="route.query.touch ? true : false"
          :mediafile-url="mediafileUrl"
          @opening-ccmodal="openCCModal"
          @currentPictureIndex="setPictureIndex"
        />
      </section>
      <entity-actions class="my-10 lg:hidden" v-if="result && result.Entity" :entity="result.Entity" />
    </span>

    <CardComponent :large="true" class="mx-2 md:mx-4 sm:mx-0">
      <div class="flex bg-background-medium px-0 md:px-10 py-10" :class="{ [`animate-pulse h-80 justify-center items-center flex-col overflow-hidden`]: loading, [`flex-col`]: !loading }">
        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div v-if="result" class="flex justify-between items-center">
          <h1 class="text-lg font-bold">
            {{ result.Entity?.title[0]?.value }}
          </h1>
          <BaseIcon title="Melden kwetsende content" class="cursor-pointer" icon="alert" @click="openOffensiveContentModal" />
        </div>
        <div v-if="result" class="pt-5 font-light">
          <p v-show="result.Entity?.description && result.Entity?.description[0]">
            {{ result.Entity?.description[0]?.value }}
          </p>
        </div>
        <div v-if="result" class="pt-5 font-medium">
          <div
            v-for="metaData in filterDuplicateTypes(types)"
            :key="metaData.id"
            class="inline-block px-2 py-2 bg-background-dark mr-4 mb-4 bg-opacity-50 cursor-pointer hover:underline"
            @click="goToRelation(metaData)"
          >
            {{ metaData.label }}
          </div>
        </div>
        <div v-if="result" class="flex items-center justify-between py-4">
          <base-button
            v-if="carouselFiles"
            class="inline⁻block w-max ml-3 mt-3 hover:underline"
            :text="t('details.more')"
            custom-style="ghost-black"
            custom-icon="info"
            :icon-shown="true"
            :on-click="openDetailsModal"
          />
          <a v-if="isDownloadable" class="bg-background-light rounded-full p-4" :href="generateUrl(result.Entity?.mediafiles[carouselPictureIndex].filename, 'full')" target="_blank" download>
            <baseIcon icon="download" />
          </a>
        </div>
        <div v-if="useTestimonyFeature && !loading">
          <div class="flex justify-between items-center">
            <h2 class="font-bold mb-4 sm:mb-0">{{ t('details.testimony') }}</h2>
            <tool-tip :title="t('main.tooltips.login.title')" :description="t('main.tooltips.login.description')" placement="bottom">
              <div class="w-auto">
                <BaseButton custom-icon="talk" :icon-shown="true" custom-style="secondary" :text="t('details.addTestimony')" @click="writeTestimony" />
              </div>
            </tool-tip>
          </div>
          <div v-if="loadingNewTestimony" class="w-full flex justify-center py-8"><CircleLoader /></div>
          <div v-if="isWritingTestimony" class="flex mt-4">
            <BaseInput styling="w-full" icon="send" :placeholder="t('details.testimonyPlaceholder')" @submitField="createNewTestimony" />
          </div>
          <SpeechBubble
            v-for="(testimony, index) in testimonies"
            :key="testimony.name"
            :card-details="testimony"
            color="#FDC20B"
            :alignment="index % 2 == 0 ? 'Left' : 'Right'"
            @receivedLike="updateTestimonyLikes"
          ></SpeechBubble>
        </div>
      </div>
    </CardComponent>
    <section v-if="relatedItemIds.length > 0" class="col-span-2">
      <h2 class="font-bold text-2xl w-full text-center pt-10 mb-2">
        {{ t('details.discover') }}
      </h2>
      <the-grid :small="route.query.touch ? false : true" :default-relations="relatedItemIds" />
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUpdated, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  GetEntityByIdDocument,
  TheCarousel,
  CardComponent,
  BaseButton,
  SpeechBubble,
  ImageSource,
  getFileNameByMimeType,
  TestimonyCard,
  BaseIcon,
  BaseInput,
  CreateTestimonyDocument,
  EntityInfo,
  EntityTypes,
  Entity,
  TestimoniCard,
  CircleLoader,
  UpdateEntityDocument,
  GetTestimoniesOfAssetDocument,
} from 'coghent-vue-3-component-library'
import BreadCrumbs, { useHistory } from './BreadCrumbs.vue'
import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'
import { useCCModal } from './CreativeModal.vue'
import { useDetailsModal } from './DetailsModal.vue'
import { iiif } from '@/app'
import { ConfigStore, useTestimonyFeature } from '../stores/ConfigStore'
import { UserStore } from '../stores/UserStore'
import StoreFactory from '@/stores/StoreFactory'
import { parseDateAsLocaleString } from '@/helpers'
import ToolTip, { useTooltip } from './ToolTip.vue'
import EntityActions from './EntityActions.vue'
import { useOffensiveContentModal } from './OffensiveContentModal.vue'

type TypeObject = {
  id: string
  label: string
  relation: string
}

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

const metaDataInLabel: string[] = [
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
    BreadCrumbs,
    BaseInput,
    BaseIcon,
    SpeechBubble,
    CircleLoader,
    ToolTip,
    EntityActions,
  },
  setup: () => {
    const id = ref<string>(asString(useRoute().params['entityID']))
    const router = useRouter()
    const route = useRoute()
    const baseTestimony = ref<typeof EntityInfo>({ title: 'Testimony', description: '', type: EntityTypes.Testimony })
    const { result, loading, refetch } = useQuery(GetEntityByIdDocument, { id: id.value })
    const { onResult: onTestimonyResult, refetch: refetchTestimony } = useQuery(GetTestimoniesOfAssetDocument, { assetId: id.value })
    const { mutate: createTestimony, loading: loadingNewTestimony, onDone: onCreatedTestimony } = useMutation(CreateTestimonyDocument)
    const { mutate: updateEntity } = useMutation(UpdateEntityDocument)
    const carouselFiles = ref<typeof ImageSource[] | undefined>()
    const mediaFiles = ref<any | undefined>()
    const types = ref<any[] | undefined>()
    const relatedItemIds = ref<string[]>([])
    const { openCCModal } = useCCModal()
    const { openDetailsModal, setEntity } = useDetailsModal()
    const { generateUrl, generateInfoUrl, noImageUrl } = iiif
    const { addPageToHistory, history } = useHistory()
    const testimonies = ref<typeof TestimonyCard[]>([])
    const carouselPictureIndex = ref<number>(0)
    const isWritingTestimony = ref<boolean>(false)
    const { updateToolTipShownState, toolTipState } = useTooltip()
    const userStore = StoreFactory.get(UserStore)
    const configStore = StoreFactory.get(ConfigStore)
    const mediafileUrl = configStore.config.value.graphQlLink.replace('graphql', 'mediafile')
    const { openOffensiveContentModal } = useOffensiveContentModal()

    const isDownloadable = computed(() => {
      if (mediaFiles.value && carouselPictureIndex.value !== undefined) {
        return mediaFiles.value[carouselPictureIndex.value].metadata.find((data: any) => data.key == 'publication_status').value !== 'beschermd' ? true : false
      } else {
        return false
      }
    })

    watch(
      () => route.fullPath,
      () => {
        if (route.params.entityID) {
          refetch({ id: asString(route.params.entityID) })
        }
      },
      { immediate: true }
    )

    const parseTestimonyCards = (testimonies: typeof Entity[]): typeof TestimoniCard[] => {
      const testimonyCards: typeof TestimoniCard[] = []
      if (testimonies) {
        testimonies.forEach((testimony: typeof Entity) => {
          const card: typeof TestimoniCard = {
            id: testimony.id,
            name: testimony.user,
            date: parseDateAsLocaleString(new Date(testimony.date[0].value)),
            content: testimony.description[0].value,
            likes: testimony.likes[0].value,
          }
          testimonyCards.push(card)
        })
      }
      return testimonyCards
    }

    const setEntityInformation = (queryResult: any) => {
      if (queryResult.Entity) {
        refetchTestimony()
        const photosArray: typeof ImageSource[] = []
        mediaFiles.value = queryResult.Entity?.mediafiles
        queryResult.Entity?.mediafiles.forEach((value: any) => {
          if (value) {
            const filename: string | undefined = getFileNameByMimeType(value)
            if (filename) {
              const isLink: boolean = filename?.includes('https://')
              if (filename) {
                photosArray.push({
                  imageUrl: isLink ? filename : generateUrl(filename, 'full'),
                  infoJson: generateInfoUrl(filename),
                  fallBackUrl: isLink ? filename : generateUrl(filename, 'full', 'max'),
                  noImageUrl: noImageUrl,
                  mediaType: value.mediatype,
                })
              }
            }
          }
        })
        carouselFiles.value = photosArray.length === 0 ? [{ imageUrl: noImageUrl, infoJson: noImageUrl, fallBackUrl: noImageUrl }] : photosArray

        const typeArray: any[] = []
        // queryResult.data.Entity?.metadata.forEach((value: any) => {
        //   if (metaDataInTag.includes(value.key)) {
        //     typeArray.push(value.value)
        //   }
        // })
        queryResult.Entity?.relations.forEach((value: any) => {
          if (!metaDataInLabel.includes(value.label)) {
            value.value && typeArray.push({ label: value.value, id: value.key, relation: value.label })
          }
        })
        types.value = typeArray
        const typeArrayForRelatedAssets = typeArray.filter((type: any) => type.relation != 'MaterieelDing.beheerder')
        relatedItemIds.value = filterDuplicateTypes(typeArrayForRelatedAssets).map((type: any) => type.id)

        if (result.value && result.value.Entity) {
          setEntity({ ...result.value.Entity, types: typeArray })
          addPageToHistory(result.value.Entity.title[0]?.value ? result.value.Entity.title[0].value : 'unknown entity', router.currentRoute.value.fullPath)
        }
      } else {
        router.push({ path: '/entity/not-found', query: route.query })
      }
    }

    watch(
      () => result.value,
      (queryResult: any) => {
        setEntityInformation(queryResult)
      }
    )

    onTestimonyResult((res) => {
      testimonies.value = parseTestimonyCards(res.data.GetTestimoniesOfAsset)
    })

    onCreatedTestimony((res) => {
      testimonies.value = parseTestimonyCards(res.data.CreateTestimony)
    })

    const filterDuplicateTypes = (_relations: Array<TypeObject>) => {
      let myRelations: Array<TypeObject> = []
      Object.assign(myRelations, _relations)
      for (const relation of myRelations) {
        const items = myRelations.filter((_relation) => _relation.id == relation.id)
        if (items.length > 1) {
          const duplicateWithSameValue = items.filter((_item) => _item.label == relation.label)
          if (duplicateWithSameValue.length > 1) {
            myRelations.splice(myRelations.indexOf(relation), 1)
          }
        }
      }
      return myRelations
    }

    const goToRelation = (metaData: any) => {
      let routerLink: string = ''
      if (metaData.id && metaData.relation == 'vervaardiger') {
        routerLink = '/creator/' + metaData.id.replace('entities/', '')
      } else {
        history.value[history.value.length - 1]
        routerLink = '/relation/' + metaData.id.replace('entities/', '')
      }
      if (routerLink) {
        router.push({ path: routerLink, query: route.query })
      }
    }

    const setPictureIndex = (newIndex: number) => {
      carouselPictureIndex.value = newIndex
    }

    const updateTestimonyLikes = (testimony: typeof TestimonyCard) => {
      if (userStore.hasUser) {
        const testimonyToUpdate = testimonies.value.find((element: typeof TestimonyCard) => element.id == testimony.id)
        testimonyToUpdate.likes++
        const testimonyEntity = JSON.parse(JSON.stringify(testimonies.value.find((element: typeof Entity) => element.id == testimony.id)))
        const newMetadata = [{ key: 'likes', value: testimonyToUpdate.likes.toString() }]
        updateEntity({ id: testimony.id, metadata: newMetadata, relations: [] })
      }
    }

    const writeTestimony = () => {
      if (userStore.hasUser) {
        isWritingTestimony.value = !isWritingTestimony.value
      } else {
        updateToolTipShownState(true)
      }
    }

    const createNewTestimony = (body: string) => {
      if (body.length >= 4) {
        baseTestimony.value.description = body
        isWritingTestimony.value = false
        createTestimony({ entityInfo: baseTestimony.value, assetId: result.value.Entity.id })
      }
    }

    const { t } = useI18n()

    return {
      result,
      t,
      carouselFiles,
      types,
      openCCModal,
      openDetailsModal,
      mediaFiles,
      router,
      loading,
      route,
      filterDuplicateTypes,
      goToRelation,
      relatedItemIds,
      testimonies,
      updateTestimonyLikes,
      generateUrl,
      setPictureIndex,
      carouselPictureIndex,
      writeTestimony,
      isWritingTestimony,
      createNewTestimony,
      useTestimonyFeature,
      UserStore,
      loadingNewTestimony,
      mediafileUrl,
      toolTipState,
      isDownloadable,
      openOffensiveContentModal,
    }
  },
})
</script>

<style scoped></style>
