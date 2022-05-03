import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import * as api from "../api/api";
import Shop from "../components/shop/Shop";
import { testCartItems, testProducts } from "../helpers/TestHelper";



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
