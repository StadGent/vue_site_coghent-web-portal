<template>
  <!-- <div v-for="photo in photos" :key="photo.html">
    <img :src="photo.urls.regular" />
    <p>{{ photo.alt_description }}</p>
  </div> -->
  <div class="flex items-center">
    <img class="h-96 w-72 z-0 mr-5 mt-24 opacity-70" :src="photos[getPrevImage()]" />

    <div class="flex flex-col items-center">
      <img class="w-72 h-96 z-10 " :src="photos[selectedIndex]" />
      <div class="flex items-center bg-text-white shadow w-min inline-block rounded-full p-3 px-5 z-20 -mt-4">
        <svg
          v-show="photos.length > 1"
          class="cursor-pointer transform rotate-180 flex-shrink-0 mr-2"
          width="16"
          height="16"
          viewBox="0 0 17 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="prevImage"
        >
          <path d="M1 6H16" stroke="#B65099" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M11 1L16 6L11 11" stroke="#B65099" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div v-for="photo in photos" :key="photo" class="w-2 h-2 rounded-full bg-text-dark mx-1" :class="{ [`opacity-40`]: photo !== photos[selectedIndex] }"></div>
        <svg v-show="photos.length > 1" class="cursor-pointer flex-shrink-0 ml-2" width="16" height="16" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg" @click="nextImage">
          <path d="M1 6H16" stroke="#B65099" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M11 1L16 6L11 11" stroke="#B65099" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
    <img class="w-72 h-96 z-0 ml-5 opacity-70 mt-24" :src="photos[getNextImage()]" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'

const key = 'ywZWVMg3eFuhuS804wD6PuGBKyWsrXQF-bee2SJtqmw'
const endpoint = 'https://api.unsplash.com/photos/?client_id=' + key

export default defineComponent({
  components: {},
  setup() {
    const selectedIndex = ref<number>(0)
    const nextIndex = ref<number>(0)
    const prevIndex = ref<number>(0)
    const photos: string[] = [
      'https://images.unsplash.com/photo-1593642634443-44adaa06623a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTc5MjZ8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMDU4MDU0MA&ixlib=rb-1.2.1&q=80&w=1080',
      'https://images.unsplash.com/photo-1630524233940-8fda17e3d190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTc5MjZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTYzMDU4MDU0MA&ixlib=rb-1.2.1&q=80&w=1080',
      'https://images.unsplash.com/photo-1630523628169-0e0863cdf69a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTc5MjZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTYzMDU4MDU0MA&ixlib=rb-1.2.1&q=80&w=1080',
    ]
    // let photos : any = []
    // const getPhotos = () => {
    //   axios.get(endpoint).then((resp) => {
    //     console.log('response', resp.data)
    //     photos = resp.data
    //     console.log("Data", photos)
    //   })
    // }
    // getPhotos()

    const nextImage = () => {
      selectedIndex.value = selectedIndex.value < photos.length - 1 ? selectedIndex.value + 1 : 0
    }

    const prevImage = () => {
      selectedIndex.value = selectedIndex.value === 0 ? photos.length - 1 : selectedIndex.value - 1
    }

    const getNextImage = () => {
      return (nextIndex.value = selectedIndex.value < photos.length - 1 ? selectedIndex.value + 1 : 0)
    }

    const getPrevImage = () => {
      return (prevIndex.value = selectedIndex.value === 0 ? photos.length - 1 : selectedIndex.value - 1)
    }

    return { photos, selectedIndex, prevImage, nextImage, getNextImage, getPrevImage }
  },
})
</script>
<style scoped>
</style>