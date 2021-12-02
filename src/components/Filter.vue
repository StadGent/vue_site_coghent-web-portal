<template>
  <div v-if="filters.length > 0" class="flex flex-wrap flex-row w-full justify-center">
    <FilterTag :is-selected="selected.length === 0" :filter="filterAll" :icon="'check'" @click="toggleFilters" />
    <FilterTag v-for="tag in filtersWithLabel" :key="tag" :is-selected="isTagSelected(tag.key)" :filter="tag.label" :icon="'check'" @click="addToSelectedTags(tag.key)" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, SetupContext, ref, watch, computed } from 'vue'
import { FilterTag, FullRelationFragment } from 'coghent-vue-3-component-library'

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
      type: Array as PropType<FullRelationFragment[]>,
      default: () => [],
      required: false,
    },
    selected: {
      type: Array as PropType<FullRelationFragment[]>,
      default: () => [],
      required: false,
    },
  },
  emits: ['newSelected'],
  setup(props: any, { emit }: SetupContext) {
    const toggleFilters = () => {
      emit('newSelected', [])
    }

    const addToSelectedTags = (tag: string) => {
      let selectedTags = [...props.selected]
      if (selectedTags.includes(tag, 0)) {
        selectedTags.splice(selectedTags.indexOf(tag), 1)
      } else {
        selectedTags.push(tag)
      }
      emit('newSelected', selectedTags)
    }

    const filtersWithLabel = computed(() => {
      return props.filters.filter((filter: FullRelationFragment) => filter.label && filter.label !== '')
    })

    const isTagSelected = (tag: string): boolean => {
      const filterd = props.selected.filter((tagFromFilter: string) => {
        return tagFromFilter === tag
      })

      return filterd.length > 0
    }

    return { toggleFilters, addToSelectedTags, filtersWithLabel, isTagSelected }
  },
})
</script>
