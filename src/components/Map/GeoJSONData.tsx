import dynamic from 'next/dynamic'

export interface GeoJSONFeatureProperties {
  pop: number
  CIscoreP: number
  disadvantaged: number // CJEST composite score
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
  non_white_pctl: number
  commute_pctl: number
  disability_pctl: number
  OzoneP: number
  DieselPM_P: number
  PM2_5_P: number
  TrafficP: number
  AsthmaP: number
  LowBirWP: number
  CardiovasP: number
  EducatP: number
  Ling_IsolP: number
  PovertyP: number
  UnemplP: number
  HousBurdP: number
  P_D2_OZONE: number
  P_D2_PM25: number
  P_D2_DSLPM: number
  P_D2_RSEI_AIR: number
  P_D2_PTRAF: number
  P_D2_NO2: number
  diesel_ex: number
  pm25: number
  traffic: number
  low_life_ex: number
  heart_dis: number
  house_burd: number
  ling_iso: number
  education: number
  LMI: number
  '100_fpl': number
  '200_fpl': number
  unemployment: number
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
