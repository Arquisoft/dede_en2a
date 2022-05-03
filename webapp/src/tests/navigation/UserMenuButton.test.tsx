import { fireEvent, render, act, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UserMenuButton from "../../components/navigation/UserMenuButton";
import * as solidHelper from "../../helpers/SolidHelper";

test("UserMenuButton renders correctly", async () => {
  jest
    .spyOn(solidHelper, "getNameFromPod")
    .mockImplementation(() => Promise.resolve("Test user"));

  await act(async () => {
    render(
      <Router>
        <UserMenuButton
          logCurrentUserOut={() => {}}
          webId={"https://webid.com"}
        />
      </Router>
    );
  });

  fireEvent.click(screen.getByTestId("user-button"));

  expect(screen.getByText("Test user")).toBeInTheDocument();

  expect(screen.getByText("Dashboard")).toBeInTheDocument();

  expect(screen.getByText("Log-out")).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(screen.getByText("Log-out"));
  });

  //Check that the location is /
  expect(window.location.pathname).toBe("/");
});

test("UserMenuButton renders correctly sign-in", async () => {
  jest
    .spyOn(solidHelper, "getNameFromPod")
    .mockImplementation(() => Promise.resolve("Test user"));

  await act(async () => {
    render(
      <Router>
        <UserMenuButton logCurrentUserOut={() => {}} webId={undefined} />
      </Router>
    );
  });

  expect(screen.getByText("Sign-In")).toBeInTheDocument();
});
