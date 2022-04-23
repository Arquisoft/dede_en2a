import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ShoppingCart from "../../components/cart/ShoppingCart";
import { CartItem } from "../../shared/shareddtypes";

//Test for the ShoppingCart component, receives a list of cart items and it is rendered properly.
test("A list of two cart items is rendered", async () => {
  const cart: CartItem[] = [
    {
      product: {
        code: "9999",
        name: "Producto 1",
        description: "Descripcion Producto",
        price: 10,
        stock: 20,
        image: "",
        category: 'Electronics'
      },
      amount: 1,
    },
    {
      product: {
        code: "9998",
        name: "Producto 2",
        description: "Descripcion Producto",
        price: 15,
        stock: 10,
        image: "",
        category: 'Clothes'
      },
      amount: 2,
    },
  ];

  const { getByText } = render(
    <Router>
      <ShoppingCart
        productsInCart={cart}
        totalUnitsInCart={2}
        addToCart={() => {}}
        removeFromCart={() => {}}
      />
    </Router>
  );

  //Check that the shopping cart title is rendered
  expect(getByText("Shopping cart")).toBeInTheDocument();
  //Check that the buttons continue shopping and checkout are rendered
  expect(getByText("Continue shopping")).toBeInTheDocument();
  expect(getByText("Proceed to checkout")).toBeInTheDocument();
  //Check that the proceed to checkout button is disabled
  expect(getByText("Proceed to checkout").closest("a")?.className).toContain(
    "disabled"
  );

  //Check that the total price is rendered
  expect(getByText("Total Price - 40€")).toBeInTheDocument();
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
      />
    </Router>
  );

  //Check that the shopping cart title is rendered
  expect(getByText("Shopping cart is empty 🤨")).toBeInTheDocument();
  //Check that the featured products are rendered
  expect(getByText("Our featured products")).toBeInTheDocument();
});
