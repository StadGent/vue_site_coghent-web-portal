<template>
  <div class="h-full p-8 flex text-center flex-col">
    <h1 class="font-bold text-4xl">{{ t('myWorks.upload.stepOne.title') }}</h1>
    <div ref="dropzoneContainer" class="h-full m-8 bg-text-white border-2 border-black border-dashed flex justify-center items-center" @click="(event) => openFileExplorer(event)">
      <div v-if="isLoading === true" class="z-20 flex justify-center items-center ml-3 w-full absolute"><CircleLoader /></div>
      <div v-if="addedFiles === 0 && isLoading === false" class="grid grid-cols-1 grid-rows-3">
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
import { BaseButton, BaseIcon, CircleLoader } from 'coghent-vue-3-component-library'
import Dropzone from 'dropzone'
import StoreFactory from '@/stores/StoreFactory'
import { ConfigStore } from '@/stores/ConfigStore'
import { uploadState, useUpload } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'UploadStepOne',
  components: {
    BaseButton,
    BaseIcon,
    CircleLoader,
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
    const MAX_FILES = ref<number>(1)
    const MAX_FILE_SIZE = ref<number>(200000000)
    const ACCEPTED_FILE_EXTENSIONS = ref<string>(`.png, .tif, .jpg`)
    const isLoading = ref<boolean>(true)

    const { setBase64Image, setFile } = useUpload()

    const createDropzone = () => {
      if (dropzoneContainer.value != null) {
        dropzone.value === null
          ? (dropzone.value = new Dropzone(dropzoneContainer.value, {
              url: 'upload/dropzone',
              autoProcessQueue: true,
              acceptedFiles: ACCEPTED_FILE_EXTENSIONS.value,
              previewTemplate: dropzonePreviewContainer.value?.outerHTML,
              uploadMultiple: false,
              parallelUploads: 2,
              maxFiles: MAX_FILES.value,
              maxFilesize: MAX_FILE_SIZE.value,
            }))
          : null
        isLoading.value = false
        dropzone.value.on(`removedfile`, (val) => {
          addedFiles.value = dropzone.value!.files.length
        })
        dropzone.value.on(`processing`, (val) => {
          isLoading.value = true
        })
        dropzone.value.on(`complete`, (val) => {
          for (const file of dropzone.value!.files) {
            file.accepted === false ? dropzone.value!.removeFile(file) : null
            file.size > MAX_FILE_SIZE.value ? dropzone.value!.removeFile(file) : null
          }
          addedFiles.value = dropzone.value!.files.length
          addedFiles.value === MAX_FILES.value ? (filesUploaded.value = true) : null
          isLoading.value = false
        })
      }
    }

    watch(addedFiles, (files) => {
      if (files === MAX_FILES.value) {
        dropzone.value?.disable()
        setFile(dropzone.value!.files[0])
        setBase64Image(uploadState.file.dataURL ? uploadState.file.dataURL : null)
        emit(`stepDone`, files === MAX_FILES.value)
      } else {
        dropzone.value?.enable()
        emit(`stepDone`, files === MAX_FILES.value)
      }
    })

    const openFileExplorer = (event: any) => {
      if (dropzoneContainer.value != null && addedFiles.value < MAX_FILES.value) {
        dropzoneContainer.value.click()
      }
    }

    const init = () => {
      configStore.config.value.upload.maxFileSizeBytes ? (MAX_FILE_SIZE.value = configStore.config.value.upload.maxFileSizeBytes) : null
      configStore.config.value.upload.acceptedUploadFiles ? (ACCEPTED_FILE_EXTENSIONS.value = configStore.config.value.upload.acceptedUploadFiles) : null
      configStore.config.value.upload.maxFiles ? (MAX_FILES.value = configStore.config.value.upload.maxFiles) : null
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
      isLoading,
    }
  },
})
</script>
