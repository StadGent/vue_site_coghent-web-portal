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
import { defineComponent, ref } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'

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

    return {
      storyBoxFormState,
      userStoryboxes,
      emitButtonClick,
      t,
    }
  },
})
</script>
