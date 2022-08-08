import { useTestimonyFeature, useWorksFeature, useStoryboxFeature } from '@/app'
import { useI18n } from 'vue-i18n'

export type MenuItem = {
  id: string
  title: string
  link: string
  localLink: boolean
  requireAuth: boolean
  isVisible: boolean
  linkIsActive?: boolean
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
      title: t(`profile.stories`),
      link: `/myStories`,
      localLink: true,
      requireAuth: true,
      isVisible: useStoryboxFeature.value,
    },
    {
      id: `Works`,
      title: t(`profile.works`),
      link: `/myworks`,
      localLink: true,
      requireAuth: true,
      isVisible: useWorksFeature.value,
    },
    {
      id: `Testimoni`,
      title: t(`profile.testimonies`),
      link: `/mytestimonies`,
      localLink: true,
      requireAuth: true,
      isVisible: useTestimonyFeature.value,
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

  const profileSideMenuItems: Array<MenuItem> = [
    {
      id: `Details`,
      title: t(`profile.details`),
      link: `/profile`,
      localLink: true,
      requireAuth: true,
      isVisible: true,
      linkIsActive: false,
    },
    {
      id: `Storybox`,
      title: t(`profile.stories`),
      link: `/mystories`,
      localLink: true,
      requireAuth: true,
      isVisible: useStoryboxFeature.value,
      linkIsActive: false,
    },
    {
      id: `Works`,
      title: t(`profile.works`),
      link: `/myworks`,
      localLink: true,
      requireAuth: true,
      isVisible: useWorksFeature.value,
      linkIsActive: false,
    },
    {
      id: `Testimoni`,
      title: t(`profile.testimonies`),
      link: `/mytestimonies`,
      localLink: true,
      requireAuth: true,
      isVisible: useTestimonyFeature.value,
      linkIsActive: false,
    },
  ]

  return {
    mobileItems,
    bottomMobileItems,
    headerItems,
    profileSideMenuItems,
  }
}

export default useMenu
