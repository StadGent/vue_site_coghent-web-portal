<template>
<div class="flex justify-center items-center">
  <CardComponent :large="true" class="mx-4 sm:mx-0">
  <h1 class="text-lg font-bold">This asset could not be found</h1>
  </CardComponent>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {CardComponent} from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'EntityNotFound',
  components: {
    CardComponent
  },
})
  
</script>

