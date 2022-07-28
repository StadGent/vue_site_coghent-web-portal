import { ref } from 'vue'

export enum UploadModalAction {
  new_upload = 'new_upload',
  edit_upload = 'edit_upload',
}

const uploadWizard = () => {
  const ASSET_ID_PARAM = 'asset'
  const TOTAL_STEPS = 6

  const definedActions = {
    [UploadModalAction.new_upload]: {
      steps: [...Array(TOTAL_STEPS).keys()].map((i) => i + 1),
    },
    [UploadModalAction.edit_upload]: {
      steps: [2, 3, 4],
    },
  }

  const actions = ref<any>(definedActions['new_upload'])

  const getActionValues = (_asset: string | null, _setStep: any) => {
    _asset !== null ? (actions.value = definedActions['edit_upload']) : null
    _setStep(actions.value.steps[0])
  }

  const canShowStep = (_step: number) => {
    return actions.value.steps.includes(_step)
  }

  return {
    ASSET_ID_PARAM,
    TOTAL_STEPS,
    getActionValues,
    actions,
    canShowStep,
  }
}

export default uploadWizard