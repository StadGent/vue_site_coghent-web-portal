<template>
  <div id="modals" />
  <div class="bg-background-light font-body pt-6 flex flex-col items-center overflow-x-hidden">
    <div class="container min-h-screen">
      <the-header @isOpen="(status) => (mobileMenuIsOpen = status)" />
      <router-view />
      <mobile-menu v-if="mobileMenuIsOpen === true" @isOpen="(status) => (mobileMenuIsOpen = status)" />
      <details-modal />
      <creative-modal />
      <disclaimer-button v-if="!route.query.touch && !useStoryboxFeature" />
      <disclaimer-pop-up v-if="!route.query.touch && !useStoryboxFeature" />
    </div>
    <the-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
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
import MobileMenu from './components/MobileMenu.vue'
import { useGtmFeature, useStoryboxFeature } from './app'
import { addGoogleData  } from '@/composables/gtm'

export default defineComponent({
  name: 'App',
  components: { TheHeader, CreativeModal, DetailsModal, TheFooter, DisclaimerButton, DisclaimerPopUp, MobileMenu },
  setup: () => {
    const { t } = useI18n()
    const configStore = StoreFactory.get(ConfigStore)
    const indexValue: boolean | undefined = configStore.config.value.vueAppIndex
    const route = useRoute()
    const mobileMenuIsOpen = ref<boolean>(false)

    if (useGtmFeature.value === true) {
      addGoogleData(`GTM-MHV9SLC`, `UA-164592648-1`)
    }

    if (route.query.touch) {
      // Disable rightclick if touchmode
      document.addEventListener('contextmenu', (event) => event.preventDefault())
    }

    const getIndexValue = () => {
      let indexStr = ''
      if (indexValue === true) {
        indexStr = 'INDEX, FOLLOW'
      } else if (indexValue === undefined || indexValue === false) {
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
      route,
      useStoryboxFeature,
      mobileMenuIsOpen,
    }
  },
})
</script>

<style></style>
