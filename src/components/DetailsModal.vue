<template>
  <modal :large="true" :scroll="true" :modal-state="DetailsModalState.state" @hide-modal="closeDetailsModal">
    <section v-if="entity" class="flex flex-col h-full overflow-y-auto pb-12 sm:pb-0">
      <section class="flex flex-col lg:flex-row h-10/12 sm:h-4/5">
        <section class="bg-background-light h-auto lg:w-1/3">
          <h1 class="text-2xl font-black my-2 text-center lg:text-left lg:ml-6 mt-6">
            {{ entity.title[0]?.value }}
          </h1>
          <div class="m-3 lg:ml-6 lg:mt-6">
            <base-meta-data :key-word="t('details.modal.objectNumber')" :type="entity.objectNumber[0]?.value" :error-text="t('details.modal.unknown')" />
            <base-meta-data :key-word="t('details.modal.objectName')" :type="entity.objectName[0]?.value" :error-text="t('details.modal.unknown')" />
          </div>
          <div v-if="entity.mediafiles" class="flex flex-row lg:flex-col pr-6 pb-5 overflow-x-auto lg:overflow-y-auto h-4/5 no-scrollbar">
            <div v-for="(photo, index) in entity.mediafiles" :key="photo">
              <div class="flex relative mb-4 w-60 sm:w-auto">
                <LazyLoadImage :url="generateUrl(photo.filename, 'full')" extra-class="m-6 sm:w-full" />
                <copyright-tab class="absolute top-4 right-4 w-full h-full" :infotext="t('main.info')" :selected-index="index" :mediafiles="entity.mediafiles" @openingCcmodal="openNewCCModal" />
              </div>
            </div>
          </div>
        </section>
        <section class="flex flex-col flex-grow bg-background-medium w-full overflow-x-auto overflow-y-visible sm:overflow-y-auto h-auto sm:h-full lg:w-2/3">
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
            <li v-for="metaType in entity.metadataCollection" :key="metaType">
              <base-meta-data v-if="!metaType.nested" :key-word="t(`${metaType.label}`)" :type="concatMetadatValues(metaType.data)" :error-text="t('details.modal.unknown')" />
              <div v-if="metaType.nested" class="mt-2">
                <strong class="col-start-1 w-min inline-block" v-html="t(`${metaType.label}`)" />
                <li v-for="dataItem in metaType.data" :key="dataItem.value" class="ml-5 mb-5">
                  <base-meta-data
                    v-for="(metaData, index) in dataItem.nestedMetaData.metadataCollection"
                    :key="index"
                    :key-word="t(`${metaData.label}`)"
                    :type="concatMetadatValues(metaData.data)"
                    :error-text="t('details.modal.unknown')"
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
                {{ relation }}
              </p>
            </div>
          </div>
          <span class="invisible flex flex-grow h-full" aria-hidden="true">&#8203;</span>
        </section>
      </section>
      <section id="footer" class="flex items-center z-50 bg-background-light justify-center p-2 lg:p-10 h-1/12 sm:h-1/5 shadow-2xl fixed bottom-0 sm:relative w-full pb-6 sm:pb-0">
        <base-button
          class="w-12 h-12 pl-6 mt-3 ml-3 stroke-current text-text-black inline-block lg:hidden"
          :on-click="() => copyUrl(entity.id)"
          custom-style="secondary-round"
          custom-icon="link"
          :icon-shown="true"
        />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.link')" :on-click="() => copyUrl(entity.id)" custom-style="ghost-black" custom-icon="link" :icon-shown="true" />
        <div class="hidden border-r-2 h-6 border-text-dark border-opacity-70 mx-6 hidden" />
        <base-button
          class="hidden w-12 h-12 pl-6 mt-3 ml-3 stroke-current text-text-black inline-block lg:hidden"
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
  </modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import RelationTag from './RelationTag.vue'
import { useI18n } from 'vue-i18n'
import Modal, { ModalState } from './base/Modal.vue'
import { BaseButton, CopyrightTab, LazyLoadImage, BaseMetaData } from 'coghent-vue-3-component-library'
import { useCCModal } from './CreativeModal.vue'
import useClipboard from 'vue-clipboard3'
import useIIIF from '@/composables/useIIIF'
import { Metadata, RelationType } from 'coghent-vue-3-component-library/lib/queries'

export type DetailsModalType = {
  state: ModalState
}

const entity = ref<any>()

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

  const setEntity = (data: any) => {
    if (!data) return
    entity.value = data
    console.log('entity', entity.value)
  }

  return {
    closeDetailsModal,
    openDetailsModal,
    DetailsModalState,
    setEntity,
  }
}

export default defineComponent({
  components: {
    Modal,
    BaseButton,
    CopyrightTab,
    LazyLoadImage,
    BaseMetaData,
  },
  setup(props) {
    const { closeDetailsModal, DetailsModalState } = useDetailsModal()
    const { openCCModal } = useCCModal()
    const { toClipboard } = useClipboard()
    const { generateUrl } = useIIIF()
    const router = useRouter()

    const onClick = () => {
      console.log('Click!')
    }

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

    const concatMetadatValues = (input: Metadata[]): string => {
      let concatString: string = ''
      input.forEach((meta: Metadata) => {
        if (concatString === '') {
          concatString = meta.value ? meta.value : t('details.modal.unknown')
        } else {
          concatString = `${concatString}, ${meta.value}`
        }
      })

      return concatString
    }

    const { t } = useI18n()

    return {
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
      router,
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
