<template>
<h1>Creator Details</h1>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'CreatorDetails',
  components: {
    // TheGrid
  },
  setup: () => {
    const { t } = useI18n()

    return {
      t,
    }
  }
})
  
</script>

