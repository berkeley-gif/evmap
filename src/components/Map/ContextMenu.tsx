import { useEffect, useState } from 'react'
import { Button, Icon, Popup } from 'semantic-ui-react'

interface ContextMenuProps {
  contextMenuVisible: boolean
  dispatch: React.Dispatch<{
    type: 'SET_FIELD'
    field: 'contextMenuVisible'
    payload: boolean
  }>
  city: string
  clickedLatLng: { lat: number; lng: number } | null
  menuPosition: { x: number; y: number }
  takeScreenshot: () => void
}

const ContextMenu = ({
  contextMenuVisible,
  dispatch,
  city,
  clickedLatLng,
  menuPosition,
  takeScreenshot,
}: ContextMenuProps) => {
  const [viewportWidth, setViewportWidth] = useState(0)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth)
      const handleResize = () => {
        setViewportWidth(window.innerWidth)
      }
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    return undefined
  }, [])
  const [address, setAddress] = useState('')
  const popupWidth = 260
  const adjustedX = menuPosition.x - viewportWidth / 2 - popupWidth / 2 + 4
  const nearTopOfScreen = typeof window !== 'undefined' ? menuPosition.y < window.innerHeight / 2 : false
  const adjustedY = nearTopOfScreen ? menuPosition.y : menuPosition.y - 310
  const modalPosition = nearTopOfScreen ? 'bottom center' : 'top center'
  // const API_KEY = process.env.NEXT_PUBLIC_GEOCODING_API_KEY
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY
  const lat = clickedLatLng?.lat ?? null
  const lng = clickedLatLng?.lng ?? null

  const formatAddress = (addr: any): string => {
    const houseNumber = addr.house_number?.split(';')[0] ?? ''
    const road = addr.road ?? ''
    const cityName = addr.city ?? ''
    const state = addr.state === 'California' ? 'CA' : addr.state
    const postcode = addr.postcode ?? ''
    return `${houseNumber} ${road}, ${cityName}, ${state}, ${postcode}`.trim()
  }

  useEffect(() => {
    if (!clickedLatLng?.lat || !clickedLatLng?.lng) return undefined

    const controller = new AbortController()
    const { signal } = controller

    const fetchAddress = async () => {
      try {
        // const revGeocodeUrl = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=${API_KEY}`
        const revGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address&key=${API_KEY}`
        const res = await fetch(revGeocodeUrl, { signal })
        const data = await res.json()
        // const addressResponse = formatAddress(data.address)
        const addressResponse = data.results[0].formatted_address
        navigator.clipboard.writeText(addressResponse)
        setAddress(addressResponse ?? 'No address found')
      } catch (err) {
        console.error(err)
        setAddress('Error fetching address')
      }
    }
    setAddress('Loading address...')
    fetchAddress()

    return () => {
      controller.abort()
    }
  }, [clickedLatLng])

  return (
    <Popup
      open={contextMenuVisible}
      onClose={() => dispatch({ type: 'SET_FIELD', field: 'contextMenuVisible', payload: false })}
      position={modalPosition}
      style={{
        position: 'absolute',
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
        zIndex: 1000,
        width: `${popupWidth}px`,
        height: '300px',
      }}
      trigger={<div />}
    >
      <Popup.Header>
        <p style={{ fontFamily: 'serif' }}>User-selected priority location</p>
      </Popup.Header>
      <Popup.Content>
        <p>Nearest address: </p>
        <p className="py-2 border-t border-b">
          <b>{address || 'No address'}</b>
          <Icon
            name="copy"
            link
            color="blue"
            onClick={() => {
              navigator.clipboard.writeText(address)
            }}
            title="Copy to clipboard"
          />
        </p>
        {city === 'san_francisco' ? (
          <p>
            Click “Take Map Snapshot” and send the resulting image download to{' '}
            <a href="chargingmadeeasy@sfgov.org" className="inline-link">
              chargingmadeeasy@sfgov.org
            </a>{' '}
            to propose EV infrastructure investment at this location.
          </p>
        ) : (
          <p>
            Click “Take Map Snapshot” and share the resulting image download with your local transportation,
            planning, or power agencies to propose EV infrastructure investment at this location.
          </p>
        )}
        <div className="flex justify-center">
          {contextMenuVisible && (
            <Button
              primary
              onClick={() => {
                dispatch({ type: 'SET_FIELD', field: 'contextMenuVisible', payload: false })
                takeScreenshot()
              }}
            >
              Take Map Snapshot
            </Button>
          )}
        </div>
      </Popup.Content>
    </Popup>
  )
}

export default ContextMenu
