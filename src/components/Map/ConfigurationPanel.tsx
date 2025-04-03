/* eslint-disable import/no-cycle */

/* eslint-disable jsx-a11y/label-has-associated-control */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react'
import { Divider, Dropdown, Form, Grid, Header, Menu, Segment } from 'semantic-ui-react'

// import { DataConfig } from '.'
import { PriorityDataConfig } from '@pages/map/index'

interface ConfigurationPanelProps {
  priorityDataConfig: PriorityDataConfig
  // feasibleDataConfig: FeasibilityDataConfig
  dispatch: React.Dispatch<{
    // type: 'SET_PRIORITY_DATA_CONFIG' | 'SET_FEASIBLE_DATA_CONFIG'
    type: 'SET_PRIORITY_DATA_CONFIG'
    payload: PriorityDataConfig
  }>
  handlePriorityChange: any
  closePanel: () => void
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  priorityDataConfig,
  // feasibleDataConfig,
  dispatch,
  handlePriorityChange,
  // setPriorityDataConfig,
  // setFeasibleDataConfig,
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
  const subIndicatorLabels = {
    toggleCesOzoneRange: 'Ozone Pollution',
    toggleCesPm25Range: 'PM2.5 Pollution',
    toggleCesDieselPmRange: 'Diesel Particulate Matter',
    toggleCesTrafficRange: 'Traffic Density',
    toggleCesAsthmaRange: 'Asthma Prevalence',
    toggleCesLowBirthWeightRange: 'Low Birth Weight',
    toggleCesCardiovascularDiseaseRange: 'Cardiovascular Disease',
    toggleCesEducationRange: 'Educational Attainment',
    toggleCesLinguisticIsolationRange: 'Linguistic Isolation',
    toggleCesPovertyRange: 'Poverty Rate',
    toggleCesUnemploymentRange: 'Unemployment Rate',
    toggleCesHousingBurdenRange: 'Housing Cost Burden',
    toggleEjScreenOzoneRange: 'Ozone Pollution',
    toggleEjScreenPm25Range: 'PM2.5 Pollution',
    toggleEjScreenDieselPmRange: 'Diesel Particulate Matter',
    toggleEjScreenRseiAirRange: 'Toxic Air Releases (RSEI)',
    toggleEjScreenPtrafRange: 'Proximity to Traffic',
    toggleEjScreenNo2Range: 'Nitrogen Dioxide (NO₂) Pollution',
    toggleCjestDieselExRange: 'Diesel Exposure',
    toggleCjestPm25Range: 'PM2.5 Pollution',
    toggleCjestTrafficRange: 'Traffic Density',
    toggleCjestLowLifeExRange: 'Low Life Expectancy',
    toggleCjestAsthmaRange: 'Asthma Prevalence',
    toggleCjestHeartDisRange: 'Heart Disease Risk',
    toggleCjestHouseBurdRange: 'Housing Burden',
    toggleCjestLingIsoRange: 'Linguistic Isolation',
    toggleCjestEducationRange: 'Educational Attainment',
    toggleCjestLmiRange: 'Low-Moderate Income',
    toggleCjestFpl100Range: 'Below 100% FPL',
    toggleCjestFpl200Range: 'Below 200% FPL',
    toggleCjestUnemploymentRange: 'Unemployment Rate',
  }
  const priorityToggleMap: Record<string, string> = {
    CJEST: 'toggleCJESTRange',
    EJScreen: 'toggleEJScreenRange',
    CES: 'toggleCiRange',
  }
  // const handlePriorityChange = (key: keyof DataConfig) => {
  //   dispatch({
  //     type: 'SET_PRIORITY_DATA_CONFIG',
  //     payload: { ...priorityDataConfig, [key]: !priorityDataConfig[key] },
  //   })
  // }
  // const handlePriorityChange = (key: keyof DataConfig) => {
  //   dispatch({
  //     type: 'SET_PRIORITY_DATA_CONFIG',
  //     payload: Object.fromEntries(
  //       Object.keys(priorityDataConfig).map(k => [k, k === key]) // Only the selected key is true
  //     ) as DataConfig,
  //   })
  // }
  // const handleFeasibleChange = (key: keyof DataConfig) => {
  //   dispatch({
  //     type: 'SET_FEASIBLE_DATA_CONFIG',
  //     payload: { ...feasibleDataConfig, [key]: !feasibleDataConfig[key] },
  //   })
  // }
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
        {/* <div className="config-section">

            <div className="checkbox-column">
              {Object.entries(priorityDataConfig).map(([key, value]) => (
                <label key={key} className="config-item">
                  <input
                    // type="checkbox"
                    type="radio"
                    id={`priority-${key}`}
                    checked={value}
                    name="priority"
                    onChange={() => handlePriorityChange(key as keyof PriorityDataConfig)}
                  />
                  {titlesMap[key as keyof PriorityDataConfig]}
                </label>
              ))}
            </div>
            <div className="checkbox-column">
              <label className="config-item">
                <input
                  type="radio"
                  id="composite"
                  name="scoreType"
                  checked={scoreType === 'composite'}
                  onChange={() => setScoreType('composite')}
                />
                Composite
              </label>
              <label className="config-item">
                <input
                  type="radio"
                  id="individual"
                  name="analysisType"
                  checked={scoreType === 'individual'}
                  onChange={() => setScoreType('individual')}
                />
                Individual
              </label>
            </div>
          </div> */}
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
                      <Form.Radio
                        label={subIndicatorLabels[subKey as keyof typeof subIndicatorLabels] || subKey}
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
        </Menu>
        {/* <div className="config-section"> */}
        {/* First Column: Priority Selection */}
        {/* <div className="checkbox-column">
              <label className="config-item">
                <input
                  type="radio"
                  id="priority-CJEST"
                  name="priority"
                  checked={selectedPriority === "CJEST"}
                  onChange={() => {
                    setSelectedPriority("CJEST")
                    handlePriorityChange("CJEST")
                  }}
                />
                CJEST Percentile
              </label>

              <label className="config-item">
                <input
                  type="radio"
                  id="priority-EJScreen"
                  name="priority"
                  checked={selectedPriority === "EJScreen"}
                  onChange={() => {
                    setSelectedPriority("EJScreen")
                    handlePriorityChange("EJScreen")
                  }}
                />
                EJScreen Percentile
              </label>

              <label className="config-item">
                <input
                  type="radio"
                  id="priority-CES"
                  name="priority"
                  checked={selectedPriority === "CES"}
                  onChange={() => {
                    setSelectedPriority("CES")
                    handlePriorityChange("CES")
                  }}
                />
                CES Percentile
              </label>
            </div>

            {/* Second Column: Score Type Selection */}
        {/* <div className="checkbox-column">
              <label className="config-item">
                <input
                  type="radio"
                  id="composite"
                  name="scoreType"
                  checked={priorityDataConfig.scoreType === 'composite'}
                  onChange={() => handlePriorityChange("", "composite")}
                />
                Composite
              </label>
              <label className="config-item">
                <input
                  type="radio"
                  id="individual"
                  name="scoreType"
                  checked={priorityDataConfig.scoreType === 'individual'}
                  onChange={() => handlePriorityChange("", "individual")}
                />
                Individual
              </label>
            </div> */}

        {/* Third Column: SubIndicators (Only show if Individual is selected) */}
        {/* {priorityDataConfig.scoreType === "individual" && (
              <div className="checkbox-column">
                {Object.entries(priorityDataConfig.subIndicators[selectedPriority] || {}).map(([subKey, subValue]) => (
                  <label key={subKey} className="config-item">
                    <input
                      type="checkbox"
                      id={`subIndicator-${subKey}`}
                      checked={subValue}
                      onChange={() => handlePriorityChange(selectedPriority, subKey)}
                    />
                    {subKey}
                  </label>
                ))}
              </div>
            )}
          </div> */}
        {/* <div className="config-section">
            <h2>
              <b>Feasibility Data</b>
            </h2>
            <div className="checkbox-column">
              {Object.entries(feasibleDataConfig).map(([key, value]) => (
                <label key={key} className="config-item">
                  <input
                    type="checkbox"
                    id={`feasible-${key}`}
                    checked={value}
                    onChange={() => handleFeasibleChange(key as keyof DataConfig)}
                  />
                  {titlesMap[key as keyof DataConfig]}
                </label>
              ))}
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  )
}

export default ConfigurationPanel
