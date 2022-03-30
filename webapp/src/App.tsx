import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "./components/navigation/NavBar";
import DedeApp from "./components/DedeApp";
import Home from "./components/Home";
import Shop from "./components/Shop";
import ShoppingCart from "./components/cart/ShoppingCart";
import SignIn from "./components/register/SignIn";
import SignUp from "./components/register/SignUp";
import Checkout from "./components/checkout/Checkout";
import ProductDetails from "./components/products/ProductDetails";
import OrderDetails from "./components/dashboard/orders/OrderDetails";
import OrderList from "./components/dashboard/orders/OrderList";
import ProductList from "./components/dashboard/products/ProductList";
import Dashboard from "./components/dashboard/Dashboard";
import UploadProduct from "./components/dashboard/products/UploadProduct";
import DeleteProduct from "./components/dashboard/products/DeleteProduct";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { grey, lightBlue } from "@mui/material/colors";

import { getProducts, getUser } from "./api/api";
import {
  CartItem,
  NotificationType,
  Product,
  User,
} from "./shared/shareddtypes";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import DashboardContent from "./components/dashboard/DashboardContent";

function App(): JSX.Element {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCart, setProductsCart] = useState<CartItem[]>([]);
  const [totalUnitsInCart, setTotalUnitsInCart] = useState<number>(Number());
  const [notification, setNotification] = useState<NotificationType>({
    severity: "success",
    message: "",
  });

  const [userRole, setUserRole] = useState<string>("");

  const createShop = async () => {
    const dbProducts: Product[] = await getProducts(); // and obtain the products
    setProducts(dbProducts);
    if (userRole === "" && localStorage.getItem("user.email") != null) {
      const user: User = await getUser(localStorage.getItem("user.email") + "");
      setUserRole(user.role);
    }
  };

  const setCurrentUser = (user: User) => {
    localStorage.setItem("user.email", user.email);
    localStorage.setItem("user.role", user.role);
    setNotificationStatus(true);
    setNotification({
      severity: "success",
      message: "Welcome to DeDe application " + user.name,
    });
    setUserRole(user.role);
  };

  const logCurrentUserOut = () => {
    localStorage.removeItem("user.email");
    localStorage.removeItem("user.role");
    localStorage.removeItem("token");
    setNotificationStatus(true);
    setNotification({
      severity: "success",
      message: "You signed out correctly. See you soon!",
    });
    setUserRole("");
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

  const handleDeleteCart = () => {
    setProductsCart([]);
    setTotalUnitsInCart(0);
    localStorage.setItem("cart", JSON.stringify([]));
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

  const themeString = (b: boolean) => (b ? "dark" : "light");

  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // palette values for light mode
            primary: { main: lightBlue[600] },
            secondary: { main: lightBlue[800] },
            background: {
              default: grey[50],
              paper: grey[200],
              card: grey[400],
            },
            text: {
              primary: grey[900],
              secondary: grey[800],
            },
          }
        : {
            // palette values for dark mode
            primary: { main: lightBlue[600] },
            secondary: { main: lightBlue[800] },
            background: {
              default: grey[900],
              paper: grey[800],
              card: grey[700],
            },
            text: {
              primary: "#fff",
              secondary: grey[500],
            },
          }),
    },
  });

  // We get the users browser prefered theme.
  let initialTheme: boolean = useMediaQuery("(prefers-color-scheme: dark)");

  if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", String(initialTheme));
  } else {
    initialTheme = localStorage.getItem("theme") === "true";
  }

  const [mode, setMode] = React.useState<PaletteMode>(
    themeString(!initialTheme)
  );

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleDarkMode = () => {
    setMode(themeString(mode === "light"));
    localStorage.setItem("theme", String(mode === "dark"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PayPalScriptProvider
        options={{
          "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID!,
          currency: "EUR",
        }}
      >
        <Router>
          <NavBar
            totalUnitsInCart={totalUnitsInCart}
            logCurrentUserOut={logCurrentUserOut}
            changeTheme={toggleDarkMode}
            initialState={mode === "dark"}
            userRole={userRole}
          />
          <Routes>
            <Route path="/" element={<DedeApp />}>
              <Route index element={<Home />} />
              <Route
                path="shop"
                element={
                  <Shop
                    products={products}
                    cartProducts={productsCart}
                    onAdd={handleAddCart}
                  />
                }
              />
              <Route
                path="cart"
                element={
                  <ShoppingCart
                    products={productsCart}
                    totalUnitsInCart={totalUnitsInCart}
                    userEmail={localStorage.getItem("user.email")}
                    onDecrementUnit={handleDecrementUnit}
                    onIncrementUnit={handleAddCart}
                  />
                }
              />
              <Route
                path="checkout"
                element={
                  <Checkout
                    productsCart={productsCart.slice()}
                    userEmail={localStorage.getItem("user.email")}
                    deleteCart={handleDeleteCart}
                  />
                }
              />
              <Route
                path="sign-in"
                element={<SignIn setCurrentUser={setCurrentUser} />}
              />
              <Route
                path="sign-up"
                element={<SignUp setCurrentUser={setCurrentUser} />}
              />
              <Route
                path="product/:id"
                element={
                  <ProductDetails
                    product={null as any}
                    cartItems={productsCart}
                    onAdd={handleAddCart}
                  />
                }
              />
            </Route>
            <Route path="dashboard" element={<Dashboard />}>
              <Route
                index
                element={
                  <DashboardContent
                    userEmail={localStorage.getItem("user.email")}
                  />
                }
              />
              <Route
                path="orders"
                element={
                  <OrderList userEmail={localStorage.getItem("user.email")} />
                }
              />
              <Route path="order/:code" element={<OrderDetails />} />
              <Route path="products" element={<ProductList />} />
              <Route
                path="products/add"
                element={<UploadProduct createShop={createShop} />}
              />
              <Route
                path="products/delete"
                element={
                  <DeleteProduct products={products} createShop={createShop} />
                }
              />
            </Route>
          </Routes>

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
    </ThemeProvider>
  );
}

export default App;
