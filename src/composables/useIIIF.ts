import { ConfigStore } from '@/stores/ConfigStore'
import StoreFactory from '@/stores/StoreFactory'

const useIIIF = () => {
  const configStore = StoreFactory.get(ConfigStore)
  const iiifUrl = configStore.config.value.iiifLink
  const storageLink = configStore.config.value.storageLink

  const noImageUrl = '/no-image.png'

  const generateUrl = (filename: string, format: 'square' | 'full', size: number = 1000) => {
    // return `${iiifUrl}iiif/3/${filename}/${format}/${size},/0/default.jpg`
    return `${storageLink}download/${filename}`
  }

  return {
    noImageUrl,
    generateUrl,
  }
}

export default useIIIF
