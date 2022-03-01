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
import Box from "@mui/material/Box";
import {
  calculateShippingCosts,
  showMapRoute,
} from "../util/distanceCalculation";
import { SettingsInputAntennaTwoTone } from "@mui/icons-material";

function getSteps() {
  return ["Shipping address", "Review your order"];
}

export default function Checkout() {
  const [address, setAddress] = React.useState("");
  const [costs, setCosts] = React.useState<number>(0);
  const [map, setMap] = React.useState<string>();
  const [costsCalculated, setCostsCalculated] = React.useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const shippingCosts = async (address: string) => {
    setMap(await showMapRoute(address));
    setCosts(await calculateShippingCosts(address));
    setCostsCalculated(true);
  };

  const calculateCosts = () => {
    shippingCosts(address);
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
            {costsCalculated && (
              <Box component="div">
                <p>The shipping costs are {costs} €</p>
                <img src={map}></img>
              </Box>
            )}
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
