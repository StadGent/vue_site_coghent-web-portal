<template>
  <span
    v-if="result"
    class="inline-block px-2 py-2 bg-background-dark cursor-pointer mr-4 bg-opacity-50"
  >{{ result.Entity.title[0].value }}</span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'RelationTag',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const { result, onResult } = useQuery(GetEntityByIdDocument, { id: props.id })

    return { result }
  },
})
</script>

<style scoped></style>
