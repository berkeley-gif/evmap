/* eslint-disable no-console */

/* eslint-disable jsx-a11y/label-has-associated-control */

/* eslint-disable react/button-has-type */

/* eslint-disable jsx-a11y/control-has-associated-label */

/* eslint-disable consistent-return */

/* eslint-disable @typescript-eslint/no-shadow */

/* eslint-disable import/no-cycle */

/* eslint-disable import/no-extraneous-dependencies */
import * as turf from '@turf/turf'
import { FeatureCollection, MultiPolygon, Point, Polygon } from 'geojson'
import { LeafletMouseEvent } from 'leaflet'
import React, { useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import Slider from 'react-slider'
import Toggle from 'react-toggle'

import { SliderConfigs } from '@lib/SliderConfigs'

import { Range } from '@lib/Constants'
import { GeoJSONData, GeoJSONFeature } from '@map/GeoJSONData'
import LayerControl from '@map/LayerControl'
import MarkLabel from '@map/MarkLabel'
// import LayerSliderControl from './LayerSliderControl'

interface DataControlsProps {
  dataControlsTitle: string
  jurisdiction?: string | null
  utility?: string | null
  map: any
  L: any
  cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon> | null
  color: string
  layerData: any
  otherLayerData: any
  // geojsonUrl: string
  // onDataUpdate: any
  config: any
  // handlePriorityChange: any
  dispatch: any
}

interface CachedType {
  dataLayerJson: GeoJSONData | null
}

const cached: CachedType = {
  dataLayerJson: null,
}

export const DataControls: React.FC<DataControlsProps> = ({
  dataControlsTitle,
  jurisdiction,
  utility,
  map,
  L,
  cityBoundaryGeoJSON,
  color,
  layerData,
  otherLayerData,
  // geojsonUrl,
  // onDataUpdate,
  config,
  // handlePriorityChange,
  dispatch,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  // const [loading, setLoading] = useState(true) // Add loading state
  // const [layerData, setLayerData] = useState<GeoJSONData | null>(null)
  const [showLayerData] = useState(true)
  const layerGroupId = useRef(`layerGroup-${dataControlsTitle}`).current
  const [layerStyle, setLayerStyle] = useState<{ color: any; weight?: number; opacity?: number }>({
    color,
    weight: 1,
    opacity: 0.5,
  })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const maxValues = {
    popMax: 200,
    ciScoreMax: 100,
    cjScoreMax: 100,
    ejScoreMax: 100,
    levMax: 1000,
    multiFaMax: 100,
    rentersMax: 100,
    walkableMax: 100,
    drivableMax: 100,
    commercialMax: 100,
    residentialMax: 100,
    pgeMax: 3000,
    // CES SubIndicators
    cesOzoneMax: 100,
    cesPm25Max: 100,
    cesDieselPmMax: 100,
    cesTrafficMax: 100,
    cesAsthmaMax: 100,
    cesLowBirthWeightMax: 100,
    cesCardiovascularDiseaseMax: 100,
    cesEducationMax: 100,
    cesLinguisticIsolationMax: 100,
    cesPovertyMax: 100,
    cesUnemploymentMax: 100,
    cesHousingBurdenMax: 100,
    // EJScreen SubIndicators
    ejscreenOzoneMax: 100,
    ejscreenPm25Max: 100,
    ejscreenDieselPmMax: 100,
    ejscreenRseiAirMax: 100,
    ejscreenPtrafMax: 100,
    ejscreenNo2Max: 100,
    // CJEST SubIndicators
    cjestDieselExMax: 100,
    cjestPm25Max: 100,
    cjestTrafficMax: 100,
    cjestLowLifeExMax: 100,
    cjestAsthmaMax: 100,
    cjestHeartDisMax: 100,
    cjestHouseBurdMax: 100,
    cjestLingIsoMax: 100,
    cjestEducationMax: 100,
    cjestLmiMax: 100,
    cjestFpl100Max: 100,
    cjestFpl200Max: 100,
    cjestUnemploymentMax: 100,
  }

  const [scoreRanges, setScoreRanges] = useState<Record<string, Range>>({
    // popRange: [0, 0],
    cjScoreRange: [0, 100],
    // ejScoreRange: [0, 0],
    ciScoreRange: [0, 100],
    levRange: [0, 1000],
    multiFaRange: [0, 100],
    rentersRange: [0, 100],
    walkableRange: [0, 100],
    drivableRange: [0, 100],
    // commercialRange: [0, 0],
    // residentialRange: [0, 0],
    pgeRange: [0, 3000],
    // CES SubIndicators
    cesOzoneRange: [0, 100],
    cesPm25Range: [0, 100],
    cesDieselPmRange: [0, 100],
    cesTrafficRange: [0, 100],
    cesAsthmaRange: [0, 100],
    cesLowBirthWeightRange: [0, 100],
    cesCardiovascularDiseaseRange: [0, 100],
    cesEducationRange: [0, 100],
    cesLinguisticIsolationRange: [0, 100],
    cesPovertyRange: [0, 100],
    cesUnemploymentRange: [0, 100],
    cesHousingBurdenRange: [0, 100],
    // EJScreen SubIndicators
    ejscreenOzoneRange: [0, 100],
    ejscreenPm25Range: [0, 100],
    ejscreenDieselPmRange: [0, 100],
    ejscreenRseiAirRange: [0, 100],
    ejscreenPtrafRange: [0, 100],
    ejscreenNo2Range: [0, 100],
    // CJEST SubIndicators
    cjestDieselExRange: [0, 100],
    cjestPm25Range: [0, 100],
    cjestTrafficRange: [0, 100],
    cjestLowLifeExRange: [0, 100],
    cjestAsthmaRange: [0, 100],
    cjestHeartDisRange: [0, 100],
    cjestHouseBurdRange: [0, 100],
    cjestLingIsoRange: [0, 100],
    cjestEducationRange: [0, 100],
    cjestLmiRange: [0, 100],
    cjestFpl100Range: [0, 100],
    cjestFpl200Range: [0, 100],
    cjestUnemploymentRange: [0, 100],
  })

  const updateRange = (key: string, value: Range) => {
    setScoreRanges(prev => ({ ...prev, [key]: value }))
  }

  const resetSliders = () => {
    setScoreRanges(() =>
      Object.keys(maxValues).reduce((acc, key) => {
        const typedKey = key as keyof typeof maxValues
        acc[key.replace('Max', 'Range')] = [0, maxValues[typedKey] || 100]
        return acc
      }, {} as Record<string, Range>),
    )
  }

  const [filters, setFilters] = useState<Record<string, { zero: boolean; one: boolean }>>({
    neviFilterActive: { zero: true, one: true },
    irs30cFilterActive: { zero: true, one: true },
  })

  const updateFilter = (key: string, value: { zero: boolean; one: boolean }) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (isFirstLoad) {
      resetSliders()
      setLayerStyle({ ...layerStyle, color })
      setIsFirstLoad(false)
    }
  }, [isFirstLoad, resetSliders])

  const toggleExpand = () => setIsExpanded(!isExpanded)

  // function useEffectSetFeatureData(cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon> | null) {
  //   useEffect(() => {
  //     const filterData = (
  //       data: GeoJSONData,
  //       cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon> | null,
  //     ): GeoJSONData => {
  //       const tolerance = 0.00001 // Adjust for performance vs accuracy
  //       const simplifiedCityBoundary =
  //         cityBoundaryGeoJSON && cityBoundaryGeoJSON.features.length > 0
  //           ? turf.simplify(cityBoundaryGeoJSON.features[0], { tolerance, highQuality: false })
  //           : null
  //       return {
  //         ...data,
  //         features: data.features.filter((feature: GeoJSONFeature) => {
  //           const props = feature.properties
  //           const pgeOrUtility = props.pge ?? props.utility ?? 0
  //           const {
  //             popRange,
  //             cjScoreRange,
  //             ciScoreRange,
  //             levRange,
  //             multiFaRange,
  //             rentersRange,
  //             walkableRange,
  //             drivableRange,
  //             commercialRange,
  //             residentialRange,
  //             pgeRange,
  //             cjestRange,
  //             cesOzoneRange,
  //             cesPm25Range,
  //             cesDieselPmRange,
  //             cesTrafficRange,
  //             cesAsthmaRange,
  //             cesLowBirthWeightRange,
  //             cesCardiovascularDiseaseRange,
  //             cesEducationRange,
  //             cesLinguisticIsolationRange,
  //             cesPovertyRange,
  //             cesUnemploymentRange,
  //             cesHousingBurdenRange,
  //             ejscreenOzoneRange,
  //             ejscreenPm25Range,
  //             ejscreenDieselPmRange,
  //             ejscreenRseiAirRange,
  //             ejscreenPtrafRange,
  //             ejscreenNo2Range,
  //             cjestDieselExRange,
  //             cjestPm25Range,
  //             cjestTrafficRange,
  //             cjestLowLifeExRange,
  //             cjestAsthmaRange,
  //             cjestHeartDisRange,
  //             cjestHouseBurdRange,
  //             cjestLingIsoRange,
  //             cjestEducationRange,
  //             cjestLmiRange,
  //             cjestFpl100Range,
  //             cjestFpl200Range,
  //             cjestUnemploymentRange,
  //           } = scoreRanges

  //           const {
  //             // popMax,
  //             ciScoreMax,
  //             cjScoreMax,
  //             // ejScoreMax,
  //             levMax,
  //             multiFaMax,
  //             rentersMax,
  //             walkableMax,
  //             drivableMax,
  //             // commercialMax,
  //             // residentialMax,
  //             pgeMax,
  //             // CES SubIndicators
  //             cesOzoneMax,
  //             cesPm25Max,
  //             cesDieselPmMax,
  //             cesTrafficMax,
  //             cesAsthmaMax,
  //             cesLowBirthWeightMax,
  //             cesCardiovascularDiseaseMax,
  //             cesEducationMax,
  //             cesLinguisticIsolationMax,
  //             cesPovertyMax,
  //             cesUnemploymentMax,
  //             cesHousingBurdenMax,
  //             // EJScreen SubIndicators
  //             ejscreenOzoneMax,
  //             ejscreenPm25Max,
  //             ejscreenDieselPmMax,
  //             ejscreenRseiAirMax,
  //             ejscreenPtrafMax,
  //             ejscreenNo2Max,
  //             // CJEST SubIndicators
  //             cjestDieselExMax,
  //             cjestPm25Max,
  //             cjestTrafficMax,
  //             cjestLowLifeExMax,
  //             cjestAsthmaMax,
  //             cjestHeartDisMax,
  //             cjestHouseBurdMax,
  //             cjestLingIsoMax,
  //             cjestEducationMax,
  //             cjestLmiMax,
  //             cjestFpl100Max,
  //             cjestFpl200Max,
  //             cjestUnemploymentMax,
  //           } = maxValues
  //           const { neviFilterActive: nevi, irs30cFilterActive: irs30c } = filters
  //           let withinPropertyCriteria
  //           const withinRange = (value: number, range: [number, number], max: number) =>
  //             value >= range[0] && (value <= range[1] || range[1] === max)
  //           if (dataControlsTitle === 'Priority Pixels') {
  //             const chg_walk = props.chg_walk ?? props.chg_walk_L2_10 // choose one key name
  //             const chg_drive = props.chg_drive ?? props.chg_drive_DCF_10 // choose one key name
  //             const conditions = {
  //               toggleCiRange: {
  //                 value: props.CIscoreP,
  //                 range: ciScoreRange,
  //                 max: ciScoreMax,
  //               },
  //               toggleCJESTRange: {
  //                 value: props.disadvantaged,
  //                 range: cjScoreRange,
  //                 max: cjScoreMax,
  //               },
  //               toggleMultiFaRange: {
  //                 value: props['Multi-Family Housing Residents'],
  //                 range: multiFaRange,
  //                 max: multiFaMax,
  //               },
  //               toggleRentersRange: {
  //                 value: props.Renters,
  //                 range: rentersRange,
  //                 max: rentersMax,
  //               },
  //               toggleWalkableRange: {
  //                 value: chg_walk,
  //                 range: walkableRange,
  //                 max: walkableMax,
  //               },
  //               toggleDrivableRange: {
  //                 value: chg_drive,
  //                 range: drivableRange,
  //                 max: drivableMax,
  //               },
  //               toggleLevRange: {
  //                 value: props.lev_10000,
  //                 range: levRange,
  //                 max: levMax,
  //               },
  //               togglePgeRange: {
  //                 value: pgeOrUtility,
  //                 range: pgeRange,
  //                 max: pgeMax,
  //               },
  //               toggleCesOzoneRange: {
  //                 value: props.OzoneP,
  //                 range: cesOzoneRange,
  //                 max: cesOzoneMax,
  //               },
  //               toggleCesPm25Range: {
  //                 value: props.DieselPM_P,
  //                 range: cesPm25Range,
  //                 max: cesPm25Max,
  //               },
  //               toggleCesDieselPmRange: {
  //                 value: props.PM2_5_P,
  //                 range: cesDieselPmRange,
  //                 max: cesDieselPmMax,
  //               },
  //               toggleCesTrafficRange: {
  //                 value: props.TrafficP,
  //                 range: cesTrafficRange,
  //                 max: cesTrafficMax,
  //               },
  //               toggleCesAsthmaRange: {
  //                 value: props.AsthmaP,
  //                 range: cesAsthmaRange,
  //                 max: cesAsthmaMax,
  //               },
  //               toggleCesLowBirthWeightRange: {
  //                 value: props.LowBirWP,
  //                 range: cesLowBirthWeightRange,
  //                 max: cesLowBirthWeightMax,
  //               },
  //               toggleCesCardiovascularDiseaseRange: {
  //                 value: props.CardiovasP,
  //                 range: cesCardiovascularDiseaseRange,
  //                 max: cesCardiovascularDiseaseMax,
  //               },
  //               toggleCesEducationRange: {
  //                 value: props.EducatP,
  //                 range: cesEducationRange,
  //                 max: cesEducationMax,
  //               },
  //               toggleCesLinguisticIsolationRange: {
  //                 value: props.Ling_IsolP,
  //                 range: cesLinguisticIsolationRange,
  //                 max: cesLinguisticIsolationMax,
  //               },
  //               toggleCesPovertyRange: {
  //                 value: props.PovertyP,
  //                 range: cesPovertyRange,
  //                 max: cesPovertyMax,
  //               },
  //               toggleCesUnemploymentRange: {
  //                 value: props.UnemplP,
  //                 range: cesUnemploymentRange,
  //                 max: cesUnemploymentMax,
  //               },
  //               toggleCesHousingBurdenRange: {
  //                 value: props.HousBurdP,
  //                 range: cesHousingBurdenRange,
  //                 max: cesHousingBurdenMax,
  //               },
  //               toggleEjScreenOzoneRange: {
  //                 value: props.P_D2_OZONE,
  //                 range: ejscreenOzoneRange,
  //                 max: ejscreenOzoneMax,
  //               },
  //               toggleEjScreenPm25Range: {
  //                 value: props.P_D2_PM25,
  //                 range: ejscreenPm25Range,
  //                 max: ejscreenPm25Max,
  //               },
  //               toggleEjScreenDieselPmRange: {
  //                 value: props.P_D2_DSLPM,
  //                 range: ejscreenDieselPmRange,
  //                 max: ejscreenDieselPmMax,
  //               },
  //               toggleEjScreenRseiAirRange: {
  //                 value: props.P_D2_RSEI_AIR,
  //                 range: ejscreenRseiAirRange,
  //                 max: ejscreenRseiAirMax,
  //               },
  //               toggleEjScreenPtrafRange: {
  //                 value: props.P_D2_PTRAF,
  //                 range: ejscreenPtrafRange,
  //                 max: ejscreenPtrafMax,
  //               },
  //               toggleEjScreenNo2Range: {
  //                 value: props.P_D2_NO2,
  //                 range: ejscreenNo2Range,
  //                 max: ejscreenNo2Max,
  //               },
  //               toggleCjestDieselExRange: {
  //                 value: props.diesel_ex,
  //                 range: cjestDieselExRange,
  //                 max: cjestDieselExMax,
  //               },
  //               toggleCjestPm25Range: {
  //                 value: props.pm25,
  //                 range: cjestPm25Range,
  //                 max: cjestPm25Max,
  //               },
  //               toggleCjestTrafficRange: {
  //                 value: props.traffic,
  //                 range: cjestTrafficRange,
  //                 max: cjestTrafficMax,
  //               },
  //               toggleCjestLowLifeExRange: {
  //                 value: props.low_life_ex,
  //                 range: cjestLowLifeExRange,
  //                 max: cjestLowLifeExMax,
  //               },
  //               // toggleCjestAsthmaRange: { value: pgeOrUtility, range: cjestAsthmaRange, max: cjestAsthmaMax },
  //               toggleCjestHeartDisRange: {
  //                 value: props.heart_dis,
  //                 range: cjestHeartDisRange,
  //                 max: cjestHeartDisMax,
  //               },
  //               toggleCjestHouseBurdRange: {
  //                 value: props.house_burd,
  //                 range: cjestHouseBurdRange,
  //                 max: cjestHouseBurdMax,
  //               },
  //               toggleCjestLingIsoRange: {
  //                 value: props.ling_iso,
  //                 range: cjestLingIsoRange,
  //                 max: cjestLingIsoMax,
  //               },
  //               toggleCjestEducationRange: {
  //                 value: props.education,
  //                 range: cjestEducationRange,
  //                 max: cjestEducationMax,
  //               },
  //               toggleCjestLmiRange: {
  //                 value: props.LMI,
  //                 range: cjestLmiRange,
  //                 max: cjestLmiMax,
  //               },
  //               toggleCjestFpl100Range: {
  //                 value: props['100_fpl'],
  //                 range: cjestFpl100Range,
  //                 max: cjestFpl100Max,
  //               },
  //               toggleCjestFpl200Range: {
  //                 value: props['200_fpl'],
  //                 range: cjestFpl200Range,
  //                 max: cjestFpl200Max,
  //               },
  //               toggleCjestUnemploymentRange: {
  //                 value: props.unemployment,
  //                 range: cjestUnemploymentRange,
  //                 max: cjestUnemploymentMax,
  //               },
  //             }
  //             //   withinPropertyCriteria =
  //             //     // props.pop >= popRange[0] &&
  //             //     // (props.pop <= popRange[1] || popRange[1] === popMax) &&
  //             //     // props.CIscoreP >= ciScoreRange[0] &&
  //             //     // (props.CIscoreP <= ciScoreRange[1] || ciScoreRange[1] === ciScoreMax) &&
  //             //     // props.CIscoreP >= ciScoreRange[0] &&
  //             //     (props.disadvantaged <= cjScoreRange[1] || cjScoreRange[1] === cjScoreMax) &&
  //             //     props.disadvantaged >= cjScoreRange[0] &&
  //             //     (props.disadvantaged <= cjScoreRange[1] || cjScoreRange[1] === cjScoreMax) &&
  //             //     (props.CIscoreP <= ciScoreRange[1] || ciScoreRange[1] === ciScoreMax) &&
  //             //     props.CIscoreP >= ciScoreRange[0] &&
  //             //     (props.CIscoreP <= ciScoreRange[1] || ciScoreRange[1] === ciScoreMax) &&
  //             //     props.lev_10000 >= levRange[0] &&
  //             //     (props.lev_10000 <= levRange[1] || levRange[1] === levMax) &&
  //             //     props['Multi-Family Housing Residents'] >= multiFaRange[0] &&
  //             //     (props['Multi-Family Housing Residents'] <= multiFaRange[1] ||
  //             //       multiFaRange[1] === multiFaMax) &&
  //             //     props.Renters >= rentersRange[0] &&
  //             //     (props.Renters <= rentersRange[1] || rentersRange[1] === rentersMax) &&
  //             //     // zoning data has been removed from consideration at this time
  //             //     // props.zoning_commercial >= commercialRange[0] / 100 &&
  //             //     // (props.zoning_commercial <= commercialRange[1] / 100 || commercialRange[1] === commercialMax) &&
  //             //     // props.zoning_residential_multi_family >= residentialRange[0] / 100 &&
  //             //     // (props.zoning_residential_multi_family <= residentialRange[1] / 100 ||
  //             //     //   residentialRange[1] === residentialMax) &&
  //             //     chg_walk >= walkableRange[0] &&
  //             //     (chg_walk <= walkableRange[1] || walkableRange[1] === walkableMax) &&
  //             //     chg_drive >= drivableRange[0] &&
  //             //     (chg_drive <= drivableRange[1] || drivableRange[1] === drivableMax)
  //             // } else {
  //             //   withinPropertyCriteria =
  //             //     ((neviFilterActive.zero && props.nevi === 0) || (neviFilterActive.one && props.nevi === 1)) &&
  //             //     ((irs30cFilterActive.zero && props.irs30c === 0) ||
  //             //       (irs30cFilterActive.one && props.irs30c === 1)) &&
  //             //     // props.pge >= pgeRange[0] &&
  //             //     // (props.pge <= pgeRange[1] || pgeRange[1] === pgeMax)
  //             //     pgeOrUtility >= pgeRange[0] &&
  //             //     (pgeOrUtility <= pgeRange[1] || pgeRange[1] === pgeMax)
  //             // }
  //             withinPropertyCriteria = Object.keys(conditions)
  //               .filter(
  //                 (key): key is keyof typeof conditions =>
  //                   (config[key] ||
  //                     config.subIndicators?.CES?.[key] ||
  //                     config.subIndicators?.EJScreen?.[key] ||
  //                     config.subIndicators?.CJEST?.[key]) &&
  //                   !['nevi', 'irs30c', 'pge'].includes(key),
  //               )
  //               .every(key => withinRange(conditions[key].value, conditions[key].range, conditions[key].max))
  //           } else {
  //             withinPropertyCriteria =
  //               ((nevi.zero && props.nevi === 0) || (nevi.one && props.nevi === 1)) &&
  //               ((irs30c.zero && props.irs30c === 0) || (irs30c.one && props.irs30c === 1)) &&
  //               withinRange(pgeOrUtility, pgeRange, pgeMax)
  //           }

  //           if (!withinPropertyCriteria) {
  //             return false
  //           }
  //           if (simplifiedCityBoundary) {
  //             const { geometry } = feature
  //             if (geometry.type === 'Point') {
  //               return turf.booleanPointInPolygon(geometry as unknown as Point, simplifiedCityBoundary)
  //             }
  //             if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
  //               const simplifiedGeometry = turf.simplify(geometry, { tolerance, highQuality: false })
  //               return (
  //                 turf.booleanOverlap(simplifiedGeometry, simplifiedCityBoundary) ||
  //                 // turf.booleanContains(simplifiedCityBoundary, simplifiedGeometry) ||
  //                 turf.booleanWithin(simplifiedGeometry, simplifiedCityBoundary)
  //               )
  //             }
  //             return false
  //           }
  //           return true
  //         }),
  //       }
  //     }

  //     // const fetchAndFilterData = async () => {
  //     //   try {
  //     //     const response = await fetch(geojsonUrl)
  //     //     const dataJson: GeoJSONData = await response.json()
  //     //     const filteredData = filterData(dataJson, cityBoundaryGeoJSON)
  //     //     onDataUpdate(filteredData)
  //     //     setLayerData(filteredData)
  //     //   } catch (error) {
  //     //     console.error('Error fetching GeoJSON data:', error)
  //     //   } finally {
  //     //     setLoading(false)
  //     //   }
  //     // }
  //     // fetchAndFilterData()
  //   }, [scoreRanges, filters, cityBoundaryGeoJSON])
  // }

  function useEffectLayerData() {
    useEffect(() => {
      if (!map || !layerData || !L) {
        return
      }

      const layerGroupName = `${dataControlsTitle.replace(/\s+/g, '')}LayerGroup`
      let layerGroup = map[layerGroupName] as L.LayerGroup | undefined

      if (!layerGroup) {
        layerGroup = new L.LayerGroup().addTo(map)
        map[layerGroupName] = layerGroup
      } else {
        layerGroup.clearLayers()
      }

      const addGeoJsonLayerToGroup = () => {
        if (layerGroup) {
          layerGroup.clearLayers()
          const layer = L.geoJSON(layerData, {
            style: layerStyle,
            onEachFeature: (feature: any, layer: any) => {
              layer.on('click', (e: LeafletMouseEvent) => {
                const clickPoint = turf.point([e.latlng.lng, e.latlng.lat])
                const featureProps = feature.properties
                const isPriority = dataControlsTitle === 'Priority Pixels'
                const otherHit = otherLayerData?.features.find((otherFeature: any) =>
                  turf.booleanPointInPolygon(clickPoint, otherFeature)
                )
                dispatch({ type: 'SET_MENU_POSITION', payload: { x: e.originalEvent.clientX, y: e.originalEvent.clientY } })
                dispatch({ type: 'SET_POLYGON_CLICK_MENU_VISIBLE', payload: true })
                if (isPriority) {
                  dispatch({ type: 'SET_PRIORITY_POLYGON_DATA', payload: featureProps })
                  dispatch({ type: 'SET_FEASIBLE_POLYGON_DATA', payload: otherHit?.properties || null })
                } else {
                  dispatch({ type: 'SET_FEASIBLE_POLYGON_DATA', payload: featureProps })
                  dispatch({ type: 'SET_PRIORITY_POLYGON_DATA', payload: otherHit?.properties || null })
                }
              })
            },
          })
          layerGroup.addLayer(layer)
        }
      }

      if (showLayerData && layerData) {
        addGeoJsonLayerToGroup()
      }

      return () => {
        if (layerGroup) {
          layerGroup.clearLayers()
          map.removeLayer(layerGroup)
          delete map[layerGroupName]
        }
      }
    }, [map, L, layerData, showLayerData, layerStyle, dataControlsTitle])
  }

  // useEffectSetFeatureData(cityBoundaryGeoJSON)
  useEffectLayerData()

  useEffect(() => {
    if (map) {
      // Set initial view to San Francisco and Oakland
      map.setView([37.7749, -122.4194], 10) // Latitude, Longitude, Zoom level
    }
  }, [map])

  const sliders = SliderConfigs.map(indicator => {
    const scoreRange = scoreRanges[indicator.value]
    const setScoreRange = (newRange: Range) => updateRange(indicator.value, newRange)
    const isActive =
      config[indicator.trigger] ||
      config.subIndicators?.CES?.[indicator.trigger] ||
      config.subIndicators?.EJScreen?.[indicator.trigger] ||
      config.subIndicators?.CJEST?.[indicator.trigger]
    const processedAccordionText = indicator
      .accordionText({
        range: scoreRange,
        max: indicator.max,
        jurisdiction: jurisdiction ?? undefined,
        utility: utility ?? undefined,
      })
      .join(' ')
    const rightThumbSliders = ['lev', 'walkable', 'drivable']
    const useRightThumb = Boolean(rightThumbSliders.includes(indicator.name))
    return (
      isActive && (
        <label key={indicator.id}>
          <br />
          <LayerControl
            mainText={indicator.mainText}
            hoverText={indicator.hoverText}
            accordionText={processedAccordionText}
          />
          <MarkLabel range={indicator.markRange} />
          <Slider
            min={indicator.min}
            max={indicator.max}
            value={useRightThumb ? scoreRange[1] : scoreRange[0]}
            onChange={value => setScoreRange(useRightThumb ? [scoreRange[0], value] : [value, scoreRange[1]])}
            marks={indicator.max / 10}
            markClassName="slider-mark"
            thumbClassName="slider-thumb"
            trackClassName="slider-track"
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            pearling
            minDistance={0}
          />
        </label>
      )
    )
  })
  const specialFilters = (
    <>
      {config.toggleNeviFilterActive && (
        <div className="checkbox-group justify-between">
          <br />
          <label style={{ marginRight: '20px' }}>
            <Toggle
              checked={filters.neviFilterActive.one && !filters.neviFilterActive.zero}
              onChange={() => {
                setFilters(prev => ({
                  ...prev,
                  neviFilterActive: {
                    zero: !prev.neviFilterActive.zero,
                    one: true,
                  },
                }))
              }}
              icons={false}
            />
          </label>
          <LayerControl
            mainText="NEVI eligible"
            hoverText="Toggle to show pixels in areas eligible for the National Electric Vehicle Infrastructure (NEVI) program."
            accordionText="<p>Range: On or Off</p><p>The NEVI program provides funding for EV infrastructure in designated areas. More details can be found at <a class='inline-link' href='https://www.fhwa.dot.gov/environment/nevi/'>FHWA NEVI</a>.</p>"
          />
        </div>
      )}
      {config.toggleirs30cFilterActive && (
        <div className="checkbox-group justify-between">
          <br />
          <label style={{ marginRight: '20px' }}>
            <Toggle
              checked={filters.irs30cFilterActive.one && !filters.irs30cFilterActive.zero}
              onChange={() => {
                setFilters(prev => ({
                  ...prev,
                  irs30cFilterActive: {
                    zero: !prev.irs30cFilterActive.zero,
                    one: true, // Ensure at least "one" remains checked
                  },
                }))
              }}
              icons={false}
            />
          </label>
          <LayerControl
            mainText="IRS 30C eligible"
            hoverText="Toggle to show pixels in areas that are eligible for federal tax credits for EV charger installation, limited to communities designated either low-income or non-urban."
            accordionText={`<p>Range: On or Off</p><p>The IRS 30C Alternative Fuel Vehicle Refueling Property Credit provides generous tax credits for installations by individuals, businesses, nonprofits, and governments in qualifying areas. <a class="inline-link" href="https//:www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit">IRS provides more information</a> on eligibility and procedures.</p><p>The <a class="inline-link" href="https://cleanenergytaxnavigator.org/">Clean Energy Tax Navigator</a> is a free tool to help identify available credits including 30C.</p>`}
          />
        </div>
      )}
    </>
  )
  const loading ="" // delete
  if (loading) {
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Retrieving data...
        </div>
      </>
    )
  }

  return (
    <div className="priority-data-controls">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowColorPicker(show => !show)}
              style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              <div className="color-picker" style={{ backgroundColor: layerStyle.color }} />
            </button>
            {showColorPicker && (
              <div className="sketch-picker">
                <SketchPicker
                  color={layerStyle.color}
                  onChangeComplete={(color: { hex: unknown }) =>
                    setLayerStyle({ ...layerStyle, color: color.hex })
                  }
                />
              </div>
            )}
          </div>
          <b style={{ marginLeft: '10px' }}>{dataControlsTitle}</b>
        </div>
        {isExpanded && (
          <button
            onClick={resetSliders}
            className="reset-sliders-btn"
            style={{ backgroundColor: layerStyle.color }}
          >
            Reset Sliders
          </button>
        )}
        <button onClick={toggleExpand} style={{ padding: '5px 10px' }}>
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      {showLayerData && isExpanded && (
        <>
          {sliders}
          <br />
          {specialFilters}
        </>
        // <>
        //   {/* CJEST Score Slider */}
        //   {toggleCJESTRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="CJEST percentile"
        //         hoverText="Slide to adjust the community environmental justice impact score. Higher scores = greater priority."
        //         accordionText={`<p>Range: ${cjScoreRange[0]} to ${cjScoreRange[1]}</p>
        //         <p>CalEnviroScreen4.0 is California’s state environmental justice impact screening tool. CES4.0 combines 21 pollution and population-based criteria into a composite score at the census tract level, with percentile rankings based on comparison to statewide averages. More information available <a href="https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-40" class="inline-link">here</a>.</p>`}
        //       />
        //       <MarkLabel range={100} />
        //       <Slider
        //         min={0}
        //         max={cjScoreMax}
        //         // value={ciScoreRange}
        //         // onAfterChange={setCiScoreRange}
        //         marks={10}
        //         markClassName="slider-mark"
        //         value={cjScoreRange[0]}
        //         onChange={value => setCJScoreRange([value, cjScoreRange[1]])}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   {/* CI Score Slider */}
        //   {toggleCiRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="CalEnviroScreen4.0 percentile"
        //         hoverText="Slide to adjust the community environmental justice impact score. Higher scores = greater priority."
        //         accordionText={`<p>Range: ${ciScoreRange[0]} to ${ciScoreRange[1]}</p>
        //         <p>CalEnviroScreen4.0 is California’s state environmental justice impact screening tool. CES4.0 combines 21 pollution and population-based criteria into a composite score at the census tract level, with percentile rankings based on comparison to statewide averages. More information available <a href="https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-40" class="inline-link">here</a>.</p>`}
        //       />
        //       <MarkLabel range={100} />
        //       <Slider
        //         min={0}
        //         max={ciScoreMax}
        //         // value={ciScoreRange}
        //         // onAfterChange={setCiScoreRange}
        //         marks={10}
        //         markClassName="slider-mark"
        //         value={ciScoreRange[0]}
        //         onChange={value => setCiScoreRange([value, ciScoreRange[1]])}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   {/* SubIndicators */}

        //   {/* Multi-Fa Slider */}
        //   {toggleMultiFaRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="Multifamily residents"
        //         hoverText="Slide to adjust the number of residents in the pixel who live in multifamily buildings (i.e., apartment, condo)."
        //         accordionText={`<p>Range: ${multiFaRange[0]} to ${
        //           multiFaRange[1] === multiFaMax ? '∞' : multiFaRange[1]
        //         }</p><p>Multifamily and renter resident data are estimated based on American Community Survey data for multifamily/renter percentages by census tract and population per pixel. These residents are more likely to rely on public EV charging and mobility infrastructure than are single-family home residents.</p>`}
        //       />
        //       <MarkLabel range={100} />
        //       <Slider
        //         min={0}
        //         max={multiFaMax}
        //         // value={multiFaRange}
        //         // onAfterChange={setMultiFaRange}
        //         marks={10}
        //         markClassName="slider-mark"
        //         value={multiFaRange[0]}
        //         onChange={value => setMultiFaRange([value, multiFaRange[1]])}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   {/* Renters Slider */}
        //   {toggleRentersRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="Renters"
        //         hoverText="Slide to adjust the number of residents in the pixel who rent their home."
        //         accordionText={`<p>Range: ${rentersRange[0]} to ${
        //           rentersRange[1] === rentersMax ? '∞' : rentersRange[1]
        //         }</p><p>Multifamily and renter resident data are estimated based on American Community Survey data for multifamily/renter percentages by census tract and population per pixel. These residents are more likely to rely on public EV charging and mobility infrastructure than are single-family home residents.</p>`}
        //       />
        //       <MarkLabel range={100} />
        //       <Slider
        //         min={0}
        //         max={rentersMax}
        //         // value={rentersRange}
        //         // onAfterChange={setRentersRange}
        //         marks={10}
        //         markClassName="slider-mark"
        //         value={rentersRange[0]}
        //         onChange={value => setRentersRange([value, rentersRange[1]])}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   {/* Walkable Slider */}
        //   {toggleWalkableRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="L2 chargers within 10 min walk"
        //         hoverText="Slide to adjust the number of public Level 2 EV chargers within a 10 minute walk of the pixel. Lower numbers = lower charging access in the pixel."
        //         accordionText={`<p>Range: ${walkableRange[0]} to ${
        //           walkableRange[1] === walkableMax ? '∞' : walkableRange[1]
        //         }</p><p>Level 2 and DC Fast access are estimated based on <a href="https://docs.mapbox.com/api/navigation/isochrone/" class="inline-link">MapBox isochrones API</a> (which estimates travel times between specific locations) and <a href="https://afdc.energy.gov/fuels/electricity-locations#/find/nearest?fuel=ELEC" class="inline-link">US Department of Energy current charger data</a>. Walk time is used for Level 2 chargers (which typically take multiple hours to complete a charge) while drive time is used for DC Fast chargers (which typically take 30-60 minutes), reflecting their different use cases.</p>`}
        //       />
        //       <MarkLabel range={100} />
        //       <Slider
        //         min={0}
        //         max={walkableMax}
        //         // value={walkableRange}
        //         // onAfterChange={setWalkableRange}
        //         marks={10}
        //         markClassName="slider-mark"
        //         value={walkableRange[1]}
        //         onChange={value => setWalkableRange([walkableRange[0], value])}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   {/* Drivable Slider */}
        //   {toggleDrivableRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="DCF chargers within 10 min drive"
        //         hoverText="Slide to adjust the number of public DC Fast chargers within a 10 minute drive of the pixel. Lower numbers = lower charging access in the pixel."
        //         accordionText={`<p>Range: ${drivableRange[0]} to ${
        //           drivableRange[1] === drivableMax ? '∞' : drivableRange[1]
        //         }</p><p>Level 2 and DC Fast access are estimated based on <a href="https://docs.mapbox.com/api/navigation/isochrone/" class="inline-link">MapBox isochrones API</a> (which estimates travel times between specific locations) and <a href="https://afdc.energy.gov/fuels/electricity-locations#/find/nearest?fuel=ELEC" class="inline-link">US Department of Energy current charger data</a>. Walk time is used for Level 2 chargers (which typically take multiple hours to complete a charge) while drive time is used for DC Fast chargers (which typically take 30-60 minutes), reflecting their different use cases.</p>`}
        //       />
        //       <MarkLabel range={100} />
        //       <Slider
        //         min={0}
        //         max={drivableMax}
        //         // value={drivableRange}
        //         // onAfterChange={setDrivableRange}
        //         marks={10}
        //         markClassName="slider-mark"
        //         value={drivableRange[1]}
        //         onChange={value => setDrivableRange([drivableRange[0], value])}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   {/* Population Slider */}
        //   {/* {togglePopRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="Population in pixel"
        //         hoverText="Slide to adjust"
        //         accordionText={`<p>Range: ${popRange[0]} to ${
        //           popRange[1] === popMax ? '∞' : popRange[1]
        //         }</p><p>Placeholder text</p>`}
        //       />
        //       <Slider
        //         min={0}
        //         max={popMax}
        //         value={popRange}
        //         onAfterChange={setPopRange}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )} */}
        //   {/* Commercial Zoning Slider */}
        //   {toggleCommercialRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="Commercial Zoning %"
        //         hoverText="Slide to adjust"
        //         accordionText={`<p>Range: ${commercialRange[0]} to ${commercialRange[1]}</p><p>Placeholder text</p>`}
        //       />
        //       <MarkLabel range={100} />
        //       <Slider
        //         min={0}
        //         max={commercialMax}
        //         // value={commercialRange}
        //         // onAfterChange={setCommercialRange}
        //         marks={10}
        //         markClassName="slider-mark"
        //         value={commercialRange[0]}
        //         onChange={value => setCommercialRange([value, commercialRange[1]])}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   {/* Residential Zoning Slider */}
        //   {toggleResidentialRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="Multifamily Residential Zoning %"
        //         hoverText="Slide to adjust"
        //         accordionText={`<p>Range: ${residentialRange[0]} to ${residentialRange[1]}</p><p>Placeholder text</p>`}
        //       />
        //       <MarkLabel range={100} />
        //       <Slider
        //         min={0}
        //         max={residentialMax}
        //         // value={residentialRange}
        //         // onAfterChange={setResidentialRange}
        //         marks={10}
        //         markClassName="slider-mark"
        //         value={residentialRange[0]}
        //         onChange={value => setResidentialRange([value, residentialRange[1]])}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   {/* LEV Slider */}
        //   {toggleLevRange && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="Registered LEVs"
        //         hoverText="Slide to adjust the density of low-emitting vehicles (EVs and hydrogen fuel-cell) registered in the ZIP code."
        //         accordionText={`<p>Range: ${levRange[0]} to ${
        //           levRange[1] === levMax ? '∞' : levRange[1]
        //         }</p><p>Higher LEV registrations in an area indicate a greater need for charging today but also suggest a higher early adopter rate–thus, potentially greater access to at-home charging and lower need for equity prioritization. Registrations are calculated per 1000 residents to account for population variations across ZIP codes.</p>`}
        //       />
        //       <MarkLabel range={1000} />
        //       <Slider
        //         min={0}
        //         max={levMax}
        //         // value={levRange}
        //         marks={100}
        //         markClassName="slider-mark"
        //         value={levRange[1]}
        //         onChange={value => setLevRange([levRange[0], value])}
        //         // onAfterChange={setLevRange}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   {/* Pge Slider */}
        //   {togglePgeFilterActive && (
        //     <label>
        //       <br />
        //       <LayerControl
        //         mainText="Electric grid load capacity (kW)"
        //         hoverText="Slide to adjust the available capacity on the electrical distribution grid through the pixel. Higher numbers = more capacity to install EV chargers."
        //         accordionText={`<p>Range: ${pgeRange[0]} to ${pgeRange[1] === pgeMax ? '∞' : pgeRange[1]}</p>
        //         <p>Load capacity is based on the capacity map provided by the electric utility that serves the jurisdiction, <a href="https://www.energy.gov/eere/us-atlas-electric-distribution-system-hosting-capacity-maps">where available</a>.
        //         ${
        //           jurisdiction && utility ? `<b>${jurisdiction} is in ${utility} service territory.</b>` : ''
        //         } Energy requirements vary widely, but 100 kW of capacity is typically needed to support 5-10 Level 2 chargers or 1 DC Fast charger.</p>`}
        //       />
        //       <MarkLabel range={3000} />
        //       <Slider
        //         min={0}
        //         max={pgeMax}
        //         // value={pgeRange}
        //         // onAfterChange={setPgeRange}
        //         marks={300}
        //         markClassName="slider-mark"
        //         value={pgeRange[0]}
        //         onChange={value => setPgeRange([value, pgeRange[1]])}
        //         thumbClassName="slider-thumb"
        //         trackClassName="slider-track"
        //         renderThumb={(
        //           props: JSX.IntrinsicAttributes &
        //             React.ClassAttributes<HTMLDivElement> &
        //             React.HTMLAttributes<HTMLDivElement>,
        //           state: {
        //             valueNow:
        //               | string
        //               | number
        //               | boolean
        //               | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        //               | React.ReactFragment
        //               | React.ReactPortal
        //               | null
        //               | undefined
        //           },
        //         ) => <div {...props}>{state.valueNow}</div>}
        //         pearling
        //         minDistance={0}
        //       />
        //     </label>
        //   )}
        //   <br />
        //   {toggleNeviFilterActive && (
        //     <div className="checkbox-group justify-between">
        //       {/* NEVI Checkboxes */}
        //       <br />
        //       <label style={{ marginRight: '20px' }}>
        //         <Toggle
        //           checked={neviFilterActive.one && !neviFilterActive.zero}
        //           onChange={() => {
        //             const currentlyShowingOnlyOne = neviFilterActive.one && !neviFilterActive.zero
        //             if (currentlyShowingOnlyOne) {
        //               setNeviFilterActive({ zero: true, one: true })
        //             } else {
        //               setNeviFilterActive({ zero: false, one: true })
        //             }
        //           }}
        //           icons={false}
        //         />
        //       </label>
        //       <LayerControl
        //         mainText="NEVI Eligible"
        //         hoverText="Toggle to show pixels in areas that are eligible for grant funding through the National Electric Vehicle Infrastructure program, which funds EV chargers within 1 mile of designated highways."
        //         accordionText={`<p>Range: On or Off
        //         </p><p>NEVI funding is generally intended to support a connected national highway charging network, as opposed to community-based local charging. It is thus largely focused on high-speed DC Fast charging to serve long trips. <a href="https://driveelectric.gov/corridors">USDOE provides more information</a> and to see the designated Alternative Fuel Corridors and state plans.</p>`}
        //       />
        //     </div>
        //   )}
        //   {toggleirs30cFilterActive && (
        //     <div className="checkbox-group justify-between">
        //       {/* IRS Checkboxes */}
        //       <br />
        //       <label style={{ marginRight: '20px' }}>
        //         <Toggle
        //           checked={irs30cFilterActive.one && !irs30cFilterActive.zero}
        //           onChange={() => {
        //             const currentlyShowingOnlyOne = irs30cFilterActive.one && !irs30cFilterActive.zero
        //             if (currentlyShowingOnlyOne) {
        //               setIrs30cFilterActive({ zero: true, one: true })
        //             } else {
        //               setIrs30cFilterActive({ zero: false, one: true })
        //             }
        //           }}
        //           icons={false}
        //         />
        //         {/* <span style={{ marginLeft: '20px' }}>IRS 30C Eligible</span> */}
        //       </label>
        //       <LayerControl
        //         mainText="IRS 30C eligible"
        //         hoverText="Toggle to show pixels in areas that are eligible for federal tax credits for EV charger installation, limited to communities designated either low-income or non-urban."
        //         accordionText={`<p>Range: On or Off
        //         </p><p>The IRS 30C Alternative Fuel Vehicle Refueling Property Credit provides generous tax credits for installations by individuals, businesses, nonprofits, and governments in qualifying areas. <a class="inline-link" href="https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit">IRS provides more information</a> on eligibility and procedures.</p><p>The <a class="inline-link" href="https://cleanenergytaxnavigator.org/">Clean Energy Tax Navigator</a> is a free tool to help identify available credits including 30C.</p>`}
        //       />
        //     </div>
        //   )}
        // </>
      )}
    </div>
  )
}
