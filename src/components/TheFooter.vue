<template>
  <div class="w-full mt-10 bg-background-medium flex flex-col items-center">
    <div class="container">
      <CardComponent :large="true" class="w-full">
        <div class="w-full grid grid-cols-2 items-center place-items-end pr-4">
          <div class="flex flex-col sm:flex-row gap-4 max-w-s items-center">
            <img class="eu-logo" src="/EU+ERDF.png" />
            <img class="uia-logo" src="/Logo_UIA_couleur.png" />
            <img class="flanders-logo" src="/Flanders.png" />
          </div>
          <div class="ml-4">
            {{ t('footer.eu-info') }}
          </div>
        </div>
        <div v-if="!route.query.touch" class="flex flex-row w-full justify-center gap-8 mt-4 mb-8">
          <div class="p-4 cursor-pointer" v-for="social of allSocials" :key="social.icon" @click="toSocial(social)">
            <base-icon :icon="social.icon" class="black" />
          </div>
        </div>
        <ul v-if="!route.query.touch" class="mt-5 flex justify-center">
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
import { CardComponent, BaseIcon } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import useSocials, { SocialLink } from '@/composables/useSocials'

export default defineComponent({
  name: 'TheFooter',
  components: {
    CardComponent,
    BaseIcon,
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const { all: allSocials } = useSocials()

    const toSocial = (_social: SocialLink) => window.open(_social.link, '_blank')

    return {
      t,
      route,
      allSocials,
      toSocial,
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
.flanders-logo {
  max-width: 8rem;
}
</style>
