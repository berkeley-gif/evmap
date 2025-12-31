/* eslint-disable func-names */

/* eslint-disable @typescript-eslint/no-shadow */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable react/jsx-no-bind */

/* eslint-disable jsx-a11y/alt-text */

/* eslint-disable react/button-has-type */

/* eslint-disable jsx-a11y/control-has-associated-label */

/* eslint-disable @typescript-eslint/no-use-before-define */

/* eslint-disable import/no-cycle */

/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable jsx-a11y/label-has-associated-control */

/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as turf from '@turf/turf'
import ConfigurationPanel from '@map/ConfigurationPanel'
import ContextMenu from '@map/ContextMenu'
import { GeoJSONData, LeafletMapContainer, MapMarker } from '@map/GeoJSONData'
import PolygonClickMenu from '@map/PolygonClickMenu'
import WelcomeModal from '@map/WelcomeModal'
import useLeaflet from '@map/useLeaflet'
import useLeafletWindow from '@map/useLeafletWindow'
import useMapContext from '@map/useMapContext'
import useMarkerData from '@map/useMarkerData'
import counties from '@public/jurisdictions.json'
import booleanIntersects from '@turf/boolean-intersects'
import { Feature, FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson'
import { isEqual } from 'lodash'
import React, { Dispatch, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import 'react-toggle/style.css'

import AddressSearch from '@components/Map/AddressSearch'
import ColocationPoint from '@components/Map/ColocationPoint'
import MapNavBar from '@components/MapNavBar'

import { FeasibilityDataConfig, PriorityDataConfig } from '@src/types/config'

import { AppConfig } from '@lib/AppConfig'
import { Range, initialScoreRanges, maxValues } from '@lib/Constants'
import MapProps from '@lib/MapProps'
import NavBarProps from '@lib/NavBarProps'
import { Places } from '@lib/Places'
import { SliderConfigs } from '@lib/SliderConfigs'

import { ControlPanel } from '../../components/Map/ControlPanel'

type LatLngType = { lat: number; lng: number } | null
type PolygonFeature = Feature<Polygon | MultiPolygon, GeoJsonProperties>

interface UseLayerGroupEffectParams {
  map: any
  data: GeoJSONData | null
  showLayer: boolean
  layerGroupName: string
  iconUrl: string
  L: any
}

interface LayerToggleState {
  showTransitStops: boolean
  showLihtc: boolean
  showLibrary: boolean
  showSchool: boolean
  showParksAndRecreation: boolean
  showHealthcareFacilities: boolean
}

interface LayerDataState {
  transitStopsData: GeoJSONData | null
  lihtcData: GeoJSONData | null
  libraryData: GeoJSONData | null
  schoolsData: GeoJSONData | null
  parksAndRecreationData: GeoJSONData | null
  healthcareFacilitiesData: GeoJSONData | null
}

interface UIState {
  openWelcomeModal: boolean
  isConfigPanelOpen: boolean
  coordinatesTB: boolean
  contextMenuVisible: boolean
  polygonClickMenuVisible: boolean
  menuPosition: { x: number; y: number }
  clickedLatLng: LatLngType | null
}

interface AnalysisState {
  priorityData: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
  feasibleData: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
  priorityDataConfig: PriorityDataConfig
  feasibleDataConfig: FeasibilityDataConfig
  priorityPolygonData: PolygonFeature | null
  feasiblePolygonData: PolygonFeature | null
  scoreRanges: Record<string, Range>
  filters: Record<string, { zero: boolean; one: boolean }>
}

export type MapState = LayerToggleState & LayerDataState & UIState & AnalysisState

export type MapAction =
  | { type: 'SET_FIELD'; field: keyof MapState; payload: MapState[keyof MapState] }
  | { type: 'RESET_STATE' }

export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.payload }
    case 'RESET_STATE':
      return initialState
    default:
      return state
  }
}

const initialState: MapState = {
  showTransitStops: false,
  transitStopsData: null,
  showLihtc: false,
  lihtcData: null,
  showLibrary: false,
  libraryData: null,
  showSchool: false,
  schoolsData: null,
  showParksAndRecreation: false,
  parksAndRecreationData: null,
  showHealthcareFacilities: false,
  healthcareFacilitiesData: null,
  openWelcomeModal: false,
  isConfigPanelOpen: false,
  coordinatesTB: false,
  priorityDataConfig: {
    toggleCEJSTRange: false,
    toggleEJScreenRange: false,
    toggleCiRange: true,
    scoreType: 'composite',
    subIndicators: {
      CES: {
        toggleCesOzoneRange: false,
        toggleCesPm25Range: false,
        toggleCesDieselPmRange: false,
        toggleCesTrafficRange: false,
        toggleCesAsthmaRange: false,
        toggleCesLowBirthWeightRange: false,
        toggleCesCardiovascularDiseaseRange: false,
        toggleCesEducationRange: false,
        toggleCesLinguisticIsolationRange: false,
        toggleCesPovertyRange: false,
        toggleCesUnemploymentRange: false,
        toggleCesHousingBurdenRange: false,
      },
      EJScreen: {
        toggleEjScreenOzoneRange: false,
        toggleEjScreenPm25Range: false,
        toggleEjScreenDieselPmRange: false,
        toggleEjScreenRseiAirRange: false,
        toggleEjScreenPtrafRange: false,
        toggleEjScreenNo2Range: false,
      },
      CEJST: {
        toggleCejstDieselExRange: false,
        toggleCejstPm25Range: false,
        toggleCejstTrafficRange: false,
        toggleCejstLowLifeExRange: false,
        toggleCejstAsthmaRange: false,
        toggleCejstHeartDisRange: false,
        toggleCejstHouseBurdRange: false,
        toggleCejstLingIsoRange: false,
        toggleCejstEducationRange: false,
        toggleCejstLmiRange: false,
        toggleCejstFpl100Range: false,
        toggleCejstFpl200Range: false,
        toggleCejstUnemploymentRange: false,
      },
    },
    census: {
      toggleNonWhiteRange: false,
      toggleCommuteRange: false,
      toggleDisabilityRange: false,
    },
    togglePopRange: false,
    toggleLevRange: true,
    toggleMultiFaRange: true,
    toggleRentersRange: true,
    toggleWalkableRange: true,
    toggleDrivableRange: true,
    // toggleCommercialRange: true,
    // toggleResidentialRange: true,
  },
  feasibleDataConfig: {
    toggleNeviFilterActive: true,
    toggleirs30cFilterActive: true,
    togglePgeRange: true,
  },
  priorityPolygonData: null,
  feasiblePolygonData: null,
  contextMenuVisible: false,
  polygonClickMenuVisible: false,
  menuPosition: { x: 0, y: 0 },
  clickedLatLng: null,
  priorityData: null,
  feasibleData: null,
  scoreRanges: initialScoreRanges,
  filters: {
    neviFilterActive: { zero: true, one: true },
    irs30cFilterActive: { zero: true, one: true },
  },
}

export const Map: React.FC<NavBarProps> = ({ setCurrentView = () => {} }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState)
  const {
    showTransitStops,
    transitStopsData,
    showLihtc,
    lihtcData,
    showLibrary,
    libraryData,
    showSchool,
    schoolsData,
    showParksAndRecreation,
    parksAndRecreationData,
    showHealthcareFacilities,
    healthcareFacilitiesData,
    openWelcomeModal,
    isConfigPanelOpen,
    coordinatesTB,
    priorityDataConfig,
    feasibleDataConfig,
    priorityPolygonData,
    feasiblePolygonData,
    contextMenuVisible,
    polygonClickMenuVisible,
    menuPosition,
    clickedLatLng,
    scoreRanges,
    filters,
  } = state
  const { map, cityConfig = {} as MapProps } = useMapContext()
  const leafletWindow = useLeafletWindow()
  const L = useLeaflet()

  const jurisdictionLookup = preprocessJurisdictions(counties)
  const {
    width: viewportWidth,
    height: viewportHeight,
    ref: viewportRef,
  } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200,
  })

  const pinIcon = L?.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="font-size: 24px; color: #3388ff;">
        <i class="map pin icon"></i>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  })

  const { clustersByCategory, allMarkersBoundCenter: rawCenter } = useMarkerData({
    locations: Places,
    map,
    viewportWidth,
    viewportHeight,
  })
  const allMarkersBoundCenter = useMemo(() => {
    if (!rawCenter) return null
    const { centerPos, minZoom } = rawCenter

    if (Array.isArray(centerPos)) {
      return { centerPos: centerPos as [number, number], minZoom }
    }

    return { centerPos: [centerPos.lat, centerPos.lng] as [number, number], minZoom }
  }, [rawCenter])

  const isLoading = !map || !leafletWindow || !viewportWidth || !viewportHeight

  /**
   * Generates a CSV file containing the current slider configuration state.
   *
   * Creates a CSV with columns: Layer, Slider Name, Min Value, Max Value
   * Includes all active sliders for both Priority and Feasibility layers,
   * plus binary filters like NEVI and IRS 30C eligibility.
   *
   * @returns CSV string with header and data rows
   */
  const generateSliderCSV = () => {
    const csvRows: string[] = []
    csvRows.push('Layer,Slider Name,Min Value,Max Value')

    SliderConfigs.forEach(slider => {
      const isActive =
        priorityDataConfig[slider.trigger as keyof PriorityDataConfig] ||
        priorityDataConfig.census?.[slider.trigger] ||
        priorityDataConfig.subIndicators?.CES?.[slider.trigger] ||
        priorityDataConfig.subIndicators?.EJScreen?.[slider.trigger] ||
        priorityDataConfig.subIndicators?.CEJST?.[slider.trigger]

      if (isActive) {
        const range = scoreRanges[slider.value] || [0, 0]
        csvRows.push(`Priority Pixels,"${slider.mainText}",${range[0]},${range[1]}`)
      }
    })

    SliderConfigs.forEach(slider => {
      const isActive = feasibleDataConfig[slider.trigger as keyof FeasibilityDataConfig]

      if (isActive) {
        const range = scoreRanges[slider.value] || [0, 0]
        csvRows.push(`Feasibility Pixels,"${slider.mainText}",${range[0]},${range[1]}`)
      }
    })

    if (feasibleDataConfig.toggleNeviFilterActive) {
      const neviState = filters.neviFilterActive?.one && !filters.neviFilterActive?.zero ? 'On' : 'Off'
      csvRows.push(`Feasibility Pixels,"NEVI eligible",${neviState},${neviState}`)
    }
    if (feasibleDataConfig.toggleirs30cFilterActive) {
      const irs30cState = filters.irs30cFilterActive?.one && !filters.irs30cFilterActive?.zero ? 'On' : 'Off'
      csvRows.push(`Feasibility Pixels,"IRS 30C eligible",${irs30cState},${irs30cState}`)
    }

    return csvRows.join('\n')
  }

  /**
   * Captures a screenshot of the map and downloads it along with configuration data.
   *
   * This function handles two different screenshot modes:
   *
   * 1. **Embedded Mode (iframe)**: When the app is embedded in another page, sends a
   *    postMessage to the parent window requesting a screenshot. The parent is responsible
   *    for capturing and saving the image.
   *
   * 2. **Standalone Mode**: Uses the browser's getDisplayMedia API to capture the screen,
   *    converts it to PNG, and triggers a download. Also generates and downloads a CSV
   *    file containing the current slider configuration.
   *
   * The files are named with coordinates if a location is pinned, otherwise timestamped.
   * Properly cleans up media streams and object URLs after completion.
   *
   * @throws Will log errors to console if screenshot capture fails
   */
  const takeScreenshot = async () => {
    try {
      const coords = clickedLatLng
      const isEmbedded = typeof window !== 'undefined' && window.self !== window.top

      if (isEmbedded) {
        const csvContent = generateSliderCSV()

        const parentOrigin =
          process.env.NEXT_PUBLIC_PARENT_ORIGIN ||
          (typeof document !== 'undefined' && document.referrer ? new URL(document.referrer).origin : '*')

        window.parent.postMessage(
          {
            type: 'TAKE_SCREENSHOT_REQUEST',
            data: {
              coords,
              timestamp: Date.now(),
              csvContent,
              csvFilename:
                coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
                  ? `Lat${coords.lat.toFixed(4)}_Lng${coords.lng.toFixed(4)}_config.csv`
                  : `screenshot_${Date.now()}_config.csv`,
              imageFilename:
                coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
                  ? `Lat${coords.lat.toFixed(4)}_Lng${coords.lng.toFixed(4)}.png`
                  : `screenshot_${Date.now()}.png`,
            },
          },
          parentOrigin,
        )

        console.log(`Screenshot request sent to parent window (${parentOrigin})`)
        return
      }

      dispatch({ type: 'SET_FIELD', field: 'coordinatesTB', payload: true })

      const displayMediaOptions = {
        video: { displaySurface: 'browser' } as MediaTrackConstraints,
        preferCurrentTab: true,
      }

      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
      const video = document.createElement('video')
      let objectUrl: string | null = null
      try {
        video.srcObject = stream
        video.muted = true
        await video.play()

        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || window.innerWidth
        canvas.height = video.videoHeight || window.innerHeight

        const context = canvas.getContext('2d')
        if (!context) throw new Error('Failed to get 2D rendering context')

        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const blob: Blob | null = await new Promise(resolve => {
          canvas.toBlob(resolve, 'image/png')
        })
        if (!blob) throw new Error('Failed to create image blob')

        objectUrl = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = objectUrl
        const filename =
          coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
            ? `Lat${coords.lat.toFixed(4)}_Lng${coords.lng.toFixed(4)}.png`
            : `screenshot_${Date.now()}.png`
        link.download = filename
        document.body.appendChild(link)
        link.click()
        link.remove()

        // revoke after short delay to ensure download started
        setTimeout(() => {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl)
            objectUrl = null
          }
        }, 1000)

        // Download CSV with slider configuration
        const csvContent = generateSliderCSV()
        const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const csvUrl = URL.createObjectURL(csvBlob)
        const csvLink = document.createElement('a')
        csvLink.href = csvUrl
        const csvFilename =
          coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
            ? `Lat${coords.lat.toFixed(4)}_Lng${coords.lng.toFixed(4)}_config.csv`
            : `screenshot_${Date.now()}_config.csv`
        csvLink.download = csvFilename
        document.body.appendChild(csvLink)
        csvLink.click()
        csvLink.remove()
        URL.revokeObjectURL(csvUrl)
      } finally {
        try {
          stream.getTracks().forEach(track => {
            try {
              track.stop()
            } catch (e) {
              console.debug('Error getting tracks:', e)
            }
          })
        } catch (e) {
          console.debug('Error getting tracks:', e)
        }
        if (video && video.srcObject) {
          video.srcObject = null
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      dispatch({ type: 'SET_FIELD', field: 'coordinatesTB', payload: false })
    }
  }

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault()
    if (map && L) {
      const latLng = map.mouseEventToLatLng(event.nativeEvent as MouseEvent)
      dispatch({ type: 'SET_FIELD', field: 'clickedLatLng', payload: latLng })
    }
    dispatch({
      type: 'SET_FIELD',
      field: 'menuPosition',
      payload: {
        x: event.clientX,
        y: event.clientY,
      },
    })
    dispatch({ type: 'SET_FIELD', field: 'contextMenuVisible', payload: true })
  }

  const handleClick = () => {
    dispatch({ type: 'SET_FIELD', field: 'contextMenuVisible', payload: false })
  }

  const cityBoundaryGeoJSON = useEffectFetchCityBoundary()

  interface CachedType {
    cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
    simplifiedCityBoundary: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
  }

  const cachedRef = useRef<CachedType>({
    cityBoundaryGeoJSON: null,
    simplifiedCityBoundary: null,
  })

  let formattedCity = ''
  if (cityConfig?.city) {
    formattedCity = cityConfig.city.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
  }
  const utility = getUtilityProvider(jurisdictionLookup, formattedCity)

  // Helper functions for managing scoreRanges and filters
  const updateRange = (key: string, value: Range) => {
    dispatch({ type: 'SET_FIELD', field: 'scoreRanges', payload: { ...scoreRanges, [key]: value } })
  }

  const setFilters = (
    newFilters:
      | Record<string, { zero: boolean; one: boolean }>
      | ((
          prev: Record<string, { zero: boolean; one: boolean }>,
        ) => Record<string, { zero: boolean; one: boolean }>),
  ) => {
    const updatedFilters = typeof newFilters === 'function' ? newFilters(filters) : newFilters
    dispatch({ type: 'SET_FIELD', field: 'filters', payload: updatedFilters })
  }

  const resetSliders = () => {
    const resetRanges = Object.keys(maxValues).reduce((acc, key) => {
      const typedKey = key as keyof typeof maxValues
      acc[key.replace('Max', 'Range')] = [0, maxValues[typedKey] || 100]
      return acc
    }, {} as Record<string, Range>)
    dispatch({ type: 'SET_FIELD', field: 'scoreRanges', payload: resetRanges })
  }

  const getToggleValue = (key: string, toggleKey: keyof typeof priorityDataConfig): boolean => {
    const value = priorityDataConfig[toggleKey]
    if (key === 'census') return Boolean(value)
    if (typeof value !== 'boolean') return false
    if (key === toggleKey) return true
    if (key !== toggleKey && value) return false
    return value
  }
  const handlePriorityChange = (
    key: string,
    newScoreType: 'composite' | 'individual' | '' = '',
    subKey?: string,
  ) => {
    const isCensus = key === 'census'
    const updatedConfig = {
      ...priorityDataConfig,
      toggleCEJSTRange: getToggleValue(key, 'toggleCEJSTRange'),
      toggleEJScreenRange: getToggleValue(key, 'toggleEJScreenRange'),
      toggleCiRange: getToggleValue(key, 'toggleCiRange'),
      ...(newScoreType && { scoreType: newScoreType }),
    }
    if (isCensus && subKey) {
      updatedConfig.census = {
        ...priorityDataConfig.census,
        [subKey]: !priorityDataConfig.census?.[subKey],
      }
    } else if (subKey) {
      updatedConfig.subIndicators = {
        ...priorityDataConfig.subIndicators,
        [key]: {
          ...priorityDataConfig.subIndicators[key],
          [subKey]: !priorityDataConfig.subIndicators[key]?.[subKey],
        },
      }
    }
    dispatch({
      type: 'SET_FIELD',
      field: 'priorityDataConfig',
      payload: updatedConfig,
    })
  }
  useEffectSetTransitStopsLayerData()
  useEffectSetParksAndRecreationLayerData()
  useEffectSetHealthcareFacilitiesLayerData()
  useEffectSetLihtcLayerData()
  useEffectSetLibraryLayerData()
  useEffectSetSchoolLayerData()
  useEffectCenterMap()

  useEffectTransitStops()
  useEffectParksAndRecreation()
  useEffectHealthCareFacilities()
  useEffectLihtc()
  useEffectLibrary()
  useEffectSchool()
  useEffectWelcomeModal(dispatch)

  const top = AppConfig.ui.topBarHeight
  let height: number | string = '100%'
  if (viewportHeight) {
    height = viewportHeight - AppConfig.ui.topBarHeight
  }
  const width = viewportWidth ?? '100%'

  const mapHtml = (
    <div>
      <div className="map-controls">
        <button
          onClick={() => {
            dispatch({ type: 'SET_FIELD', field: 'isConfigPanelOpen', payload: !isConfigPanelOpen })
          }}
        >
          <img
            src="https://ev-charging-mapviewer-assets.s3.amazonaws.com/settings.png"
            className="settings-icon"
          />
        </button>

        {isConfigPanelOpen && (
          <ConfigurationPanel
            priorityDataConfig={priorityDataConfig}
            handlePriorityChange={handlePriorityChange}
            closePanel={() => dispatch({ type: 'SET_FIELD', field: 'isConfigPanelOpen', payload: false })}
          />
        )}
        <ControlPanel
          map={map}
          L={L}
          simplifiedCityBoundary={cachedRef.current.simplifiedCityBoundary}
          priorityUrl={cityConfig.priorityDataUrl}
          feasibleUrl={cityConfig.feasibleDataUrl}
          priorityDataConfig={priorityDataConfig}
          feasibleDataConfig={feasibleDataConfig}
          utility={utility}
          jurisdiction={formattedCity}
          dispatch={dispatch}
          scoreRanges={scoreRanges}
          filters={filters}
          updateRange={updateRange}
          setFilters={setFilters}
          resetSliders={resetSliders}
        />
        <label>
          <b>Co-location Points</b>
        </label>
        <div className="checkbox-group">
          <div className="checkbox-column" style={{ width: '340px' }}>
            <ColocationPoint
              mainText="Low-income housing"
              hoverText="Select to show residential multifamily buildings eligible for the federal Low-Income Housing Tax Credit."
              accordionText="The federal Low-Income Housing Tax Credit is available for residential property owners who set aside a minimum percentage of rental units for tenants at different levels of below-average area income. It is used as an indicator of buildings whose lower-income tenants are most likely to need access to public charging."
              value={showLihtc}
              setValue={(data: boolean) => dispatch({ type: 'SET_FIELD', field: 'showLihtc', payload: data })}
              image="https://ev-map-2.s3.amazonaws.com/icons/home.png"
              imgAlt="home icon"
            />
            <ColocationPoint
              mainText="Transit stops"
              hoverText="Select to show commuter rail stations. California rail systems included: ACE, BART, Caltrain, Capitol Corridor, Coaster, LA Metro, Metrolink, SMART."
              accordionText="Commuter rail stations are potential high-value locations for publicly accessible charging, at station parking lots or surrounding street parking where commuters leave their vehicles before transfering to the train for the second part of a commute. Local bus and trolley networks are not shown."
              value={showTransitStops}
              setValue={(data: boolean) =>
                dispatch({ type: 'SET_FIELD', field: 'showTransitStops', payload: data })
              }
              image="https://ev-map-2.s3.amazonaws.com/icons/vehicles.png"
              imgAlt="vehicles icon"
            />
            <ColocationPoint
              mainText="Public libraries"
              hoverText="Select to show public library locations."
              accordionText="Public libraries can serve as charging hubs due to their public ownership, community uses, typical length of visit, access by employees and the public, and (often) availability of parking."
              value={showLibrary}
              setValue={(data: boolean) =>
                dispatch({ type: 'SET_FIELD', field: 'showLibrary', payload: data })
              }
              image="https://ev-map-2.s3.amazonaws.com/icons/library.png"
              imgAlt="library icon"
            />
            <ColocationPoint
              mainText="Public schools"
              hoverText="Select to show public school locations."
              accordionText="Public schools can serve as charging hubs due to their public ownership, community uses, typical length of visit, access by employees and the public, and (often) availability of parking."
              value={showSchool}
              setValue={(data: boolean) =>
                dispatch({ type: 'SET_FIELD', field: 'showSchool', payload: data })
              }
              image="https://ev-map-2.s3.amazonaws.com/icons/school-bag.png"
              imgAlt="school-bag icon"
            />
            <ColocationPoint
              mainText="City/county parks"
              hoverText="Select to show city and county park locations."
              accordionText="City and county parks can serve as charging hubs due to their public ownership, community uses, typical length of visit, and (often) availability of parking. Regional, state, and national parks are not shown."
              value={showParksAndRecreation}
              setValue={(data: boolean) =>
                dispatch({ type: 'SET_FIELD', field: 'showParksAndRecreation', payload: data })
              }
              image="https://ev-map-2.s3.amazonaws.com/icons/bench.png"
              imgAlt="bench icon"
            />
            <ColocationPoint
              mainText="Hospitals"
              hoverText="Select to show hospitals."
              accordionText="Hospitals can serve as charging hubs due to their community uses, typical length of visit, access by employees and the public, and availability of parking."
              value={showHealthcareFacilities}
              setValue={(data: boolean) =>
                dispatch({ type: 'SET_FIELD', field: 'showHealthcareFacilities', payload: data })
              }
              image="https://ev-map-2.s3.amazonaws.com/icons/first-aid-kit.png"
              imgAlt="first aid icon"
            />
          </div>
        </div>
      </div>
      <div className="h-full w-full absolute overflow-hidden" ref={viewportRef}>
        <MapNavBar setCurrentView={setCurrentView} />
        {coordinatesTB && (
          <div
            className="snapshot-popup coordinates-TB"
            style={{
              left: `${menuPosition.x - 80}px`,
              top: `${menuPosition.y + 40}px`,
            }}
          >
            <p>Pin coordinates: </p>
            <p>
              <b>Latitude:</b> {clickedLatLng?.lat.toFixed(4)}
            </p>
            <p>
              <b>Longitude:</b> {clickedLatLng?.lng.toFixed(4)}
            </p>
          </div>
        )}
        <PolygonClickMenu
          polygonClickMenuVisible={polygonClickMenuVisible}
          dispatch={dispatch}
          //  clickedLatLng={clickedLatLng}
          menuPosition={menuPosition}
          priorityPolygonData={priorityPolygonData}
          feasiblePolygonData={feasiblePolygonData}
        />
        <ContextMenu
          contextMenuVisible={contextMenuVisible}
          dispatch={dispatch}
          city={cityConfig.city}
          // setContextMenuVisible={setContextMenuVisible}
          clickedLatLng={clickedLatLng}
          menuPosition={menuPosition}
          takeScreenshot={takeScreenshot}
        />
        <AddressSearch
          map={map}
          onLocationSelect={(lat, lng, address) => {
            dispatch({ type: 'SET_FIELD', field: 'clickedLatLng', payload: { lat, lng } })
            console.log(`Navigated to: ${address} (${lat}, ${lng})`)
          }}
        />
        <div
          className={`absolute w-full left-0 transition-opacity ${isLoading ? 'opacity-0' : 'opacity-1 '}`}
          onContextMenu={handleRightClick}
          onClick={handleClick}
          style={{
            top,
            width,
            height,
          }}
        >
          <LeafletMapContainer
            center={allMarkersBoundCenter?.centerPos || [34.0522, -118.2437]} // Default center
            zoom={allMarkersBoundCenter?.minZoom || 10} // Default zoom
            maxZoom={AppConfig.maxZoom}
            minZoom={AppConfig.minZoom}
          >
            <>
              {clickedLatLng && (
                <MapMarker position={[clickedLatLng.lat, clickedLatLng.lng]} icon={pinIcon} />
              )}
            </>
          </LeafletMapContainer>
        </div>
      </div>
    </div>
  )
  return (
    <>
      <WelcomeModal
        openModal={openWelcomeModal}
        dispatch={dispatch}
        city={cityConfig.city}
        county={cityConfig.county}
        setCurrentView={setCurrentView}
      />
      {mapHtml}
    </>
  )

  function useEffectFetchCityBoundary(): null {
    const [cityBoundaryGeoJSON, setCityBoundaryGeoJSON] = useState(null)
    const debounceDelay = 500
    useEffect(() => {
      const fetchBoundaryData = async () => {
        const boundaryData = await fetchCityBoundary()
        setCityBoundaryGeoJSON(boundaryData)
      }
      const handler = setTimeout(() => {
        fetchBoundaryData()
      }, debounceDelay)
      return () => clearTimeout(handler)
    }, [cityConfig?.boundaryUrl])
    return cityBoundaryGeoJSON
  }

  async function fetchCityBoundary(): Promise<any> {
    try {
      const cityBoundaryResponse = await fetch(cityConfig.boundaryUrl)
      if (!cityBoundaryResponse.ok) {
        throw new Error(`Error fetching city boundary: ${cityBoundaryResponse.statusText}`)
      }
      return await cityBoundaryResponse.json()
    } catch (error) {
      console.error('Could not fetch city boundary:', error)
      return null
    }
  }
  /**
   * Fetches GeoJSON data from a URL and filters it to only include features within the city boundary.
   *
   * This function performs spatial filtering on point and polygon features:
   * - Point features are checked if they fall within the city boundary
   * - Polygon/MultiPolygon features are checked if they intersect with the boundary
   *
   * The city boundary is cached to avoid reprocessing on subsequent calls.
   *
   * @param url - The URL to fetch GeoJSON data from
   * @param cityBoundaryGeoJSON - The city boundary polygon(s) to filter against
   * @param setLayerData - Callback to update the layer data state
   * @param _setShowLayer - Callback to update layer visibility (unused but kept for interface consistency)
   * @param tolerance - Simplification tolerance for polygon processing (currently unused)
   */
  async function fetchAndFilterLayerData({
    url,
    cityBoundaryGeoJSON,
    setLayerData,
    _setShowLayer,
    tolerance,
  }: {
    url: RequestInfo | URL
    cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
    _setShowLayer: (show: boolean) => void
    setLayerData: (data: GeoJSONData | null) => void
    tolerance: number
  }): Promise<void> {
    try {
      const response = await fetch(url)
      let dataJson = await response.json()

      if (
        !cachedRef.current.cityBoundaryGeoJSON ||
        !isEqual(cachedRef.current.cityBoundaryGeoJSON, cityBoundaryGeoJSON)
      ) {
        if (cityBoundaryGeoJSON && cityBoundaryGeoJSON.features.length > 0) {
          cachedRef.current.cityBoundaryGeoJSON = cityBoundaryGeoJSON
          cachedRef.current.simplifiedCityBoundary = cityBoundaryGeoJSON
        } else {
          cachedRef.current.cityBoundaryGeoJSON = null
          cachedRef.current.simplifiedCityBoundary = null
        }
      }

      const boundary = cachedRef.current.simplifiedCityBoundary
      if (!boundary || !boundary.features.length) {
        return
      }
      const boundaryFeature = boundary!.features[0] as turf.helpers.Feature<
        turf.helpers.Polygon | turf.helpers.MultiPolygon
      >

      if (boundaryFeature) {
        dataJson = {
          ...dataJson,
          features: dataJson.features.filter((feature: { geometry: GeoJSON.Geometry }) => {
            if (feature.geometry.type === 'Point') {
              return turf.booleanPointInPolygon(feature.geometry as turf.helpers.Point, boundaryFeature)
            }
            if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
              return booleanIntersects(
                boundaryFeature,
                feature.geometry as turf.helpers.Polygon | turf.helpers.MultiPolygon,
              )
            }
            return false
          }),
        }
      }

      setLayerData(dataJson)
    } catch (error) {
      console.error('Error fetching GeoJSON data:', error)
      setLayerData(null)
    }
  }

  function useEffectCenterMap(): void {
    useEffect(() => {
      if (!map || !L || !cityBoundaryGeoJSON || !cityConfig) return
      const jsonGroup = L.geoJSON(cityBoundaryGeoJSON)
      map.fitBounds(jsonGroup.getBounds())
    }, [cityBoundaryGeoJSON])
  }

  function useEffectSetParksAndRecreationLayerData() {
    useEffect(() => {
      if (cityConfig.parksAndRecreationUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.parksAndRecreationUrl,
          cityBoundaryGeoJSON,
          _setShowLayer: (show: boolean) =>
            dispatch({ type: 'SET_FIELD', field: 'showParksAndRecreation', payload: show }),
          setLayerData: (data: GeoJSONData | null) =>
            dispatch({ type: 'SET_FIELD', field: 'parksAndRecreationData', payload: data }),
          tolerance: 0.05,
        })
      }
    }, [cityConfig.parksAndRecreationUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetHealthcareFacilitiesLayerData() {
    useEffect(() => {
      if (cityConfig.healthcareFacilitiesUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.healthcareFacilitiesUrl,
          cityBoundaryGeoJSON,
          _setShowLayer: (show: boolean) =>
            dispatch({ type: 'SET_FIELD', field: 'showHealthcareFacilities', payload: show }),
          setLayerData: (data: GeoJSONData | null) =>
            dispatch({ type: 'SET_FIELD', field: 'healthcareFacilitiesData', payload: data }),
          tolerance: 0.00001,
        })
      }
    }, [cityConfig.healthcareFacilitiesUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetTransitStopsLayerData() {
    useEffect(() => {
      if (cityConfig.transitStopsUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.transitStopsUrl,
          cityBoundaryGeoJSON,
          _setShowLayer: (show: boolean) =>
            dispatch({ type: 'SET_FIELD', field: 'showTransitStops', payload: show }),
          setLayerData: (data: GeoJSONData | null) =>
            dispatch({ type: 'SET_FIELD', field: 'transitStopsData', payload: data }),
          tolerance: 0.0001,
        })
      }
    }, [cityConfig.transitStopsUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetLihtcLayerData() {
    useEffect(() => {
      if (cityConfig.lihtcUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.lihtcUrl,
          cityBoundaryGeoJSON,
          _setShowLayer: (show: boolean) =>
            dispatch({ type: 'SET_FIELD', field: 'showLihtc', payload: show }),
          setLayerData: (data: GeoJSONData | null) =>
            dispatch({ type: 'SET_FIELD', field: 'lihtcData', payload: data }),
          tolerance: 0,
        })
      }
    }, [cityConfig.lihtcUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetLibraryLayerData() {
    useEffect(() => {
      if (cityConfig.libraryUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.libraryUrl,
          cityBoundaryGeoJSON,
          _setShowLayer: (show: boolean) =>
            dispatch({ type: 'SET_FIELD', field: 'showLibrary', payload: show }),
          setLayerData: (data: GeoJSONData | null) =>
            dispatch({ type: 'SET_FIELD', field: 'libraryData', payload: data }),
          tolerance: 0.05,
        })
      }
    }, [cityConfig.libraryUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetSchoolLayerData() {
    useEffect(() => {
      if (cityConfig.schoolsUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.schoolsUrl,
          cityBoundaryGeoJSON,
          _setShowLayer: (show: boolean) =>
            dispatch({ type: 'SET_FIELD', field: 'showSchool', payload: show }),
          setLayerData: (data: GeoJSONData | null) =>
            dispatch({ type: 'SET_FIELD', field: 'schoolsData', payload: data }),
          tolerance: 0.00001,
        })
      }
    }, [cityConfig.schoolsUrl, cityBoundaryGeoJSON])
  }

  function useEffectTransitStops(): void {
    useLayerGroupEffect({
      map,
      data: transitStopsData,
      showLayer: showTransitStops,
      layerGroupName: 'transitStopsLayerGroup',
      iconUrl: 'https://ev-map-2.s3.amazonaws.com/icons/vehicles.png',
      L,
    })
  }

  function useEffectParksAndRecreation(): void {
    useLayerGroupEffect({
      map,
      data: parksAndRecreationData,
      showLayer: showParksAndRecreation,
      layerGroupName: 'parksAndRecreationLayerGroup',
      iconUrl: 'https://ev-map-2.s3.amazonaws.com/icons/bench.png',
      L,
    })
  }

  function useEffectHealthCareFacilities(): void {
    useLayerGroupEffect({
      map,
      data: healthcareFacilitiesData,
      showLayer: showHealthcareFacilities,
      layerGroupName: 'healthcareFacilitiesLayerGroup',
      iconUrl: 'https://ev-map-2.s3.amazonaws.com/icons/first-aid-kit.png',
      L,
    })
  }

  function useEffectLihtc(): void {
    useLayerGroupEffect({
      map,
      data: lihtcData,
      showLayer: showLihtc,
      layerGroupName: 'lihtcLayerGroup',
      iconUrl: 'https://ev-map-2.s3.amazonaws.com/icons/home.png',
      L,
    })
  }

  function useEffectLibrary(): void {
    useLayerGroupEffect({
      map,
      data: libraryData,
      showLayer: showLibrary,
      layerGroupName: 'libraryLayerGroup',
      iconUrl: 'https://ev-map-2.s3.amazonaws.com/icons/library.png',
      L,
    })
  }

  function useEffectSchool(): void {
    useLayerGroupEffect({
      map,
      data: schoolsData,
      showLayer: showSchool,
      layerGroupName: 'schoolLayerGroup',
      iconUrl: 'https://ev-map-2.s3.amazonaws.com/icons/school-bag.png',
      L,
    })
  }
}

/**
 * Custom hook effect to manage map layers for co-location points (libraries, schools, parks, etc.).
 *
 * This function handles the lifecycle of a Leaflet layer group:
 * - Creates a new layer group and adds it to the map when showLayer is true
 * - Updates the layer with GeoJSON data and custom icons
 * - Removes and cleans up the layer when showLayer is false
 *
 * The layer group is stored on the map object itself for persistence across renders.
 *
 * @param map - The Leaflet map instance
 * @param data - GeoJSON data to display on the layer
 * @param showLayer - Whether the layer should be visible
 * @param layerGroupName - Unique name for the layer group (stored on map object)
 * @param iconUrl - URL to the icon image for point markers
 * @param L - Leaflet library instance
 */
function useLayerGroupEffect({
  map,
  data,
  showLayer,
  layerGroupName,
  iconUrl,
  L,
}: UseLayerGroupEffectParams): void {
  useEffect(() => {
    if (!map || !data) {
      return
    }

    let layerGroup = (map as any)[layerGroupName] as L.LayerGroup | undefined
    if (showLayer) {
      const icon = L.icon({
        iconUrl,
        iconSize: [20, 20],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
      })

      if (!layerGroup) {
        layerGroup = new L.LayerGroup().addTo(map)
        ;(map as any)[layerGroupName] = layerGroup
      } else {
        layerGroup.clearLayers()
      }

      const layer = L.geoJSON(data, {
        style: { color: '#72DD5A', weight: 1, opacity: 1 },
        pointToLayer(_feature: GeoJSON.Feature, latlng: L.LatLng) {
          return L.marker(latlng, { icon })
        },
      })

      layerGroup?.addLayer(layer)
    } else if (layerGroup) {
      layerGroup.clearLayers()
      map.removeLayer(layerGroup)
      ;(map as any)[layerGroupName] = undefined
    }
  }, [showLayer, data, map, layerGroupName, iconUrl])
}

function useEffectWelcomeModal(dispatch: Dispatch<MapAction>): void {
  useEffect(() => {
    const viewedWelcomeModal = sessionStorage.getItem('viewedWelcomeModal')
    if (!viewedWelcomeModal) {
      dispatch({ type: 'SET_FIELD', field: 'openWelcomeModal', payload: true })
      sessionStorage.setItem('viewedWelcomeModal', 'true')
    }
    const handleUnload = () => {
      sessionStorage.removeItem('viewedWelcomeModal')
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])
}

/**
 * Preprocesses jurisdiction data to create a city-to-utility-provider lookup table.
 *
 * Iterates through all counties and their cities to build a flat map where
 * each city name is mapped to its utility provider. Defaults to 'PG&E' if
 * no provider is specified.
 *
 * @param counties - Array of county objects, each containing a cities array
 * @returns A lookup object mapping city names to utility provider names
 *
 * @example
 * const lookup = preprocessJurisdictions(countiesData);
 * // Returns: { "San Francisco": "PG&E", "Los Angeles": "LADWP", ... }
 */
const preprocessJurisdictions = (counties: Record<string, any>): Record<string, string> => {
  const lookup: Record<string, string> = {}

  counties.forEach((county: Record<string, any>) => {
    county.cities.forEach((city: Record<string, any>) => {
      lookup[city.name] = city.provider || 'PG&E'
    })
  })

  return lookup
}

/**
 * Retrieves the utility provider for a given jurisdiction.
 *
 * @param lookup - The preprocessed jurisdiction lookup table
 * @param jurisdictionName - The name of the city/jurisdiction
 * @returns The utility provider name, defaulting to 'PG&E' if not found
 */
const getUtilityProvider = (lookup: Record<string, any>, jurisdictionName: string): string =>
  lookup[jurisdictionName] || 'PG&E'

export default Map
