<template>
  <BaseModal :modal-state="closeWindow" :large="true" class="py-16 z-40" :scroll="true" @hide-modal="close">
    <div class="h-full p-8 flex flex-col">
      <div class="customParent">
        <h1 class="w-full flex justify-center text-4xl mb-4 font-bold">{{ t('storybox.title') }}</h1>
        <!-- <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div> -->
        <div class="flex flex-col lg:flex-row">
          <div class="mb-4 lg:w-2/3 w-full lg:mr-6">
            <p v-if="frames && frames.length > 0" class="text-lg my-2 font-bold">{{ t('storybox.selectFrame') }}</p>
            <select v-if="frames && frames.length > 0" name="frames" class="bg-background-light h-10 w-full p-2 lg:pr-6">
              <option v-for="frame in frames" :key="frame.id" @click="updateSelectedFrame(frame)" :value="frame.id">{{ frame.id }}</option>
            </select>
          </div>
          <div class="mb-4 lg:my-0 w-full lg:w-1/3">
            <p class="text-lg my-2 font-bold">{{ t('storybox.step2.storyTitle') }}</p>
            <input class="bg-background-light h-10 w-full p-2" type="text" @change="(event) => (story.title = event.target.value)" :value="story.title" />
          </div>
        </div>
        <story-box-create :loading="loading" :story="story" @story="(_story) => (story = _story)" />
        <div class="object-bottom w-full h-fit pb-8 flex flex-row place-content-end mt-4">
          <base-button :text="t('storybox.story.close')" :on-click="() => close()" custom-style="secondary" :icon-shown="false" custom-icon="storybox" class="px-2 mx-3 ml-3" />
          <base-button :text="t('storybox.story.save')" :on-click="() => save()" :icon-shown="false" custom-icon="storybox" class="bg-accent-red px-2 mx-3 ml-3" />
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script lang="ts">
import useStoryBox from '@/composables/useStoryBox'
import { BaseButton, BaseModal, StoryboxBuild, CircleLoader } from 'coghent-vue-3-component-library'
import { defineComponent, onMounted, ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apolloClient, router } from '@/app'
import StoryBoxCreate from '@/components/StoryBoxCreate.vue'
import { Entity } from 'coghent-vue-3-component-library'
import { useStorybox, StoryBoxState } from 'coghent-vue-3-component-library'
export enum Language {
  'DUTCH' = 'Nederlands',
  'English' = 'Engels',
  'FRENCH' = 'Français',
  'GERMAN' = 'Deutsch',
  'SPANISH' = 'Español',
}

export const storyboxCount = ref<number>(0)

export default defineComponent({
  components: { BaseButton, BaseModal, StoryBoxCreate },
  setup() {
    const { t } = useI18n()
    const { getRelationEntities } = useStoryBox()
    const closeWindow = ref<string>('show')
    const loading = ref<boolean>(true)
    let story = ref<typeof StoryboxBuild>({
      title: null,
      language: Language.DUTCH,
      description: null,
      assets: [],
      assetTimings: [],
      frameId: null,
    })
    const frames = ref<Array<typeof Entity>>([
      // { id: 'First storybox', title: [{ value: 'frametitle' }] },
      // { id: 'Second storybox', title: [{ value: 'frametitle' }] },
    ])

    onMounted(async () => {
      await useStorybox(apolloClient).getStoryboxes()
      console.log({ StoryBoxState })
      frames.value = StoryBoxState.value.storyboxes
      storyboxCount.value = StoryBoxState.value.count
      frames.value[0] ? await setCorrectStorybox(frames.value[0].id) : null
    })

    document.body.classList.add('overflow-y-hidden')

    const close = () => {
      closeWindow.value = 'hide'
      document.body.classList.remove('overflow-y-hidden')
      router.push('/')
    }

    const save = async () => {
      console.log(`useStoryBox.saveFrame()`, story.value)
      await useStorybox(apolloClient).createNew({
        frameId: story.value.frameId,
        title: story.value.title,
        language: story.value.language,
        description: story.value.description,
        assets: story.value.assets.map((asset: any) => asset.id),
        assetTimings: story.value.assetTimings,
      } as typeof StoryboxBuild)
      close()
    }

    watch(StoryBoxState.value, (storybox) => {
      story.value.assets = storybox.activeStoryboxAssets
    })

    const setCorrectStorybox = async (_frameId: string) => {
      await useStorybox(apolloClient).getStoryboxes()
      StoryBoxState.value.activeStoryboxAssets = []
      frames.value = StoryBoxState.value.storyboxes
      storyboxCount.value = StoryBoxState.value.count
      const frame = frames.value[frames.value.map((_frame) => _frame.id === _frameId).indexOf(true)]
      const createdStorybox = useStorybox(apolloClient).createStoryboxFromEntity(frame)
      let property: keyof typeof story
      for (property in story) {
        if (!(property in createdStorybox)) {
          createdStorybox[property] = story[property]
        }
      }
      story.value = createdStorybox
      console.log(`Set storybox = `, story.value)
      if (createdStorybox.assets.length >= 0) {
        loading.value = true
        const res = await useStorybox(apolloClient).getAssets(createdStorybox.assets.map((rel: any) => rel))
        loading.value = false
        story.value.assets = res
      } else story.value.assets = []
    }

    const updateSelectedFrame = async (_frame: typeof Entity) => {
      story.value.frameId = _frame.id
      await setCorrectStorybox(story.value.frameId)
    }

    return { t, closeWindow, save, story, close, frames, updateSelectedFrame, loading }
  },
})
</script>
<style scoped>
.customParent {
  min-height: 90%;
}
</style>
