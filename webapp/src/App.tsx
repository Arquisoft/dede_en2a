import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  createTheme, CssBaseline,
  ThemeProvider, useMediaQuery
} from "@mui/material";
import { AlertColor } from "@mui/material/Alert";

import ShoppingCart from "./components/cart/ShoppingCart";
import Checkout from "./components/checkout/Checkout";
import AccountDetails from "./components/dashboard/account/AccountDetails";
import DashboardContent from "./components/dashboard/DashboardContent";
import OrderDetails from "./components/dashboard/orders/OrderDetails";
import OrderList from "./components/dashboard/orders/OrderList";
import DeleteProduct from "./components/dashboard/products/DeleteProduct";
import ProductList from "./components/dashboard/products/ProductList";
import UploadProduct from "./components/dashboard/products/UploadProduct";
import DashboardOutlet from "./components/DashboardOutlet";
import Home from "./components/home/Home";
import DedeApp from "./components/MainOutlet";
import NotificationAlert from "./components/misc/NotificationAlert";
import NavBar from "./components/navigation/NavBar";
import ProductDetails from "./components/products/ProductDetails";
import RedirectHome from "./components/RedirectHome";
import Shop from "./components/Shop";
import SignIn from "./components/userManagement/SignIn";

import { CartItem, NotificationType, Product } from "./shared/shareddtypes";

import {
  addProductToCart,
  removeProductFromCart
} from "./helpers/ShoppingCartHelper";
import { getNameFromPod } from "./helpers/SolidHelper";

import { addUser, getProducts, getUser } from "./api/api";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "./App.css";

import {
  handleIncomingRedirect,
  logout
} from "@inrupt/solid-client-authn-browser";

export default function App(): JSX.Element {
  // Some variables to perform calculations in an easier way
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // React.useState
  const [products, setProducts] = React.useState<Product[]>([]); // We store the whole set of products of the APP
  const [productsInCart, setProductsInCart] = React.useState<CartItem[]>([]); // We store the products that are IN the cart
  const [totalUnitsInCart, setTotalUnitsInCart] = React.useState(Number()); // We compute the total number of units in the cart
  const [role, setRole] = React.useState("");
  const [webId, setWebId] = React.useState("");
  const [mode, setMode] = React.useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  ); // We establish the actual mode based in the prefered color scheme
  const [notificationStatus, setNotificationStatus] = React.useState(false);
  const [notification, setNotification] = React.useState<NotificationType>({
    severity: "success",
    message: "",
  });

  function sendNotification(severity: AlertColor, message: string) {
    setNotificationStatus(true);
    setNotification({
      severity: severity,
      message: message,
    });
  }

  // We establish a button for us to toggle the actual mode
  const toggleColorMode = () => {
    let modeToChange: "light" | "dark" = mode === "light" ? "dark" : "light";
    setMode(modeToChange);
    localStorage.setItem("mode", modeToChange);
  };

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
    sendNotification("success", "Product added to the cart")
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

  const logCurrentUserOut = () => {
    // We logout from SOLID
    logout();

    // The following has no impact on the logout, it just resets the UI.
    setWebId("");
    setRole("");

    // We send a notification giving the user information
    sendNotification("success", "You signed out correctly. See you soon!");

    // We go to the home page
    document.location.href = "/";
  };

  React.useEffect(() => {
    refreshShop()
    // We establish the stored color mode as the active one: if the user reloads we have to remember the preferences
    if (localStorage.getItem("mode") === null)
      localStorage.setItem("mode", mode);
    // In case we have stored a theme: set the actual mode to the user preference
    else setMode(localStorage.getItem("mode") === "light" ? "light" : "dark");

    // We have to handle just-in-case we are redirected from a SOLID POD provider
    // After redirect, the current URL contains login information.
    handleIncomingRedirect({
      restorePreviousSession: true,
    }).then(
      (info: any) => {
        // We encrypt the webId: for us to query with it
        // If everything is OK
        setWebId(info.webId); // We store user's WebID
        getUser(info.webId).then(
          (user) => {
            if (user === undefined) {
              // If the user is not registered
              addUser(info.webId); // we add the user to the DB
            } else {
              // The user has already been registered in the system
              setRole(user.role); // we update the role of the user
            }

            getNameFromPod(info.webId).then((name: string) => {
              // Inform the user his actual status
              sendNotification("success", `Welcome to DEDE, ${name}!`);
            });
          },
          () => {}
        );
      },
      () => {
        // In case something went wrong
        sendNotification("error", "Something went wrong while logging-in!");
      }
    );

    // Retrieve the cart from the session in case the user refreshes the page
    const sessionCart = localStorage.getItem("cart"); // TODO: check if something can be modified
    if (sessionCart) {
      let cart: CartItem[] = JSON.parse(sessionCart);

      let units: number = 0;
      cart.forEach((cartItem) => (units += cartItem.amount));
      setTotalUnitsInCart(units);
      setProductsInCart(cart); //Set the cart when the componenet is rendered
    } else localStorage.setItem("cart", JSON.stringify([]));
  }, []);

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
            mode={mode}
            toggleColorMode={toggleColorMode}
            webId={webId}
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
                    webId={webId}
                  />
                }
              />
              <Route
                path="checkout"
                element={
                  <Checkout
                    productsInCart={productsInCart}
                    handleDeleteCart={handleDeleteCart}
                    webId={webId}
                    sendNotification={sendNotification}
                  />
                }
              />
              <Route path="sign-in" element={<SignIn webId={webId} />} />
              <Route
                path="product/:id"
                element={
                  <ProductDetails
                    product={null as any}
                    addToCart={addToCart}
                    webId={webId}
                  />
                }
              />
            </Route>
            <Route path="dashboard" element={<DashboardOutlet role={role} />}>
              <Route
                index
                element={<DashboardContent webId={webId} role={role} />}
              />
              <Route
                path="account"
                element={<AccountDetails webId={webId} />}
              />
              <Route
                path="orders"
                element={<OrderList webId={webId} role={"user"} />}
              />
              <Route
                path="order/:code"
                element={<OrderDetails webId={webId} />}
              />
              <Route path="products" element={<ProductList role={role} />} />
              <Route
                path="products/add"
                element={
                  <UploadProduct
                    refreshShop={refreshShop}
                    isForUpdate={false}
                    products={products}
                    webId={webId}
                    role={role}
                  />
                }
              />
              <Route
                path="products/delete"
                element={
                  <DeleteProduct
                    products={products}
                    refreshShop={refreshShop}
                    webId={webId}
                    role={role}
                  />
                }
              />
              <Route
                path="products/update"
                element={
                  <UploadProduct
                    refreshShop={refreshShop}
                    isForUpdate={true}
                    products={products}
                    webId={webId}
                    role={role}
                  />
                }
              />
            </Route>
            <Route path="*" element={<RedirectHome />}></Route>
          </Routes>

          <NotificationAlert
            notification={notification}
            notificationStatus={notificationStatus}
            setNotificationStatus={setNotificationStatus}
          />
        </Router>
      </PayPalScriptProvider>
    </ThemeProvider>
  );
}
