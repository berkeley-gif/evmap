/* eslint-disable no-console */

/* eslint-disable jsx-a11y/label-has-associated-control */

/* eslint-disable react/button-has-type */

/* eslint-disable jsx-a11y/control-has-associated-label */

/* eslint-disable consistent-return */

/* eslint-disable @typescript-eslint/no-shadow */

/* eslint-disable import/no-cycle */

/* eslint-disable import/no-extraneous-dependencies */
import * as turf from '@turf/turf'
import { Feature, FeatureCollection, GeoJsonProperties, MultiPolygon, Point, Polygon } from 'geojson'
import { LeafletMouseEvent } from 'leaflet'
import React, { useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color'
import Slider from 'react-slider'
import Toggle from 'react-toggle'

import { Range } from '@lib/Constants'
import { SliderConfigs } from '@lib/SliderConfigs'

import { GeoJSONData, GeoJSONFeature } from './GeoJSONData'
import LayerControl from './LayerControl'
import MarkLabel from './MarkLabel'

interface DataControlsProps {
  dataControlsTitle: string
  jurisdiction?: string | null
  utility?: string | null
  map: any
  L: any
  simplifiedCityBoundary: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null
  color: string
  layerData: any
  otherLayerData: any
  config: any
  dispatch: any
  loading: boolean
  filterData: any
  fetchAndFilterData: any
  resetSliders: any
  scoreRanges: any
  updateRange: any
  filters: any
  setFilters: any
}

interface CachedType {
  dataLayerJson: GeoJSONData | null
}

const cached: CachedType = {
  dataLayerJson: null,
}

export const DataControls = ({
  dataControlsTitle,
  jurisdiction,
  utility,
  map,
  L,
  simplifiedCityBoundary,
  color,
  layerData,
  otherLayerData,
  config,
  dispatch,
  loading,
  filterData,
  fetchAndFilterData,
  resetSliders,
  scoreRanges,
  updateRange,
  filters,
  setFilters,
}: DataControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [showLayerData] = useState(true)
  const layerGroupId = useRef(`layerGroup-${dataControlsTitle}`).current
  const [layerStyle, setLayerStyle] = useState<{ color: any; weight?: number; opacity?: number }>({
    color,
    weight: 1,
    opacity: 0.5,
  })
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    if (isFirstLoad) {
      resetSliders()
      setLayerStyle({ ...layerStyle, color })
      setIsFirstLoad(false)
    }
  }, [isFirstLoad, resetSliders])

  const toggleExpand = () => setIsExpanded(!isExpanded)

  function useEffectSetFeatureData(
    simplifiedCityBoundary: Feature<Polygon | MultiPolygon, GeoJsonProperties> | null,
  ) {
    useEffect(() => {
      fetchAndFilterData()
    }, [scoreRanges, filters, simplifiedCityBoundary])
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
          const layer = L.geoJSON(layerData, {
            style: layerStyle,
            onEachFeature: (feature: any, layer: any) => {
              layer.on('click', (e: LeafletMouseEvent) => {
                const clickPoint = turf.point([e.latlng.lng, e.latlng.lat])
                const featureProps = feature.properties
                const isPriority = dataControlsTitle === 'Priority Pixels'
                const otherHit = otherLayerData?.features.find((otherFeature: any) =>
                  turf.booleanPointInPolygon(clickPoint, otherFeature),
                )
                dispatch({
                  type: 'SET_MENU_POSITION',
                  payload: { x: e.originalEvent.clientX, y: e.originalEvent.clientY },
                })
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
            renderer: L.canvas(),
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

  useEffectSetFeatureData(simplifiedCityBoundary)
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
      config.census?.[indicator.trigger] ||
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
                setFilters((prev: any) => ({
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
                setFilters((prev: any) => ({
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
      )}
    </div>
  )
}
