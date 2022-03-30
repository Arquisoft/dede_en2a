import * as React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import WebIdRadioGroup from "../WebIdRadioGroup";

import { getCoordinatesFromAddress } from "../../helpers/ComputeDistanceHelper";
import { retrievePickUpLocationsJSON } from "../../helpers/ShippingMethodHelper";

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
  return (
    <React.Fragment>
      <Divider sx={{ mb: 2 }}>Delivery</Divider>

      <LinearProgress hidden={!props.loading} />
      {!props.loading && (
        <React.Fragment>
          <Card>
            <CardMedia
              component="img"
              image={props.map}
              alt="Image of the delivery process"
            />
            <CardContent>
              <Typography variant="h6">
                Shipping rates for {props.address}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                After computing some calculations we have obtained that the
                shipping costs are {props.costs}€
              </Typography>
            </CardContent>
          </Card>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default function ShippingCosts(props: any): JSX.Element {
  const [activeStep, setActiveStep] = React.useState(0);
  const [address, setAddress] = React.useState("");
  const [shippingMethod, setShippingMethod] = React.useState("");
  const [map, setMap] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // We manage the button for going back and forth
  const handleNext = () => {
    setActiveStep(activeStep + 1);
    stepHandler();
  };

  const stepHandler = async () => {
    // The user has selected a shipping method
    if (activeStep === 0)
      return retrievePickUpLocationsJSON(
        await getCoordinatesFromAddress(address),
        "7ce2223b21114b98b42821edfef62190"
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
            map={map}
            costs={props.costs}
            address={address}
            loading={loading}
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
