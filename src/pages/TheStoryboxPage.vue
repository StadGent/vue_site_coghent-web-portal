<template>
  <BaseModal :modal-state="closeWindow" :large="true" class="py-16 z-40" :scroll="true" @hide-modal="close">
    <div class="h-full p-8 flex flex-col">
      <div class="customParent">
        <h1 class="w-full flex justify-center text-4xl mb-4 font-bold">{{ t('storybox.title') }}</h1>
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
        <story-box-create :story="story" @story="(_story) => (story = _story)" />
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
import { BaseButton, BaseModal, StoryboxBuild, KeyValuePair } from 'coghent-vue-3-component-library'
import { defineComponent, onMounted, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { router } from '@/app'
import StoryBoxCreate from '@/components/StoryBoxCreate.vue'
import { Entity } from 'coghent-vue-3-component-library'
import { useQuery } from '@vue/apollo-composable'
import { CreateStoryboxDocument } from 'coghent-vue-3-component-library'
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
    const story = reactive<typeof StoryboxBuild>({
      title: null,
      language: Language.DUTCH,
      description: null,
      assets: [],
      assetTimings: [],
      frameId: null,
    })
    const { fetchMore: createStory } = useQuery(CreateStoryboxDocument, { storyboxInfo: story })
    const frames = ref<Array<typeof Entity>>([
      // { id: 'firstID', title: [{ value: 'frametitle' }] },
      // { id: 'secondID', title: [{ value: 'frametitle' }] },
    ])
    const description = ref('')
    document.body.classList.add('overflow-y-hidden')

    const close = () => {
      closeWindow.value = 'hide'
      document.body.classList.remove('overflow-y-hidden')
      router.push('/')
    }

    const save = async () => {
      console.log(`useStoryBox.saveFrame()`, story)
      const createdStoryBox = await createStory({
        variables: {
          storyboxInfo: {
            frameId: null,
            title: story.title,
            language: story.language,
            description: story.description,
            assets: story.assets.map((asset: any) => asset.id),
            assetTimings: story.assetTimings,
          } as typeof StoryboxBuild,
        },
      })
      console.log({ createdStoryBox })
      close()
    }

    const updateSelectedFrame = (_frame: typeof Entity) => {
      story.frameId = _frame.id
    }

    onMounted(async () => {
      story.assets = await getRelationEntities()
      story.assets.map((_asset: typeof Entity) => story.assetTimings.push({ key: _asset.id, value: '1' } as typeof KeyValuePair))
      frames.value && frames.value.length > 0 ? (story.frameId = frames.value[0].id) : null
    })

    return { t, closeWindow, save, description, story, close, frames, updateSelectedFrame }
  },
})
</script>
<style scoped>
.customParent {
  min-height: 90%;
}
</style>
