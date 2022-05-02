import { render, fireEvent, act, screen } from "@testing-library/react";
import TotalOrdersChart from "../../../components/dashboard/charts/TotalOrdersChart";
import { Order, Product } from "../../../shared/shareddtypes";
import * as api from "../../../api/api";

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

test("TotalOrdersChart renders", async () => {
  jest
    .spyOn(api, "getOrdersForUser")
    .mockImplementation(() => Promise.resolve(testOrders));

  await act(async () => {
    render(<TotalOrdersChart webId={"https://webid.com"} role={"admin"} />);
  });

  //Check the title is rendered
  expect(screen.getByText("Orders")).toBeInTheDocument();

  //Check that there are 2 orders
  expect(screen.getByText("2")).toBeInTheDocument();
});
