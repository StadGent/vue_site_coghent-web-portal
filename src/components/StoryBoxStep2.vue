<template>
  <div>
    <h2 class="w-full flex justify-center text-lg my-2 font-normal">{{ t('storybox.step2.title') }}</h2>
    <div class="flex flex-col flex-grow items-center justify-center">
      <div class="my-4 mt-32 w-4/6">
        <p class="mb-2">{{ t('storybox.step2.storyTitle') }}</p>
        <input class="bg-background-medium h-10 w-full p-2" type="text" @change="updateStoryTitle" :value="storyTitle" />
        <!-- <base-input :ref="storyTitle" :model-value="storyTitle" /> -->
      </div>
      <div v-if="false" class="my-4 mt-16 w-4/6">
        <p>{{ t('storybox.step2.storyLanguage') }}</p>
        <div class="flex flex-row flex-wrap my-6">
          <button
            v-for="lang of languages"
            :key="lang"
            @click="updateLanguage(lang)"
            class="py-2 px-4 text-lg mr-4 border-2 border-solid"
            :class="lang === language ? `border-background-medium bg-background-dark` : 'border-background-medium'"
          >
            {{ lang }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BaseButton, BaseInput } from 'coghent-vue-3-component-library'
import { Language } from '@/pages/TheStoryboxPage.vue'

export default defineComponent({
  components: { BaseButton, BaseInput },
  props: {
    closeWindow: {
      type: String,
      required: true,
    },
    storyTitle: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  emits: ['closeWindow', 'storyTitle', 'language'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const storyTitle = ref<string | null>(null)
    const languages = Object.values(Language)

    const closeWindow = () => {
      emit('closeWindow', 'hide')
      console.log('HIDE!')
    }

    const updateStoryTitle = (event: any) => {
      const storyTitle = event.target.value
      console.log(`Updated storyTitle:`, storyTitle)
      emit(`storyTitle`, storyTitle)
    }

    const updateLanguage = (_language: string) => {
      console.log(`Updated language:`, _language)
      emit(`language`, _language)
    }

    return {
      t,
      storyTitle,
      languages,
      closeWindow,
      updateStoryTitle,
      updateLanguage,
    }
  },
})
</script>