<template>
  <VDropdown>
    <slot></slot>
    <template #popper>
      <div><BaseButton custom-style="storybox-black" :text="t('storybox.edit')" custom-icon="edit" :icon-shown="true" @click="editStory" /></div>
      <div v-if="storyBoxInfo.code"><BaseButton custom-style="storybox-black" :text="t('storybox.copyCode')" custom-icon="copy" :icon-shown="true" @click="copyStoryCode" /></div>
      <div><BaseButton custom-style="storybox-red" :text="t('storybox.delete')" custom-icon="wasteBasket" :icon-shown="true" @click="deleteStory" /></div>
    </template>
  </VDropdown>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { ProfileListItemInfo } from './ProfileListItem.vue'
import useClipboard from 'vue-clipboard3'

export default defineComponent({
  name: 'StoryEditDropdown',
  components: { BaseButton },
  props: {
    storyBoxInfo: {
      type: Object as PropType<ProfileListItemInfo>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const { toClipboard } = useClipboard()

    const editStory = () => {
      console.log(props.storyBoxInfo)
      console.log('EDIT')
    }

    const copyStoryCode = () => {
      if (props.storyBoxInfo.code) {
        toClipboard(props.storyBoxInfo.code?.toString())
      }
    }

    const deleteStory = () => {
      console.log(props.storyBoxInfo)
      console.log('DELETE')
    }

    return {
      editStory,
      copyStoryCode,
      deleteStory,
      t,
    }
  },
})
</script>
