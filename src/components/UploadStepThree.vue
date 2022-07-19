<template>
  <div class="m-8 h-full flex text-center items-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepThree.title') }}</h1>
    <div class="w-full h-full grid grid-cols-2 gap-4 py-8">
      <div class="bg-text-white py-4 px-8 flex flex-col text-left">
        <h2 class="font-bold text-lg mb-4">{{ t('myWorks.upload.stepThree.metadata.title') }}</h2>
        <span class="pr-4 overflow-y-auto">
          <div class="flex flex-col my-4" v-for="question of questions" :key="question.text">
            <label class="block text-base font-normal mb-2" :for="question.text"> {{ question.text }} </label>
            <input
              :v-modal="question.answer"
              :id="question.text"
              class="bg-background-light appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
            />
          </div>
        </span>
      </div>
      <div class="bg-text-white py-4 px-8 flex flex-col text-left">
        <h2 class="font-bold text-lg">{{ t('myWorks.upload.stepThree.relation.title') }}</h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type Question = {
  text: string
  answer: string | null
}

export default defineComponent({
  components: {},
  setup() {
    const { t } = useI18n()
    const questions = ref<Array<Question>>([])

    const setQuestions = () => {
      for (let index = 1; index <= 4; index++) {
        questions.value.push({
          text: t(`myWorks.upload.stepThree.metadata.q${index}`),
          answer: null,
        })
      }
      console.log(`questions SET`, questions.value)
    }

    const init = () => {
      setQuestions()
    }

    init()

    return {
      t,
      questions,
    }
  },
})
</script>
