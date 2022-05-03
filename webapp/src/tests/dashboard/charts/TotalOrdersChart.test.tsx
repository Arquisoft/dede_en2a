import { act, render, screen } from "@testing-library/react";
import * as api from "../../../api/api";
import TotalOrdersChart from "../../../components/dashboard/charts/TotalOrdersChart";
import { testOrders } from "../../../helpers/TestHelper";

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
