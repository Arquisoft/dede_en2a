import { act, fireEvent, render, screen } from "@testing-library/react";
import EditAddressDialog from "../../../components/dashboard/account/EditAddressDialog";
import * as solidHelper from "../../../helpers/SolidHelper";
import { testsAddresses } from "../../../helpers/TestHelper";

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
      addressToEdit={testsAddresses[0]}
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
  fireEvent.change(document.querySelector("input[name='postalCode']")!, {
    target: { value: "33210" },
  });

  //Change the locality
  fireEvent.change(document.querySelector("input[name='city']")!, {
    target: { value: "New city" },
  });
  //Change the region
  fireEvent.change(document.querySelector("input[name='region']")!, {
    target: { value: "New region" },
  });

  //Change the country
  fireEvent.change(document.querySelector("input[name='country']")!, {
    target: { value: "New country" },
  });

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
