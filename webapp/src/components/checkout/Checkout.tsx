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

import ShippingAddress from "./ShippingAddress";
import ShippingMethod from "./ShippingMethod";
import Review from "./Review";
import Billing from "./Billing";
import OrderConfirmation from "./OrderConfirmation";

type CheckoutProps = {
  productsInCart: CartItem[];
  handleDeleteCart: () => void;
};

function getSteps() {
  return ["Address", "Shipping method", "Review", "Billing", "Confirm"];
}

export default function Checkout(props: CheckoutProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [address, setAddress] = React.useState("");
  const [costs, setCosts] = React.useState<number>(Number());

  const steps = getSteps();

  const handleUpdateStock = () => {
    props.productsInCart.forEach((cartItem: CartItem) => {
      let productUnits: number = cartItem.amount;
      cartItem.product.stock -= productUnits;
      updateProduct(cartItem.product);
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handlePayed = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    saveOrderToDB();
  };

  const saveOrderToDB = () => {
    handleUpdateStock();
    saveOrder(
      props.productsInCart,
      costs,
      "", // TODO: user the webID
      "Get address not implemented yet"
    );
    props.handleDeleteCart(); // TODO: don't use the props
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <ShippingAddress
            address={address}
            setAddress={setAddress}
            userEmail={""} // TODO: use the WEBID
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <ShippingMethod
            address={address}
            setAddress={setAddress}
            costs={costs}
            setCosts={setCosts}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <Review
            productsCart={props.productsInCart}
            shippingCosts={costs}
            handleReset={handleReset}
            handleNext={handleNext}
          />
        );
      case 3:
        return (
          <Billing
            products={props.productsInCart}
            shippingCosts={costs}
            handleBack={handleBack}
            onPayed={handlePayed}
          />
        );
      case 4:
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
