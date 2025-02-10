import { useContext } from 'react'

import { MapContext } from './MapContextProvider'

const useMapContext = () => {
  const mapInstance = useContext(MapContext)
  const map = mapInstance?.map
  const setMap = mapInstance?.setMap
  const cityConfig = mapInstance?.cityConfig
  const setCityConfig = mapInstance?.setCityConfig
  return { map, setMap, cityConfig, setCityConfig }
}

export default useMapContext
