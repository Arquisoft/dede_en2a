import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import * as api from "../../api/api";
import ShippingAddress from "../../components/checkout/ShippingAddress";
import * as solidHelper from "../../helpers/SolidHelper";
import { testAddress } from '../../helpers/TestHelper';
import { User } from "../../shared/shareddtypes";

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
      return Promise.resolve([testAddress]);
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
      <Router>
        <ShippingAddress
          address={{}}
          setAddress={() => {}}
          webId={user.webId}
          handleNext={handleNext}
        />
      </Router>
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
