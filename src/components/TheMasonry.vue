<template>
  <div>
    <masonry
      :cols="{ default: 3, 800: 2 }"
      :gutter="{ default: '30px', 800: '15px' }"
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
          :src="replaceStringStorageApi(entity.mediafiles[0].location)"
        >
      </a>
    </masonry>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import CTAHome from './CTAHome.vue'

export default defineComponent({
  name: 'TheMasonry',
  components: {
    // CTAHome
  },
  props: {
    entities: {
      type: Object, // Might need to change for CTA
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
  },
  setup: (props) => {
    const replaceStringStorageApi = (input: string) => {
      return input.replace('http://storage-api:8001http://localhost:8001/', 'http://localhost:8001/')
    }

    return {
      replaceStringStorageApi,
    }
  },
})
</script>

<style scoped>
/* prettifying styles */
html {
  background: #555;
}

img {
  margin-top: 25px;
  display: block;
  width: 100%;
  border-radius: 4px;
  box-shadow: 2px 2px 5px rgba(#000, 0.7);
}
</style>
