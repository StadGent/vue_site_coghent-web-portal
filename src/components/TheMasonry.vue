<template>
  <div>
    <div :class="['masonry mx-5 sm:mx-0', { big: !small }]">
      <div v-for="entity in entities.results" v-show="entity.mediafiles && entity.mediafiles.length > 0" :key="entity.id" class="card">
        <div id="card-content" class="card-content">
          <a class="relative group block" :href="'/entity/' + entity.id">
            <span
              :class="{
                'w-full bg-background-dark animate-pulse h-full left-0 top-0 absolute': loading,
                'w-full bg-text-dark h-full left-0 top-0 group-hover:opacity-50 opacity-0 absolute': !loading && !small,
              }"
            >
            </span>

            <span v-show="!small" class="absolute w-full h-full left-0 top-0 group-hover:opacity-100 opacity-0">
              <div class="w-full h-full flex flex-col items-center justify-center text-center text-text-white">
                <p class="opacity-100 mb-2 px-10 font-bold">{{ entity.title[0].value }}</p>
                <p id="description" class="opacity-100 px-10 overflow-ellipsis break-words">{{ entity.description[0].value }}</p>
                <base-button :text="t('main.more')" custom-style="ghost-white" :icon-shown="true" :iconLeft="false" custom-icon="arrowRight" />

                <div @click.prevent="copyUrl(entity.id)"><base-button class="z-10 w-0 mt-3 ml-3" custom-style="secondary-round" :icon-shown="true" custom-icon="link" /></div>
              </div>
            </span>
            <img v-if="entity.mediafiles && entity.mediafiles.length > 0" v-lazy="entity.mediafiles[0].original_file_location" class="flex w-full rounded-md shadow" @load="rendered" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
export default defineComponent({
  name: 'TheMasonry',
  components: {
    BaseButton,
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
    const { toClipboard } = useClipboard()

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
      for (let i = 0; i < allItems.length; i++) {
        resizeMasonryItem(allItems[i])
      }
    }

    const copyUrl = async (id: String) => {
      try {
        var suffix = '/entity/' + id
        var splitted = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        var url = splitted + suffix
        await toClipboard(url)
      } catch (e) {
        console.error(e)
      }
    }

    const rendered = () => {
      imagesCount.value++
    }

    const { t } = useI18n()

    return {
      rendered,
      t,
      copyUrl,
    }
  },
})
</script>

<style scoped>
/* prettifying styles */
html {
  background: #555;
}

#description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to show */
  line-clamp: 3;
  -webkit-box-orient: vertical;
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
