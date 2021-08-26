<template>
  <div class="bg-background-light font-body py-6 min-h-screen flex flex-col items-center">
    <div class="container">
      <the-header />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import TheHeader from '@/components/TheHeader.vue'

export default defineComponent({
  name: 'App',
  components: { TheHeader },
  setup: () => {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>

<style></style>
