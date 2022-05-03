import { act, render, screen } from "@testing-library/react";
import * as api from "../../../api/api";
import TotalReceivedOrdersChart from "../../../components/dashboard/charts/TotalReceivedOrdersChart";
import { testOrders } from "../../../helpers/TestHelper";

test("TotalReceivedOrdersChart renders", async () => {
  testOrders[0].receivedDate = new Date(1651385698936);
  
  jest
    .spyOn(api, "getOrdersForUser")
    .mockImplementation(() => Promise.resolve(testOrders));

  await act(async () => {
    render(
      <TotalReceivedOrdersChart webId={"https://webid.com"} role={"admin"} />
    );
  });

  //Check the title is rendered
  expect(screen.getByText("Received orders")).toBeInTheDocument();

  //Check that there are 2 orders
  expect(screen.getByText("1")).toBeInTheDocument();
});
