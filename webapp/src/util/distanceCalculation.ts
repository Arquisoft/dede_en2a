import Box from "@mui/material/Box";

export const calculateShippingCosts = async (destAddress: String) => {
  let destCoords = await calculateCoordinates(destAddress);
  let fromCoords = await calculateCoordinates(
    "Calle Gonzalez Besada, 11, 33007, Oviedo"
  );
  let destLat = destCoords.data[0].latitude;
  let destLon = destCoords.data[0].longitude;
  let fromLat = fromCoords.data[0].latitude;
  let fromLon = fromCoords.data[0].longitude;

  let data = await getDistanceDriving(fromLat, fromLon, destLat, destLon);
  let distance = data.resourceSets[0].resources[0].travelDistance;

  let costs = Math.round(distance * 2 * 100) / 100; //2 euros per km

  return costs;
};

export const showMapRoute = async (destAddress: String) => {
  let destCoords = await calculateCoordinates(destAddress);
  let fromCoords = await calculateCoordinates(
    "Calle Gonzalez Besada, 11, 33007, Oviedo"
  );
  let destLat = destCoords.data[0].latitude;
  let destLon = destCoords.data[0].longitude;
  let fromLat = fromCoords.data[0].latitude;
  let fromLon = fromCoords.data[0].longitude;

  let map = await getRouteImage(fromLat, fromLon, destLat, destLon);
  const url = URL.createObjectURL(map);

  return url;
}


export function calculateCoordinates(address: String) {
    const axios = require("axios");
  
    const params = {
      access_key: "ec869c9b938ff61bb2d002a3fdc953b6",
      query: address,
    };
  
    return axios
      .get("http://api.positionstack.com/v1/forward", { params })
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        return error;
      });
}

export function getDistanceDriving(
    fromLat: number,
    fromLon: number,
    destLat: number,
    destLon: number
  ) {
    const axios = require("axios");
    const params = {
      access_key:
        "Agy2F1agPvcOjRbB9CegxxYVgRrdDCBXI4eCjQ4yg6XAtdi9IStkytVunOwu7x4-",
    };
  
    return axios
      .get(
        "https://dev.virtualearth.net/REST/V1/Routes?wp.0=" +
          fromLat +
          "," +
          fromLon +
          "&wp.1=" +
          destLat +
          "," +
          destLon +
          "&key=Agy2F1agPvcOjRbB9CegxxYVgRrdDCBXI4eCjQ4yg6XAtdi9IStkytVunOwu7x4-")
      .then((response: any) => {
        return response.data;
      });
}
  
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

export function getRouteImage(fromLat: number, fromLon: number, destLat: number, destLon: number){
  const axios = require("axios");
    const params = {
      access_key:
        "Agy2F1agPvcOjRbB9CegxxYVgRrdDCBXI4eCjQ4yg6XAtdi9IStkytVunOwu7x4-",
    };
  
    return axios
      .get(
        "https://dev.virtualearth.net/REST/V1/Imagery/Map/Road/Routes?wp.0=" +
          fromLat +
          "," +
          fromLon +
          "&wp.1=" +
          destLat +
          "," +
          destLon +
          "&key=Agy2F1agPvcOjRbB9CegxxYVgRrdDCBXI4eCjQ4yg6XAtdi9IStkytVunOwu7x4-",
          {responseType: "blob"}
      )
      .then((response: any) => {
        return response.data;
      });
}