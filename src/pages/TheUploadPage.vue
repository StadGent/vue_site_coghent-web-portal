<template>
  <BaseModal :modal-state="modalState" :large="true" class="py-16 z-40" :scroll="false" @hide-modal="() => closeWizard()">
    <div class="flex flex-col justify-between h-full bg-background-medium">
      <div class="h-4/5 pt-8">
        <UploadStepOne v-if="currentUploadStep === 1 && canShowStep(1)" @stepDone="(status) => (stepDone = status)" />
        <UploadStepTwo v-if="currentUploadStep === 2 && canShowStep(2)" />
        <UploadStepThree
          v-if="currentUploadStep === 3 && canShowStep(3)"
          @updatedRelations="(relations) => (uploadState.relations = relations)"
          @updatedMetadata="(metadata) => (uploadState.metadata = metadata)"
        />
        <UploadStepFour v-if="currentUploadStep === 4 || (currentUploadStep === 5 && canShowStep(4))" />
        <div class="h-full w-full flex justify-center items-center absolute top-0 left-0 bg-background-dark opacity-50" v-if="showLoader()">
          <CircleLoader />
        </div>
        <UploadDone v-if="currentUploadStep === TOTAL_STEPS && canShowStep(TOTAL_STEPS)" />
      </div>
      <div class="z-10 grid grid-cols-1 grid-rows-2 gap-6 pb-6 lg:pb-0 lg:gap-0 block lg:flex lg:flex-rows lg:px-8 h-1/5 items-center bg-background-light">
        <base-button :class="showPrevious" class="order-2 lg:order-first ml-6" :on-click="previousStep" :icon-shown="false" custom-style="secondary" :text="t(`flow.previous`)"></base-button>
        <StepProgress class="order-1 lg:order-2 col-span-1" :steps="steps" :show-titles="true" :current-step="currentUploadStep" :current-status="'inProgress'" />
        <span class="order-last mr-6">
          <base-button
            v-if="currentUploadStep < 4"
            class=""
            :on-click="() => (stepDone === true ? nextStep() : null)"
            :custom-style="stepDone === true ? 'primary' : 'primaryUnavailable'"
            :icon-shown="false"
            :text="t(`flow.next`)"
          ></base-button>
          <base-button v-if="currentUploadStep === 4 && isModeUploadNew === true" :on-click="nextStep" :icon-shown="false" :text="t(`flow.upload`)"></base-button>
          <base-button v-if="currentUploadStep === 4 && isModeEdit === true" :on-click="nextStep" :icon-shown="false" :text="t(`flow.update`)"></base-button>
          <base-button v-if="currentUploadStep === TOTAL_STEPS" :on-click="closeWizard" :icon-shown="false" :text="t(`flow.close`)"></base-button>
        </span>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { useUpload, CircleLoader } from 'coghent-vue-3-component-library'
import { ModalState, BaseButton, BaseModal, currentUploadStep, StepProgress } from 'coghent-vue-3-component-library'
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import UploadStepOne from '@/components/UploadStepOne.vue'
import UploadStepTwo from '@/components/UploadStepTwo.vue'
import UploadStepThree from '@/components/UploadStepThree.vue'
import UploadStepFour from '@/components/UploadStepFour.vue'
import UploadDone from '@/components/UploadDone.vue'
import StoreFactory from '@/stores/StoreFactory'
import { UserStore } from '@/stores/UserStore'
import { apolloClient, router } from '@/app'
import { uploadState } from 'coghent-vue-3-component-library'
import { UploadStatus } from 'coghent-vue-3-component-library'
import uploadWizard from '@/composables/uploadWizard'
import { getUrlParamValue } from 'coghent-vue-3-component-library'
import { uploadLoadingState } from 'coghent-vue-3-component-library'

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
    UploadStepThree,
    UploadStepFour,
    UploadDone,
    StepProgress,
    CircleLoader,
  },
  setup() {
    const { modalState, openCloseUpload } = useModal()
    const { newInit, nextStep, previousStep, setStatus, upload, setStep, entityToUploadComposable, setUploadState, updateAsset } = useUpload()
    const { t } = useI18n()
    const userStore = StoreFactory.get(UserStore)
    const showPrevious = ref<'visible' | 'invisible'>(`invisible`)
    const steps = ref<Array<string>>([])
    const stepDone = ref<boolean>(false)
    const { TOTAL_STEPS, ASSET_ID_PARAM, getActionValues, canShowStep, assetId, isModeEdit, isModeUploadNew, showPreviousButton } = uploadWizard()

    watch(modalState, (state: string) => {
      state === 'show' ? document.body.classList.add('overflow-y-hidden') : null
      state === 'hide' ? document.body.classList.remove('overflow-y-hidden') : null
    })

    watch(currentUploadStep, async (_step: number) => {
      showPreviousButton(_step) ? (showPrevious.value = 'visible') : (showPrevious.value = 'invisible')
      console.log(`show previous`, showPrevious.value)
      if (_step === 5) {
        isModeUploadNew.value === true ? await upload(apolloClient) : null
        isModeEdit.value === true ? await updateAsset(assetId.value, 'updated', apolloClient) : null
        nextStep()
      }
    })

    watch(
      () => uploadLoadingState.actionValues,
      (actionValuesState) => {
        actionValuesState === 'loaded' ? (stepDone.value = true) : null
      }
    )

    const setSteps = () => {
      steps.value.push(`${t(`myWorks.upload.steps.stepOne`)}`)
      steps.value.push(`${t(`myWorks.upload.steps.stepTwo`)}`)
      steps.value.push(`${t(`myWorks.upload.steps.stepThree`)}`)
      steps.value.push(`${t(`myWorks.upload.steps.stepFour`)}`)
    }

    const closeWizard = () => {
      setStatus(UploadStatus.Waiting)
      openCloseUpload('hide')
      router.push(`myWorks`)
    }

    const prepareWizardData = () => {
      setSteps()
      getActionValues(getUrlParamValue(ASSET_ID_PARAM), setStep, entityToUploadComposable)
    }

    const showLoader = () => {
      const statusses = [uploadLoadingState.actionValues === 'loading', uploadLoadingState.upload === 'loading', uploadLoadingState.update === 'loading']
      return statusses.some((status) => status === true)
    }

    const init = () => {
      if (userStore.hasUser) {
        newInit(userStore.user.value.email)
        openCloseUpload(`show`)
        prepareWizardData()
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
      steps,
      uploadState,
      closeWizard,
      stepDone,
      TOTAL_STEPS,
      canShowStep,
      isModeEdit,
      isModeUploadNew,
      showPreviousButton,
      uploadLoadingState,
      showLoader,
    }
  },
})
</script>

<style lang="css" scoped >
.height90 {
  min-height: 90%;
}
/* .progressAndAction {
  display: grid;
}

@media screen and (max-width: 640px) {
  .progressAndAction:nth-child(0) {
    order: 2;
  }
  .progressAndAction:nth-child(2) {
    order: 1;
  }
} */
</style>
