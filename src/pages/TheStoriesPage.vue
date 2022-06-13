<template>
  <section class="md:flex md:mt-16 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0">
      <profile-list-item v-for="(storyBoxItem, index) in storyBoxItems" :key="index" :profileListItemInfo="storyBoxItem" />
    </section>
  </section>
</template>

<script lang="ts">
import ProfileListItem, { ProfileListItemInfo } from '@/components/ProfileListItem.vue'
import { defineComponent, ref } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'

export default defineComponent({
  name: 'TheStoriesPage',
  components: { ProfileSideMenu, ProfileListItem },
  setup() {
    const storyBoxItems = ref<ProfileListItemInfo[]>([
      {
        id: '1',
        title: 'Titel van het verhaal',
        description: 'Ex quis veniam cupidatat sunt id sunt minim do exercitation officia. Cillum officia consequat sint ...',
        dateCreated: '12 mei 2021',
        onClickUrl: '/story/1',
        code: 245700,
      },
      {
        id: '2',
        title: 'Lorem ipsum',
        description: 'Ex quis veniam cupidatat sunt id sunt minim do exercitation officia.',
        dateCreated: '1 januari 2012',
        onClickUrl: '/story/2',
      },
    ])
    return {
      storyBoxItems,
    }
  },
})
</script>
