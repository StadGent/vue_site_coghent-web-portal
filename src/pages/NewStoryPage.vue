<template>
  <section class="w-full md:w-3/5 p-8 md:p-0">
    <div v-if="hasBoxCode" class="flex flex-col py-2">
      <input-label :label="t('profile.storybox.create.code')" labelFor="storyCode" :inputIsRequired="true" />
      <input id="storyCode" v-model="storyCode" type="text" maxlength="8" minlength="8" required />
      <p v-if="codeInputError" class="text-text-red text-xs h-4">{{ codeInputError }}</p>
      <BoxVisitCode class="mt-8" :code="storyCode" />
    </div>
    <div v-if="!hasBoxCode" class="flex flex-col py-2">
      <input-label :label="t('profile.storybox.create.name')" labelFor="storyName" :inputIsRequired="true" />
      <input id="storyName" v-model="storyName" type="text" required />
      <p v-if="nameInputError" class="text-text-red text-xs h-4">{{ nameInputError }}</p>
    </div>
    <div v-if="!hasBoxCode" class="flex flex-col py-2">
      <input-label :label="t('profile.storybox.create.description')" labelFor="storyDescriptio" :inputIsRequired="false" />
      <textarea id="storyDescripton" v-model="storyDescription" class="h-24" type="text" />
    </div>
    <div class="w-full flex justify-end mt-4">
      <BaseButton :custom-style="!formValid ? 'primaryUnavailable' : 'primary'" :on-click="save" class="max-w-max" :text="t('profile.storybox.create.submit')" />
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
import { StoryboxBuild, StoryBoxState, BoxVisitCode, useStoryBox } from 'coghent-vue-3-component-library'
import InputLabel from '../components/InputLabel.vue'

export default defineComponent({
  name: 'NewStoryPage',
  components: { BaseButton, BoxVisitCode, InputLabel },
  props: {},
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const hasBoxCode = ref<boolean>(route.fullPath.includes('code'))
    const storyName = ref<string>()
    const storyDescription = ref<string>()
    const storyCode = ref<string>('')
    const codeInputError = ref<string | undefined>(undefined)
    const nameInputError = ref<string | undefined>(undefined)
    const formValid = ref<boolean>(false)
    const { addStoryboxes } = useStorybox()

    const filterInt = (value: string) => {
      if (/^[-+]?(\d+|Infinity)$/.test(value)) {
        return Number(value)
      } else {
        return NaN
      }
    }

    const checkValues = async () => {
      codeInputError.value = undefined
      nameInputError.value = undefined

      if (storyCode.value?.length == 8 && hasBoxCode.value) {
        if (isNaN(filterInt(storyCode.value))) {
          codeInputError.value = t('storybox.new.onlyNumbers')
        }
      } else if (hasBoxCode.value) {
        codeInputError.value = t('storybox.new.codeLength')
      }
      if (storyName.value && storyName.value.length && storyName.value.length < 5) {
        nameInputError.value = t('storybox.new.nameLength')
      }

      return !codeInputError.value && hasBoxCode.value ? true : !nameInputError.value && !hasBoxCode.value ? true : false
    }

    const save = async () => {
      formValid.value = await checkValues()
      if (formValid.value) {
        if (hasBoxCode.value === true) {
          const newFrame = useStorybox(apolloClient).linkBoxCodeToUser(String(storyCode.value))
          newFrame
            .then(() => {
              router.push('/mijnverhalen')
            })
            .catch((err: Error) => {
              codeInputError.value = t('storybox.new.linkedCode')
            })
        } else {
          StoryBoxState.value.activeStorybox = {
            frameId: null,
            title: storyName.value,
            description: storyDescription.value,
          } as typeof StoryboxBuild
          await useStorybox(apolloClient).createNew()
          router.push(`/mijnverhalen`)
        }
      }
    }

    watch(
      () => [storyName.value, storyCode.value],
      async () => {
        formValid.value = await checkValues()
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
