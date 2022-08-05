import { useI18n } from 'vue-i18n'

export type MenuItem = {
  id: string
  title: string
  link: string
  localLink: boolean
  requireAuth: boolean
  isVisible: boolean
}

const useMenu = () => {
  const { t } = useI18n()
  const mobileItems: Array<MenuItem> = [
    {
      id: `Ontdek de collectie`,
      title: t(`header.discover`),
      link: `/home`,
      localLink: true,
      requireAuth: false,
      isVisible: true,
    },
    {
      id: `CoGent-box`,
      title: t(`header.coghentBox`),
      link: `https://www.collectie.gent/cogent-box`,
      localLink: false,
      requireAuth: false,
      isVisible: true,
    },
    {
      id: `Over het project`,
      title: t(`header.about`),
      link: `https://www.collectie.gent/over-het-project`,
      localLink: false,
      requireAuth: false,
      isVisible: true,
    },
    {
      id: `Storybox`,
      title: t(`buttons.storybox`),
      link: `/myStories`,
      localLink: true,
      requireAuth: true,
      isVisible: true,
    },
    {
      id: `Works`,
      title: t(`profile.works`),
      link: `/myworks`,
      localLink: true,
      requireAuth: true,
      isVisible: true,
    },
    {
      id: `Testimoni`,
      title: t(`profile.testimonies`),
      link: `/mytestimonies`,
      localLink: true,
      requireAuth: true,
      isVisible: false,
    },
  ]
  const bottomMobileItems: Array<MenuItem> = [
    {
      id: `Profiel`,
      title: t(`header.profile`),
      link: `/profile`,
      localLink: true,
      requireAuth: true,
      isVisible: true,
    },
  ]

  const headerItems: Array<MenuItem> = [
    {
      id: `CoGent-box`,
      title: t(`header.coghentBox`),
      link: `https://www.collectie.gent/cogent-box`,
      localLink: false,
      requireAuth: false,
      isVisible: true,
    },
    {
      id: `Over het project`,
      title: t(`header.about`),
      link: `https://www.collectie.gent/over-het-project`,
      localLink: false,
      requireAuth: false,
      isVisible: true,
    },
  ]

  return {
    mobileItems,
    bottomMobileItems,
    headerItems,
  }
}

export default useMenu
