import { fireEvent, render } from "@testing-library/react";
import ShoppingCartTable from "../../components/cart/ShoppingCartTable";
import { CartItem } from "../../shared/shareddtypes";

//Test for the ShoppingCartTable component, receives a list of cart items and it is rendered properly.
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
        category: "Electronics",
        weight: 1,
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
        category: "Clothes",
        weight: 1,
      },
      amount: 2,
    },
  ];

  const { getByText } = render(
    <ShoppingCartTable
      productsInCart={cart}
      totalUnitsInCart={2}
      addToCart={() => {}}
      removeFromCart={() => {}}
    />
  );

  //Check that the products and the units are rendered
  expect(getByText("Producto 1")).toBeInTheDocument();
  expect(getByText("1")).toBeInTheDocument();

  expect(getByText("Producto 2")).toBeInTheDocument();
  expect(getByText("2")).toBeInTheDocument();
});

//Test for the ShoppingCartTable component, receives an empty list of cart items and it is rendered properly.
test("An empty list of cart items is rendered", async () => {
  const cart: CartItem[] = [];

  const { getByText } = render(
    <ShoppingCartTable
      productsInCart={cart}
      totalUnitsInCart={0}
      addToCart={() => {}}
      removeFromCart={() => {}}
    />
  );

  expect(getByText("Shopping cart is empty :(")).toBeInTheDocument();
});

//Test for the ShoppingCartTable component, receives a list of one cart item with amount 0 and it is not rendered.
test("A list of one cart item with amount 0 is not rendered", async () => {
  const cart: CartItem[] = [
    {
      product: {
        code: "9999",
        name: "Producto 1",
        description: "Descripcion Producto",
        price: 10,
        stock: 20,
        image: "",
        category: "Electronics",
        weight: 1,
      },
      amount: 0,
    },
  ];

  const { queryByText } = render(
    <ShoppingCartTable
      productsInCart={cart}
      totalUnitsInCart={1}
      addToCart={() => {}}
      removeFromCart={() => {}}
    />
  );

  expect(queryByText("Producto 1")).not.toBeInTheDocument();
  expect(queryByText("0")).not.toBeInTheDocument();
});

//The increment button is disabled when the amount is equal or higher to the stock
test("The increment button is disabled when the amount is equal or higher to the stock", async () => {
  const cart: CartItem[] = [
    {
      product: {
        code: "9999",
        name: "Producto 1",
        description: "Descripcion Producto",
        price: 10,
        stock: 20,
        image: "",
        category: "Electronics",
        weight: 1,
      },
      amount: 20,
    },
  ];

  const { getByText } = render(
    <ShoppingCartTable
      productsInCart={cart}
      totalUnitsInCart={1}
      addToCart={() => {}}
      removeFromCart={() => {}}
    />
  );

  expect(getByText("+")).toBeDisabled();
});

//Test that the increment and decrement buttons work well
test("Increment and decrement buttons work well.", async () => {
  const cart: CartItem[] = [
    {
      product: {
        code: "9999",
        name: "Producto 1",
        description: "Descripcion Producto",
        price: 10,
        stock: 20,
        image: "",
        category: "Electronics",
        weight: 1,
      },
      amount: 1,
    },
  ];

  const onIncrementUnit = jest.fn();
  const onDecrementUnit = jest.fn();

  const { getByText } = render(
    <ShoppingCartTable
      productsInCart={cart}
      totalUnitsInCart={1}
      addToCart={() => {}}
      removeFromCart={() => {}}
    />
  );

  fireEvent.click(getByText("+"));
  expect(onIncrementUnit).toHaveBeenCalled();

  fireEvent.click(getByText("-"));
  expect(onDecrementUnit).toHaveBeenCalled();
});
