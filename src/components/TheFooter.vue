<template>
  <div class="w-full mt-10 bg-background-medium flex flex-col items-center">
    <div class="container">
      <CardComponent :large="true" class="w-full">
        <div class="w-full grid grid-cols-2 items-center place-items-end pr-4">
          <div class="flex gap-4 max-w-xs items-center">
            <img class="eu-logo" src="/EU+ERDF.png" />
            <img class="uia-logo" src="/Logo_UIA_couleur.png" />
          </div>
          <div class="ml-4">
            {{ t('footer.eu-info') }}
          </div>
        </div>
        <ul class="mt-5 flex justify-center">
          <li>
            <a href="https://stad.gent/nl/cookiebeleid-stad-gent" target="_blank" class="underline mr-4 font-light"> {{ t('footer.cookie-policy') }}</a>
          </li>
          <li>
            <a href="https://static1.squarespace.com/static/5fb4f5b0509a072b93557287/t/6141f82d6a4c7d11931fd043/1631713326053/CoGhent+Privacy+Policy.pdf" target="_blank" class="underline font-light">
              {{ t('footer.privacy-policy') }}</a
            >
          </li>
        </ul>
      </CardComponent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CardComponent } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'TheFooter',
  components: {
    CardComponent,
  },
  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>

<style scoped>
.eu-logo {
  max-width: 6rem;
}

.uia-logo {
  max-width: 8rem;
}
</style>
