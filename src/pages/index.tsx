// import { Leaf } from 'lucide-react'
import counties from '@public/jurisdictions.json'
import Head from 'next/head'

import Footer from '@components/common/Footer'
import HomeNavBar from '@components/common/HomeNavBar'
import MapSelector from '@components/common/MapSelector'

// import { AppConfig } from '@lib/AppConfig'
import About from './about'
import Contact from './contact'
import Data from './data'
import Default from './default'
import Instructions from './instructions'

const Home = ({
  currentView,
  setCurrentView,
}: {
  currentView: string
  setCurrentView: (view: string) => void
}) => {
  const renderView = () => {
    switch (currentView) {
      case 'default':
        return <Default setCurrentView={setCurrentView} />
      case 'instructions':
        return <Instructions />
      case 'about':
        return <About />
      case 'data':
        return <Data />
      case 'contact':
        return <Contact />
      default:
        return <Default setCurrentView={setCurrentView} />
    }
  }
  return (
    <div className="min-h-screen">
      <div className="flex-grow">
        <Head>
          <title>EV Equity Roadmap</title>
          <meta property="og:title" content="EV Equity Roadmap" key="title" />
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <section className="homepage-background">
          <HomeNavBar setCurrentView={setCurrentView} />
          <section className="flex">
            <div className="w-1/2 mx-2">
              <section className="homepage-panel homepage-card">
                <h1 className="homepage-header">Select a jurisdiction</h1>
                <MapSelector isVertical />
                <p className="my-2">Map data are currently available for all of California except:</p>
                <ul className="ml-6 list-disc">
                  {counties
                    .filter(({ available }) => !available)
                    .map(({ id, name }) => (
                      <li key={id}>{name}</li>
                    ))}
                </ul>
                <p className="my-2">
                  Grid capacity data are currently only available for areas served by Los Angeles Department
                  of Water & Power, Pacific Gas & Electric, San Diego Gas & Electric, and Southern California
                  Edison.
                </p>
              </section>
            </div>
            <div className="w-1/2 mx-2">
              <section className="homepage-panel homepage-card">{renderView()}</section>
            </div>
          </section>
          <section className="homepage-card mx-2">
            <h1 className="homepage-header">Coming soon</h1>
            <p className="mb-2">
              We are regularly updating the tool to add more jurisdictions, refine data, and improve
              performance. In Winter 2024-25, we are incorporating federal environmental justice criteria,
              select demographic data, and remaining California jurisdictions in PG&E, SCE, LADWP, and SDG&E
              service territories. In 2025, we aim to expand to areas inside and beyond California, subject to
              electric grid capacity data availability.
            </p>
          </section>
        </section>
        <Footer setCurrentView={setCurrentView} />
      </div>
    </div>
  )
}

export default Home
