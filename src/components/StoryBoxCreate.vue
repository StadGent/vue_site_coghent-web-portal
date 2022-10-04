<template>
  <div class="h-fit flex flex-col customParent">
    <div class="flex flex-grow flex-col lg:flex-row">
      <div class="lg:w-2/3 w-full lg:mr-6">
        <h1 class="text-lg my-2 font-bold">
          {{
            t('storybox.assets.title') +
            `(${StoryBoxState.activeStorybox.assetTimings != undefined ? StoryBoxState.activeStorybox.assetTimings.length : 0} ${
              StoryBoxState.activeStorybox.assetTimings != undefined && StoryBoxState.activeStorybox.assetTimings.length === 10 ? ` maximum` : ``
            })`
          }}
        </h1>
        <p class="text-sm">{{ t('storybox.assets.selectedAssetsInfo') }}</p>
        <ul v-show="StoryBoxState.activeStorybox.assets != undefined" class="scroll-smooth w-full my-4 lg:my-0" :ondragenter="dragEnter">
          <li
            v-for="asset in StoryBoxState.activeStorybox.assets"
            :id="asset.id"
            :key="asset"
            class="rounded-md activeElement w-full my-2 align-middle min-h-16"
            :ondragstart="dragStart"
            :ondragend="dragEnd"
            :ondrop="dragEnd"
            :draggable="canDrag"
          >
            <div :id="asset.id">
              <div :id="asset.id" class="block md:flex rounded-md w-full bg-background-light" :class="entityIsPublic(asset) === false ? 'opacity-50' : ''">
                <div class="flex flex-row w-full py-2">
                  <p :id="asset.id" class="w-16 md:w-20 flex items-center justify-center cursor-move" @mousedown="() => (canDrag = true)" @mouseleave="dragEnd">
                    <base-icon :id="asset.id" :icon="'dragAndDrop'" class="stroke-current" />
                  </p>
                  <div :id="asset.id" class="w-28 flex justify-center items-center">
                    <img
                      v-if="asset.mediafiles"
                      :id="asset.id"
                      class="w-16 h-16 object-scale-down"
                      :src="asset.mediafiles[0] && asset.mediafiles[0].thumbnail_file_location ? asset.mediafiles[0].thumbnail_file_location : `/no-image.png`"
                    />
                  </div>
                  <div :id="asset.id" class="flex flex-col justify-center w-full px-2">
                    <h1
                      :id="asset.id"
                      class="text-sm md:text-lg font-bold"
                      :class="entityIsPublic(asset) === true ? 'hover:underline cursor-pointer' : ''"
                      @click="() => (entityIsPublic(asset) === true ? router.push(`/entity/${asset.id}`) : null)"
                    >
                      {{ asset.title[0] ? asset.title[0].value : 'asset' }}
                    </h1>
                    <p :id="asset.id" class="text-sm invisible lg:visible">{{ asset.description[0] && asset.description[0].value != '' ? asset.description[0].value.substr(0, 50) + '..' : '' }}</p>
                  </div>
                  <div :id="asset.id" class="hidden flex items-center justify-center items-row-reverse cursor-pointer">
                    <base-icon :id="asset.id" :icon="'info'" class="stroke-current" @click="() => router.push(`/entity/${asset.id}`)" />
                  </div>
                </div>
                <div class="p-4 flex items-center w-full">
                  <textarea class="p-1 h-8 w-full h-full resize-none" maxlength="150" :placeholder="t('storybox.assets.customText')" />
                </div>
                <span class="flex flex-row justify-end w-full py-2">
                  <div v-if="entityIsPublic(asset) === true && assetTimingPresent === true" :id="asset.id" class="flex items-center justify-center items-row-reverse cursor-pointer">
                    <p class="text-xs" :title="t('storybox.assets.showTimeToolTip')">{{ t('storybox.assets.showTime') }}</p>
                    <BaseDropDown
                      :number-step="5"
                      :number-max="60"
                      :active="Number(setAssetTiming(asset))"
                      :style="`p-1.5 rounded-md ml-2 mr-2 bg-text-white`"
                      @selected="(option) => updateAssetTiming(asset, option)"
                    />
                  </div>
                  <div :id="asset.id" class="w-10 md:w-28 flex items-center justify-center items-row-reverse cursor-pointer" @click="deleteAsset(asset)">
                    <base-icon :id="asset.id" :icon="'wasteBasket'" class="stroke-current" />
                  </div>
                </span>
              </div>
            </div>
            <div v-if="draggingAssetComesBelow === asset.id && draggingAssetComesBelow != startDragItem && canDrag === true" class="my-1.5 h-1 bg-background-dark w-full"></div>
          </li>
        </ul>
        <div class="h-fit object-bottom w-full grid grid-rows-2 grid-cols-1 text-center gap-7 p-4 border border-dashed border-background-dark border-4 mt-8">
          <p>{{ t('storybox.assets.addMore') }}</p>
          <strong class="cursor-pointer" @click="() => router.push('/')">{{ t('storybox.assets.search') }}</strong>
          <router-link :to="{ path: '/' }" class="h-full w-full">
            <strong v-if="false" class="cursor-pointer">{{ t('storybox.assets.collection') }}</strong>
          </router-link>
        </div>
      </div>
      <div class="lg:w-1/3 w-full my-4 lg:my-0">
        <InputLabel :label="t('storybox.story.title')" labelFor="storyDescription" :inputIsRequired="false" />
        <textarea
          :placeholder="t('storybox.story.storyPlaceholder')"
          class="w-full lg:h-5/6 h-48 bg-background-light p-4 resize-none"
          id="storyDesctiption"
          :value="StoryBoxState.activeStorybox.description"
          @change="updateDescription"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { BaseIcon, BaseDropDown } from 'coghent-vue-3-component-library'
import { Entity } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { router } from '@/app'
import { StoryBoxState } from 'coghent-vue-3-component-library'
import { useUpload } from 'coghent-vue-3-component-library'
import { entityIsPublic } from 'coghent-vue-3-component-library'
import InputLabel from './InputLabel.vue'

export default defineComponent({
  components: { BaseIcon, BaseDropDown, InputLabel },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const startDragItem = ref<string>('')
    const canDrag = ref<boolean>(false)
    const assets = ref<Array<typeof Entity>>([])
    const assetTimings = ref<Array<typeof Entity>>(StoryBoxState.value.activeStorybox.assetTimings)
    const draggingAssetComesBelow = ref<string | null>(null)
    const assetTimingPresent = ref<boolean>(false)

    const fallBackDeleteAsset = () => {
      if (assets.value === undefined || assets.value.length <= 0) {
        console.log(`Using fallback to reset the assets use in the component to the activestorybox assets`)
        assets.value = StoryBoxState.value.activeStorybox.assets
      }
    }

    const deleteAsset = async (_asset: typeof Entity) => {
      fallBackDeleteAsset()
      const index = assets.value.map((asset) => asset.id === _asset.id).indexOf(true)
      if (index !== -1) {
        StoryBoxState.value.activeStorybox.assets = deleteFromArray(assets.value, index)
        StoryBoxState.value.activeStorybox.assets = assets.value
      } else {
        StoryBoxState.value.activeStorybox.assets = assets.value
      }
    }

    const deleteFromArray = (_array: Array<any>, _index: number) => {
      let arrayToUpdate = _array
      if (_index != -1) {
        arrayToUpdate.splice(_index, 1)
      }
      return arrayToUpdate
    }

    const updateDescription = (event: any) => {
      StoryBoxState.value.activeStorybox.description = event.target.value
    }

    const dragStart = (event: any) => {
      startDragItem.value = event.srcElement.id
      document.getElementById(event.srcElement.id)?.parentElement?.classList.add(`test`)
      document.getElementById(event.srcElement.id)?.firstElementChild?.classList.replace('bg-background-light', 'bg-background-dark')
      document.getElementById(event.srcElement.id)?.firstElementChild?.classList.add('test')
    }
    const dragEnd = (event: any) => {
      canDrag.value = false
      startDragItem.value = event.srcElement.id
      document.getElementById(event.srcElement.id)?.parentElement?.classList.remove(`test`)
      document.getElementById(event.srcElement.id)?.firstElementChild?.classList.replace('bg-background-dark', 'bg-background-light')
      document.getElementById(event.srcElement.id)?.parentElement?.classList.remove(`test`)
      StoryBoxState.value.activeStorybox.assets = assets.value
    }

    const dragEnter = (event: any) => {
      event.preventDefault()
      swap(StoryBoxState.value.activeStorybox.assets, startDragItem.value, event.srcElement.id)
    }

    const swap = async (_assets: Array<typeof Entity>, itemOne: string, itemTwo: string) => {
      const assetIndexOne = _assets.indexOf(_assets[_assets.map((asset) => asset.id === itemOne).indexOf(true)])
      const assetOne = _assets[_assets.map((asset) => asset.id === itemOne).indexOf(true)]
      const assetIndexTwo = _assets.indexOf(_assets[_assets.map((asset) => asset.id === itemTwo).indexOf(true)])
      const assetTwo = _assets[_assets.map((asset) => asset.id === itemTwo).indexOf(true)]
      assetIndexTwo != -1 ? (draggingAssetComesBelow.value = assetTwo.id) : (draggingAssetComesBelow.value = null)
      if (canDrag.value === true && assetOne && assetTwo && assetIndexOne != assetIndexTwo) {
        let updatedAssets: Array<typeof Entity> = []
        Object.assign(updatedAssets, _assets)
        updatedAssets = deleteItemFromArray(assetOne, updatedAssets)
        updatedAssets = placeItemOnIndexMoveOthers(assetTwo, assetOne, updatedAssets)
        assets.value = updatedAssets
      }
    }

    const deleteItemFromArray = (_item: typeof Entity, _items: Array<typeof Entity>) => {
      let updatedItems: Array<typeof Entity> = []
      Object.assign(updatedItems, _items)
      const index = updatedItems.map((asset) => asset.id === _item.id).indexOf(true)
      index !== -1 ? updatedItems.splice(index, 1) : null
      return updatedItems
    }

    const placeItemOnIndexMoveOthers = (_itemTwo: typeof Entity, _item: typeof Entity, _items: Array<typeof Entity>) => {
      const index = _items.map((asset) => asset.id === _itemTwo.id).indexOf(true)
      let updatedItems: Array<typeof Entity> = []
      if (index != -1) {
        const itemsbefore = _items.slice(0, index + 1)
        updatedItems.push(...itemsbefore)
        updatedItems.push(_item)
        const itemsafter = _items.slice(index + 1, _items.length)
        updatedItems.push(...itemsafter)
      }
      return updatedItems
    }

    const setAssetTiming = (_asset: typeof Entity) => {
      let returnValue = null
      for (const _pair of StoryBoxState.value.activeStorybox.assetTimings) {
        if (_pair.key === _asset.id) returnValue = _pair.value
      }
      return returnValue
    }

    const updateAssetTiming = (_asset: typeof Entity, _timing: number) => {
      for (const _pair of StoryBoxState.value.activeStorybox.assetTimings) {
        if (_pair.key === _asset.id) {
          _pair.value = Number(_timing).toFixed()
        }
      }
    }

    watch(
      () => StoryBoxState.value.activeStorybox.assetTimings,
      (timings) => {
        console.log({ timings })
        StoryBoxState.value.activeStorybox.assetTimings !== undefined ? (assetTimingPresent.value = true) : null
      }
    )

    watch(
      () => props.loading,
      (isLoading) => {
        if (isLoading === false) {
          assets.value = StoryBoxState.value.activeStorybox.assets
        }
      }
    )

    return {
      t,
      updateDescription,
      deleteAsset,
      router,
      dragStart,
      dragEnd,
      dragEnter,
      canDrag,
      setAssetTiming,
      updateAssetTiming,
      StoryBoxState,
      assets,
      assetTimings,
      draggingAssetComesBelow,
      entityIsPublic,
      assetTimingPresent,
    }
  },
})
</script>
<style scoped>
.customParent {
  min-height: 85%;
}

.test {
  opacity: 0.9;
}

.expanding {
  animation-name: expand;
  animation-duration: 5s;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
}

@keyframes expand {
  0% {
    height: 0%;
  }
  100% {
    height: 100%;
  }
}
</style>
