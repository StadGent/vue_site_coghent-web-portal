<template>
  <modal :large="true" :scroll="true" :modal-state="DetailsModalState.state" @hide-modal="closeDetailsModal" class="w-9/12 m-auto">
    <section class="flex flex-col" v-if="entity">
      <section class="flex flex-col lg:flex-row pt-10 md:pt-0">
        <section class="bg-background-light lg:min-w-max">
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
          <div v-if="entity.mediafiles" class="flex flex-row lg:flex-col overflow-x-auto h-max">
            <div v-for="photo in entity.mediafiles" :key="photo">
              <div class="flex relative">
                <img class="m-3 lg:ml-6 w-48 md:w-76 lg:w-96 sm:w-96 lg:min-w-11/12" :src="photo.original_file_location" />

                <div class="top-4 right-0 md:right-1 lg:top-5 lg:right-4  absolute z-30 bg-background-light rounded-full cursor-pointer">
                  <base-button class="absolute right-0 w-0 z-30 transform scale-75 md:scale-90" customStyle="cc-round-black" customIcon="creativeCommonsCC" :iconShown="true" :onClick="openCCModal" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="bg-background-medium">
          <p v-show="entity.description && entity.description[0]" class="ml-8 m-3 mt-6 lg:mr-10 lg:mt-20">
            {{ entity.description[0]?.value }}
          </p>
          <div class="font-medium pb-2">
            <relation-tag v-for="relation in entity.relations" :id="relation.key" :key="relation.value" class="bg-tag-neutral" />
          </div>
          <h3 class="font-bold text-lg mt-5 ml-8">
            {{ t('details.modal.characteristics') }}
          </h3>
          <ul class="mt-5 flex flex-col gap-3 ml-8">
            <li v-for="metaData in entity.metadata" :key="metaData.value" class="w-full inline-block">
              <strong class="mr-5">{{ metaData.key }}</strong> {{ metaData.value }}
            </li>
          </ul>
          <h3 class="font-bold text-lg mt-5 mb-3 ml-8">
            {{ t('details.modal.associations') }}
          </h3>
          <div class="mx-5 flex gap-3 ml-8 mb-4">
            <div v-for="relation in entity.relations" :key="relation.key">
              <p v-if="relation.label" class="px-2 py-2 bg-tag-neutral mr-4 bg-opacity-50">
                {{ relation.label }}
              </p>
            </div>
          </div>
        </section>
      </section>
      <section id="footer" class="flex items-center justify-center bg-background-medium lg:bg-background-light p-2 lg:p-10 mb-3 lg:mb-0">
        <base-button class="w-12 h-12 pl-6 mt-3 ml-3 stroke-current text-text-black inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="link" :icon-shown="true" />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.link')" :on-click="onClick" custom-style="ghost-black" custom-icon="link" :icon-shown="true" />
        <div class="border-r-2 h-6 border-text-dark border-opacity-70 mx-6 hidden lg:inline-block" />
        <base-button class="w-12 h-12 pl-6 mt-3 ml-3 stroke-current text-text-black inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="edit" :icon-shown="true" />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.edit')" :on-click="onClick" custom-style="ghost-black" custom-icon="edit" :icon-shown="true" />
        <div class="border-r-2 align-center h-6 border-text-dark border-opacity-70 mx-6 hidden lg:inline-block" />
        <base-button class="w-12 h-12 pl-6 mt-3 ml-3 inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="storybox" :icon-shown="true" />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.add')" :on-click="onClick" custom-style="ghost-purple" custom-icon="storybox" :icon-shown="true" />
      </section>
    </section>
  </modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import RelationTag from './RelationTag.vue'
import { useI18n } from 'vue-i18n'
import Modal, { ModalState } from './base/Modal.vue'
import { Entity } from 'coghent-vue-3-component-library/lib/queries'
import { BaseButton } from 'coghent-vue-3-component-library'

export type DetailsModalType = {
  state: ModalState
}

const entity = ref<Entity>()

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

  const setEntity = (data: Entity) => {
    entity.value = data
    console.log('Set Entity', entity.value)
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
  },
  setup() {
    const { closeDetailsModal, DetailsModalState } = useDetailsModal()
    const openTab = ref<boolean>(false)

    const toggleCCTab = () => {
      openTab.value = !openTab.value
    }

    const { t } = useI18n()

    return {
      closeDetailsModal,
      DetailsModalState,
      toggleCCTab,
      openTab,
      entity,
      t,
    }
  },
})
</script>