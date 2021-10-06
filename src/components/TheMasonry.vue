<template>
  <div>
    <!-- <masonry :cols="{ default: small ? 5 : 3, 800: 2 }" :gutter="{ default: small ? '15px' : '30px', 800: '15px' }">
      <a v-for="entity in entities.results" v-show="entity.mediafiles && entity.mediafiles.length > 0" :key="entity.id" class="relative group" :href="'/entity/' + entity.id">
        <span
          :class="{
            'w-full bg-background-dark animate-pulse h-full left-0 top-0 absolute': loading,
            'w-full bg-text-dark h-full left-0 top-0 group-hover:opacity-50 opacity-0 absolute': !loading,
          }"
        />
        <img v-if="entity.mediafiles && entity.mediafiles.length > 0" v-lazy="{ src: util.replaceStringStorageApi(entity.mediafiles[0].location) }" />
      </a>
    </masonry> -->

    <div class="masonry">
      <div
        v-for="entity in entities.results"
        v-show="entity.mediafiles && entity.mediafiles.length > 0"
        :key="entity.id"
        class="card"
      >
        <div class="card-content" id="card-content">
          <a class="relative group" :href="'/entity/' + entity.id">
            <span
              :class="{
                'w-full bg-background-dark animate-pulse h-full left-0 top-0 absolute':
                  loading,
                'w-full bg-text-dark h-full left-0 top-0 group-hover:opacity-50 opacity-0 absolute':
                  !loading,
              }"
            />
            <img
              v-if="entity.mediafiles && entity.mediafiles.length > 0"
              :src="util.replaceStringStorageApi(entity.mediafiles[0].location)"
              @load="rendered"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onUpdated,
  onBeforeMount,
} from "vue";
import CTAHome from "./CTAHome.vue";
import * as util from "../utils/stringUtil";


export default defineComponent({
  name: "TheMasonry",
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
    const imagesCount = ref<number>(1);
    const temp = ref<Array<any>>([]);

    const resizeMasonryItem = (item: any) => {
      let grid = document.getElementsByClassName("masonry")[0],
        rowGap = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
        ),
        rowHeight = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
        );

      let rowSpan = Math.ceil(
        (item.querySelector(".card-content").getBoundingClientRect().height +
          rowGap) /
          (rowHeight + rowGap)
      );

      item.style.gridRowEnd = "span " + rowSpan;
    };

  

    onMounted(() => {
      let masonryEvents = ["load", "resize"];
      masonryEvents.forEach(function (event) {
        window.addEventListener(event, resizeAllMasonryItems);
      });

      watch(
        () => props.entities.results,
        () => {
          resizeAllMasonryItems();
          if(temp.value.length > 0){
            if(temp.value[0].id != props.entities.results[0].id){
              imagesCount.value = 0
            }
          }
          temp.value = props.entities.results
        }, {immediate: true}
      );
    });

    watch(
      () => imagesCount.value,
      () => {
        resizeAllMasonryItems();
      }
    );

    const resizeAllMasonryItems = () => {
      let allItems = document.getElementsByClassName("card");
      console.log("Allitems", allItems.length);

      for (let i = 0; i < allItems.length; i++) {
        resizeMasonryItem(allItems[i]);
      }
    };

    const rendered = () => {
      imagesCount.value++;
      console.log("rendered", imagesCount.value);
    };

    return {
      util,
      rendered,
    };
  },
});
</script>

<style scoped>
/* prettifying styles */
html {
  background: #555;
}

img {
  margin-top: 25px;
  display: flex;
  width: 100%;
  border-radius: 4px;
  box-shadow: 2px 2px 5px rgba(#000, 0.7);
}
.masonry {
        display: grid;
        grid-gap: 15px;
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
        grid-auto-rows: 0;
    }
</style>
