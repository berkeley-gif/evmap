import { Button, Icon, Modal } from 'semantic-ui-react'

import { openInNewWindow } from '../../utils/openInNewWindow'

const NoInfoSection = () => (
  <>
    <p className="text-base mb-2">Refreshing the page will clear the currently selected jurisdiction.</p>
    <p className="text-base mb-4">
      Click the &quot;Select New Jurisdiction&quot; button to select a new jurisdiction for the map page.
    </p>
  </>
)
const formatText = (text: string) =>
  text
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace('Un ', 'Unincorporated ')
const InfoSection = ({
  city,
  county,
  setCurrentView,
}: {
  city: string
  county: string
  setCurrentView: (view: string) => void
}) => (
  <>
    <p className="text-base mb-2">
      You are viewing the EV Equity Roadmap Tool for <b>{formatText(city)} </b>
      in <b>{formatText(county)}</b>, California.
    </p>
    <p className="text-base font-bold underline">
      Please give the map a moment to load all data layers before you begin.
    </p>
    <p className="text-base mb-4">
      Adjust priority and feasibility layers and introduce co-location points via the sliders and toggles in
      the left-hand sidebar. Hover and click on individual layer names and click the{' '}
      <Icon disabled name="info circle" /> buttons for more information on the layers and data sources.
    </p>
    <p className="text-base mb-4">
      For detailed user instructions, see
      <button
        type="button"
        // onClick={() => setCurrentView('instructions')}
        onClick={() => openInNewWindow('/instructions', 'How to Use')}
        className="inline-link hover:underline ml-1"
      >
        {/* How to Use */}
        How to Use
        <span className="superscript">
          <Icon fitted size="small" disabled name="external alternate" />
        </span>
      </button>
      .
    </p>
  </>
)

const WelcomeModal = ({
  openModal,
  dispatch,
  city,
  county,
  setCurrentView,
}: {
  openModal: boolean
  dispatch: React.Dispatch<{
    type: 'SET_FIELD'
    field: 'openWelcomeModal'
    payload: boolean
  }>
  city: string
  county: string
  setCurrentView: (view: string) => void
}) => (
  <Modal
    open={openModal}
    onClose={() => dispatch({ type: 'SET_FIELD', field: 'openWelcomeModal', payload: false })}
  >
    <Modal.Header>Welcome to the map page!</Modal.Header>
    <Modal.Content>
      {city && county ? (
        <InfoSection city={city} county={county} setCurrentView={setCurrentView} />
      ) : (
        <NoInfoSection />
      )}
      <p className="text-base mb-4">
        Right-click anywhere on the map to pull up the coordinates for the spot clicked.
      </p>
    </Modal.Content>
    <Modal.Actions>
      <Button
        className="bg-primary text-white"
        onClick={() => dispatch({ type: 'SET_FIELD', field: 'openWelcomeModal', payload: false })}
        positive
      >
        Close
      </Button>
    </Modal.Actions>
  </Modal>
)
export default WelcomeModal
