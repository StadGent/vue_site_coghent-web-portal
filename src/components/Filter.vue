<template>
  <div
    v-if="filters.length > 0"
    class="flex flex-wrap flex-row w-full"
  >
    <FilterTag
      :filter="filterAll"
      :selected="true"
      @click="toggleFilters"
    />
    <FilterTag
      v-for="tag in filters"
      :key="tag"
      :filter="tag"
      @click="addToSelectedTags(tag)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, SetupContext } from 'vue'
import { FilterTag } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'Filter',
  components: { FilterTag },
  props: {
    filterAll: {
      type: String,
      default: '',
      required: false,
    },
    filters: {
      type: Array as PropType<String[]>,
      default: () => [],
      required: false,
    },
    selected: {
      type: Array as PropType<String[]>,
      default: () => [],
      required: false,
    },
  },
  emits: ['selected'],
  setup(props: any, { emit }: SetupContext) {
    let selectedTags: Array<string> = []

    const toggleFilters = () => {
      console.log("TOGGLE FILTERS");
      selectedTags = [];
      emit('selected', selectedTags)
    }

    const addToSelectedTags = (tag: string) => {
      console.log(`Add "${tag}" to filters`);
      if (selectedTags.includes(tag, 0)) {
        selectedTags.splice(selectedTags.indexOf(tag), 1)
      } else selectedTags.push(tag)
      emit('selected', selectedTags)
    }

    return { toggleFilters, addToSelectedTags }
  },
})
</script>
