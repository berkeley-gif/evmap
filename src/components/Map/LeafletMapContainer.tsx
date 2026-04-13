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
      preferCanvas={true}
      className="w-full h-full absolute outline-0 text-white"
      {...options}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {options.children}
    </MapContainer>
  )
}
