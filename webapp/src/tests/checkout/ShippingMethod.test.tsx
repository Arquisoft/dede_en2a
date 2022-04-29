import { act, fireEvent, screen, render } from "@testing-library/react";
import ShippingMethod from "../../components/checkout/ShippingMethod";
import * as carriersApi from "../../api/carriersApi";
import * as computDistanceHelper from "../../helpers/ComputeDistanceHelper";
import { Rate, Address, CartItem, Product } from "../../shared/shareddtypes";

const testAddress: Address = {
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

test("ShippingMethod renders correctly selecting Standard Shipping", async () => {
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
      <ShippingMethod
        address={testAddress}
        setAddress={() => {}}
        costs={0}
        setCosts={() => {}}
        handleBack={() => {}}
        handleNext={() => {}}
        cart={testCartItems}
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
      <ShippingMethod
        address={testAddress}
        setAddress={() => {}}
        costs={0}
        setCosts={() => {}}
        handleBack={() => {}}
        handleNext={() => {}}
        cart={testCartItems}
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
