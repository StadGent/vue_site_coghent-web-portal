<template>
<div class="">
    <card-component :large="false">
        <p>Testing the small component</p>
    </card-component>

    <card-component :large="true">
        <p>Testing the large component</p>
    </card-component>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { CardComponent } from 'coghent-vue-3-component-library'

export default defineComponent({
    components:{
        CardComponent
    },
    setup() {
        
    },
})
</script>
<style scoped>

</style>