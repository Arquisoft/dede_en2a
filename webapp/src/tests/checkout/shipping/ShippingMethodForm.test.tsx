import { act, fireEvent, screen, render } from "@testing-library/react";
import ShippingMethodForm from "../../../components/checkout/shipping/ShippingMethodForm";
import * as computeDistanceHelper from "../../../helpers/ComputeDistanceHelper";
import { Address } from "../../../shared/shareddtypes";

const testsAddress: Address = {
  street: "Test street",
  postalCode: "Test code",
  locality: "Test locality",
  region: "Test region",
};

test("ShippingMethodForm renders correctly", async () => {
  jest
    .spyOn(computeDistanceHelper, "obtainShippingMethods")
    .mockImplementation((destAddress: Address) => {
      return Promise.resolve([
        {
          title: "Standard shipping",
          subtitle: "The fastest shipping method we have!",
          price: "Select",
        },
        {
          title: "Pick UP",
          subtitle: "The cheapest method on earth!",
          price: "0 €",
        },
      ]);
    });

  let setShippingMethod = jest.fn();
  let handleNext = jest.fn();

  await act(async () => {
    render(
      <ShippingMethodForm
        shippingMethod={""}
        setShippingMethod={setShippingMethod}
        address={testsAddress}
        handleNext={handleNext}
      />
    );
  });
  expect(screen.getByText("Shipping method")).toBeInTheDocument();

  expect(screen.getByText("Standard shipping")).toBeInTheDocument();
  expect(screen.getByText("Pick UP")).toBeInTheDocument();

  //Select the first option
  await act(async () => {
    fireEvent.click(screen.getByTestId("Standard shipping"));
  });

  expect(setShippingMethod).toHaveBeenCalled();
  expect(handleNext).toHaveBeenCalled();
});
