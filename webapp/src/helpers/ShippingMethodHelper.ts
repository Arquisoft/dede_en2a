import { getPlaces } from "../api/api";
import { calculateCoordinates } from "./ComputeDistanceHelper";

type PickupLocation = {
  lat: number;
  lon: number;
  name: string;
};

export async function getPickUpPlacesNearby(
  address: String,
  radiusMeters: number,
  maxResults: number
) {
  let locations: PickupLocation[] = [];
  const coords = await calculateCoordinates(address);
  const x = coords.features[0].geometry.coordinates[0];
  const y = coords.features[0].geometry.coordinates[1];

  const places = await getPlaces(x, y, radiusMeters, maxResults);
  places.features.forEach((feature: any) =>
    locations.push({
      lat: feature.geometry.coordinates[0],
      lon: feature.geometry.coordinates[1],
      name: feature.properties.formatted,
    })
  );

  return locations;
}
