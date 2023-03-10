<template>
  <VDropdown>
    <slot></slot>
    <template #popper>
      <div>
        <router-link :to="`/mijnverhalen/${storyBoxInfo.id}`" target="_blank"
          ><BaseButton custom-style="storybox-black" :text="t('storybox.edit')" custom-icon="edit" :icon-shown="true"
        /></router-link>
      </div>
      <div><BaseButton v-close-popper custom-style="storybox-black" :text="t('storybox.showQR')" custom-icon="qrCode" :icon-shown="true" @click="openQR" /></div>
      <div><BaseButton v-close-popper custom-style="storybox-red" :text="t('storybox.delete')" custom-icon="wasteBasket" :icon-shown="true" @click="handleConfirmationModal" /></div>
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
import { useConfirmationModal } from './ConfirmationModal.vue'

export default defineComponent({
  name: 'StoryEditDropdown',
  components: { BaseButton },
  props: {
    storyBoxInfo: {
      type: Object as PropType<ProfileListItemInfo>,
      required: true,
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const canRunDeleteQuery = ref<true | false>(false)
    const { t } = useI18n()
    const { toClipboard } = useClipboard()
    const { openQRCodeModal, setQRCodeModalCode } = useQRCodeModal()
    const { openConfirmationModal, setConfirmationCallback } = useConfirmationModal()

    const { mutate } = useMutation(DeleteEntityDocument)

    const openQR = async () => {
      let code = props.storyBoxInfo.code
      const visiter = await useStorybox(apolloClient).getVisiterFromFrame(props.storyBoxInfo.id)
      visiter ? (code = visiter.code) : (code = undefined)
      if (code === undefined) {
        const visiter = await useStorybox(apolloClient).publishStorybox(props.storyBoxInfo.id)
        code = visiter.code
      }
      setQRCodeModalCode(code as string)
      openQRCodeModal()
    }

    const deleteStory = async () => {
      new Promise(async (res, rej) => {
        useStorybox(apolloClient).deleteStoryBoxes([props.storyBoxInfo.id])
        await mutate({ id: props.storyBoxInfo.id })
        emit(`update`)
      })
    }

    const handleConfirmationModal = () => {
      setConfirmationCallback(deleteStory)
      openConfirmationModal()
    }

    return {
      deleteStory,
      t,
      openQR,
      handleConfirmationModal,
    }
  },
})
</script>
