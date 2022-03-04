import React from "react";
import ReactDOM from "react-dom";

import { CartItem } from "../shared/shareddtypes";

import { calculateTotal } from "../helpers/ShoppingCartHelper";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

type BillingProps = {
  products: CartItem[];
  shippingCosts: number;
  onPayed: () => void;
};
export default function Billing(props: BillingProps): JSX.Element {
  const totalPrice = calculateTotal(props.products, props.shippingCosts);
  const createOrder = (data: any, actions: any) => {
    console.log(data);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: data,
            description: "Products bought in DeDe shop",
          },
        },
      ],
    });
  };

  const onApprove = (data: any, actions: any) => {
    props.onPayed();
    return actions.order.capture();
  };

  return (
      <PayPalButtons
        createOrder={(data: any, actions: any) =>
          createOrder(totalPrice, actions)
        }
        onApprove={(data: any, actions: any) => onApprove(data, actions)}
      />
  );
}
