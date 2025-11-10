import NavBarProps from '@lib/NavBarProps'

import NavBar from './NavBar'

const HomeNavBar: React.FC<NavBarProps> = ({ setCurrentView }) => (
  <nav className="bg-primary" aria-label="Primary site navigation">
    <div className="sm:mx-8 md:mx-12 lg:mx-16">
      <div className="flex justify-between h-16 items-end text-white pt-2 pb-4">
        <h3 className="text-3xl text-justify flex-grow">EV Equity Roadmap</h3>
        <NavBar setCurrentView={setCurrentView} />
      </div>
    </div>
  </nav>
)

export default HomeNavBar
