import type { LatLngExpression, MapOptions } from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

import useMapContext from './useMapContext'

export const LeafletMapContainer: React.FC<
  {
    center: LatLngExpression
    children: JSX.Element | JSX.Element[]
    zoom: number
  } & MapOptions
> = ({ ...options }) => {
  const { setMap } = useMapContext()
  useEffect(() => () => setMap?.(null), [setMap])
  return (
    <MapContainer
      // ref={e => setMap && setMap(e || undefined)}
      ref={e => {
        if (e && setMap) setMap(e)
      }}
      className="w-full h-full absolute outline-0 text-white"
      {...options}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_482r_1_42f31a6ffbe63bbc7ab4d471"
      />
      {options.children}
    </MapContainer>
  )
}
