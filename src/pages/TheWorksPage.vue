<template>
  <section class="flex md:mt-16">
    <profile-side-menu />
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import ProfileSideMenu from '../components/ProfileSideMenu.vue'

export default defineComponent({
  name: 'TheWorksPage',
  components: { ProfileSideMenu },
  setup() {},
})
</script>
