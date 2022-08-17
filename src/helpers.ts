type WeightedArrayConfig = {
  probability: number | '*'
}

type WeightedArrayConfigForArray<T> = {
  value: T
  probability: number | '*'
}

export const parseDateAsLocaleString = (date: Date): string => {
  return date.toLocaleDateString('nl-BE')
}

export const setKeyAsId = (key: string): string => {
  return key.includes('entities/') ? key.replace('entities/', '') : key
}

export const setIdAsKey = (id: string): string => {
  return id.includes('entities/') ? id : 'entities/' + id
}

export const randomizer = <T extends string>(input: Record<T, WeightedArrayConfig>): T | undefined => {
  let pickedValue: T | undefined = undefined
  let i,
    threshold = 0
  const randomNr = Math.random()

  const values: WeightedArrayConfigForArray<T>[] = []
  Object.keys(input).forEach((key) => {
    values.push({
      value: key as T,
      probability: input[key as T].probability,
    })
  })

  for (i = 0; i < values.length; i++) {
    if (values[i].probability === '*') {
      continue
    }

    threshold += values[i].probability as number
    if (threshold > randomNr) {
      pickedValue = values[i].value
      break
    }

    if (!pickedValue) {
      //nothing found based on probability value, so pick element marked with wildcard
      pickedValue = values.filter((value: WeightedArrayConfigForArray<T>) => value.probability === '*')[0].value
    }
  }

  return pickedValue
}
