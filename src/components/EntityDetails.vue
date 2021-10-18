<template>
  <!--Details modal-->
   <base-modal v-model:isShow="openModal" class="z-50">
    <section class="flex flex-col">
      <section class="flex flex-col lg:flex-row pt-10 md:pt-0">
        <section class="bg-background-light lg:w-11/12 lg:max-w-8/12">
          <h1 class="text-2xl font-black my-2 text-center lg:text-left lg:ml-6 mt-6">
            {{ result.Entity?.title[0]?.value }}
          </h1>
          <div class="m-3 lg:ml-6 lg:mt-6">
            <p>
              <strong>{{ t('details.modal.objectNumber') }}</strong> ongekend
            </p>
            <p>
              <strong>{{ t('details.modal.objectName') }}</strong> ongekend
            </p>
          </div>
          <div v-if="photos" class="flex flex-row lg:flex-col lg:h-96 overflow-x-auto">
            <img v-for="photo in photos" :key="photo" class="m-3 lg:ml-6 w-96 sm:w-96 lg:min-w-11/12" :src="photo" />
          </div>
        </section>
        <section class="bg-background-medium">
          <p v-show="result.Entity?.description && result.Entity?.description[0]" class="m-3 mt-6 lg:mr-10 lg:mt-20">
            {{ result.Entity?.description[0]?.value }}
          </p>
          <div class="font-medium pb-2">
            <relation-tag v-for="relation in result.Entity?.relations" :id="relation.key" :key="relation.value" class="bg-tag-neutral" />
          </div>
          <h3 class="font-bold text-lg mt-5 ml-3">
            {{ t('details.modal.characteristics') }}
          </h3>
          <ul class="mt-5 flex flex-col gap-3 ml-3">
            <li v-for="metaData in result.Entity?.metadata" :key="metaData.value" class="w-full inline-block">
              <strong class="mr-5">{{ metaData.key }}</strong> {{ metaData.value }}
            </li>
          </ul>
          <h3 class="font-bold text-lg mt-5 mb-3 ml-3">
            {{ t('details.modal.associations') }}
          </h3>
          <div class="mx-5 flex gap-3 ml-3">
            <p v-for="relationLabel in relationsLabelArray" :key="relationLabel" class="px-2 py-2 bg-tag-neutral mr-4 bg-opacity-50">
              {{ relationLabel }}
            </p>
          </div>
        </section>
      </section>
      <section id="footer" class="flex items-center justify-center bg-background-medium lg:bg-background-light p-2 lg:p-10 mb-3 lg:mb-0">
        <base-button class="w-12 h-12 pl-6 mt-3 ml-3 stroke-current text-text-black inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="link" :icon-shown="true" />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.link')" :on-click="onClick" custom-style="ghost-black" custom-icon="link" :icon-shown="true" />
        <div class="border-r-2 h-6 border-text-dark border-opacity-70 mx-6 hidden lg:inline-block" />
        <base-button class="w-12 h-12 pl-6 mt-3 ml-3 stroke-current text-text-black inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="edit" :icon-shown="true" />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.edit')" :on-click="onClick" custom-style="ghost-black" custom-icon="edit" :icon-shown="true" />
        <div class="border-r-2 align-center h-6 border-text-dark border-opacity-70 mx-6 hidden lg:inline-block" />
        <base-button class="w-12 h-12 pl-6 mt-3 ml-3 inline-block lg:hidden" :on-click="onClick" custom-style="secondary-round" custom-icon="storybox" :icon-shown="true" />
        <base-button class="w-max hidden lg:flex" :text="t('details.modal.add')" :on-click="onClick" custom-style="ghost-purple" custom-icon="storybox" :icon-shown="true" />
      </section>
    </section>
  </base-modal>

  <!-- main-->
  <div v-if="result" class="sm:grid sm:grid-cols-2 mt-20 flex-col">
    <section class="flex items-center justify-between px-10 mb-5 sm:mb-0">
      <the-carousel v-if="photos" :source="photos" />
    </section>
    <CardComponent v-if="result" :large="true" class="mx-4 sm:mx-0">
      <div class="flex flex-col bg-background-medium px-10 py-10">
        <h1 class="text-lg font-bold">
          {{ result.Entity?.title[0]?.value }}
        </h1>
        <div class="pt-5 font-light">
          <p v-show="result.Entity?.description && result.Entity?.description[0]">
            {{ result.Entity?.description[0]?.value }}
          </p>
        </div>
        <div class="pt-5 font-medium">
          <span v-for="metaData in result.Entity?.metadata" v-show="metaData.key === 'type'" :key="metaData.value" class="inline-block px-2 py-2 bg-background-dark mr-4 bg-opacity-50">{{
            metaData.value
          }}</span>
        </div>
        <base-button class="inline⁻block w-max ml-3 mt-3" :text="t('details.more')" custom-style="ghost-black" custom-icon="info" :icon-shown="true" :on-click="openInfoModal" />
      </div>
    </CardComponent>
    <section class="col-span-2">
      <h2 class="font-bold text-2xl w-full text-center pt-10">
        {{ t('details.discover') }}
      </h2>
      <the-grid v-if="relationStringArray.length > 0" :small="true" :default-relations="relationStringArray" />
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument, GetFullEntitiesDocument, TheCarousel, CardComponent, BaseButton, BaseModal, FullRelationFragment } from 'coghent-vue-3-component-library'
import RelationTag from './RelationTag.vue'
import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export default defineComponent({
  name: 'EntityDetails',
  components: {
    RelationTag,
    TheGrid,
    CardComponent,
    TheCarousel,
    BaseButton,
    BaseModal,
  },
  setup: () => {
    const id = asString(useRoute().params['entityID'])
    const { result, onResult } = useQuery(GetEntityByIdDocument, { id })
    const selectedImageIndex = ref<number>(0)
    const relations = ref([])
    const photos = ref<string[] | undefined>()
    const openModal = ref<Boolean>(false)
    const types = ref<any[] | undefined>()
    const relationStringArray = ref<string[]>([])
    const relationsLabelArray = ref<string[]>([])

    const onClick = () => {
      console.log('Click', result.value)
    }

    const openInfoModal = () => {
      openModal.value = true
      console.log(openModal.value)
    }

    onResult((queryResult: any) => {
      const photosArray: string[] = []
      queryResult.data.Entity?.mediafiles.forEach((value: any) => {
        console.log(value)
        if (value.original_file_location) {
          photosArray.push(value.original_file_location)
        }
      })
      photos.value = photosArray

      queryResult.data.Entity?.relations
        .filter((filter: FullRelationFragment) => filter.label && filter.label !== '')
        .forEach((relation: any) => {
          relationStringArray.value.push(relation.key)
          relation.label && relationsLabelArray.value.push(relation.label)
        })

      const typeArray: any[] = []
      queryResult.data.Entity?.metadata.forEach((value: any) => {
        if (value.key === 'type') {
          typeArray.push(value.value)
        }
      })
      types.value = typeArray
    })

    const { t } = useI18n()

    return {
      result,
      selectedImageIndex,
      relations,
      t,
      photos,
      openInfoModal,
      openModal,
      onClick,
      types,
      relationStringArray,
      relationsLabelArray
    }
  },
})
</script>

<style scoped></style>
