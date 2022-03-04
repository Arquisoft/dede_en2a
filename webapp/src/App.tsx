import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { CartItem, Product } from "./shared/shareddtypes";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Shopping from "./components/Shopping";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Checkout from "./components/Checkout";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { User, NotificationType } from "./shared/shareddtypes";

import { getProducts } from "./api/api";

import {PayPalScriptProvider} from "@paypal/react-paypal-js";

import "./App.css";

function App(): JSX.Element {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [productsCart, setProductsCart] = useState<CartItem[]>([]);
  const [totalUnitsInCart, setTotalUnitsInCart] = useState<number>(Number());
  const [user, setUser] = useState<User | null>(null);

  const createShop = async () => {
    const dbProducts: Product[] = await getProducts(); // and obtain the products
    setProducts(dbProducts);
  };

  const setCurrentUser = (user: User) => {
    setUser(user);
    setNotificationStatus(true);
    setNotification({
      severity: "success",
      message: "Welcome to DeDe application " + user.name + " " + user.surname,
    });
  };

  const logCurrentUserOut = () => {
    setNotificationStatus(true);
    setNotification({
      severity: "success",
      message: "You signed out correctly. See you soon!",
    });
  };

  const handleAddCart = (product: Product) => {
    let products = productsCart.slice();
    let found: number = -1;
    products.forEach((cartItem, index) => {
      if (cartItem.product.code === product.code) {
        found = index;
      }
    });

    //We check if the product is in the cart. In this case we add 1 to the amount,
    //otherwise we push the product with amount 1
    if (found >= 0) {
      products[found].amount += 1;
    } else {
      products.push({ product: product, amount: 1 });
    }

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

    //Retrive the cart from the session.
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
    <PayPalScriptProvider
      options={{
        "client-id":
          "Ad1H-xmYNu8WPb6jDwiLjirog2e5jA6dylivOrsS5KJ4R_RXt0HOBe7wJ7fuGvMnMDet9RowUTBDAtnV",
        currency: "EUR",
      }}
    >
    <Router>
      <NavBar
        totalUnitsInCart={totalUnitsInCart}
        logCurrentUserOut={logCurrentUserOut}
      />
      <Routes>
        <Route
          index
          element={
            <Home
              products={products}
              cartProducts={productsCart}
              onAdd={handleAddCart}
            />
          }
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
        <Route
          path="sign-in"
          element={<SignIn setCurrentUser={setCurrentUser} />}
        />
        <Route
          path="sign-up"
          element={<SignUp setCurrentUser={setCurrentUser} />}
        />
      </Routes>
      <Footer />

      <Snackbar
        open={notificationStatus}
        autoHideDuration={3000}
        onClose={() => {
          setNotificationStatus(false);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Router>
    </PayPalScriptProvider>
  );
}

export default App;
