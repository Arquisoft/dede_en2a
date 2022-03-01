import Box from "@mui/material/Box";

const fromCoords: String = "43.35513026876176, -5.851290035687373"; //Coordinates of EII

export const calculateShippingCosts = async (destAddress: String) => {
  let distance = await getDistanceDriving(destAddress);

  let costs = Math.round(distance * 2 * 100) / 100; //2 euros per km

  return costs;
};

export const showMapRoute = async (destCoords: String) => {
  let map = await getRouteImage(destCoords);
  const url = URL.createObjectURL(map);

  return url;
}

export const getCoordinatesFromAddress = async (address: String) => {
  let coords = await calculateCoordinates(address);

  let lat = coords.features[0].geometry.coordinates[1];
  let lon = coords.features[0].geometry.coordinates[0];

  return lat + "," + lon; //e.g 36.23423,-5.23423
}


function calculateCoordinates(address: String) {
    const axios = require("axios");
  
    return axios
      .get("https://api.mapbox.com/geocoding/v5/mapbox.places/" + address +
       ".json?access_token=pk.eyJ1IjoiYWx2YW1pZ2UiLCJhIjoiY2wwOGM2MmVhMDBiMTNjcGhjNWx2NmE4cCJ9.UvE6niHt0R9W3uj-41Gl8g")
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
          "&key=Agy2F1agPvcOjRbB9CegxxYVgRrdDCBXI4eCjQ4yg6XAtdi9IStkytVunOwu7x4-")
      .then((response: any) => {
        return response.data.resourceSets[0].resources[0].travelDistance;
      });
}

function getRouteImage(destCoords: String){
  const axios = require("axios");
  
    return axios
      .get(
        "https://dev.virtualearth.net/REST/V1/Imagery/Map/Road/Routes?wp.0=" +
          fromCoords +
          "&wp.1=" +
          destCoords+
          "&key=Agy2F1agPvcOjRbB9CegxxYVgRrdDCBXI4eCjQ4yg6XAtdi9IStkytVunOwu7x4-",
          {responseType: "blob"}
      )
      .then((response: any) => {
        return response.data;
      });
}

//Use to calculate the distance in straight line
/*
export function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }
  
function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
*/