import { act, fireEvent, screen, render } from "@testing-library/react";
import ShippingRouteMap from "../../../components/checkout/shipping/ShippingRouteMap";
import * as computeDistanceHelper from "../../../helpers/ComputeDistanceHelper";
import { Address } from "../../../shared/shareddtypes";

const testsAddress: Address = {
  street: "Test street",
  postalCode: "Test code",
  locality: "Test locality",
  region: "Test region",
};

test("ShippingRouteMap renders correctly", async () => {
  jest
    .spyOn(computeDistanceHelper, "getCoordinatesFromAddress")
    .mockImplementation((destAddress: String) => {
      return Promise.resolve("36.23423,-5.23423");
    });

  await act(async () => {
    render(<ShippingRouteMap address={testsAddress} costs={100} />);
  });

  expect(screen.getByText("Delivery")).toBeInTheDocument();
});
