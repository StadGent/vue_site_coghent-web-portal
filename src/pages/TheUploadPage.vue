<template>
  <BaseModal :modal-state="modalState" :large="true" class="py-16 z-40" :scroll="false" @hide-modal="() => openCloseUpload(`hide`)">
    <div class="flex flex-col justify-between h-full bg-background-medium">
      <div class="h-full pt-8">top</div>
      <div class="flex flex-rows px-8 h-fit items-center bg-background-light">
        <base-button class="my-8" :on-click="() => {}" :iconShown="false" customStyle="secondary" :text="t(`flow.previous`)"></base-button>
        <div class="w-full flex justify-center">flow state</div>
        <base-button class="my-8" :on-click="() => {}" :iconShown="false" :text="t(`flow.next`)"></base-button>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { ModalState, BaseButton, BaseModal } from 'coghent-vue-3-component-library'
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const useModal = () => {
  const modalState = ref<typeof ModalState>(`hide`)
  const openCloseUpload = (_state: typeof ModalState) => (modalState.value = _state)

  return { modalState, openCloseUpload }
}

export default defineComponent({
  components: { BaseModal, BaseButton },
  setup() {
    const { modalState, openCloseUpload } = useModal()
    const { t } = useI18n()

    watch(modalState, (state: string) => {
      state === 'show' ? document.body.classList.add('overflow-y-hidden') : null
      state === 'hide' ? document.body.classList.remove('overflow-y-hidden') : null
    })

    const init = () => {
      openCloseUpload(`show`)
    }

    init()

    return {
      t,
      modalState,
      openCloseUpload,
    }
  },
})
</script>

<style scoped>
.height90 {
  min-height: 90%;
}
</style>
