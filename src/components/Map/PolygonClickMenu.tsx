import { useEffect, useState } from 'react'
import { Button, Popup } from 'semantic-ui-react'

// interface ContextMenuProps {
//   contextMenuVisible: boolean
//   dispatch: React.Dispatch<{
//     type: 'SET_CONTEXT_MENU_VISIBLE'
//     payload: boolean
//   }>
//   clickedLatLng: { lat: number; lng: number } | null
//   menuPosition: { x: number; y: number }
//   takeScreenshot: () => void
// }

const PolygonClickMenu = ({
  polygonClickMenuVisible,
  menuPosition,
  dispatch,
}: {
  polygonClickMenuVisible: boolean
  menuPosition: { x: number; y: number }
  dispatch: React.Dispatch<any>
}) => {
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
      open={polygonClickMenuVisible}
      onClose={() => dispatch({ type: 'SET_POLYGON_CLICK_MENU_VISIBLE', payload: false })}
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
        <p style={{ fontFamily: 'serif' }}>User-selected polygon data</p>
      </Popup.Header>
      <Popup.Content>
        {/* if the polygon is feasibility: */}
        <h1>Feasibility polygon data (blue) :</h1>
        {/* if the polygon is priority: */}
        <h1>Priority polygon data (orange) :</h1>
      </Popup.Content>
    </Popup>
  )
}

export default PolygonClickMenu
