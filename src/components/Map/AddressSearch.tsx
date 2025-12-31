import { useEffect, useRef, useState } from 'react'
import { Button, Icon, Input } from 'semantic-ui-react'

interface AddressSearchProps {
  map: any
  onLocationSelect?: (lat: number, lng: number, address: string) => void
}

const AddressSearch = ({ map, onLocationSelect }: AddressSearchProps) => {
  const [address, setAddress] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const selectedPlaceRef = useRef<google.maps.places.PlaceResult | null>(null)

  const initializeAutocomplete = () => {
    if (!inputRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      selectedPlaceRef.current = place

      if (place.formatted_address) {
        setAddress(place.formatted_address)
      }
    })

    autocompleteRef.current = autocomplete
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY

    if (!API_KEY) {
      console.error('Google Cloud API key not found')
      return
    }

    if (window.google?.maps?.places) {
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!isExpanded || !inputRef.current) return () => {}
    if (autocompleteRef.current) return () => {}

    if (!window.google?.maps?.places) {
      console.error('Google Maps Places API not loaded yet')
      return () => {}
    }

    initializeAutocomplete()

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [isExpanded])

  const handleSearch = () => {
    console.log('Searching for address:', address)
    const place = selectedPlaceRef.current

    if (!place?.geometry?.location) {
      console.error('No location data available')
      return
    }

    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()
    console.log(`Navigating to: (${lat}, ${lng})`)
    if (map) {
      const maxZoom = map.getMaxZoom() || 18
      map.setView([lat, lng], maxZoom)

      if (onLocationSelect) {
        onLocationSelect(lat, lng, place.formatted_address || address)
      }
    }

    setIsExpanded(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '100px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {isExpanded ? (
        <>
          <Input
            type="text"
            placeholder="Enter an address..."
            value={address}
            onChange={e => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '300px',
            }}
            action
          >
            <input ref={inputRef} />
            <Button primary onClick={handleSearch} disabled={!address}>
              Go
            </Button>
          </Input>
          <Button
            icon
            onClick={() => {
              setIsExpanded(false)
              setAddress('')
              selectedPlaceRef.current = null
            }}
            title="Close search"
          >
            <Icon name="close" />
          </Button>
        </>
      ) : (
        <Button
          icon
          primary
          onClick={() => setIsExpanded(true)}
          title="Search for an address"
          style={{
            backgroundColor: '#2185d0',
            color: 'white',
          }}
        >
          <Icon name="search" />
        </Button>
      )}
    </div>
  )
}

export default AddressSearch
