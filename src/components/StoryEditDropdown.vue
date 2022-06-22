<template>
  <VDropdown>
    <slot></slot>
    <template #popper>
      <div><BaseButton custom-style="storybox-black" :text="t('storybox.edit')" custom-icon="edit" :icon-shown="true" @click="editStory" /></div>
      <div v-if="storyBoxInfo.code"><BaseButton custom-style="storybox-black" :text="t('storybox.copyCode')" custom-icon="copy" :icon-shown="true" @click="copyStoryCode" /></div>
      <div v-else><BaseButton custom-style="storybox-black" :text="t('storybox.showQR')" custom-icon="qrCode" :icon-shown="true" @click="copyStoryCode" /></div>
      <div><BaseButton custom-style="storybox-red" :text="t('storybox.delete')" custom-icon="wasteBasket" :icon-shown="true" @click="deleteStory" /></div>
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
