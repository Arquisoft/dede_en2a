import { act, fireEvent, render, screen } from "@testing-library/react";
import AccountDetails from "../../../components/dashboard/account/AccountDetails";
import * as solidHelper from "../../../helpers/SolidHelper";
import { testsAddresses } from "../../../helpers/TestHelper";

test("AccountDetails renders correctly", async () => {
  jest
    .spyOn(solidHelper, "getAddressesFromPod")
    .mockImplementation((webId: string) => {
      return Promise.resolve(testsAddresses);
    });

  await act(async () => {
    render(<AccountDetails webId={"https://example.org/profile/card#me"} />);
  });

  //Check that the title is rendered
  expect(screen.getByText("Your addresses")).toBeInTheDocument();

  //Check that the addresses are rendered
  expect(screen.getByText("Test street")).toBeInTheDocument();
});

test("Remove dialog oppens when remove button is clicked", async () => {
  jest
    .spyOn(solidHelper, "getAddressesFromPod")
    .mockImplementation((webId: string) => {
      return Promise.resolve(testsAddresses);
    });

  jest.spyOn(solidHelper, "deleteAddressFromPod").mockImplementation(() => {
    return Promise.resolve({} as any);
  });

  await act(async () => {
    render(<AccountDetails webId={"https://example.org/profile/card#me"} />);
  });

  //Check that the remove button is rendered
  expect(screen.getByText("Remove")).toBeInTheDocument();

  //Click the button
  fireEvent.click(screen.getByText("Remove"));

  //Check that the dialog is rendered
  expect(
    screen.getByText(
      "Are you sure you want to delete this address from your POD?"
    )
  ).toBeInTheDocument();

  //Click on the yes button
  await act(async () => {
    fireEvent.click(screen.getByText("Yes"));
  });

  //Check the notification is rendered
  expect(
    screen.getByText("The address has been removed from your POD!")
  ).toBeInTheDocument();
});

test("Edit dialog oppens when edit button is clicked", async () => {
  jest
    .spyOn(solidHelper, "getAddressesFromPod")
    .mockImplementation((webId: string) => {
      return Promise.resolve(testsAddresses);
    });

  jest.spyOn(solidHelper, "editAddressFromPod").mockImplementation(() => {
    return Promise.resolve({} as any);
  });

  await act(async () => {
    render(<AccountDetails webId={"https://example.org/profile/card#me"} />);
  });

  //Check that the remove button is rendered
  expect(screen.getByText("Edit")).toBeInTheDocument();

  //Click the button
  fireEvent.click(screen.getByText("Edit"));

  //Check that the dialog is rendered
  expect(
    screen.getByText(
      "Here you can edit your personal information regarding this address"
    )
  ).toBeInTheDocument();

  //Fill the form
  fireEvent.change(document.querySelector("input[name='street']")!, {
    target: { value: "New street" },
  });

  fireEvent.change(document.querySelector("input[name='postalCode']")!, {
    target: { value: "33210" },
  });

  fireEvent.change(document.querySelector("input[name='city']")!, {
    target: { value: "New city" },
  });

  fireEvent.change(document.querySelector("input[name='region']")!, {
    target: { value: "New region" },
  });

  fireEvent.change(document.querySelector("input[name='country']")!, {
    target: { value: "New country" },
  });

  //Click on the save button
  await act(async () => {
    fireEvent.click(screen.getByText("Modify my information"));
  });

  //Check the notification is rendered
  expect(
    screen.getByText("We have edited the address in your POD!")
  ).toBeInTheDocument();
});

test("Add dialog oppens when add button is clicked", async () => {
  jest
    .spyOn(solidHelper, "getAddressesFromPod")
    .mockImplementation((webId: string) => {
      return Promise.resolve(testsAddresses);
    });

  jest.spyOn(solidHelper, "addAddressToPod").mockImplementation(() => {
    return Promise.resolve({} as any);
  });

  await act(async () => {
    render(<AccountDetails webId={"https://example.org/profile/card#me"} />);
  });

  //Check that the remove button is rendered
  expect(screen.getByText("Add address")).toBeInTheDocument();

  //Click the button
  fireEvent.click(screen.getByText("Add address"));

  //Check that the dialog is rendered
  expect(
    screen.getByText("Fill the form in order you to add a new address!")
  ).toBeInTheDocument();

  //Fill the form
  fireEvent.change(document.querySelector("input[name='street']")!, {
    target: { value: "New street" },
  });

  fireEvent.change(document.querySelector("input[name='postalCode']")!, {
    target: { value: "33210" },
  });

  fireEvent.change(document.querySelector("input[name='city']")!, {
    target: { value: "New city" },
  });

  fireEvent.change(document.querySelector("input[name='region']")!, {
    target: { value: "New region" },
  });

  fireEvent.change(document.querySelector("input[name='country']")!, {
    target: { value: "New country" },
  });

  //Click on the save button
  await act(async () => {
    fireEvent.click(screen.getByText("Save my information"));
  });

  //Check the notification is rendered
  expect(
    screen.getByText("The provided address has been saved in your POD!")
  ).toBeInTheDocument();
});
