// import { State, County, City } from "../../types/jurisdictions"

export const makeCityConfig = (county: string, city: string) => {
  if (county === 'san_francisco') {
    county += '_county'
  }
  // Changed to testing for testing branch
  const base = `https://ev-map-2.s3.amazonaws.com/testing/${county}/${city}/${city}`

  return {
    city,
    county,
    boundaryUrl: `${base}_city_boundary.geojson`,
    priorityDataUrl: `${base}_priority.json`,
    feasibleDataUrl: `${base}_feasibility.json`,
    transitStopsUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_transit.geojson`,
    parksAndRecreationUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_parks/${county}_parks.geojson`,
    healthcareFacilitiesUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_healthcare.geojson`,
    lihtcUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_lihtc.geojson`,
    schoolsUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_schools.geojson`,
    libraryUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_libraries.geojson`,
    l2chargersUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_l2/${county}_l2.geojson`,
    dcfchargersUrl: `https://ev-map-2.s3.amazonaws.com/CA/Co-location_points/CA_dcf/${county}_dcf.geojson`,
  }
}
