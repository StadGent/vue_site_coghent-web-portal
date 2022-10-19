<template>
  <BaseModal :large="true" modalState="show" @hide-modal="closeOnBoarding">
    <section v-if="carouselState.carouselContent" class="h-full w-full flex">
      <div class="w-1/12 h-full cursor-pointer absolute top-0 left-0 left-fade z-20 flex justify-center items-center" @click="previousCarouselSlide">
        <BaseIcon icon="arrowLeftLine" :height="24" :width="24" class="stroke-black" />
      </div>
      <div class="w-full h-full absolute top-0 left-0 flex justify-center">
        <transition-group :name="animationDirection">
          <img
            v-for="(content, index) in carouselState.carouselContent"
            :key="index"
            v-show="index + 1 === carouselState.currentCarouselSlide"
            :src="content.contentLocation"
            :alt="content.contentName"
            class="max-h-full"
          />
        </transition-group>
      </div>
      <div class="w-1/12 h-full cursor-pointer absolute top-0 right-0 right-fade z-20 flex justify-center items-center" @click="nextCarouselSlide">
        <BaseIcon icon="arrowRightLine" :height="24" :width="24" class="stroke-black" />
      </div>
    </section>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useOnBoarding } from '../composables/useOnBoarding'
import { BaseModal, BaseIcon } from 'coghent-vue-3-component-library'

type CarouselItem = {
  contentLocation: string
  contentName?: string
  contentDescription?: string
}

type CarouselState = {
  currentCarouselSlide: number
  carouselContent: CarouselItem[]
}

const carouselState = ref<CarouselState>({
  currentCarouselSlide: 1,
  carouselContent: [
    { contentLocation: './loginOnboarding.png', contentName: 'Login', contentDescription: 'main.onBoarding.login' },
    { contentLocation: './loginOnboarding.png', contentName: 'Search', contentDescription: 'main.onBoarding.search' },
    { contentLocation: './storyboxOnboarding.png', contentName: 'Storybox', contentDescription: 'main.onBoarding.storybox' },
    { contentLocation: './storiesOnboarding.png', contentName: 'Stories', contentDescription: 'main.onBoarding.stories' },
  ],
})

const useCarousel = () => {
  const animationDirection = ref<'next' | 'previous' | undefined>(undefined)

  const getCurrentCarouselContent = () => {
    return carouselState.value.carouselContent[carouselState.value.currentCarouselSlide]
  }

  const nextCarouselSlide = () => {
    animationDirection.value = 'next'
    if (carouselState.value.currentCarouselSlide < carouselState.value.carouselContent.length) {
      carouselState.value.currentCarouselSlide++
    } else {
      carouselState.value.currentCarouselSlide = 1
    }
  }

  const previousCarouselSlide = () => {
    animationDirection.value = 'previous'
    if (carouselState.value.currentCarouselSlide > 1) {
      carouselState.value.currentCarouselSlide--
    } else {
      carouselState.value.currentCarouselSlide = carouselState.value.carouselContent.length
    }
  }

  return {
    getCurrentCarouselContent,
    nextCarouselSlide,
    previousCarouselSlide,
    carouselState,
    animationDirection,
  }
}

export default defineComponent({
  name: 'onBoardingCarousel',
  components: { BaseModal, BaseIcon },
  props: {},
  setup() {
    const { closeOnBoarding } = useOnBoarding()
    const { carouselState, animationDirection, nextCarouselSlide, previousCarouselSlide } = useCarousel()

    return { closeOnBoarding, carouselState, nextCarouselSlide, previousCarouselSlide, animationDirection }
  },
})
</script>

<style scoped>
.next-enter-active,
.next-leave-active {
  transition: all 0.5s ease;
}

.next-enter-from {
  opacity: 0;
  transform: translateX(-30%) translateY(0%);
}

.next-leave-to {
  opacity: 0;
  transform: translateX(0%) translateY(0%);
}

.next-leave-active {
  position: absolute;
}

.previous-enter-active,
.previous-leave-active {
  transition: all 0.5s ease;
}

.previous-enter-from {
  opacity: 0;
  transform: translateX(30%) translateY(0%);
}

.previous-leave-to {
  opacity: 0;
  transform: translateX(0%) translateY(0%);
}

.previous-leave-active {
  position: absolute;
}

.left-fade {
  background: rgb(255, 255, 255);
  background: linear-gradient(90deg, rgba(255, 255, 255, 1) 20%, rgba(0, 0, 0, 0) 100%);
}

.right-fade {
  background: rgb(255, 255, 255);
  background: linear-gradient(90deg, rgba(0, 0, 0, 0) 20%, rgba(255, 255, 255, 1) 100%);
}

.stroke-black {
  stroke: black;
}
</style>
