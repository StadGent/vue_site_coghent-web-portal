<template>
  <section class="w-1/2">
    <div v-if="hasBoxCode" class="flex flex-col py-2">
      <label class="font-bold mb-2" for="storyCode">{{ t('profile.storybox.create.code') }}</label
      ><input v-model="storyCode" type="text" id="storyCode" maxlength="8" minlength="8" required />
      <p v-if="codeInputError" class="text-text-red text-xs h-4">{{ codeInputError }}</p>
    </div>
    <div class="flex flex-col py-2">
      <label class="font-bold mb-2" for="storyName">{{ t('profile.storybox.create.name') }}</label
      ><input v-model="storyName" type="text" id="storyName" required />
      <p v-if="nameInputError" class="text-text-red text-xs h-4">{{ nameInputError }}</p>
    </div>
    <div class="flex flex-col py-2">
      <label class="font-bold mb-2" for="storyDescription">{{ t('profile.storybox.create.description') }}</label
      ><textarea v-model="storyDescription" class="h-24" type="text" id="storyDescripton" />
    </div>
    <div class="w-full flex justify-end mt-4"><BaseButton :onClick="checkValues" class="max-w-max" :text="t('profile.storybox.create.submit')" /></div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
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
    const codeInputError = ref<string | undefined>(undefined)
    const nameInputError = ref<string | undefined>(undefined)

    const filterInt = (value: string) => {
      if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value)
      } else {
        return NaN
      }
    }

    const checkValues = () => {
      codeInputError.value = undefined
      nameInputError.value = undefined

      if (storyCode.value?.length == 8 && hasBoxCode) {
        if (isNaN(filterInt(storyCode.value))) {
          codeInputError.value = 'Gelieve enkel nummers in te voeren'
        }
      } else {
        codeInputError.value = 'Code moet 8 karakters bevatten'
      }
      if (storyName.value && storyName.value.length < 5) {
        nameInputError.value = 'Naam moet minimum 5 karakters bevatten'
      }
    }

    watch(
      () => [storyName.value, storyCode.value],
      () => {
        checkValues()
      }
    )

    return {
      storyCode,
      storyName,
      storyDescription,
      route,
      t,
      hasBoxCode,
      checkValues,
      nameInputError,
      codeInputError,
    }
  },
})
</script>
