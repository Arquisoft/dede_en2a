import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import * as api from "../../api/api";
import * as carriersApi from "../../api/carriersApi";
import Checkout from "../../components/checkout/Checkout";
import * as computDistanceHelper from "../../helpers/ComputeDistanceHelper";
import * as solidHelper from "../../helpers/SolidHelper";
import {
  rates, shippingMethods, testAddress, testCartItems,
  user
} from "../../helpers/TestHelper";
import { Address, Rate } from "../../shared/shareddtypes";

const arrayAddresses: Address[] = [testAddress];

test("Checkout renders correctly", async () => {
  //Mock the implementation of the getAddressesFromPod function
  jest
    .spyOn(solidHelper, "getAddressesFromPod")
    .mockImplementation((webId: string) => {
      return Promise.resolve(arrayAddresses);
    });

  //Mock the implementation of the getUser function
  jest.spyOn(api, "getUser").mockImplementation((email: String) => {
    return Promise.resolve(user);
  });

  jest
    .spyOn(computDistanceHelper, "obtainShippingMethods")
    .mockImplementation(
      (
        destAddress: Address
      ): Promise<computDistanceHelper.ShippingMethodType[]> => {
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
      <Router>
        <Checkout
          productsInCart={testCartItems}
          handleDeleteCart={() => {}}
          webId={"https://test.webId.com"}
          sendNotification={() => {}}
        />
      </Router>
    );
  });

  //Check the title is rendered
  expect(screen.getByText("Checkout")).toBeInTheDocument();

  //Check the address is rendered
  expect(screen.getByText("Test street - Test code")).toBeInTheDocument();

  //Select the first address
  await act(async () => {
    fireEvent.click(screen.getByTestId("Test street"));
  });

  //Click on the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("next-button"));
  });

  //Check the shipping method is rendered
  expect(screen.getByText("Standard shipping")).toBeInTheDocument();

  //Click on the back button
  await act(async () => {
    fireEvent.click(screen.getByTestId("back-button"));
  });

  //Check the address is rendered
  expect(screen.getByText("Test street - Test code")).toBeInTheDocument();

  //Select the first address
  await act(async () => {
    fireEvent.click(screen.getByTestId("Test street"));
  });

  //Click on the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("next-button"));
  });

  //Check the shipping method is rendered
  expect(screen.getByText("Standard shipping")).toBeInTheDocument();

  //Select the standard shipping method
  await act(async () => {
    fireEvent.click(screen.getByTestId("Standard shipping"));
  });

  //Check that the carriers selection is rendered
  expect(screen.getByText("Carriers Selection")).toBeInTheDocument();

  //Select the first carrier
  await act(async () => {
    fireEvent.click(screen.getByText("Test carrier 1 - 10.00 €"));
  });

  //Click the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("next-button"));
  });

  //Check the delivery map is rendered
  expect(screen.getByText("Delivery")).toBeInTheDocument();

  //Click the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("next-button"));
  });

  //Check the review is rendered
  expect(screen.getByText("Order summary")).toBeInTheDocument();
});
