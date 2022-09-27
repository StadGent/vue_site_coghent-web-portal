<template>
  <base-modal :large="true" :scroll="true" :modal-state="CCModalState.state" @hide-modal="closeCCModal">
    <div class="w-full h-min flex flex-wrap place-content-center px-12 lg:px-36 sm:px-16 md:px-24 bg-background-light">
      <h1 class="font-bold text-3xl my-7 lg:my-12">{{ t('copyright.title') }}</h1>
    </div>
    <div class="bg-background-medium flex flex-wrap overflow-y-auto">
      <div class="px-12 space-y-6 mt-12 lg:px-36 sm:px-16 md:px-24">
        <div class="space-y-2">
          <p class="font-bold text-xl">{{ t('copyright.whatAreCC') }}</p>
          <p v-html="t('copyright.whatAreCCText')" class="text-sm"></p>
        </div>
        <div class="space-y-2">
          <p class="font-bold text-xl">{{ t('copyright.whatAreRS') }}</p>
          <p v-html="t('copyright.whatAreRSText')" class="text-sm"></p>
        </div>
        <div class="space-y-2">
          <p class="font-bold text-xl">{{ t('copyright.whatRSUsed') }}</p>
          <p class="text-sm">
            {{ t('copyright.whatRSUsedText') }}
          </p>
        </div>
        <div class="space-y-2">
          <p class="font-bold text-xl">{{ t('copyright.whatIsReuse') }}</p>
          <p class="text-sm">
            {{ t('copyright.whatIsReuseText') }}
          </p>
        </div>
        <section>
          <p class="font-bold text-xl pb-4">{{ t('copyright.publicDomainTitle') }}</p>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-16">
            <div class="w-full md:w-full md:w-1/5 flex items-center"><img class="w-ful" src="../assets/publicdomain.png" /></div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.PDM') }}</p>
              <p class="text-sm">
                {{ t('copyright.PDMText') }}
              </p>
            </div>
          </div>
        </section>
        <section>
          <p class="font-bold text-xl pb-4">{{ t('copyright.creativeCommonsTitle') }}</p>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-4">
            <div class="w-full w-full md:w-1/5 flex items-center"><img class="w-full" src="../assets/cc-zero.png" /></div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.CC0') }}</p>
              <p class="text-sm">
                {{ t('copyright.CC0Text') }}
              </p>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-4">
            <div class="w-full w-full md:w-1/5 flex items-center"><img class="w-full" src="../assets/by-sa.png" /></div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.CC-BY-SA') }}</p>
              <p class="text-sm">{{ t('copyright.CC-BY-SAText') }}</p>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-4">
            <div class="w-full md:w-1/5 flex items-center"><img class="w-full" src="../assets/by-nc.png" /></div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.CC-BY-NC') }}</p>
              <p class="text-sm">{{ t('copyright.CC-BY-NCText') }}</p>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-16">
            <div class="w-full md:w-1/5 flex items-center">
              <img class="w-full" src="../assets/by-nc-nd.png" />
            </div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.CC-BY-NC-ND') }}</p>
              <p class="text-sm">{{ t('copyright.CC-BY-NC-NDText') }}</p>
            </div>
          </div>
        </section>
        <section>
          <p class="font-bold text-xl pb-4">{{ t('copyright.rightsStatementsTitle') }}</p>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-4">
            <div class="w-full md:w-1/5 flex items-center"><img class="w-full" src="../assets/InCopyright.png" /></div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.InCopyright') }}</p>
              <p class="text-sm">
                {{ t('copyright.InCopyrightText') }}
              </p>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-4">
            <div class="w-full md:w-1/5 flex items-center"><img class="w-full" src="../assets/InCopyright-NonCommercial.png" /></div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.InCopyrightNonCommercial') }}</p>
              <p class="text-sm">
                {{ t('copyright.InCopyrightNonCommercialText') }}
              </p>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-4">
            <div class="w-full md:w-1/5 flex items-center"><img class="w-full" src="../assets/InCopyright-rightsholder.png" /></div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.InCopyrightUnknown') }}</p>
              <p class="text-sm">
                {{ t('copyright.InCopyrightUnknownText') }}
              </p>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-4">
            <div class="w-full md:w-1/5 flex items-center"><img class="w-full" src="../assets/Copyright-Undetermined.svg" /></div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.InCopyrightUndetermined') }}</p>
              <p class="text-sm">
                {{ t('copyright.InCopyrightUndeterminedText') }}
              </p>
            </div>
          </div>
          <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-16">
            <div class="w-full md:w-1/5 flex items-center"><img class="w-full" src="../assets/NoKnownCopyright.svg" /></div>
            <div class="w-4/5 flex flex-col space-y-3">
              <p class="font-bold">{{ t('copyright.NoKnownCopyright') }}</p>
              <p class="text-sm">
                {{ t('copyright.NoKnownCopyrightText') }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BaseModal, ModalState } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'

export type CCModalType = {
  state: typeof ModalState
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
    BaseModal,
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
