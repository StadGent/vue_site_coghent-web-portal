<template>
  <section class="flex md:mt-16 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0">
      <profile-list-item v-for="(work, index) in myWorks" :key="index" :profileListItemInfo="work" />
    </section>
  </section>
</template>
<script lang="ts">
import ProfileListItem, { ProfileListItemInfo } from '@/components/ProfileListItem.vue'
import { defineComponent, ref } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'

export default defineComponent({
  name: 'TheWorksPage',
  components: { ProfileSideMenu, ProfileListItem },
  setup() {
    const myWorks = ref<ProfileListItemInfo[]>([
      {
        id: '1',
        title: 'My work',
        description: 'My best work',
        dateCreated: '24 februari 2020',
        onClickUrl: '/work/1',
        pictureUrl: './no-image.png',
      },
    ])

    return {
      myWorks,
    }
  },
})
</script>
