import { act, fireEvent, render, screen } from "@testing-library/react";
import * as carriersApi from "../../../api/carriersApi";
import CarriersRatesForm from "../../../components/checkout/shipping/CarriersRatesForm";
import {
  rates, testAddress,
  testCartItems
} from "../../../helpers/TestHelper";
import { Rate } from "../../../shared/shareddtypes";

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
        address={testAddress}
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
