import { Address } from "../shared/shareddtypes";

const fromCoords: String = "43.35513026876176, -5.851290035687373"; //Coordinates of EII
const axios = require("axios");

export type ShippingMethodType = {
  title: string;
  subtitle: string;
  price: string;
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
      title: "Standard shipping",
      subtitle: "The fastest shipping method we have!",
      price: "Select",
    },
    {
      title: "Pick UP",
      subtitle: "The cheapest method on earth!",
      price: "0 €",
    },
  ];
}

export const showMapRoute = async (destCoords: String) => {
  let map = await getRouteImage(destCoords);
  const url = URL.createObjectURL(map);

  return url;
};

export const getCoordinatesFromAddress = async (address: String) => {
  let coords = (await calculateCoordinates(address)) as any;

  let lat = coords.features[0].geometry.coordinates[1];
  let lon = coords.features[0].geometry.coordinates[0];

  return lat + "," + lon; //e.g 36.23423,-5.23423
};

export async function calculateCoordinates(address: String) {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    address +
    ".json?access_token=" +
    process.env.REACT_APP_MAPBOX_KEY;

  let responseFinal;

  await fetch(url, { method: "GET" })
    .then((response: any) => {
      responseFinal = response.json();
    })
    .catch((error: any) => {
      console.log(error);
    });

  return responseFinal;
}

async function getDistanceDriving(destCoords: String) {
  return await axios
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

async function getRouteImage(destCoords: String) {
  return await axios
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
