<template>
  <section class="md:flex md:mt-16 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0">
      <story-box-list-item v-for="(storyBoxItem, index) of storyBoxItems" :key="index" :storyBoxInfo="storyBoxItem" />
    </section>
  </section>
</template>

<script lang="ts">
import StoryBoxListItem, { StoryBoxInfo } from '@/components/StoryBoxListItem.vue'
import { defineComponent, ref } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'

export default defineComponent({
  name: 'TheStoriesPage',
  components: { ProfileSideMenu, StoryBoxListItem },
  setup() {
    const storyBoxItems = ref<StoryBoxInfo[]>([
      {
        id: '1',
        title: 'Titel van het verhaal',
        description: 'Ex quis veniam cupidatat sunt id sunt minim do exercitation officia. Cillum officia consequat sint ...',
        dateCreated: '12 mei 2021',
        code: 245700,
      },
      {
        id: '2',
        title: 'Lorem ipsum',
        description: 'Ex quis veniam cupidatat sunt id sunt minim do exercitation officia.',
        dateCreated: '1 januari 2012',
      },
    ])
    return {
      storyBoxItems,
    }
  },
})
</script>
