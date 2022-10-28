<template>
  <QRCodeModal />
  <confirmation-modal
    :modalText="t('storybox.deleteConfirmation.confirmationText')"
    :confirmButtonText="t('storybox.deleteConfirmation.yes')"
    :declineButtonText="t('storybox.deleteConfirmation.no')"
  />
  <div class="w-full flex justify-end">
    <div class="pb-4 flex justify-end mt-4">
      <router-link to="/mijnverhalen/new">
        <base-button class="hidden md:flex text-text-white" :icon-shown="true" custom-icon="newItem" :text="t('storybox.createNew')"></base-button>
      </router-link>
    </div>
  </div>
  <section class="md:flex md:mt-4 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0">
      <div class="w-full flex justify-end mb-8 sm:mb-0">
        <div class="md:hidden fixed bottom-16 right-10 bg-accent-purple rounded-full p-4 flex justify-center items-center shadow-lg">
          <router-link to="/mijnverhalen/new">
            <BaseIcon icon="newItem" class="stroke-current p-1 cursor-pointer text-text-white" />
          </router-link>
        </div>
      </div>
      <div v-if="loading && storyBoxItems.length === 0" class="h-fit p-8 flex flex-col w-full justify-center items-center overflow-hidden">
        <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div>
      </div>
      <div v-if="!loading && storyBoxItems.length === 0" class="flex items-center flex-col w-full h-full">
        <h1 v-if="true" class="h-fit mt-12 text-xl">{{ t(`storybox.noStories`) }}</h1>
      </div>
      <div v-if="storyBoxItems.length > 0 && !loading">
        <div v-if="pager.pageAmount.value > 1" class="w-full flex justify-end items-center">
          <BaseIcon icon="arrowLeftLine" class="stroke-current p-2 cursor-pointer" @click="pager.goToPreviousPage(getStoryBoxes)" />
          <p>{{ `${pager.currentPage.value} of ${pager.pageAmount.value}` }}</p>
          <BaseIcon icon="arrowRightLine" class="stroke-current p-2 cursor-pointer" @click="pager.goToNextPage(getStoryBoxes)" />
        </div>
        <profile-list-item v-for="(storyBoxItem, index) in storyBoxItems" :key="index" :profile-list-item-info="storyBoxItem" @update="getStoryBoxes" />
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import ProfileListItem, { ProfileListItemInfo, ProfileListItemType } from '@/components/ProfileListItem.vue'
import { defineComponent, ref, watch } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'
import { BaseButton, useStorybox, BaseIcon } from 'coghent-vue-3-component-library'
import { apolloClient, router } from '@/app'
import { useI18n } from 'vue-i18n'
import { StoryBoxState, CircleLoader } from 'coghent-vue-3-component-library'
import { Entity, getMetadataOfTypeFromEntity } from 'coghent-vue-3-component-library'
import { storyboxDataIsUpdated } from 'coghent-vue-3-component-library'
import { storyboxCount } from '@/app'
import QRCodeModal from '../components/QRCodeModal.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import { Pager } from '@/composables/pager'

export default defineComponent({
  name: 'TheStoriesPage',
  components: { ProfileSideMenu, ProfileListItem, BaseButton, CircleLoader, QRCodeModal, BaseIcon, ConfirmationModal },
  setup() {
    const { t } = useI18n()
    const storyBoxItems = ref<ProfileListItemInfo[]>([])
    const loading = ref<Boolean>(false)
    const pager = new Pager(6)

    watch(storyboxDataIsUpdated, async (status: boolean) => {
      if (status === true) {
        await getStoryBoxes(true)
        storyboxDataIsUpdated.value = false
      }
    })

    const getStoryBoxes = async (_skipGetNew = false) => {
      const storyBoxItemsToDisplay = []
      storyBoxItems.value = []
      loading.value = true
      if (!_skipGetNew) {
        await useStorybox(apolloClient).getStoryboxes(pager.limit, pager.skip)
        pager.updateCount(StoryBoxState.value.count)
        storyboxCount.value = StoryBoxState.value.count
      }
      storyboxCount.value = StoryBoxState.value.count
      for (const _box of StoryBoxState.value.storyboxes) {
        const title = getMetadataOfTypeFromEntity(_box, `title`)
        const description = getMetadataOfTypeFromEntity(_box, `description`)
        storyBoxItemsToDisplay.push({
          id: _box.id,
          title: title ? title.value : _box.id,
          description: description ? description.value : '',
          code: undefined,
          onClickUrl: `/mijnverhalen/${_box.id}`,
          type: ProfileListItemType.story,
        } as ProfileListItemInfo)
      }
      storyBoxItems.value = storyBoxItemsToDisplay
      loading.value = false
    }

    getStoryBoxes()

    return {
      storyBoxItems,
      loading,
      t,
      router,
      getStoryBoxes,
      pager,
    }
  },
})
</script>
