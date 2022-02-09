<template>
  <div class="w-full">
    <div class="mb-1.5">
      <span v-show="entities.count" class="font-light"
        >{{ t('main.results') }}<strong class="font-light ml-1">{{ entities.count }}</strong></span
      >
    </div>
    <div v-if="entities.count !== 0" :class="['masonry mx-5 sm:mx-0', { big: !small }]">
      <div v-for="(tile, key) in masonryTiles" :key="key" class="card">
        <div
          id="card-content"
          class="card-content"
          :class="{
            'grid grid-cols-2': (tile.type === 'TwoImages') | (tile.type === 'FourImages'),
          }"
        >
          <a v-for="(entity, key2) in tile.mediafiles" :key="key2" class="relative group block bg-background-medium" :href="entity.object_id ? '/entity/' + entity.object_id : undefined">
            <span v-show="tile.mediafiles[0] !== 'placeholder'" class="w-full bg-text-dark h-full left-0 top-0 group-hover:opacity-50 opacity-0 absolute rounded-md"> </span>

            <span v-show="!small && tile.mediafiles[0] !== 'placeholder'" class="absolute w-full h-full left-0 top-0 group-hover:opacity-100 opacity-0">
              <div class="w-full h-full flex flex-col items-center justify-center text-center text-text-white">
                <p v-if="entity.title && entity.title[0]" class="opacity-100 mb-2 px-10 font-bold">{{ entity.title[0].value }}</p>
                <p v-if="entity.description && entity.description[0] && tile.type === 'SingleImage'" id="description" class="opacity-100 px-10 overflow-ellipsis break-words">
                  {{ entity.description[0].value }}
                </p>
                <base-button :text="t('main.more')" custom-style="ghost-white" :icon-shown="true" :icon-left="false" custom-icon="arrowRightLine" />

                <div @click.prevent="() => copyUrl(entity.id)"><base-button class="z-10 w-0 mt-3 ml-3" custom-style="secondary-round" :icon-shown="true" custom-icon="link" /></div>
              </div>
            </span>
            <LazyLoadImage
              :url="getImageUrl(entity, tile.type)"
              :width="entity.primary_mediafile_info ? entity.primary_mediafile_info.width : undefined"
              :height="entity.primary_mediafile_info ? entity.primary_mediafile_info.height : undefined"
              :fall-back-url="getFallBackImageUrl(entity, tile.type)"
              extra-class="h-full object-contain"
              @loaded="rendered"
            />
          </a>
        </div>
      </div>
    </div>
    <div v-if="entities.count === 0">
      <p v-show="!loading" class="text-center">
        {{ t('main.empty') }}
      </p>
    </div>
    <div class="flex justify-center">
      <base-button v-show="!loading && entities.count !== 0 && !endOfData" :text="t('main.load')" :on-click="loadMore" custom-style="ghost-black" :icon-shown="false" class="px-2 m-4 text-center" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { BaseButton, LazyLoadImage } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
import { Entity } from 'coghent-vue-3-component-library/lib/queries'
import { randomizer } from '../helpers'
import useIIIF from '../composables/useIIIF'

type MasonryImage = 'placeholder' | Entity

type MasonryTileConfig = {
  SingleImage: {
    mediafiles: [MasonryImage]
    probability: number | '*'
  }
  TwoImages: {
    mediafiles: [MasonryImage, MasonryImage]
    probability: number | '*'
  }
  FourImages: {
    mediafiles: [MasonryImage, MasonryImage, MasonryImage, MasonryImage]
    probability: number | '*'
  }
}

type BaseTile = {
  type: keyof MasonryTileConfig
  mediafiles: MasonryImage[]
}

export default defineComponent({
  name: 'TheMasonry',

  components: {
    BaseButton,
    LazyLoadImage,
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
    itemsEachLoad: {
      type: Number,
      default: 50,
      required: false,
    },
    endOfData: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  emits: ['loadMore'],
  setup: (props, { emit }) => {
    const masonryTiles = ref<Array<BaseTile>>([])
    const { t } = useI18n()
    const { toClipboard } = useClipboard()
    const loadMore = () => emit('loadMore')
    const { generateUrl, noImageUrl } = useIIIF()
    const renderCount = ref<number>(0)

    const tiles: MasonryTileConfig = {
      SingleImage: {
        mediafiles: ['placeholder'],
        probability: '*',
      },
      TwoImages: {
        mediafiles: ['placeholder', 'placeholder'],
        probability: 0.3,
      },
      FourImages: {
        mediafiles: ['placeholder', 'placeholder', 'placeholder', 'placeholder'],
        probability: 0.1,
      },
    }

    const resizeMasonryItem = (item: any) => {
      let grid = document.getElementsByClassName('masonry')[0],
        rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
        rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'))
      let rowSpan = Math.ceil((item.querySelector('.card-content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap))

      item.style.gridRowEnd = 'span ' + rowSpan
    }

    const contructTiles = (numberOfTiles: number = 20, reset: boolean = false) => {
      if (reset) {
        masonryTiles.value = []
      }

      let numberOfEntities = 0
      while (numberOfEntities <= numberOfTiles) {
        let randomTile = randomizer<keyof MasonryTileConfig>(tiles)
        if (randomTile) {
          randomTile = numberOfTiles - numberOfEntities < 4 ? 'SingleImage' : randomTile

          switch (randomTile) {
            case 'TwoImages':
              masonryTiles.value.push({
                type: 'TwoImages',
                mediafiles: ['placeholder', 'placeholder'],
              })
              numberOfEntities = numberOfEntities + 2
              break
            case 'FourImages':
              masonryTiles.value.push({
                type: 'FourImages',
                mediafiles: ['placeholder', 'placeholder', 'placeholder', 'placeholder'],
              })
              numberOfEntities = numberOfEntities + 4
              break
            default:
              masonryTiles.value.push({
                type: 'SingleImage',
                mediafiles: ['placeholder'],
              })
              numberOfEntities = numberOfEntities + 1
              break
          }
        }
      }
    }

    onMounted(() => {
      let masonryEvents = ['load', 'resize']
      masonryEvents.forEach(function (event) {
        window.addEventListener(event, resizeAllMasonryItems)
      })

      contructTiles(props.itemsEachLoad)

      watch(
        () => props.entities.results,
        (value) => {
          if (value) {
            const filterdValue: Entity[] = value
            const numberOfResult = filterdValue.length
            let entityIndex = 0
            let lastIndex = 0

            masonryTiles.value.forEach((tile: BaseTile, index) => {
              if (entityIndex <= numberOfResult) {
                switch (tile.type) {
                  case 'TwoImages':
                    masonryTiles.value[index].mediafiles = filterdValue.slice(entityIndex, entityIndex + 2)
                    entityIndex = entityIndex + 2
                    lastIndex = index
                    break
                  case 'FourImages':
                    masonryTiles.value[index].mediafiles = filterdValue.slice(entityIndex, entityIndex + 4)
                    entityIndex = entityIndex + 4
                    lastIndex = index
                    break
                  default:
                    masonryTiles.value[index].mediafiles = filterdValue.slice(entityIndex, entityIndex + 1)
                    entityIndex = entityIndex + 1
                    lastIndex = index
                    break
                }
              }
            })
            masonryTiles.value.splice(lastIndex + 1, masonryTiles.value.length)
          }
        },
        { immediate: true }
      )
    })

    const resizeAllMasonryItems = () => {
      let allItems = document.getElementsByClassName('card')
      for (let i = 0; i < allItems.length; i++) {
        resizeMasonryItem(allItems[i])
      }
    }

    const copyUrl = async (id: String) => {
      try {
        var suffix = '/entity/' + id
        var splitted = window.location.href.substring(0, window.location.href.lastIndexOf('/'))
        var url = splitted + suffix
        await toClipboard(url)
      } catch (e) {
        console.error(e)
      }
    }

    const checkForOverflow = () => {
      const element = document.getElementsByClassName('masonry')[0] as HTMLElement

      if (element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth) {
        console.log('overflowing masonry')
        resizeAllMasonryItems()
      }
    }

    const rendered = () => {
      resizeAllMasonryItems()
    }

    const getImageUrl = (entity: Entity | 'placeholder', tiletype: keyof MasonryTileConfig): string | undefined => {
      if (entity !== 'placeholder' && entity.primary_mediafile) {
        return generateUrl(entity.primary_mediafile, tiletype === 'SingleImage' ? 'full' : 'full')
      }
      if (entity === 'placeholder') {
        return undefined
      }
      return noImageUrl
    }

    const getFallBackImageUrl = (entity: Entity | 'placeholder', tiletype: keyof MasonryTileConfig): string | undefined => {
      if (entity !== 'placeholder' && entity.primary_mediafile) {
        return generateUrl(entity.primary_mediafile, tiletype === 'SingleImage' ? 'full' : 'full', 'max')
      }
      if (entity === 'placeholder') {
        return undefined
      }
      return noImageUrl
    }

    return {
      t,
      loadMore,
      rendered,
      copyUrl,
      getImageUrl,
      masonryTiles,
      contructTiles,
      getFallBackImageUrl,
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

.card-content {
  gap: 15px;
}
</style>
