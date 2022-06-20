<template>
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
      <div v-if="loading" class="h-full p-8 flex flex-col w-full justify-center items-center overflow-hidden">
        <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div>
      </div>
      <profile-list-item v-for="(storyBoxItem, index) in storyBoxItems" :key="index" :profile-list-item-info="storyBoxItem" />
    </section>
  </section>
</template>

<script lang="ts">
import ProfileListItem, { ProfileListItemInfo } from '@/components/ProfileListItem.vue'
import { defineComponent, ref } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'
import { BaseButton, useStorybox } from 'coghent-vue-3-component-library'
import { apolloClient } from '@/app'
import { useI18n } from 'vue-i18n'
import { StoryboxBuild, StoryBoxState, CircleLoader } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'TheStoriesPage',
  components: { ProfileSideMenu, ProfileListItem, BaseButton, CircleLoader },
  setup() {
    const { t } = useI18n()
    const storyBoxItems = ref<ProfileListItemInfo[]>([])
    const loading = ref<Boolean>(false)

    const getStoryBoxes = async () => {
      loading.value = true
      await useStorybox(apolloClient).getStoryboxes()
      loading.value = false
      StoryBoxState.value.storyboxes.map((_box: typeof StoryboxBuild) => {
        storyBoxItems.value.push({
          id: _box.id,
          title: _box.id,
          onClickUrl: `/mystories/${_box.id}`,
        } as ProfileListItemInfo)
      })
      console.log({ storyBoxItems })
    }

    getStoryBoxes()

    return {
      storyBoxItems,
      loading,
      t,
    }
  },
})
</script>
