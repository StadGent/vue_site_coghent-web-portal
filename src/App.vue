<template>
  <section>
    <TheGrid />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheGrid from './components/TheGrid.vue'

export default defineComponent({
  name: 'App',
  components: {
    TheGrid,
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
