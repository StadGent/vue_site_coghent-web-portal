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
import { defineComponent, ref, watch } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'
import { BaseButton, useStorybox } from 'coghent-vue-3-component-library'
import { apolloClient } from '@/app'
import { useI18n } from 'vue-i18n'
import { StoryBoxState, CircleLoader } from 'coghent-vue-3-component-library'
import { Entity, getMetadataOfTypeFromEntity } from 'coghent-vue-3-component-library'
import { storyboxDataIsUpdated } from 'coghent-vue-3-component-library'
import { storyboxCount } from './TheStoryboxPage.vue'

export default defineComponent({
  name: 'TheStoriesPage',
  components: { ProfileSideMenu, ProfileListItem, BaseButton, CircleLoader },
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
      }
      storyboxCount.value = StoryBoxState.value.count
      loading.value = false
      StoryBoxState.value.storyboxes.forEach((_box: typeof Entity) => {
        const code = getMetadataOfTypeFromEntity(_box, `boxCode`)
        const title = getMetadataOfTypeFromEntity(_box, `title`)
        const description = getMetadataOfTypeFromEntity(_box, `description`)
        storyBoxItems.value.push({
          id: _box.id,
          title: title ? title.value : _box.id,
          description: description ? description.value : '',
          code: code?code.value:null,
          onClickUrl: `/mystories/${_box.id}`,
        } as ProfileListItemInfo)
      })
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
