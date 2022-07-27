<template>
  <section class="flex md:mt-16 gap-8 flex-col md:flex-row">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0">
      <div class="pb-4 mb-4 flex justify-end">
        <base-button class="text-text-white" :on-click="() => router.push(uploadRoute)" :icon-shown="true" custom-icon="newItem" :text="t(`myWorks.upload.title`)"></base-button>
      </div>
      <div v-if="isLoading && myWorks.length === 0" class="h-fit p-8 flex flex-col w-full justify-center items-center overflow-hidden">
        <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div>
      </div>
      <div v-if="!isLoading && myWorks.length === 0" class="flex items-center flex-col w-full h-full">
        <h1 v-if="true" class="h-fit mt-12 text-xl">{{ t(`myWorks.upload.noItems`) }}</h1>
        <div class="flex justify-center items-center h-full lg:mt-0 mt-8">
          <base-button v-show="false" :text="t('flow.upload')" :on-click="() => router.push(`/upload`)" custom-style="primary" :icon-shown="true" custom-icon="newItem" class="px-2 mx-3 ml-3" />
        </div>
      </div>
      <profile-list-item v-for="(work, index) in myWorks" :key="index" :profile-list-item-info="work" />
    </section>
  </section>
</template>
<script lang="ts">
import { apolloClient, router } from '@/app'
import ProfileListItem, { ProfileListItemInfo, ProfileListItemType } from '@/components/ProfileListItem.vue'
import { useUpload, CircleLoader } from 'coghent-vue-3-component-library'
import { getMetadataOfTypeFromEntity } from 'coghent-vue-3-component-library'
import { Entity } from 'coghent-vue-3-component-library'
import { BaseButton } from 'coghent-vue-3-component-library'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'

export default defineComponent({
  name: 'TheWorksPage',
  components: {
    ProfileSideMenu,
    ProfileListItem,
    BaseButton,
    CircleLoader,
  },
  setup() {
    const { t } = useI18n()
    const uploadRoute = `/upload`
    const myWorks = ref<Array<ProfileListItemInfo>>([])
    const isLoading = ref<boolean>(false)
    const { getAllUploads, stripUserUploadPrefix, getMediafiles, getMediafileLink } = useUpload()

    const prepareCards = (_entities: Array<typeof Entity> | null) => {
      if (_entities !== null) {
        for (const asset of _entities) {
          const mediafiles = getMediafiles(asset)
          let title = getMetadataOfTypeFromEntity(asset, 'title')
          let maker = getMetadataOfTypeFromEntity(asset, 'maker')
          let publicationStatus = getMetadataOfTypeFromEntity(asset, 'publication_status')
          myWorks.value.push({
            id: asset.id,
            title: title ? stripUserUploadPrefix(title.value) : 'Title placeholder',
            description: maker ? maker.value : 'Onbekend',
            dateCreated: '24 februari 2020',
            onClickUrl: '/work/1',
            pictureUrl: getMediafileLink(mediafiles),
            status: publicationStatus ? publicationStatus.value : null,
            type: ProfileListItemType.uploadedWork,
          } as ProfileListItemInfo)
        }
      }
    }

    const init = async () => {
      isLoading.value = true
      const entitiesResults = await getAllUploads(apolloClient)
      prepareCards(entitiesResults.results)
      isLoading.value = false
    }

    init()

    return {
      myWorks,
      t,
      router,
      uploadRoute,
      isLoading,
    }
  },
})
</script>
