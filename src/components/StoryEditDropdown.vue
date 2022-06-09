<template>
  <VDropdown>
    <slot></slot>
    <template #popper>
      <div><BaseButton customStyle="storybox-black" :text="t('storybox.edit')" customIcon="edit" :iconShown="true" @click="editStory" /></div>
      <div v-if="storyBoxInfo.code"><BaseButton customStyle="storybox-black" :text="t('storybox.copyCode')" customIcon="copy" :iconShown="true" @click="copyStoryCode" /></div>
      <div><BaseButton customStyle="storybox-red" :text="t('storybox.delete')" customIcon="wasteBasket" :iconShown="true" @click="deleteStory" /></div>
    </template>
  </VDropdown>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { StoryBoxInfo } from './StoryBoxListItem.vue'
import useClipboard from 'vue-clipboard3'

export default defineComponent({
  name: 'StoryEditDropdown',
  components: { BaseButton },
  props: {
    storyBoxInfo: {
      type: Object as PropType<StoryBoxInfo>,
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
