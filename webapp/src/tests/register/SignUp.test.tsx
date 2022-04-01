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

//Test the sign up with empty webID
test("Sign up with empty webID", async () => {
  const { getByText, getByTestId, container } = render(
    <Router>
      <SignUp setCurrentUser={() => {}} />
    </Router>
  );

  const inputWebID = container.querySelector('input[name="webId"]')!;
  const inputPass = container.querySelector('input[name="password"]')!;
  const inputRepeatPass = container.querySelector('input[name="repPassword"]')!;

  //Fill the form with empty webID
  fireEvent.change(inputWebID, { target: { value: "" } });
  fireEvent.change(inputPass, { target: { value: "password" } });
  fireEvent.change(inputRepeatPass, { target: { value: "password" } });

  //Click on the submit button
  fireEvent.click(getByTestId("signup-button"));

  //Check that the error message is shown
  expect(getByText("A valid WebID must be provided")).toBeInTheDocument();
});

//Test the sign up with not correct password
test("Sign up with not correct password", async () => {
  const { getByText, getByTestId, container } = render(
    <Router>
      <SignUp setCurrentUser={() => {}} />
    </Router>
  );

  const inputWebID = container.querySelector('input[name="webId"]')!;
  const inputPass = container.querySelector('input[name="password"]')!;
  const inputRepeatPass = container.querySelector('input[name="repPassword"]')!;

  //Fill the form with not correct password
  fireEvent.change(inputWebID, { target: { value: "https://test.com/" } });
  fireEvent.change(inputPass, { target: { value: "password" } });
  fireEvent.change(inputRepeatPass, { target: { value: "password" } });

  //Click on the submit button
  fireEvent.click(getByTestId("signup-button"));

  //Check that the error message is shown
  expect(
    getByText("Passwords must have: Length 6, lowercase, uppercase and digits")
  ).toBeInTheDocument();
});

//Test the sign up with password not matching
test("Sign up with password not matching", async () => {
  const { getByText, getByTestId, container } = render(
    <Router>
      <SignUp setCurrentUser={() => {}} />
    </Router>
  );

  const inputWebID = container.querySelector('input[name="webId"]')!;
  const inputPass = container.querySelector('input[name="password"]')!;
  const inputRepeatPass = container.querySelector('input[name="repPassword"]')!;

  //Fill the form with password not matching
  fireEvent.change(inputWebID, { target: { value: "https://test.com/" } });
  fireEvent.change(inputPass, { target: { value: "password" } });
  fireEvent.change(inputRepeatPass, { target: { value: "password1" } });

  //Click on the submit button
  fireEvent.click(getByTestId("signup-button"));

  //Check that the error message is shown
  expect(getByText("The passwords do not match")).toBeInTheDocument();
});
