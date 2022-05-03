import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ShoppingCart from "../../components/cart/ShoppingCart";
import { testCartItems } from '../../helpers/TestHelper';
import { CartItem } from "../../shared/shareddtypes";

//Test for the ShoppingCart component, receives a list of cart items and it is rendered properly.
test("A list of two cart items is rendered", async () => {


  const { getByText } = render(
    <Router>
      <ShoppingCart
        productsInCart={testCartItems}
        totalUnitsInCart={2}
        addToCart={() => {}}
        removeFromCart={() => {}}
        webId="https://example.com/profile/card#me"
      />
    </Router>
  );

  //Check that the shopping cart title is rendered
  expect(getByText("Shopping cart")).toBeInTheDocument();
  //Check that the buttons continue shopping and checkout are rendered
  expect(getByText("Continue shopping")).toBeInTheDocument();
  expect(getByText("Proceed to checkout")).toBeInTheDocument();

  //Check that the total price is rendered
  expect(getByText("Total Price - 500€")).toBeInTheDocument();

  //Check that if we click the checkout button, it navigates to the checkout page
  fireEvent.click(getByText("Proceed to checkout"));
  expect(window.location.pathname).toBe("/checkout");
});

//Test for the ShoppingCart component, receives an empty list of cart items and it is rendered properly.
test("An empty list of cart items is rendered", async () => {
  const cart: CartItem[] = [];

  const { getByText } = render(
    <Router>
      <ShoppingCart
        productsInCart={cart}
        totalUnitsInCart={0}
        addToCart={() => {}}
        removeFromCart={() => {}}
        webId=""
      />
    </Router>
  );

  //Check that the shopping cart title is rendered
  expect(getByText("Shopping cart is empty 🤨")).toBeInTheDocument();
  //Check that the featured products are rendered
  expect(getByText("Our featured products")).toBeInTheDocument();
});
