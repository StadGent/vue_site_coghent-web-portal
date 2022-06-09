<template>
  <section class="flex mt-16">
    <profile-side-menu />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'

export default defineComponent({
  name: 'TheStoriesPage',
  components: { ProfileSideMenu },
  setup() {},
})
</script>
