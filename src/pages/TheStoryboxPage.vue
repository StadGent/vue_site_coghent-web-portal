<template>
  <BaseModal :modal-state="closeWindow" large="true" class="py-16" :scroll="false" >
    <div class="mx-8 min-h-full">
      <div>
        <h1 class="w-full flex justify-center text-4xl my-4 font-bold">{{ t('storybox.title') }}</h1>
        <StoryBoxCreate
          v-if="step === 1"
          :description="story.description"
          @description="(description) => (story.description = description)"
          :assets="story.assets"
          @assets="(assets) => (story.assets = assets)"
        />
        <StoryBoxStep2
          v-if="step === 2"
          @closeWindow="(action) => (closeWindow = action)"
          @storyTitle="(title) => (story.title = title)"
          :language="story.language"
          @language="(lang) => (story.language = lang)"
        />
        <StoryBoxCreated v-if="step === 3" />
      </div>
      <div class="flex flex-row float-right">
        <base-button v-if="step != MAX_STEP" :text="t('storybox.story.close')" :on-click="() => close()" custom-style="secondary" :icon-shown="false" custom-icon="storybox" class="px-2 mx-3 ml-3" />
        <base-button
          v-if="story.assets.length > 0 && step === 1"
          :text="t('storybox.story.next')"
          :on-click="() => next(2)"
          :icon-shown="false"
          custom-icon="storybox"
          class="bg-accent-red px-2 mx-3 ml-3"
        />
        <base-button
          v-if="story.title != null && step === 2"
          :text="t('storybox.story.next')"
          :on-click="() => next(3)"
          :icon-shown="false"
          custom-icon="storybox"
          class="bg-accent-red px-2 mx-3 ml-3"
        />
        <base-button v-if="step === MAX_STEP" :text="t('storybox.story.end')" :on-click="() => createStory()" :icon-shown="false" custom-icon="storybox" class="bg-accent-red px-2 mx-3 ml-3" />
      </div>
    </div>
  </BaseModal>
</template>
<script lang="ts">
import useStoryBox from '@/composables/useStoryBox'
import { BaseButton, BaseModal } from 'coghent-vue-3-component-library'
import { defineComponent, onMounted, ref, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import StoryBoxStep2 from '@/components/StoryBoxStep2.vue'
import StoryBoxCreate from '@/components/StoryBoxCreate.vue'
import StoryBoxCreated from '@/components/StoryBoxCreated.vue'
import { router } from '@/app'

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
  components: { BaseButton, StoryBoxStep2, StoryBoxCreate, StoryBoxCreated, BaseModal },
  setup() {
    const { t } = useI18n()
    const { getRelationEntities } = useStoryBox()
    const closeWindow = ref<string>('show')
    const MAX_STEP = 3
    const step = ref<number>(1)
    const story = reactive<StoryBuild>({
      title: null,
      language: Language.DUTCH,
      description: null,
      assets: [],
    })
    const description = ref('')

    const close = () => {
      closeWindow.value = 'hide'
      router.push('/')
    }

    const next = (_step: number) => {
      step.value = _step
      console.log(`step:`, step.value)
      console.log(`story:`, story)
    }

    const createStory = () => {
      console.log(`Story:`, story)
      close()
    }

    onMounted(async () => {
      story.assets = await getRelationEntities()
      console.log('assets', story.assets)
    })

    return { t, closeWindow, step, MAX_STEP, next, description, story, createStory, close }
  },
})
</script>
<style scoped></style>
