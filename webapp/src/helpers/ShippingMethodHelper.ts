import { getPlaces } from "../api/api";
import { calculateCoordinates } from "./ComputeDistanceHelper";

export async function getPickUpPlacesNearby(
  address: String,
  radiusMeters: number,
  maxResults: number
) {
  let coords = calculateCoordinates(address);
  const x = coords.features[0].geometry.coordinates[0];
  const y = coords.features[0].geometry.coordinates[1];

  let locations: { lat: Number; lon: Number }[] = new Array();
  getPlaces(x, y, radiusMeters, maxResults).then((places) => {
    places.features.forEach((feature: any) => {
      locations.push({
        lat: feature.geometry.coordinates[0],
        lon: feature.geometry.coordinates[1],
      });
    });
  });
  return locations;
}
