<template>
  <!--Details modal-->
  <base-modal v-model:isShow="openModal" class="z-50 p-10">
    <section class="flex w-11/12">
      <section id="column" class="bg-background-light">
        <section id="title" class="px-10">
          <h1 class="text-2xl font-black my-8">
            {{ result.Entity?.title[0]?.value }}
          </h1>
          <p>
            <strong>{{ t('details.modal.objectNumber') }}</strong> ongekend
          </p>
          <p>
            <strong>{{ t('details.modal.objectName') }}</strong> ongekend
          </p>
        </section>
        <section
          v-if="photos"
          id="mediafiles"
          class="h-96 mt-10 w-max overflow-x-auto px-10"
        >
          <img
            v-for="photo in photos"
            :key="photo"
            class="mb-5 w-96"
            :src="replaceStringStorageApi(photo)"
          >
        </section>
      </section>
      <section id="content" class="h-auto overflow-x-auto pl-10 flex-col w-8/12 pt-16">
        <div v-for="metaData in result.Entity?.metadata" :key="metaData.value" class="pt-5 font-light">
          <p v-show="metaData.key === 'description'" class="">
            {{ metaData.value }}
          </p>
        </div>
        <div class="font-medium pb-2">
          <relation-tag v-for="relation in result.Entity?.relations" :id="relation.key" :key="relation.value" class="bg-tag-neutral" />
        </div>
        <h1 class="font-bold text-md mt-5">
          {{ t('details.modal.associations') }}
        </h1>
        <div class="mt-5 flex gap-3">
          <p v-for="type in types" :key="type" class="px-2 py-2 bg-tag-neutral cursor-pointer mr-4 bg-opacity-50">
            {{ type }}
          </p>
        </div>
      </section>
    </section>
    <section id="footer" class="flex items-center justify-center bg-background-light p-10">
      <base-button class="w-max" :text="t('details.modal.link')" :on-click="onClick" custom-style="ghost-black" custom-icon="link" :icon-shown="true" />
      <div class="border-r-2 h-6 border-text-dark border-opacity-70 mx-6" />
      <base-button class="w-max" :text="t('details.modal.edit')" :on-click="onClick" custom-style="ghost-black" custom-icon="edit" :icon-shown="true" />
      <div class="border-r-2 align-center h-6 border-text-dark border-opacity-70 mx-6" />
      <base-button class="w-max" :text="t('details.modal.add')" :on-click="onClick" custom-style="ghost-purple" custom-icon="storybox" :icon-shown="true" />
    </section>
  </base-modal>

  <!-- main-->
  <div v-if="result" class="grid grid-cols-2 mt-20">
    <section class="flex items-center justify-between px-10">
      <the-carousel v-if="photos" :source="photos" />
    </section>
    <CardComponent v-if="result" :large="true">
      <div class="flex flex-col bg-background-medium px-10 py-10">
        <h1 class="text-lg font-bold">
          {{ result.Entity?.title[0]?.value }}
        </h1>
        <div v-for="metaData in result.Entity?.metadata" :key="metaData.value" class="pt-5 font-light">
          <p v-show="metaData.key === 'description'">
            {{ metaData.value }}
          </p>
        </div>
        <div class="pt-5 font-medium">
          <span v-for="metaData in result.Entity?.metadata" v-show="metaData.key === 'type'" :key="metaData.value" class="inline-block px-2 py-2 bg-background-dark mr-4 bg-opacity-50">{{
            metaData.value
          }}</span>
        </div>
        <base-button class="inline⁻block w-max" :text="t('details.more')" custom-style="ghost-black" custom-icon="info" :icon-shown="true" :on-click="openInfoModal" />
      </div>
    </CardComponent>
    <section class="col-span-2">
      <h2 class="font-bold text-2xl w-full text-center pt-10">
        {{ t('details.discover') }}
      </h2>
      <div class="pt-5 font-medium pb-2">
        <relation-tag v-for="relation in result.Entity?.relations" :id="relation.key" :key="relation.value" @click="setRelation(relation.key)" />
      </div>
      <the-masonry v-if="resultRelation" :small="true" :entities="resultRelation.Entities" :loading="loadingRelation" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument, GetFullEntitiesDocument, TheCarousel, CardComponent, BaseButton, BaseModal } from 'coghent-vue-3-component-library'
import RelationTag from './RelationTag.vue'
import TheMasonry from './TheMasonry.vue'
import { useI18n } from 'vue-i18n'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export default defineComponent({
  name: 'EntityDetails',
  components: { RelationTag, TheMasonry, CardComponent, TheCarousel, BaseButton, BaseModal },
  setup: () => {
    const id = asString(useRoute().params['entityID'])
    const { result, onResult } = useQuery(GetEntityByIdDocument, { id })
    const selectedImageIndex = ref<number>(0)
    const relations = ref([])
    const photos = ref<string[] | undefined>()
    const openModal = ref<Boolean>(false)
    const types = ref<any[] | undefined>()

    const {
      result: resultRelation,
      loading: loadingRelation,
      variables,
    } = useQuery<any>(GetFullEntitiesDocument, {
      searchValue: { value: 'niets' },
    })

    const setRelation = (id: string) => {
      variables.value = {
        searchValue: {
          raw: true,
          value:
            `{
        "query": {
          "nested": {
            "path": "relations",
            "query": {
              "bool": {
                "must": [
                  { "match": { "relations.key": "` +
            id +
            `" }}
                ]
              }
            }
          }
        }
      }`,
        },
      }
    }

    const onClick = () => {
      console.log('Click', result.value)
    }

    const openInfoModal = () => {
      openModal.value = true
      console.log(openModal.value)
    }

    const replaceStringStorageApi = (input: string) => {
      return input.replace("storage-api", "localhost");
    };

    onResult((queryResult: any) => {
      const photosArray: string[] = []
      queryResult.data.Entity?.mediafiles.forEach((value: any) => {
        console.log(value)
        if (value.original_file_location) {
          photosArray.push(value.original_file_location)
        }
      })
      photos.value = photosArray

      const typeArray: any[] = []
      queryResult.data.Entity?.metadata.forEach((value: any) => {
        if (value.key === 'type') {
          typeArray.push(value.value)
        }
      })
      types.value = typeArray
    })

    const { t } = useI18n()

    return { result, selectedImageIndex, relations, 
    resultRelation, setRelation, loadingRelation, t, photos, openInfoModal, openModal, onClick, types, replaceStringStorageApi}
  },
})
</script>

<style scoped></style>
