<template>
  <div>
    <div class="w-full flex flex-cols-2">
      <div class="w-2/3 mr-6">
        <h1 class="text-lg my-2 font-bold">{{ t('storybox.assets.title') }}</h1>
        <div>
          <p class="text-sm">{{ t('storybox.assets.selectedAssetsInfo') }}</p>
          <ul v-if="assets.length > 0" class="overflow-y-auto">
            <li v-for="asset in assets" :key="asset" class="w-full my-2 align-middle">
              <div class="w-full bg-background-medium flex flex-cols py-2">
                <p class="w-20 flex items-center justify-center cursor-grab focus:cursor-grabbing">
                  <base-icon :icon="'dragAndDrop'" class="stroke-current" />
                </p>
                <div class="w-20 flex justify-center items-center">
                  <img class="w-16 h-16 object-scale-down" :src="asset.mediafiles[0].thumbnail_file_location" />
                </div>
                <!-- <p class="w-16 flex items-center justify-center">Thumb</p> -->
                <div class="flex flex-col w-full px-2">
                  <h1 class="text-lg font-bold">{{ asset.title[0] ? asset.title[0].value : 'asset' }}</h1>
                  <p class="text-sm">{{ asset.description[0] && asset.description[0].value != '' ? asset.description[0].value.substr(0, 50) + '..' : '' }}</p>
                </div>
                <div class="w-20 flex items-center justify-center items-row-reverse cursor-pointer">
                  <base-icon :icon="'info'" @click="() => router.push(`/entity/${asset.id}`)" class="stroke-current" />
                </div>
                <div class="w-20 flex items-center justify-center items-row-reverse cursor-pointer" @click="deleteAsset(asset)">
                  <base-icon :icon="'wasteBasket'" class="stroke-current" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="w-1/3">
        <h1 class="text-lg my-2 font-bold">{{ t('storybox.story.title') }}</h1>
        <textarea :placeholder="t('storybox.story.storyPlaceholder')" class="w-full bg-background-light p-4" @change="updateDescription" :value="description"></textarea>
      </div>
    </div>
    <div class="w-full flex flex-cols-2">
      <div class="w-2/3 mr-6 grid grid-rows-2 grid-cols-1 text-center gap-7 p-4 border border-dashed border-background-dark border-4 my-8">
        <p>{{ t('storybox.assets.addMore') }}</p>
        <strong class="cursor-pointer">{{ t('storybox.assets.search') }}</strong>
        <strong v-if="false" class="cursor-pointer">{{ t('storybox.assets.collection') }}</strong>
      </div>
      <div class="w-1/3"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { BaseIcon } from 'coghent-vue-3-component-library'
import { Entity } from 'coghent-vue-3-component-library'
import { StoryBuild } from '@/pages/TheStoryboxPage.vue'
import { useI18n } from 'vue-i18n'
import { useBoxVisiter } from 'coghent-vue-3-component-library'
import { apolloClient, router } from '@/app'
import useStoryBox from '@/composables/useStoryBox'
export default defineComponent({
  components: { BaseIcon },
  props: {
    assets: {
      type: Object as PropType<Array<typeof Entity>>,
      required: true,
    },
    description: {
      type: Object as PropType<StoryBuild>,
      required: true,
    },
  },
  emits: ['description', 'assets'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const { getRelationEntities } = useStoryBox()

    const updateAssets = (_assets: Array<typeof Entity>) => {
      emit(`assets`, _assets)
    }

    const deleteAsset = async (_asset: typeof Entity) => {
      await useBoxVisiter(apolloClient).deleteRelationFromBoxVisiter('31099546', _asset.id)
      const updatedAssets = await getRelationEntities()
      emit(`assets`, updatedAssets)
    }

    const updateDescription = (event: any) => {
      const description = event.target.value
      emit(`description`, description)
    }

    return { t, updateAssets, updateDescription, deleteAsset, router }
  },
})
</script>