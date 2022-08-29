<template>
  <confirmation-modal
    :confirmButtonText="t('profile.testimony.deleteConfirmation.yes')"
    :declineButtonText="t('profile.testimony.deleteConfirmation.no')"
    :modalText="t('profile.testimony.deleteConfirmation.confirmationText')"
  />
  <section class="md:flex md:mt-4 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0">
      <profile-list-item v-for="testimonyListItem of testimonyList" :key="testimonyListItem.id" :profile-list-item-info="testimonyListItem" @deleteItem="confirmDelete" />
      <div v-if="loadingTestimonies && testimonyList.length === 0" class="h-fit p-8 flex flex-col w-full justify-center items-center overflow-hidden">
        <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div>
      </div>
      <div v-if="!loadingTestimonies && testimonyList.length === 0" class="flex items-center flex-col w-full h-full">
        <h1 class="h-fit mt-12 text-xl">{{ t('profile.testimony.noTestimonies') }}</h1>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'
import ProfileListItem, { ProfileListItemInfo, ProfileListItemType } from '../components/ProfileListItem.vue'
import { GetTestimoniesOfUserDocument, Entity, CircleLoader, Relation, RelationType, DeleteEntityDocument } from 'coghent-vue-3-component-library'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { parseDateAsLocaleString } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { iiif } from '@/app'
import ConfirmationModal, { useConfirmationModal } from '../components/ConfirmationModal.vue'

export default defineComponent({
  name: 'TheTestimonyPage',
  components: { ProfileSideMenu, ProfileListItem, CircleLoader, ConfirmationModal },
  setup() {
    const testimonyList = ref<typeof Entity[]>([])
    const { result: testimonies, refetch: refetchTestimonies, loading: loadingTestimonies } = useQuery(GetTestimoniesOfUserDocument)
    const { generateUrl, generateInfoUrl, noImageUrl } = iiif
    const { t } = useI18n()
    const { mutate: deleteItem } = useMutation(DeleteEntityDocument)
    const { setConfirmationCallback, setConfirmationEntityId, ConfirmationModalState, openConfirmationModal } = useConfirmationModal()

    const parseListItem = (items: typeof Entity[]): ProfileListItemInfo[] => {
      const listItems: ProfileListItemInfo[] = []
      if (listItems) {
        items.forEach((item: typeof Entity) => {
          console.log(item)
          const listItem: ProfileListItemInfo = {
            id: item.id,
            title: item.linkedParentEntity.title[0].value,
            description: item.description[0].value,
            pictureUrl: generateUrl(item.linkedParentEntity.primary_transcode, 'full'),
            dateCreated: parseDateAsLocaleString(new Date(item.date[0].value)),
            onClickUrl: item.relations[0]?.key.replace('entities/', '/entity/'),
            type: ProfileListItemType.testimony,
            entity: item,
          }
          listItems.push(listItem)
        })
      }
      return listItems
    }

    onMounted(() => {
      refetchTestimonies()
    })

    watch(
      () => testimonies.value,
      () => {
        if (testimonies.value) {
          testimonyList.value = parseListItem(testimonies.value.GetTestimoniesOfUser)
        }
      },
      { immediate: true }
    )

    const confirmDelete = (testimonyId: string) => {
      setConfirmationCallback(deleteTestimony)
      setConfirmationEntityId(testimonyId)
      openConfirmationModal()
    }

    const deleteTestimony = (testimonyId: string | undefined = undefined) => {
      const id: string | undefined = testimonyId || ConfirmationModalState.value.confirmationEntityId
      if (id) {
        testimonyList.value = testimonyList.value.filter((listItem: ProfileListItemInfo) => listItem.id != id)
        deleteItem({ id })
      }
    }

    return { testimonyList, loadingTestimonies, t, deleteTestimony, confirmDelete }
  },
})
</script>
