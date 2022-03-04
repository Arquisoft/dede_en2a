import { CartItem } from "../shared/shareddtypes";

export function calculateTotal(products: CartItem[], shippingCosts: number): number {
  let total: number = 0;
  products.forEach((cartItem: CartItem) => {
    let unit = cartItem.amount;
    total += unit * cartItem.product.price;
  });
  total += shippingCosts;
  return total;
}
