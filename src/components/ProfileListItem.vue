<template>
  <section
    :class="`${isLoading ? 'animate-pulse opacity-30' : ''} ${isClickable ? 'cursor-pointer' : ''} ${
      tagInfo.title === 'Afgewezen' ? 'opacity-50' : ''
    } bg-neutral-0 rounded-t-md sm:rounded-l-md mb-8 sm:mb-4 w-full flex-col sm:flex-row ${profileListItemInfo.pictureUrl ? 'flex' : ''}`"
    @click="isClickable ? router.push(profileListItemInfo.onClickUrl) : null"
  >
    <div class="w-full flex sm:flex-row flex-col-reverse">
      <div v-if="profileListItemInfo.pictureUrl" class="flex items-center w-full justify-center my-4 px-6 sm:pl-4 sm:pr-2 md:w-40">
        <img class="h-full object-contain" :src="profileListItemInfo.pictureUrl" />
      </div>
      <div class="w-full p-4">
        <div class="flex flex-row justify-between pb-2">
          <h2 class="font-bold" :class="[itemAction === 'deleted' ? '' : 'cursor-pointer']" @click="itemAction === 'deleted' ? null : router.push(links.visit)">{{ profileListItemInfo.title }}</h2>
          <div v-if="showWorksFeature" class="my-4 sm:my-0 sm:mr-8 px-4 py-0.5 bg-opacity-20 text-opacity-100 font-bold text-sm flex flex-row items-center" :class="tagInfo.style">
            <div :class="tagInfo.style" class="mr-2 rounded-full h-2 w-2"></div>
            {{ tagInfo.title }}
          </div>
          <div v-if="showStoryFeature">
            <story-edit-dropdown :story-box-info="profileListItemInfo" @click.stop.prevent="" @update="update"
              ><BaseButton custom-icon="threedots" :no-margin="true" custom-style="ghost-black" :icon-shown="true"
            /></story-edit-dropdown>
          </div>
          <div class="flex justify-end px-2" v-if="directDeleteFeature" @click.stop.prevent="">
            <BaseButton custom-icon="delete" :no-margin="true" custom-style="ghost-black" :icon-shown="true" @click="deleteEntity" />
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
    </div>
    <MyWorksActions
      v-if="showWorksFeature && tagInfo.title !== 'Afgewezen'"
      v-model:tagInfo="tagInfo"
      v-model:isLoading="isLoading"
      v-model:itemAction="itemAction"
      :my-works-item="profileListItemInfo"
      :links="links"
      @updateTag="() => getTagInfo()"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import StoryEditDropdown from './StoryEditDropdown.vue'
import { PublicationStatus } from 'coghent-vue-3-component-library'
import { Publication, UserAction } from 'coghent-vue-3-component-library'
import { router } from '@/app'
import { Entity } from 'coghent-vue-3-component-library'
import MyWorksActions from '@/components/MyWorksActions.vue'
import uploadWizard from '@/composables/uploadWizard'

export enum ProfileListItemType {
  story,
  uploadedWork,
  testimony,
}

export type ProfileListItemInfo = {
  id: string
  title: string
  description: string
  dateCreated?: string
  onClickUrl: string
  code?: string
  pictureUrl?: string
  status?: string
  type: ProfileListItemType
  entity?: typeof Entity
  action?: typeof UserAction
}

export type ActionLinks = {
  visit?: string
  edit?: string
  delete?: string
}

export type TagInfo = { title: string; style: string }

export default defineComponent({
  name: 'ProfileListItem',
  components: {
    BaseButton,
    StoryEditDropdown,
    MyWorksActions,
  },
  props: {
    profileListItemInfo: {
      type: Object as PropType<ProfileListItemInfo>,
      required: true,
    },
  },
  emits: ['deleteItem', 'update'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const showStoryFeature = ref<boolean>(false)
    const showWorksFeature = ref<boolean>(false)
    const directDeleteFeature = ref<boolean>(false)
    const isClickable = ref<boolean>(false)
    const openStoryboxes = ref<boolean>(false)
    const assetIsAddedToStoryBox = ref<boolean>(false)
    const links = ref<any>()
    const tagInfo = ref<TagInfo | null>(null)
    const isLoading = ref<boolean>(false)
    const itemAction = ref<typeof UserAction>(props.profileListItemInfo.action)
    const { ASSET_ID_PARAM } = uploadWizard()

    // General use
    const checkCardType = () => {
      if (props.profileListItemInfo.type === ProfileListItemType.story) {
        showStoryFeature.value = true
        isClickable.value = true
        links.value = {
          edit: null,
          visit: props.profileListItemInfo.onClickUrl,
        }
      }
      if (props.profileListItemInfo.type === ProfileListItemType.uploadedWork) {
        showWorksFeature.value = true
        isClickable.value = false
        links.value = {
          edit: `upload?${ASSET_ID_PARAM}=${props.profileListItemInfo.id}`,
          visit:
            tagInfo.value!.title === `In behandeling` && props.profileListItemInfo.id !== undefined
              ? `upload?${ASSET_ID_PARAM}=${props.profileListItemInfo.id}`
              : `/entity/${props.profileListItemInfo.entity.object_id}`,
        }
      }
      if (props.profileListItemInfo.type === ProfileListItemType.testimony) {
        showStoryFeature.value = false
        isClickable.value = true
        directDeleteFeature.value = true
        links.value = {
          edit: null,
          visit: props.profileListItemInfo.onClickUrl,
        }
      }
    }

    // Use for works
    const getTagInfo = () => {
      tagInfo.value = {
        style: '',
        title: '',
      }
      if (props.profileListItemInfo.status) {
        let activeKey = null
        for (const key of Object.values(Publication)) {
          if (props.profileListItemInfo.status === PublicationStatus[key as string]) {
            activeKey = key
          } else if (props.profileListItemInfo.status === 'afgekeurd') {
            activeKey = 'declined'
          }
        }
        switch (activeKey) {
          case Publication.Validate:
            tagInfo.value.title = t('myWorks.overview.statuses.validate')
            tagInfo.value.style = 'bg-accent-orange text-accent-orange'
            break
          case Publication.Public:
            tagInfo.value.title = t('myWorks.overview.statuses.public')
            tagInfo.value.style = 'bg-accent-lightGreen text-accent-lightGreen'
            break
          case Publication.Declined:
            tagInfo.value.title = t('myWorks.overview.statuses.declined')
            tagInfo.value.style = 'bg-text-red text-text-red'
            break
        }

        setCustomWorksTag()
      }
      return tagInfo.value
    }

    const setCustomWorksTag = () => {
      if (itemAction.value === 'deleted') {
        tagInfo.value = {
          title: `Verwijderd`,
          style: `bg-text-red text-text-red`,
        } as TagInfo
      }
    }

    const init = () => {
      if (props.profileListItemInfo.type === ProfileListItemType.uploadedWork) {
        getTagInfo()
      }
      checkCardType()
    }

    watch(tagInfo, () => checkCardType())

    init()

    const deleteEntity = () => {
      emit('deleteItem', props.profileListItemInfo.id)
    }

    const update = () => emit(`update`)

    return {
      t,
      showStoryFeature,
      showWorksFeature,
      directDeleteFeature,
      tagInfo,
      router,
      isClickable,
      links,
      openStoryboxes,
      assetIsAddedToStoryBox,
      deleteEntity,
      isLoading,
      getTagInfo,
      itemAction,
      update,
    }
  },
})
</script>
