<template>
  <BaseModal customZIndex="z-50" :modal-state="ConfirmationModalState.state" @hide-modal="closeConfirmationModal" :showCloseButton="false"
    ><section class="p-4">
      <p class="text-xl mb-6">{{ modalText }}</p>
      <div class="flex justify-evenly">
        <BaseButton customStyle="ghost-black" :text="declineButtonText" :iconShown="false" @click="closeConfirmationModal" />
        <BaseButton customStyle="ghost-red" :text="confirmButtonText" :iconShown="false" @click="handleCallback" />
      </div>
    </section>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BaseModal, BaseButton } from 'coghent-vue-3-component-library'
import { ModalState } from 'coghent-vue-3-component-library/lib/composables/useMediaModal'
import { useI18n } from 'vue-i18n'

type ConfirmationModalType = {
  state: ModalState
  confirmationCallback: Function | undefined
  confirmationEntityId: string | undefined
}

const ConfirmationModalState = ref<ConfirmationModalType>({
  state: 'hide',
  confirmationCallback: undefined,
  confirmationEntityId: undefined,
})

export const useConfirmationModal = () => {
  const updateConfirmationModal = (ConfirmationModalInput: ModalState) => {
    ConfirmationModalState.value.state = ConfirmationModalInput
  }

  const setConfirmationEntityId = (id: string) => {
    ConfirmationModalState.value.confirmationEntityId = id
  }

  const setConfirmationCallback = (callback: Function) => {
    ConfirmationModalState.value.confirmationCallback = callback
  }

  const closeConfirmationModal = () => {
    updateConfirmationModal('hide')
  }

  const openConfirmationModal = () => {
    updateConfirmationModal('show')
  }
  return {
    setConfirmationCallback,
    setConfirmationEntityId,
    closeConfirmationModal,
    openConfirmationModal,
    ConfirmationModalState,
  }
}

export default defineComponent({
  name: 'ConfirmationModal',
  components: { BaseModal, BaseButton },
  props: {
    modalText: {
      type: String,
      required: true,
    },
    confirmButtonText: {
      type: String,
      required: true,
    },
    declineButtonText: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { openConfirmationModal, closeConfirmationModal, ConfirmationModalState } = useConfirmationModal()
    const { t } = useI18n()

    const handleCallback = () => {
      closeConfirmationModal()
      if (ConfirmationModalState.value.confirmationCallback) {
        ConfirmationModalState.value.confirmationCallback()
      }
    }

    return { ConfirmationModalState, closeConfirmationModal, t, handleCallback }
  },
})
</script>
