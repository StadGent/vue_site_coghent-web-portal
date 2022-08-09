<template>
  <section class="flex md:mt-16 gap-8 flex-col">
    <div class="pb-4 flex justify-end">
      <base-button class="uploadButton text-text-white" :on-click="() => router.push(uploadRoute)" :icon-shown="true" custom-icon="newItem" :text="t(`myWorks.upload.title`)"></base-button>
    </div>
    <span class="flex flex-col md:flex-row">
      <profile-side-menu />
      <section class="w-full p-4 md:ml-8 md:p-0">
        <div v-if="isLoading && myWorks.length === 0" class="h-fit p-8 flex flex-col w-full justify-center items-center overflow-hidden">
          <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div>
        </div>
        <div v-if="(!isLoading && myWorks.length === 0) || myWorks === null" class="flex items-center flex-col w-full h-full">
          <h1 v-if="true" class="h-fit mt-12 text-xl">{{ t(`myWorks.upload.noItems`) }}</h1>
          <div class="flex justify-center items-center h-full lg:mt-0 mt-8">
            <base-button v-show="false" :text="t('flow.upload')" :on-click="() => router.push(`/upload`)" custom-style="primary" :icon-shown="true" custom-icon="newItem" class="px-2 mx-3 ml-3" />
          </div>
        </div>
        <profile-list-item v-for="(work, index) in myWorks" :key="index" :profile-list-item-info="work" />
      </section>
    </span>
    <div class="lg:hidden fixed bottom-16 right-10 bg-accent-purple rounded-full p-4 flex justify-center items-center shadow-lg">
      <BaseIcon icon="newItem" class="stroke-current p-1 cursor-pointer text-text-white" @click="() => router.push(`/upload`)" />
    </div>
  </section>
</template>
<script lang="ts">
import { apolloClient, iiif, router } from '@/app'
import ProfileListItem, { ProfileListItemInfo, ProfileListItemType } from '@/components/ProfileListItem.vue'
import uploadWizard from '@/composables/uploadWizard'
import { useUpload, CircleLoader, BaseIcon } from 'coghent-vue-3-component-library'
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
    BaseIcon,
  },
  setup() {
    const { t } = useI18n()
    const uploadRoute = `/upload`
    const myWorks = ref<Array<ProfileListItemInfo>>([])
    const isLoading = ref<boolean>(false)
    const { getAllUploads, stripUserUploadPrefix, getMediafiles, getMediafileLink, getFilename, updateAsset } = useUpload()
    const { ASSET_ID_PARAM } = uploadWizard()
    const { generateUrl } = iiif

    const prepareCards = async (_entities: Array<typeof Entity> | null) => {
      if (_entities !== null) {
        for (const asset of _entities) {
          const mediafiles = await getMediafiles(asset)
          let title = getMetadataOfTypeFromEntity(asset, 'title')
          let maker = getMetadataOfTypeFromEntity(asset, 'maker')
          let publicationStatus = getMetadataOfTypeFromEntity(asset, 'publication_status')
          let userAction = getMetadataOfTypeFromEntity(asset, 'user_action')
          myWorks.value.push({
            id: asset.id,
            title: title ? stripUserUploadPrefix(title.value) : 'Title placeholder',
            description: maker ? maker.value : 'Onbekend',
            // dateCreated: '24 februari 2020',
            onClickUrl: `upload?${ASSET_ID_PARAM}=${asset.id}`,
            pictureUrl: getMediafileLink(mediafiles),
            // pictureUrl: generateUrl(getFilename(mediafiles[0] ? mediafiles[0] : null), 'full', 48),
            status: publicationStatus ? publicationStatus.value : null,
            type: ProfileListItemType.uploadedWork,
            entity: asset,
            action: userAction ? userAction.value : 'updated',
          } as ProfileListItemInfo)
        }
      }
    }

    const init = async () => {
      isLoading.value = true
      const entitiesResults = await getAllUploads(apolloClient)
      if (entitiesResults !== null) {
        await prepareCards(entitiesResults.results)
      } else {
        myWorks.value = []
      }
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

<style scoped>
.uploadButton {
  display: all;
}

@media screen and (max-width: 992px) {
  .uploadButton {
    display: none;
  }
}
</style>
