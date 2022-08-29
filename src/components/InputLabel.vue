<template>
  <div class="flex text-lg">
    <label class="font-bold mb-2" :for="labelFor">{{ label }}</label
    ><span v-if="inputIsRequired" class="px-2 text-accent-purple">*</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'inputLabel',
  props: {
    label: {
      type: String,
      required: true,
    },
    labelFor: {
      type: String,
      required: true,
    },
    inputIsRequired: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
})
</script>
