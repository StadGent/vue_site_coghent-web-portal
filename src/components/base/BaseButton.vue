<template>
  <button
    class="primary"
    @click="onClick()"
  >
    {{ text }}
  </button>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
type ButtonTypes = 'primary' | 'secundary' | 'ghost'

export default defineComponent({
  props: {
    text: { type: String, default: 'Implement me!' },
    onClick: {
      type: Function,
      required: true,
    },
    customstyle: {
      type: String as PropType<ButtonTypes>,
      default: 'primary',
    }
  },
  emits: [],
  setup: (props, { emit }) => {},
})
</script>
<style scoped>
  /* .primary {
    @apply py-2 px-4 mx-2;
    @apply text-text-white bg-accent-purple;
    @apply rounded-full shadow-lg font-bold; 
  } */

</style>
