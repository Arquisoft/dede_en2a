import * as React from "react";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function calculateCoordinates(address: String) {
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

function getDistanceFromLatLonInKm(
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

function getSteps() {
  return ["Shipping address", "Review your order"];
}

export default function Checkout() {
  const [address, setAddress] = React.useState("");
  const [costs, setCosts] = React.useState<number>(0);
  const [costsCalculated, setCostsCalculated] = React.useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const calculateShippingCosts = async (destAddress: String) => {
    let destCoords = await calculateCoordinates(destAddress);
    let fromCoords = await calculateCoordinates(
      "Calle Gonzalez Besada, 31, 33007 Oviedo"
    );
    let destLat = destCoords.data[0].latitude;
    let destLon = destCoords.data[0].longitude;
    let fromLat = fromCoords.data[0].latitude;
    let fromLon = fromCoords.data[0].longitude;

    let distance = getDistanceFromLatLonInKm(
      fromLat,
      fromLon,
      destLat,
      destLon
    );

    let costs = Math.round(distance * 2 * 100) / 100; //2 euros per km
    setCosts(costs);
    setCostsCalculated(true);
  };

  const calculateCosts = () => {
    calculateShippingCosts(address);
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <React.Fragment>
            <TextField
              name="address"
              required
              fullWidth
              id="address"
              label="Address"
              onChange={(e) => setAddress(e.target.value)}
              autoFocus
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={calculateCosts}
            >
              Calculate Shipping Costs
            </Button>
            {costsCalculated && <p>The shipping costs are {costs} €</p>}
          </React.Fragment>
        );
      case 1:
        return "Review your order";
    }
  };

  return (
    <React.Fragment>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <React.Fragment>{getStepContent(activeStep)}</React.Fragment>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              className="m-1"
            >
              Back
            </Button>

            <Button variant="contained" onClick={handleNext} className="m-1">
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
