import { ConfigStore } from '@/stores/ConfigStore'
import StoreFactory from '@/stores/StoreFactory'

export type SocialLink = {
  icon: string
  link: string
}
const useSocials = () => {
  const configStore = StoreFactory.get(ConfigStore)

  let all: Array<SocialLink> = []

  const setSocials = () => {
    all = []
    const socials = configStore.config.value.socialMedia
    for (const key in socials) {
      if (socials[key] != undefined) {
        all.push({
          icon: key,
          link: socials[key],
        } as SocialLink)
      }
    }
  }

  setSocials()

  return {
    all,
  }
}

export default useSocials
