import Leaflet from 'leaflet'
import { createContext, useMemo, useState } from 'react'

import MapProps from '@lib/MapProps'

export interface MapContextValues {
  map: Leaflet.Map | undefined
  setMap: (map: Leaflet.Map | undefined) => void
  cityConfig: MapProps | undefined
  setCityConfig: (config: MapProps) => void
}

export const MapContext = createContext<MapContextValues | undefined>(undefined)

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [map, setMap] = useState<Leaflet.Map | undefined>(undefined)
  const [cityConfig, setCityConfig] = useState<MapProps | undefined>(undefined)

  // return (
  //   <MapContext.Provider value={{ map, setMap, cityConfig, setCityConfig }}>{children}</MapContext.Provider>
  // )
  // const contextValue = useMemo(() => ({ map, setMap, cityConfig, setCityConfig }), [map, cityConfig])

  const contextValue = useMemo(() => ({ map, setMap, cityConfig, setCityConfig }), [map, cityConfig])

  return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
}

export default MapContextProvider
