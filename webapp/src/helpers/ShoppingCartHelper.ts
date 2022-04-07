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
    item.product.stock = item.amount;
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

export function addProductToCart(
  product: Product,
  productsInCart: CartItem[],
  setProductsInCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  setTotalUnitsInCart: React.Dispatch<React.SetStateAction<number>>
) {
  if (product !== undefined) {
    // We have to check the parameters we pass
    let products = productsInCart.slice();
    let found: number = -1;
    products.forEach((cartItem, index) => {
      if (cartItem.product.code === product.code) found = index;
    });

    //We check if the product is in the cart. In this case we add 1 to the amount,
    //otherwise we push the product with amount 1
    if (found >= 0) products[found].amount += 1;
    else products.push({ product: product, amount: 1 });

    localStorage.setItem("cart", JSON.stringify(products));
    setProductsInCart(products); // we update the products in the cart
    setTotalUnitsInCart((prevNumberOfUnits) => prevNumberOfUnits + 1);
  }
}

export function removeProductFromCart(
  product: Product,
  productsCart: CartItem[],
  setProductsCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  setTotalUnitsInCart: React.Dispatch<React.SetStateAction<number>>
) {
  let products = productsCart.slice();
  let found: number = -1;
  products.forEach((cartItem, index) => {
    if (cartItem.product.code === product.code) found = index;
  });

  products[found].amount -= 1;
  if (products[found].amount === 0) delete products[found];

  products = products.filter(Boolean);
  localStorage.setItem("cart", JSON.stringify(products)); //Update the cart in session
  setProductsCart(products);
  setTotalUnitsInCart((prevNumberOfUnits) => prevNumberOfUnits - 1);
}

export function removeAllFromCart(
  setProductsCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  setTotalUnitsInCart: React.Dispatch<React.SetStateAction<number>>
) {
  setProductsCart([]);
  setTotalUnitsInCart(0);
  localStorage.setItem("cart", JSON.stringify([]));
}
