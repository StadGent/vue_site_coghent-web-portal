<template>
  <VDropdown placement="top" :disabled="disabled">
    <slot></slot>
    <template #popper>
      <div class="p-4">
        <div v-for="(storybox, index) in userStoryboxes" v-show="userStoryboxes.length" :key="index">
          <input :id="storybox.id" v-model="storyBoxFormState" type="radio" :value="storybox.name" />
          <label :for="index" class="p-2">{{ storybox.name }}</label>
        </div>
        <div v-if="!userStoryboxes.length">
          <p class="text-center">{{ t('details.modal.createStorybox') }}</p>
        </div>
        <BaseButton v-close-popper :custom-style="storyBoxFormState ? 'primary' : 'primaryUnavailable'" :text="t('details.modal.addShort')" class="mt-4" :icon-shown="false" @click="emitButtonClick" />
      </div>
    </template>
  </VDropdown>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { apolloClient } from '@/app'
import { storyboxCount } from '@/pages/TheStoryboxPage.vue'
import { useStorybox, StoryBoxState } from 'coghent-vue-3-component-library'
import { Entity } from 'coghent-vue-3-component-library'

export type StoryboxDropdownInput = {
  id: string
  name: string
}

export default defineComponent({
  name: 'AddAssetToStoryboxDropdown',
  components: { BaseButton },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    entity: {
      type: Object as PropType<typeof Entity>,
      required: true,
    },
  },
  emits: ['addToStorybox'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const storyBoxFormState = ref<string>()
    const userStoryboxes = ref<StoryboxDropdownInput[]>([
      // { id: '1', name: 'First storybox' },
      // { id: '2', name: 'Second storybox' },
    ])

    const emitButtonClick = () => {
      if (storyBoxFormState.value) {
        const selectedStoryBoxId: string | undefined = userStoryboxes.value.find((userStorybox: StoryboxDropdownInput) => userStorybox.name == storyBoxFormState.value)?.id
        if (selectedStoryBoxId) {
          emit('addToStorybox', selectedStoryBoxId)
        }
      }
    }

    const assetIsInStorybox = (_storyboxId: string) => {}
    watch(
      () => props.entity,
      () => {
        for (const storybox of StoryBoxState.value.storyboxes) {
          const found = useStorybox(apolloClient).assetIsInStorybox(props.entity.id, storybox.id)
          if (found != undefined) {
            document.getElementById(storybox.id)?.setAttribute(`disabled`, `true`)
          } else {
            document.getElementById(storybox.id)?.setAttribute(`disabled`, `false`)
          }
        }
      }
    )

    onMounted(async () => {
      console.log({ StoryBoxState })
      StoryBoxState.value.storyboxes.map((_box: typeof Entity) => userStoryboxes.value.push({ id: _box.id, name: _box.title && _box.title[0] ? _box.title[0].value : _box.id }))
      storyboxCount.value = StoryBoxState.value.count
    })

    return {
      storyBoxFormState,
      userStoryboxes,
      emitButtonClick,
      t,
      assetIsInStorybox,
    }
  },
})
</script>
