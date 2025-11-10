import type { LatLngExpression } from 'leaflet'

import { Category } from './MarkerCategories'

export interface PlaceValues {
  position: LatLngExpression
  category: Category
}
export type PlacesType = PlaceValues[]
export type PlacesClusterType = Record<string, PlaceValues[]>

export const Places: PlacesType = [
  {
    position: [37.7749, -122.4194], // San Francisco coordinates
    category: Category.CAT1,
  },
  {
    position: [37.8044, -122.2712], // Oakland coordinates
    category: Category.CAT1,
  },
  // {
  //   position: [37.7652, -122.2417], // Alameda coordinates
  //   category: Category.CAT1,
  // },
  // {
  //   position: [37.873, -122.2728], // Berkeley coordinates
  //   category: Category.CAT1,
  // },
  // {
  //   position: [37.8225, -122.2992], // Emeryville coordinates
  //   category: Category.CAT1,
  // },
  // {
  //   position: [37.7233, -121.8842], // San Leandro coordinates
  //   category: Category.CAT1,
  // },
  // {
  //   position: [37.8722, -122.2903], // Albany coordinates
  //   category: Category.CAT1,
  // },
  // {
  //   position: [37.6303, -122.0836], // Hayward coordinates
  //   category: Category.CAT1,
  // },
  // {
  //   position: [37.5503, -122.1], // Fremont coordinates
  //   category: Category.CAT1,
  // },
  // {
  //   position: [37.6897, -121.7897], // Livermore coordinates
  //   category: Category.CAT1,
  // },
  // {
  //   position: [37.8319, -122.2505], // Rockridge neighborhood
  //   category: Category.CAT2,
  // },
  // {
  //   position: [37.8005, -122.2361], // Grand Lake neighborhood
  //   category: Category.CAT2,
  // },
  // {
  //   position: [37.8464, -122.2858], // Temescal neighborhood
  //   category: Category.CAT2,
  // },
  // {
  //   position: [37.8108, -122.2292], // Piedmont Avenue neighborhood
  //   category: Category.CAT2,
  // },
  // {
  //   position: [37.8597, -122.2675], // Jingletown neighborhood
  //   category: Category.CAT2,
  // },
  // {
  //   position: [37.8094, -122.2492], // Lake Merritt neighborhood
  //   category: Category.CAT2,
  // },
  // {
  //   position: [37.8050, -122.2833], // Chinatown neighborhood
  //   category: Category.CAT2,
  // },
  // {
  //   position: [37.8542, -122.2825], // Temescal Telegraph neighborhood
  //   category: Category.CAT2,
  // },
  // {
  //   position: [37.7925, -122.2525], // Adams Point neighborhood
  //   category: Category.CAT2,
  // },
  // {
  //   position: [37.8425, -122.2258], // Glenview neighborhood
  //   category: Category.CAT2,
  // },
]
