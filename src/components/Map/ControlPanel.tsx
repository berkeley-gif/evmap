import * as turf from '@turf/turf'
import { Feature, FeatureCollection, GeoJsonProperties, MultiPolygon, Point, Polygon } from 'geojson'
import { useMemo, useState } from 'react'

import { Range, colors, controlTitles, initialScoreRanges, maxValues } from '@lib/Constants'

import { DataControls } from './DataControls'
import { GeoJSONData, GeoJSONFeature } from './GeoJSONData'

interface ControlPanelProps {
  map: any
  L: any
  // cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon> | null
  simplifiedCityBoundary: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null
  priorityDataConfig: any
  feasibleDataConfig: any
  priorityUrl: string
  feasibleUrl: string
  utility?: string | null
  jurisdiction?: string | null
  dispatch: any
  priorityPolygonData: any
  feasiblePolygonData: any
}

export const ControlPanel = ({
  map,
  L,
  simplifiedCityBoundary,
  // cityBoundaryGeoJSON,
  priorityDataConfig,
  feasibleDataConfig,
  priorityUrl,
  feasibleUrl,
  utility,
  jurisdiction,
  dispatch,
  priorityPolygonData,
  feasiblePolygonData,
}: ControlPanelProps) => {
  const [loading, setLoading] = useState(true)
  const [layerData, setLayerData] = useState<GeoJSONData | null>(null)
  const [scoreRanges, setScoreRanges] = useState<Record<string, Range>>(initialScoreRanges)
  const [filters, setFilters] = useState<Record<string, { zero: boolean; one: boolean }>>({
    neviFilterActive: { zero: true, one: true },
    irs30cFilterActive: { zero: true, one: true },
  })

  const [priorityLayerData, setPriorityLayerData] = useState<GeoJSONData | null>(null)
  const [feasibleLayerData, setFeasibleLayerData] = useState<GeoJSONData | null>(null)

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

  // const updateFilter = (key: string, value: { zero: boolean; one: boolean }) => {
  //   setFilters(prev => ({ ...prev, [key]: value }))
  // }
  const withinRange = (value: number, range: [number, number], max: number) =>
    value >= range[0] && (value <= range[1] || range[1] === max)

  const filterData = (
    dataControlsTitle: string,
    data: GeoJSONData,
    // cityBoundaryData: FeatureCollection<Polygon | MultiPolygon> | null,
    // simplifiedCityBoundary: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null,
    config: any,
  ): GeoJSONData => {
    const tolerance = 0.00001 // Adjust for performance vs accuracy
    // const simplifiedCityBoundary =
    //   cityBoundaryData && cityBoundaryData.features.length > 0
    //     ? turf.simplify(cityBoundaryData.features[0], { tolerance, highQuality: false })
    //     : null
    return {
      ...data,
      features: data.features.filter((feature: GeoJSONFeature) => {
        const props = feature.properties
        const pgeOrUtility = props.pge ?? props.utility ?? 0
        const {
          popRange,
          cjScoreRange,
          ciScoreRange,
          levRange,
          multiFaRange,
          rentersRange,
          walkableRange,
          drivableRange,
          commercialRange,
          residentialRange,
          nonWhiteRange,
          commuteRange,
          disabilityRange,
          pgeRange,
          cjestRange,
          cesOzoneRange,
          cesPm25Range,
          cesDieselPmRange,
          cesTrafficRange,
          cesAsthmaRange,
          cesLowBirthWeightRange,
          cesCardiovascularDiseaseRange,
          cesEducationRange,
          cesLinguisticIsolationRange,
          cesPovertyRange,
          cesUnemploymentRange,
          cesHousingBurdenRange,
          ejscreenOzoneRange,
          ejscreenPm25Range,
          ejscreenDieselPmRange,
          ejscreenRseiAirRange,
          ejscreenPtrafRange,
          ejscreenNo2Range,
          cjestDieselExRange,
          cjestPm25Range,
          cjestTrafficRange,
          cjestLowLifeExRange,
          cjestAsthmaRange,
          cjestHeartDisRange,
          cjestHouseBurdRange,
          cjestLingIsoRange,
          cjestEducationRange,
          cjestLmiRange,
          cjestFpl100Range,
          cjestFpl200Range,
          cjestUnemploymentRange,
        } = scoreRanges

        const {
          // popMax,
          ciScoreMax,
          cjScoreMax,
          // ejScoreMax,
          levMax,
          multiFaMax,
          rentersMax,
          walkableMax,
          drivableMax,
          // commercialMax,
          // residentialMax,
          nonWhiteMax,
          commuteMax,
          disabilityMax,
          pgeMax,
          // CES SubIndicators
          cesOzoneMax,
          cesPm25Max,
          cesDieselPmMax,
          cesTrafficMax,
          cesAsthmaMax,
          cesLowBirthWeightMax,
          cesCardiovascularDiseaseMax,
          cesEducationMax,
          cesLinguisticIsolationMax,
          cesPovertyMax,
          cesUnemploymentMax,
          cesHousingBurdenMax,
          // EJScreen SubIndicators
          ejscreenOzoneMax,
          ejscreenPm25Max,
          ejscreenDieselPmMax,
          ejscreenRseiAirMax,
          ejscreenPtrafMax,
          ejscreenNo2Max,
          // CJEST SubIndicators
          cjestDieselExMax,
          cjestPm25Max,
          cjestTrafficMax,
          cjestLowLifeExMax,
          cjestAsthmaMax,
          cjestHeartDisMax,
          cjestHouseBurdMax,
          cjestLingIsoMax,
          cjestEducationMax,
          cjestLmiMax,
          cjestFpl100Max,
          cjestFpl200Max,
          cjestUnemploymentMax,
        } = maxValues

        const { neviFilterActive: nevi, irs30cFilterActive: irs30c } = filters
        let withinPropertyCriteria
        // const withinRange = (value: number, range: [number, number], max: number) =>
        //   value >= range[0] && (value <= range[1] || range[1] === max)
        if (dataControlsTitle === 'Priority Pixels') {
          const chg_walk = props.chg_walk ?? props.chg_walk_L2_10
          const chg_drive = props.chg_drive ?? props.chg_drive_DCF_10
          const conditions = {
            toggleCiRange: {
              value: props.CIscoreP,
              range: ciScoreRange,
              max: ciScoreMax,
            },
            toggleCJESTRange: {
              value: props.disadvantaged,
              range: cjScoreRange,
              max: cjScoreMax,
            },
            toggleMultiFaRange: {
              value: props['Multi-Family Housing Residents'],
              range: multiFaRange,
              max: multiFaMax,
            },
            toggleRentersRange: {
              value: props.Renters,
              range: rentersRange,
              max: rentersMax,
            },
            toggleWalkableRange: {
              value: chg_walk,
              range: walkableRange,
              max: walkableMax,
            },
            toggleDrivableRange: {
              value: chg_drive,
              range: drivableRange,
              max: drivableMax,
            },
            toggleLevRange: {
              value: props.lev_10000,
              range: levRange,
              max: levMax,
            },
            toggleNonWhiteRange: {
              value: props.non_white_pctl,
              range: nonWhiteRange,
              max: nonWhiteMax,
            },
            toggleCommuteRange: {
              value: props.commute_pctl,
              range: commuteRange,
              max: commuteMax,
            },
            toggleDisabilityRange: {
              value: props.disability_pctl,
              range: disabilityRange,
              max: disabilityMax,
            },
            togglePgeRange: {
              value: pgeOrUtility,
              range: pgeRange,
              max: pgeMax,
            },
            toggleCesOzoneRange: {
              value: props.OzoneP,
              range: cesOzoneRange,
              max: cesOzoneMax,
            },
            toggleCesPm25Range: {
              value: props.DieselPM_P,
              range: cesPm25Range,
              max: cesPm25Max,
            },
            toggleCesDieselPmRange: {
              value: props.PM2_5_P,
              range: cesDieselPmRange,
              max: cesDieselPmMax,
            },
            toggleCesTrafficRange: {
              value: props.TrafficP,
              range: cesTrafficRange,
              max: cesTrafficMax,
            },
            toggleCesAsthmaRange: {
              value: props.AsthmaP,
              range: cesAsthmaRange,
              max: cesAsthmaMax,
            },
            toggleCesLowBirthWeightRange: {
              value: props.LowBirWP,
              range: cesLowBirthWeightRange,
              max: cesLowBirthWeightMax,
            },
            toggleCesCardiovascularDiseaseRange: {
              value: props.CardiovasP,
              range: cesCardiovascularDiseaseRange,
              max: cesCardiovascularDiseaseMax,
            },
            toggleCesEducationRange: {
              value: props.EducatP,
              range: cesEducationRange,
              max: cesEducationMax,
            },
            toggleCesLinguisticIsolationRange: {
              value: props.Ling_IsolP,
              range: cesLinguisticIsolationRange,
              max: cesLinguisticIsolationMax,
            },
            toggleCesPovertyRange: {
              value: props.PovertyP,
              range: cesPovertyRange,
              max: cesPovertyMax,
            },
            toggleCesUnemploymentRange: {
              value: props.UnemplP,
              range: cesUnemploymentRange,
              max: cesUnemploymentMax,
            },
            toggleCesHousingBurdenRange: {
              value: props.HousBurdP,
              range: cesHousingBurdenRange,
              max: cesHousingBurdenMax,
            },
            toggleEjScreenOzoneRange: {
              value: props.P_D2_OZONE,
              range: ejscreenOzoneRange,
              max: ejscreenOzoneMax,
            },
            toggleEjScreenPm25Range: {
              value: props.P_D2_PM25,
              range: ejscreenPm25Range,
              max: ejscreenPm25Max,
            },
            toggleEjScreenDieselPmRange: {
              value: props.P_D2_DSLPM,
              range: ejscreenDieselPmRange,
              max: ejscreenDieselPmMax,
            },
            toggleEjScreenRseiAirRange: {
              value: props.P_D2_RSEI_AIR,
              range: ejscreenRseiAirRange,
              max: ejscreenRseiAirMax,
            },
            toggleEjScreenPtrafRange: {
              value: props.P_D2_PTRAF,
              range: ejscreenPtrafRange,
              max: ejscreenPtrafMax,
            },
            toggleEjScreenNo2Range: {
              value: props.P_D2_NO2,
              range: ejscreenNo2Range,
              max: ejscreenNo2Max,
            },
            toggleCjestDieselExRange: {
              value: props.diesel_ex,
              range: cjestDieselExRange,
              max: cjestDieselExMax,
            },
            toggleCjestPm25Range: {
              value: props.pm25,
              range: cjestPm25Range,
              max: cjestPm25Max,
            },
            toggleCjestTrafficRange: {
              value: props.traffic,
              range: cjestTrafficRange,
              max: cjestTrafficMax,
            },
            toggleCjestLowLifeExRange: {
              value: props.low_life_ex,
              range: cjestLowLifeExRange,
              max: cjestLowLifeExMax,
            },
            // toggleCjestAsthmaRange: { value: pgeOrUtility, range: cjestAsthmaRange, max: cjestAsthmaMax },
            toggleCjestHeartDisRange: {
              value: props.heart_dis,
              range: cjestHeartDisRange,
              max: cjestHeartDisMax,
            },
            toggleCjestHouseBurdRange: {
              value: props.house_burd,
              range: cjestHouseBurdRange,
              max: cjestHouseBurdMax,
            },
            toggleCjestLingIsoRange: {
              value: props.ling_iso,
              range: cjestLingIsoRange,
              max: cjestLingIsoMax,
            },
            toggleCjestEducationRange: {
              value: props.education,
              range: cjestEducationRange,
              max: cjestEducationMax,
            },
            toggleCjestLmiRange: {
              value: props.LMI,
              range: cjestLmiRange,
              max: cjestLmiMax,
            },
            toggleCjestFpl100Range: {
              value: props['100_fpl'],
              range: cjestFpl100Range,
              max: cjestFpl100Max,
            },
            toggleCjestFpl200Range: {
              value: props['200_fpl'],
              range: cjestFpl200Range,
              max: cjestFpl200Max,
            },
            toggleCjestUnemploymentRange: {
              value: props.unemployment,
              range: cjestUnemploymentRange,
              max: cjestUnemploymentMax,
            },
          }
          withinPropertyCriteria = Object.keys(conditions)
            .filter(
              (key): key is keyof typeof conditions =>
                (config[key] ||
                  config.census?.[key] ||
                  config.subIndicators?.CES?.[key] ||
                  config.subIndicators?.EJScreen?.[key] ||
                  config.subIndicators?.CJEST?.[key]) &&
                !['nevi', 'irs30c', 'pge'].includes(key),
            )
            .every(key => withinRange(conditions[key].value, conditions[key].range, conditions[key].max))
        } else {
          withinPropertyCriteria =
            ((nevi.zero && props.nevi === 0) || (nevi.one && props.nevi === 1)) &&
            ((irs30c.zero && props.irs30c === 0) || (irs30c.one && props.irs30c === 1)) &&
            withinRange(pgeOrUtility, pgeRange, pgeMax)
        }

        if (!withinPropertyCriteria) {
          return false
        }
        if (simplifiedCityBoundary) {
          const { geometry } = feature
          if (geometry.type === 'Point') {
            return turf.booleanPointInPolygon(geometry as unknown as Point, simplifiedCityBoundary)
          }
          if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
            const simplifiedGeometry = turf.simplify(geometry, { tolerance, highQuality: true })
            return !turf.booleanDisjoint(simplifiedGeometry, simplifiedCityBoundary)
            // turf.booleanIntersects(simplifiedGeometry, simplifiedCityBoundary //
            // turf.booleanOverlap(simplifiedGeometry, simplifiedCityBoundary) ||
            // turf.booleanContains(simplifiedCityBoundary, simplifiedGeometry) || //
            // turf.booleanWithin(simplifiedGeometry, simplifiedCityBoundary)
          }
          return false
        }
        return true
      }),
    }
  }

  const fetchAndFilterData = async (
    dataControlsTitle: string,
    geojsonUrl: string,
    config: any,
    setLayerDataFn: (data: GeoJSONData) => void,
  ) => {
    try {
      const response = await fetch(geojsonUrl)
      const dataJson: GeoJSONData = await response.json()
      const filteredData = filterData(dataControlsTitle, dataJson, config)
      setLayerDataFn(filteredData)
    } catch (error) {
      console.error('Error fetching GeoJSON data:', error)
    } finally {
      setLoading(false)
    }
  }
  // fetchAndFilterData()
  // }, [scoreRanges, filters, cityBoundaryGeoJSON])

  return (
    <>
      <DataControls
        dataControlsTitle={controlTitles.priority}
        map={map}
        L={L}
        simplifiedCityBoundary={simplifiedCityBoundary}
        color={colors.blue}
        layerData={priorityLayerData}
        otherLayerData={feasibleLayerData}
        config={priorityDataConfig}
        dispatch={dispatch}
        loading={loading}
        filterData={filterData}
        fetchAndFilterData={(title: string, url: string, config: any) =>
          fetchAndFilterData(controlTitles.priority, priorityUrl, priorityDataConfig, setPriorityLayerData)
        }
        resetSliders={resetSliders}
        scoreRanges={scoreRanges}
        updateRange={updateRange}
        filters={filters}
        setFilters={setFilters}
      />
      <DataControls
        dataControlsTitle={controlTitles.feasibility}
        jurisdiction={jurisdiction}
        utility={utility}
        map={map}
        L={L}
        simplifiedCityBoundary={simplifiedCityBoundary}
        color={colors.orange}
        layerData={feasibleLayerData}
        otherLayerData={priorityLayerData}
        config={feasibleDataConfig}
        dispatch={dispatch}
        loading={loading}
        filterData={filterData}
        fetchAndFilterData={(title: string, url: string, config: any) =>
          fetchAndFilterData(controlTitles.feasibility, feasibleUrl, feasibleDataConfig, setFeasibleLayerData)
        }
        resetSliders={resetSliders}
        scoreRanges={scoreRanges}
        updateRange={updateRange}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  )
}
