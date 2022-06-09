<template>
  <section :class="`bg-neutral-0 p-4 mb-4 w-full ${storyBoxInfo.pictureUrl ? 'flex' : ''}`">
    <div v-if="storyBoxInfo.pictureUrl" class="mr-4 bg-text-dark opacity-50 w-12 h-12 md:w-24 md:h-24"></div>
    <div class="w-full">
      <div class="flex justify-between pb-2">
        <h2 class="font-bold">{{ storyBoxInfo.title }}</h2>
        <div>
          <story-edit-dropdown :storyBoxInfo="storyBoxInfo"><BaseButton customIcon="threedots" customStyle="ghost-black" :iconShown="true" /></story-edit-dropdown>
        </div>
      </div>
      <div class="pb-2">
        <p>{{ storyBoxInfo.description }}</p>
      </div>
      <div class="text-tag-selected text-opacity-50 flex justify-between">
        <div>
          <p>{{ t('profile.creation-date') + storyBoxInfo.dateCreated }}</p>
        </div>
        <div v-if="storyBoxInfo.code">
          <p>{{ t('profile.code') + storyBoxInfo.code }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import StoryEditDropdown from './StoryEditDropdown.vue'

export type StoryBoxInfo = {
  id: string
  title: string
  description: string
  dateCreated: string
  code?: number
  pictureUrl?: string
}

export default defineComponent({
  name: 'StoryBoxListItem',
  components: { BaseButton, StoryEditDropdown },
  props: {
    storyBoxInfo: {
      type: Object as PropType<StoryBoxInfo>,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>
