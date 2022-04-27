import { Address } from "../shared/shareddtypes";

const fromCoords: String = "43.35513026876176, -5.851290035687373"; //Coordinates of EII

export type ShippingMethodType = {
  title: string;
  subtitle: string;
  price: number;
};

export async function obtainShippingMethods(
  destAddress: Address
): Promise<ShippingMethodType[]> {
  // We obtain the coordinates from the address
  let stringAddress =
    destAddress.street +
    ", " +
    destAddress.postalCode +
    ", " +
    destAddress.locality +
    ", " +
    destAddress.region;
  let coords = await getCoordinatesFromAddress(stringAddress);
  // We compute the total distance that the package has to travel
  let distance = await getDistanceDriving(coords);

  // We return the different shipping methods and the costs for each of them
  return [
    {
      title: "Correos",
      subtitle: "The fastest shipping method we have!",
      price: Math.round(distance * 2 * 100) / 100,
    },
    {
      title: "Pick UP",
      subtitle: "The cheapest method on earth!",
      price: 0,
    },
  ];
}

export const showMapRoute = async (destCoords: String) => {
  let map = await getRouteImage(destCoords);
  const url = URL.createObjectURL(map);

  return url;
};

export const getCoordinatesFromAddress = async (address: String) => {
  let coords = await calculateCoordinates(address);

  let lat = coords.features[0].geometry.coordinates[1];
  let lon = coords.features[0].geometry.coordinates[0];

  return lat + "," + lon; //e.g 36.23423,-5.23423
};

export function calculateCoordinates(address: String) {
  const axios = require("axios");

  return axios
    .get(
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        address +
        ".json?access_token=" +
        process.env.REACT_APP_MAPBOX_KEY
    )
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      return error;
    });
}

function getDistanceDriving(destCoords: String) {
  const axios = require("axios");

  return axios
    .get(
      "https://dev.virtualearth.net/REST/V1/Routes?wp.0=" +
        fromCoords +
        "&wp.1=" +
        destCoords +
        "&key=" +
        process.env.REACT_APP_BING_KEY
    )
    .then((response: any) => {
      return response.data.resourceSets[0].resources[0].travelDistance;
    });
}

function getRouteImage(destCoords: String) {
  const axios = require("axios");

  return axios
    .get(
      "https://dev.virtualearth.net/REST/V1/Imagery/Map/Road/Routes?wp.0=" +
        fromCoords +
        "&wp.1=" +
        destCoords +
        "&key=" +
        process.env.REACT_APP_BING_KEY,
      { responseType: "blob" }
    )
    .then((response: any) => {
      return response.data;
    });
}
