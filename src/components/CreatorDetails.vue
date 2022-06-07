<template>
  <div v-if="result" class="w-full overflow-x-hidden">
    <div class="grid sm:grid-cols-2 sm:gap-3 h-auto w-full px-3">
      <div v-if="person" class="pb-0 sm:pb-24">
        <section>
          <div>
            <base-button
              v-if="currentPage"
              class="inline⁻block w-full"
              :text="t('creator.goBack') + ' ' + currentPage.name"
              custom-style="details-black"
              custom-icon="arrowLeftLine"
              :icon-shown="true"
              @click="goToPreviousPage"
            />
          </div>
          <h1 class="md:text-5xl sm:text-4xl text-3xl font-bold w-full py-10 block leading-normal">{{ person.fullName }}</h1>
        </section>
        <div class="w-screen">
          <base-meta-data-tab :tab-names="tabs" :hidden="true" />
        </div>
        <section v-if="person.extraInfo.length">
          <base-meta-data v-for="(info, index) in person.extraInfo" :key="index" :key-word="t('creator.' + info.key)" :type="info.value" :error-text="t('details.modal.unknown')" class="w-full" />
        </section>
        <section v-else>
          <p>{{ t('creator.noMetadata') }}</p>
        </section>
      </div>
      <div class="w-full justify-center items-center">
        <img src="" class="w-auto" />
      </div>
    </div>
    <div class="flex flex-col w-full px-3">
      <h2 class="md:text-5xl sm:text-4xl text-3xl font-bold w-full text-center py-10 block leading-normal">{{ t('creator.moreWorks') + ' ' + person.fullName }}</h2>
      <the-grid :small="true" :no-header="true" class="sm:mt-24" :default-relations="['entities/' + id]" :no-filters="true" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import TheGrid from './TheGrid.vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetCreatorByIdDocument, GetEntityByIdDocument, BaseButton, BaseMetaData, BaseMetaDataTab, FullRelationFragment } from 'coghent-vue-3-component-library'
import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries'
import { useHistory } from './BreadCrumbs.vue'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export type Metadata = {
  key: string
  value: string
}

export type Person = {
  fullName?: string
  extraInfo?: Metadata[]
}

export default defineComponent({
  name: 'CreatorDetails',
  components: {
    BaseButton,
    BaseMetaData,
    BaseMetaDataTab,
    TheGrid,
  },
  props: {},
  setup: () => {
    const { t } = useI18n()
    const id = asString(useRoute().params['creatorID'])
    const { result, onResult } = useQuery(GetCreatorByIdDocument, { id })
    const { result: additionalMetaDataResult, onResult: onAdditionalMetaDataResult, refetch: additionalMetaDataRefetch } = useQuery(GetEntityByIdDocument, { id: '' })
    const router = useRouter()
    const route = useRoute()
    const metadata = ref<Metadata[]>()
    const person = ref<Person>()
    const tabs: Array<string> = ['Design Museum Gent', 'STAM', 'Industriemuseum']
    const additionalInfoIds: Array<string> = []
    const { currentPage } = useHistory()

    const goToPreviousPage = () => {
      router.go(-1)
    }

    const getNameFromMetadata = (key: string) => {
      if (metadata.value) {
        const foundItem = metadata.value.find((element) => element.key == key)
        metadata.value = metadata.value.filter((element) => element != foundItem)
        return foundItem?.value
      }
    }

    const createObjectFromAdditionalData = (entity: any): Array<Metadata> => {
      const objects: Array<Metadata> = []
      entity.metadataCollection.forEach((collection: any) => {
        const dataObject: Metadata = {
          key: entity.type + '_' + collection.label,
          value: collection.data[0].value,
        }
        objects.push(dataObject)
      })
      return objects
    }

    const getDataFromRelations = (relations: Relation[], relationLabels: string[]) => {
      relations.forEach((relation) => {
        if (relationLabels.find((relationlabel: string) => relationlabel == relation.label) && relation.label && relation.value) {
          const dataObject: Metadata = {
            key: relation.label,
            value: relation.value,
          }
          if (person.value?.extraInfo) {
            person.value?.extraInfo.push(dataObject)
          } else if (person.value) {
            person.value.extraInfo = [dataObject]
          }
        }
      })
    }

    onResult((queryResult: any) => {
      if (!queryResult.error) {
        const tempMetadata: Array<Metadata> = queryResult.data.Entity?.metadata
        metadata.value = tempMetadata.filter((item) => item.value != '')
        person.value = {
          fullName: getNameFromMetadata('fullname'),
          extraInfo: metadata.value,
        }

        getDataFromRelations(queryResult.data.Entity.relations, ['geslacht'])

        queryResult.data.Entity?.relations.forEach((relation: Relation) => {
          if (relation.label == 'heeftGeboorte' || relation.label == 'heeftOverlijden') {
            additionalInfoIds.push(relation.key)
          }
        })

        if (additionalInfoIds) {
          additionalInfoIds.forEach((url) => {
            const id = url.replace('entities/', '')
            additionalMetaDataRefetch({ id })
          })
        }
      } else {
        router.push({ path: '/entity/not-found', query: route.query })
      }
    })

    onAdditionalMetaDataResult((queryResult) => {
      if (queryResult.data?.Entity) {
        const entity = queryResult.data.Entity
        const infoArray: Array<Metadata> = createObjectFromAdditionalData(entity)

        infoArray.forEach((info: Metadata) => {
          if (person.value?.extraInfo) {
            person.value?.extraInfo.push(info)
          } else if (person.value) {
            person.value.extraInfo = metadata.value
          }
        })
      }
    })

    watch(
      () => metadata?.value?.length,
      () => {
        if (metadata?.value) {
          let ordering: any = {}
          const sortOrder = ['firstname', 'lastname', 'birth_datum', 'birth_plaats', 'death_datum', 'death_plaats']
          for (let i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i

          metadata.value.sort(function (a: Metadata, b: Metadata) {
            return ordering[a.key] - ordering[b.key]
          })
        }
      }
    )

    return {
      t,
      tabs,
      goToPreviousPage,
      route,
      person,
      result,
      id,
      currentPage,
    }
  },
})
</script>
