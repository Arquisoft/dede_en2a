import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CartItem, Product } from "./shared/shareddtypes";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Shopping from "./components/Shopping";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Checkout from "./components/Checkout";

import { getProducts } from "./api/api";

import "./App.css";

function App(): JSX.Element {
  const [productsCart, setProductsCart] = useState<CartItem[]>([]);
  const [totalUnitsInCart, setTotalUnitsInCart] = useState<number>(Number());

  const createShop = async () => {
    const cartItems: CartItem[] = []; // we initialize the cartItems
    const products: Product[] = await getProducts(); // and obtain the products

    products.forEach((product) => {
      cartItems.push({ product: product, amount: 0 }); // as default: no element on cart
    });

    setProductsCart(cartItems);
  };

  const handleAddCart = (product: Product) => {
    const products = productsCart.slice();
    let found: number = -1;
    products.forEach((cartItem, index) => {
      if (cartItem.product.code === product.code) {
        found = index;
      }
    });

    // we are sure we are finding the product as it's previously initialized
    products[found].amount += 1;
    localStorage.setItem("cart", JSON.stringify(products));
    setProductsCart(products); // we update the products in the cart
    setTotalUnitsInCart(totalUnitsInCart + 1);
  };

  const handleDecrementUnit = (product: Product) => {
    let products = productsCart.slice();
    let found: number = -1;
    products.forEach((cartItem, index) => {
      if (cartItem.product.code === product.code) {
        found = index;
      }
    });

    products[found].amount -= 1;
    if (products[found].amount === 0) {
      delete products[found];
    }

    products = products.filter(Boolean);

    localStorage.setItem("cart", JSON.stringify(products)); //Update the cart in session

    setProductsCart(products);
    setTotalUnitsInCart(totalUnitsInCart - 1);
  };

  useEffect(() => {
    createShop();
    const sessionCart = localStorage.getItem("cart");

    if (sessionCart) {
      let cart: CartItem[] = JSON.parse(sessionCart);

      let units: number = 0;
      cart.forEach((cartItem) => {
        units += cartItem.amount;
      });
      setTotalUnitsInCart(units);
      setProductsCart(cart); //Set the cart when the componenet is rendered
    } else {
      localStorage.setItem("cart", JSON.stringify([]));
    }
  }, []);

  return (
    <Router>
      <NavBar isAuthenticated={false} totalUnitsInCart={totalUnitsInCart} />
      <Routes>
        <Route
          index
          element={<Home products={productsCart} onAdd={handleAddCart} />}
        />
        <Route
          path="cart"
          element={
            <Shopping
              products={productsCart}
              totalUnitsInCart={totalUnitsInCart}
              onDecrementUnit={handleDecrementUnit}
              onIncrementUnit={handleAddCart}
            />
          }
        />
        <Route
          path="checkout"
          element={<Checkout productsCart={productsCart.slice()} />}
        />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
