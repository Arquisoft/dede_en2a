import { act, fireEvent, render, screen } from "@testing-library/react";
import * as carriersApi from "../../api/carriersApi";
import ShippingMethod from "../../components/checkout/ShippingMethod";
import * as computeDistanceHelper from "../../helpers/ComputeDistanceHelper";
import { ShippingMethodType } from "../../helpers/ComputeDistanceHelper";
import { rates, shippingMethods, testAddress, testCartItems } from '../../helpers/TestHelper';
import { Address, Rate } from "../../shared/shareddtypes";

test("ShippingMethod renders correctly selecting Standard Shipping", async () => {
  jest
    .spyOn(computeDistanceHelper, "obtainShippingMethods")
    .mockImplementation(
      (destAddress: Address): Promise<ShippingMethodType[]> => {
        return Promise.resolve(shippingMethods);
      }
    );

  jest
    .spyOn(carriersApi, "getRates")
    .mockImplementation(
      (weight: number, postalCode: string): Promise<Rate[]> => {
        return Promise.resolve(rates);
      }
    );

  await act(async () => {
    render(
      <ShippingMethod
        address={testAddress}
        setAddress={() => {}}
        costs={0}
        setCosts={() => {}}
        handleBack={() => {}}
        handleNext={() => {}}
        cart={testCartItems}
        setDays={jest.fn()}
      />
    );
  });

  //Check that the title is rendered
  expect(screen.getByText("Shipping method")).toBeInTheDocument();

  //Select the first option
  await act(async () => {
    fireEvent.click(screen.getByTestId("Standard shipping"));
  });

  //Click the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("next-button"));
  });

  //Check that the title is rendered
  expect(screen.getByText("Carriers Selection")).toBeInTheDocument();

  //Select the first carrier
  await act(async () => {
    fireEvent.click(screen.getByText("Test carrier 1 - 10.00 €"));
  });

  //Click the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("next-button"));
  });

  expect(screen.getByText("Delivery")).toBeInTheDocument();
});

test("ShippingMethod renders correctly selecting Pick UP", async () => {
  jest
    .spyOn(computeDistanceHelper, "obtainShippingMethods")
    .mockImplementation(
      (destAddress: Address): Promise<ShippingMethodType[]> => {
        return Promise.resolve(shippingMethods);
      }
    );

  await act(async () => {
    render(
      <ShippingMethod
        address={testAddress}
        setAddress={() => {}}
        costs={0}
        setCosts={() => {}}
        handleBack={() => {}}
        handleNext={() => {}}
        cart={testCartItems}
        setDays={jest.fn()}
      />
    );
  });

  //Check that the title is rendered
  expect(screen.getByText("Shipping method")).toBeInTheDocument();

  //Select the first option
  await act(async () => {
    fireEvent.click(screen.getByTestId("Pick UP"));
  });

  //Click the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("next-button"));
  });

  //Check that the title is rendered
  expect(screen.getByText("Pick UP locations")).toBeInTheDocument();
});

test("Back button works", async () => {
  jest
    .spyOn(computeDistanceHelper, "obtainShippingMethods")
    .mockImplementation(
      (destAddress: Address): Promise<ShippingMethodType[]> => {
        return Promise.resolve(shippingMethods);
      }
    );

  jest
    .spyOn(carriersApi, "getRates")
    .mockImplementation(
      (weight: number, postalCode: string): Promise<Rate[]> => {
        return Promise.resolve(rates);
      }
    );
  await act(async () => {
    render(
      <ShippingMethod
        address={testAddress}
        setAddress={() => {}}
        costs={0}
        setCosts={() => {}}
        handleBack={() => {}}
        handleNext={() => {}}
        cart={testCartItems}
        setDays={jest.fn()}
      />
    );
  });

  //Check that the title is rendered
  expect(screen.getByText("Shipping method")).toBeInTheDocument();

  //Select the first option
  await act(async () => {
    fireEvent.click(screen.getByTestId("Standard shipping"));
  });

  //Click the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("next-button"));
  });

  //Check that the title is rendered
  expect(screen.getByText("Carriers Selection")).toBeInTheDocument();

  //Click the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("back-button"));
  });

  //Check that the title is rendered
  expect(screen.getByText("Shipping method")).toBeInTheDocument();
});
