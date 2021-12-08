<template>
  <modal :large="true" :scroll="true" :modal-state="DetailsModalState.state" class="m-auto" @hide-modal="closeDetailsModal">
    <section v-if="entity" class="flex flex-col w-full h-full overflow-y-auto">
      <section class="flex flex-col lg:flex-row h-10/12 sm:h-4/5">
        <section class="bg-background-light lg:w-2/5 h-full">
          <h1 class="text-2xl font-black my-2 text-center lg:text-left lg:ml-6 mt-6">
            {{ entity.title[0]?.value }}
          </h1>
          <div class="m-3 lg:ml-6 lg:mt-6">
            <p>
              <strong>{{ t('details.modal.objectNumber') }}</strong> ongekend
            </p>
            <p>
              <strong>{{ t('details.modal.objectName') }}</strong> ongekend
            </p>
          </div>
          <div v-if="entity.mediafiles" class="flex flex-row lg:flex-col px-5 pr-7 overflow-x-auto lg:overflow-y-auto h-4/5">
            <div v-for="photo in entity.mediafiles" :key="photo">
              <div class="flex relative w-full h-max">
                <LazyLoadImage :url="generateUrl(photo.filename, 'full')" extra-class="m-3 mr-2 lg:ml-6 w-11/12" />
                <copyright-tab class="absolute top-4 right-4 w-full h-full" :more-info="t('main.info')" @openingCcmodal="openNewCCModal" />
              </div>
            </div>
          </div>
        </section>
        <section class="flex flex-col flex-grow bg-background-medium w-full overflow-x-auto lg:overflow-y-auto h-full lg:w-3/5">
          <p v-show="entity.description && entity.description[0]" class="ml-8 m-3 mt-6 lg:mr-10 xl:mt-20">
            {{ entity.description[0]?.value }}
          </p>
          <div class="font-medium pb-2 flex flex-wrap">
            <relation-tag v-for="relation in entity.relations" :id="relation.key" :key="relation.value" class="bg-tag-neutral" />
          </div>
          <h3 class="font-bold text-lg mt-5 ml-8">
            {{ t('details.modal.characteristics') }}
          </h3>
          <ul class="mt-5 flex flex-col gap-3 ml-8">
            <li v-for="metaType in groupedMetadata" :key="metaType">
              <strong class="mr-5">{{ metaType.key }}</strong> {{ metaType.groupedMetaString }}
              <span v-if="metaType.groupedMetaString == ''" class="text-text-red">{{ t('details.modal.unknown') }}</span>
            </li>
            <li v-for="metaType in groupedMetadata" :key="metaType">
              <strong class="mr-5">{{ metaType.key }}</strong> {{ metaType.groupedMetaString }}
              <span v-if="metaType.groupedMetaString == ''" class="text-text-red">{{ t('details.modal.unknown') }}</span>
            </li>
            <li v-for="metaType in groupedMetadata" :key="metaType">
              <strong class="mr-5">{{ metaType.key }}</strong> {{ metaType.groupedMetaString }}
              <span v-if="metaType.groupedMetaString == ''" class="text-text-red">{{ t('details.modal.unknown') }}</span>
            </li>
          </ul>
          <h3 class="font-bold text-lg mt-5 mb-3 ml-8">
            {{ t('details.modal.associations') }}
          </h3>

          <div class="mx-5 flex gap-3 mb-4 flex-wrap">
            <div v-for="relation in entity.relations" :key="relation.key">
              <p v-if="relation.label" class="px-2 py-2 bg-tag-neutral mb-2 -mr-1 bg-opacity-50">
                {{ relation.label }}
              </p>
            </div>
            <div v-for="relation in entity.relations" :key="relation.key">
              <p v-if="relation.label" class="px-2 py-2 bg-tag-neutral mb-2 -mr-1 bg-opacity-50">
                {{ relation.label }}
              </p>
            </div>
            <div v-for="relation in entity.relations" :key="relation.key">
              <p v-if="relation.label" class="px-2 py-2 bg-tag-neutral mb-2 -mr-1 bg-opacity-50">
                {{ relation.label }}
              </p>
            </div>
          </div>
          <span class="invisible flex flex-grow h-full" aria-hidden="true">&#8203;</span>
        </section>
      </section>
      <section id="footer" class="flex items-center z-10 bg-background-light justify-center p-2 lg:p-10 h-1/12 sm:h-1/5">
        <base-button
          class="w-12 h-12 pl-6 mt-3 ml-3 stroke-current text-text-black inline-block lg:hidden"
          :on-click="() => copyUrl(entity.id)"
          custom-style="secondary-round"
          custom-icon="link"
          :icon-shown="true"
        />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.link')" :on-click="() => copyUrl(entity.id)" custom-style="ghost-black" custom-icon="link" :icon-shown="true" />
        <div class="invisible border-r-2 h-6 border-text-dark border-opacity-70 mx-6 hidden lg:inline-block" />
        <base-button
          class="invisible w-12 h-12 pl-6 mt-3 ml-3 stroke-current text-text-black inline-block lg:hidden"
          :on-click="onClick"
          custom-style="secondary-round"
          custom-icon="edit"
          :icon-shown="true"
        />
        <base-button class="invisible w-max hidden lg:flex" :text="t('details.modal.edit')" :on-click="onClick" custom-style="ghost-black" custom-icon="edit" :icon-shown="true" />
        <div class="invisible border-r-2 align-center h-6 border-text-dark border-opacity-70 mx-6 hidden lg:inline-block" />
        <base-button class="invisible w-12 h-12 pl-6 mt-3 ml-3 inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="storybox" :icon-shown="true" />
        <base-button class="invisible w-max hidden lg:flex" :text="t('details.modal.add')" :on-click="onClick" custom-style="ghost-purple" custom-icon="storybox" :icon-shown="true" />
      </section>
    </section>
  </modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import RelationTag from './RelationTag.vue'
import { useI18n } from 'vue-i18n'
import Modal, { ModalState } from './base/Modal.vue'
import { BaseButton, CopyrightTab, LazyLoadImage } from 'coghent-vue-3-component-library'
import { useCCModal } from './CreativeModal.vue'
import useClipboard from 'vue-clipboard3'
import useIIIF from '@/composables/useIIIF'

export type DetailsModalType = {
  state: ModalState
}

const entity = ref<any>()

let groupedMetadata: any[] = []

const DetailsModalState = ref<DetailsModalType>({
  state: 'hide',
})

const unMappedString = 'unMapped'

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
    groupMetaData()
  }

  const groupMetaData = () => {
    if (entity.value?.metadata) {
      //Set unMappaed key as keys
      const metaData = entity.value?.metadata.map((meta: any) => {
        return {
          key: meta.key === unMappedString && meta.unMappedKey ? meta.unMappedKey : meta.key,
          value: meta.value,
        }
      })

      var grouped = metaData.reduce(function (r: any, a: any) {
        if (!a) return
        r[a.key] = r[a.key] || []
        r[a?.key].push(a)
        return r
      }, Object.create(null))
      let array: any[] = []
      Object.values(grouped).forEach((fromEntry) => {
        array.push(fromEntry)
      })
      Object.entries(grouped).forEach((entry) => {
        array.forEach((metaType) => {
          let groupedMetaString = ''
          metaType.forEach((metaData: any) => {
            if (entry[0] === metaData.key) groupedMetaString = groupedMetaString + metaData.value + ', '
          })
          if (groupedMetaString != '') {
            groupedMetaString = groupedMetaString.slice(0, -2)
            groupedMetadata.push({ key: entry[0], groupedMetaString })
          }
        })
      })
    }
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
    RelationTag,
    BaseButton,
    CopyrightTab,
    LazyLoadImage,
  },
  setup() {
    const { closeDetailsModal, DetailsModalState } = useDetailsModal()
    const openTab = ref<boolean>(false)
    const { openCCModal } = useCCModal()
    const { toClipboard } = useClipboard()
    const { generateUrl } = useIIIF()

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

    const { t } = useI18n()

    return {
      closeDetailsModal,
      DetailsModalState,
      openTab,
      entity,
      t,
      openNewCCModal,
      LazyLoadImage,
      groupedMetadata,
      copyUrl,
      onClick,
      generateUrl,
    }
  },
})
</script>
