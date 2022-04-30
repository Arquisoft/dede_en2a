import { act, fireEvent, screen, render } from "@testing-library/react";
import ShippingAddress from "../../components/checkout/ShippingAddress";
import * as solidHelper from "../../helpers/SolidHelper";
import * as api from "../../api/api";
import { User, Address } from "../../shared/shareddtypes";

const testsAddresses: Address[] = [
  {
    street: "Test street",
    postalCode: "Test code",
    locality: "Test locality",
    region: "Test region",
  },
];

//Check that the ShippingAddress component renders correctly
test("ShippingAddress renders correctly", async () => {
  let user: User = {
    webId: "https://example.org/profile/card#me",
    role: "user",
    isVerified: true,
  };

  //Mock the implementation of the getAddressesFromPod function
  jest
    .spyOn(solidHelper, "getAddressesFromPod")
    .mockImplementation((webId: string) => {
      return Promise.resolve(testsAddresses);
    });

  //Mock the implementation of the getUser function
  jest.spyOn(api, "getUser").mockImplementation((email: String) => {
    return Promise.resolve(user);
  });

  let handleNext = jest.fn();

  let getByText: any;
  //Render the component with await act
  await act(async () => {
    getByText = render(
      <ShippingAddress
        address={{}}
        setAddress={() => {}}
        webId={user.webId}
        handleNext={handleNext}
      />
    ).getByText;
  });

  //Check that the street address is rendered
  expect(getByText("Test street - Test code")).toBeInTheDocument();

  //Check that the next button is rendered
  expect(getByText("Next")).toBeInTheDocument();

  //Check that next button is disabled because no address has been chosen
  expect(screen.getByTestId("next-button")).toBeDisabled();

  //Choose an address
  fireEvent.click(screen.getByTestId("Test street"));

  //Check that next button is enabled
  expect(screen.getByTestId("next-button")).not.toBeDisabled();

  //Click on the next button
  await act(async () => {
    fireEvent.click(screen.getByTestId("next-button"));
  });

  expect(handleNext).toHaveBeenCalled();
});
