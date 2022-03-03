import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
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

import "./App.css";

import "bootstrap/dist/css/bootstrap.css";

function App(): JSX.Element {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const [productsCart, setProductsCart] = useState<CartItem[]>([]);
  const [totalUnitsInCart, setTotalUnitsInCart] = useState<number>(Number());
  const [user, setUser] = useState<User>();

  const [auth, setAuth] = useState<Boolean>(false);

  const setCurrentUser = (user: User, token: string) => {
    setUser(user);
    setNotificationStatus(true);
    setNotification({
      severity: "success",
      message: "Welcome to DeDe application " + user.name + " " + user.surname,
    });

    console.log(token);
    if (token !== null) {
      localStorage.setItem("token", token);
      setAuth(true);
    } else {
      setAuth(false);
    }

  };

  const handleAddCart = (product: Product) => {
    const products = productsCart.slice();
    let found: number = -1;
    products.forEach((cartItem, index) => {
      if (cartItem.product.code == product.code) {
        found = index;
      }
    });

    if (found >= 0) {
      products[found].amount += 1;
    } else {
      products.push({ product: product, amount: 1 });
    }
    setProductsCart(products);
    setTotalUnitsInCart(totalUnitsInCart + 1);
  };

  const handleDecrementUnit = (product: Product) => {
    const products = productsCart.slice();
    let found: number = -1;
    products.forEach((cartItem, index) => {
      if (cartItem.product.code == product.code) {
        found = index;
      }
    });

    products[found].amount -= 1;
    if (products[found].amount == 0) {
      delete products[found];
    }
    setProductsCart(products);
    setTotalUnitsInCart(totalUnitsInCart - 1);
  };

  return (
    <Router>
      <NavBar isAuthenticated={auth} totalUnitsInCart={totalUnitsInCart} />
      <Routes>
        <Route index element={<Home onAdd={handleAddCart} />} />
        <Route
          path="cart"
          element={
            <Shopping
              products={productsCart}
              onDecrementUnit={handleDecrementUnit}
              onIncrementUnit={handleAddCart}
            />
          }
        />
        <Route path="checkout" element={<Checkout />} />
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
  );
}

export default App;
