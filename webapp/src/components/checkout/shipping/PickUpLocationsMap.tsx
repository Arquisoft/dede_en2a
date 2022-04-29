import React, { useEffect } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { calculateCoordinates } from "../../../helpers/ComputeDistanceHelper";
import { getPickUpPlacesNearby } from "../../../helpers/ShippingMethodHelper";

import maplibre from "maplibre-gl";
import { toStringAddress } from "../../../helpers/SolidHelper";
import { Address } from "../../../shared/shareddtypes";

export default function PickUpLocationsMap(props: any) {
  const [map, setMap] = React.useState<any>(null);
  const mapContainer = React.useRef<string | HTMLElement>("");

  const createMarker = (
    lat: number,
    lon: number,
    name: string,
    street_address: Address,
    map: any,
    isHouse: boolean
  ) => {
    let pickUpPointIcon = document.createElement("div");
    pickUpPointIcon.classList.add("pickUpPoint");

    // We style the marker as intended for it be displayed
    pickUpPointIcon.style.width = "16px";
    pickUpPointIcon.style.height = "23px";
    pickUpPointIcon.style.backgroundSize = "contain";
    if (!isHouse)
      pickUpPointIcon.style.backgroundImage = `url(https://api.geoapify.com/v1/icon/?type=awesome&color=%233900ff&icon=truck&scaleFactor=2&apiKey=${process.env.REACT_APP_GEOAPIFY_KEY})`;
    else
      pickUpPointIcon.style.backgroundImage = `url(https://api.geoapify.com/v1/icon/?type=material&color=red&icon=landmark&scaleFactor=2&apiKey=${process.env.REACT_APP_GEOAPIFY_KEY})`;
    pickUpPointIcon.style.cursor = "pointer";

    let pickUpPopup = new maplibre.Popup({
      anchor: "bottom",
      offset: [0, -32], // height - shadow
    }).setHTML(
      `<p style="color:black; font-style: italic">${name}</p> <p style="color:black"> ${toStringAddress(
        street_address
      )} </p>`
    );

    let marker = new maplibre.Marker(pickUpPointIcon, {
      anchor: "bottom",
      offset: [0, 6],
    })
      .setLngLat([lat, lon])
      .setPopup(pickUpPopup)
      .addTo(map);

    if (!isHouse)
      marker.getElement().addEventListener("click", function () {
        props.setAddress(street_address);
        props.setPickUpLocation(name);
      });
  };

  const refreshMap = async () => {
    let coords = await calculateCoordinates(toStringAddress(props.address));
    let dist = 500;
    let reps = 0;

    let pickUpPlaces = await getPickUpPlacesNearby(
      toStringAddress(props.address),
      dist,
      10
    );
    while (pickUpPlaces.length === 0) {
      dist *= 2;
      pickUpPlaces = await getPickUpPlacesNearby(
        toStringAddress(props.address),
        dist,
        10
      );
      reps++;
    }

    const key = process.env.REACT_APP_GEOAPIFY_KEY;
    const style = "https://maps.geoapify.com/v1/styles/positron/style.json";

    const initialState = {
      lng: coords.features[0].geometry.coordinates[0],
      lat: coords.features[0].geometry.coordinates[1],
      zoom: 16 - reps * 3,
    };

    const map = new maplibre.Map({
      container: mapContainer.current,
      style: `${style}?apiKey=${key}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });

    pickUpPlaces.forEach((place) =>
      createMarker(
        place.lat,
        place.lon,
        place.name,
        place.street_address,
        map,
        false
      )
    );

    const x = coords.features[0].geometry.coordinates[0];
    const y = coords.features[0].geometry.coordinates[1];
    createMarker(x, y, "Your house", props.address, map, true);

    setMap(map);
  };

  useEffect(() => {
    if (mapContainer.current && !map) refreshMap();
  }, [mapContainer, map]);

  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Pick UP locations</Divider>

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
          <Typography variant="subtitle1">
            {props.pickUpLocation
              ? `You have chosen the following location: ${props.pickUpLocation}`
              : "No location has been chosen yet"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {props.pickUpLocation ? toStringAddress(props.address) : ""}
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
