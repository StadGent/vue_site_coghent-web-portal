import { ref } from 'vue'
import BaseStore from './BaseStore'

export const useAuthFeature = ref<boolean>(false)
export const useStoryboxFeature = ref<boolean>(false)
export const useGoogleFeature = ref<boolean>(false)
export const useTestimonyFeature = ref<boolean>(false)
export const useWorksFeature = ref<boolean>(false)
export const useCustomStorySubtitles = ref<boolean>(false)

export class ConfigStore extends BaseStore {
  id = 'ConfigStore'

  loading: boolean = false

  config = ref<any>({})

  get hasConfig(): boolean {
    return !!this.config.value
  }

  setConfig(config: any): void {
    this.config.value = config
    this.loading = false
  }

  setFeatureFlags(): void {
    useAuthFeature.value = this.config.value.features?.login ? this.config.value.features?.login : false
    useStoryboxFeature.value = this.config.value.features?.storybox ? this.config.value.features?.storybox : false
    useTestimonyFeature.value = this.config.value.features.testimony ? this.config.value.features.testimony : false
    useGoogleFeature.value = this.config.value.features?.googleTags ? this.config.value.features?.googleTags : false
    useWorksFeature.value = this.config.value.features?.myWorks ? this.config.value.features?.myWorks : false
    useCustomStorySubtitles.value = this.config.value.features?.customStorySubtitles ? this.config.value.features?.customStorySubtitles : false
  }
}
