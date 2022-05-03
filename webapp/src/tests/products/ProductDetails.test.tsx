import { fireEvent, render } from "@testing-library/react";
import ProductDetails from "../../components/shop/products/ProductDetails";
import { testProducts } from "../../helpers/TestHelper";

const product = testProducts[0];
product.stock=100

//Test that the product details page renders correctly
test("Renders product details page", () => {
  const { getByText, getAllByText } = render(
    <ProductDetails product={product} addToCart={() => {}} webId={""} />
  );

  //Check that the name, the description and the prices are rendered
  expect(getAllByText(product.name).length).toEqual(2); //The name and the route name
  expect(getByText(product.description)).toBeInTheDocument();
  expect(getByText(product.price.toString() + "€")).toBeInTheDocument();

  //Check that the stock alert is rendered correctly
  expect(getByText("Stock available!")).toBeInTheDocument();

  //Check that the add button is rendered correctly
  expect(getByText("Add product to cart")).toBeInTheDocument();
});

//Test that the add button works correctly
test("Adds product to cart", () => {
  const onAdd = jest.fn();

  const { getByText } = render(
    <ProductDetails product={product} addToCart={onAdd} webId={""} />
  );

  //Click the add button
  fireEvent.click(getByText("Add product to cart"));

  //Check that the add function was called
  expect(onAdd).toHaveBeenCalledTimes(1);
});
