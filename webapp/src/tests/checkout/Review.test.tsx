import { act, fireEvent, screen, render } from "@testing-library/react";
import Review from "../../components/checkout/Review";
import { Address, CartItem, Product } from "../../shared/shareddtypes";

const testsAddress: Address = {
  street: "Test street",
  postalCode: "Test code",
  locality: "Test locality",
  region: "Test region",
};

const testProducts: Product[] = [
  {
    code: "01",
    name: "Test product 1",
    description: "Test product 1 description",
    price: 100,
    stock: 10,
    image: "",
    category: "Test category",
    weight: 1,
  },
  {
    code: "02",
    name: "Test product 2",
    description: "Test product 2 description",
    price: 200,
    stock: 20,
    image: "",
    category: "Test category",
    weight: 2,
  },
];

const testCartItems: CartItem[] = [
  {
    product: testProducts[0],
    amount: 1,
  },
  {
    product: testProducts[1],
    amount: 2,
  },
];

test("Review renders correctly", async () => {
  await act(() => {
    render(
      <Review
        productsCart={testCartItems}
        shippingCosts={10}
        handleReset={() => {}}
        handleNext={() => {}}
        address={testsAddress}
      />
    );
  });

  expect(screen.getByText("Order summary")).toBeInTheDocument();

  //Check the products are renderd correctly
  expect(screen.getByText("Test product 1")).toBeInTheDocument();
  expect(screen.getByText("Test product 2")).toBeInTheDocument();

  //Check the subtotal is correct
  expect(screen.getByText("Subtotal:")).toBeInTheDocument();
  expect(screen.getByText("500 €")).toBeInTheDocument();

  //Check the shipping costs are correct
  expect(screen.getByText("Shipping costs:")).toBeInTheDocument();
  expect(screen.getByText("10 €")).toBeInTheDocument();

  //Check the total is correct
  expect(screen.getByText("Total:")).toBeInTheDocument();
  expect(screen.getByText("510 €")).toBeInTheDocument();

  //Check the address is correct
  expect(screen.getByText("Shipping address:")).toBeInTheDocument();
  expect(
    screen.getByText("Test street, Test code, Test locality, Test region")
  ).toBeInTheDocument();
});
