/* eslint-disable import/no-cycle */
import { useEffect, useState } from 'react'
import { Button, Popup } from 'semantic-ui-react'

import { colors, polygonIndicatorLabels } from '@lib/Constants'

interface PolygonClickMenuProps {
  polygonClickMenuVisible: boolean
  dispatch: React.Dispatch<{
    type: 'SET_FIELD'
    field: 'polygonClickMenuVisible'
    payload: boolean
  }>
  priorityPolygonData: any | null
  feasiblePolygonData: any | null
  menuPosition: { x: number; y: number }
}

const PolygonClickMenu = ({
  polygonClickMenuVisible,
  menuPosition,
  dispatch,
  priorityPolygonData,
  feasiblePolygonData,
}: PolygonClickMenuProps) => {
  const [viewportWidth, setViewportWidth] = useState(0)

  const handleDownloadCSV = () => {
    const mergedData = {
      ...(feasiblePolygonData || {}),
      ...(priorityPolygonData || {}),
    }
    const now = new Date()
    const timestamp = now.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const rows = [['Downloaded At', `"${timestamp}"`], [], ['Parameter', 'Value']]

    Object.entries(mergedData).forEach(([key, val]) => {
      const label = polygonIndicatorLabels[key] || key

      let formattedValue: string | number
      if ((key === 'irs30c' || key === 'nevi') && (val === 1 || val === 0)) {
        formattedValue = val === 1 ? 'Eligible' : 'Ineligible'
      } else {
        formattedValue = Math.round(val as number)
      }

      rows.push([label, String(formattedValue)])
    })

    const csvContent = rows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'polygon-data.csv'
    link.click()
  }

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
      onClose={() => dispatch({ type: 'SET_FIELD', field: 'polygonClickMenuVisible', payload: false })}
      position="top center"
      style={{
        position: 'absolute',
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
        zIndex: 1000,
        width: `${popupWidth}px`,
        height: '210px',
        overflow: 'auto',
      }}
      trigger={<div />}
    >
      <Popup.Header>
        <p style={{ fontFamily: 'serif' }}>User-selected polygon data</p>
      </Popup.Header>
      <Popup.Content>
        {feasiblePolygonData && (
          <>
            <h4 style={{ color: colors.orange }}>Feasibility polygon data:</h4>
            {Object.entries(feasiblePolygonData).map(([key, val]) => {
              const label = polygonIndicatorLabels[key] || key
              if ((key === 'irs30c' || key === 'nevi') && (val === 1 || val === 0)) {
                return (
                  <p key={key}>
                    <strong>{label}</strong>: {val === 1 ? 'Eligible' : 'Ineligible'}
                  </p>
                )
              }
              return (
                <p key={key}>
                  <strong>{label}</strong>: {Math.round(val as number)}
                </p>
              )
            })}
          </>
        )}
        {priorityPolygonData && (
          <>
            <h4 style={{ color: colors.blue }}>Priority polygon data:</h4>
            {Object.entries(priorityPolygonData).map(([key, val]) => {
              const label = polygonIndicatorLabels[key] || key
              return (
                <p key={key}>
                  <strong>{label}</strong>: {Math.round(val as number)}
                </p>
              )
            })}
          </>
        )}
        {(priorityPolygonData || feasiblePolygonData) && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button primary onClick={handleDownloadCSV}>
              Download as CSV
            </Button>
          </div>
        )}
      </Popup.Content>
    </Popup>
  )
}

export default PolygonClickMenu
