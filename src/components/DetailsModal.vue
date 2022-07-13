<template>
  <BaseModal :large="true" :scroll="true" :modal-state="DetailsModalState.state" custom-styles="z-40" @hide-modal="closeDetailsModal">
    <section v-if="entity" class="bg-background-medium flex flex-col overflow-y-auto sm:pb-0 h-10/12">
      <section class="flex flex-col lg:flex-row sm:h-5/6">
        <section class="flex flex-col bg-background-light h-auto lg:w-1/3 px-4">
          <div>
            <h1 class="text-2xl font-black my-2 text-center lg:text-left lg:ml-6 mt-6">
              {{ entity.title[0]?.value }}
            </h1>
            <div class="m-3 lg:ml-6 lg:mt-6">
              <base-meta-data :key-word="t('details.modal.objectNumber')" :type="entity.objectNumber[0]?.value" :error-text="t('details.modal.unknown')" />
              <div v-if="objectNames.length != 0" class="grid grid-cols-2">
                <p class="font-bold">{{ t('details.modal.objectName') }}</p>
                <ul>
                  <li v-for="item in objectNames" :key="item">{{ item }}</li>
                </ul>
              </div>
              <base-meta-data
                v-if="collectieNaam && collectieNaam.nestedMetaData && collectieNaam.nestedMetaData.title.length != 0"
                :key-word="t('details.modal.collectieNaam')"
                :type="collectieNaam.nestedMetaData.title[0].value"
                :error-text="t('details.modal.unknown')"
                :clickable="true"
                @click="goToRelation(collectieNaam.nestedMetaData)"
              />
              <base-meta-data
                v-if="getName(entity, 'MaterieelDing.beheerder').name != 'onbekend'"
                :key-word="t('details.modal.instellingNaam')"
                :type="getName(entity, 'MaterieelDing.beheerder').name"
                :error-text="t('details.modal.unknown')"
                :clickable="true"
                @click="goToMetaData('MaterieelDing.beheerder', getName(entity, 'MaterieelDing.beheerder').name)"
              />
            </div>
          </div>
          <div v-if="entity.mediafiles" class="flex flex-row lg:flex-col pb-5 overflow-x-auto h-3/6 lg:h-full overflow-y-auto">
            <div v-for="(photo, index) in entity.mediafiles" :key="photo">
              <div class="flex relative mb-4 w-60 sm:w-auto mr-4 lg:mr-0">
                <LazyLoadImage :url="generateUrl(photo.transcode_filename || photo.filename, 'full')" :no-image-url="photo.mediatype.audio ? audioUrl : noImageUrl" extra-class="my-6 sm:w-full" />
                <base-button
                  class="w-0 absolute top-5 z-20 mt-3 ml-3"
                  custom-style="secondary-round"
                  custom-icon="fullscreen"
                  :icon-shown="true"
                  @click="handleMediaModal(photo.transcode_filename || photo.filename, entity.mediafiles[index])"
                />
                <copyright-tab class="absolute top-5 right-0 w-full h-full" :infotext="t('main.info')" :selected-index="index" :mediafiles="entity.mediafiles" @openingCcmodal="openNewCCModal" />
              </div>
            </div>
          </div>
        </section>
        <section class="flex flex-col flex-grow bg-background-medium w-full h-auto lg:h-full lg:w-2/3 pb-12 lg:pb-0 mb-4">
          <p v-show="entity.description && entity.description[0]" class="ml-8 m-3 mt-6 lg:mr-10 xl:mt-20">
            {{ entity.description[0]?.value }}
          </p>
          <!-- <div class="font-medium pb-2 flex flex-wrap">
            <relation-tag v-for="relation in entity.relations.filter((relation: any) => relation.key)" :id="relation.key" :key="relation.value" class="bg-tag-neutral" />
          </div> -->
          <div v-if="collectieNaam" class="mt-5 flex flex-col gap-2 mx-8 bg-background-light px-4 py-2">
            <strong class="col-start-1 w-min inline-block" v-html="t(`${collectieNaam.label}`)" />
            <a
              v-if="collectieNaam.nestedMetaData.title.length != 0"
              class="col-start-1 font-semibold inline-block hover:underline cursor-pointer"
              @click="goToRelation(collectieNaam.nestedMetaData)"
              v-html="t(`${collectieNaam.nestedMetaData.title[0].value}`)"
            />
            <p v-if="collectieNaam.nestedMetaData.description && collectieNaam.nestedMetaData.description.length != 0" class="col-start-1 inline-block mt-2 mb-4">
              {{ collectieNaam.nestedMetaData.description[0].value }}
            </p>
          </div>

          <h3 class="font-bold text-lg mt-5 ml-8">
            {{ t('details.modal.characteristics') }}
          </h3>
          <ul class="mt-5 flex flex-col gap-2 px-8 bg-background-medium">
            <li v-for="metaType in filterAllData(entity).metadataCollection" :key="metaType">
              <base-meta-data v-if="!metaType.nested" :key-word="t(`${metaType.label}`)" :type="concatMetadatValues(metaType.data)" :error-text="t('details.modal.unknown')" />
              <div v-if="metaType.nested" class="mt-2">
                <strong class="col-start-1 w-min inline-block" v-html="t(`${metaType.label}`)" />
                <li v-for="dataItem in metaType.data" :key="dataItem.value" class="ml-5" :class="dataItem.nestedMetaData.metadataCollection.length === 0 ? 'mb-1' : 'mb-5'">
                  <strong
                    v-if="metaType.label !== dataItem.value && dataItem.nestedMetaData.metadataCollection.length === 0"
                    class="col-start-1 font-semibold inline-block"
                    v-html="t(`${dataItem.value}`)"
                  />
                  <p
                    v-if="dataItem.nestedMetaData.metadataCollection.length !== 0 && dataItem.nestedMetaData.description && dataItem.nestedMetaData.description[0]"
                    class="col-start-1 inline-block mt-2 mb-4"
                  >
                    {{ dataItem.nestedMetaData.description[0].value ? dataItem.nestedMetaData.description[0].value : '' }}
                  </p>
                  <div v-for="(metaData, index) in dataItem.nestedMetaData.metadataCollection" :key="index">
                    <base-meta-data
                      v-for="(data, dataIndex) in metaData.data"
                      :key="dataIndex"
                      :strong-label="false"
                      :key-word="t(`${metaData.label}`)"
                      :type="data.value"
                      :error-text="t('details.modal.unknown')"
                      :clickable="t(`${metaData.label}`) == 'vervaardiger' ? true : false"
                      @click="goToMetaData(metaData.label, data.value)"
                    />
                  </div>
                </li>
              </div>
            </li>
          </ul>
          <div class="bg-background-medium">
            <h3 class="font-bold text-lg mt-5 mb-3 ml-8">
              {{ t('details.modal.associations') }}
            </h3>

            <div class="mx-5 flex gap-3 mb-4 flex-wrap">
              <div v-for="(relation, index) in entity.types" :key="index">
                <div
                  v-if="relation"
                  :key="relation.id"
                  :class="{
                    'flex flex-row flex-wrap px-2 py-2 bg-tag-neutral mb-1 mr-1 bg-opacity-50 cursor-pointer hover:underline': relation.relation != '',
                    'flex flex-row flex-wrap px-2 py-2 bg-tag-neutral mb-1 mr-1 bg-opacity-50 cursor-not-allowed': relation.relation == '',
                  }"
                  @click="goToRelation(relation)"
                >
                  {{ relation.label }}
                </div>
              </div>
            </div>
          </div>
          <!-- <span class="invisible flex flex-grow h-full" aria-hidden="true">&#8203;</span> -->
        </section>
      </section>
    </section>
    <section id="footer" class="flex items-stretch z-50 bg-background-light justify-center p-2 lg:p-10 shadow-2xl sticky bottom-0 w-full lg:pb-6">
      <div class="mx-3 align-center">
        <base-button
          class="w-12 h-12 pl-6 stroke-current text-text-black inline-block lg:hidden"
          :on-click="() => copyUrl(entity.id)"
          custom-style="secondary-round"
          custom-icon="link"
          :icon-shown="true"
        />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.link')" :on-click="() => copyUrl(entity.id)" custom-style="ghost-black" custom-icon="link" :icon-shown="true" />
        <div v-if="userStore.hasUser" class="hidden border-r-2 h-6 border-text-dark border-opacity-70 mx-6 hidden" />
        <base-button class="hidden w-12 h-12 pl-6 stroke-current text-text-black inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="edit" :icon-shown="true" />
        <base-button class="hidden w-max hidden" :text="t('details.modal.edit')" :on-click="onClick" custom-style="ghost-black" custom-icon="edit" :icon-shown="true" />
      </div>
      <div v-if="useStoryboxFeature === true && userStore.hasUser" class="border-r-2 h-auto border-background-dark border-opacity-70 mr-2" />
      <div v-if="useStoryboxFeature === true && userStore.hasUser && entity" class="mx-3 align-center">
        <AddAssetToStoryboxDropdown :entity="entity" @addToStorybox="(ids) => addAssetToStorybox(ids)">
          <base-button :text="t('buttons.addToStorybox')" custom-style="ghost-purple" :icon-shown="true" :custom-icon="assetIsInAStorybox ? `check` : `storybox`" class="px-2 hidden lg:flex" />
          <base-button custom-style="secondary-round" :icon-shown="true" :custom-icon="storyBoxIcon" class="w-12 h-12 pl-6 stroke-current text-accent-purple inline-block lg:hidden" />
        </AddAssetToStoryboxDropdown>
      </div>
    </section>
  </BaseModal>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ModalState } from './base/Modal.vue'
import { BaseButton, CopyrightTab, LazyLoadImage, BaseMetaData, BaseModal, useMediaModal, MediaFile, Metadata, MetadataCollection, Relation } from 'coghent-vue-3-component-library'
import { useCCModal } from './CreativeModal.vue'
import useClipboard from 'vue-clipboard3'
import useFilter from '@/composables/useFilter'
import { itemsInBasket } from '@/composables/useStoryBox'
import { apolloClient, iiif, useGoogleFeature, useStoryboxFeature } from '@/app'
import StoreFactory from '@/stores/StoreFactory'
import { UserStore } from '@/stores/UserStore'
import { useHistory } from './BreadCrumbs.vue'
import AddAssetToStoryboxDropdown from './AddAssetToStoryboxDropdown.vue'
import { StoryBoxState } from 'coghent-vue-3-component-library'
import { useStorybox } from 'coghent-vue-3-component-library'
import { HeadAttrs, useHead } from '@vueuse/head'
import { getFirstValueOfPropertyFromEntity } from 'coghent-vue-3-component-library'
import { getFirstMediafileWithFilelocationOfEntity } from 'coghent-vue-3-component-library'

export type DetailsModalType = {
  state: ModalState
}

export type FullscreenModalType = {
  state: ModalState
}

type NestedDataObject = {
  description: []
  id: string
  mediafiles: []
  metadataCollection: Array<typeof MetadataCollection>
  objectNumber: []
  relations: Array<typeof Relation>
  title: []
  type: string
  types: Array<TypeObject>
  __typename: string
}

type TypeObject = {
  label: string
  id: string
  relation: string
}

const entity = ref<any>()
const collectieNaam = ref<any>()
const objectNames = ref<any>([])

const DetailsModalState = ref<DetailsModalType>({
  state: 'hide',
})

export const useDetailsModal = () => {
  const updateDetailsModal = (DetailsModalInput: DetailsModalType) => {
    DetailsModalState.value = DetailsModalInput
  }

  const closeDetailsModal = () => {
    updateDetailsModal({
      state: 'hide',
    })
  }

  const openDetailsModal = () => {
    updateDetailsModal({
      state: 'show',
    })
  }

  const createTypesFromMetadata = (_metadata: Array<typeof Metadata>) => {
    const newTypes: Array<TypeObject> = []
    if (_metadata.length != 0) {
      for (const _meta of _metadata) {
        if (_meta.nestedMetaData) {
          newTypes.push({
            id: _meta.nestedMetaData.id,
            label: _meta.value,
            relation: _meta.__typename,
          } as TypeObject)
        }
      }
    }
    return newTypes
  }

  const setEntity = (data: any) => {
    if (!data) return
    entity.value = data
    entity.value.metadataCollection = entity.value.metadataCollection.filter((collection: any) => collection.label != 'vervaardiger')
    collectieNaam.value = useFilter().getParentCollectionByNameIfTitle(entity.value, 'Collectie.naam')
    const objectNameData = useFilter().getDataOfCollection(entity.value, 'Entiteit.classificatie')
    const objectNamesData = useFilter().getMetadataCollectionByLabel(objectNameData, 'objectnaam')
    objectNames.value = useFilter().getObjectNames(objectNamesData)
    const newTypes = createTypesFromMetadata(objectNamesData)
    entity.value.types = entity.value.types.concat(newTypes)
  }

  return {
    closeDetailsModal,
    openDetailsModal,
    DetailsModalState,
    setEntity,
    entity,
    collectieNaam,
    objectNames,
  }
}

export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
    CopyrightTab,
    LazyLoadImage,
    BaseMetaData,
    AddAssetToStoryboxDropdown,
  },
  setup(props) {
    const { closeDetailsModal, DetailsModalState, openDetailsModal } = useDetailsModal()
    let IIIfImageUrl: string = ''
    const { openCCModal } = useCCModal()
    const { toClipboard } = useClipboard()
    const { generateUrl, generateInfoUrl, noImageUrl, audioUrl } = iiif
    const router = useRouter()
    const route = useRoute()
    const { history } = useHistory()
    const userStore = StoreFactory.get(UserStore)
    const storyBoxIcon = ref<'check' | 'storybox'>('storybox')
    const { openMediaModal, setMediaModalImageUrl, setMediaModalFile } = useMediaModal()
    const head = reactive<Array<HeadAttrs>>([])
    const assetIsInAStorybox = ref<boolean>(false)

    useHead({ meta: head })

    watch(entity, async () => {
      await checkAssetIsInAStorybox()
      if (useGoogleFeature.value === true) {
        let title = getFirstValueOfPropertyFromEntity(entity.value, `title`)
        let description = getFirstValueOfPropertyFromEntity(entity.value, `description`)
        let image = ''
        entity.value.primary_transcode ? (image = entity.value.primary_transcode) : ''
        const media = await getFirstMediafileWithFilelocationOfEntity(entity.value)
        media && media.original_file_location ? (image = media.original_file_location) : ``
        head.push(
          ...[
            {
              property: 'og:title',
              content: title ? title.value : '',
            },
            {
              property: 'og:description',
              content: description ? description.value : '',
            },
            {
              property: 'og:image',
              content: image,
            },
          ]
        )
      }
    })

    const checkAssetIsInAStorybox = async () => {
      new Promise((resolve, reject) => {
        for (const box of StoryBoxState.value.storyboxes) {
          const found = useStorybox(apolloClient).assetIsInStorybox(entity.value, box.id)
          found && found.key ? resolve(true) : null
        }
        resolve(false)
      }).then((val) => {
        assetIsInAStorybox.value = val as boolean
      })
    }

    const handleMediaModal = (filename: string, mediaFile: typeof MediaFile) => {
      setMediaModalImageUrl(generateInfoUrl(filename, 'full'))
      setMediaModalFile(mediaFile)
      openMediaModal()
    }

    const addAssetToStorybox = async (_storyBoxIds: Array<string>) => {
      for (const _box of StoryBoxState.value.storyboxes) {
        if (_storyBoxIds.includes(_box.id)) {
          await useStorybox(apolloClient).assetToStorybox(_box.id, entity.value.id)
          console.log(`Added to box`, _box.id)
        }
      }
      await useStorybox(apolloClient).getStoryboxes()
    }

    const copyUrl = async (id: String) => {
      console.log('copyurl', id)
      try {
        var url = window.location.href
        await toClipboard(url)
      } catch (e) {
        console.error(e)
      }
    }

    const openNewCCModal = () => {
      openCCModal()
      closeDetailsModal()
    }

    const replaceDotsWithOnbekend = (_string: string) => {
      let returnValue = _string
      if (_string == '..') returnValue = 'onbekend'
      return returnValue
    }

    const concatMetadatValues = (input: typeof Metadata[]): string => {
      let concatString: string = ''
      input.forEach((meta: typeof Metadata) => {
        if (concatString === '') {
          concatString = meta.value ? meta.value : t('details.modal.unknown')
          concatString = replaceDotsWithOnbekend(concatString)
        } else {
          concatString = `${concatString}, ${replaceDotsWithOnbekend(meta.value as string)}`
        }
      })

      return concatString
    }

    const { t } = useI18n()

    const getObjectName = (metadataCollection: any[]) => {
      const objectNameArray: string[] = []
      try {
        metadataCollection.forEach((metadata) => {
          if (metadata.label === 'Entiteit.classificatie') {
            metadata.data.forEach((metadata2: any) => {
              metadata2.nestedMetaData.metadataCollection.forEach((element: any) => {
                if (element.label === 'objectnaam') {
                  element.data.forEach((element2: any) => {
                    objectNameArray.push(element2.value)
                  })
                }
              })
            })
          }
        })

        return [...new Set(objectNameArray)].join(',')
      } catch (error) {
        return 'onbekend'
      }
    }

    const filterAllData = (_entity: NestedDataObject) => {
      let entity = {} as NestedDataObject
      Object.assign(entity, _entity)
      const parentLabels = ['vervaardiging.plaats', 'Collectie.naam', 'MaterieelDing.beheerder']
      entity = useFilter().setMetadataToOneRelationDown(entity, 'Entiteit.wordtNaarVerwezenDoor')
      entity.metadataCollection = useFilter().removeParentCollections(entity.metadataCollection as Array<typeof MetadataCollection>, parentLabels)
      entity = useFilter().removeChildByLabel(entity, 'Collectie.naam', 'MaterieelDing.beheerder')
      entity = useFilter().removeChildByLabel(entity, 'Collectie.naam', 'Entiteit.classificatie')
      entity = useFilter().removeChildByLabel(entity, 'Collectie.naam', 'GecureerdeCollectie.bestaatUit')
      entity = useFilter().removeChildByLabel(entity, 'Collectie.naam', 'MensgemaaktObject.draagt')
      entity = useFilter().removeChildByLabel(entity, 'Entiteit.classificatie', 'objectnaam')
      entity = useFilter().removeChildByLabel(entity, 'inhoud.persoon.naam', 'achternaam')
      entity = useFilter().removeParentsWithoutData(entity)
      entity = useFilter().removeMetadataCollectionFromNestedMetadata(entity, 'inhoud.persoon.naam')
      return entity
    }

    const getName = (_entity: NestedDataObject, _label: string) => {
      let name = 'onbekend'
      let relation = ''
      let id = ''
      const collection = _entity.metadataCollection.filter((_collection) => _collection.label == _label)
      if (collection && collection[0]) {
        name = collection[0].data?.[0]?.value as string
        relation = collection[0].data?.[0]?.label as string
      }
      const relationType = _entity.types.filter((_type) => _type.label == name && _type.relation == relation)
      if (relationType.length > 0) {
        id = relationType[0].id.replace('entities/', '')
      }
      return { name: name, id: id }
    }

    const createLink = (linkId: string, label: string): string => {
      const pageName: 'creator' | 'relation' = label == 'vervaardiger' ? 'creator' : 'relation'
      let link = pageName && linkId ? `/${pageName}/${linkId}` : ''
      return link
    }

    const goToRelation = (metaData: any) => {
      closeDetailsModal()
      const id = metaData.id.replace('entities/', '')
      let routerLink: string = createLink(id, metaData.relation)
      router.push({ path: routerLink, query: route.query })
    }

    const goToMetaData = (_label: string, _value: string) => {
      const relation = useFilter().getRelation(entity.value, _label, _value)
      if (relation) {
        const id = relation.key.replace('entities/', '')
        const routerLink: string = createLink(id, _label)
        router.push({ path: routerLink, query: route.query })
        closeDetailsModal()
      }
    }

    return {
      getObjectName,
      concatMetadatValues,
      closeDetailsModal,
      DetailsModalState,
      entity,
      t,
      openNewCCModal,
      LazyLoadImage,
      copyUrl,
      generateUrl,
      generateInfoUrl,
      router,
      IIIfImageUrl,
      filterAllData,
      goToMetaData,
      getName,
      collectieNaam,
      objectNames,
      route,
      addAssetToStorybox,
      userStore,
      itemsInBasket,
      storyBoxIcon,
      goToRelation,
      noImageUrl,
      useStoryboxFeature,
      handleMediaModal,
      audioUrl,
      assetIsInAStorybox,
    }
  },
  methods: {
    getCreatorId() {
      const metadata: Array<any> = entity.value.metadataCollection
      const productionData: Array<any> = metadata.find((data) => data.label == 'MaterieelDing.productie').data
      const productionDataRelations: Array<any> = productionData.find((data) => data.label == 'MaterieelDing.productie').nestedMetaData.relations
      const creatorId: string = productionDataRelations.find((relation) => relation.label == 'vervaardiger').key.split('/')[1]
      return creatorId
    },
  },
})
</script>

<style>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
