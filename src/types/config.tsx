export type PriorityDataConfig = {
  toggleCEJSTRange: boolean
  toggleEJScreenRange: boolean
  toggleCiRange: boolean
  scoreType: 'composite' | 'individual'
  subIndicators: {
    [dataset: string]: Record<string, boolean>
  }
  census: {
    [dataset: string]: boolean
  }
  togglePopRange: boolean
  toggleLevRange: boolean
  toggleMultiFaRange: boolean
  toggleRentersRange: boolean
  toggleWalkableRange: boolean
  toggleDrivableRange: boolean
  // toggleCommercialRange: boolean
  // toggleResidentialRange: boolean
}

export type FeasibilityDataConfig = {
  toggleNeviFilterActive: boolean
  toggleirs30cFilterActive: boolean
  togglePgeRange: boolean
}
