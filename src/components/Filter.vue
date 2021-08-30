<template>
  <div
    v-if="filters.length > 0"
    class="flex flex-wrap flex-row w-full"
  >
    <p>{{ setAllTag.value }}</p>
    <FilterTag
      v-model:isSelected="setAllTag"
      :filter="filterAll"
      @click="toggleFilters"
    />
    <FilterTag
      v-for="tag in filters"
      :key="tag"
      v-model:isSelected="tags"
      :filter="tag"
      @click="addToSelectedTags(tag)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, SetupContext, ref, watch } from 'vue'
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
    let tags = ref(false)
    let setAllTag = ref(true)

    const toggleFilters = () => {
      setAllTag.value = !setAllTag.value
      selectedTags = []
      emit('selected', selectedTags)
    }

    const addToSelectedTags = (tag: string) => {
      console.log(`Add "${tag}" to filters`)
      if (selectedTags.includes(tag, 0)) {
        selectedTags.splice(selectedTags.indexOf(tag), 1)
        if (selectedTags.length <= 0) {
          tags.value = false
          setAllTag.value = true
        }
      } else {
        selectedTags.push(tag)
        tags.value = true
        setAllTag.value = false
      }
      emit('selected', selectedTags)
    }
    watch(tags, (value: boolean) => {
      console.log('TAGS watch', value)
    })
    watch(setAllTag, (value: boolean) => {
      console.log('SETALLTAG watch', value)
    })

    return { toggleFilters, addToSelectedTags, tags, setAllTag }
  },
})
</script>
