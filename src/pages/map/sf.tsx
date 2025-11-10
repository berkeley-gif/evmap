import useMapContext from '@map/useMapContext'
import { useEffect } from 'react'

import { makeCityConfig } from '@src/utils/makeCityConfig'

import { Map } from './index'

const SFEmbed = () => {
  const { setCityConfig } = useMapContext()

  useEffect(() => {
    const sf = 'san_francisco'
    const config = makeCityConfig(sf, sf)
    setCityConfig(config)
  }, [setCityConfig])

  return (
    <div className="w-full h-screen">
      <Map setCurrentView={() => {}} />
    </div>
  )
}

export default SFEmbed
