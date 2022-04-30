import { act, fireEvent, screen, render } from "@testing-library/react";
import Checkout from "../../components/checkout/Checkout";
import * as solidHelper from "../../helpers/SolidHelper";
import * as api from "../../api/api";
import * as carriersApi from "../../api/carriersApi";
import * as computDistanceHelper from "../../helpers/ComputeDistanceHelper";
import {
  User,
  Rate,
  Address,
  CartItem,
  Product,
} from "../../shared/shareddtypes";

const testsAddress: Address = {
  street: "Test street",
  postalCode: "Test code",
  locality: "Test locality",
  region: "Test region",
};

const arrayAddresses: Address[] = [testsAddress];

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

const rates: Rate[] = [
  {
    name: "Test carrier 1",
    price: 10,
    time: 24,
  },
  {
    name: "Test carrier 2",
    price: 20,
    time: 48,
  },
];

const user: User = {
  webId: "https://example.org/profile/card#me",
  role: "user",
  isVerified: true,
};

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
      <Checkout
        productsInCart={testCartItems}
        handleDeleteCart={() => {}}
        webId={"https://test.webId.com"}
        sendNotification={() => {}}
      />
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
