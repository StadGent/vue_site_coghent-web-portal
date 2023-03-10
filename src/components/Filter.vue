<template>
  <div v-if="!loading && filters.length > 0" class="flex flex-wrap flex-row w-full justify-center mb-5">
    <FilterTag :is-selected="selected.length === 0" :filter="filterAll" :icon="'check'" @click="toggleFilters" />
    <FilterTag v-for="tag in filtersWithLabel" :key="tag" :is-selected="isTagSelected(tag.key)" :filter="tag.value" :icon="'check'" @click="addToSelectedTags(tag.key)" />
  </div>
  <div v-if="loading" class="flex flex-wrap flex-row w-full justify-center mb-5">
    <FilterTag v-for="index in 5" :key="index" filter="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" :icon="'check'" />
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
      type: Array as PropType<typeof FullRelationFragment[]>,
      default: () => [],
      required: false,
    },
    selected: {
      type: Array as PropType<typeof FullRelationFragment[]>,
      default: () => [],
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
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
      return props.filters.filter((filter: typeof FullRelationFragment) => filter.value && filter.value !== '')
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
