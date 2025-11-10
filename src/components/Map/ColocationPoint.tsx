import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionTitle,
  AccordionTitleProps,
  Icon,
  Popup,
} from 'semantic-ui-react'

interface LayerControlProps {
  mainText: string
  hoverText: string
  accordionText: string
  setValue: (newValue: boolean) => void
  value: boolean
  image: string
  imgAlt: string
}

const ColocationPoint: React.FC<LayerControlProps> = ({
  mainText,
  hoverText,
  accordionText,
  setValue,
  value,
  image,
  imgAlt,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleClick = (_e: React.MouseEvent, titleProps: AccordionTitleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? null : (index as number)
    setActiveIndex(newIndex)
  }

  return (
    <Accordion fluid>
      <div className="flex items-center flex-wrap relative space-x-2">
        <input
          type="checkbox"
          checked={value}
          onChange={e => setValue(e.currentTarget.checked)}
          aria-label={mainText}
        />
        <Popup
          content={hoverText}
          trigger={
            <button
              type="button"
              className="bg-transparent p-0 m-0 text-left"
              aria-label={`${mainText} info`}
            >
              {mainText}
            </button>
          }
        />
        <img src={image} alt={imgAlt} />
        <div className="flex-grow" />
        <AccordionTitle
          active={activeIndex === 0}
          index={0}
          onClick={_e => handleClick(_e, { index: 0 })}
          className="ml-auto"
        >
          <Icon name="info circle" />
        </AccordionTitle>
        <AccordionContent className="w-full" active={activeIndex === 0}>
          {/* <p className="text-sm" dangerouslySetInnerHTML={{ __html: accordionText }} /> */}
          <p className="text-sm">{accordionText}</p>
        </AccordionContent>
      </div>
    </Accordion>
  )
}

export default ColocationPoint
