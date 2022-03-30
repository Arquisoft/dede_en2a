import React from "React";
import { fireEvent, render } from "@testing-library/react";
import ProductList from "../../components/products/ProductList";
import { Product } from "../../shared/shareddtypes";
import { BrowserRouter as Router } from "react-router-dom";

test("A list of products is rendered", async () => {
  const products: Product[] = [
    {
      code: "9999",
      name: "Producto",
      description: "Descripcion Producto",
      price: 10,
      stock: 20,
      image: "",
    },
    {
      code: "9998",
      name: "Producto",
      description: "Descripcion Producto",
      price: 15,
      stock: 10,
      image: "",
    },
  ];

  const { getAllByText } = render(
    <Router>
      <ProductList products={products} cartProducts={[]} OnAddCart={() => {}} />
    </Router>
  );

  expect(getAllByText(products[0].name).length).toEqual(2);
  expect(getAllByText(products[0].description).length).toEqual(2);
});
