<template>
  <section class="w-1/2">
    <div v-if="hasBoxCode" class="flex flex-col py-2">
      <label class="font-bold mb-2" for="storyCode">{{ t('profile.storybox.create.code') }}</label
      ><input id="storyCode" v-model="storyCode" type="text" maxlength="8" minlength="8" required />
      <p v-if="codeInputError" class="text-text-red text-xs h-4">{{ codeInputError }}</p>
    </div>
    <div class="flex flex-col py-2">
      <label class="font-bold mb-2" for="storyName">{{ t('profile.storybox.create.name') }}</label
      ><input id="storyName" v-model="storyName" type="text" required />
      <p v-if="nameInputError" class="text-text-red text-xs h-4">{{ nameInputError }}</p>
    </div>
    <div class="flex flex-col py-2">
      <label class="font-bold mb-2" for="storyDescription">{{ t('profile.storybox.create.description') }}</label
      ><textarea id="storyDescripton" v-model="storyDescription" class="h-24" type="text" />
    </div>
    <div class="w-full flex justify-end mt-4">
      <BaseButton :customStyle="!formValid ? 'primaryUnavailable' : 'primary'" :on-click="save" class="max-w-max" :text="t('profile.storybox.create.submit')" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useStorybox } from 'coghent-vue-3-component-library'
import { apolloClient, router } from '@/app'
import { StoryboxBuild, StoryBoxState, storyboxDataIsUpdated } from 'coghent-vue-3-component-library'

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
    const formValid = ref<boolean>(false)

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

      return !codeInputError.value && !nameInputError.value ? true : false
    }

    const save = async () => {
      formValid.value = checkValues()
      if (formValid.value) {
        StoryBoxState.value.activeStorybox = {
          frameId: null,
          title: storyName.value,
          description: storyDescription.value,
        } as typeof StoryboxBuild
        if (hasBoxCode.value === true) {
          const newFrame = await useStorybox(apolloClient).linkBoxCodeToUser(String(storyCode.value))
          if (newFrame.errors) {
            codeInputError.value = 'Code bestaat niet'
          }
          StoryBoxState.value.activeStorybox.frameId = newFrame.id
        }
        router.push(`/mystories`)
        await useStorybox(apolloClient).createNew()
        storyboxDataIsUpdated.value = true
      }
    }

    watch(
      () => [storyName.value, storyCode.value],
      () => {
        formValid.value = checkValues()
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
      save,
      formValid,
    }
  },
})
</script>