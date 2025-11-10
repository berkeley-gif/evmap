import MapContextProvider from '@map/MapContextProvider'
import 'leaflet/dist/leaflet.css'
import type { AppProps } from 'next/app'
import { Catamaran } from 'next/font/google'
import Head from 'next/head'
import 'semantic-ui-css/semantic.min.css'

import MobileWarningModal from '@components/common/MobileWarning'

import '@src/globals.css'

const catamaran = Catamaran({
  subsets: ['latin'],
  variable: '--font-catamaran',
})

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <title>EV Equity Roadmap</title>
      <meta property="og:title" content="EV Equity Roadmap" key="title" />
      <meta name="description" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={`${catamaran.variable} font-sans text-base`}>
      <MobileWarningModal />
      <MapContextProvider>
        {/* <Component {...pageProps} currentView={currentView} setCurrentView={handleSetViewAndRoute} /> */}
        <Component {...pageProps} />
      </MapContextProvider>
    </main>
  </>
)

export default App
