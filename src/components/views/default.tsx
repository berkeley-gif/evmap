// import { Compass, Home } from 'lucide-react'
// import { AppConfig, MapSelectorVariant } from '@lib/AppConfig'
import { Icon } from 'semantic-ui-react'

import { openInNewWindow } from '@src/utils/openInNewWindow'

import NavBarProps from '@lib/NavBarProps'

const Default: React.FC<NavBarProps> = ({ setCurrentView }) => (
  <>
    <h1 className="homepage-header">Welcome</h1>
    <p className="mb-4">
      This tool is a free, open-access platform to inform local government and stakeholder decision making on
      EV and mobility infrastructure investments.
    </p>
    <p className="mb-4">
      Users can identify &ldquo;priority&rdquo; and &ldquo;feasibility&rdquo; zones within a jurisdiction by
      integrating multiple data sets into color-coded 100x100 meter pixels, overlaid on the city or county
      map.
    </p>
    <p>Users can:</p>
    <ul className="list-disc pl-6 mb-4">
      <li>
        Modulate the criteria as appropriate to the jurisdiction to identify areas of highest priority for
        public policy and investment priority
      </li>
      <li>
        Add co-location points to identify community resources where mobility investment should be most
        desirable within a high-priority zone
      </li>
      <li>
        Download a snapshot of their selections and highlighted coordinates to share with stakeholders and
        decision makers
      </li>
    </ul>
    <p className="mb-4">
      For detailed user instructions, see
      <button
        onClick={() => openInNewWindow('instructions', 'How to Use')}
        className="mx-1 bg-transparent border-none text-primary underline cursor-pointer"
        type="button"
      >
        {/* How to Use */}
        How to Use
        <span className="superscript">
          <Icon fitted size="small" disabled name="external alternate" />
        </span>
      </button>
      . For more information on data and sources, see
      <button
        onClick={() => setCurrentView('about')}
        className="mx-1 bg-transparent border-none text-primary underline cursor-pointer"
        type="button"
      >
        Data
      </button>
      .
    </p>
    <p className="mb-4">
      To use the tool, select a county and then a city (or unincorporated areas) from the drop-down menus to
      the left.
    </p>
    {/* <MapSelector /> */}
  </>
)

export default Default
