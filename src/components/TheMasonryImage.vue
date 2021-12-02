<template>
  <img
    v-show="!imageLoaded"
    :src="`data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 ${width ? width : 500} ${height ? height : 500}&quot;%3E%3C/svg%3E`"
    class="flex w-full rounded-md shadow animate-pulse bg-background-medium"
    @load="rendered"
  />
  <img v-if="url" v-show="imageLoaded" :src="url" class="flex w-full rounded-md shadow" @load="finalImageLoaded" />
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
export default defineComponent({
  name: 'TheMasonryImage',
  props: {
    url: {
      type: String,
      required: false,
    },
    width: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
  },
  emits: ['loaded'],
  setup: (props, { emit }) => {
    const imageLoaded = ref<boolean>(false)

    const rendered = () => {
      emit('loaded')
    }

    const finalImageLoaded = () => {
      imageLoaded.value = true
      emit('loaded')
    }

    watch(
      () => props.url,
      (value: string | undefined) => {
        if (!value) {
          imageLoaded.value = false
        }
      }
    )

    return {
      imageLoaded,
      finalImageLoaded,
      rendered,
    }
  },
})
</script>
