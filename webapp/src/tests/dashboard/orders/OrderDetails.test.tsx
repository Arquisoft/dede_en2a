import { BrowserRouter as Router } from "react-router-dom";
import { Order, Product } from "../../../shared/shareddtypes";
import { render, fireEvent, act, screen } from "@testing-library/react";
import OrderDetails from "../../../components/dashboard/orders/OrderDetails";
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

const testOrder: Order = {
  code: "Testordercode",
  webId: "https://test.webid.com",
  address: "Test address",
  date: new Date("25-04-2022"),
  products: testProducts,
  subtotalPrice: 100,
  shippingPrice: 10,
  totalPrice: 110,
  receivedDate: new Date("25-04-2022"),
};

//test renders details page
test("renders details", async () => {
  jest
    .spyOn(api, "getOrderByCode")
    .mockImplementation(() => Promise.resolve(testOrder));

  await act(async () => {
    render(
      <Router>
        <OrderDetails webId={"http://testid.com"} />
      </Router>
    );
  });

  //Check the title is rendered
  expect(screen.getByText("Order details")).toBeInTheDocument();

  //Check the products are rendered
  expect(screen.getByText("Test product 1")).toBeInTheDocument();
  expect(screen.getByText("Test product 2")).toBeInTheDocument();

  //Check the subtotal is rendered
  expect(screen.getByText("Subtotal:")).toBeInTheDocument();
  expect(screen.getByText("100 €")).toBeInTheDocument();

  //Check the shipping is rendered
  expect(screen.getByText("Shipping costs:")).toBeInTheDocument();
  expect(screen.getByText("10 €")).toBeInTheDocument();

  //Check the total is rendered
  expect(screen.getByText("Total:")).toBeInTheDocument();
  expect(screen.getByText("110 €")).toBeInTheDocument();

  //Check the address is rendered
  expect(screen.getByText("Shipping address:")).toBeInTheDocument();
  expect(screen.getByText("Test address")).toBeInTheDocument();
});
