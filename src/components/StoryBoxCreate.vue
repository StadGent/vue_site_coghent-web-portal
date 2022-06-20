<template>
  <div class="h-fit flex flex-col customParent">
    <div class="flex flex-grow flex-col lg:flex-row">
      <div class="lg:w-2/3 w-full lg:mr-6">
        <h1 class="text-lg my-2 font-bold">
          {{ t('storybox.assets.title') + `(${StoryBoxState.activeStorybox.assetTimings != undefined ? StoryBoxState.activeStorybox.assetTimings.length : 0})` }}
        </h1>
        <p class="text-sm">{{ t('storybox.assets.selectedAssetsInfo') }}</p>
        <ul v-show="StoryBoxState.activeStorybox.assets != undefined" class="scroll-smooth w-full my-4 lg:my-0" :ondragenter="dragEnter">
          <li
            v-for="asset in StoryBoxState.activeStorybox.assets"
            :id="asset.id"
            :key="asset"
            class="rounded-md activeElement w-full my-2 align-middle min-h-16 bg-background-light"
            :ondragstart="dragStart"
            :ondragend="dragEnd"
            :ondrop="dragEnd"
            :draggable="canDrag"
          >
            <div :id="asset.id">
              <div :id="asset.id" class="rounded-md w-full bg-background-light flex flex-cols py-2">
                <p :id="asset.id" class="w-28 lg:w-20 flex items-center justify-center cursor-move" @mousedown="() => (canDrag = true)" @mouseleave="dragEnd">
                  <base-icon :id="asset.id" :icon="'dragAndDrop'" class="stroke-current" />
                </p>
                <div :id="asset.id" class="w-28 flex justify-center items-center">
                  <img :id="asset.id" class="w-16 h-16 object-scale-down" v-if="asset.mediafiles" :src="asset.mediafiles[0].thumbnail_file_location" />
                </div>
                <div :id="asset.id" class="flex flex-col justify-center w-full px-2">
                  <h1 :id="asset.id" class="text-lg font-bold hover:underline cursor-pointer" @click="() => router.push(`/entity/${asset.id}`)">
                    {{ asset.title[0] ? asset.title[0].value : 'asset' }}
                  </h1>
                  <p :id="asset.id" class="text-sm invisible lg:visible">{{ asset.description[0] && asset.description[0].value != '' ? asset.description[0].value.substr(0, 50) + '..' : '' }}</p>
                </div>
                <div :id="asset.id" class="invisible w-20 flex items-center justify-center items-row-reverse cursor-pointer">
                  <base-icon :id="asset.id" :icon="'info'" class="stroke-current" @click="() => router.push(`/entity/${asset.id}`)" />
                </div>
                <div :id="asset.id" class="w-28 flex items-center justify-center items-row-reverse cursor-pointer" @click="showTimingEdit(asset.id)">
                  <base-icon :id="asset.id" :icon="'edit'" class="stroke-current" />
                </div>
                <div :id="asset.id" class="w-28 flex items-center justify-center items-row-reverse cursor-pointer" @click="deleteAsset(asset)">
                  <base-icon :id="asset.id" :icon="'wasteBasket'" class="stroke-current" />
                </div>
              </div>
              <div :id="'expand' + asset.id" v-if="showTimeEdit === true && activeEditItem === asset.id" class="flex flex-row px-4 gap-4 p-2 pt-6">
                <label class="flex flex-row text-bold items-center" for="duration">
                  Deze afbeelding wordt getoond voor
                  <input
                    :value="setAssetTiming(asset)"
                    @change="(event) => updateAssetTiming(asset, event.target.value)"
                    name="duration"
                    type="number"
                    min="1"
                    max="20"
                    class="p-1.5 rounded-md ml-2 w-16 mr-2"
                  />
                  seconden.
                </label>
              </div>
            </div>
          </li>
        </ul>
        <div class="h-fit object-bottom w-full grid grid-rows-2 grid-cols-1 text-center gap-7 p-4 border border-dashed border-background-dark border-4 mt-8">
          <p>{{ t('storybox.assets.addMore') }}</p>
          <strong @click="() => router.push('/')" class="cursor-pointer">{{ t('storybox.assets.search') }}</strong>
          <strong v-if="false" class="cursor-pointer">{{ t('storybox.assets.collection') }}</strong>
        </div>
      </div>
      <div class="lg:w-1/3 w-full my-4 lg:my-0">
        <h1 class="text-lg my-2 font-bold">{{ t('storybox.story.title') }}</h1>
        <textarea
          :placeholder="t('storybox.story.storyPlaceholder')"
          class="w-full lg:h-5/6 h-48 bg-background-light p-4"
          :value="StoryBoxState.activeStorybox.description"
          @change="updateDescription"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { BaseIcon } from 'coghent-vue-3-component-library'
import { Entity } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { router } from '@/app'
import { KeyValuePair } from 'coghent-vue-3-component-library'
import { StoryBoxState } from 'coghent-vue-3-component-library'

export default defineComponent({
  components: { BaseIcon },
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
    const showTimeEdit = ref<boolean>(false)
    const activeEditItem = ref<string | null>(null)
    const assets = ref<Array<typeof Entity>>(StoryBoxState.value.activeStorybox.assets)
    const assetTimings = ref<Array<typeof Entity>>(StoryBoxState.value.activeStorybox.assetTimings)

    const deleteAsset = async (_asset: typeof Entity) => {
      const index = assets.value.indexOf(_asset)
      assets.value = deleteFromArray(assets.value, index)
      StoryBoxState.value.activeStorybox.assets = assets.value
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
    const click = (event: any) => {
      console.log(event)
    }
    const swap = async (_assets: Array<typeof Entity>, itemOne: string, itemTwo: string) => {
      const assetIndexOne = _assets.indexOf(_assets[_assets.map((asset) => asset.id === itemOne).indexOf(true)])
      const assetOne = _assets[_assets.map((asset) => asset.id === itemOne).indexOf(true)]
      const assetIndexTwo = _assets.indexOf(_assets[_assets.map((asset) => asset.id === itemTwo).indexOf(true)])
      const assetTwo = _assets[_assets.map((asset) => asset.id === itemTwo).indexOf(true)]
      if (canDrag.value === true && assetOne && assetTwo && assetIndexOne != assetIndexTwo) {
        let updatedAssets: Array<typeof Entity> = []
        Object.assign(updatedAssets, _assets)
        updatedAssets[assetIndexOne] = assetTwo
        updatedAssets[assetIndexTwo] = assetOne
        assets.value = updatedAssets
      }
    }

    const showTimingEdit = (_assetId: string) => {
      showTimeEdit.value = !showTimeEdit.value
      activeEditItem.value = null
      activeEditItem.value = _assetId
      const doc = document.getElementById(`expand${_assetId}`)
      doc?.classList.add(`expanding`)
    }

    const setAssetTiming = (_asset: typeof Entity) => {
      let returnValue = null
      StoryBoxState.value.activeStorybox.assetTimings.map((_pair: typeof KeyValuePair) => {
        if (_pair.key === _asset.id) returnValue = _pair.value
      })
      return returnValue
    }

    const updateAssetTiming = (_asset: typeof Entity, _timing: number) => {
      for (const _pair of StoryBoxState.value.activeStorybox.assetTimings) {
        if (_pair.key === _asset.id) {
          _pair.value = Number(_timing).toFixed()
        }
      }
    }

    return {
      t,
      updateDescription,
      deleteAsset,
      router,
      dragStart,
      dragEnd,
      dragEnter,
      canDrag,
      click,
      showTimeEdit,
      showTimingEdit,
      activeEditItem,
      setAssetTiming,
      updateAssetTiming,
      StoryBoxState,
      assets,
      assetTimings,
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
