import { useState } from 'react'
import { Icon, Table } from 'semantic-ui-react'

const AutoLink = ({ url }: { url: string }) => (
  <a className="text-primary underline break-all" target="blank" href={url}>
    {url}
  </a>
)

const Data = () => {
  const [tableState, setTableState] = useState([
    { id: 0, active: false },
    { id: 1, active: false },
    { id: 2, active: false },
    { id: 3, active: false },
    { id: 4, active: false },
    { id: 5, active: false },
    { id: 6, active: false },
    { id: 7, active: false },
    { id: 8, active: false },
  ])

  const toggleTable = (id: number) => {
    setTableState(prev => prev.map(table => (table.id === id ? { ...table, active: !table.active } : table)))
  }

  return (
    <div className="m-5">
      <h1 className="homepage-header">Data Sources and Descriptions</h1>
      <Table key={0} style={{ margin: 0 }}>
        <Table.Header onClick={() => toggleTable(0)} style={{ cursor: 'pointer' }}>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              Jurisdiction Boundary Files
              <Icon name={tableState[0].active ? 'caret down' : 'caret right'} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {tableState[0].active && (
          <Table.Body>
            <Table.Row>
              <Table.Cell className="left-column">
                US Census Bureau TIGER Line California County Shapefile
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: This data set allows the tool to define criteria by county (58 in
                  California).
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://www2.census.gov/geo/tiger/TIGER2023/" />.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">
                US Census Bureau TIGER Line California Place Shapefile
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: This data set allows the tool to define criteria by areas within a
                  county for user viewing. (We’ve included 481 cities as well as a selection of 14
                  census-designated areas across three rural counties that do not contain any incorporated
                  cities to ensure some jurisdictions capable of analysis through our tool in each county).
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://www2.census.gov/geo/tiger/TIGER2023/PLACE/" />
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>

      <Table key={1} style={{ margin: 0 }}>
        <Table.Header onClick={() => toggleTable(1)} style={{ cursor: 'pointer' }}>
          <Table.Row>
            <Table.HeaderCell colspan="2">
              Electric Utility Circuit Line Load Capacity Files
              <Icon name={tableState[1].active ? 'caret down' : 'caret right'} />
              {tableState[1].active && (
                <p className="text-base italic">
                  Note: ICA maps represent a range of utility assessments and estimates of capacity at a point
                  in time. Feasibility pixels do not necessarily show exact capacity available at the present
                  date.
                </p>
              )}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {tableState[1].active && (
          <Table.Body>
            <Table.Row>
              <Table.Cell className="left-column">
                Pacific Gas & Electric (PG&E) Load Capacity Data
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: PG&E’s load capacity map from their Integration Capacity Analysis Map
                  shows distribution line capacity potentially available for new interconnection. The load
                  capacity is given kilowatts and is represented as line data.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://www.pge.com/b2b/distribution-resource-planning/integration-capacity-map.shtml" />
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">
                Southern California Edison (SCE) Load Capacity Data
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: SCE’s load capacity map from their Distributed Resource Planning
                  External Portal shows distribution line capacity potentially available for new
                  interconnection. Load capacity is given in megawatts (we convert to kilowatts) and is
                  represented as line data.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://drpep.sce.com/drpep/" />.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">
                San Diego Gas & Electric (SDG&E) Load Capacity Data
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: SDG&E’s load capacity map from their Integration Capacity Analysis Map
                  shows distribution line capacity potentially available for new interconnection. Load
                  capacity is given in kilowatts and is represented as polygon data.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://icm-api-explorer.sdge.com/datasets/b5e555b96d974256b8d0da77797ea3cd/explore?location=32.921159%2C-117.195983%2C14.46" />
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">
                Los Angeles Department of Water and Power (LADWP) Capacity Data
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: LADWP’s load capacity map from their Integration Capacity Analysis Map
                  shows distribution line capacity potentially available for new interconnection. The load
                  capacity grouped circuit lines into kilowatt capacity ranges. We show the lowest value of
                  the range. Represented as line data.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://ladwp-power.maps.arcgis.com/apps/webappviewer/index.html?id=290be9aa52694ef39bf3088940079f62" />
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>

      <Table key={2} style={{ margin: 0 }}>
        <Table.Header onClick={() => toggleTable(2)} style={{ cursor: 'pointer' }}>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              Federal Funding Sources
              <Icon name={tableState[2].active ? 'caret down' : 'caret right'} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {tableState[2].active && (
          <Table.Body>
            <Table.Row>
              <Table.Cell className="left-column">IRS 30C tax credit eligible communities</Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: The Section 30C tax credit is available to developers of public EV
                  charging stations located in federally defined low-income and rural communities.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://experience.arcgis.com/experience/3f67d5e82dc64d1589714d5499196d4f/page/Page" />
                  .
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">
                National Electric Vehicle Infrastructure (NEVI) program eligible corridors
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: The NEVI program provides federal grant funding for public EV charging
                  along highway corridors.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://experience.arcgis.com/experience/135c0da4b70f4717b4664ad2e427d2bc" />
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>

      <Table key={3} style={{ margin: 0 }}>
        <Table.Header onClick={() => toggleTable(3)} style={{ cursor: 'pointer' }}>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              Environmental Indicators
              <Icon name={tableState[3].active ? 'caret down' : 'caret right'} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {tableState[3].active && (
          <Table.Body>
            <Table.Row>
              <Table.Cell className="left-column">CalEnviroScreen 4.0</Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: CalEnviroScreen is California’s community environmental health screening
                  tool. Composite scores are aggregates of 13 “pollution burden” criteria and 8 “population
                  characteristics” criteria, with raw scores compared against statewide averages to develop
                  percentile rankings. We include the composite score as well as the following individual
                  indicators that are relevant to equitable transportation electrification: ozone, PM2.5,
                  diesel PM, traffic, asthma, low birth weight, cardiovascular disease, education, linguistic
                  isolation, poverty, unemployment, and housing burden. All data are formulated in percentile
                  rankings at the census tract scale.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-40" />.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">EJScreen</Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: EJScreen was a US EPA environmental justice screening tool. We include
                  the following individual criteria relevant to equitable transportation electrification:
                  PM2.5, ozone, diesel PM, nitrogen dioxide, toxic air pollutant exposure, and traffic
                  proximity. All data are formulated in percentile rankings at the census tract scale.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/JISNPL" />
                  .
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">
                Climate and Economic Justice Screening Tool (CEJST)
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: CEJST was a federal screening tool for equity in climate infrastructure
                  investments. We include the following individual criteria relevant to equitable
                  transportation electrification: disadvantaged community percentile, PM2.5, diesel PM,
                  traffic, low life expectancy, asthma, heart disease, education, linguistic isolation,
                  unemployment, housing burden, low median household income as a percent of area median
                  income, percent of individuals &lt;100% Federal Poverty Line, and percent of individuals
                  &lt;200% Federal Poverty Line. All data are formulated in percentile rankings at the census
                  tract scale.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/B6ULET" />
                  .
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>
      <Table key={4} style={{ margin: 0 }}>
        <Table.Header onClick={() => toggleTable(4)} style={{ cursor: 'pointer' }}>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              Co-Location Points
              <Icon name={tableState[4].active ? 'caret down' : 'caret right'} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {tableState[4].active && (
          <Table.Body>
            <Table.Row>
              <Table.Cell className="left-column">Parks</Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: The map of public parks originates from the Trust for Public Lands U.S.
                  ParkServe Dataset. We include city and county parks (which are often located in and adjacent
                  to residential/commercial zones and may be strong candidates for community mobility hubs)
                  but exclude state and national parks (which are more often destination attractions).
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://www.tpl.org/park-data-downloads" />.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">Public libraries</Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: The map of public libraries originates from data collected by the
                  Institute of Museum and Library Services (IMLS) Public Libraries Survey. These may be strong
                  candidates for community mobility hubs.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://cal.maps.arcgis.com/apps/mapviewer/index.html?layers=3ffd687f39f14a48b9905585aa5fdaeb" />
                  &nbsp;(annual updates at
                  <AutoLink url="https://www.imls.gov/research-evaluation/surveys/public-libraries-survey-pls" />
                  ).
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">Public schools</Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  Source: 2021-2022 point locations of public elementary and secondary schools created by the
                  National Center for Education Statistics&apos; (NCES) Education Demographic and Geographic
                  Estimates (EDGE) program. These may be strong candidates for community mobility hubs.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://www.arcgis.com/home/item.html?id=bb54cfd626b74fb695cf8534b5f97c12" />
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">
                Low Income Housing Tax Credit eligible properties
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  Source: The US Department of Housing and Urban Development (HUD)Low-Income Housing Tax
                  Credit (LIHTC) is available to multifamily residential properties that meet minimum criteria
                  for affordable rents based on area incomes. This HUD database shows eligible housing units
                  placed in service between 1987 and 2022. These properties are more likely to be home to
                  residents in need of public EV charging access.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://catalog.data.gov/dataset/low-income-housing-tax-credit-lihtc-properties/resource/6a00050c-0143-4636-866c-18eeed7b1a3a" />
                  &nbsp;(map), <AutoLink url="https://www.huduser.gov/lihtc/" /> (direct data set).
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">Hospitals</Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: Hospital data from the DHS’s Homeland Infrastructure Foundation Level
                  Data (HIFLD) Open Data. These may be strong candidates for community mobility hubs.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://www.arcgis.com/apps/mapviewer/index.html?layers=9e318142490c4884bf74932af437c6c2" />
                  .
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>

      <Table key={5} style={{ margin: 0 }}>
        <Table.Header onClick={() => toggleTable(5)} style={{ cursor: 'pointer' }}>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              Transit
              <Icon name={tableState[5].active ? 'caret down' : 'caret right'} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {tableState[5].active && (
          <Table.Body>
            <Table.Row>
              <Table.Cell className="left-column">
                Transit data is composed of California commuter rail systems including BART, CalTrain,
                LAMetro, Metro Link, Capital Corridor, Coaster, ACE, and SMART. These stations may be strong
                candidates for community mobility hubs.
              </Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  BART: <AutoLink url="https://www.bart.gov/schedules/developers/geo" /> (from the KML file).
                </p>
                <p>
                  Capitol Corridor, Metro Link, Caltrain, Coaster, and ACE:&nbsp;
                  <AutoLink url="https://sandbox.data.ca.gov/dataset/california-rail-stations." /> Capitol
                  Corridor and Metro Link rail stations were incomplete in this data set, so some stations
                  were added by hand.
                </p>
                <p>
                  LA Metro: <AutoLink url="https://developer.metro.net/gis-data/" /> (from the All Rail
                  Stations Combined zip file).
                </p>
                <p>
                  SMART: we obtained a copy of the SMART line shapefile by contacting SMART&apos;s Assistant
                  Planner.
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>
      <Table key={6} style={{ margin: 0 }}>
        <Table.Header onClick={() => toggleTable(6)} style={{ cursor: 'pointer' }}>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              Census Data, American Community Survey (ACS)
              <Icon name={tableState[6].active ? 'caret down' : 'caret right'} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {tableState[6].active && (
          <Table.Body>
            <Table.Row>
              <Table.Cell className="left-column">Non-white population</Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: We used the 2021 5-year estimate ACS Demographic and Housing data set.
                  We divided the number of white residents and by the total population in each tract to
                  formulate a percentage white population, and subtracted this value from 1 to obtain a
                  non-white percentage. With this non-white percentage value for each census tract, we
                  constructed a percentile ranking for all census tracts across California.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://data.census.gov/table/ACSDP5Y2021.DP05?q=ACSDP5Y2021.DP05&g=040XX00US06$1400000" />
                  .
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">Disability characteristics</Table.Cell>
              <Table.Cell className="right-column">
                <p>
                  <i>Description</i>: We used the 2021 5-year estimate ACS Disability Characteristics data set
                  to obtain the disability percentage value. This value represents the percent of the total
                  census tract population that reports as having at least one disability. From here, a
                  percentile ranking of disability percentages for all census tracts across California was
                  constructed.
                </p>
                <p>
                  URL:&nbsp;
                  <AutoLink url="https://data.census.gov/table/ACSST5Y2021.S1810?q=ACSST5Y2021.S1810&g=040XX00US06$1400000" />
                  .
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="left-column">Commute time</Table.Cell>
              {/* Fix me: the below cell is lacking a formula */}
              <Table.Cell>
                <p>
                  <i>Description</i>: We used the 2021 5-year estimate ACS Travel Time To Work data set to
                  build our commute metric. The data shows the number of people who estimate that their
                  commute time fits one of the 12 commute time buckets for each census tract. Next, we
                  calculated a population-weighted average commute time for each census tract. To do so, we
                  took the midpoint of each commute time bucket in minutes, and multiplied it by the number of
                  people estimated in the respective bucket. 90 minutes was used for the largest bucket (90
                  minutes or more) as there is no mid point for this commute bucket. Next, we summed the (mid
                  point commute time * number of people) for each census tract. Lastly, we divided the summed
                  value by the total population of the census tract.
                  <img
                    className="m-auto"
                    src="/images/Commute time formula.png"
                    alt="Commute time formula"
                    width={200}
                    height={130}
                  />
                </p>
                <p>j: indexes the census tract</p>
                <p>i: indexes the commute bucket</p>
                <p>
                  T<span className="subscript">i,j</span>: midpoint of commute bucket in minutes, for commute
                  bucket i in census tract j.
                </p>
                <p>
                  P<span className="subscript">i,j</span>: population associated with commute type i in census
                  tract j.
                </p>
                <p>
                  T<span className="subscript">pw,j</span>: population-weighted commute time for census tract
                  j.
                </p>
                <p> </p>
                <p className="mt-4">
                  URL:&nbsp;
                  <AutoLink url="https://data.census.gov/table/ACSDT5Y2021.B08303?q=ACSDT5Y2021.B08303&g=040XX00US06$1400000" />
                  .
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>

      <Table key={7} style={{ margin: 0 }}>
        <Table.Header onClick={() => toggleTable(7)} style={{ cursor: 'pointer' }}>
          <Table.Row>
            <Table.HeaderCell>
              Jurisdiction
              <Icon name={tableState[7].active ? 'caret down' : 'caret right'} />
            </Table.HeaderCell>
            <Table.HeaderCell>
              Electric Power Provider
              <Icon name={tableState[7].active ? 'caret down' : 'caret right'} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {tableState[7].active && (
          <Table.Body>
            <Table.Row>
              <Table.Cell>Alameda</Table.Cell>
              <Table.Cell>Alameda Municipal Power</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Alpine County (Alpine Village, Markleeville, Mesa Vista, Unincorporated Alpine County)
              </Table.Cell>
              <Table.Cell>Liberty Utilities</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Anaheim</Table.Cell>
              <Table.Cell>City of Anaheim Public Utilities Department</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Avalon</Table.Cell>
              <Table.Cell>Southern California Edison, Clean Power Alliance</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Banning</Table.Cell>
              <Table.Cell>City of Banning Electric Department</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Lassen Municipal Utility District</Table.Cell>
              <Table.Cell>Lassen County (Susanville, Unincorporated Area)</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Big Bear Lake</Table.Cell>
              <Table.Cell>Bear Valley Electric Service</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Burbank</Table.Cell>
              <Table.Cell>Burbank Water & Power</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Carpinteria</Table.Cell>
              <Table.Cell>Southern California Edison Central Coast Community Energy</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Ceres</Table.Cell>
              <Table.Cell>Turlock Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Coachella</Table.Cell>
              <Table.Cell>Imperial Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Del Norte County (Crescent City, Unincorporated Del Norte County)</Table.Cell>
              <Table.Cell>Pacificorp</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Desert Hot Springs</Table.Cell>
              <Table.Cell>Southern California Edison, Desert Community Energy</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Fillmore</Table.Cell>
              <Table.Cell>Southern California Edison, Clean Power Alliance</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Hughson</Table.Cell>
              <Table.Cell>Turlock Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Imperial Beach</Table.Cell>
              <Table.Cell>San Diego Community Power</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Imperial County (Brawley, Calexico, Calipatria El Centro, Holtville, Imperial, Westmorland,
                Unincorporated Imperial County)
              </Table.Cell>
              <Table.Cell>Imperial Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Indio</Table.Cell>
              <Table.Cell>Imperial Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Unincorporated Kings County</Table.Cell>
              <Table.Cell>Eastside Power Authority, et al.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>La Quinta</Table.Cell>
              <Table.Cell>Imperial Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Lassen County (Susanville, Unincorporated Lassen County)</Table.Cell>
              <Table.Cell>
                Plumas-Sierra Rural Electric Cooperative, Lassen Municipal Utility District, Liberty Utilities
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Modesto</Table.Cell>
              <Table.Cell>Modesto Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Modoc County (Alturas, Unincorporated Modoc County)</Table.Cell>
              <Table.Cell>Pacificorp</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Needles</Table.Cell>
              <Table.Cell>City of Needles</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Palo Alto</Table.Cell>
              <Table.Cell>City of Palo Alto</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Pasadena</Table.Cell>
              <Table.Cell>Pasadena Water & Power</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Patterson</Table.Cell>
              <Table.Cell>Turlock Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Port Hueneme</Table.Cell>
              <Table.Cell>Southern California Edison, Clean Power Alliance</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Portola</Table.Cell>
              <Table.Cell>Plumas-Sierra Rural Electric Cooperative, Liberty Utilities</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Unincorporated Plumas County</Table.Cell>
              <Table.Cell>Plumas-Sierra Rural Electric Cooperative, Liberty Utilities</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Redding</Table.Cell>
              <Table.Cell>Redding Electric Utility</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Riverside</Table.Cell>
              <Table.Cell>City of Riverside</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Sacramento County (Citrus Heights, Elk Grove, Folsom, Galt, Isleton, Rancho Cordova,
                Sacramento, Unincorporated Sacramento County)
              </Table.Cell>
              <Table.Cell>Sacramento Municipal Utility District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Santa Clara</Table.Cell>
              <Table.Cell>Silicon Valley Power</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Santa Paula</Table.Cell>
              <Table.Cell>Southern California Edison, Clean Power Alliance</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Shasta Lake</Table.Cell>
              <Table.Cell>City of Shasta Lake</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Sierra County (Loyalton, Unincorporated Sierra County)</Table.Cell>
              <Table.Cell>Plumas-Sierra Rural Electric Cooperative, Liberty Utilities</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Siskiyou County (Dorris, Dunsmuir, Etna, Fort Jones, Montague, Mount Shasta, Tulelake, Weed,
                Yreka, Unincorporated Siskiyou County)
              </Table.Cell>
              <Table.Cell>Pacificorp</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>South Lake Tahoe</Table.Cell>
              <Table.Cell>Liberty Utilities</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Turlock</Table.Cell>
              <Table.Cell>Turlock Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Trinity County (Hayfork, Trinity Junction, Lewiston, Weaverville, Unincorporated Trinity
                County)
              </Table.Cell>
              <Table.Cell>Trinity Public Utilities District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Truckee</Table.Cell>
              <Table.Cell>Truckee Donner Public Utilities District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Waterford</Table.Cell>
              <Table.Cell>Modesto Irrigation District</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Yosemite Valley</Table.Cell>
              <Table.Cell>Pacific Gas & Electric</Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>

      <Table key={8} style={{ margin: 0 }}>
        <Table.Header onClick={() => toggleTable(8)} style={{ cursor: 'pointer' }}>
          <Table.Row>
            <Table.HeaderCell>
              Commute Time Maps
              <Icon name={tableState[8].active ? 'caret down' : 'caret right'} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {tableState[8].active && (
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <p className="text-center text-2xl">Gradient Map of Weighted Average Commute Time</p>
                <p className="text-center text-2xl">San Francisco</p>
                <img className="m-auto" src="/images/SFCommute.png" alt="SF Commute Map" />
                <p>
                  This is a gradient map of the weighted average commute time of census tracts across San
                  Francisco, based on the analysis of ACS data described above.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <p className="text-center text-2xl">Gradient Map of Weighted Average Commute Time</p>
                <p className="text-center text-2xl">Los Angeles</p>
                <img className="m-auto" src="/images/LACommute.png" alt="LA Commute Map" />
                <p>
                  This is a gradient map of the weighted average commute time of census tracts across Los
                  Angeles, based on the analysis of ACS data described above.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <p className="text-center text-2xl">Gradient Map of Weighted Average Commute Time</p>
                <p className="text-center text-2xl">Across California</p>
                <img className="m-auto" src="/images/CACommute.png" alt="California Commute Map" />
                <p>
                  This is a gradient map of the weighted average commute time of census tracts across the
                  state of California, based on the analysis of ACS data described above.
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>
    </div>
  )
}

export default Data
