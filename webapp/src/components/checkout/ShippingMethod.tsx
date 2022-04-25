import React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import ShippingMethodForm from "./shipping/ShippingMethodForm";
import PickUpLocationsMap from "./shipping/PickUpLocationsMap";
import ShippingRouteMap from "./shipping/ShippingRouteMap";

export default function ShippingMethod(props: any): JSX.Element {
  const [activeStep, setActiveStep] = React.useState(0);
  const [pickUpLocation, setPickUpLocation] = React.useState("");
  const [shippingMethod, setShippingMethod] = React.useState("");

  // We manage the button for going back and forth
  const handleNext = (shippingMethodTitle: string) => {
    setActiveStep(activeStep + 1);

    // In case the shipping method is not Pick UP go directly to the last step
    if (activeStep === 0 && shippingMethodTitle !== "Pick UP") setActiveStep(2);
    // The user has completed all the steps sucessfully
    if (activeStep === 2) props.handleNext();
  };

  const isForward = () => {
    // We are at the first step: in case no shipping method has been selected
    if (activeStep === 0) return shippingMethod !== "";
    // In case we are at the pickUp location selector: no address has been selected
    if (activeStep === 1) return pickUpLocation !== "";
    // We are at the last step: viewing the delivery details
    if (activeStep === 2) return true;
    // By default we will disable it
    return false;
  };

  const handleBack = () => {
    if (activeStep === 0) props.handleBack();
    else setActiveStep(0); // We go back to the main place where locations can be chosen
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <ShippingMethodForm
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            setCosts={props.setCosts}
            address={props.address}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <PickUpLocationsMap
            address={props.address}
            setAddress={props.setAddress}
            pickUpLocation={pickUpLocation}
            setPickUpLocation={setPickUpLocation}
          />
        );
      case 2:
        return <ShippingRouteMap address={props.address} costs={props.costs} />;
    }
  };

  return (
    <React.Fragment>
      {getStepContent(activeStep)}
      <Stack
        sx={{ pt: 2 }}
        direction="row-reverse"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          hidden={activeStep === 0}
          disabled={!isForward()}
          onClick={() => handleNext("")}
          variant="contained"
          className="m-1"
        >
          Next
        </Button>
        <Button
          hidden={activeStep === 2}
          onClick={handleBack}
          variant="outlined"
          className="m-1"
        >
          Back
        </Button>
      </Stack>
    </React.Fragment>
  );
}
