import * as React from "react";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function getSteps() {
  return ["Shipping address", "Review your order"];
}

function getStepContent(stepIndex: number) {
  switch (stepIndex) {
    case 0:
      return "Here it goes the solid pod's thing";
    case 1:
      return "Review your order";
  }
}

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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

          <Typography>{getStepContent(activeStep)}</Typography>

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
