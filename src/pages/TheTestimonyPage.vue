<template>
  <section class="md:flex md:mt-4 gap-8">
    <profile-side-menu />
    <section class="w-full p-4 md:p-0"></section>
    <!-- <profile-list-item :profile-list-item-info="[]" /> -->
  </section>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'
import ProfileListItem from '../components/ProfileListItem.vue'
import { GetTestimoniesOfUserDocument } from 'coghent-vue-3-component-library'
import { useQuery } from '@vue/apollo-composable'

export default defineComponent({
  name: 'TheTestimonyPage',
  components: { ProfileSideMenu },
  setup() {
    const { result: testimonies } = useQuery(GetTestimoniesOfUserDocument)

    watch(testimonies.value, () => {
      console.log(testimonies.value)
    })
  },
})
</script>
