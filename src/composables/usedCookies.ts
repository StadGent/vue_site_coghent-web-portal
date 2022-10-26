export const usedCookies = [
  {
    tag: '_ga',
    name: 'Statistieken',
    description:
      'We gebruiken deze cookies om statische informatie over onze website te verstrekken - ze worden gebruikt voor prestatiemetingen en verbeteringen. Deze categorie wordt ook wel Analytics genoemd.',
  },
]

export const getCookieTags = () => {
  return usedCookies.map((cookie) => cookie.tag)
}
