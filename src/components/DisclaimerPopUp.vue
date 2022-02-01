<template>
  <base-modal :large="false" :scroll="true" :modal-state="DisclaimerModalState.state" @hide-modal="closeDisclaimerModal" @show-modal="openDisclaimerModal">
    <template #small>
      <!-- Text -->
      <div class="">
        <div class="relative overflow-hidden px-8 pt-8">
          <div width="80" height="77" class="absolute -top-10 -right-10 text-accent-yellow">
            <svg width="120" height="119" viewBox="0 0 120 119" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                opacity="1"
                d="M6.38128 49.1539C3.20326 32.893 13.809 17.1346 30.0699 13.9566L70.3846 6.07751C86.6455 2.89948 102.404 13.5052 105.582 29.7661L113.461 70.0808C116.639 86.3417 106.033 102.1 89.7724 105.278L49.4577 113.157C33.1968 116.335 17.4384 105.729 14.2604 89.4686L6.38128 49.1539Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="text-2xl flex flex-col pb-4">
            <span class="text-3xl font-bold">{{ t('disclaimer.small-1') }}</span>
            <span class="text-3xl font-bold text-accent-purple">{{ t('disclaimer.small-2') }}</span>
          </div>
          <div class="pb-4 text-xl">
            <p>{{ t('disclaimer.small-3') }}</p>
          </div>
        </div>
      </div>
      <!-- Boutons -->
      <div class="w-full flex justify-center items-center bg-neutral-20">
        <button class="flex-1 px-4 py-3 text-gray-500 hover:text-neutral-0 hover:bg-accent-purple duration-150 font-bold" @click="closeDisclaimerModal">Ok!</button>
        <button class="flex-1 px-4 py-3 text-gray-500 hover:text-neutral-0 hover:bg-accent-purple duration-150 font-bold" @click="openDisclaimerModal">Meer info</button>
      </div>
    </template>
    <template #default>
      <div class="w-full h-min flex flex-wrap place-content-center px-12 lg:px-32 sm:px-16 md:px-24 bg-background-light">
        <h1 class="font-bold text-3xl my-7 lg:my-12">{{ t('disclaimer.title') }}</h1>
      </div>
      <div class="bg-background-medium flex flex-wrap overflow-y-auto">
        <div class="px-12 space-y-6 my-7 lg:px-36 sm:px-16 md:px-24">
          <div class="space-y-2">
            <p class="text-md">{{ t('disclaimer.content') }}&nbsp;<a class="text-accent-purple underline" href="mailto:collectie@gent.be">collectie@gent.be</a></p>
          </div>
          <div class="space-y-2 mb-4">
            <p class="text-md">
              {{ t('disclaimer.content-2') }}&nbsp;<a class="text-accent-purple underline" href="https://www.collectie.gent/over-het-project" target="_blank">{{ t('disclaimer.link') }}</a
              >&nbsp;{{ t('disclaimer.content-3') }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BaseModal, ModalState } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { getCookie, setCookie } from 'tiny-cookie'

export type DisclaimerModalType = {
  state: ModalState
}

const DisclaimerModalState = ref<DisclaimerModalType>({
  state: 'hide',
})

export const useDisclaimerModal = () => {
  const updateDisclaimerModal = (DisclaimerModalInput: DisclaimerModalType) => {
    DisclaimerModalState.value = DisclaimerModalInput
  }

  const closeDisclaimerModal = () => {
    updateDisclaimerModal({
      state: 'hide',
    })
    // setCookie('disclaimer', 'seen', { expires: 7 })
  }

  const openDisclaimerModal = () => {
    updateDisclaimerModal({
      state: 'show',
    })
  }

  const smallDisclaimerModal = () => {
    updateDisclaimerModal({
      state: 'small',
    })
  }

  return {
    smallDisclaimerModal,
    closeDisclaimerModal,
    openDisclaimerModal,
    DisclaimerModalState,
  }
}

export default defineComponent({
  components: {
    BaseModal,
  },
  setup() {
    const { closeDisclaimerModal, DisclaimerModalState, openDisclaimerModal, smallDisclaimerModal } = useDisclaimerModal()
    const { t } = useI18n()

    const cookie = getCookie('disclaimer')

    if (!cookie) {
      smallDisclaimerModal()
    }

    return {
      closeDisclaimerModal,
      DisclaimerModalState,
      openDisclaimerModal,
      t,
    }
  },
})
</script>
