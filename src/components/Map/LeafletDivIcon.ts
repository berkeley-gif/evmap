import type { PointExpression } from 'leaflet'
import { renderToString } from 'react-dom/server'

interface divIconValues {
  source: JSX.Element
  anchor: PointExpression
}

const LeafletDivIcon = ({ source, anchor }: divIconValues) => {
  // Access Leaflet from the global window object (set by leaflet library when loaded)
  if (typeof window !== 'undefined' && (window as any).L) {
    const { L } = window as any
    return L.divIcon({
      html: renderToString(source),
      iconAnchor: anchor,
    })
  }
  return null
}

export default LeafletDivIcon
