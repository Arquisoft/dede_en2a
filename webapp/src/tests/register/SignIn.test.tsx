import { act, fireEvent, render } from "@testing-library/react";
import SignIn from "../../components/userManagement/SignIn";
import { User } from "../../shared/shareddtypes";
import { BrowserRouter as Router } from "react-router-dom";
import * as api from "../../api/api";

//Test that the sign in form is rendered correctly
test("SignIn component renders correctly", () => {
  const { getByText } = render(
    <Router>
      <SignIn />
    </Router>
  );

  //Check that the sign in title is rendered
  expect(getByText("Sign in")).toBeInTheDocument();

  //Check that the email input is rendered
  expect(getByText("Email Address")).toBeInTheDocument();
  //Check that the password is rendered correctly
  expect(getByText("Password")).toBeInTheDocument();
});

//Test that the sign in with incorrect values not found
test("Sign in with incorrect values not found", async () => {
  let user: User = {
    name: "Test",
    email: "test@email.com",
    webId: "https://test.com/",
    password: "password",
    role: "user",
    verified: true,
  } as User;

  jest
    .spyOn(api, "checkUser")
    .mockImplementation(
      (email: String, password: String): Promise<boolean> =>
        Promise.resolve(false)
    );

  jest
    .spyOn(api, "getUser")
    .mockImplementation(
      (email: String): Promise<User> => Promise.resolve(user)
    );

  const { getByText, container, getByTestId } = render(
    <Router>
      <SignIn />
    </Router>
  );

  fireEvent.change(container.querySelector('input[name="email"]')!, {
    target: { value: "test@email.com" },
  });
  fireEvent.change(container.querySelector('input[name="password"]')!, {
    target: { value: "password" },
  });

  await act(async () => {
    fireEvent.click(getByTestId("sign-in-button"));
  });

  //Check that the error message is rendered
  expect(getByText("Invalid email or password")).toBeInTheDocument();
});

//Test sign in with correct values but no verified user
test("Sign in with incorrect values not found", async () => {
  let user: User = {
    name: "Test",
    email: "test@email.com",
    webId: "https://test.com/",
    password: "password",
    role: "user",
    verified: false,
  } as User;

  jest
    .spyOn(api, "checkUser")
    .mockImplementation(
      (email: String, password: String): Promise<boolean> =>
        Promise.resolve(false)
    );

  jest
    .spyOn(api, "getUser")
    .mockImplementation(
      (email: String): Promise<User> => Promise.resolve(user)
    );

  const { getByText, container, getByTestId } = render(
    <Router>
      <SignIn />
    </Router>
  );

  fireEvent.change(container.querySelector('input[name="email"]')!, {
    target: { value: "test@email.com" },
  });
  fireEvent.change(container.querySelector('input[name="password"]')!, {
    target: { value: "password" },
  });

  await act(async () => {
    fireEvent.click(getByTestId("sign-in-button"));
  });

  //Check that the error message is rendered
  expect(
    getByText("You have to verify your account before logging in")
  ).toBeInTheDocument();
});

//Test the sign in with empty email
test("Sign in with empty email", async () => {
  const { getByText, container, getByTestId } = render(
    <Router>
      <SignIn />
    </Router>
  );

  const inputEmail = container.querySelector('input[name="email"]')!;
  const inputPass = container.querySelector('input[name="password"]')!;
  fireEvent.change(inputEmail, { target: { value: "" } });
  fireEvent.change(inputPass, { target: { value: "password" } });

  //Click the sign in button
  await act(async () => {
    fireEvent.click(getByTestId("sign-in-button"));
  });

  //Check that the error message is rendered
  expect(getByText("Email is empty")).toBeInTheDocument();
});

//Test the sign in with empty password
test("Sign in with empty password", async () => {
  const { getByText, container, getByTestId } = render(
    <Router>
      <SignIn />
    </Router>
  );

  const inputEmail = container.querySelector('input[name="email"]')!;
  const inputPass = container.querySelector('input[name="password"]')!;
  fireEvent.change(inputEmail, { target: { value: "test@email.com" } });
  fireEvent.change(inputPass, { target: { value: "" } });

  //Click the sign in button
  await act(async () => {
    fireEvent.click(getByTestId("sign-in-button"));
  });

  //Check that the error message is rendered
  expect(getByText("Password is empty")).toBeInTheDocument();
});
