<template>
  <div
    class="grid--masonry"
    :class="{ small: small }"
  >
    <a
      v-for="entity in entities.results"
      v-show="entity.mediafiles && entity.mediafiles.length > 0"
      :key="entity.id"
      class="relative group"
      :href="'/entity/' + entity.id"
    >
      <span
        :class="{
          'w-full bg-background-dark animate-pulse h-full left-0 top-0 absolute': loading,
          'w-full bg-text-dark h-full left-0 top-0 group-hover:opacity-50 opacity-0 absolute': !loading,
        }"
      />
      <img
        v-if="entity.mediafiles && entity.mediafiles.length > 0"
        :src="entity.mediafiles[0].original_file_location"
      >
      <!-- <component :is="CTAHome"/> -->
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
// import CTAHome from 'src/components/CTAHome.vue'

export default defineComponent({
  name: 'TheMasonry',
  components:{
    // CTAHome
    },
  props: {
    entities: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    callToAction: {
      type: String,
      required: false,
    },
  },
  setup: (props) => {
  
  },
})
</script>

<style scoped>
/* basic reset */
* {
  margin: 0;
}

/* grid styles */
.grid--masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, Min(30em, 100%));
  grid-template-rows: masonry;
  justify-content: center;
  grid-gap: 0.5em;
  padding: 0.5em;
}

.grid--masonry.small {
  grid-template-columns: repeat(auto-fit, Min(10em, 100%));
}

.grid--masonry > * {
  align-self: start;
}

/* prettifying styles */
html {
  background: #555;
}

img {
  display: block;
  width: 100%;
  border-radius: 4px;
  box-shadow: 2px 2px 5px rgba(#000, 0.7);
}
</style>
