<template>
  <card-component :large="false" @click="goToPavilion">
    <section class="cursor-pointer m-5 flex-col content-between text-center">
      <span class="font-bold text-xl" />
      {{ t('main.cta') }}
      <span>
        <div class="w-full h-auto mt-10 flex justify-center">
          <base-icon icon="chest" class="w-44 h-36 stroke-current fill-current text-text-white" />
        </div>
      </span>
    </section>
  </card-component>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { CardComponent, BaseIcon } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    CardComponent,
    BaseIcon,
  },
  setup() {
    const goToPavilion = () => {
      console.log('Clicked')
    }
    const { t } = useI18n()
    return {
      t,
      goToPavilion,
    }
  },
})
</script>
<style scoped></style>
