import { v4 as uuidv4 } from "uuid";

import { CartItem, User, Order, Product } from "../shared/shareddtypes";
import { createOrder } from "../api/api";
import { DateRange } from "@mui/icons-material";

export function calculateTotal(
  products: CartItem[],
  shippingCosts: number
): number {
  let total: number = 0;
  products.forEach((cartItem: CartItem) => {
    let unit = cartItem.amount;
    total += unit * cartItem.product.price;
  });
  total += shippingCosts;
  return total;
}

export function saveOrder(
  products: CartItem[],
  shippingCosts: number,
  userEmail: string,
  userAddress : string
) {
  let productCosts: number = calculateTotal(products, 0);
  var orderProducts: Product[] = [];
  products.forEach((item) => {
    item.product.stock = item.amount
    orderProducts.push(item.product);
  });

  let order: Order = {
    orderCode: uuidv4(),
    userEmail: userEmail,
    userAddress: userAddress,
    products: orderProducts,
    date: new Date(),
    subtotalPrice: productCosts,
    shippingPrice: shippingCosts,
    totalPrice: productCosts + shippingCosts,
    isOrderReceived: false,
  };

  createOrder(JSON.stringify(order));
}
