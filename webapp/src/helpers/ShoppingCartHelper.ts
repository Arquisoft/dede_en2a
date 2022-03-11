import { v4 as uuidv4 } from "uuid";

import { CartItem, User, Order, OrderProduct } from "../shared/shareddtypes";
import { createOrder } from "../api/api";

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
  user: User
) {
  let productCosts: number = calculateTotal(products, 0);
  var orderProducts: OrderProduct[] = [];
  products.forEach((item) => {
    orderProducts.push({ code: item.product.code, amount: item.amount });
  });

  let order: Order = {
    orderCode: uuidv4(),
    userEmail: user.email,
    products: orderProducts,
    totalPrice: productCosts,
    shippingPrice: shippingCosts,
    isOrderReceived: false,
  };

  createOrder(JSON.stringify(order));
}
