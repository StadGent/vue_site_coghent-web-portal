<template>
  <div v-show="modalState === 'show' || modalState === 'loading'" class="fixed z-50 inset-0 w-4/5 h-screen">
    <div class="flex items-end justify-center mt-20 sm:mt-0 text-center sm:block sm:p-0 h-4/5">
      <div class="fixed inset-0 bg-neutral-80 bg-opacity-75 transition-opacity" aria-hidden="true" @click="hideModal"></div>

      <span class="hidden sm:inline-block sm:align-middle h-screen" aria-hidden="true">&#8203;</span>
      <div
        class="inline-block align-bottom bg-text-red rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:w-11/12"
        :class="{
          'sm:max-w-4xl': !large,
          'h-full': large,
          'overflow-y-scroll': scroll,
        }"
      >
        <div class="bg-neutral-0 h-full">
          <div class="h-full">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, watch } from 'vue'

export type ModalState = 'show' | 'hide' | 'loading'

export default defineComponent({
  name: 'Modal',
  props: {
    modalState: {
      type: String as PropType<ModalState>,
      required: true,
      default: 'hide',
    },
    large: {
      type: Boolean,
      required: false,
      default: false,
    },
    scroll: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['update:modalState', 'hideModal'],
  setup(props, { emit }) {
    const hideModal: () => void = () => {
      emit('update:modalState', 'hide')
      emit('hideModal', 'hide')
    }

    const { modalState } = toRefs(props)

    watch(modalState, (value: ModalState) => {
      if (value == 'show' || value == 'loading') {
        document.body.classList.add('overflow-hidden')
      } else {
        document.body.classList.remove('overflow-hidden')
      }
    })

    return {
      hideModal,
    }
  },
})
</script>

<style scoped>
.h-screen-90 {
  height: 90vh;
}
</style>
