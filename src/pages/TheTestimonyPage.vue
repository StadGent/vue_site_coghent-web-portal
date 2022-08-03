<template>
  <section class="md:flex md:mt-4 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0"><profile-list-item v-for="testimonyListItem of testimonyList" :key="testimonyListItem.id" :profile-list-item-info="testimonyListItem" /></section>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'
import ProfileListItem, { ProfileListItemInfo, ProfileListItemType } from '../components/ProfileListItem.vue'
import { GetTestimoniesOfUserDocument } from 'coghent-vue-3-component-library'
import { useQuery } from '@vue/apollo-composable'
import { Entity } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'TheTestimonyPage',
  components: { ProfileSideMenu, ProfileListItem },
  setup() {
    const testimonyList = ref<typeof Entity[]>([])
    const { result: testimonies } = useQuery(GetTestimoniesOfUserDocument)

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

    watch(
      () => testimonies.value,
      () => {
        if (testimonies.value) {
          testimonyList.value = parseListItem(testimonies.value.GetTestimoniesOfUser)
        }
      },
      { immediate: true }
    )

    return { testimonyList }
  },
})
</script>
