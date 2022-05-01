import { getPlaces } from "../api/api";
import { Address } from "../shared/shareddtypes";
import { calculateCoordinates } from "./ComputeDistanceHelper";

type PickupLocation = {
  lat: number;
  lon: number;
  name: string;
  street_address: Address;
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

  const places = await getPlaces(x, y, radiusMeters, 10);
  places.features.forEach((feature: any) => {
    locations.push({
      lat: feature.geometry.coordinates[0],
      lon: feature.geometry.coordinates[1],
      name: feature.properties.name,
      street_address: {
        street: feature.properties.street,
        postalCode: feature.properties.postcode,
        locality: feature.properties.city,
        region: feature.properties.county,
      },
    });
  });

  return locations;
}
