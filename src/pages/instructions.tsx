import { Icon } from 'semantic-ui-react'

const Instructions = () => (
  <div className="m-5">
    <h1 className="homepage-header">How to use</h1>
    <p className="mb-4">The EV Equity Roadmap tool highlights three types of criteria for users:</p>
    <ol className="list-disc list-inside mb-4">
      <li className="mb-2">
        <b>Priority</b> areas (shown in <b>blue</b> pixels) include environmental justice communities, areas
        with low single-family homeownership, and areas with limited EV charging access.
      </li>
      <li className="mb-2">
        <b>Feasibility</b> areas (shown in <b>gold</b> pixels) have adequate electric grid capacity and are
        eligible for federal EV charging funding.
      </li>
      <li className="mb-2">
        <b>Co-location points</b> (shown via icons) are community hubs and resources.
      </li>
    </ol>
    <p className="mb-1">To use the tool:</p>
    <ol className="list-decimal list-inside mb-4">
      <li className="mb-2">
        Select your <strong>county</strong> and <strong>jurisdiction</strong>.
      </li>
      <li className="mb-2">
        Adjust the <strong>Priority</strong> and <strong>Feasibility</strong> data layers to match your local
        criteria.
        <div className="flex items-center gap-4 mt-4">
          <img src="/images/data1.png" alt="Before control setting" className="h-32 object-contain" />
          <Icon size="large" name="long arrow alternate right" />
          <img src="/images/map1.png" alt="Before map display" className="h-64 object-contain" />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <img src="/images/data2.png" alt="After control setting" className="h-33 object-contain" />
          <Icon size="large" name="long arrow alternate right" />
          <img src="/images/map2.png" alt="After map display" className="h-64 object-contain" />
        </div>
        <ul className="list-disc list-inside mt-2 ml-4">
          <li className="mb-1">
            Adjustments will yield unique combinations of pixels using &ldquo;<strong>AND</strong>&rdquo;
            logic — only pixels that meet all selected criteria will remain on the map.
          </li>
          <li className="mb-1">
            Most sliders adjust up from 0; however, sliders for current EV charging access and EV adoption
            adjust down to 0. This is because areas scoring lowest for these criteria are highest-priority
            from an equity perspective.
          </li>
          <li>
            Hover over layer names and click the <Icon disabled name="info circle" /> buttons for more
            information.
          </li>
        </ul>
      </li>
      <li className="mb-2">
        Select <strong>Co-location Points</strong> to display with your Priority and Feasibility criteria.
      </li>
      <li className="mb-2">
        Scroll or use the <span className="font-bold text-lg">+/-</span> buttons to zoom in on high-priority,
        high-feasibility zones.
      </li>
      <li className="mb-2">
        Right-click on a selected location to show the coordinates for that site. Areas with high
        concentrations or overlap of Priority and Feasibility pixels and Co-Location Points are likely
        candidate zones for investment.
      </li>
    </ol>
  </div>
)

export default Instructions
