import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import * as api from "../api/api";
import Shop from "../components/shop/Shop";
import { CartItem, Product } from "../shared/shareddtypes";

const testProducts: Product[] = [
  {
    code: "01",
    name: "Test product 1",
    description: "Test product 1 description",
    price: 100,
    stock: 10,
    image: "01.png",
    category: "Decoration",
    weight: 1,
  },
  {
    code: "02",
    name: "Test product 2",
    description: "Test product 2 description",
    price: 200,
    stock: 20,
    image: "02.png",
    category: "Clothes",
    weight: 2,
  },
];

const testCartItems: CartItem[] = [
  {
    product: testProducts[0],
    amount: 1,
  },
  {
    product: testProducts[1],
    amount: 2,
  },
];

test("Shop renders correctly", async () => {
  jest
    .spyOn(api, "getProducts")
    .mockImplementation(() => Promise.resolve(testProducts));

  await act(async () => {
    render(
      <Router>
        <Shop
          productsInCart={testCartItems}
          refreshShop={() => {
            return Promise.resolve(testProducts);
          }}
          addToCart={() => {}}
        />
      </Router>
    );
  });

  //Check that the products are rendered
  expect(screen.getByText(testProducts[0].name)).toBeInTheDocument();
  expect(screen.getByText(testProducts[1].name)).toBeInTheDocument();

  await act(() => {
    fireEvent.change(document.querySelector("input[name='search']")!, {
      target: { value: "Test product 1" },
    });
  });

  //Check that the first product is rendered
  expect(screen.getByText(testProducts[0].name)).toBeInTheDocument();

  //Reset the search
  await act(() => {
    fireEvent.change(document.querySelector("input[name='search']")!, {
      target: { value: "" },
    });
  });
});
