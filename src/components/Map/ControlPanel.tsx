import * as turf from '@turf/turf'
import { FeatureCollection, GeoJsonProperties, MultiPolygon, Point, Polygon } from 'geojson'
import { useState } from 'react'

import { Range, colors, controlTitles, maxValues } from '@lib/Constants'

import { DataControls } from './DataControls'
import { GeoJSONData, GeoJSONFeature } from './GeoJSONData'

interface ControlPanelProps {
  map: any
  L: any
  // cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon> | null
  simplifiedCityBoundary: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
  priorityDataConfig: any
  feasibleDataConfig: any
  priorityUrl: string
  feasibleUrl: string
  utility?: string | null
  jurisdiction?: string | null
  dispatch: any
  scoreRanges: Record<string, Range>
  filters: Record<string, { zero: boolean; one: boolean }>
  updateRange: (key: string, value: Range) => void
  setFilters: React.Dispatch<React.SetStateAction<Record<string, { zero: boolean; one: boolean }>>>
  resetSliders: () => void
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
  scoreRanges,
  filters,
  updateRange,
  setFilters,
  resetSliders,
}: ControlPanelProps) => {
  const [loading, setLoading] = useState(true)
  const [layerData, setLayerData] = useState<GeoJSONData | null>(null)

  const [priorityLayerData, setPriorityLayerData] = useState<GeoJSONData | null>(null)
  const [feasibleLayerData, setFeasibleLayerData] = useState<GeoJSONData | null>(null)

  const [disabledPrioritySliders, setDisabledPrioritySliders] = useState<Set<string>>(new Set())
  const [disabledFeasibilitySliders, setDisabledFeasibilitySliders] = useState<Set<string>>(new Set())

  // const updateFilter = (key: string, value: { zero: boolean; one: boolean }) => {
  //   setFilters(prev => ({ ...prev, [key]: value }))
  // }
  /**
   * Checks if a value falls within a specified range, with special handling for max values.
   *
   * @param value - The value to check
   * @param range - Tuple of [min, max] values for the range
   * @param max - The maximum possible value for this metric
   * @returns True if value is within range, or if range[1] equals max
   */
  const withinRange = (value: number, range: [number, number], max: number) =>
    value >= range[0] && (value <= range[1] || range[1] === max)

  /**
   * Filters GeoJSON data based on user-selected slider ranges and configuration.
   *
   * This complex function handles filtering for both Priority and Feasibility pixel layers:
   * - Applies range filters for multiple environmental justice indicators (CES, EJScreen, CEJST)
   * - Filters based on census data (demographics, housing, transportation)
   * - Handles infrastructure metrics (EV chargers, grid capacity, registered LEVs)
   * - Applies binary filters for NEVI and IRS 30C eligibility
   *
   * The function dynamically evaluates which filters are active based on the config object
   * and disabled sliders set, then returns only features that pass all active filters.
   *
   * @param dataControlsTitle - Either "Priority Pixels" or "Feasibility Pixels"
   * @param data - The full GeoJSON dataset to filter
   * @param config - Configuration object specifying which filters are active
   * @param disabledSliders - Set of slider keys that should be ignored
   * @returns Filtered GeoJSON data containing only features that match the criteria
   */
  const filterData = (
    dataControlsTitle: string,
    data: GeoJSONData,
    config: any,
    disabledSliders: Set<string>,
  ): GeoJSONData => {
    const tolerance = 0.02 // Adjust for performance vs accuracy
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
          // popRange,
          // cjScoreRange,
          ciScoreRange,
          levRange,
          multiFaRange,
          rentersRange,
          walkableRange,
          drivableRange,
          // commercialRange,
          // residentialRange,
          // nonWhiteRange,
          // commuteRange,
          // disabilityRange,
          pgeRange,
          // cejstRange,
          // cesOzoneRange,
          // cesPm25Range,
          // cesDieselPmRange,
          // cesTrafficRange,
          // cesAsthmaRange,
          // cesLowBirthWeightRange,
          // cesCardiovascularDiseaseRange,
          // cesEducationRange,
          // cesLinguisticIsolationRange,
          // cesPovertyRange,
          // cesUnemploymentRange,
          // cesHousingBurdenRange,
          // ejscreenOzoneRange,
          // ejscreenPm25Range,
          // ejscreenDieselPmRange,
          // ejscreenRseiAirRange,
          // ejscreenPtrafRange,
          // ejscreenNo2Range,
          // cejstDieselExRange,
          // cejstPm25Range,
          // cejstTrafficRange,
          // cejstLowLifeExRange,
          // cejstAsthmaRange,
          // cejstHeartDisRange,
          // cejstHouseBurdRange,
          // cejstLingIsoRange,
          // cejstEducationRange,
          // cejstLmiRange,
          // cejstFpl100Range,
          // cejstFpl200Range,
          // cejstUnemploymentRange,
        } = scoreRanges

        const {
          // popMax,
          ciScoreMax,
          // cjScoreMax,
          // ejScoreMax,
          levMax,
          multiFaMax,
          rentersMax,
          walkableMax,
          drivableMax,
          // commercialMax,
          // residentialMax,
          // nonWhiteMax,
          // commuteMax,
          // disabilityMax,
          pgeMax,
          // CES SubIndicators
          // cesOzoneMax,
          // cesPm25Max,
          // cesDieselPmMax,
          // cesTrafficMax,
          // cesAsthmaMax,
          // cesLowBirthWeightMax,
          // cesCardiovascularDiseaseMax,
          // cesEducationMax,
          // cesLinguisticIsolationMax,
          // cesPovertyMax,
          // cesUnemploymentMax,
          // cesHousingBurdenMax,
          // EJScreen SubIndicators
          // ejscreenOzoneMax,
          // ejscreenPm25Max,
          // ejscreenDieselPmMax,
          // ejscreenRseiAirMax,
          // ejscreenPtrafMax,
          // ejscreenNo2Max,
          // CEJST SubIndicators
          // cejstDieselExMax,
          // cejstPm25Max,
          // cejstTrafficMax,
          // cejstLowLifeExMax,
          // cejstAsthmaMax,
          // cejstHeartDisMax,
          // cejstHouseBurdMax,
          // cejstLingIsoMax,
          // cejstEducationMax,
          // cejstLmiMax,
          // cejstFpl100Max,
          // cejstFpl200Max,
          // cejstUnemploymentMax,
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
            // toggleCEJSTRange: {
            //   value: props.disadvantaged,
            //   range: cjScoreRange,
            //   max: cjScoreMax,
            // },
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
            // toggleNonWhiteRange: {
            //   value: props.non_white_pctl,
            //   range: nonWhiteRange,
            //   max: nonWhiteMax,
            // },
            // toggleCommuteRange: {
            //   value: props.commute_pctl,
            //   range: commuteRange,
            //   max: commuteMax,
            // },
            // toggleDisabilityRange: {
            //   value: props.disability_pctl,
            //   range: disabilityRange,
            //   max: disabilityMax,
            // },
            togglePgeRange: {
              value: pgeOrUtility,
              range: pgeRange,
              max: pgeMax,
            },
            // toggleCesOzoneRange: {
            //   value: props.OzoneP,
            //   range: cesOzoneRange,
            //   max: cesOzoneMax,
            // },
            // toggleCesPm25Range: {
            //   value: props.DieselPM_P,
            //   range: cesPm25Range,
            //   max: cesPm25Max,
            // },
            // toggleCesDieselPmRange: {
            //   value: props.PM2_5_P,
            //   range: cesDieselPmRange,
            //   max: cesDieselPmMax,
            // },
            // toggleCesTrafficRange: {
            //   value: props.TrafficP,
            //   range: cesTrafficRange,
            //   max: cesTrafficMax,
            // },
            // toggleCesAsthmaRange: {
            //   value: props.AsthmaP,
            //   range: cesAsthmaRange,
            //   max: cesAsthmaMax,
            // },
            // toggleCesLowBirthWeightRange: {
            //   value: props.LowBirWP,
            //   range: cesLowBirthWeightRange,
            //   max: cesLowBirthWeightMax,
            // },
            // toggleCesCardiovascularDiseaseRange: {
            //   value: props.CardiovasP,
            //   range: cesCardiovascularDiseaseRange,
            //   max: cesCardiovascularDiseaseMax,
            // },
            // toggleCesEducationRange: {
            //   value: props.EducatP,
            //   range: cesEducationRange,
            //   max: cesEducationMax,
            // },
            // toggleCesLinguisticIsolationRange: {
            //   value: props.Ling_IsolP,
            //   range: cesLinguisticIsolationRange,
            //   max: cesLinguisticIsolationMax,
            // },
            // toggleCesPovertyRange: {
            //   value: props.PovertyP,
            //   range: cesPovertyRange,
            //   max: cesPovertyMax,
            // },
            // toggleCesUnemploymentRange: {
            //   value: props.UnemplP,
            //   range: cesUnemploymentRange,
            //   max: cesUnemploymentMax,
            // },
            // toggleCesHousingBurdenRange: {
            //   value: props.HousBurdP,
            //   range: cesHousingBurdenRange,
            //   max: cesHousingBurdenMax,
            // },
            // toggleEjScreenOzoneRange: {
            //   value: props.P_D2_OZONE,
            //   range: ejscreenOzoneRange,
            //   max: ejscreenOzoneMax,
            // },
            // toggleEjScreenPm25Range: {
            //   value: props.P_D2_PM25,
            //   range: ejscreenPm25Range,
            //   max: ejscreenPm25Max,
            // },
            // toggleEjScreenDieselPmRange: {
            //   value: props.P_D2_DSLPM,
            //   range: ejscreenDieselPmRange,
            //   max: ejscreenDieselPmMax,
            // },
            // toggleEjScreenRseiAirRange: {
            //   value: props.P_D2_RSEI_AIR,
            //   range: ejscreenRseiAirRange,
            //   max: ejscreenRseiAirMax,
            // },
            // toggleEjScreenPtrafRange: {
            //   value: props.P_D2_PTRAF,
            //   range: ejscreenPtrafRange,
            //   max: ejscreenPtrafMax,
            // },
            // toggleEjScreenNo2Range: {
            //   value: props.P_D2_NO2,
            //   range: ejscreenNo2Range,
            //   max: ejscreenNo2Max,
            // },
            // toggleCejstDieselExRange: {
            //   value: props.diesel_ex,
            //   range: cejstDieselExRange,
            //   max: cejstDieselExMax,
            // },
            // toggleCejstPm25Range: {
            //   value: props.pm25,
            //   range: cejstPm25Range,
            //   max: cejstPm25Max,
            // },
            // toggleCejstTrafficRange: {
            //   value: props.traffic,
            //   range: cejstTrafficRange,
            //   max: cejstTrafficMax,
            // },
            // toggleCejstLowLifeExRange: {
            //   value: props.low_life_ex,
            //   range: cejstLowLifeExRange,
            //   max: cejstLowLifeExMax,
            // },
            // // toggleCejstAsthmaRange: { value: pgeOrUtility, range: cejstAsthmaRange, max: cejstAsthmaMax },
            // toggleCejstHeartDisRange: {
            //   value: props.heart_dis,
            //   range: cejstHeartDisRange,
            //   max: cejstHeartDisMax,
            // },
            // toggleCejstHouseBurdRange: {
            //   value: props.house_burd,
            //   range: cejstHouseBurdRange,
            //   max: cejstHouseBurdMax,
            // },
            // toggleCejstLingIsoRange: {
            //   value: props.ling_iso,
            //   range: cejstLingIsoRange,
            //   max: cejstLingIsoMax,
            // },
            // toggleCejstEducationRange: {
            //   value: props.education,
            //   range: cejstEducationRange,
            //   max: cejstEducationMax,
            // },
            // toggleCejstLmiRange: {
            //   value: props.LMI,
            //   range: cejstLmiRange,
            //   max: cejstLmiMax,
            // },
            // toggleCejstFpl100Range: {
            //   value: props['100_fpl'],
            //   range: cejstFpl100Range,
            //   max: cejstFpl100Max,
            // },
            // toggleCejstFpl200Range: {
            //   value: props['200_fpl'],
            //   range: cejstFpl200Range,
            //   max: cejstFpl200Max,
            // },
            // toggleCejstUnemploymentRange: {
            //   value: props.unemployment,
            //   range: cejstUnemploymentRange,
            //   max: cejstUnemploymentMax,
            // },
          }
          const activeConditions = Object.keys(conditions).filter(
            (key): key is keyof typeof conditions =>
              (config[key] ||
                config.census?.[key] ||
                config.subIndicators?.CES?.[key] ||
                config.subIndicators?.EJScreen?.[key] ||
                config.subIndicators?.CEJST?.[key]) &&
              !['nevi', 'irs30c', 'pge'].includes(key) &&
              !disabledSliders.has(key), // Exclude disabled sliders
          )

          // If no conditions are active, don't show any polygons
          if (activeConditions.length === 0) {
            withinPropertyCriteria = false
          } else {
            withinPropertyCriteria = activeConditions.every(key =>
              withinRange(conditions[key].value, conditions[key].range, conditions[key].max),
            )
          }
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
            // check if the point is inside any polygon in the collection
            return simplifiedCityBoundary.features.some(f =>
              turf.booleanPointInPolygon(geometry as unknown as Point, f),
            )
          }

          if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
            return simplifiedCityBoundary.features.some(f => {
              const simplifiedGeometry = turf.simplify(geometry, { tolerance, highQuality: true })
              return !turf.booleanDisjoint(simplifiedGeometry, f)
            })
          }
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
    disabledSliders: Set<string>,
  ) => {
    try {
      const response = await fetch(geojsonUrl)
      const dataJson: GeoJSONData = await response.json()
      const filteredData = filterData(dataControlsTitle, dataJson, config, disabledSliders)
      setLayerDataFn(filteredData)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`GeoJSON not loaded for ${dataControlsTitle}:`, error)
      }
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
        fetchAndFilterData={() =>
          fetchAndFilterData(
            controlTitles.priority,
            priorityUrl,
            priorityDataConfig,
            setPriorityLayerData,
            disabledPrioritySliders,
          )
        }
        resetSliders={resetSliders}
        scoreRanges={scoreRanges}
        updateRange={updateRange}
        filters={filters}
        setFilters={setFilters}
        disabledSliders={disabledPrioritySliders}
        setDisabledSliders={setDisabledPrioritySliders}
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
        fetchAndFilterData={() =>
          fetchAndFilterData(
            controlTitles.feasibility,
            feasibleUrl,
            feasibleDataConfig,
            setFeasibleLayerData,
            disabledFeasibilitySliders,
          )
        }
        resetSliders={resetSliders}
        scoreRanges={scoreRanges}
        updateRange={updateRange}
        filters={filters}
        setFilters={setFilters}
        disabledSliders={disabledFeasibilitySliders}
        setDisabledSliders={setDisabledFeasibilitySliders}
      />
    </>
  )
}
