import { act, render, screen } from "@testing-library/react";
import Review from "../../components/checkout/Review";
import { testAddress, testCartItems } from '../../helpers/TestHelper';

test("Review renders correctly", async () => {
  await act(() => {
    render(
      <Review
        productsCart={testCartItems}
        shippingCosts={10}
        handleReset={() => {}}
        handleNext={() => {}}
        address={testAddress}
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
