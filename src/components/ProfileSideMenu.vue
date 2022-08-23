<template>
  <div class="md:bg-background-medium max-h-screen flex p-8 flex-col w-full md:w-2/6 page-height break-all">
    <div class="flex flex-col justify-between pb-4">
      <div class="flex justify-between items-end flex-col-reverse lg:flex-col">
        <h2 v-if="user != null" class="mt-5 font-bold text-4xl">{{ t(`profile.greeting`) }}<br />{{ user.name }}!</h2>
        <base-button
          class="md:hidden block w-8 h-8 bg-neutral-0 rounded-full flex justify-center"
          :on-click="logout"
          custom-style="ghost-black"
          :icon-shown="true"
          :no-margin="true"
          custom-icon="logout"
        />
      </div>
      <section class="flex md:block whitespace-nowrap overflow-scroll h-24 md:h-auto no-scrollbar h-full">
        <router-link v-for="(page, index) in pages" :key="index" :to="page.link" class="pr-4 md:pr-0" @click="changeActivePage(index)">
          <p :class="`mt-8 text-lg w-auto ${page.linkIsActive ? 'text-accent-yellow font-bold' : ''}`">
            {{ page.title }}
          </p>
        </router-link>
      </section>
    </div>
    <div class="flex flex-grow"></div>
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
import useMenu, { MenuItem } from '@/composables/useMenu'

export default defineComponent({
  name: 'ProfileSideMenu',
  components: { BaseButton },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = StoreFactory.get(UserStore)
    const user: typeof User = userStore.user
    const { profileSideMenuItems } = useMenu()
    const pages = ref<Array<MenuItem>>(profileSideMenuItems.filter((_item) => _item.isVisible === true))

    const { t } = useI18n()

    const changeActivePage = (pageIndex: number) => {
      pages.value.forEach((page: MenuItem) => (page.linkIsActive = false))
      pages.value[pageIndex].linkIsActive = true
    }

    watch(
      () => route.path,
      (path) => {
        const activePage: MenuItem | undefined = pages.value.find((page: MenuItem) => page.link == path)
        if (activePage) {
          const activePageIndex: number = pages.value.indexOf(activePage)
          pages.value[activePageIndex].linkIsActive = true
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

.page-height {
  min-height: auto;
}

@media only screen and (min-width: 768px) {
  .page-height {
    min-height: 70vh;
  }
}
</style>
