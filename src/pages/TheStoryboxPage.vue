<template>
  <BaseModal :modal-state="closeWindow" :large="true" class="py-16 z-40" :scroll="true" @hide-modal="close">
    <div class="h-full p-8 flex flex-col">
      <div class="customParent">
        <h1 class="w-full flex justify-center text-4xl mb-4 font-bold">{{ t('storybox.title') }}</h1>
        <div class="w-full mt-6 mb-8">
          <p class="text-lg my-2 font-bold">{{ t('storybox.step2.storyTitle') }}</p>
          <input class="bg-background-light h-10 w-full p-2" type="text" @change="(event) => (story.title = event.target.value)" :value="story.title"/>
        </div>
        <story-box-create :description="story.description" :assets="story.assets" @description="(description) => (story.description = description)" @assets="(assets) => (story.assets = assets)" />
        <div class="object-bottom w-full h-fit pb-8 flex flex-row place-content-end">
          <base-button :text="t('storybox.story.close')" :on-click="() => close()" custom-style="secondary" :icon-shown="false" custom-icon="storybox" class="px-2 mx-3 ml-3" />
          <base-button :text="t('storybox.story.save')" :on-click="() => save()" :icon-shown="false" custom-icon="storybox" class="bg-accent-red px-2 mx-3 ml-3" />
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script lang="ts">
import useStoryBox from '@/composables/useStoryBox'
import { BaseButton, BaseModal } from 'coghent-vue-3-component-library'
import { defineComponent, onMounted, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { router } from '@/app'
import StoryBoxCreate from '@/components/StoryBoxCreate.vue'

export type StoryBuild = {
  title: null | string
  language: null | string
  description: null | string
  assets: Array<any>
}

export enum Language {
  'DUTCH' = 'Nederlands',
  'English' = 'Engels',
  'FRENCH' = 'Français',
  'GERMAN' = 'Deutsch',
  'SPANISH' = 'Español',
}

export default defineComponent({
  components: { BaseButton, BaseModal, StoryBoxCreate },
  setup() {
    const { t } = useI18n()
    const { getRelationEntities } = useStoryBox()
    const closeWindow = ref<string>('show')
    const story = reactive<StoryBuild>({
      title: null,
      language: Language.DUTCH,
      description: null,
      assets: [],
    })
    const description = ref('')
    document.body.classList.add('overflow-y-hidden')

    const close = () => {
      closeWindow.value = 'hide'
      document.body.classList.remove('overflow-y-hidden')
      router.push('/')
    }

    const save = () => {
      console.log(`useStoryBox.saveFrame()`, story)
      close()
    }

    onMounted(async () => {
      story.assets = await getRelationEntities()
      if(true){
        story.title = 'i already filled this in'
        story.description = 'i already filled this in'
        story.assets = []
      }
    })

    return { t, closeWindow, save, description, story, close }
  },
})
</script>
<style scoped>
.customParent {
  min-height: 90%;
}
</style>
