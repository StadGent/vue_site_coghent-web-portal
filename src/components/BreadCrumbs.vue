<template>
  <div class="flex">
    <section class="flex items-center bg-background-medium w-min">
      <div @click="goToHomePage"><base-icon icon="home" class="p-2 purple cursor-pointer align-center" /></div>
      <div @click="navigateToHistoryPage('backward')"><base-icon icon="arrowLeft" class="p-2 purple cursor-pointer" /></div>
      <div @click="navigateToHistoryPage('forward')"><base-icon icon="arrowRight" class="p-2 purple cursor-pointer" /></div>
    </section>
    <section class="flex">
      <div v-if="history.length >= 10" class="flex items-center">
        <h4 class="p-2 text-text-black">...</h4>
      </div>
      <div v-for="(page, index) in history.slice(-10)" :key="index" class="flex items-center cursor-pointer">
        <base-icon icon="arrowRightLine" class="p-2 black" />
        <h4 @click="navigateToPageByUrl(page)" :class="page.active ? 'text-text-black' : 'text-accent-purple'">{{ page.name }}</h4>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { BaseIcon } from 'coghent-vue-3-component-library'

export type HistoryPage = {
  name: string
  url: string
  active: boolean
}

const history = ref<HistoryPage[]>([])
const currentPage = ref<HistoryPage>()

export const useHistory = () => {
  const router = useRouter()
  const route = useRoute()

  const setAllPagesInactive = () => {
    history.value.forEach((historyPage: HistoryPage) => {
      historyPage.active = false
    })
  }

  const addPageToHistory = (pageName: string, url: string) => {
    const existsInHistory = history.value.find((historyPage: HistoryPage) => historyPage.url == url)
    if (existsInHistory) {
      setAllPagesInactive()
      existsInHistory.active = true
      currentPage.value = existsInHistory
    } else {
      setAllPagesInactive()
      const page = { name: pageName, url, active: true }
      history.value.push(page)
      currentPage.value = page
    }
  }

  const navigateToHistoryPage = (action: string) => {
    if (currentPage.value) {
      const pageIndex: number = history.value.indexOf(currentPage.value)
      router.push({ path: history.value[action == 'forward' ? pageIndex + 1 : pageIndex - 1].url, query: route.query })
    }
  }

  const navigateToPageByUrl = (page: HistoryPage) => {
    router.push({ path: page.url, query: route.query })
  }

  const clearHistory = () => {
    history.value = []
    currentPage.value = undefined
  }

  return { addPageToHistory, navigateToHistoryPage, navigateToPageByUrl, clearHistory, history }
}

export default defineComponent({
  name: 'BreadCrumbs',
  components: {
    BaseIcon,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { history, navigateToHistoryPage, navigateToPageByUrl } = useHistory()

    const goToHomePage = () => {
      router.push({ path: '/', query: route.query })
    }

    return {
      history,
      goToHomePage,
      navigateToHistoryPage,
      navigateToPageByUrl,
    }
  },
})
</script>

<style scoped>
.purple {
  stroke: #b65099;
}
.black {
  stroke: black;
}
</style>
