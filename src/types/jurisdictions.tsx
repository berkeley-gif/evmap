export type State = {
  id: string
  name: string
  available: boolean
  counties: County[]
}

export type County = {
  id: string
  name: string
  available: boolean
  cities: City[]
}

export type City = {
  id: string
  name: string
  available: boolean
  noUtilityData?: boolean
  provider?: string
}
