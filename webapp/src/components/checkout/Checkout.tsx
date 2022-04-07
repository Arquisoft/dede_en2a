import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Navigate } from "react-router";
import { updateProduct } from "../../api/api";
import { saveOrder } from "../../helpers/ShoppingCartHelper";
import { CartItem } from "../../shared/shareddtypes";
import Billing from "./Billing";
import OrderConfirmation from "./OrderConfirmation";
import Review from "./Review";
import ShippingAddress from "./ShippingAddress";
import ShippingMethod from "./ShippingMethod";




function getSteps() {
  return ["Address", "Shipping method", "Review", "Billing", "Confirm"];
}

export default function Checkout(props: any) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [address, setAddress] = React.useState("");
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
      props.productsCart,
      costs,
      props.userEmail,
      "Get address not implemented yet"
    );
    props.deleteCart();
  };

  const getStepContent = (stepIndex: number) => {
    if (localStorage.getItem("user.email") === null) return <Navigate to="/sign-in" />;
    switch (stepIndex) {
      case 0:
        return (
          <ShippingAddress
            address={address}
            setAddress={setAddress}
            userEmail={props.userEmail}
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
            productsCart={props.productsCart}
            shippingCosts={costs}
            handleReset={handleReset}
            handleNext={handleNext}
          />
        );
      case 3:
        return (
          <Billing
            products={props.productsCart}
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
