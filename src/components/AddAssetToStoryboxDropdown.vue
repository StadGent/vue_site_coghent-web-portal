<template>
  <VDropdown placement="top" :disabled="disabled">
    <slot></slot>
    <template #popper>
      <div class="p-4">
        <div v-show="userStoryboxes.length" v-for="(storybox, index) in userStoryboxes" :key="index">
          <input type="radio" :id="index" :value="storybox.name" v-model="storyBoxFormState" />
          <label :for="index" class="p-2">{{ storybox.name }}</label>
        </div>
        <div v-if="!userStoryboxes.length">
          <p class="text-center">{{ t('details.modal.createStorybox') }}</p>
        </div>
        <BaseButton :customStyle="storyBoxFormState ? 'primary' : 'primaryUnavailable'" :text="t('details.modal.addShort')" class="mt-4" @click="emitButtonClick" :iconShown="false" />
      </div>
    </template>
  </VDropdown>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
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

    onMounted(async () => {
      await useStorybox(apolloClient).getStoryboxes()
      console.log({ StoryBoxState })
      StoryBoxState.value.storyboxes.map((_box: typeof Entity) => userStoryboxes.value.push({ id: _box.id, name: _box.title && _box.title[0] ? _box.title[0].value : _box.id }))
      storyboxCount.value = StoryBoxState.value.count
    })

    return {
      storyBoxFormState,
      userStoryboxes,
      emitButtonClick,
      t,
    }
  },
})
</script>
