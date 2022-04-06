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
import { getProducts, getUser } from "./api/api";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "./App.css";

export default function App(): JSX.Element {
  // Some variables to perform calculations in an easier way
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // React.useState
  const [products, setProducts] = React.useState<Product[]>([]); // We store the whole set of products of the APP
  const [productsCart, setProductsCart] = React.useState<CartItem[]>([]); // We store the products that are IN the cart
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

  const createShop = async () => {
    // TODO: move to a helper
    const dbProducts: Product[] = await getProducts(); // and obtain the products
    setProducts(dbProducts);
    if (userRole === "" && localStorage.getItem("user.email") != null) {
      const user: User = await getUser(localStorage.getItem("user.email") + "");
      setUserRole(user.role);
    }
  };

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

  const handleAddCart = (product: Product) => {
    // TODO: move to the same helper as createSHOP
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
    // TODO: move the same helper as above
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

  React.useEffect(() => {
    // We establish the stored color mode as the active one: if the user reloads we have to remember the preferences
    if (localStorage.getItem("mode") === null)
      localStorage.setItem("mode", mode);
    // In case we have stored a theme: set the actual mode to the user preference
    else setMode(localStorage.getItem("mode") === "light" ? "light" : "dark");

    // TODO: add the SOLID thing
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
              <Route path="sign-in" element={<SignIn />} />
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
            <Route path="dashboard" element={<DashboardOutlet />}>
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
