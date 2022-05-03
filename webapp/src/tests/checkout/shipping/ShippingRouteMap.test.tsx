import { act, render, screen } from "@testing-library/react";
import ShippingRouteMap from "../../../components/checkout/shipping/ShippingRouteMap";
import * as computeDistanceHelper from "../../../helpers/ComputeDistanceHelper";
import { testAddress } from "../../../helpers/TestHelper";

test("ShippingRouteMap renders correctly", async () => {
  jest
    .spyOn(computeDistanceHelper, "getCoordinatesFromAddress")
    .mockImplementation((destAddress: String) => {
      return Promise.resolve("36.23423,-5.23423");
    });

  await act(async () => {
    render(<ShippingRouteMap address={testAddress} costs={100} />);
  });

  expect(screen.getByText("Delivery")).toBeInTheDocument();
});
