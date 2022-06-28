<template>
  <BaseModal :large="true" :modal-state="QRCodeModalState.state" @hide-modal="closeQRCodeModal"
    ><div class="flex flex-col w-full h-full justify-center items-center p-4">
      <div class="w-full">
        <h1 class="font-bold text-4xl">{{ t('storybox.scan') }}</h1>
      </div>
      <div class="flex-grow flex justify-center items-center">
        <qrcode-vue :value="QRCodeValue" :size="300" level="H" />
      </div></div
  ></BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BaseModal, ModalState } from 'coghent-vue-3-component-library'
import QrcodeVue from 'qrcode.vue'
import { useI18n } from 'vue-i18n'

export type QRCodeModalType = {
  state: typeof ModalState
}

const QRCodeModalState = ref<QRCodeModalType>({
  state: 'hide',
})

export const useQRCodeModal = () => {
  const updateQRCodeModal = (QRCodeModalInput: QRCodeModalType) => {
    QRCodeModalState.value = QRCodeModalInput
  }

  const closeQRCodeModal = () => {
    updateQRCodeModal({
      state: 'hide',
    })
  }

  const openQRCodeModal = () => {
    updateQRCodeModal({
      state: 'show',
    })
  }

  return {
    closeQRCodeModal,
    openQRCodeModal,
    QRCodeModalState,
  }
}

export default defineComponent({
  name: 'QRCodeModal',
  components: { BaseModal, QrcodeVue },
  props: {
    QRCodeValue: {
      type: String,
      default: 'Hello World',
      required: true,
    },
  },
  setup() {
    const { closeQRCodeModal, QRCodeModalState } = useQRCodeModal()
    const { t } = useI18n()

    return { closeQRCodeModal, QRCodeModalState, t }
  },
})
</script>
