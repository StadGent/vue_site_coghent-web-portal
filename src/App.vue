<template>
  <div id="modals" />
  <div class="bg-background-light font-body pt-6 flex flex-col items-center overflow-x-hidden">
    <div class="container min-h-screen">
      <the-header />
      <router-view />
      <details-modal :scroll="false" />
      <creative-modal />
      <disclaimer-button />
      <disclaimer-pop-up />
    </div>
    <the-footer />
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
import DisclaimerPopUp from './components/DisclaimerPopUp.vue'
import DisclaimerButton from './components/DisclaimerButton.vue'
import TheFooter from './components/TheFooter.vue'

export default defineComponent({
  name: 'App',
  components: { TheHeader, CreativeModal, DetailsModal, DisclaimerPopUp, DisclaimerButton, TheFooter },
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
