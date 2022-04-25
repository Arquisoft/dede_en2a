import { render, fireEvent, act, screen } from "@testing-library/react";
import DeleteProduct from "../../../components/dashboard/products/DeleteProduct";
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
  },
  {
    code: "02",
    name: "testName2",
    description: "testDescription2",
    price: 20,
    stock: 20,
    image: "8888.png",
    category: "Decoration",
  },
];

//Test that the DeleteProduct component renders correctly
test("DeleteProduct renders correctly", () => {
  const { getByText } = render(
    <DeleteProduct
      products={products}
      webId="http://test.com"
      role="admin"
      refreshShop={() => {}}
    />
  );

  //Check that the title is rendered correctly
  expect(getByText("Delete a product")).toBeInTheDocument();

  //Check that the form is rendered correctly
  expect(getByText("Product code")).toBeInTheDocument();
  expect(getByText("Product name")).toBeInTheDocument();
  expect(getByText("Product description")).toBeInTheDocument();
  expect(getByText("Product price")).toBeInTheDocument();
  expect(getByText("Product stock")).toBeInTheDocument();
  expect(getByText("Product category")).toBeInTheDocument();
});
