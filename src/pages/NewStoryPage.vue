<template>
  <section class="w-1/2">
    <div v-if="hasBoxCode" class="flex flex-col py-2">
      <label class="font-bold mb-2" for="storyCode">{{ t('profile.storybox.create.code') }}</label
      ><input v-model="storyCode" type="text" id="storyCode" maxlength="8" minlength="8" required />
      <p class="text-text-red text-xs" id="code-error-container"></p>
    </div>
    <div class="flex flex-col py-2">
      <label class="font-bold mb-2" for="storyName">{{ t('profile.storybox.create.name') }}</label
      ><input v-model="storyName" type="text" id="storyName" required />
      <p class="text-text-red text-xs" id="name-error-container"></p>
    </div>
    <div class="flex flex-col py-2">
      <label class="font-bold mb-2" for="storyDescription">{{ t('profile.storybox.create.description') }}</label
      ><textarea v-model="storyDescription" class="h-24" type="text" id="storyDescripton" />
    </div>
    <div class="w-full flex justify-end mt-4"><BaseButton :onClick="checkValues" class="max-w-max" :text="t('profile.storybox.create.submit')" /></div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BaseButton } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'NewStoryPage',
  components: { BaseButton },
  props: {},
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const hasBoxCode = ref<boolean>(route.fullPath.includes('code'))
    const storyName = ref<string>()
    const storyDescription = ref<string>()
    const storyCode = ref<string | undefined>()

    const filterInt = (value: string) => {
      if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value)
      } else {
        return NaN
      }
    }

    const checkValues = () => {
      let codeInputError: string | undefined = undefined
      let nameInputError: string | undefined = undefined
      const codeContainer: HTMLElement | null = document.getElementById('code-error-container')
      const nameContainer: HTMLElement | null = document.getElementById('name-error-container')

      if (storyCode.value?.length == 8 && hasBoxCode) {
        if (!isNaN(filterInt(storyCode.value))) {
          console.log('Valid')
        } else {
          console.warn('Please only insert numbers')
          codeInputError = 'Gelieve enkel nummers in te voeren'
        }
      } else {
        console.warn('Storycode too short')
        codeInputError = 'Code te kort'
      }
      if (storyName.value && storyName.value.length < 5) {
        nameInputError = 'Naam moet minimum 5 karakters bevatten'
      }
      if (codeInputError && codeContainer) {
        codeContainer.innerHTML = codeInputError
      }
      if (nameContainer && nameInputError) {
        nameContainer.innerHTML = nameInputError
      }
    }

    return {
      storyCode,
      storyName,
      storyDescription,
      route,
      t,
      hasBoxCode,
      checkValues,
    }
  },
})
</script>
