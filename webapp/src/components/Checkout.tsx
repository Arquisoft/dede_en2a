import * as React from "react";
import { Navigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { updateProduct } from "../api/api";
import { CartItem } from "../shared/shareddtypes";
import { saveOrder } from "../helpers/ShoppingCartHelper";

import ShippingCosts from "./ShippingCosts";
import Review from "./Review";
import Billing from "./Billing";

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
  const [isCostsCalculated, setCostsCalculated] =
    React.useState<boolean>(false);
  const [costs, setCosts] = React.useState<number>(Number());

  const steps = getSteps();

  const handleUpdateStock = () => {
    props.productsCart.forEach((cartItem: CartItem) => {
      let productUnits: number = cartItem.amount;
      cartItem.product.stock -= productUnits;
      updateProduct(cartItem.product);
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    // when we click FINISH button ==> update the stock
    if (activeStep === steps.length - 2) {
      saveOrderToDB();
    }
  };

  const saveOrderToDB = () => {
    handleUpdateStock();
    saveOrder(
      props.productsCart,
      costs,
      props.userEmail,
      "Get address not implemented yet"
    );
    props.deleteCart();

    // We have finished the process...
    <Navigate to="/" />;
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

    if (activeStep === 1) {
      // if we came back to the beginning
      setCostsCalculated(false);
      setCosts(Number());
    }
  };

  const handlePayed = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <ShippingCosts
            handleCosts={setCosts}
            costs={costs}
            handleCostsCalculated={setCostsCalculated}
            isCostsCalculated={isCostsCalculated}
          />
        );
      case 1:
        return (
          <Review productsCart={props.productsCart} shippingCosts={costs} />
        );
      case 2:
        return (
          <Billing
            products={props.productsCart}
            shippingCosts={costs}
            onPayed={handlePayed}
          />
        );
      case 3:
        return (
          <React.Fragment>
            <Typography component="h2" variant="h6">
              It's ordered!
            </Typography>
            <Typography>
              We've received your order and will ship your package as as soon as
              possible.
            </Typography>
          </React.Fragment>
        );
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

          <Stack
            sx={{ pt: 2 }}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              disabled={activeStep === 0}
              hidden={activeStep === getSteps().length - 1}
              onClick={handleBack}
              variant="outlined"
              className="m-1"
            >
              Back
            </Button>

            <Button
              disabled={!isCostsCalculated}
              hidden={activeStep === getSteps().length}
              variant="contained"
              onClick={handleNext}
              className="m-1"
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
