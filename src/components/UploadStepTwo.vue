<template>
  <div class="h-full pt-6 px-6 flex text-center flex-col items-center">
    <h1 class="flex flex-wrap font-bold text-4xl pb-4">{{ t('myWorks.upload.stepTwo.title') }}</h1>
    <div class="h-full w-full pb-4 grid grid-cols-1 lg:grid-cols-2  lg:gap-4 overflow-y-scroll">
      <div
        v-for="option of options"
        :key="option.title"
        :class="[option.selected === true ? 'border-2 border-accent-purple' : '']"
        class="my-6 bg-text-white p-4 flex flex-col text-center shadow-md	"
        @click="setSelectedOption(option)"
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
          <p class="font-normal text-sm italic mt-14">{{ option.disclaimer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useUpload } from 'coghent-vue-3-component-library'
import { Rights } from 'coghent-vue-3-component-library'
import { defineComponent, ref } from 'vue'
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
  license: typeof Rights
}

export default defineComponent({
  name: 'UploadStepTwo',
  components: {},
  setup() {
    const { t } = useI18n()
    const options = ref<Array<UploadOption>>([])
    const { setCreator, rightIsSet } = useUpload()

    const setOptions = () => {
      options.value.push({
        selected: rightIsSet(Rights.Cc0),
        title: `${t(`myWorks.upload.stepTwo.options.owner.title`)}`,
        info: `${t(`myWorks.upload.stepTwo.options.owner.info`)}`,
        disclaimer: `${t(`myWorks.upload.stepTwo.options.owner.disclaimer`)}`,
        license: Rights.Cc0,
      } as UploadOption)
      options.value.push({
        selected: rightIsSet(Rights.Undetermined),
        title: `${t(`myWorks.upload.stepTwo.options.uploader.title`)}`,
        info: `${t(`myWorks.upload.stepTwo.options.uploader.info`)}`,
        disclaimer: `${t(`myWorks.upload.stepTwo.options.uploader.disclaimer`)}`,
        license: Rights.Undetermined,
      } as UploadOption)
    }

    const setSelectedOption = (_option: UploadOption) => {
      for (const [index, option] of options.value.entries()) {
        _option.title === option.title ? (options.value[index].selected = true) : (options.value[index].selected = false)
      }
      setCreator(_option.license)
    }

    setOptions()

    return {
      t,
      setSelectedOption,
      options,
      styleButton,
    }
  },
})
</script>
