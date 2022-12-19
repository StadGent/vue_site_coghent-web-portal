<template>
  <div class="mt-3 sm:mt-0 items-center flex justify-between flex-wrap sm:flex-nowrap mt-0 sm:mx-5">
    <div class="flex gap-2 xl:gap-8">
      <div class="flex flex-col items-center sm:mt-0 mt-2">
        <a class="flex items-center sm:ml-0 ml-3 group cursor-pointer" @click="checkAction">
          <img src="../assets/coghent.svg" href="logo" />
          <div class="sm:flex flex-col items-center mt-5 ml-2 hidden">
            <h2 class="md:text-lg text-center group-hover:underline" :class="{ [`font-bold`]: isHomeActive }">
              {{ t('header.discover') }}
            </h2>
            <div class="w-2 h-2 mt-2" :class="{ [`bg-accent-yellow rounded`]: isHomeActive }" />
          </div>
        </a>
      </div>
      <div v-if="!route.query.touch && !isMobile" class="flex flex-row gap-8">
        <div v-for="menuItem of headerItems" :key="menuItem.title" class="group sm:flex flex-col items-center pt-8 md:pt-5 hidden">
          <a target="_blank" :href="menuItem.link" class="flex items-center">
            <h2 class="md:text-lg -mt-3 md:-mt-0 lg:mt-0 text-center group-hover:underline cursor-pointer">
              {{ menuItem.title }}
            </h2>
          </a>
        </div>
      </div>
    </div>

    <div v-if="!route.query.touch && useAuthFeature === true" class="sm:inline-flex flex ml-3 mt-5">
      <!-- <div v-if="!isMobile" class="border-r-2 h-auto border-background-dark border-opacity-70 mr-2 sm:invisible sm:hidden" /> -->
      <span class="sm:inline-flex">
        <base-button
          v-if="!route.query.touch && !userStore.hasUser"
          :text="t('buttons.login')"
          :on-click="goToLoginPage"
          custom-style="primary"
          :icon-shown="false"
          class="px-2 mx-1 mb-2 flex-grow-0"
        />
        <base-button
          v-if="userStore.hasUser"
          :text="t(`profile.greeting`) + `,  ` + user.given_name || user.name"
          :on-click="goToProfilePage"
          custom-style="ghost-purple"
          :icon-shown="false"
          class="px-2 mx-1"
        />
      </span>
      <base-button
        v-if="userStore.hasUser && useStoryboxFeature && !isMobile && !route.query.touch"
        :has-badge="true"
        :badge-value="storyboxCount.toString()"
        :text="t('buttons.storybox')"
        :on-click="goToVerhalenBox"
        custom-style="ghost-purple"
        :icon-shown="true"
        custom-icon="storybox"
        class="px-2 mx-3 ml-3 hidden lg:inline-flex"
      />
      <div class="flex justify-center items-center mx-4 stroke-gray cursor-pointer" @click="toggleOnBoarding">
        <BaseIcon :width="30" :height="30" icon="help" />
      </div>
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
import { BaseButton, BaseIcon } from 'coghent-vue-3-component-library'
import { User } from 'coghent-vue-3-component-library'
import { apolloClient, router } from '@/app'
import { storyboxCount } from '@/app'
import { useStorybox, StoryBoxState } from 'coghent-vue-3-component-library'
import useMenu from '@/composables/useMenu'
import { useAuthFeature, useStoryboxFeature } from '@/stores/ConfigStore'
import { useOnBoarding } from '../composables/useOnBoarding'

export default defineComponent({
  name: 'TheHeader',
  components: { BaseButton, BaseIcon },
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
    const { toggleOnBoarding } = useOnBoarding()

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
      router.push({ path: '/mijnverhalen', query: route.query })
    }

    const goToVerhalenBox = () => {
      router.push({ path: '/mijnverhalen', query: route.query })
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
      toggleOnBoarding,
    }
  },
})
</script>

<style scoped>
.stroke-gray {
  stroke: lightgrey;
  opacity: 0.2;
}
</style>
