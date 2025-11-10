/* eslint-disable import/no-cycle */

/* eslint-disable jsx-a11y/label-has-associated-control */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Divider, Dropdown, Form, Grid, Header, Menu, Segment } from 'semantic-ui-react'

import { PriorityDataConfig } from '@src/types/config'

import { configIndicatorLabels } from '@lib/Constants'

interface ConfigurationPanelProps {
  priorityDataConfig: PriorityDataConfig
  handlePriorityChange: (toggleKey: string, mode: 'composite' | 'individual' | '', subKey?: string) => void
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
    CEJST: 'toggleCEJSTRange',
    EJScreen: 'toggleEJScreenRange',
    CES: 'toggleCiRange',
  }

  const selectPriority = useCallback(
    (key: 'CEJST' | 'EJScreen' | 'CES') => {
      const toggleKey = priorityToggleMap[key] ?? ''
      setSelectedPriority(key)
      handlePriorityChange(toggleKey, key === 'EJScreen' ? 'individual' : 'composite')
    },
    [handlePriorityChange],
  )

  return (
    <div className="config-panel-container">
      <div className="config-panel" ref={panelRef}>
        {/* <div className="config-columns"> */}
        <h2>
          <b>Priority Data</b>
        </h2>
        <Menu vertical className="wide-menu">
          <Menu.Item>
            <Dropdown text={`Priority Type: ${selectedPriority}`}>
              <Dropdown.Menu>
                <Dropdown.Item key="CEJST" onClick={() => selectPriority('CEJST')}>
                  CEJST
                </Dropdown.Item>
                <Dropdown.Item key="EJScreen" onClick={() => selectPriority('EJScreen')}>
                  EJScreen
                </Dropdown.Item>
                <Dropdown.Item key="CES" onClick={() => selectPriority('CES')}>
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

          {priorityDataConfig.scoreType === 'individual' &&
            selectedPriority &&
            priorityDataConfig.subIndicators &&
            (priorityDataConfig.subIndicators[selectedPriority] || {}) && (
              <Segment>
                <Header as="h4" dividing>
                  SubIndicators
                </Header>
                <Grid columns={3} stackable>
                  {Object.entries(priorityDataConfig.subIndicators[selectedPriority] || {}).map(
                    ([subKey, subValue], index) => (
                      <Grid.Column key={subKey}>
                        <Form.Checkbox
                          label={
                            configIndicatorLabels[subKey as keyof typeof configIndicatorLabels] || subKey
                          }
                          checked={!!subValue}
                          onChange={() => handlePriorityChange(selectedPriority, '', subKey)}
                          aria-label={`Toggle ${subKey}`}
                        />
                        {(index + 1) % 3 === 0 && <Divider hidden />}
                      </Grid.Column>
                    ),
                  )}
                </Grid>
              </Segment>
            )}
          <Menu.Item>
            <Dropdown text="Census Indicators" className="capitalize">
              <Dropdown.Menu onClick={(e: React.MouseEvent) => e.nativeEvent.stopImmediatePropagation()}>
                {Object.entries(priorityDataConfig.census || {}).map(([subKey, subValue], index) => (
                  <Dropdown.Item key={subKey}>
                    <Form.Checkbox
                      label={configIndicatorLabels[subKey as keyof typeof configIndicatorLabels] || subKey}
                      checked={!!subValue}
                      onChange={() => handlePriorityChange('census', '', subKey)}
                      aria-label={`Toggle census ${subKey}`}
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
