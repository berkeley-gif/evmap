import useMapContext from '@map/useMapContext'
import counties from '@public/jurisdictions.json'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Dropdown, DropdownProps } from 'semantic-ui-react'

type State = {
  id: string
  name: string
  available: boolean
  counties: County[]
}

type County = {
  id: string
  name: string
  available: boolean
  cities: City[]
}

type City = {
  id: string
  name: string
  available: boolean
  noUtilityData?: boolean
  provider?: string
}

type MapSelectorProps = {
  startLoading?: () => void
  isVertical?: boolean
}

const MapSelector = ({ startLoading, isVertical }: MapSelectorProps) => {
  const { setCityConfig } = useMapContext()
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const router = useRouter()
  const isMapPage = router.pathname === '/map'

  const getCityConfig = async (county: string, city: string) => {
    const cityConfig = {
      city,
      county,
      boundaryUrl: `https://ev-map-2.s3.amazonaws.com/CA/${county}/${city}/${city}_city_boundary.geojson`,
      priorityDataUrl: `https://ev-map-2.s3.amazonaws.com/CA/${county}/${city}/${city}_priority.json`,
      feasibleDataUrl: `https://ev-map-2.s3.amazonaws.com/CA/${county}/${city}/${city}_feasibility.json`,
      transitStopsUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_transit.geojson`,
      // parksAndRecreationUrl: `https://ev-map-2.s3.amazonaws.com/CA/${county}/${city}/${city}_parks.geojson`,
      parksAndRecreationUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_parks/${county}_parks.geojson`,
      healthcareFacilitiesUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_healthcare.geojson`,
      lihtcUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_lihtc.geojson`,
      schoolsUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_schools.geojson`,
      libraryUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_libraries.geojson`,
    }
    if (setCityConfig) setCityConfig(cityConfig)
  }

  const handleCountyChange = (_event: React.SyntheticEvent, data: DropdownProps) => {
    const currentCounty = counties.find(county => county.name === data.value)
    if (currentCounty) {
      setSelectedCounty(currentCounty)
      setCities(currentCounty.cities)
      if (currentCounty.name === 'San Francisco County') {
        const sanFranciscoCity = (currentCounty.cities as City[]).find(city => city.name === 'San Francisco')
        if (sanFranciscoCity) {
          setSelectedCity(sanFranciscoCity)
        }
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
    if (selectedCounty && selectedCity) {
      await getCityConfig(
        selectedCounty.name.replace(/\s+/g, '_').toLowerCase(),
        selectedCity.name.replace(/\s+/g, '_').toLowerCase(),
      )
    }

    if (!isMapPage) {
      router.push('/map')
    } else {
      startLoading!()
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
            options={cities.map(city => ({
              key: city.id,
              text: (
                <>
                  {city.name.startsWith('un_') ? 'Unincorporated' : city.name}
                  {city.noUtilityData && (
                    <span style={{ color: '#ffa500' }}> (utility data not yet available)</span>
                  )}
                </>
              ),
              value: city.name,
              disabled: !city.available,
            }))}
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
