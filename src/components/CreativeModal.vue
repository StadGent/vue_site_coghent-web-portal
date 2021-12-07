<template>
  <modal :large="true" :scroll="true" :modal-state="CCModalState.state" class="w-9/12 m-auto" @hide-modal="closeCCModal">
    <div class="w-full h-min flex flex-wrap place-content-center px-12 lg:px-36 sm:px-16 md:px-24 bg-background-light">
      <h1 class="font-bold text-3xl my-7 lg:my-12">{{ t('copyright.title') }}</h1>
    </div>
    <div class="bg-background-medium flex flex-wrap overflow-y-auto">
      <div class="px-12 space-y-6 mt-12 lg:px-36 sm:px-16 md:px-24">
        <div class="space-y-2">
          <p class="font-bold text-xl">{{ t('copyright.whatAreCC') }}</p>
          <p class="text-sm">
            {{ t('copyright.whatAreCCText') }}
          </p>
        </div>
        <div class="space-y-2">
          <p class="font-bold text-xl">{{ t('copyright.whatAreRS') }}</p>
          <p class="text-sm">
            {{ t('copyright.whatAreRSText') }}
          </p>
        </div>
        <div class="space-y-2">
          <p class="font-bold text-xl">{{ t('copyright.whatRSUsed') }}</p>
          <p class="text-sm">
            {{ t('copyright.whatRSUsedText') }}
          </p>
          <p class="text-sm">{{ t('copyright.whatRSUsedTextLink1') }} <a href="https://creativecommons.org">https://creativecommons.org.</a></p>
          <p class="text-sm">{{ t('copyright.whatRSUsedTextLink2') }} <a href="https://rightsstatements.org">https://rightsstatements.org.</a></p>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pt-4">
          <img class="w-48 h-16" src="../assets/publicdomain.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">{{ t('copyright.PDM') }}</p>
            <p class="text-sm">
              {{ t('copyright.PDMText') }}
            </p>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10">
          <img class="w-48 h-16" src="../assets/cc-zero.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">{{ t('copyright.CC0') }}</p>
            <p class="text-sm">
              {{ t('copyright.CC0Text') }}
            </p>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10">
          <img class="w-48 h-16" src="../assets/by-nc-nd.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">{{ t('copyright.CC-BY-NC-ND') }}</p>
            <p class="text-sm">{{ t('copyright.CC-BY-NC-NDText') }}</p>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10">
          <img class="w-48 h-12" src="../assets/InCopyright.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">{{ t('copyright.InCopyright') }}</p>
            <p class="text-sm">
              {{ t('copyright.InCopyrightText') }}
            </p>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-16">
          <img class="w-48 h-10" src="../assets/InCopyright-rightsholder.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">{{ t('copyright.InCopyrightUnknown') }}</p>
            <p class="text-sm">
              {{ t('copyright.InCopyrightUnknownText') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Modal, { ModalState } from './base/Modal.vue'
import { useI18n } from 'vue-i18n'

export type CCModalType = {
  state: ModalState
}

const CCModalState = ref<CCModalType>({
  state: 'hide',
})

export const useCCModal = () => {
  const updateCCModal = (CCModalInput: CCModalType) => {
    CCModalState.value = CCModalInput
  }

  const closeCCModal = () => {
    updateCCModal({
      state: 'hide',
    })
  }

  const openCCModal = () => {
    updateCCModal({
      state: 'show',
    })
  }

  return {
    closeCCModal,
    openCCModal,
    CCModalState,
  }
}

export default defineComponent({
  components: {
    Modal,
  },
  setup() {
    const { closeCCModal, CCModalState } = useCCModal()
    const { t } = useI18n()
    return {
      closeCCModal,
      CCModalState,
      t,
    }
  },
})
</script>
