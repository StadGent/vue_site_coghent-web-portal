<template>
  <div class="grid items-center cursor-pointer bg-background-dark bg-opacity-75" :class="[itemAction === 'deleted' ? 'grid-cols-1' : 'grid-cols-3 grid-row-1 sm:grid-cols-1 sm:grid-row-3']">
    <BaseIcon v-if="itemAction !== 'deleted'" id="edit" :icon="'edit'" class="p-4 flex justify-center items-center stroke-current text-text-white" @click="router.push(links.edit)" />
    <span v-if="itemAction !== 'deleted'" :class="[assetIsAddedToStoryBox === true ? 'bg-accent-purple bg-opacity-90' : '']" class="h-full flex items-center justify-center">
      <AddAssetToStoryboxDropdown
        :skidding="0"
        :distance="0"
        :placement="'auto'"
        :trigger="openStoryboxes"
        :entity="myWorksItem.entity"
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
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { BaseIcon } from 'coghent-vue-3-component-library'
import { apolloClient, router } from '@/app'
import { StoryBoxState, useStorybox } from 'coghent-vue-3-component-library'
import { ActionLinks, ProfileListItemInfo, TagInfo } from '@/components/ProfileListItem.vue'
import AddAssetToStoryboxDropdown from '@/components/AddAssetToStoryboxDropdown.vue'
import { UserAction } from 'coghent-vue-3-component-library'
import { useUpload } from 'coghent-vue-3-component-library'

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
    const assetIsAddedToStoryBox = ref<boolean>(false)
    const openStoryboxes = ref<boolean>(false)
    const { updateAsset, entityToUploadComposable } = useUpload()

    const checkAssetIsInAStorybox = async () => {
      new Promise((resolve, reject) => {
        for (const box of StoryBoxState.value.storyboxes) {
          const found = useStorybox(apolloClient).assetIsInStorybox(props.myWorksItem.entity, box.id)
          found && found.key ? resolve(true) : null
        }
        resolve(false)
      }).then((val) => {
        assetIsAddedToStoryBox.value = val as boolean
      })
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

    const deleteRestoreAsset = async () => {
      emit(`update:isLoading`, true)
      await entityToUploadComposable(props.myWorksItem.entity.id, apolloClient)
      let action: typeof UserAction = 'updated'
      if (props.itemAction) {
        if (props.itemAction === 'deleted') action = 'updated'
        if (props.itemAction === 'updated') action = 'deleted'
      }
      await updateAsset(props.myWorksItem.id, action, apolloClient)
      await entityToUploadComposable(props.myWorksItem.entity.id, apolloClient)
      emit(`update:itemAction`, action)
      emit(`updateTag`, true)
      emit(`update:isLoading`, false)
    }

    const init = () => {
      checkAssetIsInAStorybox()
    }

    init()

    return {
      router,
      deleteRestoreAsset,
      addAssetToStorybox,
      openStoryboxes,
      assetIsAddedToStoryBox,
    }
  },
})
</script>