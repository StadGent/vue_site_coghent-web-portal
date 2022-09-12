<template>
  <div class="h-full pt-6 px-6 flex text-center flex-col items-center">
    <h1 class="flex flex-wrap font-bold text-4xl pb-4">{{ t('myWorks.upload.stepTwo.title') }}</h1>
    <div class="h-full w-full pb-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-4 overflow-y-scroll">
      <div
        v-for="option of options"
        :key="option.title"
        :class="[option.selected === true ? 'border-2 border-accent-purple' : '']"
        class="my-6 bg-text-white p-4 flex flex-col text-center shadow-md cursor-pointer"
        @click="() => option.selected !== true && setSelectedOption(option)"
      >
        <div class="h-full flex justify-center items-center">
          <div class="rounded-full w-20 h-20 z-10 flex justify-center items-center cursor-pointer" :class="[option.selected ? styleButton.selected : styleButton.notSelectedRing]">
            <div class="rounded-full bg-text-white w-16 h-16 flex justify-center items-center" :class="[option.selected ? styleButton.selected : styleButton.notSelected]">
              <div class="rounded-full w-14 h-14" :class="[option.selected ? styleButton.selected : styleButton.notSelected]"></div>
            </div>
          </div>
        </div>
        <div class="h-fit">
          <h2 class="font-bold text-lg mt-2">{{ option.title }}</h2>
          <p class="font-normal text-base mt-6">{{ option.info }}</p>
          <div class="flex flex-col mt-14">
            <div class="flex">
              <input v-show="option.selected" :id="option.title" v-model="disclaimerPart1CheckboxState" class="mx-2" type="checkbox" :name="option.title" />
              <label :for="option.title" class="font-normal text-sm italic cursor-pointer" v-html="option.disclaimer"></label>
            </div>
            <div class="flex">
              <input v-show="option.selected" :id="`${option.title}-option-2`" v-model="disclaimerPart2CheckboxState" class="mx-2" type="checkbox" :name="`${option.title}-option-2`" />
              <label :for="`${option.title}-option-2`" class="font-normal text-sm italic mt-2 cursor-pointer" v-html="option.disclaimerPart2"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useUpload } from 'coghent-vue-3-component-library'
import { Rights } from 'coghent-vue-3-component-library'
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const styleButton = {
  selected: `bg-accent-purple`,
  notSelected: `bg-text-white`,
  notSelectedRing: `bg-neutral-40 opacity-40 `,
}

type UploadOption = {
  selected: boolean
  title: string
  info: string
  disclaimer: string
  disclaimerPart2: string
  license: typeof Rights
}

export default defineComponent({
  name: 'UploadStepTwo',
  components: {},
  setup() {
    const { t } = useI18n()
    const options = ref<Array<UploadOption>>([])
    const { setCreator, rightIsSet, setAgreedToDisclaimer } = useUpload()
    const disclaimerPart1CheckboxState = ref<boolean>(false)
    const disclaimerPart2CheckboxState = ref<boolean>(false)
    const disclaimerCheckboxState = computed<boolean>(() => {
      if (disclaimerPart1CheckboxState.value && disclaimerPart2CheckboxState.value) {
        return true
      } else {
        return false
      }
    })

    const setOptions = () => {
      options.value.push({
        selected: rightIsSet(Rights.Cc0),
        title: `${t(`myWorks.upload.stepTwo.options.owner.title`)}`,
        info: `${t(`myWorks.upload.stepTwo.options.owner.info`)}`,
        disclaimer: `${t(`myWorks.upload.stepTwo.options.owner.disclaimer`)}`,
        disclaimerPart2: `${t(`myWorks.upload.stepTwo.options.disclaimerPart2`)}`,
        license: Rights.Cc0,
      } as UploadOption)
      options.value.push({
        selected: rightIsSet(Rights.Undetermined),
        title: `${t(`myWorks.upload.stepTwo.options.uploader.title`)}`,
        info: `${t(`myWorks.upload.stepTwo.options.uploader.info`)}`,
        disclaimer: `${t(`myWorks.upload.stepTwo.options.uploader.disclaimer`)}`,
        disclaimerPart2: `${t(`myWorks.upload.stepTwo.options.disclaimerPart2`)}`,
        license: Rights.Undetermined,
      } as UploadOption)
    }

    const setSelectedOption = (_option: UploadOption) => {
      for (const [index, option] of options.value.entries()) {
        _option.title === option.title ? (options.value[index].selected = true) : (options.value[index].selected = false)
      }
      if (disclaimerCheckboxState.value) {
        setCreator(_option.license)
      }
      disclaimerPart1CheckboxState.value = false
      disclaimerPart2CheckboxState.value = false
    }

    watch(
      () => disclaimerCheckboxState.value,
      () => {
        setAgreedToDisclaimer(disclaimerCheckboxState.value)
      },
      { immediate: true }
    )

    setOptions()

    return {
      t,
      setSelectedOption,
      options,
      styleButton,
      disclaimerPart1CheckboxState,
      disclaimerPart2CheckboxState,
    }
  },
})
</script>
