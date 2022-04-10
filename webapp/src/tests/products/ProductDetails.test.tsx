import { fireEvent, render } from "@testing-library/react";
import ProductDetails from "../../components/products/ProductDetails";
import { Product } from "../../shared/shareddtypes";

//Test that the product details page renders correctly
test("Renders product details page", () => {
  const product: Product = {
    code: "9999",
    name: "Test Product",
    description: "Test Product Description",
    price: 9.99,
    stock: 15,
    image: "",
    category: 'Electronics'
  };

  const { getByText, getAllByText } = render(
    <ProductDetails product={product} cartItems={[]} onAdd={() => {}} />
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
  const product: Product = {
    code: "9999",
    name: "Test Product",
    description: "Test Product Description",
    price: 9.99,
    stock: 15,
    image: "",
    category: 'Electronics'
  };

  const onAdd = jest.fn();

  const { getByText } = render(
    <ProductDetails product={product} cartItems={[]} onAdd={onAdd} />
  );

  //Click the add button
  fireEvent.click(getByText("Add product to cart"));

  //Check that the add function was called
  expect(onAdd).toHaveBeenCalledTimes(1);
});
