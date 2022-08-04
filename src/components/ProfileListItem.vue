<template>
  <section
    @click="isClickable ? router.push(profileListItemInfo.onClickUrl) : null"
    :class="`${isLoading ? 'animate-pulse opacity-30' : ''} ${isClickable ? 'cursor-pointer' : ''} bg-neutral-0 rounded-t-md sm:rounded-l-md mb-8 sm:mb-4 w-full flex-col sm:flex-row ${
      profileListItemInfo.pictureUrl ? 'flex' : ''
    }`"
  >
    <div class="w-full flex sm:flex-row flex-col-reverse">
      <div v-if="profileListItemInfo.pictureUrl" class="flex items-center w-full justify-center my-4 px-6 sm:pl-4 sm:pr-2 md:w-40">
        <img :src="profileListItemInfo.pictureUrl" />
      </div>
      <div class="w-full p-4">
        <div class="flex flex-col sm:flex-row sm:justify-between pb-2">
          <h2 class="font-bold" :class="[itemAction === 'deleted' ? '' : 'cursor-pointer']" @click="itemAction === 'deleted' ? null : router.push(workLinks.visit)">{{ profileListItemInfo.title }}</h2>
          <div v-if="showWorksFeature" class="my-4 sm:my-0 mr-8 px-4 py-0.5 bg-opacity-20 text-opacity-100 font-bold text-sm flex flex-row items-center" :class="tagInfo.style">
            <div :class="tagInfo.style" class="mr-2 rounded-full h-2 w-2"></div>
            {{ tagInfo.title }}
          </div>
          <div v-if="showStoryFeature">
            <story-edit-dropdown :story-box-info="profileListItemInfo" @click.stop.prevent=""
              ><BaseButton custom-icon="threedots" :no-margin="true" custom-style="ghost-black" :icon-shown="true"
            /></story-edit-dropdown>
          </div>
          <div v-if="directDeleteFeature" @click.stop.prevent=""><BaseButton custom-icon="delete" :no-margin="true" custom-style="ghost-black" :icon-shown="true" @click="deleteEntity" /></div>
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
    <div
      class="grid items-center cursor-pointer bg-background-dark bg-opacity-75"
      :class="[itemAction === 'deleted' ? 'grid-cols-1' : 'grid-cols-3 grid-row-1 sm:grid-cols-1 sm:grid-row-3']"
      v-if="showWorksFeature"
    >
      <BaseIcon v-if="itemAction !== 'deleted'" id="edit" :icon="'edit'" class="p-4 flex justify-center items-center stroke-current text-text-white" @click="router.push(workLinks.edit)" />
      <span v-if="itemAction !== 'deleted'" :class="[assetIsAddedToStoryBox === true ? 'bg-accent-purple bg-opacity-90' : '']" class="h-full flex items-center justify-center">
        <AddAssetToStoryboxDropdown
          :skidding="0"
          :distance="0"
          :placement="'auto'"
          :trigger="openStoryboxes"
          :entity="profileListItemInfo.entity"
          @click="() => (openStoryboxes = !openStoryboxes)"
          @addToStorybox="(ids) => addAssetToStorybox(ids)"
        >
          <BaseIcon id="storybox" :icon="assetIsAddedToStoryBox === true ? 'check' : 'storybox'" class="p-4 flex justify-center items-center stroke-current text-text-white" />
        </AddAssetToStoryboxDropdown>
      </span>
      <BaseIcon
        id="delete"
        :icon="[itemAction === 'deleted' ? 'newItem' : 'delete']"
        :class="[itemAction === 'deleted' ? 'text-text-white' : 'text-text-red']"
        class="p-4 flex justify-center items-center stroke-current"
        @click="() => deleteRestoreAsset()"
      />
    </div>
    <!-- <div class="grid grid-cols-3 grid-row-1 sm:grid-cols-1 sm:grid-row-3 items-center cursor-pointer bg-background-dark bg-opacity-75" v-if="showWorksFeature">
      <BaseIcon id="edit" :icon="'edit'" class="p-4 flex justify-center items-center stroke-current text-text-white" @click="router.push(workLinks.edit)" />
      <span :class="[assetIsAddedToStoryBox === true ? 'bg-accent-purple bg-opacity-90' : '']" class="h-full flex items-center justify-center">
        <AddAssetToStoryboxDropdown
          :skidding="0"
          :distance="0"
          :placement="'auto'"
          :trigger="openStoryboxes"
          :entity="profileListItemInfo.entity"
          @click="() => (openStoryboxes = !openStoryboxes)"
          @addToStorybox="(ids) => addAssetToStorybox(ids)"
        >
          <BaseIcon id="storybox" :icon="assetIsAddedToStoryBox === true ? 'check' : 'storybox'" class="p-4 flex justify-center items-center stroke-current text-text-white" />
        </AddAssetToStoryboxDropdown>
      </span>
      <BaseIcon
        id="delete"
        :icon="[itemAction === 'deleted' ? 'newItem' : 'delete']"
        :class="[itemAction === 'deleted' ? 'text-text-white' : 'text-text-red']"
        class="p-4 flex justify-center items-center stroke-current"
        @click="() => deleteRestoreAsset()"
      />
    </div> -->
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { BaseButton, BaseIcon } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import StoryEditDropdown from './StoryEditDropdown.vue'
import { PublicationStatus } from 'coghent-vue-3-component-library'
import { Publication } from 'coghent-vue-3-component-library'
import { apolloClient, router } from '@/app'
import uploadWizard from '@/composables/uploadWizard'
import AddAssetToStoryboxDropdown from '@/components/AddAssetToStoryboxDropdown.vue'
import { StoryBoxState, useStorybox, Entity, DeleteEntityDocument } from 'coghent-vue-3-component-library'
import { useMutation } from '@vue/apollo-composable'
import { useUpload, UserAction } from 'coghent-vue-3-component-library'
import { uploadState } from 'coghent-vue-3-component-library'

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

export default defineComponent({
  name: 'ProfileListItem',
  components: {
    BaseButton,
    StoryEditDropdown,
    BaseIcon,
    AddAssetToStoryboxDropdown,
  },
  props: {
    profileListItemInfo: {
      type: Object as PropType<ProfileListItemInfo>,
      required: true,
    },
  },
  emits: ['deleteItem'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const showStoryFeature = ref<boolean>(false)
    const showWorksFeature = ref<boolean>(false)
    const directDeleteFeature = ref<boolean>(false)
    const isClickable = ref<boolean>(false)
    const openStoryboxes = ref<boolean>(false)
    const assetIsAddedToStoryBox = ref<boolean>(false)
    const workLinks = ref<any>()
    const { ASSET_ID_PARAM } = uploadWizard()
    const { updateAsset, entityToUploadComposable, getAction } = useUpload()
    const tagInfo = ref<{ title: string; style: string } | null>(null)
    const itemAction = ref<typeof UserAction | null>(props.profileListItemInfo.action)
    const isLoading = ref<boolean>(false)

    // General use
    const checkCardType = () => {
      if (props.profileListItemInfo.type === ProfileListItemType.story) {
        showStoryFeature.value = true
        isClickable.value = true
        workLinks.value = {
          edit: null,
          visit: props.profileListItemInfo.onClickUrl,
        }
      }
      if (props.profileListItemInfo.type === ProfileListItemType.uploadedWork) {
        showWorksFeature.value = true
        isClickable.value = false
        workLinks.value = {
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
        workLinks.value = {
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
          }
        }
        switch (activeKey) {
          case Publication.Validate:
            tagInfo.value.title = 'In behandeling'
            tagInfo.value.style = 'bg-accent-orange text-accent-orange'
            break
          case Publication.Public:
            tagInfo.value.title = 'Gepubliceerd'
            tagInfo.value.style = 'bg-accent-lightGreen text-accent-lightGreen'
            break
        }
        if (itemAction.value === 'deleted') {
          tagInfo.value!.title = 'Verwijderd'
          tagInfo.value!.style = 'bg-text-red text-text-red'
        }
      }
      return tagInfo.value
    }

    const checkAssetIsInAStorybox = async () => {
      new Promise((resolve, reject) => {
        for (const box of StoryBoxState.value.storyboxes) {
          const found = useStorybox(apolloClient).assetIsInStorybox(props.profileListItemInfo.entity, box.id)
          found && found.key ? resolve(true) : null
        }
        resolve(false)
      }).then((val) => {
        assetIsAddedToStoryBox.value = val as boolean
      })
    }

    const addAssetToStorybox = async (_storyBoxIds: Array<string>) => {
      for (const _box of StoryBoxState.value.storyboxes) {
        if (_storyBoxIds.includes(_box.id)) {
          await useStorybox(apolloClient).assetToStorybox(_box.id, props.profileListItemInfo.id)
        }
      }
      await useStorybox(apolloClient).getStoryboxes()
      checkAssetIsInAStorybox()
    }

    const deleteRestoreAsset = async () => {
      isLoading.value = true
      await entityToUploadComposable(props.profileListItemInfo.entity.id, apolloClient)
      let action: typeof UserAction = 'updated'
      if (itemAction.value) {
        if (itemAction.value === 'deleted') action = 'updated'
        if (itemAction.value === 'updated') action = 'deleted'
      }
      await updateAsset(props.profileListItemInfo.id, action, apolloClient)
      await entityToUploadComposable(props.profileListItemInfo.entity.id, apolloClient)
      itemAction.value = action // HACK:
      isLoading.value = false
    }
    watch(itemAction, () => {
      getTagInfo()
    })

    const init = () => {
      if (props.profileListItemInfo.type === ProfileListItemType.uploadedWork) {
        checkAssetIsInAStorybox()
        getTagInfo()
      }
      checkCardType()
    }

    init()

    const deleteEntity = () => {
      emit('deleteItem', props.profileListItemInfo.id)
    }

    return {
      t,
      showStoryFeature,
      showWorksFeature,
      directDeleteFeature,
      tagInfo,
      router,
      isClickable,
      workLinks,
      openStoryboxes,
      addAssetToStorybox,
      assetIsAddedToStoryBox,
      deleteEntity,
      deleteRestoreAsset,
      itemAction,
      isLoading,
    }
  },
})
</script>
