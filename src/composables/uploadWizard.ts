import { apolloClient } from '@/app'
import { MetaKey, uploadState, Metadata } from 'coghent-vue-3-component-library'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export enum UploadModalAction {
  new_upload = 'new_upload',
  edit_upload = 'edit_upload',
}

export type MetadataQuestion = {
  text: string
  answer: string | null
  key: typeof MetaKey | null
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
      showPreviousInSteps: [3, 4, 5],
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
  const assetId = ref<null | string>(null)

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
      assetId.value = _asset
      actions.value = definedActions['edit_upload']
      const comp = await _getUploadComposable(_asset, apolloClient)
      console.log({ comp });
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

  const getMetadataWithQuestions = () => {
    const { t } = useI18n()
    const metadata: Array<any> = []
    const metaTags: Array<typeof MetaKey> = ['title', 'description', 'maker', 'periode']
    for (let index = 1;index <= 4;index++) {
      const match = uploadState.metadata.find((meta: typeof Metadata) => meta.key === metaTags[index - 1])
      metadata.push({
        text: t(`myWorks.upload.stepThree.metadata.q${index}`),
        answer: match !== undefined ? match.value : null,
        key: metaTags[index - 1],
      })
    }
    return metadata
  }

  return {
    ASSET_ID_PARAM,
    TOTAL_STEPS,
    getActionValues,
    actions,
    assetId,
    canShowStep,
    isModeEdit,
    isModeUploadNew,
    showPreviousButton,
    getMetadataWithQuestions,
  }
}

export default uploadWizard