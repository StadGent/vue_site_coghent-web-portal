<template>
  <div class="md:bg-background-medium flex p-8 flex-col w-full md:w-2/6 h-full">
    <div class="flex flex-col justify-between flex-1 pb-4">
      <div class="flex justify-between items-center">
        <h2 class="mt-5 font-bold text-4xl">Hey {{ user.preferred_username }}!</h2>
        <base-button
          class="md:hidden block w-8 h-8 bg-neutral-0 rounded-full flex justify-center"
          :on-click="logout"
          custom-style="ghost-black"
          :icon-shown="true"
          :no-margin="true"
          custom-icon="logout"
        />
      </div>
      <section class="flex md:block whitespace-nowrap overflow-scroll h-24 md:h-auto no-scrollbar">
        <router-link v-for="(page, index) in pages" :key="index" :to="page.link" class="pr-4 md:pr-0" @click="changeActivePage(index)">
          <p :class="`mt-8 text-lg w-auto ${page.active ? 'text-accent-yellow font-bold' : ''}`">
            {{ t(page.i18nTitle) }}
          </p>
        </router-link>
      </section>
    </div>
    <base-button class="hidden md:flex md:border-t-2 border-white" :text="t('profile.logout')" :on-click="logout" custom-style="ghost-black" :icon-shown="true" custom-icon="logout" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { UserStore } from '../stores/UserStore'
import { User } from 'coghent-vue-3-component-library'
import StoreFactory from '../stores/StoreFactory'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useSessionAuth } from '@/app'
import { BaseButton } from 'coghent-vue-3-component-library'

type MenuPage = {
  i18nTitle: string
  link: string
  active?: boolean
}

export default defineComponent({
  name: 'ProfileSideMenu',
  components: { BaseButton },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = StoreFactory.get(UserStore)
    const user: typeof User = userStore.user
    const pages = ref<MenuPage[]>([
      { i18nTitle: 'profile.details', link: '/profile' },
      { i18nTitle: 'profile.stories', link: '/mystories' },
      // { i18nTitle: 'profile.works', link: '/myworks' },
    ])
    const { t } = useI18n()

    const changeActivePage = (pageIndex: number) => {
      pages.value.forEach((page: MenuPage) => (page.active = false))
      pages.value[pageIndex].active = true
      console.log(pages)
    }

    watch(
      () => route.path,
      (path) => {
        const activePage: MenuPage | undefined = pages.value.find((page: MenuPage) => page.link == path)
        if (activePage) {
          const activePageIndex: number = pages.value.indexOf(activePage)
          pages.value[activePageIndex].active = true
        }
      },
      { immediate: true }
    )

    const logout = async () => {
      fetch('/api/logout')
        .then(async (response) => {
          userStore.setUser(null)
          useSessionAuth.resetAuthProperties()
          router.push('/')
        })
        .catch((error) => {
          router.push('/')
          console.log(`WEB | Couldn't logout`, { error })
        })
    }

    return {
      changeActivePage,
      pages,
      logout,
      user,
      t,
    }
  },
})
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.border-white {
  border-top-color: white;
}
</style>