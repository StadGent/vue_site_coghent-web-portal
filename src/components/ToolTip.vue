<template>
  <VDropdown v-model:shown="toolTipState.shown" :placement="placement" :triggers="triggers" auto-hide>
    <slot></slot>
    <template #popper>
      <div class="p-4">
        <h1 class="text-2xl font-bold text-accent-purple">{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
    </template>
  </VDropdown>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

type ToolTipState = {
  shown: boolean
}

const toolTipState = ref<ToolTipState>({
  shown: false,
})

export const useTooltip = () => {
  const updateToolTipShownState = (input: boolean) => {
    toolTipState.value.shown = input
  }

  return { updateToolTipShownState, toolTipState }
}

export default defineComponent({
  props: {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    placement: {
      type: String,
      required: false,
    },
    triggers: {
      type: Array as PropType<String[]>,
      default: () => [],
    },
  },
  setup(props) {
    const { toolTipState } = useTooltip()

    return { toolTipState }
  },
})
</script>
