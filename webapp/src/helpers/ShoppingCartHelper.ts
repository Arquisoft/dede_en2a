import { v4 as uuidv4 } from "uuid";
import { createOrder } from "../api/api";
import { CartItem, Order, Product } from "../shared/shareddtypes";

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
  return Math.round((total + Number.EPSILON) * 100) / 100;
}

export async function saveOrder(
  products: CartItem[],
  shippingCosts: number,
  userEmail: string,
  userAddress: string
) {
  let productCosts: number = calculateTotal(products, 0);
  var orderProducts: Product[] = [];
  products.forEach((item) => {
    let p: Product = {
      code: item.product.code,
      name: item.product.name,
      description: item.product.description,
      price: item.product.price,
      stock: item.amount,
      image: item.product.image,
      category: item.product.category,
    };
    orderProducts.push(p);
  });

  let receivingDate = new Date();
  receivingDate.setDate(receivingDate.getDate() + 3);
  let order: Order = {
    orderCode: uuidv4(),
    userEmail: userEmail,
    userAddress: userAddress,
    products: orderProducts,
    date: new Date(),
    subtotalPrice: productCosts,
    shippingPrice: shippingCosts,
    totalPrice: productCosts + shippingCosts,
    receivedDate: receivingDate,
  };

  await createOrder(JSON.stringify(order));
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
