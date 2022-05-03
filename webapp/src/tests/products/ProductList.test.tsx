import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProductList from "../../components/shop/products/ProductList";
import { Product } from "../../shared/shareddtypes";

test("A list of products is rendered", async () => {
  const products: Product[] = [
    {
      code: "9999",
      name: "Producto",
      description: "Descripcion Producto",
      price: 10,
      stock: 20,
      image: "",
      category: "Electronics",
      weight: 1,
    },
    {
      code: "9998",
      name: "Producto",
      description: "Descripcion Producto",
      price: 15,
      stock: 10,
      image: "",
      category: "Electronics",
      weight: 1,
    },
  ];

  let addToCart = jest.fn();
  const { getAllByText } = render(
    <Router>
      <ProductList
        products={products}
        productsInCart={[]}
        addToCart={addToCart}
      />
    </Router>
  );

  expect(getAllByText(products[0].name).length).toEqual(2);
  expect(getAllByText(products[0].description).length).toEqual(2);

  fireEvent.click(getAllByText("Add product")[0]);

  expect(addToCart).toHaveBeenCalledTimes(1);
});
