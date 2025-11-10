import useMapContext from '@map/useMapContext'
import counties from '@public/jurisdictions.json'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Dropdown, DropdownProps } from 'semantic-ui-react'

import { makeCityConfig } from '@src/utils/makeCityConfig'

import { City, County } from '../../types/jurisdictions'

type MapSelectorProps = {
  startLoading?: () => void
  isVertical?: boolean
}

const MapSelector = ({ startLoading, isVertical }: MapSelectorProps) => {
  const initialSetting = {
    county: {
      id: 'default_id',
      name: 'default_name',
      available: false,
      cities: [],
    },
    city: {
      id: 'default_id',
      name: 'default_name',
      available: false,
    },
  }
  const { setCityConfig } = useMapContext()
  const [selectedCounty, setSelectedCounty] = useState<County>(initialSetting.county)
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City>(initialSetting.city)
  const router = useRouter()
  const isMapPage = router.pathname === '/map'

  useEffect(() => {
    if (selectedCounty && selectedCity) {
      const config = makeCityConfig(
        selectedCounty.name.replace(/\s+/g, '_').toLowerCase(),
        selectedCity.name.replace(/\s+/g, '_').toLowerCase(),
      )
      setCityConfig(config)
    }
  }, [selectedCounty, selectedCity, setCityConfig])

  const handleCountyChange = (_event: React.SyntheticEvent, data: DropdownProps) => {
    const currentCounty = counties.find(county => county.name === data.value)
    if (currentCounty) {
      setSelectedCounty(currentCounty)
      setCities(currentCounty.cities)
      if (currentCounty.name === 'San Francisco County') {
        const sanFranciscoCity = (currentCounty.cities as City[]).find(city => city.name === 'San Francisco')
        if (sanFranciscoCity) {
          setSelectedCity(sanFranciscoCity)
        } else {
          setSelectedCity(initialSetting.city)
        }
      } else {
        setSelectedCity(initialSetting.city)
      }
    }
  }

  const handleCityChange = (_event: React.SyntheticEvent, data: DropdownProps) => {
    const currentCity = cities.find(city => city.name === data.value)
    if (currentCity) {
      setSelectedCity(currentCity)
    }
  }

  const handleButtonClick = async () => {
    if (!selectedCounty || !selectedCity) return

    // trigger the loader (if provided) so the UX reflects the async work
    if (startLoading) startLoading()

    // prepare normalized ids used by makeCityConfig
    const countyKey = selectedCounty.name.replace(/\s+/g, '_').toLowerCase()
    const cityKey = selectedCity.name.replace(/\s+/g, '_').toLowerCase()

    try {
      await makeCityConfig(countyKey, cityKey)
      if (!isMapPage) {
        await router.push('/map')
      }
    } catch (err) {
      console.error('Error loading jurisdiction', err)
    }
  }

  const showButton = selectedCounty && (selectedCounty.name === 'San Francisco County' || selectedCity)

  return (
    <div
      className={`flex ${isVertical ? 'flex-col items-center' : ''} ${
        isVertical ? 'space-y-4' : 'space-x-4'
      }`}
    >
      {/* <div className={`${isVertical ? 'mb-4' : 'w-1/3 pr-2'}`}>
        <Dropdown
          placeholder="Select State"
          fluid
          selection
          search
          options={stateOptions}
          onChange={handleStateChange}
          className="text-primary"
        />
      </div> */}
      <div className={`${isVertical ? 'w-full' : 'w-1/3 pr-2'}`}>
        <Dropdown
          placeholder="Select County"
          fluid
          selection
          search
          options={counties.map(county => ({
            key: county.id,
            text: county.name,
            value: county.name,
            disabled: !county.available,
          }))}
          onChange={handleCountyChange}
          className="text-primary"
        />
      </div>
      <div className={`${isVertical ? 'w-full' : 'w-1/3 pr-2'}`}>
        {selectedCounty && selectedCounty?.name !== 'San Francisco County' && (
          <Dropdown
            placeholder="Select Municipality"
            fluid
            selection
            search
            options={cities.map(city => {
              const label = city.name.startsWith('un_') ? 'Unincorporated' : city.name
              const labelWithNote = city.noUtilityData ? `${label} (utility data not yet available)` : label
              return {
                key: city.id,
                text: labelWithNote,
                value: city.name,
                disabled: !city.available,
                content: (
                  <>
                    {label}
                    {city.noUtilityData && (
                      <span style={{ color: '#ffa500' }}> (utility data not yet available)</span>
                    )}
                  </>
                ),
              }
            })}
            onChange={handleCityChange}
          />
        )}
      </div>
      <div className={`${isVertical ? 'w-full' : 'w-1/3'} flex items-center justify-center`}>
        {showButton && (
          <button type="button" className="custom-button bg-primary text-white" onClick={handleButtonClick}>
            {isMapPage ? 'Load Map' : 'Go to Map'}
          </button>
        )}
      </div>
    </div>
  )
}

export default MapSelector
