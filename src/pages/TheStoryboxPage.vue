<template>
  <BaseModal :modal-state="closeWindow" :large="true" class="py-16 z-40" :scroll="true" @hide-modal="close">
    <div v-if="loading" class="h-full p-8 flex flex-col bg-background-light opacity-70 flex-grow absolute top-0 w-full justify-center items-center overflow-hidden">
      <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div>
    </div>
    <div class="h-full p-8 flex flex-col" :class="`${loading === true ? 'overflow-y-hidden' : ''}`">
      <div class="customParent">
        <h1 class="w-full flex justify-center text-4xl mb-4 font-bold">{{ t('storybox.title') }}</h1>
        <div class="flex flex-col lg:flex-row">
          <div class="mb-4 lg:my-0 w-full">
            <p class="text-lg my-2 font-bold">{{ t('storybox.step2.storyTitle') }}</p>
            <input
              class="bg-background-light h-10 w-full p-2"
              type="text"
              :value="StoryBoxState.activeStorybox != null ? StoryBoxState.activeStorybox.title : ''"
              @change="(event) => (StoryBoxState.activeStorybox != null ? (StoryBoxState.activeStorybox.title = event.target.value) : '')"
            />
          </div>
        </div>
        <story-box-create v-if="StoryBoxState.activeStorybox != null" :loading="loading" />
        <div class="object-bottom w-full h-fit pb-8 flex flex-row place-content-end mt-4">
          <base-button :text="t('storybox.story.close')" :on-click="() => close()" custom-style="secondary" :icon-shown="false" custom-icon="storybox" class="px-2 mx-3 ml-3" />
          <base-button :text="t('storybox.story.save')" :on-click="() => save()" :icon-shown="false" custom-icon="storybox" class="bg-accent-red px-2 mx-3 ml-3" />
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script lang="ts">
import { BaseButton, BaseModal, CircleLoader } from 'coghent-vue-3-component-library'
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apolloClient, router } from '@/app'
import StoryBoxCreate from '@/components/StoryBoxCreate.vue'
import { Entity, useStorybox, StoryBoxState } from 'coghent-vue-3-component-library'

export enum Language {
  'DUTCH' = 'Nederlands',
  'English' = 'Engels',
  'FRENCH' = 'Français',
  'GERMAN' = 'Deutsch',
  'SPANISH' = 'Español',
}

export const storyboxCount = ref<number>(0)

export default defineComponent({
  components: { BaseButton, BaseModal, StoryBoxCreate, CircleLoader },
  setup() {
    const { t } = useI18n()
    const closeWindow = ref<string>('show')
    const loading = ref<boolean>(false)
    const frames = ref<Array<typeof Entity>>([
      // { id: 'First storybox', title: [{ value: 'frametitle' }] },
      // { id: 'Second storybox', title: [{ value: 'frametitle' }] },
    ])

    onMounted(async () => {
      const storyboxId = router.currentRoute.value.params.storyboxId
      if (storyboxId) {
        frames.value = StoryBoxState.value.storyboxes
        storyboxCount.value = StoryBoxState.value.count
        loading.value = true
        await useStorybox(apolloClient).createStoryboxFromEntity(storyboxId)
        loading.value = false
      } else router.push('/mystories')
    })

    document.body.classList.add('overflow-y-hidden')

    const close = () => {
      closeWindow.value = 'hide'
      document.body.classList.remove('overflow-y-hidden')
      router.push({ path: '/mystories' })
    }

    const save = async () => {
      console.log(`useStoryBox.saveFrame()`, StoryBoxState.value.activeStorybox)
      await useStorybox(apolloClient).createNew()
      close()
    }

    return { t, closeWindow, save, close, frames, loading, StoryBoxState }
  },
})
</script>
<style scoped>
.customParent {
  min-height: 90%;
}
</style>
