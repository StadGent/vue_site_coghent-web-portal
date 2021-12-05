<template>
  <div id="modals" />
  <div class="bg-background-light font-body py-6 min-h-screen flex flex-col items-center">
    <div class="container">
      <the-header />
      <router-view />
      <creative-modal />
      <details-modal/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import TheHeader from '@/components/TheHeader.vue'
import { useHead } from '@vueuse/head'
import { ConfigStore } from './stores/ConfigStore'
import StoreFactory from './stores/StoreFactory'
import CreativeModal from './components/CreativeModal.vue'
import DetailsModal from './components/DetailsModal.vue'

export default defineComponent({
  name: 'App',
  components: { TheHeader, CreativeModal, DetailsModal },
  setup: () => {
    const { t } = useI18n()
    const configStore = StoreFactory.get(ConfigStore)
    const indexValue = configStore.config.value.vueAppIndex

    const getIndexValue = () => {
      let indexStr = ''
      if (indexValue) {
        indexStr = 'INDEX, FOLLOW'
      } else {
        indexStr = 'NOINDEX, NOFOLLOW'
      }
      return indexStr
    }

    useHead({
      meta: [
        {
          name: `ROBOTS`,
          content: getIndexValue(),
        },
      ],
    })

    return {
      t,
    }
  },
})
</script>

<style></style>
