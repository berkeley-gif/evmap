import { useContext } from 'react'

import { MapContext } from './MapContextProvider'

const useMapContext = () => {
  const { map, setMap, cityConfig, setCityConfig, currentView, setCurrentView } = useContext(MapContext)
  return { map, setMap, cityConfig, setCityConfig, currentView, setCurrentView }
}

export default useMapContext
