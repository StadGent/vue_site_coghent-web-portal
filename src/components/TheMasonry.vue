<template>
  <div class="grid--masonry" :class="{ small: small }">
    <a
      v-for="entity in entities.results"
      v-show="entity.mediafiles && entity.mediafiles.length > 0"
      :key="entity.id"
      class="relative group"
      :href="'/entity/' + entity.id"
    >
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
        :src="entity.mediafiles[0].original_file_location"
      />
      <!-- <cta-home v-if="entity === 'CTA'"/> -->
    </a>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";
// import CTAHome from "./CTAHome.vue";

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
    const fallback = () => {
      let grids = [...document.querySelectorAll(".grid--masonry")];

      if (
        grids.length &&
        getComputedStyle(grids[0]).gridTemplateRows !== "masonry"
      ) {
        grids = grids.map((grid) => ({
          _el: grid,
          gap: parseFloat(getComputedStyle(grid).gridRowGap),
          items: [...grid.childNodes].filter((c) => c.nodeType === 1),
          ncol: 0,
        }));

        var layout;

        layout = function () {
          grids.forEach((grid) => {
            /* get the post-resize/ load number of columns */
            let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(
              " "
            ).length;

            if (grid.ncol !== ncol) {
              /* update number of columns */
              grid.ncol = ncol;

              /* revert to initial positioning, no margin */
              grid.items.forEach((c) => c.style.removeProperty("margin-top"));

              /* if we have more than one column */
              if (grid.ncol > 1) {
                grid.items.slice(ncol).forEach((c, i) => {
                  let prev_fin =
                      grid.items[i].getBoundingClientRect()
                        .bottom /* bottom edge of item above */,
                    curr_ini =
                      c.getBoundingClientRect()
                        .top; /* top edge of current item */

                  c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`;
                });
              }
            }
          });
        };

        addEventListener(
          "load",
          (e) => {
            layout(); /* initial load */
            addEventListener("resize", layout, false);
          },
          false
        );
        console.log('boo, masonry not supported 😭')
      }else console.log('yay, do nothing!')
    };

    onMounted(fallback);
  },
});
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
