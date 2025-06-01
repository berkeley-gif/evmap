/* eslint-disable import/no-cycle */

/* eslint-disable jsx-a11y/label-has-associated-control */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react'
import { Divider, Dropdown, Form, Grid, Header, Menu, Segment } from 'semantic-ui-react'

import { PriorityDataConfig } from '@pages/map/index'

import { configIndicatorLabels } from '@lib/Constants'

interface ConfigurationPanelProps {
  priorityDataConfig: PriorityDataConfig
  handlePriorityChange: any
  closePanel: () => void
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  priorityDataConfig,
  handlePriorityChange,
  closePanel,
}) => {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        closePanel()
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [closePanel])
  const [selectedPriority, setSelectedPriority] = useState('CES')

  const priorityToggleMap: Record<string, string> = {
    CJEST: 'toggleCJESTRange',
    EJScreen: 'toggleEJScreenRange',
    CES: 'toggleCiRange',
  }

  return (
    <div
      className="config-panel-container"
      onClick={event => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
          closePanel()
        }
      }}
    >
      <div className="config-panel" ref={panelRef}>
        {/* <div className="config-columns"> */}
        <h2>
          <b>Priority Data</b>
        </h2>
        <Menu vertical className="wide-menu">
          <Menu.Item>
            <Dropdown text={`Priority Type: ${selectedPriority}`}>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setSelectedPriority('CJEST')
                    handlePriorityChange(priorityToggleMap.CJEST, 'composite')
                  }}
                >
                  CJEST
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSelectedPriority('EJScreen')
                    handlePriorityChange(priorityToggleMap.EJScreen, 'individual')
                  }}
                >
                  EJScreen
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSelectedPriority('CES')
                    handlePriorityChange(priorityToggleMap.CES, 'composite')
                  }}
                >
                  CES
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>

          <Menu.Item>
            <Dropdown text={`Score Type: ${priorityDataConfig.scoreType}`} className="capitalize">
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handlePriorityChange(priorityToggleMap[selectedPriority] || '', 'composite')}
                >
                  Composite
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handlePriorityChange('', 'individual')}>
                  Individual
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>

          {priorityDataConfig.scoreType === 'individual' && selectedPriority && (
            <Segment>
              <Header as="h4" dividing>
                SubIndicators
              </Header>
              <Grid columns={3} stackable>
                {Object.entries(priorityDataConfig.subIndicators[selectedPriority] || {}).map(
                  ([subKey, subValue], index) => (
                    <Grid.Column key={subKey}>
                      <Form.Checkbox
                        label={configIndicatorLabels[subKey as keyof typeof configIndicatorLabels] || subKey}
                        checked={!!subValue}
                        onChange={() => handlePriorityChange(selectedPriority, '', subKey)}
                      />
                      {/* Add a Divider after every row of three */}
                      {(index + 1) % 3 === 0 && <Divider hidden />}
                    </Grid.Column>
                  ),
                )}
              </Grid>
            </Segment>
          )}
          <Menu.Item>
            <Dropdown text="Census Indicators" className="capitalize">
              <Dropdown.Menu onClick={(e: Event) => e.stopPropagation()}>
                {Object.entries(priorityDataConfig.census || {}).map(([subKey, subValue], index) => (
                  <Dropdown.Item>
                    <Form.Checkbox
                      label={configIndicatorLabels[subKey as keyof typeof configIndicatorLabels] || subKey}
                      checked={!!subValue}
                      onChange={() => handlePriorityChange('census', '', subKey)}
                    />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  )
}

export default ConfigurationPanel
