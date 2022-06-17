<template>
  <div class="w-screen h-screen"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'TheVisitPage',
  components: {},
  props: {},
  setup() {
    const route = useRoute()
    console.log(route.params.visitCode)

    return {}
  },
})
</script>
