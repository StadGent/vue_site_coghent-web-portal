<template>
  <section class="md:flex md:mt-4 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0">
      <profile-list-item v-for="testimonyListItem of testimonyList" :key="testimonyListItem.id" :profile-list-item-info="testimonyListItem" />
      <div v-if="loadingTestimonies && testimonyList.length === 0" class="h-fit p-8 flex flex-col w-full justify-center items-center overflow-hidden">
        <div class="flex justify-center items-center w-full p-4"><CircleLoader /></div>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'
import ProfileListItem, { ProfileListItemInfo, ProfileListItemType } from '../components/ProfileListItem.vue'
import { GetTestimoniesOfUserDocument } from 'coghent-vue-3-component-library'
import { useQuery } from '@vue/apollo-composable'
import { Entity, CircleLoader } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'TheTestimonyPage',
  components: { ProfileSideMenu, ProfileListItem, CircleLoader },
  setup() {
    const testimonyList = ref<typeof Entity[]>([])
    const { result: testimonies, refetch: refetchTestimonies, loading: loadingTestimonies } = useQuery(GetTestimoniesOfUserDocument)

    const parseListItem = (items: typeof Entity[]): ProfileListItemInfo[] => {
      const listItems: ProfileListItemInfo[] = []
      if (listItems) {
        items.forEach((item: typeof Entity) => {
          const listItem: ProfileListItemInfo = {
            id: item.id,
            title: item.user,
            description: item.description[0].value,
            dateCreated: new Date(item.date[0].value).toDateString(),
            onClickUrl: '',
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

    return { testimonyList, loadingTestimonies }
  },
})
</script>
