import { CartItem } from "../shared/shareddtypes";

export function calculateTotal(products: CartItem[]): number {
  let total: number = 0;
  products.forEach((cartItem: CartItem) => {
    let unit = cartItem.amount;
    total += unit * cartItem.product.price;
  });
  return total;
}
