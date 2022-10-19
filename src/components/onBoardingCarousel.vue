<template>
  <BaseModal :large="true" modalState="show" @hide-modal="closeOnBoarding">
    <section v-if="carouselState.carouselContent" class="h-full w-full flex">
      <div class="w-1/12 h-full cursor-pointer absolute top-0 left-0 left-fade z-20 flex justify-center items-center" @click="previousCarouselSlide">
        <BaseIcon icon="arrowLeftLine" :height="24" :width="24" class="stroke-black" />
      </div>
      <div>
        <transition-group :name="animationDirection">
          <div class="flex justify-center" v-for="(content, index) in carouselState.carouselContent" :key="index" v-show="index + 1 === carouselState.currentCarouselSlide">
            <div :class="`absolute ${content.descriptionLocation} p-4 bg-white-see-trough max-w-md z-40`">
              <h3 class="font-bold mb-2">{{ content.contentName }}</h3>
              <p v-html="t(content.contentDescription)"></p>
            </div>
            <img :src="content.contentLocation" :alt="content.contentName" class="max-h-full" />
          </div>
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
import { useI18n } from 'vue-i18n'

type CarouselItem = {
  contentLocation: string
  contentName?: string
  contentDescription?: string
  descriptionLocation?: string
}

type CarouselState = {
  currentCarouselSlide: number
  carouselContent: CarouselItem[]
}

const carouselState = ref<CarouselState>({
  currentCarouselSlide: 1,
  carouselContent: [
    { contentLocation: '/loginOnboarding.png', contentName: 'Login', contentDescription: 'main.onBoarding.login', descriptionLocation: 'top-20 right-0' },
    { contentLocation: '/loginOnboarding.png', contentName: 'Zoeken', contentDescription: 'main.onBoarding.search', descriptionLocation: 'top-28 right-0' },
    { contentLocation: '/storyboxOnboarding.png', contentName: 'Verhalen', contentDescription: 'main.onBoarding.storybox', descriptionLocation: 'top-20 right-0' },
    { contentLocation: '/storiesOnboarding.png', contentName: 'Ga aan de slag', contentDescription: 'main.onBoarding.stories', descriptionLocation: 'top-48 right-0' },
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
    const { t } = useI18n()

    return { closeOnBoarding, carouselState, nextCarouselSlide, previousCarouselSlide, animationDirection, t }
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
  transform: translateX(0%) translateY(0%);
}

.next-leave-to {
  opacity: 0;
  transform: translateX(-30%) translateY(0%);
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
  transform: translateX(0) translateY(0%);
}

.previous-leave-to {
  opacity: 0;
  transform: translateX(30%) translateY(0%);
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

.bg-white-see-trough {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
