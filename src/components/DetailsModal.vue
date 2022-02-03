<template>
<!--IIIF modal-->
  <BaseModal v-if="DetailsModalState.state == 'show'" :modal-state="FullscreenModalState.state" @hide-modal="closeFullscreenModal" customStyles="z-50">
    <section class="h-large flex relative w-full">
      <a
        @click="closeFullscreenModal"
        class="
          right-2
          top-2
          absolute
          bg-neutral-0
          cursor-pointer
          hover:bg-accent-yellow
          ml-2
          mr-2
          p-2
          rounded-full
          shadow-xl
          text-accent-purple
          z-50
          hover:text-neutral-0
        "
      >
        <base-icon
          icon="close"
          class="h-5 w-5 ml-0.5 stroke-current fill-current stroke-2"
        />
      </a>
      <IIIFViewer :imageUrl="IIIfImageUrl" />
    </section>
  </BaseModal>
  <!--Details modal-->
   <BaseModal :large="true" :scroll="true" :modal-state="DetailsModalState.state" @hide-modal="closeDetailsModal" customStyles="z-40">
    <section v-if="entity" class="flex flex-col h-full overflow-y-auto pb-12 sm:pb-0">
      <section class="flex flex-col lg:flex-row h-10/12 sm:h-5/6">
        <section class="bg-background-light h-auto lg:w-1/3">
          <h1 class="text-2xl font-black my-2 text-center lg:text-left lg:ml-6 mt-6">
            {{ entity.title[0]?.value }}
          </h1>
          <div class="m-3 lg:ml-6 lg:mt-6">
            <base-meta-data :key-word="t('details.modal.objectNumber')" :type="entity.objectNumber[0]?.value" :error-text="t('details.modal.unknown')" />
            <base-meta-data :key-word="t('details.modal.objectName')" :type="getObjectName(entity.metadataCollection)" :error-text="t('details.modal.unknown')" />
            <base-meta-data :key-word="t('details.modal.collectieNaam')" :type="getCollectionName(entity).name" :error-text="t('details.modal.unknown')" />
          </div>
          <div v-if="entity.mediafiles" class="flex flex-row lg:flex-col pr-6 pb-5 overflow-x-auto lg:overflow-y-auto h-4/5 no-scrollbar">
            <div v-for="(photo, index) in entity.mediafiles" :key="photo">
              <div class="flex relative mb-4 w-60 sm:w-auto">
                <LazyLoadImage :url="generateUrl(photo.filename, 'full')" extra-class="m-6 sm:w-full" />
                <base-button
                  class="w-0 absolute z-20 top-4 left-4 mt-3 ml-3"
                  customStyle="secondary-round"
                  customIcon="fullscreen"
                  :iconShown="true"
                  @click="openIIIFModal(generateInfoUrl(photo.filename, 'full'))"
                />
                <copyright-tab class="absolute top-4 right-4 w-full h-full" :infotext="t('main.info')" :selected-index="index" :mediafiles="entity.mediafiles" @openingCcmodal="openNewCCModal" />
              </div>
            </div>
          </div>
        </section>
        <section class="flex flex-col flex-grow bg-background-medium w-full overflow-y-visible lg:overflow-y-auto h-auto lg:h-full lg:w-2/3 pb-12 lg:pb-0">
          <p v-show="entity.description && entity.description[0]" class="ml-8 m-3 mt-6 lg:mr-10 xl:mt-20">
            {{ entity.description[0]?.value }}
          </p>
          <!-- <div class="font-medium pb-2 flex flex-wrap">
            <relation-tag v-for="relation in entity.relations.filter((relation: any) => relation.key)" :id="relation.key" :key="relation.value" class="bg-tag-neutral" />
          </div> -->
          <h3 class="font-bold text-lg mt-5 ml-8">
            {{ t('details.modal.characteristics') }}
          </h3>
          <ul class="mt-5 flex flex-col gap-3 ml-8">
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
                  <strong
                    v-if="dataItem.nestedMetaData.metadataCollection.length !== 0 && dataItem.nestedMetaData.description && dataItem.nestedMetaData.description[0]"
                    class="col-start-1 font-semibold inline-block"
                    >{{ dataItem.nestedMetaData.description[0].value ? dataItem.nestedMetaData.description[0].value : '' }}</strong
                  >
                  <base-meta-data
                    v-for="(metaData, index) in dataItem.nestedMetaData.metadataCollection"
                    :key="index"
                    :strong-label="false"
                    :key-word="t(`${metaData.label}`)"
                    :type="concatMetadatValues(metaData.data)"
                    :error-text="t('details.modal.unknown')"
                    :clickable="t(`${metaData.label}`) == 'vervaardiger' ? true : false"
                    @click="t(`${metaData.label}`) == 'vervaardiger' ? goToCreatorDetails(getCreatorId(metaData)) : null"
                  />
                </li>
              </div>
            </li>
          </ul>
          <h3 class="font-bold text-lg mt-5 mb-3 ml-8">
            {{ t('details.modal.associations') }}
          </h3>

          <div class="mx-5 flex gap-3 mb-4 flex-wrap">
            <div v-for="(relation, index) in entity.types" :key="index">
              <p v-if="relation" class="px-2 py-2 bg-tag-neutral mb-2 -mr-1 bg-opacity-50">
                {{ relation.label }}
              </p>
            </div>
          </div>
          <span class="invisible flex flex-grow h-full" aria-hidden="true">&#8203;</span>
        </section>
      </section>
      <section id="footer" class="flex items-center z-50 bg-background-light justify-center p-2 lg:p-10 h-1/6 shadow-2xl fixed bottom-0 w-full lg:pb-6">
        <base-button
          class="w-12 h-12 pl-6 ml-3 stroke-current text-text-black inline-block lg:hidden"
          :on-click="() => copyUrl(entity.id)"
          custom-style="secondary-round"
          custom-icon="link"
          :icon-shown="true"
        />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.link')" :on-click="() => copyUrl(entity.id)" custom-style="ghost-black" custom-icon="link" :icon-shown="true" />
        <div class="hidden border-r-2 h-6 border-text-dark border-opacity-70 mx-6 hidden" />
        <base-button
          class="hidden w-12 h-12 pl-6 ml-3 stroke-current text-text-black inline-block lg:hidden"
          :on-click="onClick"
          custom-style="secondary-round"
          custom-icon="edit"
          :icon-shown="true"
        />
        <base-button class="hidden w-max hidden" :text="t('details.modal.edit')" :on-click="onClick" custom-style="ghost-black" custom-icon="edit" :icon-shown="true" />
        <div class="hidden border-r-2 align-center h-6 border-text-dark border-opacity-70 mx-6 hidden" />
        <base-button class="hidden w-12 h-12 pl-6 mt-3 ml-3 inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="storybox" :icon-shown="true" />
        <base-button class="hidden w-max hidden" :text="t('details.modal.add')" :on-click="onClick" custom-style="ghost-purple" custom-icon="storybox" :icon-shown="true" />
      </section>
    </section>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref} from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ModalState } from './base/Modal.vue'
import { BaseButton, CopyrightTab, LazyLoadImage, BaseMetaData, BaseModal, BaseIcon, IIIFViewer } from 'coghent-vue-3-component-library'
import { useCCModal } from './CreativeModal.vue'
import useClipboard from 'vue-clipboard3'
import useIIIF from '@/composables/useIIIF'
import { Metadata, Relation } from 'coghent-vue-3-component-library/lib/queries'

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
  metadataCollection: Array<MetadataCollectionObject>
  objectNumber: []
  relations: Array<Relation>
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

type MetadataCollectionObject = {
  data: Array<ParentMetadataObject>
  label: string
  nested: boolean
  __typename: string
}

type ParentMetadataObject = {
  label: string
  nestedMetaData: NestedDataObject
  unMappedKey: null | string
  value: string
  __typename: string
}

const entity = ref<any>();

const DetailsModalState = ref<DetailsModalType>({
  state: 'hide',
})

const FullscreenModalState = ref<DetailsModalType>({
  state: 'hide',
})

export const useFullscreenModal = () => {
  const updateFullscreenModal = (FullscreenModalInput: FullscreenModalType) => {
    FullscreenModalState.value = FullscreenModalInput
  }

  const closeFullscreenModal = () => {
      updateFullscreenModal({
      state: 'hide',
    })
    }

    const openFullscreenModal = () => {
       updateFullscreenModal({
      state: 'show',
    })
    }
    return {
      closeFullscreenModal,
      openFullscreenModal,
      FullscreenModalState,
    }
}

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

  const setEntity = (data: any) => {
    if (!data) return
    entity.value = data
    entity.value.metadataCollection = entity.value.metadataCollection.filter((collection: any) => collection.label != 'vervaardiger')
  }

  return {
    closeDetailsModal,
    openDetailsModal,
    DetailsModalState,
    setEntity,
    entity,
  }
}

export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
    CopyrightTab,
    LazyLoadImage,
    BaseMetaData,
    BaseIcon,
    IIIFViewer
  },
  setup(props) {
    const { closeDetailsModal, DetailsModalState, openDetailsModal } = useDetailsModal()
    const { closeFullscreenModal, FullscreenModalState, openFullscreenModal } = useFullscreenModal()
    let IIIfImageUrl: string = ''
    const { openCCModal } = useCCModal()
    const { toClipboard } = useClipboard()
    const { generateUrl, generateInfoUrl } = useIIIF()
    const router = useRouter()

    const onClick = () => {}

    const copyUrl = async (id: String) => {
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

    const concatMetadatValues = (input: Metadata[]): string => {
      let concatString: string = ''
      input.forEach((meta: Metadata) => {
        if (concatString === '') {
          concatString = meta.value ? meta.value : t('details.modal.unknown')
          concatString = replaceDotsWithOnbekend(concatString);
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
    _entity = checkForMatchingChildRelations(_entity as NestedDataObject)
    _entity = removeObjectNaamFromMetadataValue(_entity as NestedDataObject)
    _entity.metadataCollection = removeParentsWihthoutData(_entity.metadataCollection as Array<MetadataCollectionObject>)
    return _entity
  }

  const checkForMatchingChildRelations = (_data: NestedDataObject) => {
    let myData = {} as NestedDataObject
    Object.assign(myData, _data)
    const parentLables = _data.metadataCollection.map((_meta) => _meta.label)
    let myMetadataCollection = JSON.parse(JSON.stringify(myData.metadataCollection)) as Array<MetadataCollectionObject>
    for (const _metadataCollection of myMetadataCollection) {
      if (_metadataCollection.nested) {
        for (const _dataObject of _metadataCollection.data) {
          _dataObject.nestedMetaData.metadataCollection.forEach((_item) => {
            if (parentLables.includes(_item.label)) {
              _dataObject.nestedMetaData.metadataCollection.splice(_dataObject.nestedMetaData.metadataCollection.indexOf(_item),1)
            }
          })
        }
      }
    }
    myData.metadataCollection = myMetadataCollection
    return myData
  }

  const removeObjectNaamFromMetadataValue = (_data: NestedDataObject) => {
    let myMetadata = JSON.parse(JSON.stringify(_data.metadataCollection)) as Array<MetadataCollectionObject>
    let filteredMetadataForClassificatie = myMetadata.filter(_meta => _meta.label == 'Entiteit.classificatie')
    if(filteredMetadataForClassificatie.length > 0 && filteredMetadataForClassificatie[0].nested){
      for (const _classificatieMetadata of filteredMetadataForClassificatie[0].data){
        const filterdClassificatieMetadata = _classificatieMetadata.nestedMetaData.metadataCollection.filter(_item => _item.label == 'objectnaam')
        if(filterdClassificatieMetadata.length > 0){
          filteredMetadataForClassificatie[0].data.splice(filteredMetadataForClassificatie[0].data.indexOf(_classificatieMetadata),1)
        }
      }
    }
    _data.metadataCollection = myMetadata
    return _data;
  }

  const removeParentsWihthoutData = (_metadataCollection: Array<MetadataCollectionObject>) => {
    let myMetadata: Array<MetadataCollectionObject> = []
    Object.assign(myMetadata, _metadataCollection)
    for(const _collection of myMetadata){
      if(_collection.nested){
        if(_collection.data.length == 0){
          myMetadata.splice(myMetadata.indexOf(_collection),1)
        }
      }
    }
    return myMetadata
  }

  const getCollectionName = (_entity: NestedDataObject) => {
    let name = 'onbekend'
    let relation = ''
    let link = ''
    const collection = _entity.metadataCollection.filter(_collection => _collection.label == 'MaterieelDing.beheerder');
    if(collection.length > 0){
      name = collection[0].data[0].value
      relation = collection[0].data[0].label
    }
    const relationType = _entity.types.filter(_type => _type.label == name && _type.relation == relation);
    if(relationType.length > 0){
      link = relationType[0].id.replace('entities/', '');
    }
    return {name: name, link: link};
  }

    return {
      getObjectName,
      FullscreenModalState,
      openFullscreenModal,
      closeFullscreenModal,
      concatMetadatValues,
      closeDetailsModal,
      DetailsModalState,
      entity,
      t,
      openNewCCModal,
      LazyLoadImage,
      copyUrl,
      onClick,
      generateUrl,
      generateInfoUrl,
      router,
      IIIfImageUrl,
      filterAllData,
      getCollectionName,
    }
  },
  methods: {
    goToCreatorDetails(id: String) {
      this.closeDetailsModal()
      this.router.push({ path: '/creator/' + id, query: { fromPage: entity.value.title[0]?.value } })
    },
    getCreatorId() {
      const metadata: Array<any> = entity.value.metadataCollection
      const productionData: Array<any> = metadata.find((data) => data.label == 'MaterieelDing.productie').data
      const productionDataRelations: Array<any> = productionData.find((data) => data.label == 'MaterieelDing.productie').nestedMetaData.relations
      const creatorId: string = productionDataRelations.find((relation) => relation.label == 'vervaardiger').key.split('/')[1]
      return creatorId
    },
    openIIIFModal(url: string){
      this.IIIfImageUrl = url
      this.openFullscreenModal()
    }
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
