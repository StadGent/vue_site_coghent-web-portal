<template>
<div class="flex flex-col gap-16">
    <card-component :large="false">
        <p>Testing the small component</p>
    </card-component>

    <card-component :large="true">
        <p>Testing the large component</p>
    </card-component>
    <the-carousel/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { CardComponent } from 'coghent-vue-3-component-library'
import TheCarousel from '../components/TheCarousel.vue'

export default defineComponent({
    components:{
        CardComponent,
        TheCarousel
    },
    setup() {
        
    },
})
</script>
<style scoped>

</style>