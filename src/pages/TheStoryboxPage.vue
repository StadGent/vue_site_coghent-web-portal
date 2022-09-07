<template>
  <div class="relative">
    <confirmation-modal
      :modal-text="t('storybox.closeConfirmation.confirmationText')"
      :confirm-button-text="t('storybox.closeConfirmation.yes')"
      :decline-button-text="t('storybox.closeConfirmation.no')"
    />
  </div>
  <BaseModal custom-z-index="z-40" :modal-state="closeWindow" :large="true" :scroll="true" @hide-modal="confirmClose">
    <div v-if="loading" class="h-full p-8 flex flex-col bg-background-light opacity-70 flex-grow absolute top-0 w-full justify-center items-center overflow-hidden">
      <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div>
    </div>
    <div class="h-full p-8 flex flex-col" :class="`${loading === true ? 'overflow-y-hidden' : ''}`">
      <div class="customParent">
        <h1 class="w-full flex justify-center text-4xl mb-4 font-bold">{{ t('storybox.title') }}</h1>
        <div class="flex flex-col lg:flex-row">
          <div class="mb-4 lg:my-0 w-full">
            <input-label :label="t('storybox.step2.storyTitle')" label-for="storyboxTitle" :input-is-required="true" />
            <input
              id="storyboxTitle"
              class="bg-background-light h-10 w-full p-2"
              type="text"
              :value="StoryBoxState.activeStorybox != null ? StoryBoxState.activeStorybox.title : ''"
              @change="(event) => (StoryBoxState.activeStorybox != null ? (StoryBoxState.activeStorybox.title = event.target.value) : '')"
            />
          </div>
        </div>
        <story-box-create v-if="StoryBoxState.activeStorybox != null" :loading="loading" />
        <div class="object-bottom w-full h-fit pb-8 flex flex-row place-content-end mt-4 sticky bottom-0">
          <base-button :text="t('storybox.story.close')" :on-click="() => confirmClose()" custom-style="secondary" :icon-shown="false" custom-icon="storybox" class="px-2 mx-3 ml-3" />
          <base-button :text="t('storybox.story.save')" :on-click="() => save()" :icon-shown="false" custom-icon="storybox" class="bg-accent-red px-2 mx-3 ml-3" />
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script lang="ts">
import { BaseButton, BaseModal, CircleLoader } from 'coghent-vue-3-component-library'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apolloClient, router, storyboxCount } from '@/app'
import StoryBoxCreate from '@/components/StoryBoxCreate.vue'
import { Entity, useStorybox, StoryBoxState } from 'coghent-vue-3-component-library'
import ConfirmationModal, { useConfirmationModal } from '../components/ConfirmationModal.vue'
import InputLabel from '../components/InputLabel.vue'

export enum Language {
  'DUTCH' = 'Nederlands',
  'English' = 'Engels',
  'FRENCH' = 'Français',
  'GERMAN' = 'Deutsch',
  'SPANISH' = 'Español',
}

export default defineComponent({
  components: { BaseButton, BaseModal, StoryBoxCreate, CircleLoader, ConfirmationModal, InputLabel },
  setup() {
    const { t } = useI18n()
    const closeWindow = ref<string>('show')
    const loading = ref<boolean>(false)
    const frames = ref<Array<typeof Entity>>([])
    const { openConfirmationModal, setConfirmationCallback } = useConfirmationModal()

    onMounted(async () => {
      const storyboxId = router.currentRoute.value.params.storyboxId
      if (storyboxId) {
        loading.value = true
        await useStorybox(apolloClient).refreshGetStoryboxesWhenEmpty()
        frames.value = StoryBoxState.value.storyboxes
        storyboxCount.value = StoryBoxState.value.count
        loading.value = true
        await useStorybox(apolloClient).createStoryboxFromEntity(storyboxId)
        loading.value = false
      }
      StoryBoxState.value.activeStorybox ? null : router.push('/mijnverhalen')
    })

    document.body.classList.add('overflow-y-hidden')

    const confirmClose = () => {
      setConfirmationCallback(close)
      openConfirmationModal()
    }

    const close = () => {
      closeWindow.value = 'hide'
      document.body.classList.remove('overflow-y-hidden')
      router.push({ path: '/mijnverhalen' })
    }

    const save = async () => {
      await useStorybox(apolloClient).createNew()
      close()
    }

    onUnmounted(() => {
      document.body.classList.remove('overflow-y-hidden')
    })

    return { t, closeWindow, save, close, frames, loading, StoryBoxState, confirmClose }
  },
})
</script>
<style scoped>
.customParent {
  min-height: 90%;
}
</style>
