import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProductList from "../../components/products/ProductList";
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
      category: 'Electronics'
    },
    {
      code: "9998",
      name: "Producto",
      description: "Descripcion Producto",
      price: 15,
      stock: 10,
      image: "",
      category: 'Electronics'
    },
  ];

  const { getAllByText } = render(
    <Router>
      <ProductList
        products={products}
        productsInCart={[]}
        addToCart={() => {}}
      />
    </Router>
  );

  expect(getAllByText(products[0].name).length).toEqual(2);
  expect(getAllByText(products[0].description).length).toEqual(2);
});
