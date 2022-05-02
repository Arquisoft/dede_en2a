import { BrowserRouter as Router } from "react-router-dom";
import Orders from "../../../components/dashboard/orders/OrderList";
import { Order, Product } from "../../../shared/shareddtypes";
import { render, fireEvent, act, screen } from "@testing-library/react";
import * as api from "../../../api/api";
import * as solidHelper from "../../../helpers/SolidHelper";

const testProducts: Product[] = [
  {
    code: "01",
    name: "Test product 1",
    description: "Test product 1 description",
    price: 100,
    stock: 1,
    image: "",
    category: "Test category",
    weight: 1,
  },
  {
    code: "02",
    name: "Test product 2",
    description: "Test product 2 description",
    price: 200,
    stock: 2,
    image: "",
    category: "Test category",
    weight: 2,
  },
];

const testOrders: Order[] = [
  {
    code: "Testordercode",
    webId: "https://test.webid.com",
    address: "Test address",
    date: new Date("25-04-2022"),
    products: testProducts,
    subtotalPrice: 100,
    shippingPrice: 10,
    totalPrice: 110,
    receivedDate: new Date("25-04-2022"),
  },
  {
    code: "Test order code 2",
    webId: "https://test.webid.com",
    address: "Test address 1",
    date: new Date("25-04-2022"),
    products: testProducts,
    subtotalPrice: 200,
    shippingPrice: 20,
    totalPrice: 220,
    receivedDate: new Date("20-06-2022"),
  },
];

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
