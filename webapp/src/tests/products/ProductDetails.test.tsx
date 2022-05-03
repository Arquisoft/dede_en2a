import { act, fireEvent, render, screen } from "@testing-library/react";
import * as api from "../../api/api";
import ProductDetails from "../../components/shop/products/ProductDetails";
import { testProducts } from "../../helpers/TestHelper";

const product = testProducts[0];
product.stock = 100;

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

  //Check that the dial works correctly but webid is empty so error notification is rendered
  fireEvent.click(screen.getByTestId("product-speed-dial"));
  fireEvent.click(screen.getByTestId("Review item"));

  expect(
    screen.getByText("To add a review you need to log in first!")
  ).toBeInTheDocument();
});

//Test that the dial system works well
test("Dial systems works", async () => {
  jest
    .spyOn(api, "getReviewsByCodeAndWebId")
    .mockImplementation(() => Promise.resolve([]));

  jest
    .spyOn(api, "getReviewsByCode")
    .mockImplementation(() => Promise.resolve([]));

  jest
    .spyOn(api, "getProduct")
    .mockImplementation(() => Promise.resolve(product));

  const onAdd = jest.fn();

  await act(async () => {
    render(
      <ProductDetails
        product={product}
        addToCart={onAdd}
        webId={"https://webid.com"}
      />
    );
  });

  //Check that the dial for adding works correctly
  fireEvent.click(screen.getByTestId("product-speed-dial"));
  fireEvent.click(screen.getByTestId("Add to Shopping Cart"));

  //Check that the add function was called
  expect(onAdd).toHaveBeenCalledTimes(1);

  //Check that the dial for review works correctly
  fireEvent.click(screen.getByTestId("product-speed-dial"));
  fireEvent.click(screen.getByTestId("Review item"));

  //Check that the review dialog is rendered correctly
  expect(
    screen.getByText("In this dialog you can give us a review of the product!")
  ).toBeInTheDocument();

  //Simulate the close
  fireEvent.keyDown(
    screen.getByText("In this dialog you can give us a review of the product!"),
    {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    }
  );

  //Check that the dial for share works correctly
  fireEvent.click(screen.getByTestId("product-speed-dial"));
  fireEvent.click(screen.getByTestId("Share"));

  //Check that the share dialog is rendered correctly
  expect(
    screen.getByText("Share this item or save it for later use")
  ).toBeInTheDocument();

  //Simulate the close
  fireEvent.keyDown(
    screen.getByText("Share this item or save it for later use"),
    {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    }
  );
});
