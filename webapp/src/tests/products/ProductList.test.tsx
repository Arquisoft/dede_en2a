import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProductList from "../../components/shop/products/ProductList";
import { testProducts } from "../../helpers/TestHelper";

test("A list of products is rendered", async () => {
 
  let addToCart = jest.fn();
  const { getAllByText } = render(
    <Router>
      <ProductList
        products={testProducts}
        productsInCart={[]}
        addToCart={addToCart}
      />
    </Router>
  );

  expect(getAllByText(testProducts[0].name).length).toEqual(1);
  expect(getAllByText(testProducts[0].description).length).toEqual(1);

  fireEvent.click(getAllByText("Add product")[0]);

  expect(addToCart).toHaveBeenCalledTimes(1);
});
