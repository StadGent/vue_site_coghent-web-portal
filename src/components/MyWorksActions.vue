<template>
  <div class="grid items-center cursor-pointer bg-background-medium bg-opacity-75" :class="[itemAction === 'deleted' ? 'grid-cols-1' : 'grid-cols-3 grid-row-1 sm:grid-cols-1 sm:grid-row-3']">
    <BaseIcon
      v-if="itemAction !== 'deleted'"
      id="edit"
      :icon="'edit'"
      class="row-span-1 h-full p-4 flex justify-center items-center stroke-current text-accent-purple"
      @click="() => (isLoading ? null : router.push(links.edit))"
    />
    <span v-if="itemAction !== 'deleted'" :class="[assetIsAddedToStoryBox === true ? 'bg-opacity-90 bg-text-white' : '']" class="h-full flex items-center justify-center">
      <AddAssetToStoryboxDropdown
        :skidding="0"
        :distance="0"
        :placement="'auto'"
        :trigger="openStoryboxes"
        :entity="myWorksItem.entity"
        @click="() => (isLoading ? null : (openStoryboxes = !openStoryboxes))"
        @addToStorybox="(ids) => addAssetToStorybox(ids)"
      >
        <BaseIcon
          id="storybox"
          :icon="assetIsAddedToStoryBox.length ? 'check' : 'storybox'"
          :class="[assetIsAddedToStoryBox.length ? 'text-text-white bg-accent-purple' : 'text-accent-purple']"
          class="row-span-1 h-full p-4 flex justify-center items-center stroke-current"
        />
      </AddAssetToStoryboxDropdown>
    </span>
    <BaseIcon
      id="delete"
      :icon="itemAction === 'deleted' ? 'undo' : 'delete'"
      :class="itemAction === 'deleted' ? 'text-accent-purple' : 'text-text-red'"
      class="row-span-1 h-full p-4 flex justify-center items-end stroke-current"
      @click="() => (isLoading ? null : itemAction === 'deleted' ? deleteRestoreAsset() : openConfirm())"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue'
import { BaseIcon } from 'coghent-vue-3-component-library'
import { apolloClient, router } from '@/app'
import { StoryBoxState, useStorybox } from 'coghent-vue-3-component-library'
import { ActionLinks, ProfileListItemInfo, TagInfo } from '@/components/ProfileListItem.vue'
import AddAssetToStoryboxDropdown from '@/components/AddAssetToStoryboxDropdown.vue'
import { UserAction } from 'coghent-vue-3-component-library'
import { useUpload } from 'coghent-vue-3-component-library'
import { useConfirmationModal } from './ConfirmationModal.vue'
import { useI18n } from 'vue-i18n'
import { Entity } from 'coghent-vue-3-component-library'
import { Relation } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'MyWorksActions',
  components: {
    BaseIcon,
    AddAssetToStoryboxDropdown,
  },
  props: {
    myWorksItem: {
      type: Object as PropType<ProfileListItemInfo>,
      required: true,
    },
    tagInfo: {
      type: Object as PropType<TagInfo>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    itemAction: {
      type: Object as PropType<typeof UserAction>,
      required: true,
    },
    links: {
      type: Object as PropType<ActionLinks>,
      required: true,
    },
  },
  emits: [`updateTag`, `update:isLoading`, `update:tagInfo`, `update:itemAction`],
  setup(props, { emit }) {
    const assetIsAddedToStoryBox = ref<string[]>([])
    const openStoryboxes = ref<boolean>(false)
    const { updateAsset, entityToUploadComposable } = useUpload()
    const { openConfirmationModal, setConfirmationCallback } = useConfirmationModal()
    const { t } = useI18n()

    const checkAssetIsInAStorybox = async () => {
      const presentBoxIds: string[] = []
      for (const box of StoryBoxState.value.storyboxes) {
        const found = useStorybox(apolloClient).assetIsInStorybox(props.myWorksItem.entity, box.id)
        found && found.key ? presentBoxIds.push(box.id) : null
      }
      assetIsAddedToStoryBox.value = presentBoxIds
    }

    const addAssetToStorybox = async (_storyBoxIds: Array<string>) => {
      emit(`update:isLoading`, true)
      for (const _box of StoryBoxState.value.storyboxes) {
        if (_storyBoxIds.includes(_box.id)) {
          await useStorybox(apolloClient).assetToStorybox(_box.id, props.myWorksItem.id)
        }
      }
      await useStorybox(apolloClient).getStoryboxes()
      checkAssetIsInAStorybox()
      emit(`update:isLoading`, false)
    }

    const deleteAssetFromStoryboxes = () => {
      assetIsAddedToStoryBox.value.forEach(async (boxid) => {
        await useStorybox(apolloClient).createStoryboxFromEntity(boxid)
        StoryBoxState.value.activeStorybox.assets = StoryBoxState.value.activeStorybox.assets.filter((asset: typeof Entity) => asset.id !== props.myWorksItem.id)
        useStorybox(apolloClient).createNew()
      })
    }

    const deleteRestoreAsset = async () => {
      emit(`update:isLoading`, true)
      await entityToUploadComposable(props.myWorksItem.entity.id, apolloClient)
      let action: typeof UserAction = 'updated'
      if (props.itemAction) {
        if (props.itemAction === 'deleted') action = 'updated'
        if (props.itemAction === 'updated') action = 'deleted'
      }
      checkAssetIsInAStorybox()
      if (action == 'deleted') {
        deleteAssetFromStoryboxes()
      }
      await updateAsset(props.myWorksItem.id, action, apolloClient)
      await entityToUploadComposable(props.myWorksItem.entity.id, apolloClient)
      emit(`update:itemAction`, action)
      emit(`updateTag`, true)
      emit(`update:isLoading`, false)
    }

    const openConfirm = () => {
      setConfirmationCallback(deleteRestoreAsset)
      openConfirmationModal()
    }

    onMounted(async () => {
      await useStorybox(apolloClient).getStoryboxes()
      checkAssetIsInAStorybox()
    })

    return {
      t,
      router,
      deleteRestoreAsset,
      addAssetToStorybox,
      openStoryboxes,
      assetIsAddedToStoryBox,
      openConfirmationModal,
      openConfirm,
    }
  },
})
</script>
