import { render, fireEvent, act, screen } from "@testing-library/react";
import ProductList from "../../../components/dashboard/products/ProductList";
import { BrowserRouter as Router } from "react-router-dom";
import { Product } from "../../../shared/shareddtypes";
import * as api from "../../../api/api";

const products: Product[] = [
  {
    code: "01",
    name: "testName",
    description: "testDescription",
    price: 10,
    stock: 10,
    image: "9999.png",
    category: "Clothes",
    weight: 1,
  },
  {
    code: "02",
    name: "testName2",
    description: "testDescription2",
    price: 20,
    stock: 20,
    image: "8888.png",
    category: "Decoration",
    weight: 2,
  },
];

//Test that the product list is rendered correctly
test("ProductList renders correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(products));

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
    .mockImplementation((): Promise<Product[]> => Promise.resolve(products));

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
    .mockImplementation((): Promise<Product[]> => Promise.resolve(products));

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
    .mockImplementation((): Promise<Product[]> => Promise.resolve(products));

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
