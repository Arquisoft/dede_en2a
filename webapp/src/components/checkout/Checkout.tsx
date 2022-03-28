import * as React from "react";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

import { updateProduct } from "../../api/api";
import { CartItem } from "../../shared/shareddtypes";
import { saveOrder } from "../../helpers/ShoppingCartHelper";

import ShippingCosts from "./ShippingCosts";
import Review from "./Review";
import Billing from "./Billing";
import OrderConfirmation from "./OrderConfirmation";

function getSteps() {
  return [
    "Shipping address",
    "Review your order",
    "Billing Info",
    "Order confirmation",
  ];
}

export default function Checkout(props: any) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [costs, setCosts] = React.useState<number>(Number());

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePayed = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    saveOrderToDB();
  };

  const saveOrderToDB = () => {
    saveOrder(
      props.productsCart,
      costs,
      props.userEmail,
      "Get address not implemented yet"
    );
    props.deleteCart();
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <ShippingCosts
            handleCosts={setCosts}
            costs={costs}
            userEmail={props.userEmail}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <Review
            productsCart={props.productsCart}
            shippingCosts={costs}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <Billing
            products={props.productsCart}
            shippingCosts={costs}
            handleBack={handleBack}
            onPayed={handlePayed}
          />
        );
      case 3:
        return <OrderConfirmation />;
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
          <Stepper
            activeStep={activeStep}
            sx={{ pt: 3, pb: 5 }}
            alternativeLabel
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <React.Fragment>{getStepContent(activeStep)}</React.Fragment>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
