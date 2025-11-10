import React, { useCallback, useState } from 'react'
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
}

const LayerControl: React.FC<LayerControlProps> = ({ mainText, hoverText, accordionText }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleClick = useCallback((_e: React.MouseEvent, titleProps: AccordionTitleProps) => {
    const { index } = titleProps
    setActiveIndex(prev => (prev === (index as number) ? null : (index as number)))
  }, [])

  return (
    <Accordion fluid>
      <div className="flex justify-between flex-wrap relative">
        <Popup content={hoverText} trigger={<p>{mainText}</p>} />
        <AccordionTitle active={activeIndex === 0} index={0} onClick={_e => handleClick(_e, { index: 0 })}>
          <Icon name="info circle" />
        </AccordionTitle>
        <AccordionContent className="w-full" active={activeIndex === 0}>
          <p className="text-sm" dangerouslySetInnerHTML={{ __html: accordionText }} />
        </AccordionContent>
      </div>
    </Accordion>
  )
}

export default LayerControl
