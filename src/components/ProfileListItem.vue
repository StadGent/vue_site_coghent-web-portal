<template>
  <router-link :to="profileListItemInfo.onClickUrl">
    <section :class="`bg-neutral-0 p-4 mb-4 w-full ${profileListItemInfo.pictureUrl ? 'flex' : ''}`">
      <div v-if="profileListItemInfo.pictureUrl" class="mr-4 w-12 h-12 md:w-24 md:h-24">
        <img :src="profileListItemInfo.pictureUrl" />
      </div>
      <div class="w-full">
        <div class="flex justify-between pb-2">
          <h2 class="font-bold">{{ profileListItemInfo.title }}</h2>
          <div>
            <story-edit-dropdown :story-box-info="profileListItemInfo" @click.stop.prevent=""
              ><BaseButton custom-icon="threedots" :no-margin="true" custom-style="ghost-black" :icon-shown="true"
            /></story-edit-dropdown>
          </div>
        </div>
        <div class="pb-2">
          <p>{{ profileListItemInfo.description }}</p>
        </div>
        <div class="text-tag-selected text-opacity-50 flex justify-between">
          <div v-if="profileListItemInfo.dateCreated">
            <p>{{ t('profile.storybox.creation-date') + profileListItemInfo.dateCreated }}</p>
          </div>
          <div v-if="profileListItemInfo.code">
            <p>{{ t('profile.storybox.code') + profileListItemInfo.code }}</p>
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
  code?: string
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
