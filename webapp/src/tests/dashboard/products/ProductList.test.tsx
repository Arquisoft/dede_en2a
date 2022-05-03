import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import * as api from "../../../api/api";
import ProductList from "../../../components/dashboard/products/ProductList";
import { testProducts } from "../../../helpers/TestHelper";
import { Product } from "../../../shared/shareddtypes";

//Test that the product list is rendered correctly
test("ProductList renders correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(testProducts));

  await act(async () => {
    render(
      <Router>
        <ProductList role="admin" />
      </Router>
    );
  });

  //Check that the title is renderd correctly
  expect(screen.getByText("Listing of all the products")).toBeInTheDocument();

  //Check that the table headers are rendered correctly
  expect(screen.getByText("Product")).toBeInTheDocument();
  expect(screen.getByText("Name")).toBeInTheDocument();
  expect(screen.getByText("Description")).toBeInTheDocument();
  expect(screen.getByText("Price")).toBeInTheDocument();
  expect(screen.getByText("Stock")).toBeInTheDocument();
});

//Test that the add button redirects to /add
test("ProductList add button redirects to /add", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(testProducts));

  await act(async () => {
    render(
      <Router>
        <ProductList role="admin" />
      </Router>
    );
  });

  //Check that the add button redirects to /add
  expect(screen.getByTestId("add-product")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("add-product"));

  //Check that the location is the correct
  expect(window.location.pathname).toBe("/dashboard/products/add");
});

//Test that the update button redirects to /update
test("ProductList edit button redirects to /update", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(testProducts));

  await act(async () => {
    render(
      <Router>
        <ProductList role="admin" />
      </Router>
    );
  });

  //Check that the add button redirects to /add
  expect(screen.getByTestId("edit-product")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("edit-product"));

  //Check that the location is the correct
  expect(window.location.pathname).toBe("/dashboard/products/update");
});

//Test that the delete button redirects to /delete
test("ProductList edit button redirects to /delete", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(testProducts));

  await act(async () => {
    render(
      <Router>
        <ProductList role="admin" />
      </Router>
    );
  });

  //Check that the add button redirects to /add
  expect(screen.getByTestId("delete-product")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("delete-product"));

  //Check that the location is the correct
  expect(window.location.pathname).toBe("/dashboard/products/delete");
});
