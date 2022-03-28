import * as React from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { CartItem } from "../../shared/shareddtypes";
import { calculateTotal } from "../../helpers/ShoppingCartHelper";

import { PayPalButtons } from "@paypal/react-paypal-js";

type BillingProps = {
  products: CartItem[];
  shippingCosts: number;
  onPayed: () => void;
  handleBack: () => void;
};

export default function Billing(props: BillingProps): JSX.Element {
  const totalPrice: number = calculateTotal(
    props.products,
    props.shippingCosts
  );

  return (
    <React.Fragment>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: "Products bought in Dede shop",
                amount: {
                  value: totalPrice.toString(),
                  currency_code: "EUR",
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions: any) => {
          await actions.order.capture();
          props.onPayed();
        }}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Button onClick={props.handleBack} variant="outlined" className="m-1">
          Back
        </Button>
      </Stack>
    </React.Fragment>
  );
}
