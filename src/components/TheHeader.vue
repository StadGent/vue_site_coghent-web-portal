<template>
  <div class="flex justify-between flex-wrap sm:flex-nowrap">
    <div class="flex gap-8">
      <div class="flex flex-col items-center">
        <router-link to="/home" class="flex items-center sm:ml-0 ml-3">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" fill="#FDC20B" />
            <g filter="url(#filter0_i)">
              <circle cx="24" cy="24" r="12" fill="white" />
            </g>
            <defs>
              <filter id="filter0_i" x="12" y="12" width="26" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="2" dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              </filter>
            </defs>
          </svg>
          <div class="flex flex-col items-center mt-5">
            <h2 class="ml-4 text-lg" :class="{ [`font-bold`]: isHomeActive }">
              {{ t('header.discover') }}
            </h2>
            <div class="w-2 h-2 mt-2" :class="{ [`bg-accent-yellow rounded`]: isHomeActive }" />
          </div>
        </router-link>
      </div>
      <!-- <div class="flex flex-col items-center pt-3">
        <router-link to="/pavilion" class="flex items-center invisible">
          <h2 class="text-lg -mt-3 md:-mt-0 lg:mt-0" :class="{ [`font-bold`]: isPavilionActive }">
            {{ t('header.pavilion') }}
          </h2>
        </router-link>
        <div class="w-2 h-2 mt-3" :class="{ [`bg-accent-yellow rounded -ml-5 sm:ml-0 mb-3 sm:mb-0`]: isPavilionActive }" />
      </div> -->
    </div>

    <!-- <div class="flex ml-3 invisible">
      <div class="border-r-2 h-auto border-background-dark border-opacity-70 mr-2 invisible sm:invisible" />
      <base-button v-if="!userStore.hasUser" :text="t('buttons.login')" :on-click="goToLoginPage" custom-style="primary" :icon-shown="false" class="px-2 mx-1 mb-2 flex-grow-0" />
      <base-button v-if="userStore.hasUser" :text="'Hi, ' + user.preferred_username" :on-click="goToProfilePage" custom-style="ghost-purple" :icon-shown="false" class="px-2 mx-1" />
      <base-button :text="t('buttons.storybox')" :on-click="goToVerhalenBox" custom-style="ghost-purple" :icon-shown="true" custom-icon="storybox" class="px-2 mx-3 ml-3" />
    </div> -->
  </div>
  <div class="border-t-2 w-auto mb-5 border-background-dark mt-5 border-opacity-70" />
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { User } from 'coghent-vue-3-component-library'
import { useRoute, useRouter } from 'vue-router'
import { UserStore } from '../stores/UserStore'
import StoreFactory from '../stores/StoreFactory'

export default defineComponent({
  name: 'TheHeader',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const checkHome = () => route.path === '/' || route.name === 'singleObject'

    const isHomeActive = ref<Boolean>(checkHome())
    const isPavilionActive = ref<Boolean>(route.path === '/pavilion')
    const userStore = StoreFactory.get(UserStore)
    const user: User = userStore.user

    watch(
      () => route.path,
      () => {
        isHomeActive.value = checkHome()
        isPavilionActive.value = route.path === '/pavilion'
      }
    )

    const goToLoginPage = () => {
      router.push('/login')
    }

    const goToProfilePage = () => {
      router.push('/profile')
    }

    const goToVerhalenBox = () => {
      router.push('/storybox')
    }

    const { t } = useI18n()
    return { t, isHomeActive, isPavilionActive, goToProfilePage, goToVerhalenBox, goToLoginPage, userStore, user }
  },
})
</script>

<style scoped></style>
