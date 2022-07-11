import { useI18n } from 'vue-i18n'

export type MenuItem = {
  id: string,
  title: string,
  link: string,
  localLink: boolean,
  requireAuth: boolean
}

const useMenu = () => {
  const { t } = useI18n()
  const mobileItems: Array<MenuItem> = [
    {
      id: `Ontdek de collectie`,
      title: t(`header.discover`),
      link: `/home`,
      localLink: true,
      requireAuth: false
    },
    {
      id: `CoGent-box`,
      title: t(`header.coghentBox`),
      link: `https://www.collectie.gent/cogent-box`,
      localLink: false,
      requireAuth: false
    },
    {
      id: `Over het project`,
      title: t(`header.about`),
      link: `https://www.collectie.gent/over-het-project`,
      localLink: false,
      requireAuth: false
    },
    {
      id: `Storybox`,
      title: t(`buttons.storybox`),
      link: `/myStories`,
      localLink: true,
      requireAuth: true
    },
  ]
  const bottomMobileItems: Array<MenuItem> = [
    {
      id: `Profiel`,
      title: t(`header.profile`),
      link: `/profile`,
      localLink: true,
      requireAuth: true
    },
  ]

  return {
    mobileItems,
    bottomMobileItems,
  }
}

export default useMenu