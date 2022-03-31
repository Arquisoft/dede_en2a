import { act, fireEvent, render } from "@testing-library/react";
import SignUp from "../../components/register/SignUp";
import { User } from "../../shared/shareddtypes";
import { BrowserRouter as Router } from "react-router-dom";

//Test that the sign up form is rendered correctly
test("SignUp component renders correctly", () => {
  const { getByText, getByTestId } = render(
    <Router>
      <SignUp setCurrentUser={() => {}} />
    </Router>
  );

  //Check that the sign up title is rendered
  expect(getByText("Sign up")).toBeInTheDocument();

  //Check that the email input is rendered
  expect(getByText("Web ID")).toBeInTheDocument();

  //Check that the password is rendered correctly
  expect(getByText("Password")).toBeInTheDocument();

  //Check that the repeat password is rendered correctly
  expect(getByText("Repeat password")).toBeInTheDocument();

  //Check that the submit button is rendered correctly
  expect(getByTestId("signup-button")).toBeInTheDocument();
});
