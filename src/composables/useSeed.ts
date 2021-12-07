import { ref } from 'vue'

const useSeed = () => {
  const generator = () => Math.random()

  const randomValue = ref<number>(generator())

  const refresh = () => {
    randomValue.value = generator()
  }

  return {
    randomValue,
    refresh,
  }
}

export default useSeed
