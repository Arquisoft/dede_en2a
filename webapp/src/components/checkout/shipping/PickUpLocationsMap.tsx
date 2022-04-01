import React, { useEffect } from "react";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { calculateCoordinates } from "../../../helpers/ComputeDistanceHelper";
import { getPickUpPlacesNearby } from "../../../helpers/ShippingMethodHelper";

import maplibre from "maplibre-gl";

import "../../../App.css";

export default function PickUpLocationsMap(props: any) {
  const [pickUpLocation, setPickUpLocation] = React.useState("");
  const [map, setMap] = React.useState<any>(null);
  const mapContainer = React.useRef<string | HTMLElement>("");

  const createMarker = (lat: number, lon: number, name: string, map: any) => {
    let pickUpPointIcon = document.createElement("div");
    pickUpPointIcon.classList.add("pickUpPoint");

    let pickUpPopup = new maplibre.Popup({
      anchor: "bottom",
      offset: [0, -32], // height - shadow
    }).setHTML(`<p style="color:black; font-style: italic">${name}</p>`);

    let marker = new maplibre.Marker(pickUpPointIcon, {
      anchor: "bottom",
      offset: [0, 6],
    })
      .setLngLat([lat, lon])
      .setPopup(pickUpPopup)
      .addTo(map);

    marker.getElement().addEventListener("click", function () {
      setPickUpLocation(name);
      props.setAddress(name);
      props.setPickUpAddress(name);
    });
  };

  const refreshMap = async () => {
    let coords = await calculateCoordinates(props.address);
    let pickUpPlaces = await getPickUpPlacesNearby(props.address, 500, 10);

    const key = "7ce2223b21114b98b42821edfef62190";
    const style = "https://maps.geoapify.com/v1/styles/maptiler-3d/style.json";

    const initialState = {
      lng: coords.features[0].geometry.coordinates[0],
      lat: coords.features[0].geometry.coordinates[1],
      zoom: 16,
    };

    const map = new maplibre.Map({
      container: mapContainer.current,
      style: `${style}?apiKey=${key}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });

    pickUpPlaces.forEach((place) =>
      createMarker(place.lat, place.lon, place.name, map)
    );

    setMap(map);
  };

  useEffect(() => {
    if (mapContainer.current && !map) refreshMap();
  }, [mapContainer, map]);

  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Pickup locations</Divider>

      <Card>
        <CardMedia>
          <Stack
            component="div"
            width="100%"
            height="400px"
            className="map-container"
            ref={mapContainer}
          />
        </CardMedia>
        <CardContent>
          <Typography variant="h6">
            {pickUpLocation
              ? "You have chosen the following Pickup location"
              : "No location has been chosen yet"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {pickUpLocation}
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
