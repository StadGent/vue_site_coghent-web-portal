<template>
  <BaseModal :large="true" :modal-state="QRCodeModalState.state" @hide-modal="closeQRCodeModal"
    ><div class="flex flex-col w-full h-full justify-center items-center p-4">
      <div id="js-pdf" class="w-full flex flex-grow flex-col">
        <div class="w-full mb-8">
          <h1 class="font-bold text-4xl">{{ t('storybox.scan') }}</h1>
        </div>
        <div class="flex-grow flex justify-center items-center flex-col">
          <qrcode-vue :value="parseStoryboxUrl()" :size="300" level="H" />
          <BoxVisitCode :code="QRCodeModalState.code" class="mt-12" />
        </div>
      </div>
      <div class="w-full flex justify-end">
        <BaseButton :text="t('storybox.download')" :icon-shown="false" :on-click="convertHtmlToPdf" />
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BaseModal, ModalState, BoxVisitCode, BaseButton } from 'coghent-vue-3-component-library'
import QrcodeVue from 'qrcode.vue'
import { useI18n } from 'vue-i18n'
import { jsPDF } from 'jspdf'

export type QRCodeModalType = {
  state: typeof ModalState
  code: string
}

const QRCodeModalState = ref<QRCodeModalType>({
  state: 'hide',
  code: '',
})

export const useQRCodeModal = () => {
  const updateQRCodeModalState = (QRCodeModalInput: typeof ModalState) => {
    QRCodeModalState.value.state = QRCodeModalInput
  }

  const setQRCodeModalCode = (code: string) => {
    QRCodeModalState.value.code = code
  }

  const closeQRCodeModal = () => {
    updateQRCodeModalState('hide')
  }

  const openQRCodeModal = () => {
    updateQRCodeModalState('show')
  }

  return {
    closeQRCodeModal,
    openQRCodeModal,
    QRCodeModalState,
    setQRCodeModalCode,
  }
}

export default defineComponent({
  name: 'QRCodeModal',
  components: { BaseModal, QrcodeVue, BoxVisitCode, BaseButton },
  props: {},
  setup() {
    const { closeQRCodeModal, QRCodeModalState } = useQRCodeModal()
    const { t } = useI18n()

    const parseStoryboxUrl = () => {
      const url = `${location.origin}/visit/${QRCodeModalState.value.code}`
      return url
    }

    const convertHtmlToPdf = () => {
      const doc = new jsPDF('l', 'mm', [1200, 1210])
      const target = document.getElementById('js-pdf')
      if (target) {
        doc.html(target, {
          callback: function (doc) {
            doc.save('code.pdf')
          },
          x: 10,
          y: 10,
        })
      }
    }

    return { closeQRCodeModal, QRCodeModalState, t, parseStoryboxUrl, convertHtmlToPdf }
  },
})
</script>
