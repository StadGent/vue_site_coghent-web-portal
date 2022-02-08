<template>
  <div width="80" height="77" class="absolute top-0 right-0 overflow-hidden text-accent-yellow">
    <svg width="120" height="119" viewBox="0 0 120 119" class="relative -top-10 -right-10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="1"
        d="M6.38128 49.1539C3.20326 32.893 13.809 17.1346 30.0699 13.9566L70.3846 6.07751C86.6455 2.89948 102.404 13.5052 105.582 29.7661L113.461 70.0808C116.639 86.3417 106.033 102.1 89.7724 105.278L49.4577 113.157C33.1968 116.335 17.4384 105.729 14.2604 89.4686L6.38128 49.1539Z"
        fill="currentColor"
      />
    </svg>
    <base-button class="relative -top-28 -right-20" custom-style="round-white" custom-icon="bigInfo" :icon-shown="true" :on-click="openDisclaimerModal" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useDisclaimerModal } from './DisclaimerPopUp.vue'

export default defineComponent({
  name: 'DisclaimerButton',
  components: { BaseButton },
  setup: () => {
    const { openDisclaimerModal } = useDisclaimerModal()

    return { openDisclaimerModal }
  },
})
</script>

<style></style>
