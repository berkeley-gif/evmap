import useMapContext from '@map/useMapContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Dimmer, Loader, Modal } from 'semantic-ui-react'

import NavBar from '@components/common/NavBar'

import NavBarProps from '@lib/NavBarProps'

import MapSelector from '../common/MapSelector'
import LatLngLogo from './LatLngLogo'

const MapNavBar: React.FC<NavBarProps> = ({ setCurrentView: propSetCurrentView }) => {
  const mapContext = useMapContext()
  const setCurrentView = propSetCurrentView ?? mapContext.setCurrentView
  const [openJurisdiction, setOpenJurisdiction] = useState(false)
  const [errorState, setErrorState] = useState(false)
  const [loading, setLoading] = useState(false)
  const startLoading = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  const router = useRouter()
  const { cityConfig = {} } = useMapContext()
  const isMapPage = router.pathname.startsWith('/map')
  // const handleLoadClick = () => {
  //   // setDummyVar((prevState) => !prevState)
  //   setOpenJurisdiction(false)
  // }
  useEffect(() => {
    if (!cityConfig || Object.keys(cityConfig).length === 0) {
      setErrorState(true)
    } else {
      setErrorState(false)
    }
  }, [cityConfig])

  return (
    <div
      className="h-20 absolute w-full left-0 top-0 p-3 shadow bg-dark flex items-center"
      style={{ zIndex: 1000 }}
    >
      <div className="flex justify-between w-full items-center">
        <LatLngLogo />
        <div className="flex-grow" />
        {/* {errorState && (
          <div className="flex items-center text-error font-bold mr-3">
            <p>Error: Map not loaded, please select a jurisdiction</p>
          </div>
        )} */}
        <NavBar setCurrentView={setCurrentView} />
        <div className="flex-grow" />
        <Modal
          open={openJurisdiction}
          onClose={() => setOpenJurisdiction(false)}
          onOpen={() => setOpenJurisdiction(true)}
          trigger={
            <Button onClick={() => setOpenJurisdiction(true)} className={errorState ? 'glow-effect' : ''}>
              Select New Jurisdiction
            </Button>
          }
        >
          <Modal.Header>Select Jurisdiction</Modal.Header>
          <Modal.Content>
            <MapSelector startLoading={startLoading} />
            {loading && isMapPage && (
              <Dimmer active>
                <Loader />
              </Dimmer>
              // <Loader active size='medium' inline='centered' className='custom-loader' />
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button className="bg-primary text-white" onClick={() => setOpenJurisdiction(false)} negative>
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    </div>
    // </div>
  )
}

export default MapNavBar
