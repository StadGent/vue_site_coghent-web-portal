<template>
  <div>
    <div :class="['masonry mx-5 sm:mx-0', { big: !small }]">
      <div v-for="entity in entities.results" v-show="entity.mediafiles && entity.mediafiles.length > 0" :key="entity.id" class="card">
        <div id="card-content" class="card-content">
          <a class="relative group" :href="'/entity/' + entity.id">
            <span
              :class="{
                'w-full bg-background-dark animate-pulse h-full left-0 top-0 absolute': loading,
                'w-full bg-text-dark h-full left-0 top-0 group-hover:opacity-50 opacity-0 absolute': !loading,
              }"
            />
            <img v-if="entity.mediafiles && entity.mediafiles.length > 0" :src="entity.mediafiles[0].location" class="flex w-full rounded-md shadow" @load="rendered" />
          </a>
        </div>
      </div>
    </div>
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
    const imagesCount = ref<number>(1)
    const temp = ref<Array<any>>([])

    const resizeMasonryItem = (item: any) => {
      let grid = document.getElementsByClassName('masonry')[0],
        rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
        rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'))

      let rowSpan = Math.ceil((item.querySelector('.card-content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap))

      item.style.gridRowEnd = 'span ' + rowSpan
    }

    onMounted(() => {
      let masonryEvents = ['load', 'resize']
      masonryEvents.forEach(function (event) {
        window.addEventListener(event, resizeAllMasonryItems)
      })

      watch(
        () => props.entities.results,
        () => {
          resizeAllMasonryItems()
          if (temp.value.length > 0) {
            if (temp.value[0].id != props.entities.results[0].id) {
              imagesCount.value = 0
            }
          }
          temp.value = props.entities.results
        },
        { immediate: true }
      )
    })

    watch(
      () => imagesCount.value,
      () => {
        resizeAllMasonryItems()
      }
    )

    const resizeAllMasonryItems = () => {
      let allItems = document.getElementsByClassName('card')
      console.log('Allitems', allItems.length)

      for (let i = 0; i < allItems.length; i++) {
        resizeMasonryItem(allItems[i])
      }
    }

    const rendered = () => {
      imagesCount.value++
      console.log('rendered', imagesCount.value)
    }

    return {
      rendered,
    }
  },
})
</script>

<style scoped>
/* prettifying styles */
html {
  background: #555;
}

.masonry {
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 0;
}

@media screen and (min-width: 520px) {
  .masonry.big {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  }
}

@media screen and (min-width: 760px) {
  .masonry.big {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media screen and (min-width: 1024px) {
  .masonry.big {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  }
}
</style>
