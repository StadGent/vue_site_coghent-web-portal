import { ConfigStore } from '@/stores/ConfigStore'
import StoreFactory from '@/stores/StoreFactory'

const useIIIF = () => {
  const configStore = StoreFactory.get(ConfigStore)
  const iiifUrl = configStore.config.value.iiifLink

  const generateUrl = (filename: string, format: 'square' | 'full', size: number = 1000) => {
    return `${iiifUrl}iiif/3/${filename}/${format}/,${size}/0/default.jpg`
  }

  return {
    generateUrl,
  }
}

export default useIIIF
