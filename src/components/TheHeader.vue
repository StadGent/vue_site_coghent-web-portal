<template>
  <div class="flex justify-between flex-wrap sm:flex-nowrap mt-0">
    <div class="flex gap-8">
      <div class="flex flex-col items-center">
        <router-link :to="{ path: '/home', query: route.query }" class="flex items-center sm:ml-0 ml-3 group">
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
        </router-link>
      </div>
      <div v-if="!route.query.touch" class="group sm:flex flex-col items-center pt-8 md:pt-5 hidden">
        <a target="_blank" href="https://www.collectie.gent/over-het-project" class="flex items-center">
          <h2 class="md:text-lg -mt-3 md:-mt-0 lg:mt-0 text-center group-hover:underline">
            {{ t('header.about') }}
          </h2>
        </a>
      </div>
    </div>

    <div v-if="useAuthFeature === true" class="flex ml-3">
      <div class="border-r-2 h-auto border-background-dark border-opacity-70 mr-2 sm:invisible" />
      <base-button v-if="!userStore.hasUser" :text="t('buttons.login')" :on-click="goToLoginPage" custom-style="primary" :icon-shown="false" class="px-2 mx-1 mb-2 flex-grow-0" />
      <base-button v-if="userStore.hasUser" :text="'Hi, ' + user.preferred_username" :on-click="goToProfilePage" custom-style="ghost-purple" :icon-shown="false" class="px-2 mx-1" />
      <base-button v-if="userStore.hasUser" :text="t('buttons.storybox')" :on-click="goToVerhalenBox" custom-style="ghost-purple" :icon-shown="true" custom-icon="storybox" class="px-2 mx-3 ml-3" />
    </div>
  </div>
  <div class="border-t-2 w-auto mb-5 border-background-dark mt-5 border-opacity-70" />
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { UserStore } from '../stores/UserStore'
import StoreFactory from '../stores/StoreFactory'
import { BaseButton } from 'coghent-vue-3-component-library'
import { User } from 'coghent-vue-3-component-library'
import { useAuthFeature, useSessionAuth } from '@/app'
import { useQuery } from '@vue/apollo-composable'
import { useStoryboxFeature } from '@/app'

export default defineComponent({
  name: 'TheHeader',
  components: { BaseButton },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const checkHome = () => route.path === '/' || route.name === 'singleObject'

    const isHomeActive = ref<Boolean>(checkHome())
    const isPavilionActive = ref<Boolean>(route.path === '/pavilion')
    const userStore = StoreFactory.get(UserStore)
    const user: typeof User = userStore.user

    watch(
      () => route.path,
      () => {
        isHomeActive.value = checkHome()
        isPavilionActive.value = route.path === '/pavilion'
      }
    )

    const goToLoginPage = async () => {
      console.log('\n WEB | Go to login')
      router.push({ path: '/login', query: route.query })
      // if (useSessionAuth != null) {
      //   console.log('auth is null')
      //   await useSessionAuth.assertIsAuthenticated('/', () => {
      //     refetch({})
      //       ?.then((result) => {
      //         console.log('data', result.data)
      //         const data = result.data
      //         if (data) {
      //           console.log('WEB | login data', data)
      //           console.log('WEB | login user', data.User)
      //           userStore.setUser(data.User)
      //           router.go(-1)
      //         }
      //       })
      //       .catch((error) => console.log('GetMeDocument', error))
      //   })
      // }
    }

    const goToProfilePage = () => {
      router.push({ path: '/profile', query: route.query })
    }

    const goToVerhalenBox = () => {
      router.push({ path: '/storybox', query: route.query })
    }

    const { t } = useI18n()
    return { t, isHomeActive, isPavilionActive, goToProfilePage, goToVerhalenBox, goToLoginPage, userStore, user, route, useAuthFeature, useStoryboxFeature }
  },
})
</script>

<style scoped></style>
