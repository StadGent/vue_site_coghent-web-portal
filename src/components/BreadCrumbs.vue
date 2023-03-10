<template>
  <div class="flex">
    <section class="flex items-center bg-background-medium w-min">
      <div @click="goToHomePage"><base-icon icon="home" class="p-2 purple cursor-pointer align-center" /></div>
      <div @click="navigateToHistoryPage('backward')"><base-icon icon="arrowLeft" :class="currentPageIndex - 1 != -1 ? 'p-2 purple cursor-pointer' : 'p-2 gray cursor-not-allowed blur-lg'" /></div>
      <div @click="navigateToHistoryPage('forward')">
        <base-icon icon="arrowRight" :class="currentPageIndex < history.length - 1 ? 'p-2 purple cursor-pointer' : 'p-2 gray cursor-not-allowed'" />
      </div>
    </section>
    <section class="flex">
      <div v-if="history.length >= 10" class="flex items-center">
        <h4 class="p-2 text-text-black">...</h4>
      </div>
      <div v-for="(page, index) in history.slice(currentPageIndex - 10)" :key="index" class="flex items-center cursor-pointer">
        <base-icon icon="arrowRightLine" class="p-2 black" />
        <h4 :class="page.active ? 'text-text-black' : 'text-accent-purple'" @click="navigateToPageByUrl(page)">{{ page.name }}</h4>
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
const currentPageIndex = ref<number>()

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
      currentPageIndex.value = history.value.indexOf(existsInHistory)
    } else {
      setAllPagesInactive()
      const page = { name: pageName, url, active: true }
      history.value.push(page)
      currentPage.value = page
      currentPageIndex.value = history.value.indexOf(page)
    }
  }

  const navigateToHistoryPage = (action: string) => {
    if (currentPage.value && history.value.length > 1) {
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
    currentPageIndex.value = undefined
  }

  return { addPageToHistory, navigateToHistoryPage, navigateToPageByUrl, clearHistory, history, currentPage, currentPageIndex }
}

export default defineComponent({
  name: 'BreadCrumbs',
  components: {
    BaseIcon,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { history, currentPage, currentPageIndex, navigateToHistoryPage, navigateToPageByUrl } = useHistory()

    const goToHomePage = () => {
      router.push({ path: '/', query: route.query })
    }

    return {
      history,
      currentPage,
      currentPageIndex,
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
.gray {
  stroke: gray;
}
</style>
