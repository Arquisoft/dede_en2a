import { act, fireEvent, screen, render } from "@testing-library/react";
import ShippingMethod from "../../components/checkout/ShippingMethod";
import * as solidHelper from "../../helpers/SolidHelper";
import * as api from "../../api/api";
import * as computDistanceHelper from "../../helpers/ComputeDistanceHelper";
import { User, Address, CartItem, Product } from "../../shared/shareddtypes";

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

test("ShippingMethod renders correctly", async () => {
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

  //Check that the description is rendered
  expect(
    screen.getByText(
      "Those are the shipping methods we have in our site; feel free to choose any of them:"
    )
  ).toBeInTheDocument();

  //Check that both shipping methods are rendered
  expect(screen.getByText("Standard shipping")).toBeInTheDocument();
  expect(screen.getByText("Pick UP")).toBeInTheDocument();
});
