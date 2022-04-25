import { GetActiveBoxDocument } from 'coghent-vue-3-component-library'
import { useQuery } from '@vue/apollo-composable'
import { ref, watch } from 'vue'

const activeBox = ref<any[]>([])

export const useActiveBox = () => {
  const getActiveBox = async () => {
    if (!activeBox.value.length) {
      const { fetchMore } = useQuery(GetActiveBoxDocument)
      const res = await fetchMore({})
      if (res?.data.ActiveBox.results) {
        activeBox.value = res?.data?.ActiveBox?.results
        return activeBox.value
      }
    } else {
      return activeBox.value
    }
  }

  return {
    getActiveBox,
    activeBox,
  }
}
