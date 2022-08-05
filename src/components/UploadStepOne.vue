<template>
  <div class="h-full p-8 flex text-center flex-col">
    <h1 class="flex flex-wrap font-bold text-4xl">{{ t('myWorks.upload.stepOne.title') }}</h1>
    <div ref="dropzoneContainer" class="h-full m-8 bg-text-white border-2 border-black border-dashed flex justify-center items-center" @click="(event) => openFileExplorer(event)">
      <div v-if="addedFiles === 0" class="grid grid-cols-1 grid-rows-3">
        <h2 class="invisible sm:visible font-normal text-2xl mb-4">{{ t(`myWorks.upload.stepOne.sleep`) }}</h2>
        <div class="visble sm:invisible w-full flex justify-center items-center">
          <BaseIcon icon="upload" class="stroke-current p-4 cursor-pointer" />
        </div>
        <base-button
          :text="t('myWorks.upload.stepOne.uploadFromComputer')"
          custom-style="ghost-purple"
          :icon-shown="true"
          custom-icon="upload"
          class="invisible sm:visible px-2 mx-3 ml-3 justify-center"
        />
      </div>
    </div>
  </div>

  <div class="hidden">
    <div ref="dropzonePreviewContainer" class="dz-preview dz-file-preview w-40 mi-h-28 flex flex-col justify-center items-center hover:bg-blue-default10 p-3 rounded relative">
      <a data-dz-remove class="cursor-pointer absolute flex justify-center items-center top-2 right-2 bg-red-default rounded-full w-6 h-6 shadow hover:shadow-xl">
        <BaseIcon icon="close" class="stroke-current p-1 cursor-pointer" />
      </a>
      <BaseIcon icon="file" class="stroke-current p-1" />
      <div class="dz-filename text-blue font-body text-sm mt-3 w-full">
        <span class="inline-block w-full text-center break-words" data-dz-name></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { BaseButton, BaseIcon } from 'coghent-vue-3-component-library'
import Dropzone from 'dropzone'
import StoreFactory from '@/stores/StoreFactory'
import { ConfigStore } from '@/stores/ConfigStore'
import { uploadState, useUpload } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'UploadStepOne',
  components: {
    BaseButton,
    BaseIcon,
  },
  emits: ['stepDone'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const dropzoneContainer = ref<HTMLElement | null>(null)
    const dropzonePreviewContainer = ref<HTMLElement | null>(null)
    const addedFiles = ref<number>(0)
    const filesUploaded = ref<boolean>(false)
    const configStore = StoreFactory.get(ConfigStore)
    const dropzone = ref<Dropzone | null>(null)
    const MAX_FILES = 1
    const { setBase64Image, setFile } = useUpload()

    const createDropzone = () => {
      if (dropzoneContainer.value != null) {
        let acceptedFiles = `.png, .tif, .jpg`
        configStore.config.value.acceptedUploadFiles ? (acceptedFiles = configStore.config.value.acceptedUploadFiles) : null
        dropzone.value === null
          ? (dropzone.value = new Dropzone(dropzoneContainer.value, {
              url: 'upload/dropzone',
              autoProcessQueue: true,
              acceptedFiles: acceptedFiles,
              previewTemplate: dropzonePreviewContainer.value?.outerHTML,
              uploadMultiple: false,
              parallelUploads: 2,
              maxFiles: MAX_FILES,
            }))
          : null

        dropzone.value.on(`removedfile`, (val) => {
          addedFiles.value = dropzone.value!.files.length
        })

        dropzone.value.on(`complete`, (val) => {
          for (const file of dropzone.value!.files) {
            file.accepted === false ? dropzone.value!.removeFile(file) : null
          }
          addedFiles.value = dropzone.value!.files.length
          addedFiles.value === MAX_FILES ? (filesUploaded.value = true) : null
        })
      }
    }

    watch(addedFiles, (files) => {
      if (files === MAX_FILES) {
        dropzone.value?.disable()
        setFile(dropzone.value!.files[0])
        setBase64Image(uploadState.file.dataURL ? uploadState.file.dataURL : null)
        emit(`stepDone`, files === MAX_FILES)
      } else {
        dropzone.value?.enable()
        emit(`stepDone`, files === MAX_FILES)
      }
    })

    const openFileExplorer = (event: any) => {
      if (dropzoneContainer.value != null && addedFiles.value < MAX_FILES) {
        dropzoneContainer.value.click()
      }
    }

    const init = () => {
      createDropzone()
    }

    onMounted(() => {
      init()
    })

    init()

    return {
      t,
      dropzoneContainer,
      dropzonePreviewContainer,
      addedFiles,
      openFileExplorer,
      filesUploaded,
    }
  },
})
</script>
