<template>
  <VDropdown>
    <slot></slot>
    <template #popper>
      <div><BaseButton custom-style="storybox-black" :text="t('storybox.edit')" custom-icon="edit" :icon-shown="true" @click="editStory" /></div>
      <div><BaseButton v-close-popper custom-style="storybox-black" :text="t('storybox.showQR')" custom-icon="qrCode" :icon-shown="true" @click="openQR" /></div>
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
import { useQRCodeModal } from './QRCodeModal.vue'

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
    const { openQRCodeModal, setQRCodeModalCode } = useQRCodeModal()

    const { mutate } = useMutation(DeleteEntityDocument)

    const editStory = () => {
      router.push(`/mystories/${props.storyBoxInfo.id}`)
    }

    const openQR = () => {
      if (props.storyBoxInfo.code) {
        setQRCodeModalCode(props.storyBoxInfo.code)
        openQRCodeModal()
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
      deleteStory,
      t,
      openQR,
    }
  },
})
</script>
