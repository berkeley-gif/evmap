import { useEffect, useState } from 'react'
import { Button, Popup } from 'semantic-ui-react'

interface ContextMenuProps {
  contextMenuVisible: boolean
  dispatch: React.Dispatch<{
    type: 'SET_CONTEXT_MENU_VISIBLE'
    payload: boolean
  }>
  clickedLatLng: { lat: number; lng: number } | null
  menuPosition: { x: number; y: number }
  takeScreenshot: () => void
}

const ContextMenu = ({
  contextMenuVisible,
  dispatch,
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

  const popupWidth = 260
  const adjustedX = menuPosition.x - viewportWidth / 2 - popupWidth / 2 + 4
  const adjustedY = menuPosition.y - 218
  return (
    <Popup
      open={contextMenuVisible}
      onClose={() => dispatch({ type: 'SET_CONTEXT_MENU_VISIBLE', payload: false })}
      position="top center"
      style={{
        position: 'absolute',
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
        zIndex: 1000,
        width: `${popupWidth}px`,
        height: '210px',
      }}
      trigger={<div />}
    >
      <Popup.Header>
        <p style={{ fontFamily: 'serif' }}>User-selected priority location</p>
      </Popup.Header>
      <Popup.Content>
        <p>
          <b>Latitude:</b> {clickedLatLng?.lat.toFixed(4)}
        </p>
        <p>
          <b>Longitude:</b> {clickedLatLng?.lng.toFixed(4)}
        </p>
        <p>
          Contact your local transportation, planning, or power agencies to discuss EV infrastructure
          investment at this point
        </p>
        {/* <div>{contextMenuVisible && <Button onClick={getImage}>Take Map Snapshot</Button>} */}
        <div className="flex justify-center">
          {contextMenuVisible && (
            <Button
              primary
              onClick={() => {
                dispatch({ type: 'SET_CONTEXT_MENU_VISIBLE', payload: false })
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
