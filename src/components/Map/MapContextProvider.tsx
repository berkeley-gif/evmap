import { createContext, useMemo, useState } from 'react'

import MapProps from '@lib/MapProps'

export interface MapContextValues {
  map: any | null
  setMap: (map: any | null) => void
  cityConfig: MapProps
  setCityConfig: (config: MapProps) => void
  currentView: string
  setCurrentView: (currentView: string) => void
}

const defaultCityConfig: MapProps = {
  // state: '',
  county: '',
  city: '',
  boundaryUrl: '',
  priorityDataUrl: '',
  feasibleDataUrl: '',
}

export const MapContext = createContext<MapContextValues>({
  map: null,
  setMap: () => {
    throw new Error('setMap called outside of MapContextProvider')
  },
  cityConfig: defaultCityConfig,
  setCityConfig: () => {
    throw new Error('setCityConfig called outside of MapContextProvider')
  },
  currentView: 'default',
  setCurrentView: () => {
    throw new Error('setCurrentView called outside of MapContextProvider')
  },
})

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [map, setMap] = useState<any | null>(null)
  const [cityConfig, setCityConfig] = useState<MapProps>(defaultCityConfig)
  const [currentView, setCurrentView] = useState('default')

  const contextValue = useMemo(
    () => ({ map, setMap, cityConfig, setCityConfig, currentView, setCurrentView }),
    [map, cityConfig],
  )

  return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
}

export default MapContextProvider
