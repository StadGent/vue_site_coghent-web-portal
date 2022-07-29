import { apolloClient } from '@/app'
import { ref, watch } from 'vue'

export enum UploadModalAction {
  new_upload = 'new_upload',
  edit_upload = 'edit_upload',
}

const uploadWizard = () => {
  const ASSET_ID_PARAM = 'asset'
  const TOTAL_STEPS = 6
  const isModeEdit = ref<boolean>(false)
  const isModeUploadNew = ref<boolean>(true)

  const definedActions = {
    [UploadModalAction.new_upload]: {
      type: UploadModalAction.new_upload,
      steps: [...Array(TOTAL_STEPS).keys()].map((i) => i + 1),
      showPreviousInSteps: [2, 3, 4, 5],
      upload: null
    },
    [UploadModalAction.edit_upload]: {
      type: UploadModalAction.edit_upload,
      steps: [3, 4, 5, 6],
      showPreviousInSteps: [4, 5],
      upload: null
    },
  }

  const actions = ref<any>(definedActions['new_upload'])

  watch(() => actions.value.type, (type) => {
    switch (type) {
      case UploadModalAction.edit_upload:
        isModeEdit.value = true
        isModeUploadNew.value = false
        break
      default:
        isModeEdit.value = false
        isModeUploadNew.value = true
    }
  })

  const getActionValues = async (_asset: string | null, _setStep: any, _getUploadComposable: any) => {
    if (_asset) {
      actions.value = definedActions['edit_upload']
      const comp = await _getUploadComposable(_asset, apolloClient)
      actions.value.upload = comp
      console.log(`ASSET ID`, _asset);
    }
    _setStep(actions.value.steps[0])
  }

  const canShowStep = (_step: number) => {
    return actions.value.steps.includes(_step)
  }

  const showPreviousButton = (_step: number) => {
    return actions.value.showPreviousInSteps.includes(_step)
  }

  return {
    ASSET_ID_PARAM,
    TOTAL_STEPS,
    getActionValues,
    actions,
    canShowStep,
    isModeEdit,
    isModeUploadNew,
    showPreviousButton,
  }
}

export default uploadWizard