import { CartItem } from "../../shared/shareddtypes";
import { calculateTotal } from "../../helpers/ShoppingCartHelper";

import { PayPalButtons } from "@paypal/react-paypal-js";

type BillingProps = {
  products: CartItem[];
  shippingCosts: number;
  onPayed: () => void;
};

export default function Billing(props: BillingProps): JSX.Element {
  const totalPrice: number = calculateTotal(
    props.products,
    props.shippingCosts
  );

  const handleApprove = () => {
    props.onPayed();
  };

  return (
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
        handleApprove();
      }}
    />
  );
}
