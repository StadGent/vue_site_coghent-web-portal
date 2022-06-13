<template>
  <router-link :to="profileListItemInfo.onClickUrl">
    <section :class="`bg-neutral-0 p-4 mb-4 w-full ${profileListItemInfo.pictureUrl ? 'flex' : ''}`">
      <div v-if="profileListItemInfo.pictureUrl" class="mr-4 bg-text-dark opacity-50 w-12 h-12 md:w-24 md:h-24"></div>
      <div class="w-full">
        <div class="flex justify-between pb-2">
          <h2 class="font-bold">{{ profileListItemInfo.title }}</h2>
          <div>
            <story-edit-dropdown :storyBoxInfo="profileListItemInfo"><BaseButton customIcon="threedots" customStyle="ghost-black" :iconShown="true" /></story-edit-dropdown>
          </div>
        </div>
        <div class="pb-2">
          <p>{{ profileListItemInfo.description }}</p>
        </div>
        <div class="text-tag-selected text-opacity-50 flex justify-between">
          <div>
            <p>{{ t('profile.creation-date') + profileListItemInfo.dateCreated }}</p>
          </div>
          <div v-if="profileListItemInfo.code">
            <p>{{ t('profile.code') + profileListItemInfo.code }}</p>
          </div>
        </div>
      </div>
    </section>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import StoryEditDropdown from './StoryEditDropdown.vue'

export type ProfileListItemInfo = {
  id: string
  title: string
  description: string
  dateCreated: string
  onClickUrl: string
  code?: number
  pictureUrl?: string
}

export default defineComponent({
  name: 'ProfileListItem',
  components: { BaseButton, StoryEditDropdown },
  props: {
    profileListItemInfo: {
      type: Object as PropType<ProfileListItemInfo>,
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
