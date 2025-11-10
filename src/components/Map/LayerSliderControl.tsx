import React from 'react'
import Slider from 'react-slider'

import LayerControl from './LayerControl'
import MarkLabel from './MarkLabel'

interface LayerSliderControlProps {
  toggleValue: boolean
  mainText: string
  hoverText: string
  accordionText: string
  min: number
  max: number
  scoreRange: [number, number]
  setScoreRange: (r: [number, number]) => void
  labelRange: number
}

const LayerSliderControl: React.FC<LayerSliderControlProps> = ({
  toggleValue,
  mainText,
  hoverText,
  accordionText,
  min,
  max,
  scoreRange,
  setScoreRange,
  labelRange,
}) => {
  if (!toggleValue) return null
  return (
    <>
      <br />
      <LayerControl mainText={mainText} hoverText={hoverText} accordionText={accordionText} />
      <MarkLabel range={labelRange} />
      <Slider
        min={min}
        max={max}
        marks={10}
        markClassName="slider-mark"
        value={scoreRange[0]}
        onChange={value => setScoreRange([value, scoreRange[1]])}
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
        aria-label={`Range slider for ${mainText}`}
      />
    </>
  )
}

export default LayerSliderControl
