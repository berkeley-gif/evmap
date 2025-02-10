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
import React, { useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import Slider from 'react-slider'
import Toggle from 'react-toggle'

import { Range } from '../../pages/map/index'
import { GeoJSONData, GeoJSONFeature } from './GeoJSONData'
import LayerControl from './LayerControl'
import MarkLabel from './MarkLabel'

// import LayerSliderControl from './LayerSliderControl'

interface DataControlsProps {
  dataControlsTitle: string
  jurisdiction?: string | null
  utility?: string | null
  map: any
  L: any
  cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon> | null
  color: any
  geojsonUrl: string
  onDataUpdate: any
  config: any
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
  geojsonUrl,
  onDataUpdate,
  config,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [loading, setLoading] = useState(true) // Add loading state
  const [layerData, setLayerData] = useState<GeoJSONData | null>(null)
  const [showLayerData] = useState(true)
  const layerGroupId = useRef(`layerGroup-${dataControlsTitle}`).current
  const [layerStyle, setLayerStyle] = useState<{ color: any; weight?: number; opacity?: number }>({
    color,
    weight: 1,
    opacity: 0.5,
  })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const popMax = 200
  const ciScoreMax = 100
  const levMax = 1000
  const multiFaMax = 100
  const rentersMax = 100
  const walkableMax = 100
  const drivableMax = 100
  const commercialMax = 100
  const residentialMax = 100
  const pgeMax = 3000
  const [popRange, setPopRange] = useState<Range>([0, 0])
  const [ciScoreRange, setCiScoreRange] = useState<Range>([0, 0])
  const [levRange, setLevRange] = useState<Range>([0, 0])
  const [multiFaRange, setMultiFaRange] = useState<Range>([0, 0])
  const [rentersRange, setRentersRange] = useState<Range>([0, 0])
  const [walkableRange, setWalkableRange] = useState<Range>([0, 0])
  const [drivableRange, setDrivableRange] = useState<Range>([0, 0])
  const [commercialRange, setCommercialRange] = useState<Range>([0, 0])
  const [residentialRange, setResidentialRange] = useState<Range>([0, 0])
  const [neviFilterActive, setNeviFilterActive] = useState({ zero: true, one: true })
  const [irs30cFilterActive, setIrs30cFilterActive] = useState({ zero: true, one: true })
  const [pgeRange, setPgeRange] = useState<Range>([0, 0])

  const resetSliders = () => {
    setPopRange([0, popMax])
    setCiScoreRange([0, ciScoreMax])
    setLevRange([0, levMax])
    setMultiFaRange([0, multiFaMax])
    setRentersRange([0, rentersMax])
    setWalkableRange([0, walkableMax])
    setDrivableRange([0, drivableMax])
    setCommercialRange([0, commercialMax])
    setResidentialRange([0, residentialMax])
    setPgeRange([0, pgeMax])
  }

  const {
    togglePopRange,
    toggleCiRange,
    toggleLevRange,
    toggleMultiFaRange,
    toggleRentersRange,
    toggleWalkableRange,
    toggleDrivableRange,
    toggleCommercialRange,
    toggleResidentialRange,
    toggleNeviFilterActive,
    toggleirs30cFilterActive,
    togglePgeFilterActive,
  } = config

  useEffect(() => {
    if (isFirstLoad) {
      resetSliders()
      setLayerStyle({ ...layerStyle, color })
      setIsFirstLoad(false)
    }
  }, [isFirstLoad, resetSliders])

  const toggleExpand = () => setIsExpanded(!isExpanded)

  function useEffectSetFeatureData(cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon> | null) {
    useEffect(() => {
      const filterData = (
        data: GeoJSONData,
        cityBoundaryGeoJSON: FeatureCollection<Polygon | MultiPolygon> | null,
      ): GeoJSONData => {
        const tolerance = 0.00001 // Adjust for performance vs accuracy
        const simplifiedCityBoundary =
          cityBoundaryGeoJSON && cityBoundaryGeoJSON.features.length > 0
            ? turf.simplify(cityBoundaryGeoJSON.features[0], { tolerance, highQuality: false })
            : null
        return {
          ...data,
          features: data.features.filter((feature: GeoJSONFeature) => {
            const props = feature.properties
            const pgeOrUtility = props.pge ?? props.utility ?? 0
            let withinPropertyCriteria
            if (dataControlsTitle === 'Priority Pixels') {
              const chg_walk = props.chg_walk ?? props.chg_walk_L2_10 // choose one key name
              const chg_drive = props.chg_drive ?? props.chg_drive_DCF_10 // choose one key name
              withinPropertyCriteria =
                props.pop >= popRange[0] &&
                (props.pop <= popRange[1] || popRange[1] === popMax) &&
                props.CIscoreP >= ciScoreRange[0] &&
                (props.CIscoreP <= ciScoreRange[1] || ciScoreRange[1] === ciScoreMax) &&
                props.lev_10000 >= levRange[0] &&
                (props.lev_10000 <= levRange[1] || levRange[1] === levMax) &&
                props['Multi-Family Housing Residents'] >= multiFaRange[0] &&
                (props['Multi-Family Housing Residents'] <= multiFaRange[1] ||
                  multiFaRange[1] === multiFaMax) &&
                props.Renters >= rentersRange[0] &&
                (props.Renters <= rentersRange[1] || rentersRange[1] === rentersMax) &&
                // zoning data has been removed from consideration at this time
                // props.zoning_commercial >= commercialRange[0] / 100 &&
                // (props.zoning_commercial <= commercialRange[1] / 100 || commercialRange[1] === commercialMax) &&
                // props.zoning_residential_multi_family >= residentialRange[0] / 100 &&
                // (props.zoning_residential_multi_family <= residentialRange[1] / 100 ||
                //   residentialRange[1] === residentialMax) &&
                chg_walk >= walkableRange[0] &&
                (chg_walk <= walkableRange[1] || walkableRange[1] === walkableMax) &&
                chg_drive >= drivableRange[0] &&
                (chg_drive <= drivableRange[1] || drivableRange[1] === drivableMax)
            } else {
              withinPropertyCriteria =
                ((neviFilterActive.zero && props.nevi === 0) || (neviFilterActive.one && props.nevi === 1)) &&
                ((irs30cFilterActive.zero && props.irs30c === 0) ||
                  (irs30cFilterActive.one && props.irs30c === 1)) &&
                // props.pge >= pgeRange[0] &&
                // (props.pge <= pgeRange[1] || pgeRange[1] === pgeMax)
                pgeOrUtility >= pgeRange[0] &&
                (pgeOrUtility <= pgeRange[1] || pgeRange[1] === pgeMax)
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
                const simplifiedGeometry = turf.simplify(geometry, { tolerance, highQuality: false })
                return (
                  turf.booleanOverlap(simplifiedGeometry, simplifiedCityBoundary) ||
                  // turf.booleanContains(simplifiedCityBoundary, simplifiedGeometry) ||
                  turf.booleanWithin(simplifiedGeometry, simplifiedCityBoundary)
                )
              }
              return false
            }
            return true
          }),
        }
      }

      const fetchAndFilterData = async () => {
        try {
          const response = await fetch(geojsonUrl)
          const dataJson: GeoJSONData = await response.json()
          const filteredData = filterData(dataJson, cityBoundaryGeoJSON)
          onDataUpdate(filteredData)
          setLayerData(filteredData)
        } catch (error) {
          console.error('Error fetching GeoJSON data:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchAndFilterData()
    }, [
      popRange,
      ciScoreRange,
      levRange,
      multiFaRange,
      rentersRange,
      walkableRange,
      drivableRange,
      neviFilterActive,
      irs30cFilterActive,
      pgeRange,
      commercialRange,
      residentialRange,
      cityBoundaryGeoJSON,
    ])
  }

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
          const layer = L.geoJSON(layerData, { style: layerStyle })
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

  useEffectSetFeatureData(cityBoundaryGeoJSON)
  useEffectLayerData()

  useEffect(() => {
    if (map) {
      // Set initial view to San Francisco and Oakland
      map.setView([37.7749, -122.4194], 10) // Latitude, Longitude, Zoom level
    }
  }, [map])

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
          {/* CI Score Slider */}
          {toggleCiRange && (
            <label>
              <br />
              <LayerControl
                mainText="CalEnviroScreen4.0 percentile"
                hoverText="Slide to adjust the community environmental justice impact score. Higher scores = greater priority."
                accordionText={`<p>Range: ${ciScoreRange[0]} to ${ciScoreRange[1]}</p> 
                <p>CalEnviroScreen4.0 is California’s state environmental justice impact screening tool. CES4.0 combines 21 pollution and population-based criteria into a composite score at the census tract level, with percentile rankings based on comparison to statewide averages. More information available <a href="https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-40" class="inline-link">here</a>.</p>`}
              />
              <MarkLabel range={100} />
              <Slider
                min={0}
                max={ciScoreMax}
                // value={ciScoreRange}
                // onAfterChange={setCiScoreRange}
                marks={10}
                markClassName="slider-mark"
                value={ciScoreRange[0]}
                onChange={value => setCiScoreRange([value, ciScoreRange[1]])}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )}
          {/* Multi-Fa Slider */}
          {toggleMultiFaRange && (
            <label>
              <br />
              <LayerControl
                mainText="Multifamily residents"
                hoverText="Slide to adjust the number of residents in the pixel who live in multifamily buildings (i.e., apartment, condo)."
                accordionText={`<p>Range: ${multiFaRange[0]} to ${
                  multiFaRange[1] === multiFaMax ? '∞' : multiFaRange[1]
                }</p><p>Multifamily and renter resident data are estimated based on American Community Survey data for multifamily/renter percentages by census tract and population per pixel. These residents are more likely to rely on public EV charging and mobility infrastructure than are single-family home residents.</p>`}
              />
              <MarkLabel range={100} />
              <Slider
                min={0}
                max={multiFaMax}
                // value={multiFaRange}
                // onAfterChange={setMultiFaRange}
                marks={10}
                markClassName="slider-mark"
                value={multiFaRange[0]}
                onChange={value => setMultiFaRange([value, multiFaRange[1]])}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )}
          {/* Renters Slider */}
          {toggleRentersRange && (
            <label>
              <br />
              <LayerControl
                mainText="Renters"
                hoverText="Slide to adjust the number of residents in the pixel who rent their home."
                accordionText={`<p>Range: ${rentersRange[0]} to ${
                  rentersRange[1] === rentersMax ? '∞' : rentersRange[1]
                }</p><p>Multifamily and renter resident data are estimated based on American Community Survey data for multifamily/renter percentages by census tract and population per pixel. These residents are more likely to rely on public EV charging and mobility infrastructure than are single-family home residents.</p>`}
              />
              <MarkLabel range={100} />
              <Slider
                min={0}
                max={rentersMax}
                // value={rentersRange}
                // onAfterChange={setRentersRange}
                marks={10}
                markClassName="slider-mark"
                value={rentersRange[0]}
                onChange={value => setRentersRange([value, rentersRange[1]])}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )}
          {/* Walkable Slider */}
          {toggleWalkableRange && (
            <label>
              <br />
              <LayerControl
                mainText="L2 chargers within 10 min walk"
                hoverText="Slide to adjust the number of public Level 2 EV chargers within a 10 minute walk of the pixel. Lower numbers = lower charging access in the pixel."
                accordionText={`<p>Range: ${walkableRange[0]} to ${
                  walkableRange[1] === walkableMax ? '∞' : walkableRange[1]
                }</p><p>Level 2 and DC Fast access are estimated based on <a href="https://docs.mapbox.com/api/navigation/isochrone/" class="inline-link">MapBox isochrones API</a> (which estimates travel times between specific locations) and <a href="https://afdc.energy.gov/fuels/electricity-locations#/find/nearest?fuel=ELEC" class="inline-link">US Department of Energy current charger data</a>. Walk time is used for Level 2 chargers (which typically take multiple hours to complete a charge) while drive time is used for DC Fast chargers (which typically take 30-60 minutes), reflecting their different use cases.</p>`}
              />
              <MarkLabel range={100} />
              <Slider
                min={0}
                max={walkableMax}
                // value={walkableRange}
                // onAfterChange={setWalkableRange}
                marks={10}
                markClassName="slider-mark"
                value={walkableRange[1]}
                onChange={value => setWalkableRange([walkableRange[0], value])}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )}
          {/* Drivable Slider */}
          {toggleDrivableRange && (
            <label>
              <br />
              <LayerControl
                mainText="DCF chargers within 10 min drive"
                hoverText="Slide to adjust the number of public DC Fast chargers within a 10 minute drive of the pixel. Lower numbers = lower charging access in the pixel."
                accordionText={`<p>Range: ${drivableRange[0]} to ${
                  drivableRange[1] === drivableMax ? '∞' : drivableRange[1]
                }</p><p>Level 2 and DC Fast access are estimated based on <a href="https://docs.mapbox.com/api/navigation/isochrone/" class="inline-link">MapBox isochrones API</a> (which estimates travel times between specific locations) and <a href="https://afdc.energy.gov/fuels/electricity-locations#/find/nearest?fuel=ELEC" class="inline-link">US Department of Energy current charger data</a>. Walk time is used for Level 2 chargers (which typically take multiple hours to complete a charge) while drive time is used for DC Fast chargers (which typically take 30-60 minutes), reflecting their different use cases.</p>`}
              />
              <MarkLabel range={100} />
              <Slider
                min={0}
                max={drivableMax}
                // value={drivableRange}
                // onAfterChange={setDrivableRange}
                marks={10}
                markClassName="slider-mark"
                value={drivableRange[1]}
                onChange={value => setDrivableRange([drivableRange[0], value])}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )}
          {/* Population Slider */}
          {/* {togglePopRange && (
            <label>
              <br />
              <LayerControl
                mainText="Population in pixel"
                hoverText="Slide to adjust"
                accordionText={`<p>Range: ${popRange[0]} to ${
                  popRange[1] === popMax ? '∞' : popRange[1]
                }</p><p>Placeholder text</p>`}
              />
              <Slider
                min={0}
                max={popMax}
                value={popRange}
                onAfterChange={setPopRange}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )} */}
          {/* Commercial Zoning Slider */}
          {toggleCommercialRange && (
            <label>
              <br />
              <LayerControl
                mainText="Commercial Zoning %"
                hoverText="Slide to adjust"
                accordionText={`<p>Range: ${commercialRange[0]} to ${commercialRange[1]}</p><p>Placeholder text</p>`}
              />
              <MarkLabel range={100} />
              <Slider
                min={0}
                max={commercialMax}
                // value={commercialRange}
                // onAfterChange={setCommercialRange}
                marks={10}
                markClassName="slider-mark"
                value={commercialRange[0]}
                onChange={value => setCommercialRange([value, commercialRange[1]])}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )}
          {/* Residential Zoning Slider */}
          {toggleResidentialRange && (
            <label>
              <br />
              <LayerControl
                mainText="Multifamily Residential Zoning %"
                hoverText="Slide to adjust"
                accordionText={`<p>Range: ${residentialRange[0]} to ${residentialRange[1]}</p><p>Placeholder text</p>`}
              />
              <MarkLabel range={100} />
              <Slider
                min={0}
                max={residentialMax}
                // value={residentialRange}
                // onAfterChange={setResidentialRange}
                marks={10}
                markClassName="slider-mark"
                value={residentialRange[0]}
                onChange={value => setResidentialRange([value, residentialRange[1]])}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )}
          {/* LEV Slider */}
          {toggleLevRange && (
            <label>
              <br />
              <LayerControl
                mainText="Registered LEVs"
                hoverText="Slide to adjust the density of low-emitting vehicles (EVs and hydrogen fuel-cell) registered in the ZIP code."
                accordionText={`<p>Range: ${levRange[0]} to ${
                  levRange[1] === levMax ? '∞' : levRange[1]
                }</p><p>Higher LEV registrations in an area indicate a greater need for charging today but also suggest a higher early adopter rate–thus, potentially greater access to at-home charging and lower need for equity prioritization. Registrations are calculated per 1000 residents to account for population variations across ZIP codes.</p>`}
              />
              <MarkLabel range={1000} />
              <Slider
                min={0}
                max={levMax}
                // value={levRange}
                marks={100}
                markClassName="slider-mark"
                value={levRange[1]}
                onChange={value => setLevRange([levRange[0], value])}
                // onAfterChange={setLevRange}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )}
          {/* Pge Slider */}
          {togglePgeFilterActive && (
            <label>
              <br />
              <LayerControl
                mainText="Electric grid load capacity (kW)"
                hoverText="Slide to adjust the available capacity on the electrical distribution grid through the pixel. Higher numbers = more capacity to install EV chargers."
                accordionText={`<p>Range: ${pgeRange[0]} to ${pgeRange[1] === pgeMax ? '∞' : pgeRange[1]}</p>
                <p>Load capacity is based on the capacity map provided by the electric utility that serves the jurisdiction, <a href="https://www.energy.gov/eere/us-atlas-electric-distribution-system-hosting-capacity-maps">where available</a>. 
                ${
                  jurisdiction && utility ? `<b>${jurisdiction} is in ${utility} service territory.</b>` : ''
                } Energy requirements vary widely, but 100 kW of capacity is typically needed to support 5-10 Level 2 chargers or 1 DC Fast charger.</p>`}
              />
              <MarkLabel range={3000} />
              <Slider
                min={0}
                max={pgeMax}
                // value={pgeRange}
                // onAfterChange={setPgeRange}
                marks={300}
                markClassName="slider-mark"
                value={pgeRange[0]}
                onChange={value => setPgeRange([value, pgeRange[1]])}
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                renderThumb={(
                  props: JSX.IntrinsicAttributes &
                    React.ClassAttributes<HTMLDivElement> &
                    React.HTMLAttributes<HTMLDivElement>,
                  state: {
                    valueNow:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined
                  },
                ) => <div {...props}>{state.valueNow}</div>}
                pearling
                minDistance={0}
              />
            </label>
          )}
          <br />
          {toggleNeviFilterActive && (
            <div className="checkbox-group justify-between">
              {/* NEVI Checkboxes */}
              <br />
              <label style={{ marginRight: '20px' }}>
                <Toggle
                  checked={neviFilterActive.one && !neviFilterActive.zero}
                  onChange={() => {
                    const currentlyShowingOnlyOne = neviFilterActive.one && !neviFilterActive.zero
                    if (currentlyShowingOnlyOne) {
                      setNeviFilterActive({ zero: true, one: true })
                    } else {
                      setNeviFilterActive({ zero: false, one: true })
                    }
                  }}
                  icons={false}
                />
              </label>
              <LayerControl
                mainText="NEVI Eligible"
                hoverText="Toggle to show pixels in areas that are eligible for grant funding through the National Electric Vehicle Infrastructure program, which funds EV chargers within 1 mile of designated highways."
                accordionText={`<p>Range: On or Off
                </p><p>NEVI funding is generally intended to support a connected national highway charging network, as opposed to community-based local charging. It is thus largely focused on high-speed DC Fast charging to serve long trips. <a href="https://driveelectric.gov/corridors">USDOE provides more information</a> and to see the designated Alternative Fuel Corridors and state plans.</p>`}
              />
            </div>
          )}
          {toggleirs30cFilterActive && (
            <div className="checkbox-group justify-between">
              {/* IRS Checkboxes */}
              <br />
              <label style={{ marginRight: '20px' }}>
                <Toggle
                  checked={irs30cFilterActive.one && !irs30cFilterActive.zero}
                  onChange={() => {
                    const currentlyShowingOnlyOne = irs30cFilterActive.one && !irs30cFilterActive.zero
                    if (currentlyShowingOnlyOne) {
                      setIrs30cFilterActive({ zero: true, one: true })
                    } else {
                      setIrs30cFilterActive({ zero: false, one: true })
                    }
                  }}
                  icons={false}
                />
                {/* <span style={{ marginLeft: '20px' }}>IRS 30C Eligible</span> */}
              </label>
              <LayerControl
                mainText="IRS 30C eligible"
                hoverText="Toggle to show pixels in areas that are eligible for federal tax credits for EV charger installation, limited to communities designated either low-income or non-urban."
                accordionText={`<p>Range: On or Off
                </p><p>The IRS 30C Alternative Fuel Vehicle Refueling Property Credit provides generous tax credits for installations by individuals, businesses, nonprofits, and governments in qualifying areas. <a class="inline-link" href="https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit">IRS provides more information</a> on eligibility and procedures.</p><p>The <a class="inline-link" href="https://cleanenergytaxnavigator.org/">Clean Energy Tax Navigator</a> is a free tool to help identify available credits including 30C.</p>`}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
