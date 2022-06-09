<template>
  <div class="h-fit flex flex-col">
    <div class="w-full flex flex-cols-2 flex-grow">
      <div class="w-2/3 mr-6">
        <h1 class="text-lg my-2 font-bold">{{ t('storybox.assets.title') + `(${assets != undefined ? assets.length : 0})` }}</h1>
        <div>
          <p class="text-sm">{{ t('storybox.assets.selectedAssetsInfo') }}</p>
          <ul v-show="assets != undefined" class="scroll-smooth" :ondragenter="dragEnter">
            <li v-for="asset in assets" :id="asset.id" :key="asset" class="w-full my-2 align-middle" :ondragstart="dragStart" :ondrop="drop" :draggable="canDrag">
              <div :id="asset.id" class="w-full bg-background-medium flex flex-cols py-2">
                <p :id="asset.id" class="w-20 flex items-center justify-center cursor-move" @mousedown="() => (canDrag = true)" @mouseleave="activateDrag(false)">
                  <base-icon :id="asset.id" :icon="'dragAndDrop'" class="stroke-current" />
                </p>
                <div :id="asset.id" class="w-20 flex justify-center items-center">
                  <!-- <img :id="asset.id" class="w-16 h-16 object-scale-down" :src="asset.mediafiles[0].thumbnail_file_location" /> -->
                </div>
                <div :id="asset.id" class="flex flex-col w-full px-2">
                  <h1 :id="asset.id" class="text-lg font-bold hover:underline cursor-pointer" @click="() => router.push(`/entity/${asset.id}`)">
                    {{ asset.title[0] ? asset.title[0].value : 'asset' }}
                  </h1>
                  <p :id="asset.id" class="text-sm">{{ asset.description[0] && asset.description[0].value != '' ? asset.description[0].value.substr(0, 50) + '..' : '' }}</p>
                </div>
                <div :id="asset.id" class="w-20 flex items-center justify-center items-row-reverse cursor-pointer">
                  <base-icon :id="asset.id" :icon="'info'" class="stroke-current" @click="() => router.push(`/entity/${asset.id}`)" />
                </div>
                <div :id="asset.id" class="w-20 flex items-center justify-center items-row-reverse cursor-pointer" @click="deleteAsset(asset)">
                  <base-icon :id="asset.id" :icon="'wasteBasket'" class="stroke-current" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="w-1/3">
        <h1 class="text-lg my-2 font-bold">{{ t('storybox.story.title') }}</h1>
        <textarea :placeholder="t('storybox.story.storyPlaceholder')" class="w-full h-5/6 bg-background-light p-4" :value="description" @change="updateDescription"></textarea>
      </div>
    </div>
    <div class="w-full flex flex-cols-2 h-fit object-bottom">
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
import { defineComponent, PropType, ref, watch } from 'vue'
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
    const startDragItem = ref<string>('')
    const canDrag = ref<boolean>(false)

    const deleteAsset = async (_asset: typeof Entity) => {
      await useBoxVisiter(apolloClient).deleteRelationFromBoxVisiter('31099546', _asset.id)
      const updatedAssets = await getRelationEntities()
      emit(`assets`, updatedAssets)
    }

    const updateDescription = (event: any) => {
      const description = event.target.value
      emit(`description`, description)
    }

    watch(canDrag, () => console.log(`candrag`, canDrag.value))

    const dragStart = (event: any) => {
      startDragItem.value = event.srcElement.id
    }

    const dragEnter = (event: any) => {
      event.preventDefault()
      swap(props.assets, startDragItem.value, event.srcElement.id)
    }
    const swap = (_assets: Array<typeof Entity>, itemOne: string, itemTwo: string) => {
      const assetIndexOne = _assets.indexOf(_assets[_assets.map((asset) => asset.id === itemOne).indexOf(true)])
      const assetOne = _assets[_assets.map((asset) => asset.id === itemOne).indexOf(true)]
      const assetIndexTwo = _assets.indexOf(_assets[_assets.map((asset) => asset.id === itemTwo).indexOf(true)])
      const assetTwo = _assets[_assets.map((asset) => asset.id === itemTwo).indexOf(true)]
      if (canDrag.value === true && assetOne && assetTwo && assetIndexOne != assetIndexTwo) {
        let updatedAssets: Array<typeof Entity> = []
        Object.assign(updatedAssets, _assets)
        updatedAssets[assetIndexOne] = assetTwo
        updatedAssets[assetIndexTwo] = assetOne
        emit(`assets`, updatedAssets)
      }
    }

    return { t, updateDescription, deleteAsset, router, dragStart, dragEnter, canDrag }
  },
})
</script>
<style scoped>
.customParent {
  min-height: 90%;
}
</style>
