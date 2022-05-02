import { act, fireEvent, render, screen } from "@testing-library/react";
import * as carriersApi from "../../../api/carriersApi";
import CarriersRatesForm from "../../../components/checkout/shipping/CarriersRatesForm";
import { Address, CartItem, Product, Rate } from "../../../shared/shareddtypes";

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

test("CarriersRatesForm renders correctly", async () => {
  //Mock the implemenation of the getRates function of carriers api
  jest
    .spyOn(carriersApi, "getRates")
    .mockImplementation(
      (weight: number, postalCode: string): Promise<Rate[]> => {
        return Promise.resolve(rates);
      }
    );

  let setCarrierSelected = jest.fn();
  let setCosts = jest.fn();
  let setDays = jest.fn();

  await act(async () => {
    render(
      <CarriersRatesForm
        setCarrierSelected={setCarrierSelected}
        setCosts={setCosts}
        address={testsAddress}
        price={0}
        cart={testCartItems}
        setDays={setDays}
      />
    );
  });

  //Check the title
  expect(screen.getByText("Carriers Selection")).toBeInTheDocument();

  //Check the carriers rates are rendered
  expect(screen.getByText("Test carrier 1 - 10.00 €")).toBeInTheDocument();
  expect(screen.getByText("Test carrier 2 - 20.00 €")).toBeInTheDocument();

  //Select the first carrier
  fireEvent.click(screen.getByText("Test carrier 1 - 10.00 €"));

  //Check the setCarrierSelected function is called
  expect(setCarrierSelected).toHaveBeenCalledWith(true);

  //Check the setCosts function is called
  expect(setCosts).toHaveBeenCalledWith(10);
});
