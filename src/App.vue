<template>
  <div id="modals" />
  <div class="bg-background-light font-body pt-6 flex flex-col items-center overflow-x-hidden relative">
    <div class="container min-h-screen">
      <the-header @isOpen="(status) => (mobileMenuIsOpen = status)" />
      <notification />
      <router-view />
      <transition name="menu">
        <mobile-menu v-if="mobileMenuIsOpen === true" @isOpen="(status) => (mobileMenuIsOpen = status)" />
      </transition>
      <offensive-content-modal />
      <details-modal />
      <creative-modal />
      <disclaimer-button v-if="!route.query.touch" />
      <disclaimer-pop-up v-if="!route.query.touch" />
      <onBoardingCarousel v-if="onboardingState.onboardingShown" />
    </div>
    <the-footer />
    <transition name="keyboard">
      <div v-if="route.query.touch && keyboardState.state === 'shown'" class="fixed bottom-0 w-full z-50">
        <OnScreenKeyboard />
      </div>
    </transition>
    <CookiePreferencesModal v-if="!route.query.touch" :preferenceModalTitle="t('main.cookieConsent.preferenceModalTitle')"
      ><template v-slot:logo><img src="./assets/coghent.svg" href="logo" /></template
    ></CookiePreferencesModal>
    <MinimalCookieConsent
      v-if="!route.query.touch"
      :minimalCookieConsentTitle="t('main.cookieConsent.title')"
      :minimalCookieConsentDescription="t('main.cookieConsent.description')"
      :acceptText="t('main.cookieConsent.accept')"
      :preferencesText="t('main.cookieConsent.preferences')"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TheHeader from '@/components/TheHeader.vue'
import { useHead } from '@vueuse/head'
import { ConfigStore, useGoogleFeature, useStoryboxFeature } from './stores/ConfigStore'
import StoreFactory from './stores/StoreFactory'
import CreativeModal from './components/CreativeModal.vue'
import DetailsModal from './components/DetailsModal.vue'
import DisclaimerPopUp from './components/DisclaimerPopUp.vue'
import DisclaimerButton from './components/DisclaimerButton.vue'
import TheFooter from './components/TheFooter.vue'
import MobileMenu from './components/MobileMenu.vue'
import { addGoogleData } from '@/composables/gtm'
import Notification from '@/components/Notification.vue'
import OffensiveContentModal from './components/OffensiveContentModal.vue'
import OnScreenKeyboard from './components/OnScreenKeyboard.vue'
import { useOnScreenKeyboard } from './composables/useOnScreenKeyboard'
import onBoardingCarousel from './components/onBoardingCarousel.vue'
import { useOnBoarding } from './composables/useOnBoarding'
import { MinimalCookieConsent, CookiePreferencesModal, useCookieConsent } from 'coghent-vue-3-component-library'
import { getCookie } from 'tiny-cookie'
import { usedCookies } from './composables/usedCookies'

export default defineComponent({
  name: 'App',
  components: {
    TheHeader,
    CreativeModal,
    DetailsModal,
    TheFooter,
    DisclaimerButton,
    DisclaimerPopUp,
    MobileMenu,
    Notification,
    OffensiveContentModal,
    OnScreenKeyboard,
    onBoardingCarousel,
    MinimalCookieConsent,
    CookiePreferencesModal,
  },
  setup: () => {
    const { t } = useI18n()
    const configStore = StoreFactory.get(ConfigStore)
    const indexValue: boolean | undefined = configStore.config.value.vueAppIndex
    const route = useRoute()
    const mobileMenuIsOpen = ref<boolean>(false)
    const { keyboardState } = useOnScreenKeyboard()
    const { onboardingState } = useOnBoarding()
    const { setUsedCookies, closeConsentManager, setUserAcceptedCookies, cookieConsentState } = useCookieConsent()
    const gtmId = configStore.config.value.google?.tagManager
    const gaId = configStore.config.value.google?.analytics
    const userCookiePreference = getCookie('_cookiePreferences')

    if (userCookiePreference) {
      const userAcceptedCookies = JSON.parse(userCookiePreference || '[]')
      setUserAcceptedCookies(userAcceptedCookies)
      closeConsentManager()
    }

    setUsedCookies(usedCookies)

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

    watch(
      () => cookieConsentState.value.userAcceptedCookies,
      (userAcceptedCookies) => {
        if (userAcceptedCookies.includes('_ga') && useGoogleFeature.value === true) {
          addGoogleData(gtmId, gaId)
        }
      },
      { immediate: true }
    )

    return {
      t,
      route,
      mobileMenuIsOpen,
      keyboardState,
      onboardingState,
      useStoryboxFeature,
    }
  },
})
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: transform 0.5s ease;
}

.menu-enter-from,
.menu-leave-to {
  transform: translateX(-100%);
}

.keyboard-enter-active,
.keyboard-leave-active {
  transition: transform 0.5s ease;
}

.keyboard-enter-from,
.keyboard-leave-to {
  transform: translateY(100%);
}
</style>
