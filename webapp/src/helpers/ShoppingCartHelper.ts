import { v4 as uuidv4 } from "uuid";

import { createOrder } from "../api/api";
import { CartItem, Order, OrderProduct, Product } from "../shared/shareddtypes";

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
  userEmail: string
) {
  let productCosts: number = calculateTotal(products, 0);
  var orderProducts: OrderProduct[] = [];
  products.forEach((item) => {
    orderProducts.push({ code: item.product.code, amount: item.amount });
  });

  let order: Order = {
    orderCode: uuidv4(),
    userEmail: userEmail,
    products: orderProducts,
    totalPrice: productCosts,
    shippingPrice: shippingCosts,
    isOrderReceived: false,
  };

  createOrder(JSON.stringify(order));
}

export function getCurrentCartAmount(
  product: Product,
  cartProducts: CartItem[]
) {
  let currentAmount: number = 0;
  cartProducts.forEach((cartItem: CartItem) => {
    if (product.code === cartItem.product.code) {
      currentAmount = cartItem.amount;
    }
  });
  return currentAmount;
}
