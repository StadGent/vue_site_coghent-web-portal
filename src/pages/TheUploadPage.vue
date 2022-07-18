<template>
  <BaseModal :modal-state="modalState" :large="true" class="py-16 z-40" :scroll="false" @hide-modal="() => openCloseUpload(`hide`)">
    <div class="flex flex-col justify-between h-full bg-background-medium">
      <div class="h-full pt-8">
        <UploadStepOne v-if="currentUploadStep === 1" />
        <UploadStepTwo v-if="currentUploadStep === 2" />
      </div>
      <div class="flex flex-rows px-8 h-fit items-center bg-background-light">
        <base-button :class="showPrevious" class="my-8" :on-click="previousStep" :iconShown="false" customStyle="secondary" :text="t(`flow.previous`)"></base-button>
        <div class="w-full flex justify-center">flow state</div>
        <base-button class="my-8" :on-click="nextStep" :iconShown="false" :text="t(`flow.next`)"></base-button>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { useUpload } from 'coghent-vue-3-component-library'
import { ModalState, BaseButton, BaseModal, currentUploadStep } from 'coghent-vue-3-component-library'
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import UploadStepOne from '@/components/UploadStepOne.vue'
import UploadStepTwo from '@/components/UploadStepTwo.vue'
import StoreFactory from '@/stores/StoreFactory'
import { UserStore } from '@/stores/UserStore'
import { router } from '@/app'
import { uploadState } from 'coghent-vue-3-component-library'

const useModal = () => {
  const modalState = ref<typeof ModalState>(`hide`)
  const openCloseUpload = (_state: typeof ModalState) => (modalState.value = _state)

  return { modalState, openCloseUpload }
}

export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
    UploadStepOne,
    UploadStepTwo,
  },
  setup() {
    const { modalState, openCloseUpload } = useModal()
    const { newInit, nextStep, previousStep } = useUpload()
    const { t } = useI18n()
    const userStore = StoreFactory.get(UserStore)
    const showPrevious = ref<'visible' | 'invisible'>(`invisible`)

    watch(modalState, (state: string) => {
      state === 'show' ? document.body.classList.add('overflow-y-hidden') : null
      state === 'hide' ? document.body.classList.remove('overflow-y-hidden') : null
    })

    watch(currentUploadStep, (_step: number) => {
      _step !== 1 ? (showPrevious.value = 'visible') : (showPrevious.value = 'invisible')
    })

    const init = () => {
      if (userStore.hasUser) {
        newInit(userStore.user.value.email)
        openCloseUpload(`show`)
      } else router.go(-1)
    }

    init()

    return {
      t,
      modalState,
      openCloseUpload,
      showPrevious,
      currentUploadStep,
      nextStep,
      previousStep,
    }
  },
})
</script>

<style scoped>
.height90 {
  min-height: 90%;
}
</style>