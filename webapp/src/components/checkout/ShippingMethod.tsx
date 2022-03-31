import React, { useEffect, useRef } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import WebIdRadioGroup from "../WebIdRadioGroup";

import { calculateCoordinates } from "../../helpers/ComputeDistanceHelper";
import { getPickUpPlacesNearby } from "../../helpers/ShippingMethodHelper";

import maplibre from "maplibre-gl";

import "../../App.css";

function ShippingMethodStep(props: any) {
  const shippingMethods = ["Correos", "Pick up point"];
  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Shipping method</Divider>

      <Typography sx={{ pb: 2 }}>
        Those are the shipping methods we have in our site; feel free to choose
        any of them:
      </Typography>
      <WebIdRadioGroup
        value={props.shippingMethod}
        setValue={props.setShippingMethod}
        radioItems={shippingMethods}
        icon={<LocalShippingIcon />}
        checkedIcon={<LocalShippingIcon />}
      />
    </React.Fragment>
  );
}

function MapStep(props: any) {
  let mapContainer: any;

  const createMarker = (lat: number, lon: number, map: any) => {
    let pickUpPointIcon = document.createElement("div");
    pickUpPointIcon.classList.add("pickUpPoint");

    let pickUpPopup = new maplibre.Popup({
      anchor: "bottom",
      offset: [0, -64], // height - shadow
    }).setText("Zürich Airport");

    new maplibre.Marker(pickUpPointIcon, {
      anchor: "bottom",
      offset: [0, 6],
    })
      .setLngLat([lat, lon])
      .setPopup(pickUpPopup)
      .addTo(map);
  };

  useEffect(() => {
    calculateCoordinates(props.address).then((coordinates: any) => {
      const initialState = {
        lng: coordinates.features[0].geometry.coordinates[0],
        lat: coordinates.features[0].geometry.coordinates[1],
        zoom: 15,
      };

      const myAPIKey = "7ce2223b21114b98b42821edfef62190";
      const mapStyle =
        "https://maps.geoapify.com/v1/styles/maptiler-3d/style.json";

      const map = new maplibre.Map({
        container: mapContainer,
        style: `${mapStyle}?apiKey=${myAPIKey}`,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom,
      });

      props.pickUpPlaces.forEach((place: any) =>
        createMarker(place.lat, place.lon, map)
      );
    });
  }, []);

  return (
    <Stack
      width="100%"
      height="400px"
      className="map-container"
      ref={(el) => (mapContainer = el)}
    />
  );
}

export default function ShippingMethod(props: any): JSX.Element {
  const [activeStep, setActiveStep] = React.useState(0);
  const [shippingMethod, setShippingMethod] = React.useState("");
  const [pickUpPlaces, setPickUpPlaces] = React.useState<any[]>([]);

  // We manage the button for going back and forth
  const handleNext = () => {
    setActiveStep(activeStep + 1);
    stepHandler();
  };

  const stepHandler = async () => {
    // The user has selected a shipping method
    if (activeStep === 0)
      getPickUpPlacesNearby(props.address, 500, 10).then((places) =>
        setPickUpPlaces(places)
      );
    // In case tu user has chosen
    if (activeStep === 1) props.handleNext();
  };

  const isContinue = () => {
    // We are at the first step: in case no shipping method has been selected
    if (activeStep === 0) return shippingMethod === "";
  };

  const handleReset = () => {};

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <ShippingMethodStep
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
          />
        );
      case 1:
        return (
          <MapStep
            costs={props.costs}
            address={props.address}
            pickUpPlaces={pickUpPlaces}
          />
        );
    }
  };

  return (
    <React.Fragment>
      {getStepContent(activeStep)}
      <Stack
        sx={{ pt: 2 }}
        direction={{ xs: "column", sm: "row-reverse" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isContinue()}
        >
          {activeStep === 2 ? "Next" : "Continue"}
        </Button>
        <Button hidden={activeStep === 0} onClick={handleReset}>
          Reset
        </Button>
      </Stack>
    </React.Fragment>
  );
}
