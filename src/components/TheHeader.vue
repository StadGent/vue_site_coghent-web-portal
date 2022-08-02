<template>
  <div class="flex justify-between flex-wrap sm:flex-nowrap mt-0">
    <div class="flex gap-8">
      <div class="flex flex-col items-center">
        <a class="flex items-center sm:ml-0 ml-3 group" @click="checkAction">
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
          <div class="sm:flex flex-col items-center mt-5 ml-2 hidden">
            <h2 class="md:text-lg text-center group-hover:underline" :class="{ [`font-bold`]: isHomeActive }">
              {{ t('header.discover') }}
            </h2>
            <div class="w-2 h-2 mt-2" :class="{ [`bg-accent-yellow rounded`]: isHomeActive }" />
          </div>
        </a>
      </div>
      <div v-if="route.query.touch && useStoryboxFeature" class="group sm:flex flex-col items-center pt-8 md:pt-5 hidden">
        <a href="https://cogent.collectie.gent/touchtable/start" class="flex items-center">
          <h2 class="md:text-lg -mt-3 md:-mt-0 lg:mt-0 text-center group-hover:underline">
            {{ t('header.code') }}
          </h2>
        </a>
      </div>
      <div v-if="!route.query.touch && !isMobile" class="flex flex-row gap-8">
        <div v-for="menuItem of headerItems" :key="menuItem.title" class="group sm:flex flex-col items-center pt-8 md:pt-5 hidden">
          <a target="_blank" :href="menuItem.link" class="flex items-center">
            <h2 class="md:text-lg -mt-3 md:-mt-0 lg:mt-0 text-center group-hover:underline">
              {{ menuItem.title }}
            </h2>
          </a>
        </div>
      </div>
    </div>

    <div v-if="useAuthFeature === true" class="flex ml-3">
      <div v-if="!isMobile" class="border-r-2 h-auto border-background-dark border-opacity-70 mr-2 sm:invisible" />
      <base-button v-if="!route.query.touch && !userStore.hasUser" :text="t('buttons.login')" :on-click="goToLoginPage" custom-style="primary" :icon-shown="false" class="px-2 mx-1 mb-2 flex-grow-0" />
      <base-button
        v-if="userStore.hasUser"
        :text="t(`profile.greeting`) + `,  ` + user.preferred_username"
        :on-click="goToProfilePage"
        custom-style="ghost-purple"
        :icon-shown="false"
        class="px-2 mx-1"
      />
      <base-button
        v-if="userStore.hasUser && useStoryboxFeature && !isMobile && !route.query.touch"
        :has-badge="true"
        :badge-value="storyboxCount"
        :text="t('buttons.storybox')"
        :on-click="goToVerhalenBox"
        custom-style="ghost-purple"
        :icon-shown="true"
        custom-icon="storybox"
        class="px-2 mx-3 ml-3"
      />
    </div>
  </div>
  <div class="border-t-2 w-auto mb-5 border-background-dark mt-5 border-opacity-70" />
</template>

<script lang="ts">
import { defineComponent, watch, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { UserStore } from '../stores/UserStore'
import StoreFactory from '../stores/StoreFactory'
import { BaseButton } from 'coghent-vue-3-component-library'
import { User } from 'coghent-vue-3-component-library'
import { apolloClient, router, useAuthFeature, useStoryboxFeature } from '@/app'
import { storyboxCount } from '@/app'
import { useStorybox, StoryBoxState } from 'coghent-vue-3-component-library'
import useMenu from '@/composables/useMenu'

export default defineComponent({
  name: 'TheHeader',
  components: { BaseButton },
  setup(props, { emit }) {
    const route = useRoute()
    // const router = useRouter()
    const checkHome = () => route.path === '/' || route.name === 'singleObject'
    const checkTouch = () => route.fullPath.includes('touch=true')
    const { headerItems } = useMenu()

    const isMobile = ref<boolean>(false)
    const isTouchActive = ref<Boolean>(checkTouch())
    const isHomeActive = ref<Boolean>(checkHome())
    const isPavilionActive = ref<Boolean>(route.path === '/pavilion')
    const userStore = StoreFactory.get(UserStore)
    const user: typeof User = userStore.user
    console.log(isTouchActive.value)

    watch(
      () => route.path,
      () => {
        isHomeActive.value = checkHome()
        isPavilionActive.value = route.path === '/pavilion'
      }
    )

    onMounted(async () => {
      if (window.innerWidth <= 900) {
        isMobile.value = true
      }
      if (userStore.hasUser) {
        await useStorybox(apolloClient).getStoryboxes()
        storyboxCount.value = StoryBoxState.value.count
      }
    })

    const goToLoginPage = async () => {
      router.push({ path: '/login', query: route.query })
    }

    const goToProfilePage = () => {
      router.push({ path: '/profile', query: route.query })
    }

    const goToVerhalenBox = () => {
      router.push({ path: '/mystories', query: route.query })
    }

    const checkAction = () => {
      if (window.innerWidth <= 900) {
        isMobile.value = true
        emit(`isOpen`, true)
      } else {
        isMobile.value = false
        if (isTouchActive.value === true) {
          router.push({ path: `/home`, query: { touch: 'true' } })
        } else router.push({ path: `/home` })
      }
      // :href="isTouchActive ? '/home?touch=true' : '/home'"
    }

    const { t } = useI18n()
    return {
      t,
      isHomeActive,
      isTouchActive,
      isPavilionActive,
      goToProfilePage,
      goToVerhalenBox,
      goToLoginPage,
      userStore,
      user,
      route,
      useAuthFeature,
      useStoryboxFeature,
      storyboxCount,
      checkAction,
      isMobile,
      headerItems,
    }
  },
})
</script>

<style scoped></style>
