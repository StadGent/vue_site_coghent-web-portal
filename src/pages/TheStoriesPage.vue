<template>
  <QRCodeModal />
  <div class="w-full flex justify-end">
    <VDropdown
      ><BaseButton class="hidden md:block" custom-icon="newItem" custom-style="square-icon" :icon-shown="true" :no-margin="true" />
      <template #popper>
        <div class="grid grid-cols-2 font-bold text-center gap-2 p-2">
          <router-link to="/mystories/new" class="flex items-center w-24 h-24 bg-background-dark p-2 cursor-pointer"
            ><p>{{ t('profile.storybox.create.create-storybox') }}</p></router-link
          >
          <router-link :to="{ path: '/mystories/new', query: { code: true } }" class="flex items-center w-24 h-24 bg-background-dark p-2 cursor-pointer">
            <p>{{ t('profile.storybox.create.create-storybox-with-code') }}</p></router-link
          >
        </div>
      </template>
    </VDropdown>
  </div>
  <section class="md:flex md:mt-4 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0">
      <div class="w-full flex justify-end mb-2">
        <VDropdown
          ><BaseButton class="block md:hidden" custom-icon="newItem" custom-style="square-icon" :icon-shown="true" :no-margin="true" />
          <template #popper>
            <div class="grid grid-cols-2 font-bold text-center gap-2 p-2">
              <router-link to="/mystories/new" class="flex items-center w-24 h-24 bg-background-dark p-2 cursor-pointer"
                ><p>{{ t('profile.storybox.create.create-storybox') }}</p></router-link
              >
              <router-link :to="{ path: '/mystories/new', query: { code: true } }" class="flex items-center w-24 h-24 bg-background-dark p-2 cursor-pointer">
                <p>{{ t('profile.storybox.create.create-storybox-with-code') }}</p></router-link
              >
            </div>
          </template>
        </VDropdown>
      </div>
      <div v-if="loading && storyBoxItems.length === 0" class="h-fit p-8 flex flex-col w-full justify-center items-center overflow-hidden">
        <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div>
      </div>
      <div v-if="!loading && storyBoxItems.length === 0" class="flex items-center flex-col w-full h-full">
        <h1 v-if="true" class="h-fit mt-12 text-xl">{{ t(`storybox.noStories`) }}</h1>
        <div class="flex justify-center items-center h-full lg:mt-0 mt-8">
          <base-button :text="t('storybox.createNew')" :on-click="() => router.push(`/mystories/new`)" custom-style="primary" :icon-shown="true" custom-icon="newItem" class="px-2 mx-3 ml-3" />
        </div>
      </div>
      <profile-list-item v-for="(storyBoxItem, index) in storyBoxItems" :key="index" :v-show="storyBoxItems.length > 0 && !loading" :profile-list-item-info="storyBoxItem" />
    </section>
  </section>
</template>

<script lang="ts">
import ProfileListItem, { ProfileListItemInfo, ProfileListItemType } from '@/components/ProfileListItem.vue'
import { defineComponent, ref, watch } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'
import { BaseButton, useStorybox } from 'coghent-vue-3-component-library'
import { apolloClient, router } from '@/app'
import { useI18n } from 'vue-i18n'
import { StoryBoxState, CircleLoader } from 'coghent-vue-3-component-library'
import { Entity, getMetadataOfTypeFromEntity } from 'coghent-vue-3-component-library'
import { storyboxDataIsUpdated } from 'coghent-vue-3-component-library'
import { storyboxCount } from '@/app'
import QRCodeModal from '../components/QRCodeModal.vue'

export default defineComponent({
  name: 'TheStoriesPage',
  components: { ProfileSideMenu, ProfileListItem, BaseButton, CircleLoader, QRCodeModal },
  setup() {
    const { t } = useI18n()
    const storyBoxItems = ref<ProfileListItemInfo[]>([])
    const loading = ref<Boolean>(false)

    watch(storyboxDataIsUpdated, async (status: boolean) => {
      if (status === true) {
        await getStoryBoxes(true)
        storyboxDataIsUpdated.value = false
      }
    })

    const getStoryBoxes = async (_skipGetNew = false) => {
      storyBoxItems.value = []
      loading.value = true
      if (!_skipGetNew) {
        await useStorybox(apolloClient).getStoryboxes()
        storyboxCount.value = StoryBoxState.value.count
      }
      storyboxCount.value = StoryBoxState.value.count
      for (const _box of StoryBoxState.value.storyboxes) {
        const title = getMetadataOfTypeFromEntity(_box, `title`)
        const description = getMetadataOfTypeFromEntity(_box, `description`)
        storyBoxItems.value.push({
          id: _box.id,
          title: title ? title.value : _box.id,
          description: description ? description.value : '',
          code: undefined,
          onClickUrl: `/mystories/${_box.id}`,
          type: ProfileListItemType.story
        } as ProfileListItemInfo)
      }
      loading.value = false
    }

    getStoryBoxes()

    return {
      storyBoxItems,
      loading,
      t,
      router,
    }
  },
})
</script>
