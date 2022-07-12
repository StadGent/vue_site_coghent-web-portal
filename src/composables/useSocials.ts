export type SocialLink = {
  icon: string,
  link: string,
}
const useSocials = () => {
  const all: Array<SocialLink> = [
    {
      icon: `facebook`,
      link: `http://www.facebook.com/Collectievandegentenaar/`
    },
    {
      icon: `instagram`,
      link: `https://www.instagram.com/collectievandegentenaar/`
    },
    {
      icon: `twitter`,
      link: `https://twitter.com/coghent`
    },
  ]

  return {
    all
  }
}

export default useSocials