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
import { DataControls } from '@map/DataControls'
import {
  CenterToMarkerButton,
  CustomMarker,
  GeoJSONData,
  LeafletCluster,
  LeafletMapContainer,
  LocateButton,
  MapMarker,
} from '@map/GeoJSONData'
import WelcomeModal from '@map/WelcomeModal'
// import { Action, initialState, reducer, useLayerGroupEffect } from '@map/leafletUtils'
// import MapMarker from '@map/ui/MapMarker'
import useLeaflet from '@map/useLeaflet'
import useLeafletWindow from '@map/useLeafletWindow'
import useMapContext from '@map/useMapContext'
import useMarkerData from '@map/useMarkerData'
// import MarkerCategories, { Category } from '@lib/MarkerCategories'
import counties from '@public/jurisdictions.json'
import { Feature, FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson'
import React, { Dispatch, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import 'react-toggle/style.css'

import ColocationPoint from '@components/Map/ColocationPoint'
import MapNavBar from '@components/MapNavBar'

import { AppConfig } from '@lib/AppConfig'
import MapProps from '@lib/MapProps'
import NavBarProps from '@lib/NavBarProps'
import { Places } from '@lib/Places'

export type Range = [number, number]
type LatLngType = { lat: number; lng: number } | null

interface UseLayerGroupEffectParams {
  map: any
  data: GeoJSONData | null
  showLayer: boolean
  layerGroupName: string
  iconUrl: string
  // L: typeof Leaf | null
  L: any
}

interface MapState {
  priorityData: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
  feasibleData: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
  showTransitStops: boolean
  transitStopsData: GeoJSONData | null
  showLihtc: boolean
  lihtcData: GeoJSONData | null
  showLibrary: boolean
  LibraryData: GeoJSONData | null
  showSchool: boolean
  schoolsData: GeoJSONData | null
  showParksAndRecreation: boolean
  parksAndRecreationData: GeoJSONData | null
  showHealthcareFacilities: boolean
  healthcareFacilitiesData: GeoJSONData | null
  openWelcomeModal: boolean
  isConfigPanelOpen: boolean
  coordinatesTB: boolean
  priorityDataConfig: DataConfig
  feasibleDataConfig: DataConfig
  contextMenuVisible: boolean
  menuPosition: { x: number; y: number }
  // clickedLatLng: L.LatLng | null
  clickedLatLng: LatLngType | null
}

export type DataConfig = {
  togglePopRange: boolean
  toggleCiRange: boolean
  toggleLevRange: boolean
  toggleMultiFaRange: boolean
  toggleRentersRange: boolean
  toggleWalkableRange: boolean
  toggleDrivableRange: boolean
  toggleCommercialRange: boolean
  toggleResidentialRange: boolean
  toggleNeviFilterActive: boolean
  toggleirs30cFilterActive: boolean
  togglePgeFilterActive: boolean
}

interface MapComponentProps extends NavBarProps {
  map: any
  cityConfig: any
}
export type Action =
  | {
      type: 'SET_PRIORITY_DATA'
      payload: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
    }
  | {
      type: 'SET_FEASIBLE_DATA'
      payload: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
    }
  | { type: 'SET_SHOW_TRANSIT_STOPS'; payload: boolean }
  | { type: 'SET_TRANSIT_STOPS_DATA'; payload: GeoJSONData | null }
  | { type: 'SET_SHOW_LIHTC'; payload: boolean }
  | { type: 'SET_LIHTC_DATA'; payload: GeoJSONData | null }
  | { type: 'SET_SHOW_LIBRARY'; payload: boolean }
  | { type: 'SET_LIBRARY_DATA'; payload: GeoJSONData | null }
  | { type: 'SET_SHOW_SCHOOL'; payload: boolean }
  | { type: 'SET_SCHOOL_DATA'; payload: GeoJSONData | null }
  | { type: 'SET_SHOW_PARKS_AND_RECREATION'; payload: boolean }
  | { type: 'SET_PARKS_AND_RECREATION_DATA'; payload: GeoJSONData | null }
  | { type: 'SET_SHOW_HEALTHCARE_FACILITIES'; payload: boolean }
  | { type: 'SET_HEALTHCARE_FACILITIES_DATA'; payload: GeoJSONData | null }
  | { type: 'SET_OPEN_WELCOME_MODAL'; payload: boolean }
  | { type: 'SET_IS_CONFIG_PANEL_OPEN'; payload: boolean }
  | { type: 'SET_COORDINATES_TB'; payload: boolean }
  | { type: 'SET_PRIORITY_DATA_CONFIG'; payload: DataConfig }
  | { type: 'SET_FEASIBLE_DATA_CONFIG'; payload: DataConfig }
  | { type: 'SET_CONTEXT_MENU_VISIBLE'; payload: boolean }
  | { type: 'SET_MENU_POSITION'; payload: { x: number; y: number } }
  // | { type: 'SET_CLICKED_LAT_LNG'; payload: L.LatLng | null }
  | { type: 'SET_CLICKED_LAT_LNG'; payload: LatLngType | null }

function reducer(state: MapState, action: Action): MapState {
  switch (action.type) {
    case 'SET_PRIORITY_DATA':
      return { ...state, priorityData: action.payload }
    case 'SET_FEASIBLE_DATA':
      return { ...state, feasibleData: action.payload }
    case 'SET_SHOW_TRANSIT_STOPS':
      return { ...state, showTransitStops: action.payload }
    case 'SET_TRANSIT_STOPS_DATA':
      return { ...state, transitStopsData: action.payload }
    case 'SET_SHOW_LIHTC':
      return { ...state, showLihtc: action.payload }
    case 'SET_LIHTC_DATA':
      return { ...state, lihtcData: action.payload }
    case 'SET_SHOW_LIBRARY':
      return { ...state, showLibrary: action.payload }
    case 'SET_LIBRARY_DATA':
      return { ...state, LibraryData: action.payload }
    case 'SET_SHOW_SCHOOL':
      return { ...state, showSchool: action.payload }
    case 'SET_SCHOOL_DATA':
      return { ...state, schoolsData: action.payload }
    case 'SET_SHOW_PARKS_AND_RECREATION':
      return { ...state, showParksAndRecreation: action.payload }
    case 'SET_PARKS_AND_RECREATION_DATA':
      return { ...state, parksAndRecreationData: action.payload }
    case 'SET_SHOW_HEALTHCARE_FACILITIES':
      return { ...state, showHealthcareFacilities: action.payload }
    case 'SET_HEALTHCARE_FACILITIES_DATA':
      return { ...state, healthcareFacilitiesData: action.payload }
    case 'SET_OPEN_WELCOME_MODAL':
      return { ...state, openWelcomeModal: action.payload }
    case 'SET_IS_CONFIG_PANEL_OPEN':
      return { ...state, isConfigPanelOpen: action.payload }
    case 'SET_COORDINATES_TB':
      return { ...state, coordinatesTB: action.payload }
    case 'SET_PRIORITY_DATA_CONFIG':
      return { ...state, priorityDataConfig: action.payload }
    case 'SET_FEASIBLE_DATA_CONFIG':
      return { ...state, feasibleDataConfig: action.payload }
    case 'SET_CONTEXT_MENU_VISIBLE':
      return { ...state, contextMenuVisible: action.payload }
    case 'SET_MENU_POSITION':
      return { ...state, menuPosition: action.payload }
    case 'SET_CLICKED_LAT_LNG':
      return { ...state, clickedLatLng: action.payload }
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
  LibraryData: null,
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
    togglePopRange: true,
    toggleCiRange: true,
    toggleLevRange: true,
    toggleMultiFaRange: true,
    toggleRentersRange: true,
    toggleWalkableRange: true,
    toggleDrivableRange: true,
    toggleCommercialRange: false,
    toggleResidentialRange: false,
    toggleNeviFilterActive: false,
    toggleirs30cFilterActive: false,
    togglePgeFilterActive: false,
  },
  feasibleDataConfig: {
    togglePopRange: false,
    toggleCiRange: false,
    toggleLevRange: false,
    toggleMultiFaRange: false,
    toggleRentersRange: false,
    toggleWalkableRange: false,
    toggleDrivableRange: false,
    toggleCommercialRange: false,
    toggleResidentialRange: false,
    toggleNeviFilterActive: true,
    toggleirs30cFilterActive: true,
    togglePgeFilterActive: true,
  },
  contextMenuVisible: false,
  menuPosition: { x: 0, y: 0 },
  clickedLatLng: null,
  priorityData: null,
  feasibleData: null,
}

// const Map: React.FC<MapComponentProps> = ({ setCurrentView, map, cityConfig }) => {
const Map: React.FC<NavBarProps> = ({ setCurrentView }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    showTransitStops,
    transitStopsData,
    showLihtc,
    lihtcData,
    showLibrary,
    LibraryData,
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
    contextMenuVisible,
    menuPosition,
    clickedLatLng,
  } = state
  const { map, cityConfig = {} as MapProps } = useMapContext()
  const L = useLeaflet()
  // const [lihtcData, setLihtcData] = useState<FeatureCollection<
  //   Polygon | MultiPolygon,
  //   GeoJsonProperties
  // > | null>(null) // Added LIHTC data state
  const leafletWindow = useLeafletWindow()
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
    // const pinIcon = divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="font-size: 24px; color: #3388ff;">
             <i class="map pin icon"></i>
           </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  })
  const { clustersByCategory, allMarkersBoundCenter } = useMarkerData({
    locations: Places,
    map,
    viewportWidth,
    viewportHeight,
  })

  const isLoading = !map || !leafletWindow || !viewportWidth || !viewportHeight
  const takeScreenshot = async () => {
    try {
      const displayMediaOptions = {
        video: {
          displaySurface: 'browser',
        } as MediaTrackConstraints,
        preferCurrentTab: true,
      }
      dispatch({ type: 'SET_COORDINATES_TB', payload: true })
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
      const video = document.createElement('video')
      video.srcObject = stream
      await video.play()
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Failed to get 2D rendering context')
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      stream.getTracks().forEach(track => track.stop())
      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      const filename = `Lat${clickedLatLng?.lat.toFixed(4)}_Lng${clickedLatLng?.lng.toFixed(4)}.png`
      link.download = filename
      // link.download = 'evmap-screenshot.png'
      link.click()
    } catch (err) {
      console.error(err)
    }
    dispatch({ type: 'SET_COORDINATES_TB', payload: false })
  }

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault()
    if (map && L) {
      const latLng = map.mouseEventToLatLng(event.nativeEvent as MouseEvent)
      dispatch({ type: 'SET_CLICKED_LAT_LNG', payload: latLng })
    }
    dispatch({
      type: 'SET_MENU_POSITION',
      payload: {
        x: event.clientX,
        y: event.clientY,
      },
    })
    dispatch({ type: 'SET_CONTEXT_MENU_VISIBLE', payload: true })
  }
  // const isMenuPositionSet = state.menuPosition.x !== 0 || state.menuPosition.y !== 0

  const handleClick = () => {
    dispatch({ type: 'SET_CONTEXT_MENU_VISIBLE', payload: false })
  }

  const cityBoundaryGeoJSON = useEffectFetchCityBoundary()

  interface CachedType {
    cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
    simplifiedCityBoundary: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null
  }

  const cached: CachedType = {
    cityBoundaryGeoJSON,
    simplifiedCityBoundary: null,
  }
  const ref = useRef<HTMLDivElement>(null)
  let capCity = ''
  if (cityConfig?.city) {
    capCity = cityConfig.city.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
  }
  const utility = getUtilityProvider(jurisdictionLookup, capCity)

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
  // useEffect(() => {
  //   if (!L) return
  // }, [L])
  // useEffectCenterMap()

  const mapHtml = (
    <div>
      <div className="map-controls">
        <button
          onClick={() => {
            dispatch({ type: 'SET_IS_CONFIG_PANEL_OPEN', payload: !isConfigPanelOpen })
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
            feasibleDataConfig={feasibleDataConfig}
            dispatch={dispatch}
            closePanel={() => dispatch({ type: 'SET_IS_CONFIG_PANEL_OPEN', payload: false })}
          />
        )}
        <DataControls
          dataControlsTitle="Priority Pixels"
          map={map}
          L={L}
          cityBoundaryGeoJSON={cityBoundaryGeoJSON}
          color="#3388ff"
          geojsonUrl={cityConfig.priorityDataUrl}
          onDataUpdate={(data: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null) =>
            dispatch({ type: 'SET_PRIORITY_DATA', payload: data })
          }
          config={priorityDataConfig}
        />
        <DataControls
          dataControlsTitle="Feasibility Pixels"
          jurisdiction={capCity}
          utility={utility}
          map={map}
          L={L}
          cityBoundaryGeoJSON={cityBoundaryGeoJSON}
          color="#ffa500"
          geojsonUrl={cityConfig.feasibleDataUrl}
          onDataUpdate={(data: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null) =>
            dispatch({ type: 'SET_FEASIBLE_DATA', payload: data })
          }
          config={feasibleDataConfig}
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
              setValue={(data: boolean) => dispatch({ type: 'SET_SHOW_LIHTC', payload: data })}
              image="https://ev-map.s3.amazonaws.com/icons/home.png"
              imgAlt="home icon"
            />
            <ColocationPoint
              mainText="Transit stops"
              hoverText="Select to show commuter rail stations. California rail systems included: ACE, BART, Caltrain, Capitol Corridor, Coaster, LA Metro, Metrolink, SMART."
              accordionText="Commuter rail stations are potential high-value locations for publicly accessible charging, at station parking lots or surrounding street parking where commuters leave their vehicles before transfering to the train for the second part of a commute. Local bus and trolley networks are not shown."
              value={showTransitStops}
              setValue={(data: boolean) => dispatch({ type: 'SET_SHOW_TRANSIT_STOPS', payload: data })}
              image="https://ev-map.s3.amazonaws.com/icons/vehicles.png"
              imgAlt="vehicles icon"
            />
            <ColocationPoint
              mainText="Public libraries"
              hoverText="Select to show public library locations."
              accordionText="Public libraries can serve as charging hubs due to their public ownership, community uses, typical length of visit, access by employees and the public, and (often) availability of parking."
              value={showLibrary}
              setValue={(data: boolean) => dispatch({ type: 'SET_SHOW_LIBRARY', payload: data })}
              image="https://ev-map.s3.amazonaws.com/icons/library.png"
              imgAlt="library icon"
            />
            <ColocationPoint
              mainText="Public schools"
              hoverText="Select to show public school locations."
              accordionText="Public schools can serve as charging hubs due to their public ownership, community uses, typical length of visit, access by employees and the public, and (often) availability of parking."
              value={showSchool}
              setValue={(data: boolean) => dispatch({ type: 'SET_SHOW_SCHOOL', payload: data })}
              image="https://ev-map.s3.amazonaws.com/icons/school-bag.png"
              imgAlt="school-bag icon"
            />
            <ColocationPoint
              mainText="City/county parks"
              hoverText="Select to show city and county park locations."
              accordionText="City and county parks can serve as charging hubs due to their public ownership, community uses, typical length of visit, and (often) availability of parking. Regional, state, and national parks are not shown."
              value={showParksAndRecreation}
              setValue={(data: boolean) => dispatch({ type: 'SET_SHOW_PARKS_AND_RECREATION', payload: data })}
              image="https://ev-map.s3.amazonaws.com/icons/bench.png"
              imgAlt="bench icon"
            />
            <ColocationPoint
              mainText="Hospitals"
              hoverText="Select to show hospitals."
              accordionText="Hospitals can serve as charging hubs due to their community uses, typical length of visit, access by employees and the public, and availability of parking."
              value={showHealthcareFacilities}
              setValue={(data: boolean) =>
                dispatch({ type: 'SET_SHOW_HEALTHCARE_FACILITIES', payload: data })
              }
              image="https://ev-map.s3.amazonaws.com/icons/first-aid-kit.png"
              imgAlt="first aid icon"
            />
          </div>
        </div>
        {/* <label>
        <input
          type="checkbox"
          checked={showIntersection}
          onChange={() => setShowIntersection(!showIntersection)}
        />
        Show Computed Intersection
      </label>

      {showIntersection && map && priorityData && feasibleData && (
        <LayerIntersection
          map={map}
          priorityData={priorityData}
          feasibleData={feasibleData}
          onIntersectionChange={setIntersectionData}
          showIntersection={true}
        />
      )} */}
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
        <ContextMenu
          contextMenuVisible={contextMenuVisible}
          dispatch={dispatch}
          // setContextMenuVisible={setContextMenuVisible}
          clickedLatLng={clickedLatLng}
          menuPosition={menuPosition}
          takeScreenshot={takeScreenshot}
        />
        <div
          className={`absolute w-full left-0 transition-opacity ${isLoading ? 'opacity-0' : 'opacity-1 '}`}
          onContextMenu={handleRightClick}
          onClick={handleClick}
          style={{
            top: AppConfig.ui.topBarHeight,
            width: viewportWidth ?? '100%',
            height: viewportHeight ? viewportHeight - AppConfig.ui.topBarHeight : '100%',
          }}
        >
          {allMarkersBoundCenter && clustersByCategory && (
            <LeafletMapContainer
              center={allMarkersBoundCenter.centerPos}
              zoom={allMarkersBoundCenter.minZoom}
              maxZoom={AppConfig.maxZoom}
              minZoom={AppConfig.minZoom}
            >
              <>
                {clickedLatLng && (
                  <MapMarker position={[clickedLatLng.lat, clickedLatLng.lng]} icon={pinIcon} />
                )}
              </>
              {/* {!isLoading ? (
                <>
                  <CenterToMarkerButton
                    center={allMarkersBoundCenter.centerPos}
                    zoom={allMarkersBoundCenter.minZoom}
                  />
                  <LocateButton />
                  {Object.values(clustersByCategory).map(item => (
                    <LeafletCluster
                      key={item.category}
                      icon={MarkerCategories[item.category as Category].icon}
                      color={MarkerCategories[item.category as Category].color}
                      chunkedLoading
                    >
                      {item.markers.map(marker => (
                        <CustomMarker
                          icon={MarkerCategories[marker.category].icon}
                          color={MarkerCategories[marker.category].color}
                          key={(marker.position as number[]).join('')}
                          position={marker.position}
                        />
                      ))}
                    </LeafletCluster>
                  ))}
                </>
              ) : (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <></>
              )} */}
            </LeafletMapContainer>
          )}
        </div>
      </div>
    </div>
  )
  // console.log("map called~~")
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
    // console.log("useEffectFetchCityBoundary called~~", cityConfig)
    const debounceDelay = 500
    // useEffect(() => {
    //   const fetchBoundaryData = async () => {
    //     const boundaryData = await fetchCityBoundary()
    //     setCityBoundaryGeoJSON(boundaryData)
    //   }
    //   fetchBoundaryData()
    // }, [cityConfig])
    useEffect(() => {
      const fetchBoundaryData = async () => {
        const boundaryData = await fetchCityBoundary()
        setCityBoundaryGeoJSON(boundaryData)
      }
      const handler = setTimeout(() => {
        fetchBoundaryData()
      }, debounceDelay)
      return () => clearTimeout(handler)
    }, [cityConfig])
    return cityBoundaryGeoJSON
  }

  async function fetchCityBoundary(): Promise<any> {
    // console.log("fetchCityBoundary called~~")
    try {
      const cityBoundaryResponse = await fetch(cityConfig.boundaryUrl)
      if (!cityBoundaryResponse.ok) {
        throw new Error(`Error fetching city boundary: ${cityBoundaryResponse.statusText}`)
      }
      return await cityBoundaryResponse.json()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Could not fetch city boundary:', error)
      return null
    }
  }

  async function fetchAndFilterLayerData({
    url,
    cityBoundaryGeoJSON,
    setLayerData,
    tolerance = 0.00001,
  }: {
    url: RequestInfo | URL
    cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null
    _setShowLayer: (show: boolean) => void
    setLayerData: (data: GeoJSONData | null) => void
    tolerance: number
  }): Promise<void> {
    // console.log("fetchAndFilterLayerData called~~")
    try {
      const response = await fetch(url)
      let dataJson = await response.json()

      if (cached.simplifiedCityBoundary === null || cached.cityBoundaryGeoJSON !== cityBoundaryGeoJSON) {
        if (cityBoundaryGeoJSON && cityBoundaryGeoJSON.features.length > 0) {
          cached.simplifiedCityBoundary = turf.simplify(cityBoundaryGeoJSON.features[0], {
            tolerance,
            highQuality: false,
          })
          cached.cityBoundaryGeoJSON = cityBoundaryGeoJSON
        } else {
          cached.simplifiedCityBoundary = null
        }
      }
      if (cached.simplifiedCityBoundary && cached.simplifiedCityBoundary.geometry) {
        // dataJson = {
        //   ...dataJson,
        //   features: dataJson.features.filter((feature: { geometry: turf.Coord }) =>
        //     turf.booleanPointInPolygon(feature.geometry, cached.simplifiedCityBoundary!.geometry),
        //   ),
        // }
        dataJson = {
          ...dataJson,
          features: dataJson.features.filter((feature: { geometry: GeoJSON.Geometry }) => {
            if (feature.geometry.type === 'Point') {
              return turf.booleanPointInPolygon(feature.geometry, cached.simplifiedCityBoundary!.geometry)
            }
            if (feature.geometry.type === 'Polygon') {
              return turf.booleanContains(cached.simplifiedCityBoundary!.geometry, feature.geometry)
              //  turf.booleanOverlap(cityBoundary, feature.geometry)
            }
            return false
          }),
        }
      }
      setLayerData(dataJson)
    } catch (error) {
      console.error('Error fetching GeoJSON data:', error)
    }
  }

  function useEffectCenterMap(): void {
    // console.log("useEffectCenterMap called~~")
    useEffect(() => {
      if (!map || !L || !cityBoundaryGeoJSON || !cityConfig) return
      const jsonGroup = L.geoJSON(cityBoundaryGeoJSON)
      map.fitBounds(jsonGroup.getBounds())
      // }, [allMarkersBoundCenter, map, cityBoundaryGeoJSON])
    }, [cityBoundaryGeoJSON])
  }

  function useEffectSetParksAndRecreationLayerData() {
    // console.log("useEffectSetParksAndRecreation called~~")
    useEffect(() => {
      if (cityConfig.parksAndRecreationUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.parksAndRecreationUrl,
          cityBoundaryGeoJSON,
          // _setShowLayer: setShowParksAndRecreation,
          // setLayerData: setParksAndRecreationData,
          _setShowLayer: (show: boolean) =>
            dispatch({ type: 'SET_SHOW_PARKS_AND_RECREATION', payload: show }),
          setLayerData: (data: GeoJSONData | null) =>
            dispatch({ type: 'SET_PARKS_AND_RECREATION_DATA', payload: data }),
          tolerance: 0.05,
        })
      }
    }, [cityConfig.parksAndRecreationUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetHealthcareFacilitiesLayerData() {
    // console.log("useEffectSetHealthcare called~~")
    useEffect(() => {
      if (cityConfig.healthcareFacilitiesUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.healthcareFacilitiesUrl,
          cityBoundaryGeoJSON,
          // _setShowLayer: setShowHealthcareFacilities,
          // setLayerData: setHealthcareFacilitiesData,
          _setShowLayer: (show: boolean) =>
            dispatch({ type: 'SET_SHOW_HEALTHCARE_FACILITIES', payload: show }),
          setLayerData: (data: GeoJSONData | null) =>
            dispatch({ type: 'SET_HEALTHCARE_FACILITIES_DATA', payload: data }),
          tolerance: 0.00001,
        })
      }
    }, [cityConfig.healthcareFacilitiesUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetTransitStopsLayerData() {
    // console.log("useEffectTransitStops called~~")
    useEffect(() => {
      if (cityConfig.transitStopsUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.transitStopsUrl,
          cityBoundaryGeoJSON,
          _setShowLayer: (show: boolean) => dispatch({ type: 'SET_SHOW_TRANSIT_STOPS', payload: show }),
          setLayerData: (data: GeoJSONData | null) =>
            dispatch({ type: 'SET_TRANSIT_STOPS_DATA', payload: data }),
          // _setShowLayer: setShowTransitStops,
          // setLayerData: setTransitStopsData,
          tolerance: 0.0001,
        })
      }
    }, [cityConfig.transitStopsUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetLihtcLayerData() {
    // console.log("useEffectSetLihtc called~~")
    useEffect(() => {
      if (cityConfig.lihtcUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.lihtcUrl,
          cityBoundaryGeoJSON,
          // _setShowLayer: setShowLihtc,
          // setLayerData: setLihtcData,
          _setShowLayer: (show: boolean) => dispatch({ type: 'SET_SHOW_LIHTC', payload: show }),
          setLayerData: (data: GeoJSONData | null) => dispatch({ type: 'SET_LIHTC_DATA', payload: data }),
          tolerance: 0,
        })
      }
    }, [cityConfig.lihtcUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetLibraryLayerData() {
    // console.log("useEffectSetLibrary called~~")
    useEffect(() => {
      if (cityConfig.libraryUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.libraryUrl,
          cityBoundaryGeoJSON,
          _setShowLayer: (show: boolean) => dispatch({ type: 'SET_SHOW_LIBRARY', payload: show }),
          setLayerData: (data: GeoJSONData | null) => dispatch({ type: 'SET_LIBRARY_DATA', payload: data }),
          // _setShowLayer: setShowLibrary,
          // setLayerData: setLibraryData,
          tolerance: 0.05,
        })
      }
    }, [cityConfig.libraryUrl, cityBoundaryGeoJSON])
  }

  function useEffectSetSchoolLayerData() {
    // console.log("useEffectSetSchool called~~")
    useEffect(() => {
      if (cityConfig.schoolsUrl) {
        fetchAndFilterLayerData({
          url: cityConfig.schoolsUrl,
          cityBoundaryGeoJSON,
          // _setShowLayer: setShowSchool,
          // setLayerData: setSchoolData,
          _setShowLayer: (show: boolean) => dispatch({ type: 'SET_SHOW_SCHOOL', payload: show }),
          setLayerData: (data: GeoJSONData | null) => dispatch({ type: 'SET_SCHOOL_DATA', payload: data }),
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
      iconUrl: 'https://ev-map.s3.amazonaws.com/icons/vehicles.png',
      L,
    })
  }

  function useEffectParksAndRecreation(): void {
    useLayerGroupEffect({
      map,
      data: parksAndRecreationData,
      showLayer: showParksAndRecreation,
      layerGroupName: 'parksAndRecreationLayerGroup',
      iconUrl: 'https://ev-map.s3.amazonaws.com/icons/bench.png',
      L,
    })
  }

  function useEffectHealthCareFacilities(): void {
    useLayerGroupEffect({
      map,
      data: healthcareFacilitiesData,
      showLayer: showHealthcareFacilities,
      layerGroupName: 'healthcareFacilitiesLayerGroup',
      iconUrl: 'https://ev-map.s3.amazonaws.com/icons/first-aid-kit.png',
      L,
    })
  }

  function useEffectLihtc(): void {
    useLayerGroupEffect({
      map,
      data: lihtcData,
      showLayer: showLihtc,
      layerGroupName: 'lihtcLayerGroup',
      iconUrl: 'https://ev-map.s3.amazonaws.com/icons/home.png',
      L,
    })
  }

  function useEffectLibrary(): void {
    useLayerGroupEffect({
      map,
      data: LibraryData,
      showLayer: showLibrary,
      layerGroupName: 'libraryLayerGroup',
      iconUrl: 'https://ev-map.s3.amazonaws.com/icons/library.png',
      L,
    })
  }

  function useEffectSchool(): void {
    useLayerGroupEffect({
      map,
      data: schoolsData,
      showLayer: showSchool,
      layerGroupName: 'schoolLayerGroup',
      iconUrl: 'https://ev-map.s3.amazonaws.com/icons/school-bag.png',
      L,
    })
  }
}

function useLayerGroupEffect({
  map,
  data,
  showLayer,
  layerGroupName,
  iconUrl,
  L,
}: UseLayerGroupEffectParams): void {
  // console.log("useLayerGroupEffect called~~", layerGroupName)
  useEffect(() => {
    if (!map || !data) {
      return
    }

    let layerGroup = (map as any)[layerGroupName] as L.LayerGroup | undefined
    // let layerGroup = (map as any)[layerGroupName] as LayerGroup | undefined
    if (showLayer) {
      const icon = L.icon({
        // const icon = mapIcon({
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
        style: { color: '#72DD5A', weight: 1, opacity: 1 }, // old color = #ff7800
        pointToLayer(_feature: GeoJSON.Feature, latlng: L.LatLng) {
          return L.marker(latlng, { icon })
          // return marker(latlng, { icon })
        },
      })

      layerGroup?.addLayer(layer)
    } else if (layerGroup) {
      layerGroup.clearLayers()
      map.removeLayer(layerGroup)
      ;(map as any)[layerGroupName] = undefined
    }
  }, [showLayer, data, map, layerGroupName, iconUrl])
  // }, [showLayer]) // FIXME: doesn't update when new jurisdiction is selected
}

function useEffectWelcomeModal(dispatch: Dispatch<Action>): void {
  useEffect(() => {
    const viewedWelcomeModal = sessionStorage.getItem('viewedWelcomeModal')
    if (!viewedWelcomeModal) {
      dispatch({ type: 'SET_OPEN_WELCOME_MODAL', payload: true })
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

const preprocessJurisdictions = (counties: Record<string, any>): Record<string, string> => {
  const lookup: Record<string, string> = {}

  counties.forEach((county: Record<string, any>) => {
    county.cities.forEach((city: Record<string, any>) => {
      lookup[city.name] = city.provider || 'PG&E'
    })
  })

  return lookup
}

const getUtilityProvider = (lookup: Record<string, any>, jurisdictionName: string): string =>
  lookup[jurisdictionName] || 'PG&E'

export default Map

// const MemoizedMap = React.memo(Map)

// // Memoized MapWrapper Component
// const MapWrapper: React.FC = () => {
//   const { map, cityConfig } = useMapContext()
//   console.log("MapWrapper rendered")

//   return <MemoizedMap map={map} cityConfig={cityConfig} setCurrentView={() => {}} />
// }

// export default React.memo(MapWrapper)
