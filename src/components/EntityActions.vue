<template>
  <section id="footer" class="flex items-stretch z-50 bg-background-light justify-evenly p-2 lg:p-10 shadow-2xl sticky bottom-0 w-full lg:pb-6">
    <div class="mx-3 align-center">
      <base-button class="w-12 h-12 stroke-current text-text-black inline-block lg:hidden" :on-click="() => copyUrl(entity.id)" custom-style="secondary-round" custom-icon="link" :icon-shown="true" />
      <base-button class="w-max hidden lg:flex" :text="t('details.modal.link')" :on-click="() => copyUrl(entity.id)" custom-style="ghost-black" custom-icon="link" :icon-shown="true" />
      <div v-if="userStore.hasUser" class="hidden border-r-2 h-6 border-text-dark border-opacity-70 mx-6 hidden" />
      <base-button class="hidden w-12 h-12 stroke-current text-text-black inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="edit" :icon-shown="true" />
      <base-button class="hidden w-max hidden" :text="t('details.modal.edit')" :on-click="onClick" custom-style="ghost-black" custom-icon="edit" :icon-shown="true" />
    </div>
    <div v-if="canAddToStoryBox === true" class="border-r-2 h-auto border-background-dark border-opacity-70 mr-2" />
    <div v-if="canAddToStoryBox === true" class="mx-3 align-center">
      <AddAssetToStoryboxDropdown :trigger="storyboxDdOpen" :entity="entity" @click="() => (storyboxDdOpen = !storyboxDdOpen)" @addToStorybox="(ids) => addAssetToStorybox(ids)">
        <base-button :text="t('buttons.addToStorybox')" custom-style="ghost-purple" :icon-shown="true" :custom-icon="assetIsInAStorybox ? `check` : `storybox`" class="px-2 hidden lg:flex" />
        <base-button
          custom-style="secondary-round"
          :icon-shown="true"
          :custom-icon="assetIsInAStorybox ? `check` : `storybox`"
          class="w-12 h-12 stroke-current text-accent-purple inline-block lg:hidden"
        />
      </AddAssetToStoryboxDropdown>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import { Entity, BaseButton } from 'coghent-vue-3-component-library'
import { StoryBoxState, useStorybox, getMediaTypeByfilename } from 'coghent-vue-3-component-library'
import { apolloClient } from '@/app'
import useClipboard from 'vue-clipboard3'
import { UserStore } from '@/stores/UserStore'
import StoreFactory from '@/stores/StoreFactory'
import { useStoryboxFeature } from '@/stores/ConfigStore'
import AddAssetToStoryboxDropdown from './AddAssetToStoryboxDropdown.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    BaseButton,
    AddAssetToStoryboxDropdown,
  },
  props: {
    entity: {
      type: Object as PropType<typeof Entity>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const assetIsInAStorybox = ref<boolean>(false)
    const storyboxDdOpen = ref<boolean>(false)
    const canAddToStoryBox = ref<boolean>(false)
    const { toClipboard } = useClipboard()
    const userStore = StoreFactory.get(UserStore)

    const checkAssetIsInAStorybox = async () => {
      new Promise((resolve, reject) => {
        for (const box of StoryBoxState.value.storyboxes) {
          const found = useStorybox(apolloClient).assetIsInStorybox(props.entity, box.id)
          found && found.key ? resolve(true) : null
        }
        resolve(false)
      }).then((val) => {
        assetIsInAStorybox.value = val as boolean
      })
    }

    const addAssetToStorybox = async (_storyBoxIds: Array<string>) => {
      for (const _box of StoryBoxState.value.storyboxes) {
        if (_storyBoxIds.includes(_box.id)) {
          await useStorybox(apolloClient).assetToStorybox(_box.id, props.entity.id)
        }
      }
      await useStorybox(apolloClient).getStoryboxes()
      checkAssetIsInAStorybox()
    }

    watch(
      () => props.entity,
      async () => {
        canAddToStoryBox.value = await checkForValidStoryboxAsset(props.entity, props.entity.primary_mediafile)
        checkAssetIsInAStorybox()
      }
    )

    const checkForValidStoryboxAsset = async (_entity: typeof Entity, _filename: string | undefined): Promise<boolean> => {
      const checks: Array<boolean> = []
      useStoryboxFeature.value === true && userStore.hasUser && props.entity ? checks.push(true) : checks.push(false)
      if (!checks.includes(false)) {
        const mediaTypeForPrimaryFile = await getMediaTypeByfilename(props.entity, props.entity.primary_mediafile)
        mediaTypeForPrimaryFile !== null && mediaTypeForPrimaryFile.image && mediaTypeForPrimaryFile.image === true ? checks.push(true) : checks.push(false)
      }
      return !checks.some((_check) => _check === false)
    }

    const copyUrl = async (id: String) => {
      try {
        var url = window.location.href
        await toClipboard(url)
      } catch (e) {
        console.error(e)
      }
    }

    return {
      assetIsInAStorybox,
      storyboxDdOpen,
      canAddToStoryBox,
      addAssetToStorybox,
      copyUrl,
      userStore,
      t,
    }
  },
})
</script>

