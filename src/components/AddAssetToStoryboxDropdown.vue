<template>
  <VDropdown placement="top" :disabled="disabled">
    <slot></slot>
    <template #popper>
      <div class="p-4">
        <div v-for="(storybox, index) in userStoryboxes" v-show="userStoryboxes.length" :key="index" @change="setStatusForStorybox(storybox)">
          <input :id="storybox.id" v-model="storybox.checked" type="checkbox" :value="storybox.name" :disabled="storybox.added" />
          <label :for="index" class="p-2">{{ storybox.name }}</label>
        </div>
        <div v-if="!userStoryboxes.length">
          <p class="text-center">{{ t('details.modal.createStorybox') }}</p>
        </div>
        <BaseButton
          v-close-popper
          :custom-style="canAddToStoryboxes === true ? 'primary' : 'primaryUnavailable'"
          :text="t('details.modal.addShort')"
          class="mt-4"
          :icon-shown="false"
          @click="emitButtonClick"
        />
      </div>
    </template>
  </VDropdown>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { BaseButton } from 'coghent-vue-3-component-library'
import { useI18n } from 'vue-i18n'
import { apolloClient, storyboxCount } from '@/app'
import { useStorybox, StoryBoxState } from 'coghent-vue-3-component-library'
import { Entity } from 'coghent-vue-3-component-library'
import { getMetadataOfTypeFromEntity } from 'coghent-vue-3-component-library'

export type StoryboxDropdownInput = {
  id: string
  name: string
  checked: boolean
  added: boolean
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
    trigger: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['addToStorybox'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const canAddToStoryboxes = ref<boolean>(false)
    const userStoryboxes = ref<StoryboxDropdownInput[]>([])

    const emitButtonClick = async () => {
      const idsToAdd: Array<string> = []
      if (canAddToStoryboxes.value) {
        for (const box of userStoryboxes.value) {
          if (box.added === false && box.checked === true) idsToAdd.push(box.id)
        }
        emit('addToStorybox', idsToAdd)
      }
    }

    const cannotAdd = (_boxId: string) => {
      const doNotAdd: Array<boolean> = []
      const assetsInBox = useStorybox(apolloClient).getStoryboxAssetAmount(_boxId)
      doNotAdd.push(!(assetsInBox < 10))
      const found = useStorybox(apolloClient).assetIsInStorybox(props.entity, _boxId)
      doNotAdd.push(found ? true : false)
      return doNotAdd.some((state) => state === true)
    }

    const checkIfStoryBoxesCanBeAdded = () => {
      userStoryboxes.value.some((_object) => _object.checked === true && _object.added === false) === true ? (canAddToStoryboxes.value = true) : (canAddToStoryboxes.value = false)
    }

    const setStatusForStorybox = (_storybox: StoryboxDropdownInput) => {
      checkIfStoryBoxesCanBeAdded()
    }

    const _init_ = () => {
      userStoryboxes.value = []
      StoryBoxState.value.storyboxes.forEach((_box: typeof Entity) => {
        const title = getMetadataOfTypeFromEntity(_box, 'title')
        userStoryboxes.value.push({ id: _box.id, name: title ? title.value : _box.id, checked: cannotAdd(_box.id), added: cannotAdd(_box.id) })
      })
      canAddToStoryboxes.value = userStoryboxes.value.some((_obj) => _obj.added === false)
      storyboxCount.value = StoryBoxState.value.count
    }

    watch(
      () => props.trigger,
      (isTriggered) => _init_()
    )

    return {
      canAddToStoryboxes,
      userStoryboxes,
      emitButtonClick,
      t,
      cannotAdd,
      setStatusForStorybox,
    }
  },
})
</script>
