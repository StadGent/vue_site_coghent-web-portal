<template>
  <div v-if="result" class="grid grid-cols-2 mt-20">
    <section v-if="result.Entity?.mediafiles"  class="flex items-center  justify-between px-10">
      <svg v-show="result.Entity?.mediafiles.length > 1" class="cursor-pointer transform rotate-180 flex-shrink-0 mr-2" @click="prevImage" width="34" height="24" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6H16" stroke="#B65099" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11 1L16 6L11 11" stroke="#B65099" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <img class="w-9/12" :src="result.Entity?.mediafiles[selectedImageIndex].original_file_location"  />
      <svg v-show="result.Entity?.mediafiles.length > 1"  class="cursor-pointer flex-shrink-0 ml-2" @click="nextImage" width="34" height="24" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6H16" stroke="#B65099" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11 1L16 6L11 11" stroke="#B65099" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </section>
    <section v-if="result">
      <div class="flex flex-col bg-background-medium px-10 py-10">
      <h1 class="text-lg font-bold">{{ result.Entity?.title[0]?.value }}</h1>
      <div class="pt-5 font-light" v-for="metaData in result.Entity?.metadata" :key="metaData.value">
        <p v-show="metaData.key === 'description'">{{ metaData.value }}</p> 
      </div>
      <div class="pt-5 font-medium">
        <span v-for="metaData in result.Entity?.metadata" :key="metaData.value" class="inline-block px-2 py-2 bg-background-dark mr-4 bg-opacity-50" v-show="metaData.key === 'type'">{{ metaData.value }}</span> 
      </div>
      <!-- <p style="max-width: 500px; margin: auto">
        {{  }}
      </p> -->
    </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument } from 'coghent-vue-3-component-library'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export default defineComponent({
  name: 'EntityDetails',
  setup: () => {
    const id = asString(useRoute().params['entityID'])
    const { result } = useQuery(GetEntityByIdDocument, { id })
    const selectedImageIndex = ref<number>(0)

    console.log(result)

    const nextImage = () => {
      if(result.value && result.value.Entity && result.value.Entity.mediafiles){
        selectedImageIndex.value = selectedImageIndex.value < result.value.Entity?.mediafiles.length ? selectedImageIndex.value + 1 : 0
      }
    }

    const prevImage = () => {
      if(result.value && result.value.Entity && result.value.Entity.mediafiles){
        selectedImageIndex.value = selectedImageIndex.value === 0 ? result.value.Entity?.mediafiles.length - 1 : selectedImageIndex.value - 1
      }
    }

    return { result, selectedImageIndex, nextImage, prevImage }
  },
})
</script>

<style scoped></style>
