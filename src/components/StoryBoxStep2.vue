<template>
  <div>
    <h2 class="w-full flex justify-center text-lg my-2 font-normal">{{ t('storybox.step2.title') }}</h2>
    <div class="flex flex-col flex-grow items-center justify-center">
      <div class="my-4 mt-32 w-4/6">
        <p class="mb-2">{{ t('storybox.step2.storyTitle') }}</p>
        <input class="bg-background-medium h-10 w-full p-2" type="text" :value="storyTitle" @change="updateStoryTitle" />
        <!-- <base-input :ref="storyTitle" :model-value="storyTitle" /> -->
      </div>
      <div v-if="false" class="my-4 mt-16 w-4/6">
        <p>{{ t('storybox.step2.storyLanguage') }}</p>
        <div class="flex flex-row flex-wrap my-6">
          <button
            v-for="lang of languages"
            :key="lang"
            class="py-2 px-4 text-lg mr-4 border-2 border-solid"
            :class="lang === language ? `border-background-medium bg-background-dark` : 'border-background-medium'"
            @click="updateLanguage(lang)"
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
import { Language } from '@/pages/TheStoryboxPage.vue'

export default defineComponent({
  components: {},
  props: {
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
    const languages = Object.values(Language)

    const updateStoryTitle = (event: any) => {
      const title = event.target.value
      console.log(`Updated storyTitle:`, title)
      emit(`storyTitle`, title)
    }

    const updateLanguage = (_language: string) => {
      console.log(`Updated language:`, _language)
      emit(`language`, _language)
    }

    return {
      t,
      languages,
      updateStoryTitle,
      updateLanguage,
    }
  },
})
</script>
