<template>
  <div class="flex flex-col gap-16">
    <card-component :large="false">
      <p>Testing the small component</p>
    </card-component>

    <card-component :large="true">
      <p>Testing the large component</p>
    </card-component>
    <the-carousel :source="photos"/>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { CardComponent, TheCarousel } from 'coghent-vue-3-component-library'

export default defineComponent({
  components: {
    CardComponent,
    TheCarousel,
  },
  setup() {
    const photos: string[] = [
      'https://images.unsplash.com/photo-1593642634443-44adaa06623a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTc5MjZ8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMDU4MDU0MA&ixlib=rb-1.2.1&q=80&w=1080',
      'https://images.unsplash.com/photo-1630524233940-8fda17e3d190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTc5MjZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTYzMDU4MDU0MA&ixlib=rb-1.2.1&q=80&w=1080',
      'https://images.unsplash.com/photo-1630523628169-0e0863cdf69a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTc5MjZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTYzMDU4MDU0MA&ixlib=rb-1.2.1&q=80&w=1080',
    ]
    return { photos }
  },
})
</script>
<style scoped>
</style>