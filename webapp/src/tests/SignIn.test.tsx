import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SignIn from "../components/userManagement/SignIn";

test("SignIn renders correctly", async () => {
  await act(async () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );
  });

  //Check that the sign in form is rendered
  expect(screen.getByText("Sign in")).toBeInTheDocument();

  fireEvent.mouseDown(screen.getAllByRole("button")[0]);
  const listbox = within(screen.getByRole("listbox"));
  fireEvent.click(listbox.getByText("SOLID community"));

  //Check that the submit button is rendered
  expect(screen.getByText("Sign In")).toBeInTheDocument();

  //Click the submit button
  fireEvent.click(screen.getByText("Sign In"));
});
