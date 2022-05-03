import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import * as api from "../../../api/api";
import Orders from "../../../components/dashboard/orders/OrderList";
import * as solidHelper from "../../../helpers/SolidHelper";
import { testOrders } from "../../../helpers/TestHelper";

testOrders[0].subtotalPrice = 100;
testOrders[0].shippingPrice = 10;
testOrders[0].totalPrice = 110;

testOrders[1].subtotalPrice = 200;
testOrders[1].shippingPrice = 20;
testOrders[1].totalPrice = 210;

test("OrderList renders correctly", async () => {
  jest
    .spyOn(solidHelper, "getNameFromPod")
    .mockImplementation((webID: string) => Promise.resolve("Test user"));

  jest
    .spyOn(api, "getOrdersForUser")
    .mockImplementation(() => Promise.resolve(testOrders));

  await act(async () => {
    render(
      <Router>
        <Orders
          webId="aHR0cHM6Ly9wYWJsbzI2OC5zb2xpZGNvbW11bml0eS5uZXQvcHJvZmlsZS9jYXJkI21l"
          role="user"
        />
        ;
      </Router>
    );
  });

  //Check that the title is rendered
  expect(screen.getByText("Your orders, Test user")).toBeInTheDocument();

  //Check that the headers are renderd
  expect(screen.getByText("Order date")).toBeInTheDocument();
  expect(screen.getByText("Subtotal")).toBeInTheDocument();
  expect(screen.getByText("Shipping price")).toBeInTheDocument();
  expect(screen.getByText("Price")).toBeInTheDocument();
  expect(screen.getByText("Status")).toBeInTheDocument();
  expect(screen.getByText("Show details")).toBeInTheDocument();

  //Check that the orders are rendered
  expect(screen.getByText("100 €")).toBeInTheDocument();
  expect(screen.getByText("200 €")).toBeInTheDocument();

  //Check that if we click on the details button, we are redirected to the details page
  fireEvent.click(screen.getByTestId("button-Testordercode"));
  expect(window.location.pathname).toBe("/dashboard/order/" + "Testordercode");
});

test("OrderList renders for admin", async () => {
  jest
    .spyOn(solidHelper, "getNameFromPod")
    .mockImplementation((webID: string) => Promise.resolve("Test user"));

  jest
    .spyOn(api, "getOrdersForUser")
    .mockImplementation(() => Promise.resolve(testOrders));

  await act(async () => {
    render(
      <Router>
        <Orders webId="https://test.webid.com" role="admin" />;
      </Router>
    );
  });

  //Check that the title is rendered
  expect(screen.getByText("Welcome back Admin!")).toBeInTheDocument();

  //Check that the headers are renderd
  expect(screen.getByText("Order date")).toBeInTheDocument();
  expect(screen.getByText("Subtotal")).toBeInTheDocument();
  expect(screen.getByText("Shipping price")).toBeInTheDocument();
  expect(screen.getByText("Price")).toBeInTheDocument();
  expect(screen.getByText("Status")).toBeInTheDocument();
  expect(screen.getByText("Show details")).toBeInTheDocument();
});
