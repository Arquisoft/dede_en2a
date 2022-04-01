import * as React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function CheckoutStepper(props: any) {
  // We manage the button for going back and forth
  const handleNext = () => {
    props.setActiveStep(props.activeStep + 1);
    props.forwardHandler();
  };

  const handleBack = () => {
    props.setActiveStep(props.activeStep - 1);
    props.backwardHandler();
  };

  return (
    <React.Fragment>
      {props.children}
      <Stack
        sx={{ pt: 2 }}
        direction={{ xs: "column", sm: "row-reverse" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Button hidden={props.isForward} onClick={handleNext}>
          {props.forwardButtonTitle}
        </Button>
        <Button hidden={props.isBackwards} onClick={handleBack}>
          {props.backwardsButtonTitle}
        </Button>
      </Stack>
    </React.Fragment>
  );
}
