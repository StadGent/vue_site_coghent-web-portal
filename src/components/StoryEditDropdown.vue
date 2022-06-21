<template>
  <VDropdown>
    <slot></slot>
    <template #popper>
      <div><BaseButton customStyle="storybox-black" :text="t('storybox.edit')" customIcon="edit" :iconShown="true" @click="editStory" /></div>
      <div v-if="storyBoxInfo.code"><BaseButton customStyle="storybox-black" :text="t('storybox.copyCode')" customIcon="copy" :iconShown="true" @click="copyStoryCode" /></div>
      <div v-else><BaseButton customStyle="storybox-black" :text="t('storybox.showQR')" customIcon="qrCode" :iconShown="true" @click="copyStoryCode" /></div>
      <div><BaseButton customStyle="storybox-red" :text="t('storybox.delete')" customIcon="wasteBasket" :iconShown="true" @click="deleteStory" /></div>
    </template>
  </VDropdown>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { ProfileListItemInfo } from './ProfileListItem.vue'
import useClipboard from 'vue-clipboard3'
import { apolloClient, router } from '@/app'
import { useMutation } from '@vue/apollo-composable'
import { DeleteEntityDocument, storyboxDataIsUpdated } from 'coghent-vue-3-component-library'
import { useStorybox } from 'coghent-vue-3-component-library'

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
    const canRunDeleteQuery = ref<true | false>(false)
    const { t } = useI18n()
    const { toClipboard } = useClipboard()

    const { mutate } = useMutation(DeleteEntityDocument)

    const editStory = () => {
      router.push(`/mystories/${props.storyBoxInfo.id}`)
    }

    const copyStoryCode = () => {
      if (props.storyBoxInfo.code) {
        toClipboard(props.storyBoxInfo.code?.toString())
      }
    }

    const deleteStory = async () => {
      new Promise(async (res, rej) => {
        useStorybox(apolloClient).deleteStoryBoxes([props.storyBoxInfo.id])
        await mutate({ id: props.storyBoxInfo.id })
        storyboxDataIsUpdated.value = true
        res
      })
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
