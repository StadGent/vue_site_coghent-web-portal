import { ref } from 'vue'

const useSeed = () => {
  const generator = () => Math.random()

  const randomValue = ref<string>(generator().toString())

  const refresh = () => {
    randomValue.value = generator().toString()
  }

  return {
    randomValue,
    refresh,
  }
}

export default useSeed
