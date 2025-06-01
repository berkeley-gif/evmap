import { Icon } from 'semantic-ui-react'

import NavBarProps from '@lib/NavBarProps'

import { openInNewWindow } from '../../utils/openInNewWindow'

const NavBar: React.FC<NavBarProps> = ({ setCurrentView }) => (
  <div className="flex space-x-4 text-white items-end">
    <button
      type="button"
      onClick={() => setCurrentView('home')}
      className="cursor-pointer bg-transparent border-none p-0 "
    >
      Home
    </button>
    {/* <span>|</span> */}
    {/* <button
      type="button"
      onClick={() => setCurrentView('instructions')}
      className="cursor-pointer bg-transparent border-none p-0 "
    >
      How to Use
    </button> */}
    <span>|</span>

    <button
      type="button"
      onClick={() => setCurrentView('about')}
      className="cursor-pointer bg-transparent border-none p-0 "
    >
      About
    </button>
    <span>|</span>
    <button
      type="button"
      onClick={() => setCurrentView('contact')}
      className="cursor-pointer bg-transparent border-none p-0 "
    >
      Contact
    </button>
    <span>|</span>
    <button
      type="button"
      onClick={() => openInNewWindow('/data', 'Data Sources')}
      className="cursor-pointer bg-transparent border-none p-0 flex items-center"
      aria-label="Open 'Data' information in a new window"
    >
      Data
      <span className="relative ml-1">
        <Icon
          fitted
          size="small"
          disabled
          name="external alternate"
          className="absolute top-[-1em] text-xs"
        />
      </span>
    </button>
    <span>|</span>
    <button
      onClick={() => openInNewWindow('/instructions', 'How to Use')}
      className="cursor-pointer bg-transparent border-none p-0 flex items-center"
      type="button"
      aria-label="Open 'How to Use' instructions in a new window"
    >
      How to Use
      <span className="relative ml-1">
        <Icon
          fitted
          size="small"
          disabled
          name="external alternate"
          className="absolute top-[-1em] text-xs"
        />
      </span>
    </button>
    {/* <a
      // href="/instructions"
      // rel="noopener noreferrer"
      onClick={() => openInNewWindow('/instructions')}
      className="cursor-pointer bg-transparent border-none p-0 "
    >
      How to Use
      <span className="superscript">
        <Icon fitted size="small" disabled name="external alternate" />
      </span>
    </a> */}
  </div>
)

export default NavBar
