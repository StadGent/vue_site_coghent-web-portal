<template>
  <div class="flex justify-between">
    <div class="flex gap-8">
      <div>
        <a href="/home" class="flex items-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" fill="#FDC20B" />
            <g filter="url(#filter0_i)">
              <circle cx="24" cy="24" r="12" fill="white" />
            </g>
            <defs>
              <filter id="filter0_i" x="12" y="12" width="26" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="2" dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              </filter>
            </defs>
          </svg>
          <h2 class="font-bold text-lg ml-4">{{ t('header.discover') }}</h2>
        </a>
      </div>
      <div class="flex flex-col items-center pt-3">
        <a href="/pavilion" class="flex items-center">
          <h2 class="font-bold text-lg">{{ t('header.pavilion') }}</h2>
        </a>
        <div class="w-2 h-2 bg-accent-yellow rounded mt-3"></div>
      </div>
    </div>

    <div class="flex">
      <!-- <language-selector /> -->
      <div class="border-r-2 h-auto border-background-dark border-opacity-70 mr-2"></div>
      <base-button :text="t('buttons.login')" :on-click="buttonClick" custom-style="primary" :iconShown="false" />
      <base-button :text="t('buttons.storybox')" :on-click="buttonClick" custom-style="ghost-purple" :iconShown="true" />
    </div>
  </div>
  <div class="border-t-2 w-auto border-background-dark mt-5 border-opacity-70"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { BaseButton } from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'TheHeader',
  components: { BaseButton },
  setup() {
    const buttonClick = () => {
      console.log('click')
    }

    const { t } = useI18n()
    return { t, buttonClick }
  },
})
</script>

<style scoped>
</style>