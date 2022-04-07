import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  Alert,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";

import ShoppingCart from "./components/cart/ShoppingCart";
import Checkout from "./components/checkout/Checkout";
import DashboardOutlet from "./components/DashboardOutlet";
import DashboardContent from "./components/dashboard/DashboardContent";
import OrderDetails from "./components/dashboard/orders/OrderDetails";
import OrderList from "./components/dashboard/orders/OrderList";
import DeleteProduct from "./components/dashboard/products/DeleteProduct";
import ProductList from "./components/dashboard/products/ProductList";
import UploadProduct from "./components/dashboard/products/UploadProduct";
import DedeApp from "./components/MainOutlet";
import Home from "./components/home/Home";
import NavBar from "./components/navigation/NavBar";
import ProductDetails from "./components/products/ProductDetails";
import SignIn from "./components/userManagement/SignIn";
import Shop from "./components/Shop";

import {
  CartItem,
  NotificationType,
  Product,
  User,
} from "./shared/shareddtypes";
import {
  addProductToCart,
  removeProductFromCart,
} from "./helpers/ShoppingCartHelper";
import { getProducts } from "./api/api";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "./App.css";

export default function App(): JSX.Element {
  // Some variables to perform calculations in an easier way
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // React.useState
  const [products, setProducts] = React.useState<Product[]>([]); // We store the whole set of products of the APP
  const [productsInCart, setProductsInCart] = React.useState<CartItem[]>([]); // We store the products that are IN the cart
  const [totalUnitsInCart, setTotalUnitsInCart] = React.useState(Number()); // We compute the total number of units in the cart
  const [userRole, setUserRole] = React.useState(""); // TODO: probably this could be deleted
  const [mode, setMode] = React.useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  ); // We establish the actual mode based in the prefered color scheme
  const [notificationStatus, setNotificationStatus] = React.useState(false);
  const [notification, setNotification] = React.useState<NotificationType>({
    severity: "success",
    message: "",
  });

  // We establish a button for us to toggle the actual mode
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        localStorage.setItem("mode", mode);
      },
    }),
    []
  );

  // We establish the theme of the site based on the actual preference
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  // We create two functions in order to add and remove products from cart
  const addToCart = (product: Product) => {
    addProductToCart(
      product,
      productsInCart,
      setProductsInCart,
      setTotalUnitsInCart
    );
  };

  const removeFromCart = (product: Product) => {
    removeProductFromCart(
      product,
      productsInCart,
      setProductsInCart,
      setTotalUnitsInCart
    );
  };

  // We have to restore the cart also
  const handleDeleteCart = () => {
    setProductsInCart([]);
    setTotalUnitsInCart(0);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  // We define a function for refreshing the shop itself
  const refreshShop = React.useCallback(async () => {
    // We obtain the products from the Database
    const dbProducts: Product[] = await getProducts();
    setProducts(dbProducts); // and set the products to the state
  }, []);

  const setCurrentUser = (user: User) => {
    // TODO: refactor using SOLID
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
    // TODO: see how to do it with SOLID
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

  React.useEffect(() => {
    // We establish the stored color mode as the active one: if the user reloads we have to remember the preferences
    if (localStorage.getItem("mode") === null)
      localStorage.setItem("mode", mode);
    // In case we have stored a theme: set the actual mode to the user preference
    else setMode(localStorage.getItem("mode") === "light" ? "light" : "dark"); // TODO: make this work

    // TODO: add the SOLID thing

    //Retrive the cart from the session.
    const sessionCart = localStorage.getItem("cart");
    if (sessionCart) {
      let cart: CartItem[] = JSON.parse(sessionCart);

      let units: number = 0;
      cart.forEach((cartItem) => (units += cartItem.amount));
      setTotalUnitsInCart(units);
      setProductsInCart(cart); //Set the cart when the componenet is rendered
    } else localStorage.setItem("cart", JSON.stringify([]));
  }, []);

  return (
    // TODO: refactor the router
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
            userRole={userRole}
            mode={mode}
            toggleColorMode={colorMode.toggleColorMode}
          />
          <Routes>
            <Route path="/" element={<DedeApp />}>
              <Route index element={<Home />} />
              <Route
                path="shop"
                element={
                  <Shop
                    products={products}
                    productsInCart={productsInCart}
                    refreshShop={refreshShop}
                    addToCart={addToCart}
                  />
                }
              />
              <Route
                path="cart"
                element={
                  <ShoppingCart
                    productsInCart={productsInCart}
                    totalUnitsInCart={totalUnitsInCart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              />
              <Route
                path="checkout"
                element={
                  <Checkout
                    productsInCart={productsInCart}
                    handleDeleteCart={handleDeleteCart}
                  />
                }
              />
              <Route path="sign-in" element={<SignIn />} />
              <Route
                path="product/:id"
                element={
                  <ProductDetails product={null as any} addToCart={addToCart} />
                }
              />
            </Route>
            <Route path="dashboard" element={<DashboardOutlet />}>
              <Route index element={<DashboardContent />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="order/:code" element={<OrderDetails />} />
              <Route path="products" element={<ProductList />} />
              <Route
                path="products/add"
                element={<UploadProduct refreshShop={refreshShop} />}
              />
              <Route
                path="products/delete"
                element={
                  <DeleteProduct
                    products={products}
                    refreshShop={refreshShop}
                  />
                }
              />
            </Route>
          </Routes>

          <Snackbar // TODO: try and refactor this
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
