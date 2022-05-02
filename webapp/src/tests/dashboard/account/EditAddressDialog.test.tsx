import {
  render,
  fireEvent,
  act,
  screen,
  prettyDOM,
} from "@testing-library/react";
import EditAddressDialog from "../../../components/dashboard/account/EditAddressDialog";
import { Address } from "../../../shared/shareddtypes";
import * as solidHelper from "../../../helpers/SolidHelper";

const testsAddress: Address = {
  street: "Test street",
  postalCode: "33209",
  locality: "Test locality",
  region: "Test region",
  url: "https://test.com",
};

test("EditAddressDialog renders correctly", async () => {
  jest.spyOn(solidHelper, "editAddressFromPod").mockImplementation(() => {
    return Promise.resolve({} as any);
  });

  let setRefreshComponent = jest.fn();
  let handleClose = jest.fn();
  render(
    <EditAddressDialog
      open={true}
      webId={"https://test.webId.com"}
      addressToEdit={testsAddress}
      handleOpen={() => {}}
      handleClose={handleClose}
      sendNotification={() => {}}
      setRefreshComponent={setRefreshComponent}
    />
  );

  expect(
    screen.getByText(
      "Here you can edit your personal information regarding this address"
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "You are editing the actual address on your POD. No personal information will be registered in our systems."
    )
  ).toBeInTheDocument();

  //Change the street address
  fireEvent.change(document.querySelector("input[value='Test street']")!, {
    target: { value: "New street" },
  });

  //Check the street address has been changed
  expect(
    (document.getElementsByName("street")[0] as HTMLInputElement).value
  ).toBe("New street");

  //Change the postal code
  await act(async () => {
    fireEvent.change(document.querySelector("input[name='postalCode']")!, {
      target: { value: "33210" },
    });
  });

  //Check the postal code has been changed
  expect(
    (document.getElementsByName("postalCode")[0] as HTMLInputElement).value
  ).toBe("33210");

  //Change the locality
  await act(async () => {
    fireEvent.change(document.querySelector("input[name='city']")!, {
      target: { value: "New city" },
    });
  });

  //Check the locality has been changed
  expect(
    (document.getElementsByName("city")[0] as HTMLInputElement).value
  ).toBe("New city");

  //Change the region
  await act(async () => {
    fireEvent.change(document.querySelector("input[name='region']")!, {
      target: { value: "New region" },
    });
  });

  //Check the region has been changed
  expect(
    (document.getElementsByName("region")[0] as HTMLInputElement).value
  ).toBe("New region");

  //Change the country
  await act(async () => {
    fireEvent.change(document.querySelector("input[name='country']")!, {
      target: { value: "New country" },
    });
  });

  //Check the country has been changed
  expect(
    (document.getElementsByName("country")[0] as HTMLInputElement).value
  ).toBe("New country");

  //Check that the save button appears
  expect(screen.getByText("Modify my information")).toBeInTheDocument();

  //Click on the save button
  await act(async () => {
    fireEvent.click(screen.getByText("Modify my information"));
  });

  //Check refreshComponent has been called
  expect(setRefreshComponent).toHaveBeenCalled();

  //Change the mock to give an error
  jest.spyOn(solidHelper, "editAddressFromPod").mockImplementation(() => {
    return Promise.reject({} as any);
  });

  //Click on the save button
  await act(async () => {
    fireEvent.click(screen.getByText("Modify my information"));
  });

  expect(setRefreshComponent).toHaveBeenCalledTimes(1);
});
