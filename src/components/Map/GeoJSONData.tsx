import dynamic from 'next/dynamic'

export interface GeoJSONFeatureProperties {
  pop: number
  CIscoreP: number
  'Multi-Family Housing Residents': number
  Renters: number
  chg_walk: number
  // added
  chg_walk_L2_10: number
  chg_drive: number
  // added
  chg_drive_DCF_10: number
  nevi: number
  pge?: number
  utility?: number
  commercial: number
  zoning_tot: number
  zoning_residential_multi_family: number
  zoning_commercial: number
  zoning_mixed: number
  irs30c: number
  lev_10000: number
}

export interface GeoJSONFeature {
  type: 'Feature'
  properties: GeoJSONFeatureProperties
  geometry: {
    type:
      | 'Point'
      | 'LineString'
      | 'Polygon'
      | 'MultiPoint'
      | 'MultiLineString'
      | 'MultiPolygon'
      | 'GeometryCollection'
    coordinates: number[][] | number[][][] | number[][][][]
  }
}

export interface GeoJSONData {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

export const LeafletCluster = dynamic(async () => (await import('./LeafletCluster')).LeafletCluster(), {
  ssr: false,
})
export const CenterToMarkerButton = dynamic(async () => (await import('./ui/CenterButton')).CenterButton, {
  ssr: false,
})
export const CustomMarker = dynamic(async () => (await import('./Marker')).CustomMarker, {
  ssr: false,
})
export const LocateButton = dynamic(async () => (await import('./ui/LocateButton')).LocateButton, {
  ssr: false,
})
export const LeafletMapContainer = dynamic(
  async () => (await import('./LeafletMapContainer')).LeafletMapContainer,
  {
    ssr: false,
  },
)
export const DynamicGeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false })

export const MapMarker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
