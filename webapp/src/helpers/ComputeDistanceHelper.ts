import { getPlaces } from "../api/api";

const fromCoords: String = "43.35513026876176, -5.851290035687373"; //Coordinates of EII

export const calculateShippingCosts = async (destAddress: String) => {
  let distance = await getDistanceDriving(destAddress);

  let costs = Math.round(distance * 2 * 100) / 100; // 2 euros per km

  return costs;
};

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

function calculateCoordinates(address: String) {
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

export async function getNearByPlaces(address: String, radiusMeters: number, maxResults: number) {
  let coords = await calculateCoordinates(address);
  const x = coords.features[0].geometry.coordinates[0];
  const y = coords.features[0].geometry.coordinates[1];

  const places = await getPlaces(x, y, radiusMeters, maxResults);
  console.log(places);
}
