import { fireEvent, render, screen, act } from "@testing-library/react";
import ProductDetails from "../../components/shop/products/ProductDetails";
import { Product, Review } from "../../shared/shareddtypes";
import * as api from "../../api/api";

const product: Product = {
  code: "9999",
  name: "Test Product",
  description: "Test Product Description",
  price: 9.99,
  stock: 15,
  image: "",
  category: "Electronics",
  weight: 1,
};

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
test("Adds product to cart", async () => {
  jest
    .spyOn(api, "getReviewsByCodeAndWebId")
    .mockImplementation(() => Promise.resolve([]));

  jest.spyOn(api, "addReview").mockImplementation(() => Promise.resolve(true));

  const onAdd = jest.fn();

  const { getByText } = render(
    <ProductDetails
      product={product}
      addToCart={onAdd}
      webId={"https://webid.com"}
    />
  );

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

  //Check that the review dialog works correctly
  await act(async () => {
    fireEvent.change(document.getElementsByName("comment")[0], {
      target: { value: "New comment" },
    });
  });

  await act(async () => {
    fireEvent.change(document.getElementsByName("rating")[0], {
      target: { value: 3 },
    });
  });

  //Click the confirm button
  await act(async () => {
    fireEvent.click(screen.getByText("Send your Review"));
  });

  //Check if the notification is shown
  expect(screen.getByText("Review added correctly!")).toBeInTheDocument();

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
