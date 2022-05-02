import { render, fireEvent, act, screen } from "@testing-library/react";
import AccountDetails from "../../../components/dashboard/account/AccountDetails";
import { Address } from "../../../shared/shareddtypes";
import * as solidHelper from "../../../helpers/SolidHelper";

const testsAddresses: Address[] = [
  {
    street: "Test street",
    postalCode: "Test code",
    locality: "Test locality",
    region: "Test region",
  },
];

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
});

test("Edit dialog oppens when edit button is clicked", async () => {
  jest
    .spyOn(solidHelper, "getAddressesFromPod")
    .mockImplementation((webId: string) => {
      return Promise.resolve(testsAddresses);
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
});
