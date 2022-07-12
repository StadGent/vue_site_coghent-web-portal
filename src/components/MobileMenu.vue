<template>
  <div v-show="menuIsVisible" class="z-50 fixed top-0 left-0 flex flex-row min-h-screen w-screen">
    <div class="w-9/12 flex flex-col w-full">
      <div class="flex flex-row items-center px-6 py-4 border-b-2 border-background-dark border-opacity-70 bg-background-light h-1/6">
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
        <h1 class="ml-4">{{ t('title') }}</h1>
      </div>
      <div class="flex justify-between flex-col h-full bg-background-medium pl-6">
        <ul>
          <li class="flex items-center justify-left border-b-2 border-background-light h-16" v-for="menuItem of menuItems" :key="menuItem.id" @click="() => openMenuItem(menuItem)">
            {{ menuItem.title }}
          </li>
        </ul>
        <ul class="border-t-2 border-background-light flex object-bottom">
          <li class="flex items-center justify-left h-16" v-for="menuItem of menuItemsBottom" :key="menuItem.id" @click="() => openMenuItem(menuItem)">
            {{ menuItem.title }}
          </li>
        </ul>
      </div>
    </div>
    <div class="w-3/12 opacity-60 bg-background-medium" @click="closeMenu"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useMenu, { MenuItem } from '@/composables/useMenu'
import { router } from '@/app'
import StoreFactory from '@/stores/StoreFactory'
import { UserStore } from '@/stores/UserStore'

export default defineComponent({
  name: 'SideMenu',
  setup(props, { emit }) {
    const { t } = useI18n()
    const menuIsVisible = ref<boolean>(true)
    const menu = useMenu()
    const userStore = StoreFactory.get(UserStore)
    const menuItems = ref<Array<MenuItem>>([])
    const menuItemsBottom = ref<Array<MenuItem>>([])
    document.body.classList.add('overflow-y-hidden')

    const closeMenu = () => {
      document.body.classList.remove('overflow-y-hidden')
      emit(`isOpen`, false)
      menuIsVisible.value = false
    }

    const openMenuItem = (_menutItem: MenuItem) => {
      if (_menutItem.localLink === true) {
        closeMenu()
        router.push(_menutItem.link)
      } else {
        closeMenu()
        window.location.href = _menutItem.link
      }
    }

    const filterItemsOnAuth = (_menutItems: Array<MenuItem>) => {
      let filtered = _menutItems
      if (userStore.hasUser === false) {
        filtered = []
        for (const item of _menutItems) {
          item.requireAuth === false ? filtered.push(item) : null
        }
      }
      return filtered
    }

    watch(menuIsVisible, (isOpen: boolean) => {
      if (isOpen === true) {
        menuItems.value = filterItemsOnAuth(menu.mobileItems)
        menuItemsBottom.value = filterItemsOnAuth(menu.bottomMobileItems)
      }
    })

    onMounted(() => {
      menuItems.value = filterItemsOnAuth(menu.mobileItems)
      menuItemsBottom.value = filterItemsOnAuth(menu.bottomMobileItems)
    })

    return {
      t,
      menuIsVisible,
      closeMenu,
      openMenuItem,
      filterItemsOnAuth,
      menuItems,
      menuItemsBottom,
    }
  },
})
</script>