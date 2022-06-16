<template>
  <div class="w-full flex justify-end">
    <VDropdown
      ><BaseButton class="hidden md:block" customIcon="newItem" customStyle="square-icon" :iconShown="true" :noMargin="true" />
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
          ><BaseButton class="block md:hidden" customIcon="newItem" customStyle="square-icon" :iconShown="true" :noMargin="true" />
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
      <profile-list-item v-for="(storyBoxItem, index) in storyBoxItems" :key="index" :profileListItemInfo="storyBoxItem" />
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

export default defineComponent({
  name: 'TheStoriesPage',
  components: { ProfileSideMenu, ProfileListItem, BaseButton },
  setup() {
    const { t } = useI18n()
    const storyBoxItems = ref<ProfileListItemInfo[]>([])

    const getStoryBoxes = async () => {
      const storyboxItems = await useStorybox(apolloClient).getStoryboxes()
      console.log({ storyboxItems })
    }

    getStoryBoxes()

    return {
      storyBoxItems,
      t,
    }
  },
})
</script>
