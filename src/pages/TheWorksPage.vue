<template>
  <section class="flex md:mt-16 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0">
      <div class="p-4 flex justify-end">
        <base-button class="text-text-white" :on-click="() => router.push(uploadRoute)" :iconShown="true" customIcon="newItem" :text="t(`myWorks.upload.title`)"></base-button>
      </div>
      <profile-list-item v-for="(work, index) in myWorks" :key="index" :profile-list-item-info="work" />
    </section>
  </section>
</template>
<script lang="ts">
import { router } from '@/app'
import ProfileListItem, { ProfileListItemInfo } from '@/components/ProfileListItem.vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'

export default defineComponent({
  name: 'TheWorksPage',
  components: { ProfileSideMenu, ProfileListItem, BaseButton },
  setup() {
    const { t } = useI18n()
    const uploadRoute = `/upload`
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
      t,
      router,
      uploadRoute,
    }
  },
})
</script>
