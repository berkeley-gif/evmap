import type { LatLngExpression, MapOptions } from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

import useMapContext from './useMapContext'

interface LeafletMapProps extends MapOptions {
  center: LatLngExpression
  zoom: number
  children?: React.ReactNode // Cleaner typing that supports single, multiple, or conditional elements
}

export const LeafletMapContainer: React.FC<LeafletMapProps> = ({
  children,
  ...mapOptions
}) => {
  const { setMap } = useMapContext()

  // Clean up context when the map component unmounts
  useEffect(() => () => setMap?.(null), [setMap])

  return (
    <MapContainer
      ref={(e) => {
        if (e && setMap) setMap(e)
      }}
      className="w-full h-full absolute outline-0 text-white"
      {...mapOptions} // This no longer includes 'children'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_482r_1_42f31a6ffbe63bbc7ab4d471"
      />
      {children}
    </MapContainer>
  )
}
