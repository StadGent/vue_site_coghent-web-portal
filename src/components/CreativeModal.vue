<template>
  <modal :large="true" :scroll="true" :modal-state="CCModalState.state" @hide-modal="closeCCModal" class="w-9/12 m-auto">
    <div class="w-full h-min flex flex-wrap place-content-center px-12 lg:px-36 sm:px-16 md:px-24 bg-background-light ">
      <h1 class="font-bold text-3xl my-7 lg:my-12">Alles wat je wil weten over Creative Commons</h1>
    </div>
    <div class="bg-background-medium flex flex-wrap overflow-y-auto">
      <div class="px-12 space-y-6 mt-12 lg:px-36 sm:px-16 md:px-24">
        <div class="space-y-2">
          <p class="font-bold text-xl">Wat zijn Creative Commons?</p>
          <p class="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud voor verdere uitleg over
            Creative Commons.
          </p>
        </div>
        <div class="space-y-2">
          <p class="font-bold text-xl">Waarom zijn Creative Commons belangrijk?</p>
          <p class="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud voor verdere uitleg over
            Creative Commons.
          </p>
        </div>
        <div class="space-y-2">
          <p class="font-bold text-xl">Welke Creative Commons worden gebruikt door CoGhent?</p>
          <p class="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud voor verdere uitleg over
            Creative Commons.
          </p>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pt-4">
          <img class="w-48 h-16" src="../assets/publicdomain.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">Public Domain</p>
            <p class="text-sm">
              Use this tool if you have identified a work that is free of known copyright restrictions. Creative Commons does not recommend this tool for works that are restricted by copyright laws in
              one or more jurisdictions.
            </p>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10">
          <img class="w-48 h-16" src="../assets/cc-zero.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">CC0</p>
            <p class="text-sm">
              Use this universal tool if you are a holder of copyright or database rights, and you wish to waive all your interests that may exist in your work worldwide. Because copyright laws differ
              around the world, you may use this tool even though you may not have copyright in your jurisdiction, but want to be sure to eliminate any copyrights you may have in other jurisdictions.
            </p>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10">
          <img class="w-48 h-16" src="../assets/by-nc-nd.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">CC BY-NC-ND (Attribution-NonCommercial-NoDerivs)</p>
            <p class="text-sm">You are free to share, copy and redistribute the material in any medium or format. The licensor cannot revoke these freedoms as long as you follow the license terms:</p>
            <p class="text-sm">
              Attribution: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests
              the licensor endorses you or your use.
            </p>
            <p class="text-sm">NonCommercial: You may not use the material for commercial purposes.</p>
            <p class="text-sm">NoDerivatives: If you remix, transform, or build upon the material, you may not distribute the modified material.</p>
            <p class="text-sm">No additional restrictions: You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.</p>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10">
          <img class="w-48 h-12" src="../assets/InCopyright.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">In Copyright</p>
            <p class="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.
            </p>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-10 pb-16">
          <img class="w-48 h-10" src="../assets/InCopyright-rightsholder.png" />
          <div class="flex flex-col space-y-3">
            <p class="font-bold">Unknown Rightsholder</p>
            <p class="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.
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
    return {
      closeCCModal,
      CCModalState
    }
  },
})
</script>
