<template>
  <!-- <router-link :to="profileListItemInfo.onClickUrl" > -->
  <section
    @click="isClickable ? router.push(profileListItemInfo.onClickUrl) : null"
    :class="`${showStoryFeature ? 'cursor-pointer' : ''} bg-neutral-0 p-4 mb-4 w-full ${profileListItemInfo.pictureUrl ? 'flex' : ''}`"
  >
    <div v-if="profileListItemInfo.pictureUrl" class="flex items-center mr-4 w-12 h-12 md:w-24 md:h-24">
      <img :src="profileListItemInfo.pictureUrl" />
    </div>
    <div class="w-full">
      <div class="flex justify-between pb-2">
        <h2 class="font-bold">{{ profileListItemInfo.title }}</h2>
        <div v-if="showWorksFeature" class="mr-8 px-4 py-0.5 bg-opacity-20 text-opacity-100 font-bold text-sm flex flex-row items-center" :class="getTagInfo().style">
          <div :class="getTagInfo().style" class="mr-2 rounded-full h-2 w-2"></div>
          {{ getTagInfo().title }}
        </div>
        <div v-if="showStoryFeature">
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
        <div v-if="profileListItemInfo.code && showStoryFeature">
          <p>{{ t('profile.storybox.code') + profileListItemInfo.code }}</p>
        </div>
      </div>
    </div>
  </section>
  <!-- </router-link> -->
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import StoryEditDropdown from './StoryEditDropdown.vue'
import { PublicationStatus } from 'coghent-vue-3-component-library'
import { Publication } from 'coghent-vue-3-component-library'
import { router } from '@/app'

export enum ProfileListItemType {
  story,
  uploadedWork,
}

export type ProfileListItemInfo = {
  id: string
  title: string
  description: string
  dateCreated: string
  onClickUrl: string
  code?: string
  pictureUrl?: string
  status?: string
  type: ProfileListItemType
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
  setup(props) {
    const { t } = useI18n()
    const showStoryFeature = ref<boolean>(false)
    const showWorksFeature = ref<boolean>(false)
    const isClickable = ref<boolean>(false)

    const checkCardType = () => {
      if (props.profileListItemInfo.type === ProfileListItemType.story) {
        showStoryFeature.value = true
        isClickable.value = true
      }
      if (props.profileListItemInfo.type === ProfileListItemType.uploadedWork) {
        showWorksFeature.value = true
        isClickable.value = true
      }
    }

    const getTagInfo = () => {
      const info = {
        style: '',
        title: '',
      }
      if (props.profileListItemInfo.status) {
        let activeKey = null
        for (const key of Object.values(Publication)) {
          if (props.profileListItemInfo.status === PublicationStatus[key as string]) {
            activeKey = key
          }
        }
        switch (activeKey) {
          case Publication.Validate:
            info.title = 'In behandeling'
            info.style = 'bg-accent-orange text-accent-orange'
            break
          case Publication.Public:
            info.title = 'Gepubliceerd'
            info.style = 'bg-accent-lightGreen text-accent-lightGreen'
            break
        }
      }
      return info
    }

    checkCardType()

    return {
      t,
      showStoryFeature,
      showWorksFeature,
      getTagInfo,
      router,
      isClickable,
    }
  },
})
</script>
