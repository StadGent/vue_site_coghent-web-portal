<template>
  <BaseModal :modal-state="offensiveContentModalState.modalstate" @hide-modal="closeOffensiveContentModal"
    ><section class="p-4">
      <h1 class="text-xl font-bold">{{ t('details.offensiveContent.title') }}</h1>
      <p>{{ t('details.offensiveContent.description') }}</p>
    </section></BaseModal
  >
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BaseModal } from 'coghent-vue-3-component-library'
import { ModalState } from 'coghent-vue-3-component-library/lib/composables/useMediaModal'
import { useI18n } from 'vue-i18n'

type OffensiveContentModalState = {
  modalstate: ModalState
}

const offensiveContentModalState = ref<OffensiveContentModalState>({
  modalstate: 'hide',
})

export const useOffensiveContentModal = () => {
  const updateOffensiveContentModalState = (input: ModalState) => {
    offensiveContentModalState.value.modalstate = input
  }

  const openOffensiveContentModal = () => {
    updateOffensiveContentModalState('show')
  }

  const closeOffensiveContentModal = () => {
    updateOffensiveContentModalState('hide')
  }

  return { updateOffensiveContentModalState, openOffensiveContentModal, closeOffensiveContentModal, offensiveContentModalState }
}

export default defineComponent({
  name: 'OffensiveContentModal',
  components: { BaseModal },
  setup() {
    const { t } = useI18n()
    const { offensiveContentModalState, closeOffensiveContentModal } = useOffensiveContentModal()

    return { t, offensiveContentModalState, closeOffensiveContentModal }
  },
})
</script>
