import json
from pyproj import Transformer

# This function allows the conversion of different coordinate projections
def convert_projection(filename, output_name):
    # change the projection types on this line
    transformer = Transformer.from_crs("EPSG:3310", "EPSG:4326", always_xy=True)
    with open(filename, 'r') as f:
        geojson_data = json.load(f)

    def transform_coordinates(coords):
        if isinstance(coords[0], list): 
            return [transform_coordinates(c) for c in coords]
        else:
            lon, lat = transformer.transform(coords[0], coords[1])
            return [lon, lat]

    for feature in geojson_data['features']:
        geometry = feature['geometry']
        geometry['coordinates'] = transform_coordinates(geometry['coordinates'])

    geojson_data['crs'] = {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84" # if changing the output conversion, change it here as well
        }
    }
    with open(output_name, 'w') as f:
        json.dump(geojson_data, f, indent=2)
