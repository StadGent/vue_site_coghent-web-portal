<template>
  <div class="bg-background-light font-body py-6 min-h-screen flex flex-col items-center">
    <div class="container">
      <a
        href="/home"
        class="flex items-center"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="48"
            height="48"
            fill="#FDC20B"
          />
          <g filter="url(#filter0_i)">
            <circle
              cx="24"
              cy="24"
              r="12"
              fill="white"
            />
          </g>
          <defs>
            <filter
              id="filter0_i"
              x="12"
              y="12"
              width="26"
              height="26"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood
                flood-opacity="0"
                result="BackgroundImageFix"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset
                dx="2"
                dy="2"
              />
              <feGaussianBlur stdDeviation="2" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow"
              />
            </filter>
          </defs>
        </svg>
        <h2 class="font-bold text-lg ml-4">Ontdek de collectie</h2>
      </a>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {},
})
</script>

<style></style>
