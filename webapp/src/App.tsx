import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  CartItem,
  NotificationType,
  Order,
  Product,
  User,
} from "./shared/shareddtypes";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Shopping from "./components/Shopping";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Checkout from "./components/Checkout";
import ProductDetails from "./components/ProductDetails";
import OrderDetails from "./components/OrderDetails";
import OrderList from "./components/OrderList";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { getProducts } from "./api/api";
import "bootstrap/dist/css/bootstrap.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "./App.css";
import { LocalSee } from "@mui/icons-material";
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import {
  amber,
  blue,
  blueGrey,
  deepOrange,
  grey,
  indigo,
  lightBlue,
  yellow,
} from "@mui/material/colors";

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
  const [orders, setOrders] = useState<Order[]>([]); //([{userId:'12', shippingPrice: 23,  totalPrice: 43}]);

  const createShop = async () => {
    const dbProducts: Product[] = await getProducts(); // and obtain the products
    setProducts(dbProducts);
  };

  const setCurrentUser = (user: User) => {
    localStorage.setItem("user.email", user.email);
    setUser(user);
    setNotificationStatus(true);
    setNotification({
      severity: "success",
      message: "Welcome to DeDe application " + user.name,
    });
  };

  const logCurrentUserOut = () => {
    localStorage.removeItem("user.email");
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
    console.log("none -> " + initialTheme);
  } else {
    initialTheme = localStorage.getItem("theme") == "true";
    console.log("already -> " + initialTheme);
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
          "client-id":
            "Ad1H-xmYNu8WPb6jDwiLjirog2e5jA6dylivOrsS5KJ4R_RXt0HOBe7wJ7fuGvMnMDet9RowUTBDAtnV",
          currency: "EUR",
        }}
      >
        <Router>
          <NavBar
            totalUnitsInCart={totalUnitsInCart}
            logCurrentUserOut={logCurrentUserOut}
            changeTheme={toggleDarkMode}
            initialState={mode === "dark"}
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
              element={
                <Checkout
                  productsCart={productsCart.slice()}
                  user={user}
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
                <ProductDetails product={null as any} onAdd={handleAddCart} />
              }
            />
            <Route
              path="orders"
              element={<OrderList userEmail={user?.email} />}
            />
            <Route path="/order/:code" element={<OrderDetails />} />
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
    </ThemeProvider>
  );
}

export default App;
