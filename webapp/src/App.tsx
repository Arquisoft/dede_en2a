import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";

import { Product } from "./shared/shareddtypes";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Shopping from "./components/Shopping";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Checkout from "./components/Checkout";

import "./App.css";

import "bootstrap/dist/css/bootstrap.css";

function App(): JSX.Element {
  const [productsCart, setProductsCart] = useState<Product[]>([]);
  const [unitProducts, setUnits] = useState<Map<string, number>>(new Map()); //String - product code // Number - Products Units
  const [totalUnitsInCart, setTotalUnitsInCart] = useState<number>(Number());

  const handleAddCart = (product: Product) => {
    if (unitProducts.has(product.code))
      unitProducts.set(product.code, unitProducts.get(product.code)! + 1);
    else {
      unitProducts.set(product.code, 1);

      const products = productsCart.slice();
      products.push(product);
      setProductsCart(products);
    }

    setTotalUnitsInCart(totalUnitsInCart + 1);
    setUnits(unitProducts);
    render();
  };

  const handleDecrementUnit = (product: Product) => {
    unitProducts.set(product.code, unitProducts.get(product.code)! - 1);

    if (unitProducts.get(product.code) == 0) {
      unitProducts.delete(product.code);
      productsCart.forEach((p, index: number) => {
        if (p.code == product.code) delete productsCart[index];
      });
    }

    setTotalUnitsInCart(totalUnitsInCart - 1);
    render();
  };

  const render = () => {
    ReactDOM.render(
      <React.StrictMode>
        <CssBaseline />
        <App />
      </React.StrictMode>,
      document.getElementById("root")
    );
  };

  return (
    <Router>
      <NavBar isAuthenticated={false} totalUnitsInCart={totalUnitsInCart} />
      <Routes>
        <Route index element={<Home onAdd={handleAddCart} />} />
        <Route
          path="cart"
          element={
            <Shopping
              products={productsCart}
              units={unitProducts}
              onDecrementUnit={handleDecrementUnit}
              onIncrementUnit={handleAddCart}
            />
          }
        />
        <Route path="checkout" element={<Checkout />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
